package com.gamity.gamity_api.repository;

import com.gamity.gamity_api.domain.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    long countByStatus(String status);
    
    // Al borrar un usuario, borrar reportes donde esté involucrado
    void deleteByReporterIdOrReportedUserId(Long r1, Long r2);
}