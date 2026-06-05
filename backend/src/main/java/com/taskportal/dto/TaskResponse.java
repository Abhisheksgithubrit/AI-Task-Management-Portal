package com.taskportal.dto;

import com.taskportal.enums.TaskPriority;
import com.taskportal.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private TaskPriority priority;
    private LocalDate dueDate;
    private TaskStatus status;
    private LocalDateTime createdAt;
    private Long userId;
}
