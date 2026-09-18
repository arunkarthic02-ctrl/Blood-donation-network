package com.blooddonation.backend.controller;

import com.blooddonation.backend.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "*")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/find/{requestId}")
    public List<Map<String, Object>> findMatches(@PathVariable Long requestId) {
        return matchingService.findMatches(requestId);
    }

    @GetMapping("/requests-for-donor/{userId}")
    public List<Map<String, Object>> getRequestsForDonor(@PathVariable Long userId) {
        return matchingService.findRequestsForDonor(userId);
    }
}