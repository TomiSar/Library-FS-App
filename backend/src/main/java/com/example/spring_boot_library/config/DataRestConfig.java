package com.example.spring_boot_library.config;

import com.example.spring_boot_library.entity.Book;
import com.example.spring_boot_library.entity.Message;
import com.example.spring_boot_library.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {
    private final String theAllowedOrigins = "https://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.POST, HttpMethod.PATCH, HttpMethod.PUT, HttpMethod.DELETE};
        config.exposeIdsFor(Book.class);
        config.exposeIdsFor(Review.class);
        config.exposeIdsFor(Message.class);
        disableHttpMethod(Book.class, config, theUnsupportedActions);
        disableHttpMethod(Review.class, config, theUnsupportedActions);
        disableHttpMethod(Message.class, config, theUnsupportedActions);

        // Configure CORS
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethod(Class classFile, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration().forDomainType(classFile)
                .withItemExposure((metData, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metData, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }
}
