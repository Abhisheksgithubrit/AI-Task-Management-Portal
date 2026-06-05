package com.taskportal.mapper;

import com.taskportal.dto.TaskRequest;
import com.taskportal.dto.TaskResponse;
import com.taskportal.entity.Task;
import com.taskportal.entity.User;

public final class TaskMapper {

    private TaskMapper() {
    }

    public static Task toEntity(TaskRequest request, User user) {
        return Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .status(request.getStatus())
                .user(user)
                .build();
    }

    public static void updateEntity(Task task, TaskRequest request) {
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setStatus(request.getStatus());
    }

    public static TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .userId(task.getUser().getId())
                .build();
    }
}
