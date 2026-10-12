// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: CodeReviewController handling review submissions, findings, and diffs

package com.buildpilot.controller;

import com.buildpilot.ai.AiService;
import com.buildpilot.model.CodeReview;
import com.buildpilot.model.ReviewFinding;
import com.buildpilot.repository.CodeReviewRepository;
import com.buildpilot.repository.ReviewFindingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reviews")
public class CodeReviewController {

    private final CodeReviewRepository reviewRepository;
    private final ReviewFindingRepository findingRepository;
    private final AiService aiService;

    public CodeReviewController(CodeReviewRepository reviewRepository,
                                ReviewFindingRepository findingRepository,
                                AiService aiService) {
        this.reviewRepository = reviewRepository;
        this.findingRepository = findingRepository;
        this.aiService = aiService;
    }

    public record SubmitReviewRequest(
            Long projectId,
            String title,
            String language,
            String filePath,
            String sourceCode
    ) {}

    public record UpdateFindingRequest(
            String status, // ACCEPTED, REJECTED, PENDING
            String suggestedCorrection
    ) {}

    @PostMapping
    @Transactional
    public ResponseEntity<CodeReview> submitReview(@RequestBody SubmitReviewRequest req,
                                                   Authentication auth) {
        if (req.sourceCode() == null || req.sourceCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Long projId = req.projectId() != null ? req.projectId() : 1L;
        CodeReview review = new CodeReview();
        review.setProjectId(projId);
        review.setTitle(req.title() != null ? req.title() : "Code Analysis Review");
        review.setLanguage(req.language() != null ? req.language() : "java");
        review.setFilePath(req.filePath() != null ? req.filePath() : "Main.java");
        review.setSourceCode(req.sourceCode());
        review.setStatus(CodeReview.Status.COMPLETED);

        Map<String, Object> analysis = aiService.analyzeCode(
                req.sourceCode(), req.filePath(), req.language()
        );
        review.setSummary((String) analysis.get("summary"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rawFindings = (List<Map<String, Object>>) analysis.get("findings");
        if (rawFindings != null) {
            for (Map<String, Object> rf : rawFindings) {
                ReviewFinding f = new ReviewFinding();
                f.setSeverity((String) rf.get("severity"));
                f.setCategory((String) rf.get("category"));
                f.setFilePath((String) rf.get("filePath"));
                f.setLineStart((Integer) rf.get("lineStart"));
                f.setLineEnd((Integer) rf.get("lineEnd"));
                f.setExplanation((String) rf.get("explanation"));
                f.setSuggestedCorrection((String) rf.get("suggestedCorrection"));
                f.setProposedDiff((String) rf.get("proposedDiff"));
                f.setSource(ReviewFinding.Source.valueOf((String) rf.get("source")));
                f.setStatus(ReviewFinding.Status.PENDING);
                review.addFinding(f);
            }
        }

        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping
    public List<CodeReview> listReviews(
            @RequestParam(defaultValue = "1") Long projectId) {
        return reviewRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CodeReview> getReview(@PathVariable Long id) {
        return reviewRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/findings/{findingId}")
    @Transactional
    public ResponseEntity<ReviewFinding> updateFinding(
            @PathVariable Long findingId,
            @RequestBody UpdateFindingRequest req) {
        return findingRepository.findById(findingId).map(f -> {
            if (req.status() != null) {
                try {
                    f.setStatus(ReviewFinding.Status.valueOf(req.status().toUpperCase()));
                } catch (Exception ignored) {}
            }
            if (req.suggestedCorrection() != null) {
                f.setSuggestedCorrection(req.suggestedCorrection());
            }
            return ResponseEntity.ok(findingRepository.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }
}
