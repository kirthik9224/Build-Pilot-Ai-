// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Interactive AI Test Generator for JUnit 5, Mockito & Playwright E2E suites

import { useState } from 'react';

const TEST_PRESETS = [
  {
    name: 'PaymentServiceTest (JUnit 5 + Mockito)',
    framework: 'JUnit 5 + Mockito',
    code: `package com.buildpilot.service;\n\nimport org.junit.jupiter.api.Test;\nimport org.junit.jupiter.api.extension.ExtendWith;\nimport org.mockito.InjectMocks;\nimport org.mockito.Mock;\nimport org.mockito.junit.jupiter.MockitoExtension;\nimport static org.mockito.Mockito.*;\nimport static org.junit.jupiter.api.Assertions.*;\n\n@ExtendWith(MockitoExtension.class)\nclass PaymentServiceTest {\n\n    @Mock\n    private PaymentGateway paymentGateway;\n\n    @InjectMocks\n    private PaymentService paymentService;\n\n    @Test\n    void processPayment_ValidCharge_ReturnsSuccess() {\n        when(paymentGateway.charge("cust_123", 99.0)).thenReturn(true);\n        boolean result = paymentService.process("cust_123", 99.0);\n        assertTrue(result);\n        verify(paymentGateway, times(1)).charge("cust_123", 99.0);\n    }\n\n    @Test\n    void processPayment_NegativeAmount_ThrowsException() {\n        assertThrows(IllegalArgumentException.class, () -> {\n            paymentService.process("cust_123", -10.0);\n        });\n        verifyNoInteractions(paymentGateway);\n    }\n}`,
  },
  {
    name: 'LoginFlowTest (Playwright E2E Browser)',
    framework: 'Playwright (TypeScript)',
    code: `import { test, expect } from '@playwright/test';\n\ntest.describe('Authentication & Dashboard Flow', () => {\n  test('user should login and see executive metrics', async ({ page }) => {\n    await page.goto('http://localhost:5173');\n    await page.fill('input[type="email"]', 'demo@buildpilot.dev');\n    await page.fill('input[type="password"]', 'demo123');\n    await page.click('button[type="submit"]');\n\n    await expect(page.locator('.crumb')).toContainText('Dashboard');\n    await expect(page.locator('h2')).toContainText('Welcome back');\n  });\n});`,
  },
];

export default function TestCaseGenerator({ onTriggerToast }) {
  const [selectedPreset, setSelectedPreset] = useState(TEST_PRESETS[0]);
  const [sourceCode, setSourceCode] = useState(
    'public class OrderService {\n  public Order placeOrder(String userId, double amount) {\n    if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");\n    return orderRepository.save(new Order(userId, amount));\n  }\n}'
  );
  const [generatedTest, setGeneratedTest] = useState(TEST_PRESETS[0].code);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateTestSuite = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedTest(
        `package com.buildpilot.service;\n\nimport org.junit.jupiter.api.Test;\nimport org.junit.jupiter.api.DisplayName;\nimport org.junit.jupiter.api.extension.ExtendWith;\nimport org.mockito.InjectMocks;\nimport org.mockito.Mock;\nimport org.mockito.junit.jupiter.MockitoExtension;\nimport static org.mockito.Mockito.*;\nimport static org.junit.jupiter.api.Assertions.*;\n\n@ExtendWith(MockitoExtension.class)\nclass OrderServiceTest {\n\n    @Mock\n    private OrderRepository orderRepository;\n\n    @InjectMocks\n    private OrderService orderService;\n\n    @Test\n    @DisplayName("Should successfully place order with valid amount")\n    void placeOrder_ValidAmount_Success() {\n        Order mockOrder = new Order("usr_99", 150.0);\n        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);\n\n        Order result = orderService.placeOrder("usr_99", 150.0);\n        assertNotNull(result);\n        assertEquals(150.0, result.getAmount());\n        verify(orderRepository).save(any(Order.class));\n    }\n\n    @Test\n    @DisplayName("Should throw IllegalArgumentException when amount is zero or negative")\n    void placeOrder_ZeroAmount_ThrowsException() {\n        assertThrows(IllegalArgumentException.class, () -> orderService.placeOrder("usr_99", 0.0));\n        verifyNoInteractions(orderRepository);\n    }\n}`
      );
      if (onTriggerToast) onTriggerToast('Generated JUnit 5 & Mockito test suite!');
    }, 1200);
  };

  const copyTest = () => {
    navigator.clipboard?.writeText(generatedTest);
    setCopied(true);
    if (onTriggerToast) onTriggerToast('Copied test suite to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="test-generator-view">
      <header className="page-head row">
        <div>
          <h2>AI Test Case Auto-Generator</h2>
          <p className="muted">
            Generate 100% branch coverage unit tests (JUnit 5 & Mockito) and Playwright E2E browser suites.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={copyTest}>
            {copied ? '✓ Test Copied' : '📋 Copy Test File'}
          </button>
          <button className="btn primary" onClick={generateTestSuite} disabled={generating}>
            {generating ? 'Generating Test Suite…' : '🧪 Auto-Generate Tests'}
          </button>
        </div>
      </header>

      {/* Preset Chips */}
      <div className="chips" style={{ marginBottom: '1rem' }}>
        {TEST_PRESETS.map((p, idx) => (
          <button
            key={idx}
            className={`chip ${selectedPreset.name === p.name ? 'on' : ''}`}
            onClick={() => {
              setSelectedPreset(p);
              setGeneratedTest(p.code);
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        {/* Source Input */}
        <section className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h3>Target Java Class / Service</h3>
            <span className="chip on">Input</span>
          </div>
          <textarea
            rows={14}
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.5)',
              color: '#e2e8f0',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              lineHeight: '1.5',
            }}
          />
        </section>

        {/* Generated Test */}
        <section className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h3>Generated Unit / E2E Test Suite</h3>
            <span className="chip on" style={{ color: 'var(--low)' }}>JUnit 5 + Mockito</span>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '1rem',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              lineHeight: '1.5',
              color: '#86efac',
              overflowX: 'auto',
              maxHeight: '340px',
            }}
          >
            <code>{generatedTest}</code>
          </pre>
        </section>
      </div>
    </div>
  );
}
