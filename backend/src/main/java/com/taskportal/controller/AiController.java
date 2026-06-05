package com.taskportal.controller;

import com.taskportal.dto.AiGenerateRequest;
import com.taskportal.dto.AiGenerateResponse;
import com.taskportal.service.GeminiAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiAiService geminiAiService;

    @PostMapping("/generate")
    public ResponseEntity<AiGenerateResponse> generate(@Valid @RequestBody AiGenerateRequest request) {
        return ResponseEntity.ok(geminiAiService.generateTaskDetails(request.getTitle()));
    }
}
