// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: DesignController for generating accessible and responsive React UI components

package com.buildpilot.controller;

import com.buildpilot.ai.AiService;
import com.buildpilot.model.DesignGeneration;
import com.buildpilot.repository.DesignGenerationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/design")
public class DesignController {

    private final DesignGenerationRepository designRepository;
    private final AiService aiService;

    public DesignController(DesignGenerationRepository designRepository,
                            AiService aiService) {
        this.designRepository = designRepository;
        this.aiService = aiService;
    }

    public record GenerateUiRequest(
            Long projectId,
            String prompt,
            String layoutPreset
    ) {}

    @PostMapping("/generate")
    public ResponseEntity<DesignGeneration> generate(@RequestBody GenerateUiRequest req) {
        if (req.prompt() == null || req.prompt().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Long projId = req.projectId() != null ? req.projectId() : 1L;
        Map<String, Object> output = aiService.generateUi(req.prompt(), req.layoutPreset());

        DesignGeneration gen = new DesignGeneration();
        gen.setProjectId(projId);
        gen.setPrompt(req.prompt());
        gen.setLayoutPreset(req.layoutPreset() != null ? req.layoutPreset() : "modern");
        gen.setComponentName((String) output.get("componentName"));
        gen.setGeneratedJsx((String) output.get("jsx"));
        gen.setGeneratedCss((String) output.get("css"));

        return ResponseEntity.ok(designRepository.save(gen));
    }

    @GetMapping("/history")
    public List<DesignGeneration> history(
            @RequestParam(defaultValue = "1") Long projectId) {
        return designRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }
}
