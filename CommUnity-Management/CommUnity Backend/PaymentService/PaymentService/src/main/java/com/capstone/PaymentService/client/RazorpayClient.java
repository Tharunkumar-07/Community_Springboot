package com.capstone.PaymentService.client;

import com.capstone.PaymentService.config.RazorpayClientConfig;
import com.capstone.PaymentService.dto.RazorpayRequest;
import com.capstone.PaymentService.dto.RazorpayResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "razorpayClient", url = "https://api.razorpay.com/v1",configuration = RazorpayClientConfig.class)
public interface RazorpayClient {
    @PostMapping("/payment_links")
    RazorpayResponse createPaymentLink(@RequestBody RazorpayRequest request);
}