package com.sakila.app.sakila.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RatingConverter implements AttributeConverter<Film.Rating, String> {

    @Override
    public String convertToDatabaseColumn(Film.Rating rating) {
        if (rating == null) return null;
        return rating.name().replace("_", "-");
    }

    @Override
    public Film.Rating convertToEntityAttribute(String dbValue) {
        if (dbValue == null) return null;
        return Film.Rating.valueOf(dbValue.replace("-", "_"));
    }
}