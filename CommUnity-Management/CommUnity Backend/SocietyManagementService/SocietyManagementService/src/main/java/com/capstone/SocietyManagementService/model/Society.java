package com.capstone.SocietyManagementService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="society")
public class Society {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phoneNo;
    private String societyName;
    private String societyAddress;
    private String city;
    private String district;
    private String postal;
    private String email;

    // One Society can have multiple Flats
    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Flat> flats;

    // One Society can have multiple EmergencyContacts
    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<EmergencyContact> emergencyContacts = new ArrayList<>();

    // One Society can have multiple SecurityDetails
    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SecurityDetails> securityDetails = new ArrayList<>();

    // One Society can have multiple Parking spots
    @OneToMany(mappedBy = "society", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Parking> parkingSpots = new ArrayList<>();
}