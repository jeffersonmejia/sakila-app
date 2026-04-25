package com.sakila.app.sakila.service;

import com.sakila.app.sakila.model.Film;
import com.sakila.app.sakila.repository.FilmRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FilmService {

    private final FilmRepository filmRepository;

    public FilmService(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    public List<Film> findAll() {
        return filmRepository.findAll();
    }

    public Optional<Film> findById(Integer id) {
        return filmRepository.findById(id);
    }

    public Film save(Film film) {
        return filmRepository.save(film);
    }

    public Film update(Integer id, Film film) {
        Film existing = filmRepository.findById(id).orElseThrow();
        existing.setTitle(film.getTitle());
        existing.setDescription(film.getDescription());
        existing.setReleaseYear(film.getReleaseYear());
        existing.setLanguageId(film.getLanguageId());
        existing.setOriginalLanguageId(film.getOriginalLanguageId());
        existing.setRentalDuration(film.getRentalDuration());
        existing.setRentalRate(film.getRentalRate());
        existing.setLength(film.getLength());
        existing.setReplacementCost(film.getReplacementCost());
        existing.setRating(film.getRating());
        existing.setSpecialFeatures(film.getSpecialFeatures());
        return filmRepository.save(existing);
    }

    public void delete(Integer id) {
        filmRepository.deleteById(id);
    }
}