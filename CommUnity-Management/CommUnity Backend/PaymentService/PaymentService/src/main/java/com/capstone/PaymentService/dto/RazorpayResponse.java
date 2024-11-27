package com.capstone.PaymentService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RazorpayResponse {
    private boolean accept_partial;
    private int amount;
    private int amount_paid;
    private String callback_method;
    private String callback_url;
    private long cancelled_at;
    private long created_at;
    private String currency;
    private Customer customer;
    private String description;
    private long expire_by;
    private long expired_at;
    private int first_min_partial_amount;
    private String id;
    private Map<String, Object> notes;
    private Notify notify;
    private Map<String, Object> payments;
    private String reference_id;
    private boolean reminder_enable;
    private String short_url;
    private String status;
    private long updated_at;
    private boolean upi_link;
    private String user_id;
    private boolean whatsapp_link;

    // Getters and Setters
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Customer {
        private String contact;
        private String email;
        private String name;

        // Getters and Setters
    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @ToString
    public static class Notify {
        private boolean email;
        private boolean sms;
        private boolean whatsapp;

        // Getters and Setters
    }
}
