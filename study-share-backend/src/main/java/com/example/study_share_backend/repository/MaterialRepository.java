package com.example.study_share_backend.repository;

import com.example.study_share_backend.model.Material;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MaterialRepository extends MongoRepository<Material, String> {

    // Student visible materials
    List<Material> findByApprovedTrue();

    // All pending (used for "all-pending")
    List<Material> findByApprovedFalse();

    // ✅ Latest pending with limit & sorting
    List<Material> findByApprovedFalse(Pageable pageable);
}
