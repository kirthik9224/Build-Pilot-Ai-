// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: AiService interface for code review, debugging, UI synthesis, and chat

package com.buildpilot.ai;

import java.util.Map;

public interface AiService {
    boolean isAvailable();
    String getProviderName();
    Map<String, Object> analyzeCode(String code, String filename, String language);
    Map<String, Object> diagnoseError(String errorType, String stackTrace, String contextCode);
    Map<String, Object> generateUi(String prompt, String layoutPreset);
    String chat(String prompt, String contextFile, String projectSummary);
}
