package com.taskportal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskportal.dto.AiGenerateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiAiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private static final Pattern JSON_BLOCK = Pattern.compile("\\{[\\s\\S]*}");

    public AiGenerateResponse generateTaskDetails(String title) {
        try {
            String prompt = buildPrompt(title);
            String rawText = callGeminiApi(prompt);
            return parseAiResponse(rawText, title);
        } catch (Exception ex) {
            log.warn("Gemini API failed, using fallback: {}", ex.getMessage());
            return buildFallbackResponse(title);
        }
    }

    private String buildPrompt(String title) {
        return """
                You are a task management assistant. For the task title: "%s"
                Respond with ONLY valid JSON (no markdown) in this exact format:
                {
                  "description": "detailed actionable task description",
                  "priority": "LOW or MEDIUM or HIGH",
                  "estimatedTime": "e.g. 2 Hours"
                }
                """.formatted(title);
    }

    private String callGeminiApi(String prompt) throws Exception {
        String url = apiUrl + "?key=" + apiKey;

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> body = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        return root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
    }

    private AiGenerateResponse parseAiResponse(String rawText, String title) throws Exception {
        String json = extractJson(rawText);
        JsonNode node = objectMapper.readTree(json);

        String description = node.path("description").asText();
        String priority = node.path("priority").asText("MEDIUM").toUpperCase();
        String estimatedTime = node.path("estimatedTime").asText("2 Hours");

        if (description.isBlank()) {
            return buildFallbackResponse(title);
        }

        return AiGenerateResponse.builder()
                .description(description)
                .priority(normalizePriority(priority))
                .estimatedTime(estimatedTime)
                .aiGenerated(true)
                .build();
    }

    private String extractJson(String rawText) {
        Matcher matcher = JSON_BLOCK.matcher(rawText);
        if (matcher.find()) {
            return matcher.group();
        }
        return rawText;
    }

    private String normalizePriority(String priority) {
        String upper = priority.toUpperCase();
        if (upper.contains("HIGH")) {
            return "HIGH";
        }
        if (upper.contains("LOW")) {
            return "LOW";
        }
        return "MEDIUM";
    }

    private AiGenerateResponse buildFallbackResponse(String title) {
        return AiGenerateResponse.builder()
                .description("Complete the task: " + title + ". Break it into clear steps and track progress until done.")
                .priority("MEDIUM")
                .estimatedTime("2 Hours")
                .aiGenerated(false)
                .build();
    }
}
