# Build Notes - A advance calculator

## 🧱 What Was Built Today

Built a complete React + Vite frontend app for a polished advanced calculator. The app includes a real calculator workspace as the first screen, with scientific operations, memory controls, history, keyboard support, responsive layout, and theme persistence.

## 🧭 Implementation Decisions

- Used a small custom expression engine instead of `eval` so calculator behavior is easier to reason about and safer to maintain.
- Split calculator button metadata into `src/data/buttonGroups.js` so the keypad is data-driven.
- Kept calculation parsing and formatting in `src/lib/calculatorEngine.js` to separate domain logic from React rendering.
- Used local storage only for non-sensitive preferences: theme and recent calculation history.
- Designed the layout as a working tool rather than a landing page.

## ✅ Validation

Completed local validation:

```bash
node --check src/lib/calculatorEngine.js
node --check src/data/buttonGroups.js
node --check vite.config.js
node --input-type=module -e "..."
```

The smoke test covered `2+2`, `sqrt(144)`, `sin(30)`, `5!`, implicit multiplication, `log(1000)`, unary exponent precedence, and negative exponents.

Attempted dependency installation:

```bash
npm.cmd install
npm.cmd install --no-audit --no-fund --fetch-timeout=30000 --fetch-retries=1
```

The install could not complete in this sandbox because access to `https://registry.npmjs.org/` was rejected with `EACCES`. Because dependencies were unavailable, the Vite production build and browser screenshot capture could not be run here.

Manual checks to perform after launch:

- Calculate common expressions such as `2+2`, `sqrt(144)`, `sin(30)`, and `5!`.
- Switch between `DEG` and `RAD` modes.
- Verify memory buttons update the memory value.
- Verify history restore works.
- Confirm keyboard actions for digits, operators, `Enter`, `Escape`, and `Backspace`.
- Review mobile and desktop screenshots.

## 🖼️ Screenshots

Screenshot placeholders are documented in `docs/SCREENSHOTS.md`. Captured images should be saved to `docs/screenshots/` after `npm install` succeeds in an environment with npm registry access.

## 🔮 Future Improvements

- Add cursor-aware editing inside the expression display.
- Add graphing for equations such as `sin(x)`.
- Add saved calculation notebooks.
- Add a focused accessibility test pass with automated tooling.
