package io.gumga.reportservice.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseAutoConfiguration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication(scanBasePackages = {
        "io.gumga",
        "io.gumga.reportservice",
        "io.gumga.reportservice.configuration.security"
})
//@EnableAutoConfiguration(exclude = LiquibaseAutoConfiguration.class) // Desative para usar liquibase
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}

