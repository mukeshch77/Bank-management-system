package com.bank.management.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JwtService - Handles everything related to JWT (JSON Web Tokens).
 *
 * WHAT IS JWT?
 * A JWT is a compact, URL-safe string that proves a user is authenticated.
 *
 * Structure: header.payload.signature
 * Example: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huQGVtYWlsLmNvbSJ9.abc123
 *
 * HOW IT WORKS:
 * 1. User logs in with email + password
 * 2. We verify credentials, then CREATE a JWT token
 * 3. We send the token to the frontend
 * 4. Frontend stores it in localStorage
 * 5. Every subsequent request includes "Authorization: Bearer <token>"
 * 6. We VERIFY the token on each request instead of checking the database
 *
 * WHY JWT?
 * - Stateless: Server doesn't store sessions
 * - Scalable: Works across multiple servers
 * - Self-contained: Token contains the user's email
 */
@Service
public class JwtService {

    // Reads app.jwt.secret from application.properties
    @Value("${app.jwt.secret}")
    private String secretKey;

    // Reads app.jwt.expiration from application.properties
    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    /**
     * Generate a JWT token for the given user.
     * Called after successful login.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generate a JWT token with extra claims (additional data to embed in the token).
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)                          // extra data
                .setSubject(userDetails.getUsername())           // stores the email
                .setIssuedAt(new Date(System.currentTimeMillis()))  // when token was created
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // when it expires
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // sign with our secret key
                .compact();                                       // build the final token string
    }

    /**
     * Extract the username (email) from inside the JWT token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Check if a token is valid:
     * 1. Does the username in the token match this UserDetails?
     * 2. Is the token NOT expired yet?
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // ===== PRIVATE HELPER METHODS =====

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic method to extract ANY claim from the token.
     * claimsResolver is a function that picks which claim to return.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /** Parse the token and get all claims from it */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())  // use our secret to verify signature
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** Convert our base64 secret string into a cryptographic Key object */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(secretKey.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
