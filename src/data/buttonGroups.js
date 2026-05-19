export const keypadButtons = [
  { id: "clear", label: "AC", ariaLabel: "Clear expression", command: "clear", tone: "danger" },
  { id: "left-paren", label: "(", ariaLabel: "Insert left parenthesis", insert: "(" },
  { id: "right-paren", label: ")", ariaLabel: "Insert right parenthesis", insert: ")" },
  { id: "percent", label: "%", ariaLabel: "Insert percent", insert: "%", tone: "operator" },
  { id: "delete", label: "DEL", ariaLabel: "Delete last character", command: "backspace" },

  { id: "angle", label: "DEG", ariaLabel: "Toggle degree or radian mode", command: "angle", tone: "function" },
  { id: "sin", label: "sin", ariaLabel: "Insert sine function", insert: "sin(", tone: "function" },
  { id: "cos", label: "cos", ariaLabel: "Insert cosine function", insert: "cos(", tone: "function" },
  { id: "tan", label: "tan", ariaLabel: "Insert tangent function", insert: "tan(", tone: "function" },
  { id: "power", label: "x^y", ariaLabel: "Insert exponent operator", insert: "^", tone: "operator" },

  { id: "sqrt", label: "sqrt", ariaLabel: "Insert square root function", insert: "sqrt(", tone: "function" },
  { id: "log", label: "log", ariaLabel: "Insert base ten logarithm", insert: "log(", tone: "function" },
  { id: "ln", label: "ln", ariaLabel: "Insert natural logarithm", insert: "ln(", tone: "function" },
  { id: "abs", label: "abs", ariaLabel: "Insert absolute value function", insert: "abs(", tone: "function" },
  { id: "divide", label: "/", ariaLabel: "Divide", insert: "/", tone: "operator" },

  { id: "seven", label: "7", ariaLabel: "Seven", insert: "7" },
  { id: "eight", label: "8", ariaLabel: "Eight", insert: "8" },
  { id: "nine", label: "9", ariaLabel: "Nine", insert: "9" },
  { id: "factorial", label: "!", ariaLabel: "Factorial", insert: "!", tone: "operator" },
  { id: "multiply", label: "*", ariaLabel: "Multiply", insert: "*", tone: "operator" },

  { id: "four", label: "4", ariaLabel: "Four", insert: "4" },
  { id: "five", label: "5", ariaLabel: "Five", insert: "5" },
  { id: "six", label: "6", ariaLabel: "Six", insert: "6" },
  { id: "pi", label: "pi", ariaLabel: "Insert pi", insert: "pi", tone: "function" },
  { id: "subtract", label: "-", ariaLabel: "Subtract", insert: "-", tone: "operator" },

  { id: "one", label: "1", ariaLabel: "One", insert: "1" },
  { id: "two", label: "2", ariaLabel: "Two", insert: "2" },
  { id: "three", label: "3", ariaLabel: "Three", insert: "3" },
  { id: "e", label: "e", ariaLabel: "Insert Euler constant", insert: "e", tone: "function" },
  { id: "add", label: "+", ariaLabel: "Add", insert: "+", tone: "operator" },

  { id: "ans", label: "Ans", ariaLabel: "Insert last result", insert: "Ans", tone: "function" },
  { id: "zero", label: "0", ariaLabel: "Zero", insert: "0" },
  { id: "decimal", label: ".", ariaLabel: "Decimal point", insert: "." },
  { id: "sign", label: "+/-", ariaLabel: "Toggle sign", command: "sign" },
  { id: "equals", label: "=", ariaLabel: "Calculate result", command: "evaluate", tone: "equals" },
];

export const memoryButtons = [
  { id: "memory-clear", label: "MC", ariaLabel: "Clear memory", command: "memory-clear" },
  { id: "memory-recall", label: "MR", ariaLabel: "Recall memory", command: "memory-recall" },
  { id: "memory-add", label: "M+", ariaLabel: "Add current value to memory", command: "memory-add" },
  { id: "memory-subtract", label: "M-", ariaLabel: "Subtract current value from memory", command: "memory-subtract" },
];
