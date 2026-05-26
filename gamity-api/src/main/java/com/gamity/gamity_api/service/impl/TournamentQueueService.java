package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.*;
import com.gamity.gamity_api.repository.*;
import com.gamity.gamity_api.service.MatchmakingRule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TournamentQueueService {

    private final TournamentRepository tournamentRepository;
    private final TournamentRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final List<MatchmakingRule> matchmakingRules;
    private final TournamentTeamBalancerService balancerService;

    public Map<String, Object> getActiveTournament(Long userId) {
        List<TournamentRegistration> userRegs = registrationRepository.findByUserId(userId);
        Optional<Tournament> activeMatch = userRegs.stream()
                .map(r -> tournamentRepository.findById(r.getTournamentId()).orElse(null))
                .filter(t -> t != null && ("active".equals(t.getStatus()) || "awaiting_reports".equals(t.getStatus())))
                .findFirst();

        if (activeMatch.isPresent()) {
            return Map.of("active", true, "tournament", activeMatch.get(), "registered", true, "current_players", 10);
        }

        Optional<Tournament> opt = tournamentRepository.findAll().stream()
                .filter(t -> "open".equals(t.getStatus()))
                .findFirst();

        Tournament t;
        if (opt.isEmpty()) {
            t = new Tournament();
            t.setName("Matchmaking 5v5");
            t.setStatus("open");
            t.setMaxPlayers(10);

            t = tournamentRepository.save(t);
        } else {
            t = opt.get();
        }

        boolean registered = registrationRepository.existsByTournamentIdAndUserId(t.getId(), userId);
        int count = registrationRepository.countByTournamentId(t.getId());

        return Map.of("active", true, "tournament", t, "registered", registered, "current_players", count);
    }

    @Transactional
    public Map<String, Object> registerUser(Integer tournamentId, Long userId) {
        Tournament t = tournamentRepository.findById(tournamentId).orElseThrow();
        if (!"open".equals(t.getStatus())) {
            return Map.of("success", false, "message", "La cola ya no está abierta");
        }

        if (registrationRepository.existsByTournamentIdAndUserId(tournamentId, userId)) {
            return Map.of("success", false, "message", "Ya estás en la cola");
        }

        User user = userRepository.findById(userId).orElseThrow();
        for (MatchmakingRule rule : matchmakingRules) {
            String errorMsg = rule.validate(user);
            if (errorMsg != null) {
                return Map.of("success", false, "message", errorMsg);
            }
        }

        int count = registrationRepository.countByTournamentId(tournamentId);
        if (count >= 10) {
            return Map.of("success", false, "message", "La partida ya está llena");
        }

        TournamentRegistration reg = new TournamentRegistration();
        reg.setTournamentId(tournamentId);
        reg.setUserId(userId);
        registrationRepository.save(reg);

        count++;
        if (count >= 10) {
            balancerService.closeAndGenerateTeams(tournamentId);
            balancerService.generateBracket(tournamentId);
        }

        return Map.of("success", true, "message", "Registrado correctamente");
    }

    @Transactional
    public Map<String, Object> unregisterUser(Integer tournamentId, Long userId) {
        Tournament t = tournamentRepository.findById(tournamentId).orElse(null);
        if (t == null) {
            return Map.of("success", false, "message", "Torneo no encontrado");
        }
        if (!"open".equals(t.getStatus())) {
            return Map.of("success", false, "message", "El matchmaking ya ha comenzado, no puedes cancelar.");
        }

        TournamentRegistration reg = registrationRepository.findByTournamentIdAndUserId(tournamentId, userId)
                .orElse(null);
        if (reg != null) {
            registrationRepository.delete(reg);
            return Map.of("success", true, "message", "Búsqueda cancelada correctamente.");
        }

        return Map.of("success", false, "message", "No estabas en la cola.");
    }

    @Transactional
    public Map<String, Object> forceMatchmaking(Long userId) {
        Map<String, Object> activeInfo = getActiveTournament(userId);
        Tournament t = (Tournament) activeInfo.get("tournament");
        if (!"open".equals(t.getStatus())) {
            return Map.of("success", false, "message", "No hay ninguna cola abierta");
        }

        if (!registrationRepository.existsByTournamentIdAndUserId(t.getId(), userId)) {
            User user = userRepository.findById(userId).orElseThrow();
            for (MatchmakingRule rule : matchmakingRules) {
                String errorMsg = rule.validate(user);
                if (errorMsg != null) {
                    return Map.of("success", false, "message", errorMsg);
                }
            }

            TournamentRegistration reg = new TournamentRegistration();
            reg.setTournamentId(t.getId());
            reg.setUserId(userId);
            registrationRepository.save(reg);
        }

        int count = registrationRepository.countByTournamentId(t.getId());
        int max = t.getMaxPlayers() != null ? t.getMaxPlayers() : 10;
        int needed = max - count;

        // BOTS
        for (int i = 0; i < needed; i++) {
            User dummy = new User();
            String randomStr = UUID.randomUUID().toString();
            dummy.setUsername("Bot_" + randomStr.substring(0, 8));
            dummy.setEmail("bot_" + randomStr + "@bot.com");
            dummy.setPassword("bot");
            dummy.setRole("user");
            dummy.setAvatar("img/default.png");
            dummy.setStatus("offline");

            UserProfile profile = new UserProfile();
            profile.setGameRank("Platino");
            dummy.setProfile(profile);

            dummy = userRepository.save(dummy);

            TournamentRegistration reg = new TournamentRegistration();
            reg.setTournamentId(t.getId());
            reg.setUserId(dummy.getId());
            registrationRepository.save(reg);
        }

        balancerService.closeAndGenerateTeams(t.getId());
        balancerService.generateBracket(t.getId());
        return Map.of("success", true, "message", "Partida generada!");
    }
}
