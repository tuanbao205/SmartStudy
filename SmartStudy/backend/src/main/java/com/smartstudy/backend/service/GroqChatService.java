package com.smartstudy.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GroqChatService {

    private final RestClient restClient = RestClient.create();

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

    @SuppressWarnings("unchecked")
    public String chat(String systemPrompt, String userMessage) {
        Map<String, Object> body = Map.of(
                "model", "openai/gpt-oss-120b",
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userMessage)
                ),
                "temperature", 0.3
        );

        Map<String, Object> response = restClient.post()
                .uri(CHAT_URL)
                .header("Authorization", "Bearer " + apiKey)
                .body(body)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }
}