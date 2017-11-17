package io.gumga.reportservice.configuration.cors;

import io.gumga.presentation.CorsFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CorsConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(CorsConfiguration.class);

    @Bean
    public CorsFilter getCorsFilter() {
        return new CorsFilter();
    }

    @Bean
    public FilterRegistrationBean someFilterRegistration() {
        LOGGER.info("CorsFilter Started");
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(getCorsFilter());
        registration.addUrlPatterns("/*");
        registration.setName("CorsFilter");
        registration.setOrder(1);
        registration.setAsyncSupported(true);
        return registration;
    }
}
