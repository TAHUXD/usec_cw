# LastPass Desktop Extension Prototype

This is a minimally functional frontend prototype for a redesigned LastPass desktop browser-extension flow.

## What it demonstrates
The prototype simulates a redesigned multi-account autofill experience with:
- an identity-first chooser
- a lightweight confirmation step
- post-fill feedback
- Undo / Switch account recovery

## Why it was built
This prototype was created as optional supporting material for a University of Edinburgh Usable Security and Privacy coursework project. The redesign addresses wrong-identity autofill when multiple credentials exist for the same domain.

## Included interaction states
1. Login page
2. Identity-first chooser
3. Confirmation before autofill
4. Filled state with recovery actions

## Limitations
- No real browser-extension APIs
- No real autofill into websites
- No real authentication backend
- Only a frontend simulation of the intended interaction flow

## How to run locally
```bash
npm install
npm run dev