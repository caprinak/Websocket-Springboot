package io.satori.boot; // Or your actual package

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketBrokerConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue", "/user"); // Added /user for user-specific messages
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user"); // Important for user-specific destinations
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is where you need to add setAllowedOrigins
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:4200") // Allow your Angular app's origin
                .withSockJS();

        // If you have other endpoints, configure them similarly
        // registry.addEndpoint("/another-ws-endpoint")
        //         .setAllowedOrigins("http://localhost:4200", "https://your-other-domain.com")
        //         .withSockJS();
    }
}