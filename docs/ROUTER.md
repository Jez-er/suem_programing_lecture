# SPA Router Documentation

Comprehensive technical documentation for the Single-Page Application (SPA) Router built for the **`suem_programing_lecture`** codebase.

---

## 📌 1. Architecture Overview

The application utilizes a lightweight, dependency-free vanilla TypeScript router designed specifically for Single-Page Applications (SPA) with Vite. 

### Key Characteristics:
- **HTML5 History API**: Uses `window.history.pushState` and `window.addEventListener('popstate')` for smooth, uninterrupted client-side page transitions without page reloads.
- **Vite Raw Imports (`?raw`)**: HTML page templates stored under `src/pages/` are imported as raw string modules using Vite's `?raw` syntax.
- **Automatic Layout & Header Injection**: Renders a consistent site header (`.site-header`) with active navigation highlighting on every route transition.
- **Static File & Download Bypass**: Automatically detects static assets (`.docx`, `.pdf`, `.zip`, etc.) and `download` attributes, allowing the browser to download files natively without triggering SPA routing or 404 errors.
- **Engine Re-initialization**: Automatically calls `initEngine()` on every page mount to attach interactive event listeners (quizzes, code execution buttons, tabs, checklists, search filters).
- **Hash Scrolling Support**: Automatically handles anchor scrolling (e.g., `#s1`, `#quiz`, `#task-docx`) upon navigation.

---

## 📁 2. File Structure

```text
suem_programing_lecture/
├── docs/
│   └── ROUTER.md             <-- Router Technical Documentation (This file)
├── src/
│   ├── engine.ts             <-- Interactive widgets engine (re-initialized on route change)
│   ├── main.ts               <-- Application entry point that starts the router
│   ├── style.css             <-- Unified lecture design system & router styles
│   ├── pages/
│   │   ├── 404.html          <-- Fallback page for unmatched routes
│   │   ├── home.html         <-- Landing page template
│   │   └── lectures/
│   │       ├── index.html    <-- Lectures catalog / list page template
│   │       ├── Lection_1.html <-- Lecture 1 template
│   │       └── Lection_2.html <-- Lecture 2 template
│   └── router/
│       ├── router.ts         <-- Main Router engine & event handler
│       └── routerList.ts     <-- Route registry & template definitions
```

---

## 🛠️ 3. Router Configuration (`routerList.ts`)

Routes are defined in `src/router/routerList.ts`. Each route entry maps a URL path string to an HTML template string.

### Interface Definition:
```typescript
export interface RouterList {
  path: string
  template: string
}
```

### Current Route Registry:
```typescript
import homeHtml from '../pages/home.html?raw'
import lecturesIndexHtml from '../pages/lectures/index.html?raw'
import lection1Html from '../pages/lectures/Lection_1.html?raw'
import lection2Html from '../pages/lectures/Lection_2.html?raw'
import testHtml from '../pages/test.html?raw'

export const routerList: RouterList[] = [
  { path: '/', template: homeHtml },
  { path: '/lectures', template: lecturesIndexHtml },
  { path: '/lectures/1', template: lection1Html },
  { path: '/lectures/2', template: lection2Html },
  // Route Aliases
  { path: '/lecture/1', template: lection1Html },
  { path: '/lecture/2', template: lection2Html },
  { path: '/test', template: testHtml },
]
```

---

## 🚀 4. How to Add a New Route (Step-by-Step)

To add a new page (e.g., **Lecture 3** at `/lectures/3`):

### Step 1: Create the HTML Template
Create a new HTML file in `src/pages/lectures/Lection_3.html`:
```html
<div id="bar"></div>
<div class="wrap">
  <header class="hero">
    <div class="stamp"><span>ОК 11 · Лекція 03</span></div>
    <h1>3. Умовні оператори та розгалуження</h1>
  </header>
  <main>
    <section id="s1">
      <h2>Розділ 1. Конструкція if-elif-else</h2>
      <p>Контент лекції...</p>
    </section>
  </main>
</div>
```

### Step 2: Register the Route in `routerList.ts`
Open `src/router/routerList.ts`:
1. Import the template with `?raw`:
   ```typescript
   import lection3Html from '../pages/lectures/Lection_3.html?raw'
   ```
2. Add the route object to `routerList`:
   ```typescript
   export const routerList: RouterList[] = [
     // ... existing routes
     { path: '/lectures/3', template: lection3Html },
     { path: '/lecture/3', template: lection3Html }, // Alias
   ]
   ```

### Step 3: Link to the New Page
Add a standard link in any page template:
```html
<a href="/lectures/3" class="btn-primary">Читати Лекцію 3 →</a>
```

The router will automatically intercept the click, push `/lectures/3` to browser history, and render `Lection_3.html` without reloading the browser!

---

## 🔍 5. Internal Mechanics (`router.ts`)

The router engine in `src/router/router.ts` consists of three primary responsibilities:

