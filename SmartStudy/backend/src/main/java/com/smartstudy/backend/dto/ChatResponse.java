package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ChatResponse {
    private String answer;
    private List<SourceChunk> sources;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class SourceChunk {
        private String documentName;
        private String excerpt;
        private double similarity;
    }
}