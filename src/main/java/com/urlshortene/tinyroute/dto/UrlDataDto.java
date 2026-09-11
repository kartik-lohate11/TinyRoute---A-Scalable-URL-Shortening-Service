package com.urlshortene.tinyroute.dto;

import com.urlshortene.tinyroute.entities.UrlData;
import com.urlshortene.tinyroute.entities.UserData;
import com.urlshortene.tinyroute.enums.Visibility;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlDataDto {
    private Long id;
    private String shortUrl;
    private String originalUrl;
    private Long totalClicked;
    private Visibility visibility;
    private UserData userUrls;
    private LocalDateTime createdTime;
    private LocalDateTime updateTime;

    public static UrlDataDto toDto(UrlData url) {

        UrlDataDto dto = new UrlDataDto();

        dto.setId(url.getId());
        dto.setShortUrl(url.getShortUrl());
        dto.setOriginalUrl(url.getOriginalUrl());
        dto.setTotalClicked(url.getTotalClicked());
        dto.setVisibility(url.getVisibility());

        if (url.getUserUrls() != null) {
            dto.setId(url.getUserUrls().getId());
        }

        dto.setCreatedTime(url.getCreatedTime());
        dto.setUpdateTime(url.getUpdateTime());

        return dto;
    }


    public UrlData toEntity() {

        UrlData url = new UrlData();

        url.setId(this.id);
        url.setShortUrl(this.shortUrl);
        url.setOriginalUrl(this.originalUrl);
        url.setTotalClicked(this.totalClicked);
        url.setVisibility(this.visibility);

        /*
         * Don't set UserData here.
         *
         * User should normally be fetched from the database
         * inside your Service layer using userId.
         */

        url.setCreatedTime(this.createdTime);
        url.setUpdateTime(this.updateTime);

        return url;
    }
}
