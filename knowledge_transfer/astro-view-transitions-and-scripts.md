# Understanding Astro View Transitions and Script Execution

**Reading time: ~45-60 minutes**

This lesson explains the bug we encountered with the infinite spinner on `/book` and how we solved it. More importantly, it builds the mental model you need to understand *why* the bug happened and avoid similar issues in the future.

---

## Part 1: What is Astro, Really?

### The Mental Model

Think of Astro as a **build-time templating system**. When you run `npm run build`:

1. Astro reads your `*.astro` files
2. It executes any JavaScript in the "frontmatter" (the `---` section)
3. It renders HTML
4. It outputs static `.html` files to `dist/`

**Key insight:** The JavaScript in the frontmatter runs on YOUR computer during build, not in the browser. The browser never sees it.

```astro
---
// This runs at BUILD TIME on your machine
const greeting = "Hello";
console.log("Building..."); // You see this in your terminal
---

<h1>{greeting}</h1>
<!-- Browser receives: <h1>Hello</h1> -->
```

### What About Browser JavaScript?

Astro gives you two ways to include JavaScript that runs in the browser:

**1. Processed Scripts (default)**
```astro
<script>
  console.log("I will be bundled and optimized by Astro");
</script>
```

Astro will:
- Bundle this with other scripts
- Minify it
- Add it to its asset pipeline
- Potentially deduplicate identical scripts

**2. Inline Scripts (`is:inline`)**
```astro
<script is:inline>
  console.log("I am included as-is, exactly where I wrote it");
</script>
```

Astro will:
- Include this script exactly as written
- Place it exactly where you put it in the HTML
- NOT process, bundle, or deduplicate it

### When to Use Which?

Use **processed scripts** for:
- Code that can be shared/bundled
- Code that doesn't depend on being in a specific DOM position
- Sites without View Transitions, or scripts that don't need precise timing control

Use **`is:inline`** for:
- Code that must run at a predictable time during View Transitions
- Code that must run immediately when encountered in the HTML
- Code that interacts with elements that must exist at that exact point
- Code that needs `define:vars` (though this is rarely the primary reason)

**In our project:** We use `is:inline` because View Transitions make processed script timing unpredictable. When navigating via View Transitions, processed scripts may not re-run, or may run before the DOM is ready. `is:inline` gives us explicit control—combined with `queueMicrotask()`, we can guarantee our initialization runs at the right time.

Note: We also use `define:vars` with our inline scripts to pass constants like API endpoints, but this is a convenience, not the reason we chose `is:inline`. Those constants could just as easily be written directly in the script.

---

## Part 2: What is a "Normal" Page Load?

Before understanding View Transitions, let's be crystal clear about how a normal web page loads.

### The Traditional Flow

1. User clicks a link to `/book`
2. Browser sends HTTP request to server
3. Server returns HTML for `/book`
4. Browser **destroys** the old page completely
5. Browser parses new HTML from scratch
6. Browser executes `<script>` tags in order
7. Browser fires `DOMContentLoaded` when HTML is parsed
8. Browser fires `load` when all resources are loaded

**Key insight:** Each page is a fresh start. No JavaScript state survives. No variables persist. The browser literally creates a new "world" for each page.

### The Familiar Pattern

This is why you've seen this pattern everywhere:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Safe to access DOM elements here
  initMyPage();
});
```

This works because:
1. Script runs immediately when encountered
2. But DOM might not be fully parsed yet
3. So we wait for `DOMContentLoaded` to be safe

Or the shortcut version:

```javascript
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOM already ready, run immediately
}
```

---

## Part 3: Enter View Transitions

### The Problem View Transitions Solve

Traditional page loads have a jarring feel:
- Screen goes white/blank momentarily
- All state is lost
- User sees a "flash" between pages
- It doesn't feel like a smooth "app"

View Transitions make navigation feel smooth by:
- Animating between old and new content
- Avoiding the blank flash
- Creating an "app-like" experience

### How Astro's View Transitions Work

In our project, `Layout.astro` includes:

```astro
import { ClientRouter } from 'astro:transitions';

<ClientRouter fallback="swap" />
```

This changes **everything** about how navigation works.

### The New Flow (With View Transitions)

1. User clicks a link to `/book`
2. Browser **intercepts** the click (prevents normal navigation)
3. JavaScript fetches the new page's HTML in the background
4. Browser **swaps** the old content with new content
5. The page URL updates
6. Special events fire

**Key insight:** The browser never "destroys" the page. It just modifies it. This is fundamentally different from traditional navigation.

### The Events

Astro provides custom events for this new lifecycle:

| Event | When it Fires |
|-------|---------------|
| `astro:before-preparation` | Before fetching new page |
| `astro:after-preparation` | After new page HTML is ready |
| `astro:before-swap` | Just before swapping content |
| `astro:after-swap` | Just after swapping content |
| `astro:page-load` | When new page is fully ready |

The one we care about most is `astro:page-load` - it's supposed to be like `DOMContentLoaded` but for View Transition navigations.

---

## Part 4: The Bug - A Timing Race

### What We Expected

We wrote this code in `book.astro`:

```javascript
function init() {
  // Initialize the page
}

