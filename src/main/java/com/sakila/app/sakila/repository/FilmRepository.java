package com.sakila.app.sakila.repository;

import com.sakila.app.sakila.model.Film;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmRepository extends JpaRepository<Film, Integer> {

    Page<Film> findAll(Pageable pageable);

    Page<Film> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}