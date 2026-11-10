import test from 'node:test';
import assert from 'node:assert/strict';

import { parseCSV, parseFlashcardCSV } from '../../src/apps/flashcard/utils/csv.js';

test('parseFlashcardCSV parses simple rows', () => {
  const result = parseFlashcardCSV('deck,depan,belakang\nBiologi,Sel,Unit terkecil');

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.items, [
    { deck: 'Biologi', front: 'Sel', back: 'Unit terkecil' }
  ]);
});

test('parseFlashcardCSV supports quoted commas and escaped quotes', () => {
  const csv = [
    'deck,depan,belakang',
    '"Sejarah","Siapa proklamator, Indonesia?","Soekarno dan ""Hatta"""'
  ].join('\n');
  const result = parseFlashcardCSV(csv);

  assert.deepEqual(result.items, [
    {
      deck: 'Sejarah',
      front: 'Siapa proklamator, Indonesia?',
      back: 'Soekarno dan "Hatta"'
    }
  ]);
});

test('parseFlashcardCSV supports multiline values and Windows line endings', () => {
  const csv =
    'deck,depan,belakang\r\n' +
    '"Biologi","Sebutkan fungsi mitokondria","Menghasilkan energi.\r\nJuga terlibat dalam metabolisme."\r\n';
  const result = parseFlashcardCSV(csv);

  assert.deepEqual(result.items, [
    {
      deck: 'Biologi',
      front: 'Sebutkan fungsi mitokondria',
      back: 'Menghasilkan energi.\r\nJuga terlibat dalam metabolisme.'
    }
  ]);
});

test('parseCSV reports an unclosed quoted field', () => {
  const result = parseCSV('deck,depan,belakang\n"A,B,C');

  assert.equal(result.errors[0].row, 2);
  assert.match(result.errors[0].reason, /not closed/i);
});

test('parseCSV rejects characters after a closing quote', () => {
  const result = parseFlashcardCSV('deck,depan,belakang\nBiologi,"Sel"junk,Unit terkecil');

  assert.equal(result.items.length, 0);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0].reason, /after closing quote/i);
});

test('invalid rows report their physical line after a multiline field', () => {
  const csv =
    'deck,depan,belakang\n' +
    'Biologi,"Pertanyaan\nmultibaris",Jawaban\n' +
    'Fisika,,Jawaban kosong';
  const result = parseFlashcardCSV(csv);

  assert.equal(result.items.length, 1);
  assert.equal(result.invalidRows.length, 1);
  assert.equal(result.invalidRows[0].row, 4);
});

test('parseFlashcardCSV rejects missing required headers', () => {
  const result = parseFlashcardCSV('deck,front,back\nBiologi,Sel,Unit terkecil');

  assert.equal(result.items.length, 0);
  assert.match(result.errors[0].reason, /depan, belakang/);
});

test('missing-header errors use the physical header line after blank rows', () => {
  const result = parseFlashcardCSV('\n\ndeck,front,back\nBiologi,Sel,Unit terkecil');

  assert.equal(result.errors[0].row, 3);
});

test('parseFlashcardCSV reports incomplete rows before import', () => {
  const result = parseFlashcardCSV('deck,depan,belakang\nBiologi,Sel,');

  assert.equal(result.items.length, 0);
  assert.equal(result.invalidRows.length, 1);
  assert.equal(result.invalidRows[0].row, 2);
});
