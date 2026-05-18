package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.service.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/tournaments")
@RequiredArgsConstructor
public class AdminTournamentController {

    private final TournamentService tournamentService;

    @PostMapping("/{id}/generate-teams")
    public ResponseEntity<?> generateTeams(@PathVariable Integer id) {
        return ResponseEntity.ok(tournamentService.closeAndGenerateTeams(id));
    }

    @PostMapping("/{id}/generate-bracket")
    public ResponseEntity<?> generateBracket(@PathVariable Integer id) {
        return ResponseEntity.ok(tournamentService.generateBracket(id));
    }
}
