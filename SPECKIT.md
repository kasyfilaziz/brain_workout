# Speckit: Specification & Implementation Workflow

**Version**: 1.0.0  
**Created**: 2026-03-19  
**Based on**: Session with Pomodoro Timer feature

---

## Overview

Speckit is a structured workflow for defining and implementing brain workout features. It guides teams from idea to implementation with built-in quality gates and continuous validation.

---

## Workflow Stages

```
SPECIFY → CLARIFY → PLAN → TASKS → CHECKLIST → IMPLEMENT → ANALYZE
                ↑                                    ↓
                └────────────────────────────────────┘
                    (Iterate if issues found)
```

| # | Stage | Command | Purpose | Timing |
|---|-------|---------|---------|--------|
| 1 | Specify | `/speckit.specify` | Create feature specification | First |
| 2 | Clarify | `/speckit.clarify` | Resolve ambiguities with questions | After Specify |
| 3 | Plan | `/speckit.plan` | Design architecture & data model | After Clarify |
| 4 | Tasks | `/speckit.tasks` | Break into executable tasks | After Plan |
| 5 | Checklist | `/speckit.checklist` | Validate requirements quality | **Before Implement** |
| 6 | Implement | `/speckit.implement` | Build the feature | After Checklist |
| 7 | Analyze | `/speckit.analyze` | Post-implementation review | After Implement |

---

## Stage Details

### Stage 1: Specify

**Command**: `/speckit.specify`

**Input**: Feature description (what you want to build)

**Output**: `specs/XXX-feature-name/spec.md`

**Purpose**: Define what the feature does from the user's perspective

**Contents**:
- User stories with acceptance criteria (Given/When/Then)
- Functional requirements (FR-001, FR-002, etc.)
- Success criteria with measurable outcomes
- Key entities and data model
- Edge cases
- Clarifications section (empty at first)

**Questions to Answer**:
- Who is the user?
- What do they want to do?
- What are the acceptance criteria?
- What could go wrong?

---

### Stage 2: Clarify

**Command**: `/speckit.clarify`

**Input**: spec.md with ambiguities identified

**Output**: Updated spec.md with Clarifications section populated

**Purpose**: Resolve ambiguities before planning

**How It Works**:
- Identify unclear requirements (maximum 5 questions per session)
- Present multiple choice options when possible
- Record answers in Clarifications section

**Question Types**:
- Scope refinement: "Should feature X be included?"
- Risk prioritization: "Which failure mode should we handle first?"
- Depth calibration: "Is this a quick feature or production-ready?"

**Example from Pomodoro**:
```
Q: Weekly stats definition
A: Calendar week (Sunday to Saturday)

Q: Wake lock during breaks
A: Wake lock only during work sessions
```

---

### Stage 3: Plan

**Command**: `/speckit.plan`

**Input**: spec.md

**Output**: `specs/XXX-feature-name/plan.md`

**Purpose**: Define how to build it (technical architecture)

**Contents**:
- Technical stack (Language, Framework, Dependencies)
- Constitution alignment check
- Data model design
- State machine (if applicable)
- UI layout
- Key implementation notes

**Constitution Check**:
Ensures the feature follows project principles:
- Local-First Data (IndexedDB)
- Static Deployment
- PWA Requirements
- Extensible Architecture
- Data Portability

---

### Stage 4: Tasks

**Command**: `/speckit.tasks`

**Input**: plan.md, spec.md

**Output**: `specs/XXX-feature-name/tasks.md`

**Purpose**: Break implementation into trackable tasks

**Structure**:
- Phase 1: Setup (directory structure)
- Phase 2: Foundational (blocking prerequisites)
- Phase 3+: User Stories (in priority order)
- Final Phase: Polish

**Task Format**:
```
- [ ] T001 [P] [US1] Create component at path/file.svelte
```

**Markers**:
- `[P]` = Can run in parallel with other [P] tasks
- `[US1]` = Belongs to User Story 1

---

### Stage 5: Checklist

**Command**: `/speckit.checklist`

**Input**: spec.md, plan.md, tasks.md

**Output**: `specs/XXX-feature-name/checklists/*.md`

**Purpose**: Validate requirements quality BEFORE implementation

**CRITICAL**: This stage must happen BEFORE implementation, not after!

**What It Checks**:
- Completeness: Are all requirements documented?
- Clarity: Are requirements unambiguous?
- Consistency: Do requirements align with each other?
- Measurability: Can requirements be objectively verified?
- Coverage: Are all scenarios/edge cases addressed?

**Item Format** ("Unit Tests for English"):
```
- [ ] CHK001 Are timer mode requirements explicitly defined? [Completeness]
```

