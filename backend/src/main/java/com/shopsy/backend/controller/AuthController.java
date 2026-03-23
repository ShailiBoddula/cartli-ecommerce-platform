package com.shopsy.backend.controller;

import com.shopsy.backend.config.JwtUtil;
import com.shopsy.backend.dto.AuthResponse;
import com.shopsy.backend.dto.LoginRequest;
import com.shopsy.backend.dto.SignupRequest;
import com.shopsy.backend.model.Role;
import com.shopsy.backend.model.User;
import com.shopsy.backend.service.UserService;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserService userService,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody @Valid LoginRequest request) {

        logger.info("Login attempt for {}", request.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword()
                    )
            );

            User user = userService.findUserByEmail(request.getEmail());

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

            AuthResponse response = AuthResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .token(token)
                    .build();

            return ResponseEntity.ok(response);

        } catch (AuthenticationException ex) {
            logger.warn("Invalid login attempt for {}", request.getEmail());
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        logger.info("Signup attempt for {}", request.getEmail());

        // Validate email format
        if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            return ResponseEntity.badRequest().build();
        }

        // Check if user already exists
        try {
            userService.findUserByEmail(request.getEmail());
            // User exists, return conflict
            return ResponseEntity.status(409).build();
        } catch (Exception e) {
            // User doesn't exist, proceed with registration
        }

        try {
            // Create new user
            User newUser = new User();
            newUser.setEmail(request.getEmail().trim().toLowerCase());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setFirstName(request.getFirstName());
            newUser.setLastName(request.getLastName());
            // Use role from request if provided, otherwise default to USER
            Role userRole = Role.USER;
            if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
                userRole = Role.ADMIN;
            }
            newUser.setRole(userRole);

            User savedUser = userService.createUser(newUser);

            // Generate token
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

            AuthResponse response = AuthResponse.builder()
                    .id(savedUser.getId())
                    .email(savedUser.getEmail())
                    .firstName(savedUser.getFirstName())
                    .lastName(savedUser.getLastName())
                    .role(savedUser.getRole())
                    .token(token)
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            logger.error("Signup failed for {}", request.getEmail(), ex);
            return ResponseEntity.status(500).build();
        }
    }

    // Password reset/update endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        
        try {
            User user = userService.findUserByEmail(email);
            user.setPassword(passwordEncoder.encode(newPassword));
            user = userService.updateUser(user);
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            
            AuthResponse response = AuthResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .token(token)
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Password reset failed", e);
            return ResponseEntity.status(404).build();
        }
    }

    // Admin creation endpoint - for testing only
    @PostMapping("/create-admin")
    public ResponseEntity<AuthResponse> createAdmin(@RequestBody SignupRequest request) {
        logger.info("Admin creation attempt for {}", request.getEmail());
        
        try {
            User existingUser = userService.findUserByEmail(request.getEmail());
            // User exists - upgrade to admin
            existingUser.setRole(Role.ADMIN);
            User savedUser = userService.updateUser(existingUser);
            
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());
            
            AuthResponse response = AuthResponse.builder()
                    .id(savedUser.getId())
                    .email(savedUser.getEmail())
                    .firstName(savedUser.getFirstName())
                    .lastName(savedUser.getLastName())
                    .role(savedUser.getRole())
                    .token(token)
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // User doesn't exist - create new admin
            try {
                User newUser = new User();
                newUser.setEmail(request.getEmail().trim().toLowerCase());
                newUser.setPassword(passwordEncoder.encode(request.getPassword()));
                newUser.setFirstName(request.getFirstName());
                newUser.setLastName(request.getLastName());
                newUser.setRole(Role.ADMIN);

                User savedUser = userService.createUser(newUser);

                String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

                AuthResponse response = AuthResponse.builder()
                        .id(savedUser.getId())
                        .email(savedUser.getEmail())
                        .firstName(savedUser.getFirstName())
                        .lastName(savedUser.getLastName())
                        .role(savedUser.getRole())
                        .token(token)
                        .build();

                return ResponseEntity.ok(response);
            } catch (Exception ex) {
                logger.error("Admin creation failed", ex);
                return ResponseEntity.status(500).build();
            }
        }
    }
}
