package com.gamity.gamity_api.controller;

import com.gamity.gamity_api.service.TournamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @GetMapping("/active")
    public ResponseEntity<?> getActiveTournament(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tournamentService.getActiveTournament(userId));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<?> registerUser(@PathVariable Integer id, @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tournamentService.registerUser(id, userId));
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<?> unregisterUser(@PathVariable Integer id, @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tournamentService.unregisterUser(id, userId));
    }

    @PostMapping("/matchmaking/force")
    public ResponseEntity<?> forceMatchmaking(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tournamentService.forceMatchmaking(userId));
    }

    @GetMapping("/{id}/team")
    public ResponseEntity<?> getMyTeam(@PathVariable Integer id, @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tournamentService.getMyTeam(id, userId));
    }

    @GetMapping("/{id}/bracket")
    public ResponseEntity<?> getBracket(@PathVariable Integer id) {
        return ResponseEntity.ok(tournamentService.getBracket(id));
    }

    @GetMapping("/champions")
    public ResponseEntity<?> getRecentChampions() {
        return ResponseEntity.ok(tournamentService.getRecentChampions());
    }

    @PostMapping("/match/{matchId}/report")
    public ResponseEntity<?> reportResult(@PathVariable Integer matchId, @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(tournamentService.reportResult(matchId, userId, body.get("winnerTeamId")));
    }

    @GetMapping("/team/{teamId}/chat")
    public ResponseEntity<?> getTeamChat(@PathVariable Integer teamId, @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tournamentService.getTeamChat(teamId, userId));
    }

    @PostMapping("/team/{teamId}/chat")
    public ResponseEntity<?> sendTeamMessage(@PathVariable Integer teamId, @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(tournamentService.sendTeamMessage(teamId, userId, body.get("content")));
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(tournamentService.getNotifications(userId));
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<?> markNotificationRead(@PathVariable Integer id, @RequestHeader("X-User-Id") Long userId) {
        tournamentService.markNotificationRead(id, userId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleExceptions(Exception e) {
        e.printStackTrace();
        String errorMsg = e.getClass().getSimpleName() + ": " + (e.getMessage() != null ? e.getMessage() : "Error desconocido");
        return ResponseEntity.ok(Map.of(
                "success", false,
                "status", "idle",
                "message", errorMsg,
                "players", java.util.List.of()
        ));
    }
}
