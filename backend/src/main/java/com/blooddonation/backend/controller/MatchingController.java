package com.blooddonation.backend.controller;

import com.blooddonation.backend.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matching")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/find/{requestId}")
    public ResponseEntity<List<Map<String, Object>>> findMatches(@PathVariable Long requestId) {
        return ResponseEntity.ok(matchingService.findMatches(requestId));
    }

    @GetMapping("/requests-for-donor/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getRequestsForDonor(@PathVariable Long userId) {
        return ResponseEntity.ok(matchingService.findRequestsForDonor(userId));
    }
}