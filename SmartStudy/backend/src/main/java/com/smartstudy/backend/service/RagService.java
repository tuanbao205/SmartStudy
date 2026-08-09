package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.ChatResponse;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.EmbeddingRepository;
import com.smartstudy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RagService {

    private final GeminiEmbeddingService geminiEmbeddingService;
    private final GroqChatService groqChatService;
    private final EmbeddingRepository embeddingRepository;
    private final UserRepository userRepository;

    private static final String SYSTEM_PROMPT = """
            Bạn là trợ lý học tập AI của SmartStudy. Chỉ trả lời dựa trên đoạn tài liệu được cung cấp bên dưới.
            Nếu tài liệu không chứa thông tin liên quan đến câu hỏi, hãy trả lời trung thực rằng bạn không tìm thấy
            thông tin đó trong tài liệu, KHÔNG được tự bịa ra câu trả lời.
            Trả lời bằng tiếng Việt, ngắn gọn, rõ ràng.
            """;

    public ChatResponse ask(String question, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        List<Double> queryVector = geminiEmbeddingService.embed(question);
        List<Map<String, Object>> topChunks = embeddingRepository.findTopKSimilarChunks(user.getId(), queryVector, 5);

        if (topChunks.isEmpty()) {
            return new ChatResponse(
                    "Bạn chưa upload tài liệu nào, hoặc chưa có tài liệu nào liên quan đến câu hỏi này.",
                    List.of()
            );
        }

        StringBuilder context = new StringBuilder();
        List<ChatResponse.SourceChunk> sources = new java.util.ArrayList<>();

        for (Map<String, Object> chunk : topChunks) {
            String content = (String) chunk.get("content");
            String docName = (String) chunk.get("original_name");
            double similarity = ((Number) chunk.get("similarity")).doubleValue();

            context.append("Nguồn: ").append(docName).append("\n").append(content).append("\n\n");
            sources.add(new ChatResponse.SourceChunk(docName, content.length() > 150 ? content.substring(0, 150) + "..." : content, similarity));
        }

        String userMessage = "Tài liệu tham khảo:\n" + context + "\n\nCâu hỏi: " + question;
        String answer = groqChatService.chat(SYSTEM_PROMPT, userMessage);

        return new ChatResponse(answer, sources);
    }
}