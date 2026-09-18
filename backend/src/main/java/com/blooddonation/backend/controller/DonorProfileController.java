package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.DonorProfileRequest;
import com.blooddonation.backend.entity.DonorProfile;
import com.blooddonation.backend.service.DonorProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class DonorProfileController {

    @Autowired
    private DonorProfileService donorProfileService;

    @PostMapping("/profile")
    public DonorProfile createProfile(@RequestBody DonorProfileRequest request) {
        return donorProfileService.createProfile(request);
    }
}