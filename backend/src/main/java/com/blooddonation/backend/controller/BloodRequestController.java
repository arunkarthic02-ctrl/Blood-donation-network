package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.BloodRequestDto;
import com.blooddonation.backend.entity.BloodRequest;
import com.blooddonation.backend.service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping("/create")
    public BloodRequest createRequest(@RequestBody BloodRequestDto dto) {
        return bloodRequestService.createRequest(dto);
    }

    @GetMapping("/create")
    public List<BloodRequest> getAllRequests() {
        return bloodRequestService.getAllRequests();
    }
}