export class CalculatorError extends Error {
  constructor(message) {
    super(message);
    this.name = "CalculatorError";
  }
}

const OPERATORS = {
  "+": { precedence: 2, associativity: "left", arity: 2, fn: (left, right) => left + right },
  "-": { precedence: 2, associativity: "left", arity: 2, fn: (left, right) => left - right },
  "*": { precedence: 3, associativity: "left", arity: 2, fn: (left, right) => left * right },
  "/": {
    precedence: 3,
    associativity: "left",
    arity: 2,
    fn: (left, right) => {
      if (right === 0) {
        throw new CalculatorError("Cannot divide by zero.");
      }

      return left / right;
    },
  },
  "^": { precedence: 5, associativity: "right", arity: 2, fn: (left, right) => left ** right },
  "u-": { precedence: 4, associativity: "right", arity: 1, fn: (value) => -value },
  "%": { precedence: 6, associativity: "left", arity: 1, postfix: true, fn: (value) => value / 100 },
  "!": { precedence: 6, associativity: "left", arity: 1, postfix: true, fn: factorial },
};

const FUNCTIONS = {
  sin: (value, angleMode) => Math.sin(toRadians(value, angleMode)),
  cos: (value, angleMode) => Math.cos(toRadians(value, angleMode)),
  tan: (value, angleMode) => Math.tan(toRadians(value, angleMode)),
  sqrt: (value) => {
    if (value < 0) {
      throw new CalculatorError("Square root needs a non-negative value.");
    }

    return Math.sqrt(value);
  },
  log: (value) => {
    if (value <= 0) {
      throw new CalculatorError("Log needs a value greater than zero.");
    }

    return Math.log10(value);
  },
  ln: (value) => {
    if (value <= 0) {
      throw new CalculatorError("Natural log needs a value greater than zero.");
    }

    return Math.log(value);
  },
  abs: (value) => Math.abs(value),
};

function factorial(value) {
  if (!Number.isInteger(value) || value < 0) {
    throw new CalculatorError("Factorial needs a non-negative whole number.");
  }

  if (value > 170) {
    throw new CalculatorError("Factorial is too large to display.");
  }

  let total = 1;
  for (let index = 2; index <= value; index += 1) {
    total *= index;
  }

  return total;
}

function toRadians(value, angleMode) {
  return angleMode === "deg" ? (value * Math.PI) / 180 : value;
}

function isDigit(character) {
  return character >= "0" && character <= "9";
}

function isAlpha(character) {
  return /[A-Za-z]/.test(character);
}

function readNumber(expression, startIndex) {
  let index = startIndex;
  let decimalCount = 0;

  while (index < expression.length) {
    const character = expression[index];

    if (character === ".") {
      decimalCount += 1;
      if (decimalCount > 1) {
        throw new CalculatorError("Number contains more than one decimal point.");
      }

      index += 1;
      continue;
    }

    if (!isDigit(character)) {
      break;
    }

    index += 1;
  }

  const raw = expression.slice(startIndex, index);
  if (raw === ".") {
    throw new CalculatorError("Decimal point needs a number.");
  }

  return {
    nextIndex: index,
    token: { type: "number", value: Number(raw), raw },
  };
}

function readWord(expression, startIndex, ans) {
  let index = startIndex;

  while (index < expression.length && isAlpha(expression[index])) {
    index += 1;
  }

  const raw = expression.slice(startIndex, index);
  const normalized = raw.toLowerCase();

  if (normalized === "pi") {
    return { nextIndex: index, token: { type: "number", value: Math.PI, raw } };
  }

  if (normalized === "e") {
    return { nextIndex: index, token: { type: "number", value: Math.E, raw } };
  }

  if (normalized === "ans") {
    return { nextIndex: index, token: { type: "number", value: ans, raw } };
  }

  if (FUNCTIONS[normalized]) {
    return { nextIndex: index, token: { type: "function", value: normalized, raw } };
  }

  throw new CalculatorError(`Unknown token "${raw}".`);
}

function endsValue(token) {
  return (
    token.type === "number" ||
    token.type === "rightParen" ||
    (token.type === "operator" && OPERATORS[token.value]?.postfix)
  );
}

function startsValue(token) {
  return token.type === "number" || token.type === "function" || token.type === "leftParen";
}

function insertImplicitMultiplication(tokens) {
  return tokens.reduce((result, token) => {
    const previous = result.at(-1);

    if (previous && endsValue(previous) && startsValue(token)) {
      result.push({ type: "operator", value: "*", raw: "*" });
    }

    result.push(token);
    return result;
  }, []);
}

function tokenize(expression, ans) {
  const tokens = [];
  let index = 0;

  while (index < expression.length) {
    const character = expression[index];

    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (isDigit(character) || character === ".") {
      const { nextIndex, token } = readNumber(expression, index);
      tokens.push(token);
      index = nextIndex;
      continue;
    }

    if (isAlpha(character)) {
      const { nextIndex, token } = readWord(expression, index, ans);
      tokens.push(token);
      index = nextIndex;
      continue;
    }

    if (character === "(") {
      tokens.push({ type: "leftParen", value: character, raw: character });
      index += 1;
      continue;
    }

    if (character === ")") {
      tokens.push({ type: "rightParen", value: character, raw: character });
      index += 1;
      continue;
    }

    if (OPERATORS[character]) {
      tokens.push({ type: "operator", value: character, raw: character });
      index += 1;
      continue;
    }

    throw new CalculatorError(`Cannot read "${character}".`);
  }

  return insertImplicitMultiplication(tokens);
}

