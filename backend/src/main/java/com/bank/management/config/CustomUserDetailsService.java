package com.bank.management.config;

import com.bank.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * CustomUserDetailsService - Ye Spring Security ko batata hai ki
 * user ko database se kaise load karna hai.
 *
 * Pehle ye SecurityConfig ke andar tha — isliye circular dependency thi.
 * Ab ise alag @Service class mein daal diya — problem solve!
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Database se user email ke basis pe dhundo
        com.bank.management.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // Spring Security ka UserDetails object banao
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole()) // "CUSTOMER" → "ROLE_CUSTOMER" automatically
                .build();
    }
}