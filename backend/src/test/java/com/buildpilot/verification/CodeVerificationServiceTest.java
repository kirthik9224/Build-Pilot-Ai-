// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Unit tests for CodeVerificationService syntax checks and vulnerability validation

package com.buildpilot.verification;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CodeVerificationServiceTest {

    private CodeVerificationService verificationService;

    @BeforeEach
    void setUp() {
        verificationService = new CodeVerificationService();
    }

    @Test
    void testEmptyCodeFails() {
        var res = verificationService.verifyFix("test.js", "", "");
        assertFalse(res.passed());
        assertTrue(res.summary().contains("Failed"));
    }

    @Test
    void testUnbalancedBracesFails() {
        var res = verificationService.verifyFix("Main.java", "int a = 1;", "public void test() {");
        assertFalse(res.passed());
        assertTrue(res.summary().contains("Unbalanced Braces"));
    }

    @Test
    void testUnbalancedParenthesesFails() {
        var res = verificationService.verifyFix("Main.java", "int a = 1;", "if (a > 0 { }");
        assertFalse(res.passed());
        assertTrue(res.summary().contains("Unbalanced Parentheses"));
    }

    @Test
    void testSqlInjectionRemainsFails() {
        String orig = "stmt.executeQuery(\"SELECT * FROM u WHERE id = \" + id);";
        String fix = "stmt.executeQuery(\"SELECT * FROM u WHERE id = \" + id);";
        var res = verificationService.verifyFix("Repo.java", orig, fix);
        assertFalse(res.passed());
        assertTrue(res.summary().contains("SQL injection pattern still present"));
    }

    @Test
    void testValidCleanCodePasses() {
        String orig = "stmt.executeQuery(\"SELECT * FROM u WHERE id = \" + id);";
        String fix = "PreparedStatement ps = conn.prepareStatement(\"SELECT * FROM u WHERE id = ?\");";
        var res = verificationService.verifyFix("Repo.java", orig, fix);
        assertTrue(res.passed());
        assertTrue(res.summary().contains("Verification Passed"));
    }
}
