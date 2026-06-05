package com.taskportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        return ResponseEntity.ok(Map.of(
                "application", "AI Task Management Portal",
                "status", "running",
                "message", "Backend API is live. Use the React frontend at http://localhost:5173",
                "docs", Map.of(
                        "register", "POST /api/auth/register",
                        "login", "POST /api/auth/login",
                        "tasks", "GET /api/tasks (requires JWT)",
                        "ai", "POST /api/ai/generate (requires JWT)"
                )
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
