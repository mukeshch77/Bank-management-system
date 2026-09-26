package com.bank.management.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthFilter - Har HTTP request pe JWT token check karta hai.
 *
 * FIX: UserDetailsService ki jagah ab CustomUserDetailsService inject ho raha hai.
 * Circular dependency khatam!
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    // UserDetailsService ki jagah directly CustomUserDetailsService use karo
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Authorization header lo request se
        final String authHeader = request.getHeader("Authorization");

        // 2. Agar header nahi hai ya "Bearer " se start nahi hota → skip karo
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Token nikalo ("Bearer " ke baad wala part)
        final String jwt = authHeader.substring(7);

        // 4. Token se email nikalo
        final String userEmail = jwtService.extractUsername(jwt);

        // 5. Agar email mila aur user already authenticated nahi hai
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 6. Database se user load karo
            UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(userEmail);

            // 7. Token valid hai?
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // 8. Spring Security ko batao: ye user authenticated hai
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 9. Agla filter chain pe pass karo
        filterChain.doFilter(request, response);
    }
}