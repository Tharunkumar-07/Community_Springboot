package com.capstone.ComplaintRequestService.controller;

import com.capstone.ComplaintRequestService.model.Vendor;
import com.capstone.ComplaintRequestService.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/complaint-service/vendor")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @PostMapping("/create")
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        Vendor createdVendor = vendorService.createVendor(vendor);
        return new ResponseEntity<>(createdVendor, HttpStatus.CREATED);
    }

    @PutMapping("/update/{vendorId}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long vendorId, @RequestBody Vendor vendor) {
        Vendor updatedVendor = vendorService.updateVendor(vendorId, vendor);
        return new ResponseEntity<>(updatedVendor, HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        List<Vendor> vendors = vendorService.getAllVendors();
        return new ResponseEntity<>(vendors, HttpStatus.OK);
    }

    @GetMapping("/getBySociety/{societyId}")
    public ResponseEntity<List<Vendor>> getVendorsBySociety(@PathVariable Long societyId) {
        List<Vendor> vendors = vendorService.getVendorsBySociety(societyId);
        return new ResponseEntity<>(vendors, HttpStatus.OK);
    }

    @GetMapping("/services")
    public ResponseEntity<List<String>> getDistinctServiceTypes() {
        List<String> services = vendorService.getDistinctServiceTypes();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
}
