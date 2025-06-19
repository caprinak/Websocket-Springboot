package io.satori.boot; // Or wherever your security config is

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity // Make sure Spring Security is enabled
public class SecurityConfig {
    @Autowired
    CorsConfigurationSource corsConfigurationSource;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {


        http
                // Disable CSRF protection for the WebSocket endpoint
                // WebSocket/SockJS handshakes don't typically include CSRF tokens
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/ws/**") // Adjust path if needed
                ).cors(cors -> cors.configurationSource(corsConfigurationSource)) // Apply CORS configuration
                // Configure authorization rules
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/ws/**").permitAll() // Allow all requests to your WebSocket endpoint
                        // .requestMatchers("/api/**").authenticated() // Example: require auth for other API paths
                        .anyRequest().authenticated() // Require authentication for any other request by default
                );
        // You might need to configure session management, login, etc.
        // depending on your overall security requirements.

        return http.build();
    }

    // If you have other security configurations (like password encoders,
    // authentication providers), they would also go in this class.
}