package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.BloodRequestDto;
import com.blooddonation.backend.entity.BloodRequest;
import com.blooddonation.backend.entity.User;
import com.blooddonation.backend.repository.BloodRequestRepository;
import com.blooddonation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public BloodRequest createRequest(BloodRequestDto dto) {
        User patient = userRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        BloodRequest request = new BloodRequest();
        request.setPatient(patient);
        request.setBloodGroup(dto.getBloodGroup());
        request.setUnitsNeeded(dto.getUnitsNeeded());
        request.setUrgencyLevel(BloodRequest.UrgencyLevel.valueOf(dto.getUrgencyLevel().toUpperCase()));
        request.setHospitalName(dto.getHospitalName());
        request.setLatitude(dto.getLatitude());
        request.setLongitude(dto.getLongitude());
        request.setStatus(BloodRequest.RequestStatus.PENDING);

        return bloodRequestRepository.save(request);
    }

    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }
}