package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.DonorProfileRequest;
import com.blooddonation.backend.entity.DonorProfile;
import com.blooddonation.backend.entity.User;
import com.blooddonation.backend.repository.DonorProfileRepository;
import com.blooddonation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DonorProfileService {

    @Autowired
    private DonorProfileRepository donorProfileRepository;

    @Autowired
    private UserRepository userRepository;

    public DonorProfile createProfile(DonorProfileRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        DonorProfile profile = new DonorProfile();
        profile.setUser(user);
        profile.setBloodGroup(request.getBloodGroup());
        profile.setGender(request.getGender());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        profile.setIsAvailable(true);

        return donorProfileRepository.save(profile);
    }
}