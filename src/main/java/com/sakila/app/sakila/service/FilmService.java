package com.sakila.app.sakila.service;

import com.sakila.app.sakila.model.Film;
import com.sakila.app.sakila.repository.FilmRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FilmService {

    private final FilmRepository filmRepository;

    private static final int MAX_PAGE_SIZE = 50;
    private static final int DEFAULT_PAGE_SIZE = 8;

    public FilmService(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    private Pageable buildPageable(int page, int size) {
        int safePage = Math.max(page, 0);

        int safeSize = size <= 0
                ? DEFAULT_PAGE_SIZE
                : Math.min(size, MAX_PAGE_SIZE);

        return PageRequest.of(safePage, safeSize);
    }

    public Page<Film> findAll(int page, int size) {
        return filmRepository.findAll(buildPageable(page, size));
    }

    public Page<Film> search(String title, int page, int size) {
        return filmRepository.findByTitleContainingIgnoreCase(
                title,
                buildPageable(page, size)
        );
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