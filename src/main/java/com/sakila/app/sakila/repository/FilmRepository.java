package com.sakila.app.sakila.repository;

import com.sakila.app.sakila.model.Film;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmRepository extends JpaRepository<Film, Integer> {

    Page<Film> findAllByOrderByLastUpdateDesc(Pageable pageable);

    Page<Film> findByTitleContainingIgnoreCaseOrderByLastUpdateDesc(String title, Pageable pageable);
}