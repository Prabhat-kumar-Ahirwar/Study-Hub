package com.example.study_share_backend.dto;

import org.springframework.web.multipart.MultipartFile;

public class MaterialRequest {

    private String materialType;
    private Integer semester;   // IMPORTANT: Integer, not String
    private String subject;
    private MultipartFile file;

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
