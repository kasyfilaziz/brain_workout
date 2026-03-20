const OPERATIONS = {
  add: { symbol: '+', fn: (a, b) => a + b },
  subtract: { symbol: '-', fn: (a, b) => a - b },
  multiply: { symbol: '\u00D7', fn: (a, b) => a * b },
  divide: { symbol: '\u00F7', fn: (a, b) => a / b }
};

const DIFFICULTY_RANGES = {
  easy: { min: 1, max: 9 },
  medium: { min: 10, max: 99 },
  hard: { min: 100, max: 999 }
};

const OPERATION_LIST = ['add', 'subtract', 'multiply', 'divide'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomOperation() {
  return OPERATION_LIST[Math.floor(Math.random() * OPERATION_LIST.length)];
}

export function getOperationSymbol(operation) {
  return OPERATIONS[operation]?.symbol || '?';
}

export function getOperandRange(difficulty) {
  return DIFFICULTY_RANGES[difficulty] || DIFFICULTY_RANGES.easy;
}

export function generateProblem(operation, difficulty) {
  const range = getOperandRange(difficulty);
  let operand1, operand2, answer;

  switch (operation) {
    case 'add':
      operand1 = randInt(range.min, range.max);
      operand2 = randInt(range.min, range.max);
      answer = operand1 + operand2;
      break;

    case 'subtract':
      operand1 = randInt(range.min, range.max);
      operand2 = randInt(range.min, operand1);
      answer = operand1 - operand2;
      break;

    case 'multiply': {
      const easyMax = Math.min(range.max, 12);
      operand1 = randInt(range.min, easyMax);
      operand2 = randInt(range.min, easyMax);
      answer = operand1 * operand2;
      break;
    }

    case 'divide': {
      const divMax = Math.min(range.max, 12);
      const divisor = randInt(2, divMax);
      const quotient = randInt(1, divMax);
      operand1 = divisor * quotient;
      operand2 = divisor;
      answer = quotient;
      break;
    }

    default:
      operand1 = randInt(range.min, range.max);
      operand2 = randInt(range.min, range.max);
      answer = operand1 + operand2;
  }

  return {
    operand1,
    operand2,
    operation,
    answer,
    display: `${operand1} ${getOperationSymbol(operation)} ${operand2} = ?`
  };
}
