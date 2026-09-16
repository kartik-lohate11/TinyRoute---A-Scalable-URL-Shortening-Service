package com.urlshortene.tinyroute.repository;

import com.urlshortene.tinyroute.dto.UrlDataDto;
import com.urlshortene.tinyroute.entities.UrlData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlDataRepository extends JpaRepository<UrlData,Long> {

    Optional<UrlData> findByShortUrl(String shortUrl);
    Optional<UrlData> findByOriginalUrlAndUserUrlsId(String originalUrl, Long userId);

    @Query("""
        SELECT new com.urlshortene.tinyroute.dto.UrlDataDto(
            u.id,
            u.shortUrl,
            u.originalUrl,
            u.totalClicked,
            u.visibility,
            u.userUrls.id,
            u.createdTime,
            u.updateTime
        )
        FROM UrlData u
        WHERE u.userUrls.id = :userId
    """)
    List<UrlDataDto> findAllUrlByUserId(@Param("userId") Long userId);
}
