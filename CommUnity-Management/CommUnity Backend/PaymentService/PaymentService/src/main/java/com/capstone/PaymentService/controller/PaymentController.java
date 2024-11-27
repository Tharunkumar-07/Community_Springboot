package com.capstone.PaymentService.controller;

import com.capstone.PaymentService.dto.PaymentRequest;
import com.capstone.PaymentService.model.Payment;
import com.capstone.PaymentService.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<String> createPaymentLink(@RequestBody PaymentRequest paymentRequest) {

        return ResponseEntity.ok().body(paymentService.createPaymentLink(paymentRequest).getShort_url());
    }

    @GetMapping("/by-society/{societyId}")
    public ResponseEntity<List<Payment>> findPaymentBySociety(@PathVariable("societyId") long societyId){
        return ResponseEntity.ok(paymentService.findPaymentsBySociety(societyId));
    }

    @GetMapping("/{flatNo}/{societyId}")
    public ResponseEntity<Payment> findPaymentByFlatNo(@PathVariable("flatNo") String flatNo, @PathVariable("societyId") long societyId){
        return ResponseEntity.ok(paymentService.findPaymentByFlatNoSociety(flatNo, societyId));
    }

    @PutMapping("/update/{flatNo}/{societyId}")
    public ResponseEntity<String> updatePayment(@PathVariable("flatNo") String flatNo, @PathVariable("societyId") long societyId){
        return ResponseEntity.ok(paymentService.updatePaymentStatus(flatNo, societyId));
    }
}