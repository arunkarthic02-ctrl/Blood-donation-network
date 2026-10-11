package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.UserResponseDto;
import com.blooddonation.backend.dto.UserSignupRequest;
import com.blooddonation.backend.entity.User;
import com.blooddonation.backend.exception.EmailAlreadyRegisteredException;
import com.blooddonation.backend.exception.InvalidCredentialsException;
import com.blooddonation.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponseDto signup(UserSignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyRegisteredException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));

        User savedUser = userRepository.save(user);
        return UserResponseDto.fromEntity(savedUser);
    }

    public UserResponseDto login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        return UserResponseDto.fromEntity(user);
    }
}