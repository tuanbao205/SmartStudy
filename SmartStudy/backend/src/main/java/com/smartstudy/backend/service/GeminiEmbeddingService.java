package com.smartstudy.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiEmbeddingService {

    private final RestClient restClient = RestClient.create();

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String EMBED_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

    @SuppressWarnings("unchecked")
    public List<Double> embed(String text) {
        Map<String, Object> body = Map.of(
                "content", Map.of("parts", List.of(Map.of("text", text))),
                "outputDimensionality", 768
        );

        Map<String, Object> response = restClient.post()
                .uri(EMBED_URL + "?key=" + apiKey)
                .body(body)
                .retrieve()
                .body(Map.class);

        Map<String, Object> embedding = (Map<String, Object>) response.get("embedding");
        return (List<Double>) embedding.get("values");
    }
}