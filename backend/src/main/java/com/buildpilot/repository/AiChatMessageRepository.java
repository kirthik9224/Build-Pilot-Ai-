// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: AiChatMessage repository for retrieving chat conversation history

package com.buildpilot.repository;

import com.buildpilot.model.AiChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessage, Long> {
    List<AiChatMessage> findByProjectIdAndUserIdOrderByCreatedAtAsc(Long projectId, Long userId);
    List<AiChatMessage> findByProjectIdOrderByCreatedAtAsc(Long projectId);
}
