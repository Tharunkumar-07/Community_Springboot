package com.capstone.SocietyManagementService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class SecurityDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long securityId;
    private String securityName;
    private String phoneNo;
    private String blockNo;

    // Many security guards belong to one society
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "society_id")
    private Society society;
}