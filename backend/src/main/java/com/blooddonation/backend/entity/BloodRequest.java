package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
@Data
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(nullable = false)
    private String bloodGroup;   // e.g. "O+", "AB-"

    @Column(nullable = false)
    private Integer unitsNeeded;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgencyLevel;

    private String hospitalName;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum UrgencyLevel {
        CRITICAL, URGENT, NORMAL
    }

    public enum RequestStatus {
        PENDING, MATCHED, FULFILLED, CANCELLED
    }
}