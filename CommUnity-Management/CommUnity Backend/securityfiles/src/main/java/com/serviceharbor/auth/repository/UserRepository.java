package com.serviceharbor.auth.repository;

import com.serviceharbor.auth.model.Role;
import com.serviceharbor.auth.model.Users;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends CrudRepository<Users, Integer> {
    Optional<Users> findByEmail(String email);
    Users findByRoleAndEmail(Role role, String email);
}