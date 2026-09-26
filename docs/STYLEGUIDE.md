# Design System & UI Styleguide

Comprehensive documentation of the design tokens, visual style, UI components, typography, color palette, and coding conventions used across the **`suem_programing_lecture`** project.

---

## 🎨 1. Design System Principles

The visual language is modeled after technical engineering blueprints and modern interactive course materials:
- **Blueprint Aesthetic**: Clean technical borders (`--rule`), structured data grids, monospace metadata stamps (`.stamp`), and a subtle 28px background grid pattern.
- **Mobile-First & Responsive**: All layout rules start with mobile viewport optimization (360px–430px) and scale seamlessly to desktop screens (≥900px) with two-column layouts.
- **Accessibility & Contrast**: Explicit high-contrast typography, focus indicators (`:focus-visible`), aria attributes (`aria-selected`, `aria-pressed`), and keyboard navigation support.
- **Automatic Dark Mode**: Built-in support for both OS preference (`prefers-color-scheme: dark`) and manual attribute switching (`[data-theme="dark"]`).

---

## 🔤 2. Typography & Fonts

The system utilizes three distinct Google Font families:

| CSS Variable | Font Family | Usage |
| :--- | :--- | :--- |
| `--font-display` | `"Unbounded", sans-serif` | Page titles (`h1`), main section headings (`h2`), card titles, brand logos |
| `--font-body` | `"Commissioner", sans-serif` | Paragraph text, body copy, specs descriptions, button labels |
| `--font-mono` | `"JetBrains Mono", monospace` | Code snippets, technical stamps, section badges, quiz markers, table numbers |

### Font Hierarchy Example:
```css
h1 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(26px, 7vw, 52px);
  line-height: 1.08;
  letter-spacing: -.02em;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.62;
}

code, pre, .stamp {
  font-family: var(--font-mono);
}
```

---

## 🎨 3. Color Palette & CSS Tokens

All colors are maintained as CSS Custom Properties in `:root`.

### Light & Dark Theme Mapping:

| Token | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--ground` | `#eaeff5` | `#0b131f` | Global page background |
| `--sheet` | `#ffffff` | `#121c2b` | Section cards, primary surface |
| `--sheet-2` | `#f4f7fb` | `#162233` | Secondary surface (tables, code panels, option buttons) |
| `--ink` | `#14202f` | `#dde7f4` | Primary text color |
| `--ink-2` | `#4a5c72` | `#9fb2c9` | Secondary / muted text |
| `--ink-3` | `#7c8da3` | `#74889f` | Captions, metadata, inactive labels |
| `--rule` | `#c8d5e4` | `#27374d` | Card borders & dividers |
| `--rule-soft` | `#dde6f0` | `#1d2b3e` | Thin soft separators |
| `--accent` | `#0b5fa5` | `#63a6ee` | Blueprint blue (Primary action color) |
| `--accent-soft` | `#e2edf8` | `#152a42` | Soft blue accent background |
| `--ochre` | `#a8681a` | `#d9a05b` | Note / Warning callout color |
| `--good` | `#0d7a63` | `#4fc0a5` | Success / Right quiz answer green |
| `--bad` | `#b32f4c` | `#ef7f97` | Error / Wrong quiz answer red |
| `--code-bg` | `#101a2a` | `#0a1220` | Code snippet background |
| `--code-ink` | `#dbe6f5` | `#dbe6f5` | Code default text color |

---

## 📐 4. Layout & Grid System

### 1. Global Container (`.wrap`)
Enforces maximum readable content width:
```css
.wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 14px 72px;
}
```

### 2. Desktop Two-Column Layout (`.cols`)
On desktop screens (`min-width: 900px`), content splits into a fixed sticky sidebar rail (`222px`) and a main content area (`1fr`):
```css
@media (min-width: 900px) {
  .cols {
    display: grid;
    grid-template-columns: 222px minmax(0, 1fr);
    gap: 38px;
    align-items: start;
  }
}
```

---

## 🧩 5. Component Library & Class Reference

