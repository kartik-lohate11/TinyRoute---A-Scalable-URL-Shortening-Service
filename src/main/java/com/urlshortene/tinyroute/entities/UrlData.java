package com.urlshortene.tinyroute.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.urlshortene.tinyroute.enums.Visibility;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
public class UrlData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String shortUrl;

    private String originalUrl;
    private Long totalClicked;

    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    @JoinColumn(name = "user_url_id")
    @JsonBackReference
    private UserData userUrls;

    @CreationTimestamp
    private LocalDateTime createdTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;
}
