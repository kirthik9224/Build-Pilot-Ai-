// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Interactive first-time developer onboarding & guided tour modal

import { useState } from 'react';

const STEPS = [
  {
    icon: '✨',
    title: 'Welcome to BuildPilot AI Pro!',
    subtitle: 'Your production-style, AI-powered developer copilot and platform assistant.',
    body: 'BuildPilot automates code reviews, diagnoses stack traces, generates React UI from prompts, schedules sprints, and monitors live microservice health.',
    highlight: 'Let us show you the three superpowers of the platform.',
  },
  {
    icon: '🛡️',
    title: '1. AI Code Review & Static Analysis',
    subtitle: 'Catch bugs and OWASP security flaws before production.',
    body: 'Upload any Java or JavaScript source file or entire folder. BuildPilot flags issues with exact line numbers, severity tags, and generates side-by-side Git diffs that you can accept or reject with one click.',
    highlight: 'Try it anytime in the Code Review Center or press ⌘K.',
  },
  {
    icon: '⚡',
    title: '2. Error Diagnosis & Automated Test Verification',
    subtitle: 'Fix stack traces with zero regressions.',
    body: 'Paste any Java exception, Spring Boot stack trace, or frontend console log. The AI identifies the root cause, proposes a code patch, and runs real test verifications inside an isolated sandbox.',
    highlight: 'Issues are never marked as resolved until tests actually pass.',
  },
  {
    icon: '💬',
    title: '3. Omnipresent Copilot & Command Palette',
    subtitle: 'ChatGPT and Gemini-style intelligence anywhere.',
    body: 'Click the floating "✨ AI Copilot" badge at the bottom-right corner or press Ctrl+K anywhere to launch actions, execute SQL queries, or speak hands-free with Voice Dictation.',
    highlight: 'You are ready to build! Choose any project from the top bar.',
  },
];

export default function OnboardingModal({ isOpen, onClose, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((p) => p + 1);
    }
  };

  const prev = () => {
    setCurrentStep((p) => Math.max(0, p - 1));
  };

  return (
    <div
      className="onboarding-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        background: 'rgba(5, 7, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="glass onboarding-card"
        style={{
          width: 'min(560px, 100%)',
          padding: '2.2rem',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #0e122b, #151838)',
          border: '1px solid rgba(160,150,255,0.35)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.25)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>{step.icon}</div>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.3rem' }}>{step.title}</h2>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: '1.2rem' }}>
          {step.subtitle}
        </p>

        <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: '#e2e8f0', margin: '0 0 1rem' }}>
          {step.body}
        </p>

        <div
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '10px',
            padding: '0.6rem 1rem',
            fontSize: '0.82rem',
            color: 'var(--cyan)',
            marginBottom: '1.8rem',
          }}
        >
          💡 {step.highlight}
        </div>

        {/* Indicator dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '1.5rem' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: i === currentStep ? 'var(--indigo)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentStep > 0 ? (
            <button className="btn" onClick={prev}>
              ← Back
            </button>
          ) : (
            <button className="btn" onClick={onClose} style={{ opacity: 0.7 }}>
              Skip Tour
            </button>
          )}

          <button className="btn primary" onClick={next} style={{ padding: '0.6rem 1.8rem' }}>
            {isLast ? 'Get Started 🚀' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
