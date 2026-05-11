package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.entity.Report;
import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.repository.FriendshipRequestRepository;
import com.gamity.gamity_api.repository.MessageRepository;
import com.gamity.gamity_api.repository.ReportRepository;
import com.gamity.gamity_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final MessageRepository messageRepository;
    private final FriendshipRequestRepository friendshipRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            @RequestHeader(value = "X-User-Id", defaultValue = "0") Long adminId) {

        // Validar que el solicitante es un admin registrado
        User requester = userRepository.findById(adminId).orElse(null);
        if (requester == null || !"admin".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "error", "Acceso denegado"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);

        // Stats de plataforma
        Map<String, Object> stats = new HashMap<>();
        stats.put("total_users", userRepository.count());
        stats.put("online_users", userRepository.findByStatus("online").size());
        stats.put("active_connections", friendshipRepository.count()); // Conexiones entre usuarios
        stats.put("total_messages", messageRepository.count());
        stats.put("pending_reports", reportRepository.countByStatus("pending"));
        response.put("stats", stats);

        // Lista de usuarios (admins primero, luego por id)
        List<Map<String, Object>> users = userRepository.findAll().stream()
                .sorted((a, b) -> {
                    boolean aAdmin = "admin".equalsIgnoreCase(a.getRole());
                    boolean bAdmin = "admin".equalsIgnoreCase(b.getRole());
                    if (aAdmin && !bAdmin) return -1;
                    if (!aAdmin && bAdmin) return 1;
                    return Long.compare(a.getId(), b.getId());
                })
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", u.getId());
                    map.put("username", u.getUsername());
                    map.put("email", u.getEmail());
                    map.put("role", u.getRole());
                    map.put("status", u.getStatus());
                    if (u.getProfile() != null) {
                        map.put("main_game", u.getProfile().getMainGame());
                        map.put("game_rank", u.getProfile().getGameRank());
                    } else {
                        map.put("main_game", null);
                        map.put("game_rank", null);
                    }
                    return map;
                }).collect(Collectors.toList());
        response.put("users", users);

        // Reportes (pendientes primero)
        List<Map<String, Object>> reports = reportRepository.findAll().stream()
                .sorted((a, b) -> {
                    if ("pending".equals(a.getStatus()) && !"pending".equals(b.getStatus())) return -1;
                    if (!"pending".equals(a.getStatus()) && "pending".equals(b.getStatus())) return 1;
                    return 0;
                })
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getId());
                    map.put("reporter_name", userRepository.findById(r.getReporterId()).map(User::getUsername).orElse("Desconocido"));
                    map.put("reported_name", userRepository.findById(r.getReportedUserId()).map(User::getUsername).orElse("Desconocido"));
                    map.put("reason", r.getReason());
                    map.put("status", r.getStatus());
                    map.put("created_at", r.getCreatedAt() != null ? r.getCreatedAt().toString() : "");
                    return map;
                }).collect(Collectors.toList());
        response.put("reports", reports);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "0") Long adminId,
            @RequestBody Map<String, Object> body) {

        User requester = userRepository.findById(adminId).orElse(null);
        if (requester == null || !"admin".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "error", "Acceso denegado"));
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setUsername((String) body.get("username"));
        user.setEmail((String) body.get("email"));
        user.setRole(body.get("role").toString());
        user.setStatus((String) body.get("status"));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "0") Long adminId) {

        User requester = userRepository.findById(adminId).orElse(null);
        if (requester == null || !"admin".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "error", "Acceso denegado"));
        }
        if (id.equals(adminId)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "No puedes eliminar tu propia cuenta de administrador"));
        }

        reportRepository.deleteByReporterIdOrReportedUserId(id, id);
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PatchMapping("/reports/{id}")
    public ResponseEntity<?> updateReport(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", defaultValue = "0") Long adminId,
            @RequestBody Map<String, String> body) {

        User requester = userRepository.findById(adminId).orElse(null);
        if (requester == null || !"admin".equalsIgnoreCase(requester.getRole())) {
            return ResponseEntity.status(403).body(Map.of("success", false, "error", "Acceso denegado"));
        }

        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
        report.setStatus(body.get("status"));
        reportRepository.save(report);
        return ResponseEntity.ok(Map.of("success", true));
    }
}