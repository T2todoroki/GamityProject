package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.dto.ReportRequestDTO;
import com.gamity.gamity_api.domain.entity.Report;
import com.gamity.gamity_api.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;

    @PostMapping
    public ResponseEntity<?> createReport(
            @RequestHeader(value = "X-User-Id", defaultValue = "0") Long reporterId,
            @RequestBody ReportRequestDTO dto) {

        // Validar que el usuario está autenticado
        if (reporterId == null || reporterId <= 0) {
            return ResponseEntity.status(401)
                    .body(Map.of("success", false, "error", "No autorizado"));
        }

        // Validar datos del reporte
        if (dto.getReportedUserId() == null || dto.getReportedUserId() <= 0
                || dto.getReason() == null || dto.getReason().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "Datos incompletos"));
        }

        // No se puede reportar uno mismo
        if (reporterId.equals(dto.getReportedUserId())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", "No puedes reportarte a ti mismo"));
        }
        // Crear y guardar el reporte
        try {
            Report report = Report.builder()
                    .reporterId(reporterId)
                    .reportedUserId(dto.getReportedUserId())
                    .reason(dto.getReason().trim())
                    .status("pending")
                    .build();

            reportRepository.save(report);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Error al registrar el reporte"));
        }
    }
}