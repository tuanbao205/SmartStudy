package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.AuthResponse;
import com.smartstudy.backend.dto.LoginRequest;
import com.smartstudy.backend.dto.RegisterRequest;
import com.smartstudy.backend.entity.Role;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.RoleRepository;
import com.smartstudy.backend.repository.UserRepository;
import com.smartstudy.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy role STUDENT trong hệ thống"));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(studentRole);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), studentRole.getName());

        return new AuthResponse(token, "Bearer", savedUser.getId(), savedUser.getFullName(),
                savedUser.getEmail(), studentRole.getName());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Email hoặc mật khẩu không đúng"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().getName());

        return new AuthResponse(token, "Bearer", user.getId(), user.getFullName(),
                user.getEmail(), user.getRole().getName());
    }
}