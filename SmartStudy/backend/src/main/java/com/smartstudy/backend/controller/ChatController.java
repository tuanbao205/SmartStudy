package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.ChatRequest;
import com.smartstudy.backend.dto.ChatResponse;
import com.smartstudy.backend.service.RagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final RagService ragService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(@Valid @RequestBody ChatRequest request,
                                              Authentication authentication) {
        return ResponseEntity.ok(ragService.ask(request.getQuestion(), authentication.getName()));
    }
}