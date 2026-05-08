package com.gamity.gamity_api.domain.dto;

import lombok.Data;

@Data
public class ReportRequestDTO {
    private Long reportedUserId;
    private String reason;
}
