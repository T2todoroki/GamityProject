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
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class HybridAuthFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String userIdHeader = request.getHeader("X-User-Id");
        
        if (userIdHeader != null && !userIdHeader.isEmpty()) {
            try {
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
            } catch (NumberFormatException e) {
                // Ignore invalid header format
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