function isUnaryPosition(previousToken) {
  return (
    !previousToken ||
    previousToken.type === "leftParen" ||
    (previousToken.type === "operator" && !OPERATORS[previousToken.value]?.postfix)
  );
}

function shouldPopOperator(stackOperator, incomingOperator) {
  if (stackOperator.type === "function") {
    return true;
  }

  if (stackOperator.type !== "operator") {
    return false;
  }

  const stackMeta = OPERATORS[stackOperator.value];
  const incomingMeta = OPERATORS[incomingOperator];

  return incomingMeta.associativity === "left"
    ? incomingMeta.precedence <= stackMeta.precedence
    : incomingMeta.precedence < stackMeta.precedence;
}

function toRpn(tokens) {
  const output = [];
  const stack = [];
  let previousToken = null;

  for (const token of tokens) {
    if (token.type === "number") {
      output.push(token);
      previousToken = token;
      continue;
    }

    if (token.type === "function") {
      stack.push(token);
      previousToken = token;
      continue;
    }

    if (token.type === "leftParen") {
      stack.push(token);
      previousToken = token;
      continue;
    }

    if (token.type === "rightParen") {
      while (stack.length > 0 && stack.at(-1).type !== "leftParen") {
        output.push(stack.pop());
      }

      if (stack.length === 0) {
        throw new CalculatorError("Parentheses are not balanced.");
      }

      stack.pop();

      if (stack.at(-1)?.type === "function") {
        output.push(stack.pop());
      }

      previousToken = token;
      continue;
    }

    if (token.type === "operator") {
      let operator = token.value;

      if (operator === "+" && isUnaryPosition(previousToken)) {
        previousToken = token;
        continue;
      }

      if (operator === "-" && isUnaryPosition(previousToken)) {
        operator = "u-";
      }

      if (operator === "u-") {
        stack.push({ type: "operator", value: operator });
        previousToken = { ...token, value: operator };
        continue;
      }

      if (OPERATORS[operator].postfix) {
        output.push({ type: "operator", value: operator });
        previousToken = { ...token, value: operator };
        continue;
      }

      while (stack.length > 0 && shouldPopOperator(stack.at(-1), operator)) {
        output.push(stack.pop());
      }

      stack.push({ type: "operator", value: operator });
      previousToken = { ...token, value: operator };
    }
  }

  while (stack.length > 0) {
    const token = stack.pop();

    if (token.type === "leftParen") {
      throw new CalculatorError("Parentheses are not balanced.");
    }

    output.push(token);
  }

  return output;
}

function evaluateRpn(rpn, angleMode) {
  const stack = [];

  for (const token of rpn) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }

    if (token.type === "function") {
      const value = stack.pop();
      if (value === undefined) {
        throw new CalculatorError("Function is missing a value.");
      }

      stack.push(FUNCTIONS[token.value](value, angleMode));
      continue;
    }

    if (token.type === "operator") {
      const operator = OPERATORS[token.value];

      if (operator.arity === 1) {
        const value = stack.pop();
        if (value === undefined) {
          throw new CalculatorError("Operator is missing a value.");
        }

        stack.push(operator.fn(value));
        continue;
      }

      const right = stack.pop();
      const left = stack.pop();

      if (left === undefined || right === undefined) {
        throw new CalculatorError("Expression is incomplete.");
      }

      stack.push(operator.fn(left, right));
    }
  }

  if (stack.length !== 1) {
    throw new CalculatorError("Expression is incomplete.");
  }

  const value = stack[0];
  if (!Number.isFinite(value)) {
    throw new CalculatorError("Result is outside the displayable range.");
  }

  return value;
}

export function formatNumber(value) {
  if (Object.is(value, -0)) {
    return "0";
  }

  const absoluteValue = Math.abs(value);

  if (absoluteValue !== 0 && (absoluteValue >= 1e12 || absoluteValue < 1e-7)) {
    return value.toExponential(8).replace(/\.?0+e/, "e");
  }

  return String(Number.parseFloat(value.toPrecision(12)));
}

export function formatForExpression(value) {
  const formatted = formatNumber(value);
  return value < 0 ? `(${formatted})` : formatted;
}

export function calculateExpression(expression, options = {}) {
  const trimmedExpression = expression.trim();

  if (!trimmedExpression) {
    throw new CalculatorError("Enter a calculation first.");
  }

  const tokens = tokenize(trimmedExpression, options.ans ?? 0);
  const rpn = toRpn(tokens);
  const value = evaluateRpn(rpn, options.angleMode ?? "deg");

  return {
    value,
    formatted: formatNumber(value),
  };
}
