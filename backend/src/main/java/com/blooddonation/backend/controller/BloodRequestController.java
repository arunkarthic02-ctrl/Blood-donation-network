package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.BloodRequestDto;
import com.blooddonation.backend.entity.BloodRequest;
import com.blooddonation.backend.service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping("/create")
    public ResponseEntity<BloodRequest> createRequest(@RequestBody BloodRequestDto dto) {
        return ResponseEntity.ok(bloodRequestService.createRequest(dto));
    }

    @GetMapping("/create")
    public ResponseEntity<List<BloodRequest>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<BloodRequest>> getRequestsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(bloodRequestService.getRequestsByPatientId(patientId));
    }
}