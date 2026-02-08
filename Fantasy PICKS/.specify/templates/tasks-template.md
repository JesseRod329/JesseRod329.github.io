# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 3.1: Setup
- [ ] T001 Create mobile-first project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies  
- [ ] T003 [P] Configure linting and formatting tools
- [ ] T004 [P] Set up mobile testing framework for Fantasy Wrestling features
- [ ] T005 Configure performance budgets (P95 TTI ≤ 3.5s, JS ≤ 200KB)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test POST /api/users in tests/contract/test_users_post.py
- [ ] T007 [P] Contract test GET /api/users/{id} in tests/contract/test_users_get.py
- [ ] T008 [P] Integration test user registration in tests/integration/test_registration.py
- [ ] T009 [P] Integration test auth flow in tests/integration/test_auth.py

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T010 [P] User model with server-side validation in src/models/user.py
- [ ] T011 [P] Prediction scoring service in src/services/prediction_service.py
- [ ] T012 [P] Server-side leaderboard calculation in src/services/leaderboard_service.py
- [ ] T013 POST /api/predictions endpoint
- [ ] T014 GET /api/leaderboard endpoint
- [ ] T015 Input validation for mobile forms
- [ ] T016 Error handling and logging

## Phase 3.4: Integration
- [ ] T017 Connect Predictions to DB with RLS
- [ ] T018 Google SSO middleware
- [ ] T019 Mobile performance monitoring
- [ ] T020 HTTPS and security headers

## Phase 3.5: Polish
- [ ] T021 [P] Unit tests for server-side scoring logic
- [ ] T022 Mobile performance tests (P95 TTI ≤ 3.5s)
- [ ] T023 [P] Update docs/api.md
- [ ] T024 Remove duplication
- [ ] T025 Run mobile manual testing

## Dependencies
- Setup tasks (T001-T005) complete before tests
- Tests (T006-T009) before implementation (T010-T016)
- T010 blocks T011-T015, T017
- Mobile testing setup (T004) required for final validation
- Implementation before polish (T021-T025)

## Parallel Example
```
# Launch T006-T009 together:
Task: "Contract test POST /api/users in tests/contract/test_users_post.py"
Task: "Contract test GET /api/users/{id} in tests/contract/test_users_get.py"
Task: "Integration test registration in tests/integration/test_registration.py"
Task: "Integration test auth in tests/integration/test_auth.py"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task