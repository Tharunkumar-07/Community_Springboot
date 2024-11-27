package com.capstone.PaymentService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BillScheduler {

    @Autowired
    private PaymentService paymentService;

//    @Scheduled(cron = "0 0 0 1 * ?") // Every 1st of the month at midnight
    @Scheduled(cron = "0 0/5 * * * ?")
    public void resetPaymentStatus() {
        paymentService.setAllFlatsPending();
    }
}