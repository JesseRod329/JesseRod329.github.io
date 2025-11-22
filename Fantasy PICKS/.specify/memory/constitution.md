# Fantasy Wrestling Booking Constitution
<!-- Sync Impact Report:
Version: 0.0.1 → 2.0.0 (Major version change - foundational principles and governance model)
Modified principles: All principles rewritten to focus on mobile-first wrestling prediction platform
Added sections: Security & Privacy, Performance Standards, Accessibility & Mobile-First
Removed sections: All old template content replaced
Templates requiring updates: 
  ✅ plan-template.md - Updated ✓
  ✅ spec-template.md - Updated ✓  
  ✅ tasks-template.md - Updated ✓
  Follow-up TODOs: None
-->

## Core Principles

### I. Mobile-First Development
Mobile-first approach mandated: All features must function perfectly on mobile devices before desktop optimization. Touch-friendly controls, responsive layouts, and single-thumb operationality required. Desktop views are secondary enhancements, not primary interfaces.

### II. Trust-First Architecture
All scoring logic MUST be server-side derived; zero tolerance for client-side manipulation. Frontend is display-only, backend enforces all business rules and calculations. Leaderboards, rankings, and predictions locked server-side with row-level security (RLS).

### III. Performance Standards
P95 Time to Interactive (TTI) mandate under 3.5 seconds on 4G mid-range devices. JavaScript bundle under 200KB for initial parse. Core Web Vitals: LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1. No performance degradation for accessiblity features.

### IV. Security & Privacy
Minimal PII collection limited to Google ID, display name, and avatar only. All user data encrypted at rest and in transit. Row-level security enforced; users only access their own predictions. HTTPS mandatory, server-side token verification required.

### V. Accessibility Compliance
WCAG AA standards enforced: semantic HTML, keyboard navigation, screen reader compatibility, AA color contrast for all elements. Reduced motion settings respected. No accessibility features should impact performance targets.

## Development Workflow

### Code Quality Gates
- All features tested on mobile devices in development
- Lighthouse audit must show Perf ≥ 90, A11y ≥ 90, Best Practices ≥ 90
- No console errors or accessibility violations
- Performance budgets verified for all new features

### Testing Requirements
- TDD mandatory for all prediction and scoring logic
- Contract tests for all API endpoints
- Integration tests covering prediction flow edge cases
- Mobile device testing for critical user journeys

## Release Gates (V1)

### Phase 1 Prerequisites
- ✅ Google SSO integration complete (desktop & mobile)
- ✅ Prediction persistence and reload functionality
- ✅ Lock system enforces 2-hour pre-event deadline
- ✅ Leaderboards calculate server-side derived scores
- ✅ Mobile Lighthouse scores: Perf ≥ 90, A11y ≥ 90, Best Practices ≥ 90

### Performance Validation
- P95 TTI ≤ 3.5s on 4G mid-range confirmed
- Core Web Vitals within thresholds
- JavaScript bundle under 200KB
- No regression in accessibility scores

## Governance

Constitution supersedes all other practices. Amendments require:
1. Documentation in amendment proposal
2. Performance impact assessment  
3. Mobile-first compliance verification
4. Migration plan for existing features
5. Timeline-based implementation approach

All PRs must verify constitution compliance through automation gates before merge.

**Version**: 2.0.0 | **Ratified**: 2025-01-28 | **Last Amended**: 2025-01-28