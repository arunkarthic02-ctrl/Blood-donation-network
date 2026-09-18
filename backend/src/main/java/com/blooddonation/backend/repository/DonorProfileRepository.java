package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.DonorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonorProfileRepository extends JpaRepository<DonorProfile, Long> {
    List<DonorProfile> findByBloodGroupAndIsAvailable(String bloodGroup, Boolean isAvailable);
    DonorProfile findByUserId(Long userId);
}