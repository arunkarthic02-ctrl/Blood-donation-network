package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.LoginRequest;
import com.blooddonation.backend.dto.UserSignupRequest;
import com.blooddonation.backend.entity.User;
import com.blooddonation.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public User signup(@RequestBody UserSignupRequest request) {
        return userService.signup(request);
    }
        @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return userService.login(request.getEmail(), request.getPassword());
    }
}