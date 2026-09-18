package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByStatus(BloodRequest.RequestStatus status);
    List<BloodRequest> findByBloodGroup(String bloodGroup);
}