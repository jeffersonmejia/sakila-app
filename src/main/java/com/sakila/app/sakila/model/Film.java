package com.sakila.app.sakila.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "film")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "film_id")
    private Integer filmId;

    @Column(name = "title", nullable = false, length = 128)
    @NotBlank
    @Size(min = 1, max = 128)
    @Pattern(regexp = "^[\\p{L}0-9\\s.,:;!?()'\"-]+$")
    private String title;

    @Column(name = "description", columnDefinition = "text")
    @Size(max = 1000)
    @Pattern(regexp = "^[\\p{L}0-9\\s.,:;!?()'\"-]*$")
    private String description;

    @Column(name = "release_year")
    @Min(1900)
    @Max(2100)
    private Integer releaseYear;

    @Column(name = "language_id", nullable = false)
    @NotNull
    @Positive
    private Integer languageId;

    @Column(name = "original_language_id")
    @Positive
    private Integer originalLanguageId;

    @Column(name = "rental_duration", nullable = false)
    @NotNull
    @Min(1)
    @Max(365)
    private Integer rentalDuration;

    @Column(name = "rental_rate", nullable = false)
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 5, fraction = 2)
    private BigDecimal rentalRate;

    @Column(name = "length")
    @Min(0)
    @Max(10000)
    private Integer length;

    @Column(name = "replacement_cost", nullable = false)
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 6, fraction = 2)
    private BigDecimal replacementCost;

    @Column(name = "rating")
    private Rating rating;

    @Column(name = "special_features")
    @Size(max = 255)
    @Pattern(regexp = "^[\\p{L}0-9\\s,.-]*$")
    private String specialFeatures;

    @Column(name = "last_update")
    private LocalDateTime lastUpdate;

    @PrePersist
    @PreUpdate
    public void setLastUpdate() {
        this.lastUpdate = LocalDateTime.now();
    }

    public enum Rating {
        G, PG, PG_13, R, NC_17
    }

    public Integer getFilmId() {
        return filmId;
    }

    public void setFilmId(Integer filmId) {
        this.filmId = filmId;
    }

    public String getTitle() {
        return title == null ? null : title.trim();
    }

    public void setTitle(String title) {
        this.title = title == null ? null : title.trim();
    }

    public String getDescription() {
        return description == null ? null : description.trim();
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public Integer getLanguageId() {
        return languageId;
    }

    public void setLanguageId(Integer languageId) {
        this.languageId = languageId;
    }

    public Integer getOriginalLanguageId() {
        return originalLanguageId;
    }

    public void setOriginalLanguageId(Integer originalLanguageId) {
        this.originalLanguageId = originalLanguageId;
    }

    public Integer getRentalDuration() {
        return rentalDuration;
    }

    public void setRentalDuration(Integer rentalDuration) {
        this.rentalDuration = rentalDuration;
    }

    public BigDecimal getRentalRate() {
        return rentalRate;
    }

    public void setRentalRate(BigDecimal rentalRate) {
        this.rentalRate = rentalRate;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public BigDecimal getReplacementCost() {
        return replacementCost;
    }

    public void setReplacementCost(BigDecimal replacementCost) {
        this.replacementCost = replacementCost;
    }

    public Rating getRating() {
        return rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public String getSpecialFeatures() {
        return specialFeatures == null ? null : specialFeatures.trim();
    }

    public void setSpecialFeatures(String specialFeatures) {
        this.specialFeatures = specialFeatures == null ? null : specialFeatures.trim();
    }

    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}