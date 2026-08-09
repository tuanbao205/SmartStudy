package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.DocumentResponse;
import com.smartstudy.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<DocumentResponse> upload(@RequestParam("file") MultipartFile file,
                                                      Authentication authentication) throws IOException {
        return ResponseEntity.ok(documentService.uploadDocument(file, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getMyDocuments(Authentication authentication) {
        return ResponseEntity.ok(documentService.getMyDocuments(authentication.getName()));
    }
    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> viewFile(@PathVariable Long id, Authentication authentication) {
        return documentService.getFileForView(id, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        documentService.deleteDocument(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}