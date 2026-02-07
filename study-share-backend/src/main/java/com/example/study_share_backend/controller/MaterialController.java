package com.example.study_share_backend.controller;

import com.example.study_share_backend.model.Material;
import com.example.study_share_backend.repository.MaterialRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "http://localhost:5173")
public class MaterialController {

    private final MaterialRepository materialRepository;

    private static final Path UPLOAD_DIR = Paths.get("C:/studyshare/uploads");

    public MaterialController(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    // ================= USER UPLOAD =================
    @PostMapping("/upload")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam String materialType,
            @RequestParam Integer semester,
            @RequestParam String subject,
            @RequestParam MultipartFile file
    ) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }

        try {
            Files.createDirectories(UPLOAD_DIR);

            String storedFileName =
                    System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = UPLOAD_DIR.resolve(storedFileName);

            file.transferTo(filePath.toFile());

            Material material = new Material();
            material.setMaterialType(materialType);
            material.setSemester(semester);
            material.setSubject(subject);
            material.setFileName(file.getOriginalFilename());
            material.setFilePath(filePath.toString());
            material.setApproved(false); // PENDING

            materialRepository.save(material);

            return ResponseEntity.ok(Map.of(
                    "message", "Material uploaded successfully. Waiting for admin approval",
                    "id", material.getId()
            ));

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "File upload failed"
            );
        }
    }

    // ================= STUDENT: APPROVED ONLY =================
    @GetMapping
    public List<Material> getApprovedMaterials() {
        return materialRepository.findByApprovedTrue();
    }
    @GetMapping("/admin/pending/latest")
    public List<Material> getLatestPending() {
        Pageable pageable = PageRequest.of(
                0,                      // page
                6,                      // limit
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return materialRepository.findByApprovedFalse(pageable);
    }


    // ================= ADMIN: ALL PENDING =================
    @GetMapping("/admin/pending")
    public List<Material> getAllPending() {
        return materialRepository.findByApprovedFalse();
    }

    // ================= ADMIN: ALL MATERIALS (MANAGE PAGE) =================
    @GetMapping("/admin/materials")
    public List<Material> getAllMaterials() {
        return materialRepository.findAll(); // ✅ FIXED
    }

    // ================= ADMIN: APPROVE =================
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approveMaterial(@PathVariable String id) {
        Material material = getMaterialOrThrow(id);
        material.setApproved(true);
        materialRepository.save(material);

        return ResponseEntity.ok(Map.of("message", "Material approved"));
    }

    // ================= ADMIN: DELETE (REJECT) =================
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable String id) {
        Material material = getMaterialOrThrow(id);
        materialRepository.delete(material);

        return ResponseEntity.ok(Map.of("message", "Material deleted"));
    }
    // ================= ADMIN: VIEW PENDING MATERIAL =================
    @GetMapping("/admin/view/{id}")
    public ResponseEntity<Resource> viewPendingMaterial(@PathVariable String id) {

        Material material = getMaterialOrThrow(id);

        try {
            Path filePath = Paths.get(material.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
            }

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + material.getFileName() + "\""
                    )
                    .body(resource);

        } catch (MalformedURLException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to open file"
            );
        }
    }
    @PutMapping("/admin/update-filename/{id}")
    public ResponseEntity<?> updateFileName(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String newFileName = body.get("fileName");
        if (newFileName == null || newFileName.isEmpty()) {
            return ResponseEntity.badRequest().body("Filename cannot be empty");
        }

        Optional<Material> materialOpt = materialRepository.findById(id);
        if (materialOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Material material = materialOpt.get();
        material.setFileName(newFileName);
        materialRepository.save(material);

        return ResponseEntity.ok(material);
    }

    // ================= DOWNLOAD (APPROVED ONLY) =================
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable String id) {

        Material material = getMaterialOrThrow(id);

        if (!material.isApproved()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Material not approved yet"
            );
        }

        try {
            Path filePath = Paths.get(material.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + material.getFileName() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Download failed"
            );
        }
    }
    // ================= ADMIN: DELETE MATERIAL (WITH FILE) =================
    @DeleteMapping("/admin/materials/{id}")
    public ResponseEntity<?> deleteMaterialByAdmin(@PathVariable String id) {

        Material material = getMaterialOrThrow(id);

        // 1️⃣ Delete file from disk (if exists)
        try {
            Path filePath = Paths.get(material.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to delete file from storage"
            );
        }

        // 2️⃣ Delete from database
        materialRepository.delete(material);

        // 3️⃣ Success response
        return ResponseEntity.ok(
                Map.of("message", "Material deleted successfully")
        );
    }


    // ================= HELPER METHOD =================
    private Material getMaterialOrThrow(String id) {
        return materialRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Material not found"
                        ));
    }
}
