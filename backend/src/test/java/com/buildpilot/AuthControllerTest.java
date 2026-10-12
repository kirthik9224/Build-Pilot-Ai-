// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Unit and integration tests for AccountController authentication flows

package com.buildpilot;

import com.buildpilot.model.Project;
import com.buildpilot.model.User;
import com.buildpilot.repository.ProjectRepository;
import com.buildpilot.repository.UserRepository;
import com.buildpilot.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    private UserRepository userRepository;
    private ProjectRepository projectRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private AccountController accountController;

    @BeforeEach
    void setUp() {
        userRepository = Mockito.mock(UserRepository.class);
        projectRepository = Mockito.mock(ProjectRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        jwtTokenProvider = new JwtTokenProvider(
                "testSecretKeyLongEnoughForHmacSha256SecurityValidation123!", 86400000L);
        accountController = new AccountController(
                null, userRepository, projectRepository, passwordEncoder, jwtTokenProvider
        );
    }

    @Test
    void testRegisterSuccess() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        var req = new AccountController.RegisterRequest(
                "Alice", "alice@example.com", "secure123", "DEVELOPER"
        );
        ResponseEntity<Map<String, Object>> response = accountController.register(req);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("alice@example.com", response.getBody().get("email"));
        assertNotNull(response.getBody().get("token"));
    }

    @Test
    void testLoginSuccess() {
        String hashed = passwordEncoder.encode("secretPass");
        User user = new User("Bob", "bob@example.com", hashed, User.Role.DEVELOPER);
        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(user));

        var req = new AccountController.LoginRequest("bob@example.com", "secretPass");
        ResponseEntity<Map<String, Object>> response = accountController.login(req);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("bob@example.com", response.getBody().get("email"));
        assertNotNull(response.getBody().get("token"));
    }

    @Test
    void testLoginFailureWrongPassword() {
        String hashed = passwordEncoder.encode("correctPass");
        User user = new User("Bob", "bob@example.com", hashed, User.Role.DEVELOPER);
        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.of(user));

        var req = new AccountController.LoginRequest("bob@example.com", "wrongPass");
        ResponseEntity<Map<String, Object>> response = accountController.login(req);

        assertEquals(401, response.getStatusCode().value());
    }
}
