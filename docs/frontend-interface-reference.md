# Frontend Interface Reference

This document summarizes the core UI/UX and architecture patterns derived from key design systems (ALET, Claude Code, OpenClaw). These references serve to establish a unified pattern design system for the SPARK CLI and desktop GUI workspace.

> [!IMPORTANT]
> The source implementations referred to here must inform design patterns and behavioral rules only. Do NOT copy external code or assets directly into the `SPARK` main codebase.

---

## 1. ALET Inspired Visual Principles (Desktop GUI)

To deliver a premium, high-craft desktop workspace in `apps/desktop`, follow these guidelines:

- **Horizontal Canvas**: Shift away from standard vertical landing cards. Group commands, session timelines, outputs, and modules in high-density horizontal lanes.
- **Micro-Typography**: Maintain clean visual hierarchy using small, readable typefaces. Rely on monospace variants for command docks and data values.
- **Light Neutral Surfaces**: Use high-contrast, clean light surfaces rather than distracting multi-colored gradients or dark mode overlays by default. Keep interactive borders clean and thin.
- **Restrained Motion**: Incorporate subtle, physical-feeling horizontal animations when sections transition or lanes update. The motion must communicate spatial context without delaying user interactions.
- **Image/Visual Rhythm**: Maintain professional energy by structuring custom icons and screenshot/visual cards in a grid rhythm throughout the workspace lanes.

---

## 2. Claude Code Inspired Terminal Principles (Workspace CLI)

To keep the bare `spark` CLI workspace simple, fast, and powerful:

- **Command Input Dock**: Entering the bare `spark` command opens an interactive, prompt-based loop (`User: > `).
- **Transcript Format**: Render the session chronologically as a transcript. Print past commands and their outcomes clearly.
- **Inline Tool/Status Outputs**: Show distinct, compact status lines (e.g., symbols or spinner status) for tool checks and API calls without littering terminal scroll history.
- **Keyboard-First Interface**: Support intuitive slash commands (e.g., `/dict`, `/style`, `/coach`, `/content`, `/clear`, `/exit`) and key shortcuts to clear or execute actions instantly.

---

## 3. OpenClaw Inspired Architecture Patterns (Agent Workspace)

To guarantee scalability and keep module boundaries clean:

- **Agent Workspace Separation**: CLI-facing session loops and desktop GUI layers consume standardized, English-only event/command contracts.
- **Plugin Boundaries**: Platform capabilities (auth, providers, and local caching) are isolated from core business logic in individual plugins or SDK setups.
- **Conservative Extension Discipline**: Add new connectors only when input/output schemas are locked in. UI panels only consume adapter state hooks and must never duplicate core business logic from `src/`.