package com.gamity.gamity_api.service;

import java.util.List;
import java.util.Map;

public interface SeasonLeaderboardService {
    List<Map<String, Object>> getTopPlayers();
    void processMonthlySeasonReset();
}
