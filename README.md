# A advance calculator

🧮 **Overview**

A advance calculator is a polished React + Vite calculator app built as a compact portfolio project. It focuses on a real usable first screen: scientific functions, memory controls, history, keyboard input, responsive layout, and accessible controls.

✨ **Features**

- Scientific operations: `sin`, `cos`, `tan`, `sqrt`, `log`, `ln`, `abs`, exponent, percent, factorial, constants, and parentheses.
- Degree/radian angle mode toggle.
- Memory controls: `MC`, `MR`, `M+`, and `M-`.
- Calculation history with one-click restore.
- Keyboard support for digits, operators, `Enter`, `Escape`, and `Backspace`.
- Responsive layout for desktop, tablet, and mobile.
- Light/dark theme preference saved locally.
- Accessible labels, live status updates, focus styles, and semantic page structure.

🖼️ **Screenshots**

Screenshot placeholders live in [docs/SCREENSHOTS.md](docs/SCREENSHOTS.md). When screenshots are captured, save them under:

- `docs/screenshots/desktop.png`
- `docs/screenshots/mobile.png`

🛠️ **Tech Stack**

- React
- Vite
- Modern CSS
- Local Storage for theme and calculation history

🚀 **Setup**

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

📦 **Build**

```bash
npm run build
npm run preview
```

✅ **Quality Checks**

```bash
npm run check
```

The `check` script runs the production build, which validates the Vite bundle.

📁 **Project Structure**

```text
.
├── docs/
│   ├── BUILD_NOTES.md
│   ├── SCREENSHOTS.md
│   └── screenshots/
├── public/
│   └── calculator-mark.svg
├── src/
│   ├── data/
│   │   └── buttonGroups.js
│   ├── lib/
│   │   └── calculatorEngine.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

🧪 **Usage**

- Click calculator buttons or use the keyboard.
- Use `DEG/RAD` to switch trig angle modes.
- Use the `Ans` key to insert the previous result.
- Use memory controls to store a running value.
- Select a history item to restore its expression.

🧯 **Troubleshooting**

- If `npm` is blocked in PowerShell, use `npm.cmd install` and `npm.cmd run dev`.
- If the page does not load after running the dev server, confirm the terminal URL and port.
- If a calculation shows an error, check for incomplete expressions, unbalanced parentheses, or invalid values such as division by zero.

💼 **What This Demonstrates To Employers**

- Building a complete React + Vite app without relying on external services.
- Clean separation between UI state, button data, and calculation logic.
- Accessible interaction patterns, keyboard support, and responsive CSS.
- Practical documentation for setup, validation, and future maintenance.

🔮 **Future Improvements**

- Add editable expression cursor placement.
- Add graphing for single-variable functions.
- Add exportable calculation sessions.
- Add unit conversion modes for engineering and finance workflows.
