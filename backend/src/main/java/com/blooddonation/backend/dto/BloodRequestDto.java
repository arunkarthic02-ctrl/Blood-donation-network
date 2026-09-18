package com.blooddonation.backend.dto;

import lombok.Data;

@Data
public class BloodRequestDto {
    private Long patientId;
    private String bloodGroup;
    private Integer unitsNeeded;
    private String urgencyLevel;   // CRITICAL, URGENT, NORMAL
    private String hospitalName;
    private Double latitude;
    private Double longitude;
}