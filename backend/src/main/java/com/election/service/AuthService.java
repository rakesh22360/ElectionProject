package com.election.service;

import com.election.dto.*;
import com.election.exception.BadRequestException;
import com.election.model.Role;
import com.election.model.User;
import com.election.repository.UserRepository;
import com.election.security.CustomUserDetailsService;
import com.election.security.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final CaptchaService captchaService;
    private final CustomUserDetailsService customUserDetailsService;
    private final String googleClientId;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
            PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider,
            CaptchaService captchaService, CustomUserDetailsService customUserDetailsService,
            @Value("${app.google.client-id}") String googleClientId) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.captchaService = captchaService;
        this.customUserDetailsService = customUserDetailsService;
        this.googleClientId = googleClientId;
    }

    public JwtResponse login(LoginRequest request) {
        if (!captchaService.verifyCaptcha(request.getCaptchaToken())) {
            throw new BadRequestException("Invalid or missing CAPTCHA");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new JwtResponse(jwt, user.getId(), user.getUsername(),
                user.getFullName(), user.getEmail(), user.getRole().name());
    }

    public JwtResponse googleLogin(GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Optional<User> userOptional = userRepository.findByEmail(email);
                User user;
                if (userOptional.isPresent()) {
                    user = userOptional.get();
                } else {
                    user = new User();
                    user.setEmail(email);
                    user.setUsername(email.split("@")[0]);
                    user.setFullName(name != null ? name : email.split("@")[0]);
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    user.setRole(Role.ROLE_CITIZEN);
                    user.setEnabled(true);
                    userRepository.save(user);
                }

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getUsername());
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                String jwt = tokenProvider.generateToken(authentication);

                return new JwtResponse(jwt, user.getId(), user.getUsername(),
                        user.getFullName(), user.getEmail(), user.getRole().name());
            } else {
                throw new BadRequestException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            System.err.println("Google auth failed: " + e.getMessage());
            throw new BadRequestException("Google authentication failed.");
        }
    }

    public MessageResponse register(RegisterRequest request) {
        if (!captchaService.verifyCaptcha(request.getCaptchaToken())) {
            throw new BadRequestException("Invalid or missing CAPTCHA");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        Role role;
        try {
            role = Role.valueOf("ROLE_" + request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + request.getRole());
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setEnabled(true);

        userRepository.save(user);
        return new MessageResponse("User registered successfully!");
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new BadRequestException("Current user not found"));
    }
}
