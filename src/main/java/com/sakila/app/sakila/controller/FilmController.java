package com.sakila.app.sakila.controller;

import com.sakila.app.sakila.model.Film;
import com.sakila.app.sakila.service.FilmService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/films")
public class FilmController {

    private final FilmService filmService;

    public FilmController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping
    public List<Film> getAll() {
        return filmService.findAll();
    }

    @GetMapping("/{id}")
    public Film getById(@PathVariable Integer id) {
        return filmService.findById(id).orElseThrow();
    }

    @PostMapping
    public Film create(@RequestBody Film film) {
        return filmService.save(film);
    }

    @PutMapping("/{id}")
    public Film update(@PathVariable Integer id, @RequestBody Film film) {
        return filmService.update(id, film);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        filmService.delete(id);
    }
}