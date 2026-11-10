const REQUIRED_HEADERS = ['deck', 'depan', 'belakang'];

function createRowError(row, reason) {
  return { row, reason };
}

export function parseCSV(text) {
  const rows = [];
  const rowNumbers = [];
  const errors = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let quoteClosed = false;
  let lineNumber = 1;
  let recordStartLine = 1;

  const normalizedText = String(text ?? '').replace(/^\uFEFF/, '');

  for (let index = 0; index < normalizedText.length; index += 1) {
    const character = normalizedText[index];

    if (inQuotes) {
      if (character === '"') {
        if (normalizedText[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
          quoteClosed = true;
        }
      } else if (character === '\r' && normalizedText[index + 1] === '\n') {
        field += '\r\n';
        index += 1;
        lineNumber += 1;
      } else if (character === '\n') {
        field += '\n';
        lineNumber += 1;
      } else {
        field += character;
      }
      continue;
    }

    if (quoteClosed) {
      if (character === ' ' || character === '\t') {
        continue;
      }
      if (character === ',') {
        row.push(field);
        field = '';
        quoteClosed = false;
        continue;
      }
      if (character === '\r' || character === '\n') {
        if (character === '\r' && normalizedText[index + 1] === '\n') {
          index += 1;
        }

        row.push(field);
        if (row.some((value) => value.trim() !== '')) {
          rows.push(row);
          rowNumbers.push(recordStartLine);
        }
        row = [];
        field = '';
        quoteClosed = false;
        lineNumber += 1;
        recordStartLine = lineNumber;
        continue;
      }

      errors.push(createRowError(lineNumber, 'Unexpected character after closing quote'));
      field += character;
      quoteClosed = false;
      continue;
    }

    if (character === '"' && field.length === 0) {
      inQuotes = true;
    } else if (character === '"') {
      errors.push(createRowError(lineNumber, 'Unexpected quote in unquoted field'));
      field += character;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\r' || character === '\n') {
      if (character === '\r' && normalizedText[index + 1] === '\n') {
        index += 1;
      }

      row.push(field);
      if (row.some((value) => value.trim() !== '')) {
        rows.push(row);
        rowNumbers.push(recordStartLine);
      }
      row = [];
      field = '';
      lineNumber += 1;
      recordStartLine = lineNumber;
    } else {
      field += character;
    }
  }

  if (inQuotes) {
    errors.push(createRowError(recordStartLine, 'Quoted field is not closed'));
  }

  row.push(field);
  if (row.some((value) => value.trim() !== '')) {
    rows.push(row);
    rowNumbers.push(recordStartLine);
  }

  return { rows, rowNumbers, errors };
}

export function parseFlashcardCSV(text) {
  const { rows, rowNumbers, errors } = parseCSV(text);

  if (errors.length > 0) {
    return { items: [], invalidRows: [], errors };
  }

  if (rows.length === 0) {
    return {
      items: [],
      invalidRows: [],
      errors: [createRowError(1, 'CSV is empty')]
    };
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));

  if (missingHeaders.length > 0) {
    return {
      items: [],
      invalidRows: [],
      errors: [
        createRowError(
          rowNumbers[0] ?? 1,
          `Missing required header${missingHeaders.length > 1 ? 's' : ''}: ${missingHeaders.join(', ')}`
        )
      ]
    };
  }

  const headerIndexes = Object.fromEntries(
    REQUIRED_HEADERS.map((header) => [header, headers.indexOf(header)])
  );
  const items = [];
  const invalidRows = [];

  rows.slice(1).forEach((values, index) => {
    const rowNumber = rowNumbers[index + 1];
    const item = {
      deck: values[headerIndexes.deck]?.trim() ?? '',
      front: values[headerIndexes.depan]?.trim() ?? '',
      back: values[headerIndexes.belakang]?.trim() ?? ''
    };

    if (!item.deck || !item.front || !item.back) {
      invalidRows.push(createRowError(rowNumber, 'Missing deck, depan, or belakang value'));
      return;
    }

    items.push(item);
  });

  return { items, invalidRows, errors: [] };
}
