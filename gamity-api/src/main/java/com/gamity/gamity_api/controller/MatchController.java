package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.domain.dto.UserDTO;
import com.gamity.gamity_api.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getPotentialMatches(
            @RequestParam Long currentUserId,
            @RequestParam(required = false) String game,
            @RequestParam(required = false) String rankGroup,
            @RequestParam(required = false) String attitude
    ) {
        return ResponseEntity.ok(matchService.getPotentialMatches(currentUserId, game, rankGroup, attitude));
    }
}
