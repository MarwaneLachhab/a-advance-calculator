import { useCallback, useEffect, useMemo, useState } from "react";
import { keypadButtons, memoryButtons } from "./data/buttonGroups.js";
import { calculateExpression, formatForExpression, formatNumber } from "./lib/calculatorEngine.js";

const HISTORY_KEY = "a-advance-calculator-history";
const THEME_KEY = "a-advance-calculator-theme";
const HISTORY_LIMIT = 8;

function loadHistory() {
  try {
    const storedHistory = window.localStorage.getItem(HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch {
    return [];
  }
}

function loadTheme() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  } catch {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [lastResult, setLastResult] = useState(0);
  const [angleMode, setAngleMode] = useState("deg");
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState(loadHistory);
  const [theme, setTheme] = useState(loadTheme);
  const [status, setStatus] = useState("Ready.");

  const preview = useMemo(() => {
    if (!expression.trim()) {
      return null;
    }

    try {
      return calculateExpression(expression, { angleMode, ans: lastResult });
    } catch {
      return null;
    }
  }, [angleMode, expression, lastResult]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const appendToken = useCallback((token, label = token) => {
    setExpression((currentExpression) => `${currentExpression}${token}`);
    setStatus(`${label} added.`);
  }, []);

  const calculateCurrentValue = useCallback(() => {
    if (!expression.trim()) {
      return lastResult;
    }

    return calculateExpression(expression, { angleMode, ans: lastResult }).value;
  }, [angleMode, expression, lastResult]);

  const runCalculation = useCallback(() => {
    const sourceExpression = expression.trim();

    if (!sourceExpression) {
      setStatus("Enter a calculation first.");
      return;
    }

    try {
      const calculation = calculateExpression(sourceExpression, { angleMode, ans: lastResult });

      setResult(calculation.formatted);
      setLastResult(calculation.value);
      setExpression(calculation.formatted);
      setHistory((currentHistory) => [
        {
          id: `${Date.now()}-${sourceExpression}`,
          expression: sourceExpression,
          result: calculation.formatted,
        },
        ...currentHistory,
      ].slice(0, HISTORY_LIMIT));
      setStatus(`${sourceExpression} equals ${calculation.formatted}.`);
    } catch (error) {
      setStatus(error.message);
    }
  }, [angleMode, expression, lastResult]);

  const handleMemory = useCallback(
    (command) => {
      try {
        if (command === "memory-clear") {
          setMemory(0);
          setStatus("Memory cleared.");
          return;
        }

        if (command === "memory-recall") {
          setExpression((currentExpression) => `${currentExpression}${formatForExpression(memory)}`);
          setStatus(`Memory recalled: ${formatNumber(memory)}.`);
          return;
        }

        const currentValue = calculateCurrentValue();

        if (command === "memory-add") {
          setMemory((currentMemory) => currentMemory + currentValue);
          setStatus(`${formatNumber(currentValue)} added to memory.`);
        }

        if (command === "memory-subtract") {
          setMemory((currentMemory) => currentMemory - currentValue);
          setStatus(`${formatNumber(currentValue)} subtracted from memory.`);
        }
      } catch (error) {
        setStatus(error.message);
      }
    },
    [calculateCurrentValue, memory],
  );

  const handleButton = useCallback(
    (button) => {
      if (button.insert) {
        appendToken(button.insert, button.label);
        return;
      }

      if (button.command?.startsWith("memory")) {
        handleMemory(button.command);
        return;
      }

      if (button.command === "clear") {
        setExpression("");
        setResult("0");
        setStatus("Cleared.");
        return;
      }

      if (button.command === "backspace") {
        setExpression((currentExpression) => currentExpression.slice(0, -1));
        setStatus("Last character deleted.");
        return;
      }

      if (button.command === "sign") {
        setExpression((currentExpression) => {
          if (!currentExpression) {
            return "-";
          }

          if (currentExpression.startsWith("-(") && currentExpression.endsWith(")")) {
            return currentExpression.slice(2, -1);
          }

          return `-(${currentExpression})`;
        });
        setStatus("Sign toggled.");
        return;
      }

      if (button.command === "angle") {
        setAngleMode((currentMode) => (currentMode === "deg" ? "rad" : "deg"));
        setStatus("Angle mode changed.");
        return;
      }

      if (button.command === "evaluate") {
        runCalculation();
      }
    },
    [appendToken, handleMemory, runCalculation],
  );

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (/^[0-9.]$/.test(event.key)) {
        event.preventDefault();
        appendToken(event.key);
        return;
      }

      if ("+-*/^()%!".includes(event.key)) {
        event.preventDefault();
        appendToken(event.key);
        return;
      }

      if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        runCalculation();
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        setExpression((currentExpression) => currentExpression.slice(0, -1));
        setStatus("Last character deleted.");
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setExpression("");
        setResult("0");
        setStatus("Cleared.");
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [appendToken, runCalculation]);

  const displayedResult = expression.trim() && preview ? preview.formatted : result;
  const displayExpression = expression || "Ready";

  return (
    <main className="app-shell" data-theme={theme}>
      <div className="calculator-layout">
        <section className="calculator-panel" aria-labelledby="app-title">
          <header className="app-header">
            <img className="app-mark" src="/calculator-mark.svg" alt="" aria-hidden="true" />
            <div>
              <p className="eyebrow">Scientific workspace</p>
              <h1 id="app-title">A advance calculator</h1>
            </div>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"))}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </header>

          <section className="display-panel" aria-label="Calculator display">
            <div className="display-expression" aria-label="Current expression">
              {displayExpression}
            </div>
            <div className="display-result" aria-live="polite" aria-label="Current result">
              {displayedResult}
            </div>
            <div className="display-meta">
              <span>Ans {formatNumber(lastResult)}</span>
              <span>Memory {formatNumber(memory)}</span>
              <span>{angleMode.toUpperCase()}</span>
            </div>
          </section>

          <div className="memory-row" aria-label="Memory controls">
            {memoryButtons.map((button) => (
              <button
                className="memory-button"
                type="button"
                key={button.id}
                onClick={() => handleButton(button)}
                aria-label={button.ariaLabel}
              >
                {button.label}
              </button>
            ))}
          </div>

          <div className="keypad" aria-label="Calculator keypad">
            {keypadButtons.map((button) => (
              <button
                className={`key key-${button.tone ?? "default"}`}
                type="button"
                key={button.id}
                onClick={() => handleButton(button)}
                aria-label={button.ariaLabel}
                style={button.span ? { gridColumn: `span ${button.span}` } : undefined}
              >
                {button.command === "angle" ? angleMode.toUpperCase() : button.label}
              </button>
            ))}
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {status}
          </p>
        </section>

        <aside className="side-panel" aria-label="Calculator history">
          <div className="side-card status-card">
            <div>
              <p className="panel-label">Status</p>
              <p className="status-text">{status}</p>
            </div>
            <button
              className="clear-history"
              type="button"
              onClick={() => {
                setHistory([]);
                setStatus("History cleared.");
              }}
              disabled={history.length === 0}
            >
              Clear history
            </button>
          </div>

          <section className="side-card" aria-labelledby="history-title">
            <div className="section-heading">
              <p className="panel-label">Recent work</p>
              <h2 id="history-title">History</h2>
            </div>
            {history.length === 0 ? (
              <p className="empty-state">Completed calculations appear here.</p>
            ) : (
              <ol className="history-list">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      className="history-item"
                      type="button"
                      onClick={() => {
                        setExpression(item.expression);
                        setStatus("History expression restored.");
                      }}
                      aria-label={`Restore ${item.expression}`}
                    >
                      <span>{item.expression}</span>
                      <strong>{item.result}</strong>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="side-card" aria-labelledby="quick-reference-title">
            <div className="section-heading">
              <p className="panel-label">Reference</p>
              <h2 id="quick-reference-title">Keyboard</h2>
            </div>
            <dl className="shortcut-grid">
              <div>
                <dt>Enter</dt>
                <dd>Calculate</dd>
              </div>
              <div>
                <dt>Esc</dt>
                <dd>Clear</dd>
              </div>
              <div>
                <dt>Backspace</dt>
                <dd>Delete</dd>
              </div>
              <div>
                <dt>Ans</dt>
                <dd>Last result</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default App;
