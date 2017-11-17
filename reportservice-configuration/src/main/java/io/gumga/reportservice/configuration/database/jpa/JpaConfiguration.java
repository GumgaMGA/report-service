package io.gumga.reportservice.configuration.database.jpa;

import io.gumga.core.GumgaValues;
import io.gumga.reportservice.configuration.application.ApplicationConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import io.gumga.application.GumgaRepositoryFactoryBean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@EnableTransactionManagement(proxyTargetClass = true)
@EnableJpaRepositories(repositoryFactoryBeanClass = GumgaRepositoryFactoryBean.class, basePackages = {
        "io.gumga.reportservice",
        "io.gumga"
})
public class JpaConfiguration {

    @Autowired
    private GumgaValues gumgaValues;

    private Properties properties;

    @Bean
    @Autowired
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("io.gumga", "io.gumga.reportservice");
        factory.setDataSource(dataSource);
        factory.setJpaProperties(commonProperties());
        factory.afterPropertiesSet();
        return factory;
    }

    @Bean
    @Autowired
    public PlatformTransactionManager transactionManager(EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }

    private Properties commonProperties() {
        Properties properties = new Properties();
        properties.setProperty("hibernate.ejb.naming_strategy",getProperties().getProperty("hibernate.ejb.naming_strategy", "org.hibernate.cfg.EJB3NamingStrategy"));
        properties.setProperty("hibernate.show_sql", getProperties().getProperty("hibernate.show_sql", "false"));
        properties.setProperty("hibernate.format_sql", getProperties().getProperty("hibernate.format_sql", "false"));
        properties.setProperty("hibernate.connection.charSet", getProperties().getProperty("hibernate.connection.charSet", "UTF-8"));
        properties.setProperty("hibernate.connection.characterEncoding", getProperties().getProperty("hibernate.connection.characterEncoding", "UTF-8"));
        properties.setProperty("hibernate.connection.useUnicode", getProperties().getProperty("hibernate.connection.useUnicode", "true"));
        properties.setProperty("hibernate.jdbc.batch_size", getProperties().getProperty("hibernate.jdbc.batch_size", "50"));
        properties.setProperty("hibernate.dialect", getProperties().getProperty("hibernate.dialect", "org.hibernate.dialect.H2Dialect"));

        properties.put("hibernate.hbm2ddl.auto", getProperties().getProperty("hibernate.hbm2ddl.auto", "none"));
//        properties.put("liquibase.enabled", "false");
//        properties.put("liquibase.drop-first","false");
//        properties.put("liquibase.change-log","src/main/resources/liquibase/changelog-master.xml");

        return properties;
    }

    private Properties getProperties() {
        if(this.gumgaValues == null)
            this.gumgaValues = new ApplicationConstants();

        if(this.properties == null)
            this.properties = this.gumgaValues.getCustomFileProperties();

        return this.properties;
    }
}
