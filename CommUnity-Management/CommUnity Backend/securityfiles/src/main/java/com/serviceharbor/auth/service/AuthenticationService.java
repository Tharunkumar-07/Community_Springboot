package com.serviceharbor.auth.service;


import com.serviceharbor.auth.dtos.LoginUserDto;
import com.serviceharbor.auth.dtos.RegisterUserDto;
import com.serviceharbor.auth.model.Role;
import com.serviceharbor.auth.model.Users;
import com.serviceharbor.auth.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService; // Assuming you have the JwtService class for generating tokens

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            JwtService jwtService // Injecting JwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService; // Initializing JwtService
    }

    // Signup Method: Registers a new user in the system
    public Users signup(RegisterUserDto input) {
        // Create a new User object and set its fields based on the RegisterUserDto
        Users user = new Users();
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword())); // Hashing password
        user.setRole(Role.valueOf(input.getRole().toUpperCase())); // Setting role as enum

        // Save the user in the database
        return userRepository.save(user);
    }

    // Authenticate Method: Authenticates the user and returns a JWT token
    public String authenticate(LoginUserDto input) {
        // Authenticate the user using their credentials
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        // Retrieve the authenticated user from the repository
        Users authenticatedUser = userRepository.findByEmail(input.getEmail()).orElseThrow();

        // Build the UserDetails object using the authenticated user's details
        UserDetails userDetails = User.withUsername(authenticatedUser.getEmail())
                .password(authenticatedUser.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + authenticatedUser.getRole().name()))
                .build();

        // Generate a JWT token using the userDetails object
        String token = jwtService.generateToken(userDetails);

        // Return the generated token
        return token;
    }

    // Method to get all users
    public List<Users> allUsers() {
        List<Users> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }
}