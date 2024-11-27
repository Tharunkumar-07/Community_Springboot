package com.serviceharbor.auth.controller;


import com.serviceharbor.auth.dtos.LoginUserDto;
import com.serviceharbor.auth.dtos.RegisterUserDto;
import com.serviceharbor.auth.model.Users;
import com.serviceharbor.auth.responses.LoginResponse;
import com.serviceharbor.auth.service.AuthenticationService;
import com.serviceharbor.auth.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Users> register(@RequestBody RegisterUserDto registerUserDto) {
        Users registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        // Call the authenticate method to get the JWT token
        String jwtToken = authenticationService.authenticate(loginUserDto);

        // Create the LoginResponse object with the token and expiration time
        LoginResponse loginResponse = new LoginResponse()
                .setToken(jwtToken)
                .setExpiresIn(jwtService.getExpirationTime());

        // Return the response with the token
        return ResponseEntity.ok(loginResponse);
    }
}