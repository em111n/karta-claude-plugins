# Karta Claude Code plugins

A Claude Code **plugin marketplace** for building on-brand Karta presentation decks.

## Install (one time)

In Claude Code:

```
/plugin marketplace add OHWorkspace/karta-claude-plugins
/plugin install karta-deck@karta
```

Then just ask Claude Code to build a deck — e.g. *"Сделай Karta-деку, моя секция — про рост выручки в Q3"*. The `karta-deck` skill carries the Karta design system, reusable components, section patterns and a runnable template, so you can author a deck locally with no other setup. No GitHub access required to author.

## What's inside

- `skills/karta-deck/` — the skill: `SKILL.md`, `references/` (design tokens, primitives, section patterns, setup), and a runnable `template/`.

Publishing a finished deck (hosting on `demo.karta.io` / `doc.karta.io`) is handled by the deck maintainer — hand off your deck as a zip archive.
