package com.sakila.app.sakila.repository;

import com.sakila.app.sakila.model.Film;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmRepository extends JpaRepository<Film, Integer> {
}