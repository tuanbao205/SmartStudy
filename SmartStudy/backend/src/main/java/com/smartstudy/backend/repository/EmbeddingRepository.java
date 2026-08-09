package com.smartstudy.backend.repository;

import lombok.RequiredArgsConstructor;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class EmbeddingRepository {

    private final JdbcTemplate jdbcTemplate;

    public void saveEmbedding(Long chunkId, List<Double> vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.size(); i++) {
            sb.append(vector.get(i));
            if (i < vector.size() - 1) sb.append(",");
        }
        sb.append("]");

        try {
            PGobject pgObject = new PGobject();
            pgObject.setType("vector");
            pgObject.setValue(sb.toString());

            jdbcTemplate.update(
                    "UPDATE document_chunks SET embedding = ? WHERE id = ?",
                    pgObject, chunkId
            );
        } catch (SQLException e) {
            throw new RuntimeException("Lỗi khi lưu embedding", e);
        }
    }

    public List<Map<String, Object>> findTopKSimilarChunks(Long userId, List<Double> queryVector, int topK) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < queryVector.size(); i++) {
            sb.append(queryVector.get(i));
            if (i < queryVector.size() - 1) sb.append(",");
        }
        sb.append("]");

        String sql = """
                SELECT dc.content, d.original_name,
                    1 - (dc.embedding <=> ?::vector) AS similarity
                FROM document_chunks dc
                JOIN documents d ON dc.document_id = d.id
                WHERE d.user_id = ? AND dc.embedding IS NOT NULL
                ORDER BY dc.embedding <=> ?::vector
                LIMIT ?
                """;

        return jdbcTemplate.queryForList(sql, sb.toString(), userId, sb.toString(), topK);
    }
}