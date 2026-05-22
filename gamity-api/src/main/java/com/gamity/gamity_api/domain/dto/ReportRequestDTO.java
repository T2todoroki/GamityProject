package com.gamity.gamity_api.domain.dto;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class ReportRequestDTO {
    @JsonProperty("reported_user_id")
    private Long reportedUserId;
    private String reason;
    private String evidence;
}
