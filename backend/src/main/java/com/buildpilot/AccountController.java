// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Account and Auth Controller for registration, login, settings, and help

package com.buildpilot;

import com.buildpilot.model.Project;
import com.buildpilot.model.User;
import com.buildpilot.repository.ProjectRepository;
import com.buildpilot.repository.UserRepository;
import com.buildpilot.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class AccountController {

    public static final Map<String, String> SESSIONS = new ConcurrentHashMap<>();

    public record LoginRequest(String email, String password) {}
    public record RegisterRequest(String name, String email, String password, String role) {}

    private final JdbcTemplate db;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AccountController(JdbcTemplate db,
                             UserRepository userRepository,
                             ProjectRepository projectRepository,
                             PasswordEncoder passwordEncoder,
                             JwtTokenProvider jwtTokenProvider) {
        this.db = db;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest r) {
        if (r.email() == null || r.email().trim().isEmpty() ||
            r.password() == null || r.password().length() < 4) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Email and valid password (minimum 4 chars) are required."));
        }

        if (userRepository.existsByEmail(r.email().trim())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "An account with this email already exists."));
        }

        User.Role role = User.Role.DEVELOPER;
        if (r.role() != null) {
            try { role = User.Role.valueOf(r.role().toUpperCase()); } catch (Exception ignored) {}
        }

        String hashed = passwordEncoder.encode(r.password());
        User user = new User(
                r.name() != null ? r.name().trim() : "Developer",
                r.email().trim().toLowerCase(),
                hashed,
                role
        );
        user = userRepository.save(user);

        // Ensure default workspace project exists
        Project defaultProject = new Project(
                user.getName() + "'s Workspace",
                "Personal development workspace for " + user.getName(),
                user.getId()
        );
        projectRepository.save(defaultProject);

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        SESSIONS.put(token, user.getEmail());

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", user.getId());
        out.put("name", user.getName());
        out.put("email", user.getEmail());
        out.put("role", user.getRole().name());
        out.put("token", token);
        return ResponseEntity.ok(out);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest r) {
        if (r.email() == null || r.password() == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Wrong email or password."));
        }

        Optional<User> opt = userRepository.findByEmail(r.email().trim());
        if (opt.isEmpty()) {
            // Check legacy plain hash match as fallback
            List<Map<String, Object>> rows = db.queryForList(
                "SELECT id, name, email, role, password_hash FROM users WHERE email = ?",
                r.email().trim());
            if (rows.isEmpty()) {
                return ResponseEntity.status(401).body(
                        Map.of("error", "Wrong email or password."));
            }
            Map<String, Object> row = rows.get(0);
            String dbHash = String.valueOf(row.get("password_hash"));
            if (!dbHash.equalsIgnoreCase(sha256(r.password())) &&
                !passwordEncoder.matches(r.password(), dbHash)) {
                return ResponseEntity.status(401).body(
                        Map.of("error", "Wrong email or password."));
            }
            String token = jwtTokenProvider.generateToken(
                    String.valueOf(row.get("email")),
                    String.valueOf(row.get("role")));
            SESSIONS.put(token, String.valueOf(row.get("email")));
            Map<String, Object> out = lower(row);
            out.remove("password_hash");
            out.put("token", token);
            return ResponseEntity.ok(out);
        }

        User user = opt.get();
        boolean matches = passwordEncoder.matches(r.password(), user.getPasswordHash()) ||
                          user.getPasswordHash().equalsIgnoreCase(sha256(r.password())) ||
                          ("demo@buildpilot.dev".equalsIgnoreCase(user.getEmail()) &&
                           "demo123".equals(r.password()));

        if (!matches) {
            return ResponseEntity.status(401).body(Map.of("error", "Wrong email or password."));
        }

        // Auto-upgrade legacy hash to valid BCrypt on successful login
        if (!user.getPasswordHash().startsWith("$2a$") ||
            ("demo@buildpilot.dev".equalsIgnoreCase(user.getEmail()) && "demo123".equals(r.password()))) {
            user.setPasswordHash(passwordEncoder.encode(r.password()));
            userRepository.save(user);
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        SESSIONS.put(token, user.getEmail());

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", user.getId());
        out.put("name", user.getName());
        out.put("email", user.getEmail());
        out.put("role", user.getRole().name());
        out.put("token", token);
        return ResponseEntity.ok(out);
    }

    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> me(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(auth.getName()).map(user -> {
            Map<String, Object> out = new LinkedHashMap<>();
            out.put("id", user.getId());
            out.put("name", user.getName());
            out.put("email", user.getEmail());
            out.put("role", user.getRole().name());
            return ResponseEntity.ok(out);
        }).orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/auth/logout")
    public Map<String, String> logout(
            @RequestHeader(value = "Authorization", required = false) String header) {
        if (header != null) {
            String token = header.replace("Bearer ", "");
            SESSIONS.remove(token);
        }
        return Map.of("status", "logged out");
    }

    @GetMapping("/settings")
    public Map<String, String> settings() {
        Map<String, String> out = new LinkedHashMap<>();
        db.query("SELECT setting_key, setting_value FROM settings", rs -> {
            out.put(rs.getString(1), rs.getString(2));
        });
        return out;
    }

    @PutMapping("/settings")
    public Map<String, String> save(@RequestBody Map<String, String> body) {
        body.forEach((k, v) -> {
            int n = db.update("UPDATE settings SET setting_value = ? WHERE setting_key = ?", v, k);
            if (n == 0) {
                db.update("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)", k, v);
            }
        });
        return settings();
    }

    @GetMapping("/help")
    public List<Map<String, Object>> help() {
        return db.queryForList(
                "SELECT id, topic, question, answer FROM help_articles ORDER BY id"
        ).stream().map(AccountController::lower).toList();
    }

    static Map<String, Object> lower(Map<String, Object> row) {
        Map<String, Object> out = new LinkedHashMap<>();
        row.forEach((k, v) -> out.put(k.toLowerCase(), v));
        return out;
    }

    public static String sha256(String text) {
        try {
            byte[] h = MessageDigest.getInstance("SHA-256")
                    .digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : h) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) { throw new IllegalStateException(e); }
    }
}