### 1. Navigation Event Interception
A single global click listener on `document` catches all `<a>` anchor tag interactions:
```typescript
document.addEventListener('click', event => {
  const target = event.target as HTMLElement
  const link = target.closest('a')
  if (!link) return

  const href = link.getAttribute('href')
  if (
    href &&
    href.startsWith('/') &&
    !link.hasAttribute('target') &&
    !link.hasAttribute('download')
  ) {
    // Check if the link points to a static file (e.g., .docx, .pdf)
    const isStaticFile = /\.(docx|doc|pdf|zip|rar|png|jpg|jpeg|svg|txt|py)$/i.test(href)
    const cleanHrefPath = normalizePath(href.split('#')[0].split('?')[0])
    const matchesRoute = routerList.some(r => normalizePath(r.path) === cleanHrefPath)

    if (!isStaticFile && matchesRoute) {
      event.preventDefault()
      window.history.pushState(null, '', href)
      routerFindElement(htmlElement, routerList)
    }
  }
})
```

### 2. Static File & Download Bypass Rules
The router **will NOT intercept** navigation when:
- The `<a>` element has a `download` attribute (e.g., `<a href="/tasks/file.docx" download>`).
- The `<a>` element has `target="_blank"`.
- The `href` ends with a static file extension (`.docx`, `.doc`, `.pdf`, `.zip`, `.py`, etc.).
- The `href` does not match any registered route in `routerList`.

In these cases, the native browser behavior is preserved, triggering direct HTTP file downloads or standard requests.

### 3. DOM Rendering & Re-initialization Flow
When a route matches:
1. `normalizePath(window.location.pathname)` strips trailing slashes for clean matching.
2. `renderHeader(pathname)` returns the global header HTML with the active link marked `.active`.
3. `htmlElement.innerHTML` is updated with `headerHtml + pageContent`.
4. If a `#hash` exists in the URL, `targetEl.scrollIntoView({ behavior: 'smooth' })` is invoked; otherwise, `window.scrollTo(0, 0)` resets scroll position.
5. `initEngine()` is called to attach dynamic behaviors to elements present in the template.

---

## 🎨 6. Global Header & Active Nav Styling

The router automatically prepends the site header to every route:

```typescript
const renderHeader = (currentPathname: string) => {
  const cleanPath = normalizePath(currentPathname)
  const isLecturesActive =
    cleanPath === '/lectures' ||
    cleanPath.startsWith('/lectures/') ||
    cleanPath.startsWith('/lecture/')

  return `
    <header class="site-header">
      <div class="nav-wrap">
        <a href="/" class="site-brand">
          <span class="brand-badge">ОК 11</span>
          <span class="brand-title">Основи Python</span>
        </a>
        <nav class="site-nav">
          <a href="/" class="${cleanPath === '/' ? 'active' : ''}">Головна</a>
          <a href="/lectures" class="${isLecturesActive ? 'active' : ''}">Список лекцій</a>
        </nav>
      </div>
    </header>
  `
}
```

---

## ⚙️ 7. Engine Integration (`engine.ts`)

Because templates are inserted dynamically via `innerHTML`, inline `<script>` tags inside imported HTML files do not execute. To overcome this:

1. Interactive data (quizzes, glossary terms, code anatomy definitions, conveyor steps) is stored in `<script type="application/json" id="lesson-data">`.
2. All interactive behavior is driven by `src/engine.ts`.
3. Whenever `routerFindElement()` swaps pages, `initEngine()` runs immediately afterwards, scanning the newly injected DOM for:
   - `#bar` (Reading progress bar)
   - `[data-tabs]` (Tabbed panels)
   - `[data-run]` (Interactive code execution toggle)
   - `.chips[data-picker]` & `.pipe[data-pipe]` (Interactive selector widgets)
   - `.tok[data-e]` (Code anatomy tokens)
   - `#quizBox` (Quiz engine & instant score calculation)
   - `#glSearch` (Glossary live search filter)
   - `ul.chk[data-key]` (Local-storage persistent checklists)

---

## 💡 8. Best Practices & FAQs

### Q: Why is my file download going to 404?
**Answer**: Make sure your download link includes the `download` attribute or points to a file inside `public/` (e.g. `/tasks/file.docx`). The router automatically skips any link with `download` or static file extensions (`.docx`, `.pdf`, etc.).

### Q: How do anchor links (like `#quiz` or `#s1`) work inside a lecture?
**Answer**: Links starting with `#` (e.g. `<a href="#quiz">`) are ignored by `href.startsWith('/')` in the router, allowing native browser smooth scrolling to `<section id="quiz">`.

### Q: Where should I put downloadable files?
**Answer**: Place static files inside the `public/` directory (e.g. `public/tasks/file.docx`). Vite serves files in `public/` at the root URL path (`/tasks/file.docx`).

---

*Documentation maintained for `suem_programing_lecture`.*
