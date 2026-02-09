# Portfolio Redesign: The "Bridge" Architecture

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the portfolio to feature a "Dual-Track" experience (AI Engineer vs. iOS/Creative Developer), highlight the "API Bridge" architecture, and showcase key projects (Pulse, Kami, Kats Eye).

**Architecture:** React + Vite. We will refactor to a data-driven approach, separating content from presentation. A new "Architecture Diagram" component will visualize the integration of AI agents into business logic.

**Tech Stack:** React, Tailwind CSS, Lucide React, Recharts.

---

### Task 1: Data Wiring & Type Definitions

**Files:**
- Modify: `types.ts`
- Create: `data/projects.ts`
- Create: `data/services.ts`
- Create: `data/stack.ts`

**Step 1: Update Types**
Add `category` to `Project` interface and create `StackItem` interface.

```typescript
// types.ts
export type ProjectCategory = 'system' | 'interface' | 'creative';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link?: string;
  github?: string;
  category: ProjectCategory;
  featured?: boolean;
}

export interface StackItem {
  name: string;
  logo: string; // URL or Icon name
  category: 'ai' | 'dev' | 'apple';
}
```

**Step 2: Create Centralized Data**
Populate `data/projects.ts` with Pulse, Kami, Kats Eye, World Globe, Sample Mix, etc.

### Task 2: Tech Stack Ticker

**Files:**
- Create: `components/TechStack.tsx`

**Description:**
A marquee or grid section immediately following the Hero to display the requested logos: Gemini, OpenAI, Grok, Apple, Xcode, Cursor, etc.

### Task 3: Architecture Diagram Component

**Files:**
- Create: `components/ArchitectureDiagram.tsx`

**Description:**
A specialized component using standard HTML/CSS (or SVG) to visualize the "Bridge":
[AI Agents (Gemini/Studio)] <--> [Node/Python REST API] <--> [Business Logic (Royalty/Music)]

### Task 4: Dual-Track Gallery (Refactor Portfolio)

**Files:**
- Modify: `components/Portfolio.tsx` (Rename to `DualTrackGallery.tsx` ideally, or refactor in place)

**Description:**
Implement a stateful toggle:
- **Track A (AI Systems):** Shows Fine-tuning, RAG, Dashboards.
- **Track B (Interface & Creative):** Shows Pulse (SwiftUI), Kami, Kats Eye.

### Task 5: GitHub Pulse Integration

**Files:**
- Create: `components/GithubPulse.tsx`

**Description:**
A component that fetches (or mocks for MVP) recent commit activity to show "liveliness".

### Task 6: Main Layout Assembly

**Files:**
- Modify: `App.tsx`

**Description:**
Assemble all new components.

---
