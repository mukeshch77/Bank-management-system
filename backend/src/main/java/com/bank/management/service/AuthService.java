package com.bank.management.service;

import com.bank.management.config.JwtService;
import com.bank.management.dto.AuthResponse;
import com.bank.management.dto.LoginRequest;
import com.bank.management.dto.SignupRequest;
import com.bank.management.entity.Account;
import com.bank.management.entity.User;
import com.bank.management.repository.AccountRepository;
import com.bank.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Random;


/**
 * AuthService - Contains all business logic for authentication.
 *
 * Service classes are where the REAL WORK happens:
 * - Controllers receive HTTP requests and call service methods
 * - Services contain business rules and logic
 * - Repositories talk to the database
 *
 * @Service marks this as a Spring-managed service bean.
 * @Slf4j gives us a 'log' variable for logging.
 * @Transactional on a method means: if anything fails inside, roll back ALL database changes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * SIGNUP - Register a new customer.
     *
     * Steps:
     * 1. Check if email is already registered
     * 2. Create and save User
     * 3. Generate unique account number
     * 4. Create and save Account for this user
     * 5. Generate JWT token
     * 6. Return token + user info
     *
     * @Transactional ensures that if Account creation fails after User is saved,
     * the User insertion is also rolled back. Keeps data consistent.
     */
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered. Please use a different email or login.");
        }

        log.info("Creating new user account for email: {}", request.getEmail());

        // 2. Create User entity and save to database
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // BCrypt hash
                .phone(request.getPhone())
                .address(request.getAddress())
                .role("CUSTOMER") // New users are always customers, not admins
                .build();

        User savedUser = userRepository.save(user);
        log.info("User saved with ID: {}", savedUser.getId());

        // 3. Create Account for this user
        Account account = Account.builder()
                .user(savedUser)
                .accountNumber(generateUniqueAccountNumber())
                .balance(BigDecimal.ZERO)               // Start with ₹0
                .pin(passwordEncoder.encode(request.getPin()))  // BCrypt hash the PIN too
                .status("ACTIVE")
                .accountType("SAVINGS")
                .build();

        Account savedAccount = accountRepository.save(account);
        log.info("Account created: {}", savedAccount.getAccountNumber());

        // 4. Generate JWT token so user is automatically logged in after signup
        UserDetails userDetails =
        org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getEmail())
                .password(savedUser.getPassword())
                .roles(savedUser.getRole())
                .build();

        String jwtToken = jwtService.generateToken(userDetails);

        // 5. Return response
        return AuthResponse.builder()
                .token(jwtToken)
                .id(savedUser.getId())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .accountNumber(savedAccount.getAccountNumber())
                .build();
    }

    /**
     * LOGIN - Authenticate an existing user.
     *
     * Steps:
     * 1. Use Spring's AuthenticationManager to verify email + password
     *    (It automatically loads the user and checks BCrypt password)
     * 2. If credentials wrong → BadCredentialsException is thrown (caught by GlobalExceptionHandler)
     * 3. If correct → load user from DB → generate JWT → return response
     */
    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate (throws BadCredentialsException if wrong)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Load user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Load account
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // 4. Generate JWT token
        UserDetails userDetails =
        org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();

        String jwtToken = jwtService.generateToken(userDetails);
        log.info("User logged in: {}", user.getEmail());

        // 5. Return response with token and user info
        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .accountNumber(account.getAccountNumber())
                .build();
    }

    /**
     * Generate a unique 10-digit account number.
     *
     * Loops until we generate a number that doesn't already exist in the database.
     * In practice, this almost always succeeds on the first try.
     */
    private String generateUniqueAccountNumber() {
        Random random = new Random();
        String accountNumber;
        do {
            // Generate a 10-digit random number as a string
            accountNumber = String.format("%010d", (long)(random.nextDouble() * 9_000_000_000L) + 1_000_000_000L);
        } while (accountRepository.existsByAccountNumber(accountNumber));

        return accountNumber;
    }
}
