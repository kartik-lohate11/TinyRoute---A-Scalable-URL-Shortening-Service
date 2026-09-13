package com.urlshortene.tinyroute.repository;

import com.urlshortene.tinyroute.entities.UrlData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrlDataRepository extends JpaRepository<UrlData,Long> {

    Optional<UrlData> findByShortUrl(String shortUrl);
}
