# ESVMC Rulebook
This document is the official frontend architecture standard for Quick Quest, based on the **ESVMC (Extreme Strict by Virtual Machine Concept)** approach.
## 1) Purpose
ESVMC was created to:
- maintain extreme Separation of Concerns,
- minimize logic leakage between containers,
- simplify scaling and debugging as components grow larger,
- ensure React structures remain consistent with enterprise standards.
## 2) Core Principles of ESVMC
- Each component is treated like a small virtual machine.
- Each container has its own private logic space (private strict).
- Data flow must be unidirectional: `tsx -> ts -> service -> global.service`.
- Upper layers must not bypass lower layers.
## 3) Layer Contracts
### `ComponentName.tsx` (View + Event Wiring)
Allowed:
- rendering UI,
- event binding (`onClick`, `onChange`, etc.),
- calling logic functions from `ComponentName.ts`,
- configuring container composition.
Not allowed:
- directly importing `global.service.ts`,
- making direct API calls,
- storing complex business rules.

### `ComponentName.ts` (Business Logic + Data Logic)

Allowed:

- storing business rules,
- data transformations,
- orchestrating event handlers,
- calling service functions from `ComponentName.service.ts`.

Not allowed:

- rendering JSX,
- importing CSS,
- calling endpoints directly without going through the service.

### `ComponentName.service.ts` (Service Logic / LAN Layer)

Allowed:

- act as an adapter between `global.service.ts` and `ComponentName.ts`,
- prepare request functions as needed by the container,
- handle minimal response mapping.

Not allowed:

- contain JSX,
- store UI state,
- manage navigation/route flow.

### `global.service.ts` (Root API Gateway)

Allowed:

- storing the endpoint registry,
- global request helpers,
- base URL and general header configurations.

Not allowed:

- storing component-specific UI logic,
- storing feature-specific business rules.

## 4) Import Rules (Mandatory)

One-way import rules:

- `*.tsx` may import `*.ts`
- `*.ts` may import `*.service.ts`
- `*.service.ts` may import `global.service.ts`

Prohibitions:

- `*.tsx` directly importing `*.service.ts`
- `*.tsx` directly importing `global.service.ts`
- `*.ts` must not import `global.service.ts` directly
- `*.service.ts` must not import `*.tsx`

## 4.1) Cross-Service Exception (Same Context)

Exceptions are permitted when:

- within the same page/feature,
- the business context is the same,
- the data remains within the same domain.

Example:

- `Finance` context with containers `Income`, `Expenses`, `Balance`,
- containers may consume services from the same `finance` domain as long as the data contracts are consistent.

Mandatory restrictions:

- must not pull services from other domains with different contexts,
- continue to avoid wild cross-container dependencies,
- continue to prioritize container-specific adapters/functions in the `.ts` layer.

## 5) Standard Folder Structure

```text
src/app/{feature}/
|- {feature}.tsx
|- {feature}.ts
|- {feature}.service.ts
|- {feature}.css
```

For large features:

```text
src/app/home/content/{feature}/
|- {feature}.tsx
|- {feature}.ts
|- {feature}.service.ts
|- {feature}.css
|- page/
   |- {child-page}.tsx
```

## 6) Private and Strict per Container

In a single `*.tsx` file, each container must:

- use logic relevant to its own container,
- not access the private logic of other containers without an explicit contract,
- not directly call services.

In a single `*.ts` file, logic functions must:

- have a clear scope per container,
- not access the internal state of other containers without arguments or an explicit contract.

## 7) State & Storage Guidelines

- Sensitive data (e.g., role, auth, session context) **must not** be stored as a source of truth in `localStorage`.
- The source of truth for sensitive data must come from the backend or session cookies.
- `localStorage` is only for non-sensitive UI state (e.g., display preferences).

## 8) Security Role Guidelines (Quick Quest)

- Default role for new users: `user_runner`.
- Giver mode access is active only if the backend returns an unlocked role (`user_unlocked`).
- The UI mode switch is merely a reflection of the backend role status, not a truth switch.

## 9) Naming Convention

- Logic functions: `handleXxx`, `computeXxx`, `resolveXxx`.
- Service functions: `fetchXxx`, `createXxx`, `updateXxx`, `deleteXxx`.
- Avoid generic names like `doStuff`, `tempFunc`, `data1`.

## 10) Pull Request Checklist (ESVMC)

Before merging, you must check:

1. Is the flow `tsx -> ts -> service -> global.service` unidirectional with no bypasses?
2. Are business rules defined in `.ts` files, not in `.tsx` files?
3. Do service calls only occur in `.service.ts` files?
4. Is sensitive data not used as a source of truth in `localStorage`?
5. Are function names explicit and easy to read?
6. If there are shared services, are they still within the same domain context?

## 11) Anti-Patterns (Prohibited)

- `tsx` components performing direct API fetches.
- Cross-container logic written ad-hoc without function contracts.
- Services modify the visual state of the UI.
- `global.service.ts` contains feature-specific logic.

## 12) When ESVMC Is Not Required

ESVMC may not be fully implemented when a component/container:

- is global in nature,
- manages only global events,
- has static content (output is always the same),
- or is lightly dynamic but does not require services/APIs.

Example candidates:

- global layout shell,
- global UI event handler,
- presentational SPA page without backend data requests.

Note:

- once a container begins to require services/APIs or complex business rules, revert to the full ESVMC pattern.

## 13) ESVMC Data Flow

For all components using the ESVMC structure, data streams such as text <p/> and <h1/> will be stored in ComponentName.service.ts as long as
the data is text intended for UI display—whether it is dummy data or data retrieved from an API. It is not placed in .tsx or .ts because when replaced, the data is immediately passed to .ts and then passed again to .tsx. Instead of displaying dummy data in the .tsx UI, it is better to place it directly in service.ts for clarity. Thus, the .tsx component directly references the .ts file and the .ts file references service.ts. This is divided into two categories: Permanent Static or Long-Term Dynamic,
- If Long-Term Dynamic: The probability of placing data in service.ts—even if it’s just for display—is 46.55%, but it might be a bit cumbersome to change it later since you’d have to search for it one by one in .tsx.
- If it’s Static and Permanent and won’t change anymore, then it’s reasonable and optional to place it in service.ts

---

This rulebook serves as the primary reference for all Quick Quest frontend modules.