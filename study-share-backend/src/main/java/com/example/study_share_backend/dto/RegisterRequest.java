package com.example.study_share_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String otp;   // ✅ Required for OTP verification
}