### 1. Stamps & Badges (`.stamp`)
Small uppercase technical tag badges:
```html
<div class="stamp"><span>ОК 11 · Основи програмування (Python)</span></div>
```

### 2. Action Buttons (`.btn-primary`, `.btn-secondary`)
Primary and secondary interactive buttons:
```html
<a href="/lectures" class="btn-primary">Переглянути лекції →</a>
<a href="/tasks/file.docx" download class="btn-secondary">📥 Завантажити завдання (.docx)</a>
```

### 3. Callout Boxes (`.note`, `.key`)
Key takeaways and explanatory note blocks:
```html
<!-- Important Note -->
<div class="note">
  <span class="lbl">Зверніть увагу</span>
  <p>Інтерпретатор виконання коду читає файл зверху вниз.</p>
</div>

<!-- Key Concept -->
<div class="key">
  <span class="lbl">Головний принцип</span>
  <p>Змінна — це ім'я, прив'язане до значення в пам'яті.</p>
</div>
```

### 4. Code Display & Execution Blocks (`.code`, `.runbar`, `.out`)
Syntax-highlighted code container with runnable output drawer:
```html
<div class="code">
  <div class="fname">hello.py</div>
  <pre><span class="t">print</span>(<span class="s">"Привіт, Python!"</span>)</pre>
</div>
<div class="runbar">
  <button class="btn" data-run="out-demo">▶ Запустити код</button>
</div>
<div class="out" id="out-demo" hidden>Привіт, Python!
<span class="cm">Process finished with exit code 0</span></div>
```

#### Syntax Highlighting Utility Classes:
- `.k` : Keywords (`def`, `if`, `class`, `import`, `return`)
- `.s` : String literals (`"text"`, `'string'`)
- `.c` : Comments (`# comment`)
- `.n` : Variable names & identifiers
- `.t` : Built-in functions (`print()`, `len()`, `type()`, `int()`)
- `.m` : Numeric literals (`42`, `3.14`)

### 5. Interactive Code Anatomy (`.anat`, `.tok`, `.anat-out`)
Tokenized code snippets that display definitions when clicked:
```html
<div class="anat">
  <pre><span class="tok" data-e="print">print</span><span class="tok" data-e="paren">(</span><span class="tok" data-e="str">"Hello"</span><span class="tok" data-e="paren">)</span></pre>
</div>
<div class="anat-out">Клікніть на елемент коду, щоб побачити пояснення.</div>
```

### 6. Interactive Quiz Component (`#quizBox`)
Containers processed automatically by `src/engine.ts`:
```html
<div id="quizBox"></div>
<div class="score">
  <div>
    <div class="big" id="sc">0</div>
    <div class="lbl">Правильних</div>
  </div>
  <button id="reset" class="btn ghost">Спробувати знову</button>
</div>
```

### 7. Interactive Checklist (`ul.chk[data-key]`)
Checklist items that persist checked states into `localStorage`:
```html
<ul class="chk" data-key="python-t1-checklist">
  <li><label><input type="checkbox"><span>Встановив(ла) Python 3.12</span></label></li>
</ul>
<p class="chkbar" data-chk-count="python-t1-checklist"></p>
```

---

## 💻 6. Code Style Standards

### HTML
- Use semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`).
- Always specify accessible labels (`aria-label`, `role="button"`).
- Section headings must follow logical nesting (`h1` -> `h2` -> `h3`).

### CSS
- Maintain all theme variables in `:root`. Do not hardcode static pixel values for colors.
- Use mobile-first CSS architecture (base rules target screens 360px–430px; desktop enhancements use `@media (min-width: 900px)`).

### Python Code Examples in Templates
- Follow **PEP 8** guidelines strictly in all code snippets:
  - `snake_case` for variable names (`total_price`, `item_count`).
  - 4 spaces for indentation.
  - Space around binary operators (`a + b = c`).
  - Clear comments explaining *why*, not *what*.

---

*Styleguide maintained for `suem_programing_lecture`.*
