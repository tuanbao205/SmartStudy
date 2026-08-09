package com.smartstudy.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class TextExtractionService {

    public String extractText(File file, String fileType) throws IOException {
        return switch (fileType.toUpperCase()) {
            case "PDF" -> extractFromPdf(file);
            case "DOCX" -> extractFromDocx(file);
            default -> throw new IllegalArgumentException("Định dạng file không hỗ trợ: " + fileType);
        };
    }

    private String extractFromPdf(File file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractFromDocx(File file) throws IOException {
        try (InputStream is = new FileInputStream(file);
             XWPFDocument document = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }
}