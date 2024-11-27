package com.capstone.PaymentService.service;

import com.capstone.PaymentService.client.RazorpayClient;
import com.capstone.PaymentService.client.ResidentServiceClient;
import com.capstone.PaymentService.dto.*;
import com.capstone.PaymentService.model.Payment;
import com.capstone.PaymentService.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ResidentServiceClient residentServiceClient;

    @Autowired
    private RazorpayClient razorpayClient;

    public void setAllFlatsPending() {
        // Fetch all residents from the Society Management Service
        List<ResidentResponse> residents = residentServiceClient.getAllResidents();

        // Track unique flats
        Set<String> uniqueFlatNos = new HashSet<>();

        for (ResidentResponse resident : residents) {
            // If the flat number is already processed, skip creating a new payment
            if (!uniqueFlatNos.contains(resident.getFlatNo()) && resident.getRole()!= Role.ADMIN) {
                Payment payment = new Payment();
                payment.setFlatNo(resident.getFlatNo()); // Use the flat number to uniquely track payments
                payment.setSocietyId(resident.getSocietyId());
                payment.setAmount(3500.00); // Monthly maintenance amount
                payment.setStatus("PENDING");
                payment.setPaymentDate(null); // Will be set when the payment is made
                paymentRepository.save(payment);
                uniqueFlatNos.add(resident.getFlatNo());
            }
        }
    }

    public RazorpayResponse createPaymentLink(PaymentRequest paymentRequest) {
        String phoneNumber = paymentRequest.getPhoneNo();
        String name = paymentRequest.getName();
        RazorpayRequest request = new RazorpayRequest();
        request.setAmount(paymentRequest.getAmount()*100);
        request.setExpire_by(Instant.now().getEpochSecond() + 45 * 60); // Expiry time is 45 minutes from now
        request.setReference_id(generateUniqueReferenceId());

        RazorpayRequest.Customer customer = new RazorpayRequest.Customer();
        customer.setName(name);
        customer.setContact("+91"+phoneNumber);
        customer.setEmail(paymentRequest.getEmail());
        request.setCustomer(customer);

        request.setDescription(paymentRequest.getDescription());

        return razorpayClient.createPaymentLink(request);
    }

    public String generateUniqueReferenceId() {
        // Generate a unique reference ID (e.g., using UUID)
        return "REF" + System.currentTimeMillis();
    }

    public String updatePaymentStatus(String flatNo, Long societyId) {
        Payment payment = paymentRepository.findByFlatNoAndSocietyIdAndStatus(flatNo, societyId, "PENDING")
                .orElseThrow(() -> new RuntimeException("Payment not found or already paid"));
        payment.setStatus("PAID");
        payment.setPaymentDate(LocalDateTime.now());  // Log the actual payment date
        paymentRepository.save(payment);
        return "Payment status of "+ flatNo +" updated successfully";
    }

    //for the ADMIN
    public List<Payment> findPaymentsBySociety(long societyId){
        return paymentRepository.findAllBySocietyId(societyId);
    }

    //for the RESIDENTS
    public Payment findPaymentByFlatNoSociety(String flatNo, long societyId){
        return paymentRepository.findByFlatNoAndSocietyIdAndStatus(flatNo, societyId, "PENDING");
    }
}