package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.DocumentResponse;
import com.smartstudy.backend.entity.Document;
import com.smartstudy.backend.entity.DocumentChunk;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.DocumentChunkRepository;
import com.smartstudy.backend.repository.DocumentRepository;
import com.smartstudy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentChunkRepository documentChunkRepository;
    private final UserRepository userRepository;
    private final TextExtractionService textExtractionService;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public DocumentResponse uploadDocument(MultipartFile file, String email) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        String originalName = file.getOriginalFilename();
        String extension = getExtension(originalName);
        if (!extension.equals("PDF") && !extension.equals("DOCX")) {
            throw new IllegalArgumentException("Chỉ hỗ trợ file PDF hoặc DOCX");
        }

        // Lưu file vật lý với tên ngẫu nhiên, tránh trùng/ghi đè
        Path uploadPath = Path.of(uploadDir).toAbsolutePath();
        Files.createDirectories(uploadPath);
        String storedFileName = UUID.randomUUID() + "." + extension.toLowerCase();
        Path storedPath = uploadPath.resolve(storedFileName);
        file.transferTo(storedPath.toFile());

        Document document = new Document();
        document.setUser(user);
        document.setOriginalName(originalName);
        document.setStoredPath(storedPath.toString());
        document.setFileType(extension);
        document.setStatus("PROCESSING");
        Document saved = documentRepository.save(document);

        // Trích xuất văn bản ngay (đồng bộ - đơn giản cho đồ án, có thể chuyển async sau)
        try {
            String text = textExtractionService.extractText(storedPath.toFile(), extension);
            List<String> chunks = chunkText(text, 800, 100);

            for (int i = 0; i < chunks.size(); i++) {
                DocumentChunk chunk = new DocumentChunk();
                chunk.setDocument(saved);
                chunk.setChunkIndex(i);
                chunk.setContent(chunks.get(i));
                documentChunkRepository.save(chunk);
            }

            saved.setStatus("READY");
        } catch (Exception e) {
            saved.setStatus("FAILED");
        }
        documentRepository.save(saved);

        return toResponse(saved);
    }

    public List<DocumentResponse> getMyDocuments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));
        return documentRepository.findByUserId(user.getId()).stream().map(this::toResponse).toList();
    }

    // Chia văn bản thành các đoạn ~800 ký tự, overlap 100 ký tự (tránh cắt đứt ý)
    private List<String> chunkText(String text, int chunkSize, int overlap) {
        List<String> chunks = new java.util.ArrayList<>();
        String cleaned = text.replaceAll("\\s+", " ").trim();
        int start = 0;
        while (start < cleaned.length()) {
            int end = Math.min(start + chunkSize, cleaned.length());
            chunks.add(cleaned.substring(start, end));
            if (end == cleaned.length()) break;
            start = end - overlap;
        }
        return chunks;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1).toUpperCase();
    }

    private DocumentResponse toResponse(Document d) {
        return new DocumentResponse(d.getId(), d.getOriginalName(), d.getFileType(), d.getStatus(), d.getUploadedAt());
    }
}