// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: DebuggingController for error diagnosis, proposed fixes, and verification tests

package com.buildpilot.controller;

import com.buildpilot.ai.AiService;
import com.buildpilot.model.DebuggingSession;
import com.buildpilot.model.ProposedFix;
import com.buildpilot.repository.DebuggingSessionRepository;
import com.buildpilot.repository.ProposedFixRepository;
import com.buildpilot.verification.CodeVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/debugging")
public class DebuggingController {

    private final DebuggingSessionRepository sessionRepository;
    private final ProposedFixRepository fixRepository;
    private final AiService aiService;
    private final CodeVerificationService verificationService;

    public DebuggingController(DebuggingSessionRepository sessionRepository,
                               ProposedFixRepository fixRepository,
                               AiService aiService,
                               CodeVerificationService verificationService) {
        this.sessionRepository = sessionRepository;
        this.fixRepository = fixRepository;
        this.aiService = aiService;
        this.verificationService = verificationService;
    }

    public record DiagnoseRequest(
            Long projectId,
            String title,
            String errorType,
            String stackTrace,
            String contextCode,
            String targetFile
    ) {}

    public record VerifyFixRequest(
            String targetFile,
            String originalCode,
            String proposedCode
    ) {}

    @PostMapping("/diagnose")
    @Transactional
    public ResponseEntity<DebuggingSession> diagnose(@RequestBody DiagnoseRequest req) {
        if (req.stackTrace() == null || req.stackTrace().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Long projId = req.projectId() != null ? req.projectId() : 1L;
        DebuggingSession session = new DebuggingSession();
        session.setProjectId(projId);
        session.setTitle(req.title() != null ? req.title() : "Exception Diagnostics");
        session.setErrorType(req.errorType() != null ? req.errorType() : "Runtime Exception");
        session.setStackTrace(req.stackTrace());
        session.setContextCode(req.contextCode());

        Map<String, Object> diagnosis = aiService.diagnoseError(
                req.errorType(), req.stackTrace(), req.contextCode()
        );

        session.setRootCause((String) diagnosis.get("rootCause"));
        session.setStepsToFix((String) diagnosis.get("stepsToFix"));
        session.setStatus(DebuggingSession.Status.OPEN);

        ProposedFix fix = new ProposedFix();
        fix.setDescription("Recommended fix for: " + session.getTitle());
        fix.setTargetFile(req.targetFile() != null ? req.targetFile() : "Application.java");
        fix.setOriginalSnippet(req.contextCode() != null ? req.contextCode() : "// original code");
        fix.setFixedSnippet((String) diagnosis.get("proposedPatch"));
        fix.setDiffPatch(
                "- " + fix.getOriginalSnippet() + "\n+ " + fix.getFixedSnippet()
        );
        fix.setVerified(false);
        fix.setVerificationPassed(false);
        fix.setTestOutput("Pending verification run.");

        session.addFix(fix);
        return ResponseEntity.ok(sessionRepository.save(session));
    }

    @PostMapping("/fixes/{fixId}/verify")
    @Transactional
    public ResponseEntity<ProposedFix> verifyFix(
            @PathVariable Long fixId,
            @RequestBody(required = false) VerifyFixRequest req) {
        return fixRepository.findById(fixId).map(fix -> {
            String target = req != null && req.targetFile() != null ?
                    req.targetFile() : fix.getTargetFile();
            String orig = req != null && req.originalCode() != null ?
                    req.originalCode() : fix.getOriginalSnippet();
            String proposed = req != null && req.proposedCode() != null ?
                    req.proposedCode() : fix.getFixedSnippet();

            CodeVerificationService.VerificationResult result =
                    verificationService.verifyFix(target, orig, proposed);

            fix.setVerified(true);
            fix.setVerificationPassed(result.passed());
            fix.setTestOutput(result.summary() + "\n" + result.details() +
                    "\nExecution time: " + result.executionTimeMs() + "ms");

            if (result.passed() && fix.getSession() != null) {
                fix.getSession().setStatus(DebuggingSession.Status.VERIFIED);
            }

            return ResponseEntity.ok(fixRepository.save(fix));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<DebuggingSession> listSessions(
            @RequestParam(defaultValue = "1") Long projectId) {
        return sessionRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DebuggingSession> getSession(@PathVariable Long id) {
        return sessionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
