// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: AiChatController providing project-aware developer conversations and assistance

package com.buildpilot.controller;

import com.buildpilot.ai.AiService;
import com.buildpilot.model.AiChatMessage;
import com.buildpilot.model.User;
import com.buildpilot.repository.AiChatMessageRepository;
import com.buildpilot.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
public class AiChatController {

    private final AiChatMessageRepository chatRepository;
    private final UserRepository userRepository;
    private final AiService aiService;

    public AiChatController(AiChatMessageRepository chatRepository,
                            UserRepository userRepository,
                            AiService aiService) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    public record SendMessageRequest(
            Long projectId,
            String message,
            String contextFile
    ) {}

    @GetMapping("/history")
    public List<AiChatMessage> getHistory(
            @RequestParam(defaultValue = "1") Long projectId) {
        return chatRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
    }

    @PostMapping("/send")
    @Transactional
    public ResponseEntity<Map<String, Object>> sendMessage(
            @RequestBody SendMessageRequest req,
            Authentication auth) {
        if (req.message() == null || req.message().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Long userId = null;
        if (auth != null) {
            Optional<User> u = userRepository.findByEmail(auth.getName());
            if (u.isPresent()) userId = u.get().getId();
        }

        Long projId = req.projectId() != null ? req.projectId() : 1L;

        // Save user message
        AiChatMessage userMsg = new AiChatMessage(
                projId, userId, AiChatMessage.Role.USER,
                req.message().trim(), req.contextFile()
        );
        chatRepository.save(userMsg);

        // Generate response
        String replyText = aiService.chat(
                req.message().trim(),
                req.contextFile(),
                "BuildPilot AI Pro workspace (Project ID: " + projId + ")"
        );

        AiChatMessage assistantMsg = new AiChatMessage(
                projId, userId, AiChatMessage.Role.ASSISTANT,
                replyText, req.contextFile()
        );
        chatRepository.save(assistantMsg);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("userMessage", userMsg);
        out.put("assistantMessage", assistantMsg);
        out.put("aiAvailable", aiService.isAvailable());
        out.put("provider", aiService.getProviderName());
        return ResponseEntity.ok(out);
    }

    @DeleteMapping("/history")
    @Transactional
    public ResponseEntity<?> clearHistory(
            @RequestParam(defaultValue = "1") Long projectId) {
        List<AiChatMessage> list = chatRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
        chatRepository.deleteAll(list);
        return ResponseEntity.ok(Map.of("cleared", list.size()));
    }
}
