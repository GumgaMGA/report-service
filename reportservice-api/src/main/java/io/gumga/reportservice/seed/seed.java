package io.gumga.reportservice.seed;

import io.gumga.application.GumgaLoggerService;
import io.gumga.domain.seed.AppSeed;
import io.gumga.reportservice.configuration.security.RegisterApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by willian on 16/11/17.
 */
@Component
class Seed implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private GumgaLoggerService gumgaLoggerService;

    @Autowired
    private RegisterApplication registerApplication;

    private AtomicBoolean started = new AtomicBoolean(false);

    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (started.get()) {
            return;
        }
        started.set(true);
        registerApplication.register();
        gumgaLoggerService.logToFile("Start ", 1);
        for (AppSeed seed : seeds()) {
            try {
                seed.loadSeed();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        gumgaLoggerService.logToFile("End ", 2);

    }

    private List<AppSeed> seeds() {
        List<AppSeed> list = new LinkedList<>();
        return list;
    }

}