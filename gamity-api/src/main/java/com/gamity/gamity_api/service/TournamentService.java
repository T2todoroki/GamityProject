package com.gamity.gamity_api.service;

import java.util.List;
import java.util.Map;

public interface TournamentService {

    // Obtener torneo activo con inscripciones abiertas
    Map<String, Object> getActiveTournament(Long userId);

    // Force matchmaking (llena con bots)
    Map<String, Object> forceMatchmaking(Long userId);

    // Inscribirse a un torneo
    Map<String, Object> registerUser(Integer tournamentId, Long userId);

    // Cancelar búsqueda (salirse de la cola)
    Map<String, Object> unregisterUser(Integer tournamentId, Long userId);

    // Obtener equipo del usuario en un torneo
    Map<String, Object> getMyTeam(Integer tournamentId, Long userId);

    // Cambiar nombre de equipo (solo capitán)
    Map<String, Object> changeTeamName(Integer teamId, Long userId, String newName);

    // Obtener bracket completo del torneo
    Map<String, Object> getBracket(Integer tournamentId);

    // Reportar resultado de una partida
    Map<String, Object> reportResult(Integer matchId, Long userId, Integer winnerTeamId);

    // Historial de torneos del usuario
    List<Map<String, Object>> getUserHistory(Long userId);

    // Obtener historial de campeones recientes
    List<Map<String, Object>> getRecentChampions();

    // Badges del usuario
    List<Map<String, Object>> getUserBadges(Long userId);

    // Enviar solicitudes de amistad a compañeros de equipo
    Map<String, Object> addTeamFriends(Integer teamId, Long userId);

    // Chat de equipo - obtener mensajes
    List<Map<String, Object>> getTeamChat(Integer teamId, Long userId);

    // Chat de equipo - enviar mensaje
    Map<String, Object> sendTeamMessage(Integer teamId, Long userId, String content);

    // Notificaciones del usuario
    List<Map<String, Object>> getNotifications(Long userId);

    // Marcar notificación como leída
    void markNotificationRead(Integer notificationId, Long userId);

    // ADMIN: Cerrar inscripciones, validar y generar equipos
    Map<String, Object> closeAndGenerateTeams(Integer tournamentId);

    // ADMIN: Generar bracket
    Map<String, Object> generateBracket(Integer tournamentId);
}
