package com.sakila.app.sakila;

import com.zaxxer.hikari.HikariDataSource;
import com.zaxxer.hikari.HikariPoolMXBean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;

@SpringBootApplication
public class SakilaApplication {

    public static void main(String[] args) {
        SpringApplication.run(SakilaApplication.class, args);
    }

    @Bean
    public CommandLineRunner monitorPool(DataSource dataSource) {
        return args -> {
            HikariDataSource hikari = (HikariDataSource) dataSource;
            HikariPoolMXBean pool = hikari.getHikariPoolMXBean();

            while (true) {
                System.out.println("Total: " + pool.getTotalConnections());
                System.out.println("Activas: " + pool.getActiveConnections());
                System.out.println("Idle: " + pool.getIdleConnections());
                System.out.println("Esperando: " + pool.getThreadsAwaitingConnection());
                System.out.println("-----");

                Thread.sleep(3000);
            }
        };
    }
}