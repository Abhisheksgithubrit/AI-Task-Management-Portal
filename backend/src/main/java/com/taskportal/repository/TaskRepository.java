package com.taskportal.repository;

import com.taskportal.entity.Task;
import com.taskportal.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUser_IdOrderByCreatedAtDesc(Long userId);

    Optional<Task> findByIdAndUser_Id(Long id, Long userId);

    long countByUser_Id(Long userId);

    long countByUser_IdAndStatus(Long userId, TaskStatus status);
}
