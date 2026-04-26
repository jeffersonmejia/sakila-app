package com.sakila.app.sakila.repository;

import com.sakila.app.sakila.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, Integer> {}