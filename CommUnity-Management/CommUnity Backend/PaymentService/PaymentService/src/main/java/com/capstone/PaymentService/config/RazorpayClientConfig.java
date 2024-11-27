package com.capstone.PaymentService.config;

import feign.auth.BasicAuthRequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayClientConfig {
    @Bean
    public BasicAuthRequestInterceptor basicAuthRequestInterceptor() {
        return new BasicAuthRequestInterceptor("rzp_test_4VhjbXd5E6iVjh","62gJY0tHxptHPkAdvlb6vF6n");
    }
}