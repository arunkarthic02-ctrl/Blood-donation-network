package com.blooddonation.backend.service;

import com.blooddonation.backend.entity.BloodRequest;
import com.blooddonation.backend.entity.DonorProfile;
import com.blooddonation.backend.repository.BloodRequestRepository;
import com.blooddonation.backend.repository.DonorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private DonorProfileRepository donorProfileRepository;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    private static final Map<String, List<String>> COMPATIBILITY = new HashMap<>();
    static {
        COMPATIBILITY.put("A+",  Arrays.asList("A+", "A-", "O+", "O-"));
        COMPATIBILITY.put("A-",  Arrays.asList("A-", "O-"));
        COMPATIBILITY.put("B+",  Arrays.asList("B+", "B-", "O+", "O-"));
        COMPATIBILITY.put("B-",  Arrays.asList("B-", "O-"));
        COMPATIBILITY.put("AB+", Arrays.asList("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"));
        COMPATIBILITY.put("AB-", Arrays.asList("A-", "B-", "AB-", "O-"));
        COMPATIBILITY.put("O+",  Arrays.asList("O+", "O-"));
        COMPATIBILITY.put("O-",  Arrays.asList("O-"));
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Map<String, Object>> findMatches(Long requestId) {
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String neededGroup = request.getBloodGroup();
        List<String> compatibleGroups = COMPATIBILITY.getOrDefault(neededGroup, new ArrayList<>());

        List<DonorProfile> allAvailable = donorProfileRepository.findAll().stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsAvailable()))
                .filter(d -> compatibleGroups.contains(d.getBloodGroup()))
                .collect(Collectors.toList());

        List<Map<String, Object>> results = new ArrayList<>();

        for (DonorProfile donor : allAvailable) {
            double distance = calculateDistance(
                    request.getLatitude(), request.getLongitude(),
                    donor.getLatitude(), donor.getLongitude()
            );

            double score = 100 - distance;
            if (donor.getBloodGroup().equals(neededGroup)) {
                score += 10;
            }

            Map<String, Object> match = new LinkedHashMap<>();
            match.put("donorId", donor.getId());
            match.put("donorName", donor.getUser().getName());
            match.put("donorPhone", donor.getUser().getPhone());
            match.put("donorBloodGroup", donor.getBloodGroup());
            match.put("distanceKm", Math.round(distance * 100.0) / 100.0);
            match.put("matchScore", Math.round(score * 100.0) / 100.0);

            results.add(match);
        }

        results.sort((a, b) -> Double.compare((Double) b.get("matchScore"), (Double) a.get("matchScore")));

        return results;
    }

    public List<Map<String, Object>> findRequestsForDonor(Long userId) {
        DonorProfile donor = donorProfileRepository.findByUserId(userId);
        if (donor == null) {
            throw new RuntimeException("Donor profile not found");
        }

        List<BloodRequest> pendingRequests = bloodRequestRepository.findByStatus(BloodRequest.RequestStatus.PENDING);

        List<Map<String, Object>> results = new ArrayList<>();

        for (BloodRequest request : pendingRequests) {
            List<String> compatibleDonorGroups = COMPATIBILITY.getOrDefault(request.getBloodGroup(), new ArrayList<>());

            if (compatibleDonorGroups.contains(donor.getBloodGroup())) {
                double distance = calculateDistance(
                        request.getLatitude(), request.getLongitude(),
                        donor.getLatitude(), donor.getLongitude()
                );

                Map<String, Object> match = new LinkedHashMap<>();
                match.put("requestId", request.getId());
                match.put("patientName", request.getPatient().getName());
                match.put("bloodGroup", request.getBloodGroup());
                match.put("unitsNeeded", request.getUnitsNeeded());
                match.put("urgencyLevel", request.getUrgencyLevel());
                match.put("hospitalName", request.getHospitalName());
                match.put("distanceKm", Math.round(distance * 100.0) / 100.0);

                results.add(match);
            }
        }

        results.sort((a, b) -> Double.compare((Double) a.get("distanceKm"), (Double) b.get("distanceKm")));

        return results;
    }
}