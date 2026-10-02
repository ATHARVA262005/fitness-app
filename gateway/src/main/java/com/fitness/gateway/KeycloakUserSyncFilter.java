package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        RegisterRequest registerRequest = getUserDetails(token);

        if (userId == null || userId.isEmpty() || "0".equals(userId) || "null".equals(userId) || "undefined".equals(userId)) {
            if (registerRequest != null && registerRequest.getKeycloakId() != null) {
                userId = registerRequest.getKeycloakId();
            }
        }

        if (userId != null && token != null) {
            String finalUserId = userId;
            return userService.validateUser(finalUserId)
                    .flatMap(exist -> {
                        if (!exist) {
                            if (registerRequest != null) {
                                return userService.registerUser(registerRequest)
                                        .onErrorResume(e -> {
                                            log.error("Failed to register user in UserService: {}", e.getMessage());
                                            return Mono.empty();
                                        })
                                        .then(Mono.empty());
                            } else {
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exists, skipping sync for userId: {}", finalUserId);
                            return Mono.empty();
                        }
                    })
                    .onErrorResume(e -> {
                        log.error("Error in KeycloakUserSyncFilter user sync: {}", e.getMessage());
                        return Mono.empty();
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return null;
            }
            String tokenWithoutBearer = token.replace("Bearer ", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            String sub = claims.getStringClaim("sub");
            if (sub == null || sub.isEmpty()) {
                return null;
            }

            String email = claims.getStringClaim("email");
            String username = claims.getStringClaim("preferred_username");
            if (email == null || email.isBlank()) {
                email = (username != null ? username : sub) + "@fitness.com";
            }

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(email);
            registerRequest.setKeycloakId(sub);
            registerRequest.setPassword("dummy@123123");

            String firstName = claims.getStringClaim("given_name");
            String lastName = claims.getStringClaim("family_name");
            registerRequest.setFirstName(firstName != null && !firstName.isBlank() ? firstName : (username != null ? username : "User"));
            registerRequest.setLastName(lastName != null && !lastName.isBlank() ? lastName : "User");
            return registerRequest;
        } catch (Exception e) {
            log.error("Error parsing JWT token in KeycloakUserSyncFilter: {}", e.getMessage());
            return null;
        }
    }
}

