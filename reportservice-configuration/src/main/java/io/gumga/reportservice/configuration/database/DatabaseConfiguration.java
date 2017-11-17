package io.gumga.reportservice.configuration.database;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import io.gumga.core.GumgaValues;
import io.gumga.reportservice.configuration.application.ApplicationConstants;
import io.gumga.domain.CriterionParser;
import io.gumga.domain.GumgaQueryParserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Map;
import java.util.Properties;

@Configuration
public class DatabaseConfiguration {

    @Autowired
    private GumgaValues gumgaValues;

    private Properties properties;

    @Bean
    public DataSource dataSource() {
        return new HikariDataSource(commonConfig());
    }

    private HikariConfig commonConfig() {
        GumgaQueryParserProvider.defaultMap = gumgaQueryParseProviderFactory(getProperties().getProperty("name", "H2"));
        HikariConfig config = new HikariConfig();

        Integer minimumIdle = Integer.valueOf(getProperties().getProperty("dataSource.minimumIdle", "5"));
        Integer maximumPoolSize = Integer.valueOf(getProperties().getProperty("dataSource.maximumPoolSize", "15"));;

        config.setMinimumIdle(minimumIdle);
        config.setMaximumPoolSize(maximumPoolSize);

        config.setInitializationFailFast(true);

        config.setDataSourceClassName(getProperties().getProperty("dataSource.className", "org.h2.jdbcx.JdbcDataSource"));
        config.addDataSourceProperty("url", getProperties().getProperty("dataSource.url", "jdbc:h2:mem:studio;MVCC=true"));
        config.addDataSourceProperty("user", getProperties().getProperty("dataSource.user", "sa"));
        config.addDataSourceProperty("password", getProperties().getProperty("dataSource.password", "sa"));
        return config;
    }

    private Properties getProperties() {
        if(this.gumgaValues == null)
            this.gumgaValues = new ApplicationConstants();

        if(this.properties == null)
            this.properties = this.gumgaValues.getCustomFileProperties();

        return this.properties;
    }

    private Map<Class<?>, CriterionParser> gumgaQueryParseProviderFactory(String name) {
        switch (Database.valueOf(name)) {
            case POSTGRES:
                return GumgaQueryParserProvider.getPostgreSqlLikeMap();
            case MYSQL:
                return GumgaQueryParserProvider.getMySqlLikeMap();
            case ORACLE:
                return GumgaQueryParserProvider.getOracleLikeMap();
            case H2:
                return GumgaQueryParserProvider.getH2LikeMap();
            default: return GumgaQueryParserProvider.getH2LikeMap();
        }
    }
}

enum Database {
    POSTGRES, MYSQL, ORACLE, H2;
}
