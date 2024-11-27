package com.capstone.PaymentService.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RazorpayRequest {
    private int amount;
    private String currency = "INR";
    private boolean accept_partial = true;
    private int first_min_partial_amount = 100;
    private long expire_by;
    private String reference_id;
    private String description;
    private Customer customer;
    private Notify notify = new Notify(true, true);
    private boolean reminder_enable = true;
    private String callback_url = "http://localhost:3000/billings";
    private String callback_method = "get";

    // Getters and Setters

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Customer {
        private String name;
        private String contact;
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Notify {
        private boolean sms;
        private boolean email;
    }
}