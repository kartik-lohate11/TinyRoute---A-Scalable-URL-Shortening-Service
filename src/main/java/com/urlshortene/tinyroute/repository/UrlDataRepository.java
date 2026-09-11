package com.urlshortene.tinyroute.repository;

import com.urlshortene.tinyroute.entities.UrlData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UrlDataRepository extends JpaRepository<UrlData,Long> {
}
