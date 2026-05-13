package com.gamity.gamity_api.config;

import com.gamity.gamity_api.domain.entity.User;
import com.gamity.gamity_api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class HybridAuthFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String userIdHeader = request.getHeader("X-User-Id");
        String userHashHeader = request.getHeader("X-User-Hash");
        
        if (userIdHeader != null && !userIdHeader.isEmpty() && userHashHeader != null) {
            try {
                // Verificar firma de seguridad compartida con PHP para prevenir suplantación de identidad (IDOR)
                String expectedHash = generateHash(userIdHeader);
                
                if (expectedHash.equals(userHashHeader)) {
                    Long userId = Long.parseLong(userIdHeader);
                    User user = userRepository.findById(userId).orElse(null);
                    
                    if (user != null) {
                        // Mapeo de rol simple (1 -> ROLE_ADMIN, otro -> ROLE_USER)
                        String roleName = ("1".equals(user.getRole()) || "admin".equalsIgnoreCase(user.getRole())) ? "ROLE_ADMIN" : "ROLE_USER";
                        
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                user, null, Collections.singletonList(new SimpleGrantedAuthority(roleName))
                        );
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (NumberFormatException | NoSuchAlgorithmException e) {
                // Ignorar error de parseo o de algoritmo
            }
        }
        
        filterChain.doFilter(request, response);
    }

    private String generateHash(String userId) throws NoSuchAlgorithmException {
        String secret = "GAMITY_TFG_SECRET_2024";
        String payload = userId + secret;
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
