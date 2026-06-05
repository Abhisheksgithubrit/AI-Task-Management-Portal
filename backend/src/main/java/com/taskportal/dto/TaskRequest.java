package com.taskportal.dto;

import com.taskportal.enums.TaskPriority;
import com.taskportal.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    private LocalDate dueDate;

    @NotNull(message = "Status is required")
    private TaskStatus status;
}
