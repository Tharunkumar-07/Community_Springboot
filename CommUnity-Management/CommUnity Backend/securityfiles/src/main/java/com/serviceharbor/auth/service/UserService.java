package com.serviceharbor.auth.service;


import com.serviceharbor.auth.model.Role;
import com.serviceharbor.auth.model.Users;
import com.serviceharbor.auth.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Users getUserByRoleAndEmail(String role, String email) {
        Role userRole;
        try {
            userRole = Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
        return userRepository.findByRoleAndEmail(userRole, email);
    }
    public List<Users> allUsers() {
        List<Users> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }
}