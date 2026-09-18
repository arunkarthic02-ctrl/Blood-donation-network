package com.blooddonation.backend.dto;

import lombok.Data;

@Data
public class UserSignupRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;   // "DONOR", "PATIENT", "HOSPITAL", "ADMIN"
}