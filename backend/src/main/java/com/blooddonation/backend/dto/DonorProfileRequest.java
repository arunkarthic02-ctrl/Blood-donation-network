package com.blooddonation.backend.dto;

import lombok.Data;

@Data
public class DonorProfileRequest {
    private Long userId;
    private String bloodGroup;
    private String gender;
    private Double latitude;
    private Double longitude;
}