**NOT Implementation Tests**:
```
❌ WRONG: "Verify timer starts correctly"
✅ CORRECT: "Are timer start requirements clearly specified?"
```

---

### Stage 6: Implement

**Command**: `/speckit.implement`

**Input**: tasks.md

**Output**: Code in `src/apps/[feature-name]/`

**Purpose**: Build the feature

**Rules**:
- Complete phases in order (Setup → Foundational → User Stories)
- Mark tasks complete in tasks.md as you go
- Run build verification after each phase
- Commit after each logical group

**Validation**:
- `npm run build` must pass
- Test on mobile if applicable
- PWA functionality verified

---

### Stage 7: Analyze

**Command**: `/speckit.analyze`

**Input**: spec.md, plan.md, tasks.md (and code if built)

**Output**: Analysis report (markdown output)

**Purpose**: Post-implementation review

**Checks**:
- Constitution alignment
- Requirements coverage
- Task completeness
- Inconsistencies between documents
- Duplicate or missing requirements

**When to Run**:
- After implementation is complete
- Before merging/PR
- When issues are discovered

---

## Files Generated

```
specs/XXX-feature-name/
├── spec.md              # What to build (user perspective)
├── plan.md              # How to build (technical)
├── data-model.md        # Data structures
├── quickstart.md        # Implementation guide
├── tasks.md            # Task breakdown
└── checklists/
    └── requirements-quality.md  # Requirements validation
```

---

## Constitution

The project constitution (`.specify/memory/constitution.md`) defines non-negotiable principles:

| Principle | Must Follow |
|----------|-------------|
| I. Local-First Data | All data in IndexedDB |
| II. Static Deployment | No server-side processing |
| III. PWA | Service worker + manifest |
| IV. Extensible | Modular app pattern |
| V. Data Portability | Export user-generated content |

**Amendment**: Constitution can be updated, but requires version bump (MAJOR/MINOR/PATCH).

---

## Pomodoro Timer Session Summary

### What We Built
- Pomodoro Focus Timer app (25 min work, 5 min break, 15 min long break after 4 cycles)
- Session naming with random defaults
- Sound/vibration notifications
- Wake lock to prevent device sleep
- Statistics (daily, weekly, streak)
- Customizable settings

### Timeline
| Stage | Completed | Issues Found |
|-------|-----------|--------------|
| Specify | ✅ | Initial requirements vague |
| Clarify | ✅ | 3 questions asked & answered |
| Plan | ✅ | Constitution violation found (V) |
| Tasks | ✅ | 43 tasks created |
| Checklist | ✅ | Run AFTER impl (should be before) |
| Implement | ✅ | All 43 tasks complete |
| Analyze | ✅ | Constitution issue confirmed |

### Key Learnings

1. **Checklist timing**: Should run BEFORE implementation, not after
2. **Constitution check**: Should happen in Plan stage, not Analyze
3. **Constitution V**: Clarified that usage statistics ≠ user-generated content
4. **Edge cases**: Some identified in checklist (background behavior, wake lock failures)

---

## Common Patterns

### When to Iterate
- New ambiguities found → Back to Clarify
- Architecture changes needed → Back to Plan
- Requirements missing → Back to Specify
- Tasks incomplete → Update tasks.md

### When to Stop
- All stages complete
- No critical issues in Analyze
- Build passes
- User approves

---

## Quick Reference

### Commands
| Command | When |
|---------|------|
| `/speckit.specify "feature description"` | Start new feature |
| `/speckit.clarify` | Ask clarifying questions |
| `/speckit.plan` | Create technical plan |
| `/speckit.tasks` | Generate task breakdown |
| `/speckit.checklist` | Validate requirements |
| `/speckit.implement` | Build feature |
| `/speckit.analyze` | Post-implementation review |

### File Locations
| Document | Path |
|----------|------|
| Constitution | `.specify/memory/constitution.md` |
| Feature Spec | `specs/XXX-feature-name/spec.md` |
| Implementation | `src/apps/[feature]/` |

---

## Anti-Patterns

| Mistake | Why It's Bad |
|---------|--------------|
| Skipping Clarify | Vague requirements lead to rework |
| Checklist after impl | Too late to fix requirements |
| Ignoring constitution | Violates project principles |
| Implementing without tasks | Unclear scope, missed features |
| No Analyze | Issues found in production |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-19 | Initial documentation from Pomodoro session |

---

## Next Steps for Team

1. **Adopt the workflow** for all new features
2. **Run checklist before implement** - it's a quality gate, not an afterthought
3. **Check constitution in Plan** - catch violations early
4. **Document learnings** after each feature

---

**End of Speckit Documentation**
