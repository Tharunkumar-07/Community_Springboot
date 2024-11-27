package com.capstone.SocietyManagementService.controller;

import com.capstone.SocietyManagementService.dto.flatdtos.Flatdto;
import com.capstone.SocietyManagementService.service.FlatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/management-service/flats")
public class FlatController {
    @Autowired
    private FlatService flatService;

    @PostMapping()
    public ResponseEntity<Flatdto> createFlat(@RequestBody Flatdto flatDto){
        return new ResponseEntity<>(flatService.createFlat(flatDto), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<Flatdto>> getAllFlats(){
        return new ResponseEntity<>(flatService.getAllFlat(), HttpStatus.OK);
    }

    @GetMapping("/{flatId}")
    public ResponseEntity<Flatdto> getFlatById(@PathVariable("flatId") long flatId){
        return new ResponseEntity<>(flatService.getFlatById(flatId), HttpStatus.OK);
    }

    @DeleteMapping("/detele-flat/{flatId}")
    public ResponseEntity<String> deleteFlat(@PathVariable("flatId") long flatId){
        return new ResponseEntity<>(flatService.deleteFlat(flatId), HttpStatus.OK);
    }
}
