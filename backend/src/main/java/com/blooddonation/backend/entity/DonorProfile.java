package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "donor_profiles")
@Data
public class DonorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String bloodGroup;

    private LocalDate lastDonationDate;

    private Double latitude;
    private Double longitude;

    private Boolean isAvailable = true;

    @Column(name = "gender")
    private String gender;   // used to calculate eligibility (90 days male / 120 days female)
}