package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.DonorProfileRequest;
import com.blooddonation.backend.entity.DonorProfile;
import com.blooddonation.backend.service.DonorProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donors")
public class DonorProfileController {

    @Autowired
    private DonorProfileService donorProfileService;

    @PostMapping("/profile")
    public ResponseEntity<DonorProfile> createProfile(@RequestBody DonorProfileRequest request) {
        return ResponseEntity.ok(donorProfileService.createProfile(request));
    }

    @GetMapping("/profile/user/{userId}")
    public ResponseEntity<DonorProfile> getProfileByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(donorProfileService.getProfileByUserId(userId));
    }
}