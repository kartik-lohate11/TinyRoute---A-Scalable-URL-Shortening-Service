package com.urlshortene.tinyroute.repository;

import com.urlshortene.tinyroute.dto.UrlDataDto;
import com.urlshortene.tinyroute.entities.UserData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDataRepository extends JpaRepository<UserData, Long> {
    Optional<UserData> findByMail(String mail);

    boolean existsByMail(String mail);
}
