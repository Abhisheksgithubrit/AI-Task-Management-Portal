package com.taskportal.service;

import com.taskportal.dto.TaskRequest;
import com.taskportal.dto.TaskResponse;
import com.taskportal.dto.TaskStatsResponse;
import com.taskportal.entity.Task;
import com.taskportal.entity.User;
import com.taskportal.enums.TaskStatus;
import com.taskportal.exception.ResourceNotFoundException;
import com.taskportal.mapper.TaskMapper;
import com.taskportal.repository.TaskRepository;
import com.taskportal.repository.UserRepository;
import com.taskportal.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        Long userId = SecurityUtils.getCurrentUserId();
        return taskRepository.findByUser_IdOrderByCreatedAtDesc(userId).stream()
                .map(TaskMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = findTaskForCurrentUser(id);
        return TaskMapper.toResponse(task);
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User user = getCurrentUser();
        Task task = TaskMapper.toEntity(request, user);
        return TaskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskForCurrentUser(id);
        TaskMapper.updateEntity(task, request);
        return TaskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = findTaskForCurrentUser(id);
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public TaskStatsResponse getTaskStats() {
        Long userId = SecurityUtils.getCurrentUserId();
        return TaskStatsResponse.builder()
                .total(taskRepository.countByUser_Id(userId))
                .todo(taskRepository.countByUser_IdAndStatus(userId, TaskStatus.TODO))
                .inProgress(taskRepository.countByUser_IdAndStatus(userId, TaskStatus.IN_PROGRESS))
                .done(taskRepository.countByUser_IdAndStatus(userId, TaskStatus.DONE))
                .build();
    }

    private Task findTaskForCurrentUser(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        return taskRepository.findByIdAndUser_Id(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private User getCurrentUser() {
        Long userId = SecurityUtils.getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