document.addEventListener('astro:page-load', init);

if (document.readyState !== 'loading') {
  init(); // For direct page loads
}
```

We expected:
1. For direct loads (hard refresh): `init()` runs immediately
2. For View Transitions: `astro:page-load` event calls `init()`

### What Actually Happened

Here's the timeline of a View Transition to `/book`:

```
Time →

[User clicks link on /bookings]
          |
          v
[Astro intercepts click]
          |
          v
[Astro fetches /book HTML]
          |
          v
[astro:page-load EVENT FIRES] ← Note: our listener isn't registered yet!
          |
          v
[Astro swaps content into DOM]
          |
          v
[Scripts in new page execute] ← NOW our script runs
          |
          v
[We register astro:page-load listener] ← Too late! Event already fired
          |
          v
[document.readyState is 'complete']
          |
          v
[We call init() immediately... but wait!]
```

### The Subtle Part

You might think: "But we DO call `init()` immediately when `readyState` is `'complete'`!"

Yes, but here's what we discovered through debugging:

The **immediate call to `init()`** was racing with other things. Sometimes it worked, sometimes it didn't. The exact timing depended on:
- Browser state
- Network conditions
- Other scripts executing
- The phase of the moon (not really, but it felt that way)

### The Evidence

When we checked the page state during the infinite spinner:

```javascript
// Label text was EMPTY - meaning init() never ran
{
  "labelText": "",
  "loadingVisible": true
}
```

The first thing `init()` does is set the label. Empty label = `init()` never ran.

---

## Part 5: The Solution

### The Fix

```javascript
// Use a global key to track initialization
var initKey = 'book_page_initialized_' + window.location.search;

function init() {
  if (!window.location.pathname.startsWith('/book')) return;
  if (window[initKey]) return;  // Already initialized
  window[initKey] = true;

  initBookingPage();
  setupEventHandlers();
}

// Clear flag when navigating away
document.addEventListener('astro:before-swap', function() {
  window[initKey] = false;
});

// Register for astro:page-load (might miss it, but try)
document.addEventListener('astro:page-load', init);

// CRITICAL: Also run on next microtask
queueMicrotask(init);
```

### Why This Works

**`queueMicrotask(init)`** schedules `init()` to run on the very next "microtask" - after the current script finishes but before any other events process.

This means:
1. Script runs
2. All variables are defined
3. Event listeners are registered
4. Current execution completes
5. → Microtask runs `init()` ← This is guaranteed to happen

**The global `window[initKey]`** prevents double initialization:
- If `astro:page-load` fires later and calls `init()`, it's a no-op
- If `queueMicrotask` runs, it initializes
- Either way, we only initialize once

**`astro:before-swap`** resets the flag:
- When navigating away, we clear the flag
- So next time we navigate TO this page, it can initialize fresh

---

## Part 6: Key Takeaways

### 1. View Transitions Change Everything

Traditional patterns for page initialization don't work reliably with View Transitions. The page doesn't "reload" - it mutates.

### 2. Event Timing is Different

With View Transitions, events may fire BEFORE your script runs. You can't rely on registering listeners "in time."

### 3. Use Multiple Initialization Strategies

Don't rely on a single mechanism. Use both:
- Event listeners (for redundancy)
- Direct execution via `queueMicrotask` (for reliability)

### 4. Guard Against Double Initialization

With multiple init strategies, you MUST prevent running init twice. Use a flag.

### 5. Clean Up On Navigation

View Transitions mean the "page" persists conceptually. Clean up your state on `astro:before-swap`.

---

## Part 7: The Debugging Approach

When you encounter issues like this, here's how to debug:

### 1. Verify the Symptom

Take a screenshot. What exactly is wrong? In our case: spinner showing, label empty.

### 2. Form a Hypothesis

"The init function isn't running."

### 3. Test the Hypothesis

```javascript
// In browser console
document.getElementById('booking-type-label').textContent
// Result: "" (empty)
// Confirms: init() sets this, so init() never ran
```

### 4. Understand the Expected Flow

What SHOULD happen? Trace through the code mentally.

### 5. Identify the Discrepancy

What's different from expectation? In our case: events firing before listeners registered.

### 6. Test the Fix

Make a change, test View Transition navigation specifically (not just hard reload).

---

## Appendix: Glossary

**SSG (Static Site Generator)**: A tool that generates plain HTML files at build time. No server needed at runtime.

**View Transitions**: A technique for smooth, animated navigation between pages without full page reloads.

**`is:inline`**: An Astro directive that includes a script exactly as-is, without processing.

**`define:vars`**: An Astro directive that passes build-time variables into a script.

**Microtask**: A small unit of work scheduled to run after the current JavaScript execution but before the browser does other things (like rendering). `queueMicrotask()` schedules a microtask.

**`DOMContentLoaded`**: Browser event that fires when HTML is fully parsed.

**`astro:page-load`**: Astro's custom event that fires when a page is ready (similar to DOMContentLoaded but works with View Transitions).

**`astro:before-swap`**: Astro's event that fires just before content is swapped during View Transition navigation.
