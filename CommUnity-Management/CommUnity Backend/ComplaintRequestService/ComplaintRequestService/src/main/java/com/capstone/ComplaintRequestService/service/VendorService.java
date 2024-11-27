package com.capstone.ComplaintRequestService.service;

import com.capstone.ComplaintRequestService.model.Vendor;
import com.capstone.ComplaintRequestService.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    // Method to create a new vendor
    public Vendor createVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    // Method to update an existing vendor
    public Vendor updateVendor(Long vendorId, Vendor vendorDetails) {
        Vendor existingVendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));

        existingVendor.setName(vendorDetails.getName());
        existingVendor.setService(vendorDetails.getService());
        existingVendor.setCompany(vendorDetails.getCompany());
        existingVendor.setPhoneNo(vendorDetails.getPhoneNo());
        existingVendor.setEmail(vendorDetails.getEmail());
        existingVendor.setSocietyId(vendorDetails.getSocietyId());

        return vendorRepository.save(existingVendor);
    }

    // Method to get all vendors
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    // Method to get vendors by society ID
    public List<Vendor> getVendorsBySociety(Long societyId) {
        return vendorRepository.findBySocietyId(societyId);
    }

    // Method to get distinct service types from the vendor list
    public List<String> getDistinctServiceTypes() {
        return vendorRepository.findAll().stream()
                .map(Vendor::getService)
                .distinct()
                .collect(Collectors.toList());
    }
}