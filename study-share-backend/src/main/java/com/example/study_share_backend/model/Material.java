package com.example.study_share_backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "materials")
public class Material {

    @Id
    private String id;

    private String materialType;
    private Integer semester;
    private String subject;

    private String fileName;
    private String filePath;

    // ✅ NEW FIELDS
    private boolean approved=false;     // admin approval status
    private String uploadedBy;    // optional (userId / email)
}
