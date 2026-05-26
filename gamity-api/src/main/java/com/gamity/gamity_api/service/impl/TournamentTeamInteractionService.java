package com.gamity.gamity_api.service.impl;

import com.gamity.gamity_api.domain.entity.*;
import com.gamity.gamity_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentTeamInteractionService {

    private final TournamentTeamRepository teamRepository;
    private final TournamentTeamMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final FriendshipRequestRepository friendshipRequestRepository;
    private final TournamentTeamChatRepository chatRepository;

    public Map<String, Object> getMyTeam(Integer tournamentId, Long userId) {
        Optional<TournamentTeam> opt = teamRepository.findByTournamentIdAndUserId(tournamentId, userId);
        if (opt.isEmpty())
            return Map.of("has_team", false);

        TournamentTeam team = opt.get();
        List<TournamentTeamMember> members = memberRepository.findByTeamId(team.getId());

        List<Map<String, Object>> membersInfo = new ArrayList<>();
        for (TournamentTeamMember m : members) {
            User u = userRepository.findById(m.getUserId()).orElse(null);
            if (u != null) {
                membersInfo.add(Map.of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "avatar", u.getAvatar() != null ? u.getAvatar() : "img/default.png"));
            }
        }

        return Map.of(
                "has_team", true,
                "team", team,
                "members", membersInfo);
    }

    public Map<String, Object> changeTeamName(Integer teamId, Long userId, String newName) {
        TournamentTeam team = teamRepository.findById(teamId).orElseThrow();
        if (!team.getCaptainId().equals(userId)) {
            return Map.of("success", false, "message", "Only captain can change name");
        }
        team.setName(newName);
        teamRepository.save(team);
        return Map.of("success", true);
    }

    @Transactional
    public Map<String, Object> addTeamFriends(Integer teamId, Long userId) {
        List<TournamentTeamMember> members = memberRepository.findByTeamId(teamId);
        int count = 0;
        for (TournamentTeamMember m : members) {
            if (!m.getUserId().equals(userId)) {
                // Simplified friendship request logic for demo
                FriendshipRequest req = new FriendshipRequest();
                req.setSenderId(userId);
                req.setReceiverId(m.getUserId());
                req.setStatus("pending");
                friendshipRequestRepository.save(req);
                count++;
            }
        }
        return Map.of("success", true, "sent", count);
    }

    public List<Map<String, Object>> getTeamChat(Integer teamId, Long userId) {
        if (!memberRepository.existsByTeamIdAndUserId(teamId, userId)) {
            throw new RuntimeException("Not in this team");
        }
        return chatRepository.findByTeamIdOrderByCreatedAtAsc(teamId).stream().map(c -> {
            User u = userRepository.findById(c.getUserId()).orElse(null);
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("content", c.getContent());
            map.put("created_at", c.getCreatedAt());
            map.put("user_id", c.getUserId());
            map.put("username", u != null ? u.getUsername() : "Unknown");
            map.put("avatar", u != null && u.getAvatar() != null ? u.getAvatar() : "img/default.png");
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> sendTeamMessage(Integer teamId, Long userId, String content) {
        if (!memberRepository.existsByTeamIdAndUserId(teamId, userId)) {
            return Map.of("success", false, "message", "Not in this team");
        }
        TournamentTeamChat chat = new TournamentTeamChat();
        chat.setTeamId(teamId);
        chat.setUserId(userId);
        chat.setContent(content);
        chatRepository.save(chat);
        return Map.of("success", true);
    }
}
