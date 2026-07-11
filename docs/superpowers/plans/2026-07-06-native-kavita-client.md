# Native Kavita Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Begin moving from a WebView shell toward a native Kavita client with native library browsing and a future native reader.

**Architecture:** Do not rewrite the full reader first. Start with a native API client and a native library/series browser, then hand off selected items to the existing Kavita WebView reader until native reading is designed separately.

**Tech Stack:** React/Vite TypeScript for shared UI, Kavita REST API, Vitest, Capacitor HTTP/fetch, existing Capacitor native shell.

---

## File Structure

- Create: `src/kavita-api.ts` - API client wrapper.
- Create: `src/kavita-api.test.ts` - client tests with mocked fetch.
- Create: `src/native-library.ts` - pure view model helpers.
- Create: `src/native-library.test.ts` - view model tests.
- Modify: `src/main.ts` - route between native library mode and WebView mode.
- Modify: `src/styles.css` - native list styling.
- Modify: `README.md` - document experimental native mode.

## Task 1: Kavita API Client Spike

**Files:**
- Create: `src/kavita-api.ts`
- Create: `src/kavita-api.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/kavita-api.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { createKavitaApiClient } from './kavita-api';

describe('createKavitaApiClient', () => {
  it('loads libraries with bearer token', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue([{ id: 1, name: 'Manga' }]) });
    const client = createKavitaApiClient({ baseUrl: 'https://kavita-library.example.dev', token: 'abc', fetch });

    await expect(client.getLibraries()).resolves.toEqual([{ id: 1, name: 'Manga' }]);
    expect(fetch).toHaveBeenCalledWith('https://kavita-library.example.dev/api/library/libraries', {
      headers: { Authorization: 'Bearer abc' },
    });
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `npm test -- src/kavita-api.test.ts`

Expected: FAIL because `src/kavita-api.ts` does not exist.

- [ ] **Step 3: Implement client**

Create `src/kavita-api.ts`:

```ts
export type KavitaLibrary = {
  readonly id: number;
  readonly name: string;
};

type ClientOptions = {
  readonly baseUrl: string;
  readonly token: string;
  readonly fetch: typeof globalThis.fetch;
};

export function createKavitaApiClient(options: ClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/+$/, '');

  return {
    async getLibraries(): Promise<readonly KavitaLibrary[]> {
      const response = await options.fetch(`${baseUrl}/api/library/libraries`, {
        headers: { Authorization: `Bearer ${options.token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to load Kavita libraries');
      }

      return response.json() as Promise<readonly KavitaLibrary[]>;
    },
  };
}
```

- [ ] **Step 4: Verify**

Run: `npm test -- src/kavita-api.test.ts`

Expected: PASS.

## Task 2: Authentication Decision Gate

- [ ] **Step 1: Confirm Kavita token strategy**

Before implementing native login, choose one:

1. Reuse Kavita API token manually pasted into settings.
2. Implement native username/password login against Kavita API.
3. Keep WebView login only and postpone native API auth.

Expected recommendation: start with manually pasted API token for a private first iteration.

## Task 3: Native Library List

**Files:**
- Create: `src/native-library.ts`
- Create: `src/native-library.test.ts`

- [ ] **Step 1: Write view model test**

Create `src/native-library.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { toLibraryItems } from './native-library';

describe('toLibraryItems', () => {
  it('sorts libraries by name', () => {
    expect(toLibraryItems([{ id: 2, name: 'Books' }, { id: 1, name: 'Manga' }])).toEqual([
      { id: 2, label: 'Books' },
      { id: 1, label: 'Manga' },
    ]);
  });
});
```

- [ ] **Step 2: Implement view model**

Create `src/native-library.ts`:

```ts
import type { KavitaLibrary } from './kavita-api';

export type LibraryItem = {
  readonly id: number;
  readonly label: string;
};

export function toLibraryItems(libraries: readonly KavitaLibrary[]): readonly LibraryItem[] {
  return [...libraries]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((library) => ({ id: library.id, label: library.name }));
}
```

- [ ] **Step 3: Verify**

Run: `npm test -- src/native-library.test.ts`

Expected: PASS.

## Task 4: Native Client Scope Stop

- [ ] **Step 1: Stop after native library list**

Do not implement a native manga reader in this plan.

Expected: native client work stops at API client + library list + WebView handoff decision.

- [ ] **Step 2: Write next design spec**

Create a separate design for native reader pagination, image loading, cache, and offline behavior before writing reader code.

Expected: no reader code is added in this plan.
