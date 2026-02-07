package com.example.study_share_backend.controller;


import com.example.study_share_backend.model.User;
import com.example.study_share_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ================= GET ALL USERS =================
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can access
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<Object> safeUsers = users.stream().map(user -> new Object() {
            public final String id = user.getId();
            public final String name = user.getName();
            public final String email = user.getEmail();
            public final String role = user.getRole();
        }).collect(Collectors.toList());

        return ResponseEntity.ok(safeUsers);
    }
}

