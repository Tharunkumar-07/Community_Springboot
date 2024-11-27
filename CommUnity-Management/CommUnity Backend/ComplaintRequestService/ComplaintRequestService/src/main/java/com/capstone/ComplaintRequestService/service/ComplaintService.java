package com.capstone.ComplaintRequestService.service;

import com.capstone.ComplaintRequestService.ComplaintStatus;
import com.capstone.ComplaintRequestService.dto.complaintDtos.ComplaintRequest;
import com.capstone.ComplaintRequestService.dto.complaintDtos.ComplaintResponse;
import com.capstone.ComplaintRequestService.exception.ComplaintNotFoundException;
import com.capstone.ComplaintRequestService.model.Complaint;
import com.capstone.ComplaintRequestService.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Create a new complaint
    public ComplaintResponse createComplaint(ComplaintRequest complaintRequest) {
        Complaint complaint = dtoToEntity(complaintRequest);
        complaint.setStatus(ComplaintStatus.OPEN); // Set default status as OPEN
        Complaint savedComplaint = complaintRepository.save(complaint);
        return entityToDto(savedComplaint);
    }

    // Get all complaints
    public List<ComplaintResponse> getAllComplaints() {
        List<Complaint> complaints = complaintRepository.findAll();
        return complaints.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Get a complaint by ID
    public ComplaintResponse getComplaintById(long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ComplaintNotFoundException("Complaint not found with ID: "+complaintId));
        return entityToDto(complaint);
    }

    // Update a complaint
    public ComplaintResponse updateComplaint(long complaintId, ComplaintRequest complaintRequest) {
        Complaint existingComplaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ComplaintNotFoundException("Complaint not found with ID: "+complaintId));

        existingComplaint.setPersonName(complaintRequest.getPersonName());
        existingComplaint.setFlatNo(complaintRequest.getFlatNo());
        existingComplaint.setTitle(complaintRequest.getTitle());
        existingComplaint.setDescription(complaintRequest.getDescription());
        existingComplaint.setStatus(ComplaintStatus.valueOf(complaintRequest.getStatus()));

        Complaint updatedComplaint = complaintRepository.save(existingComplaint);
        return entityToDto(updatedComplaint);
    }

    // Delete a complaint
    public void deleteComplaint(long complaintId) {
        Complaint existingComplaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ComplaintNotFoundException("Complaint not found with ID: "+complaintId));

        complaintRepository.delete(existingComplaint);
    }

    // Get complaints by residentId
    public List<ComplaintResponse> getComplaintsByResidentId(long residentId) {
        List<Complaint> complaints = complaintRepository.findByResidentId(residentId);
        return complaints.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Get complaints by societyId
    public List<ComplaintResponse> getComplaintsBySocietyId(long societyId) {
        List<Complaint> complaints = complaintRepository.findBySocietyId(societyId);
        return complaints.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Get all open complaints for a society
    public List<ComplaintResponse> getOpenComplaintsBySocietyId(long societyId) {
        List<Complaint> openComplaints = complaintRepository.findBySocietyIdAndStatus(societyId, ComplaintStatus.OPEN);
        return openComplaints.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Helper methods for converting between entity and DTO
    private Complaint dtoToEntity(ComplaintRequest complaintRequest) {
        Complaint complaint = new Complaint();
        complaint.setPersonName(complaintRequest.getPersonName());
        complaint.setFlatNo(complaintRequest.getFlatNo());
        complaint.setTitle(complaintRequest.getTitle());
        complaint.setDescription(complaintRequest.getDescription());
        complaint.setResidentId(complaintRequest.getResidentId());
        complaint.setSocietyId(complaintRequest.getSocietyId());
        return complaint;
    }

    private ComplaintResponse entityToDto(Complaint complaint) {
        ComplaintResponse complaintResponse = new ComplaintResponse();
        complaintResponse.setComplaintId(complaint.getComplaintId());
        complaintResponse.setPersonName(complaint.getPersonName());
        complaintResponse.setFlatNo(complaint.getFlatNo());
        complaintResponse.setTitle(complaint.getTitle());
        complaintResponse.setDescription(complaint.getDescription());
        complaintResponse.setStatus(complaint.getStatus().name());
        return complaintResponse;
    }
}
