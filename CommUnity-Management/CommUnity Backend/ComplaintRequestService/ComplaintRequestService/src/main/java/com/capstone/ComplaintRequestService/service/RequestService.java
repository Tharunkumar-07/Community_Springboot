package com.capstone.ComplaintRequestService.service;

import com.capstone.ComplaintRequestService.exception.ServiceNotFoundException;
import com.capstone.ComplaintRequestService.model.Request;
import com.capstone.ComplaintRequestService.model.Vendor;
import com.capstone.ComplaintRequestService.repository.RequestRepository;
import com.capstone.ComplaintRequestService.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private NotificationService notificationService;

    public Request createRequest(Request request) {
        Request savedRequest = requestRepository.save(request);

        Optional<Vendor> vendor = vendorRepository.findByServiceAndSocietyId(request.getServiceType(), request.getSocietyId());

        if (vendor.isPresent()) {
            Vendor vendorDetails = vendor.get();
            String messageBody = "New service request for " + request.getServiceType() + "\nDescription: " + request.getDescription() + "\nAddress: " + request.getAddress() + "\nPhone No: " + request.getPhoneNo();
            notificationService.sendNotification(vendorDetails.getEmail(), "Service Request: "+request.getRequestId(), messageBody);

        } else {
            throw new ServiceNotFoundException("No vendor found for the service: " + request.getServiceType() + " in the specified society.");
        }

        return savedRequest;
    }
}