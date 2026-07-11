# Keep Awake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the screen awake while reading in the app.

**Architecture:** Use the Capacitor Community Keep Awake plugin and activate it when the app launches. Keep the first version simple: always keep awake while the app is foregrounded.

**Tech Stack:** `@capacitor-community/keep-awake`, TypeScript, Vitest, Capacitor Android/iOS.

---

## File Structure

- Modify: `package.json` and `package-lock.json` - add plugin.
- Create: `src/keep-awake.ts` - wrapper around plugin.
- Create: `src/keep-awake.test.ts` - unit tests for wrapper.
- Modify: `src/main.ts` - call wrapper on startup.
- Modify: `README.md` - document keep-awake behavior.

## Task 1: Add Plugin

- [ ] **Step 1: Install plugin**

Run: `npm install @capacitor-community/keep-awake`

Expected: dependency added.

- [ ] **Step 2: Sync**

Run: `npm run cap:sync`

Expected: native sync completes.

## Task 2: Add Wrapper

**Files:**
- Create: `src/keep-awake.ts`
- Create: `src/keep-awake.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/keep-awake.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { enableKeepAwake, type KeepAwakePlugin } from './keep-awake';

describe('enableKeepAwake', () => {
  it('calls keepAwake on the plugin', async () => {
    const plugin: KeepAwakePlugin = { keepAwake: vi.fn().mockResolvedValue(undefined) };

    await enableKeepAwake(plugin);

    expect(plugin.keepAwake).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `npm test -- src/keep-awake.test.ts`

Expected: FAIL because `src/keep-awake.ts` does not exist.

- [ ] **Step 3: Implement wrapper**

Create `src/keep-awake.ts`:

```ts
export type KeepAwakePlugin = {
  readonly keepAwake: () => Promise<void>;
};

export async function enableKeepAwake(plugin: KeepAwakePlugin): Promise<void> {
  await plugin.keepAwake();
}
```

- [ ] **Step 4: Verify**

Run: `npm test -- src/keep-awake.test.ts`

Expected: PASS.

## Task 3: Wire Startup

**Files:**
- Modify: `src/main.ts`

- [ ] **Step 1: Import plugin and wrapper**

Add:

```ts
import { KeepAwake } from '@capacitor-community/keep-awake';
import { enableKeepAwake } from './keep-awake';
```

- [ ] **Step 2: Call startup behavior**

Before rendering the launcher, add:

```ts
void enableKeepAwake(KeepAwake).catch(() => {
  // Keep-awake is non-critical; reading still works without it.
});
```

- [ ] **Step 3: Verify**

Run: `npm test && npm run build && npm run cap:sync`

Expected: all pass.

## Task 4: Manual Acceptance

- [ ] **Step 1: Boox test**

Open a manga page and leave device idle longer than normal sleep timeout.

Expected: screen stays awake while app is foregrounded.
