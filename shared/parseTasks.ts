import type { TaskItem } from './types';

const INDENTED_REGEX = /^(\t| {2,})/;

// Special characters kept literally in the signature.
// Chars: [ ] ( ) * . · • , @ # \ / - = + < > : ; | ~
const SPECIAL_SET = new Set(Array.from('[]()*.·•,@#\\/-=+<>:;|~'));

// Valid Roman numeral: uppercase only, valid sequence (I…MMMCMXCIX).
const ROMAN_RE = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
function isRoman(word: string): boolean {
  return word.length > 0 && /^[IVXLCDM]+$/.test(word) && ROMAN_RE.test(word);
}

// Returns true for ASCII letters and non-ASCII code points (covers Unicode scripts
// incl. Vietnamese, CJK, etc.) without needing the ES2018+ \p{L} flag.
function isLetter(ch: string): boolean {
  return /[a-zA-Z]/.test(ch) || ch.charCodeAt(0) > 127;
}

// Extracts a structural signature from the leading marker of a trimmed line.
//
// Token normalisation:
//   Consecutive digits           → '#'
//   Uppercase valid Roman numeral→ '%'  (e.g. I, IV, XII — lowercase treated as '@')
//   Any other letter (incl. unicode) → '@'
//   Chars in SPECIAL_SET         →  kept as-is
//   Spaces / tabs                →  skipped; trigger termination when preceded by SPECIAL
//   Everything else              →  skipped
//
// Extraction stops—and the accumulated signature is returned—when a SPECIAL token is
// followed by whitespace or end-of-input. This is the natural "end of marker, start of
// content" boundary (e.g. "(1) text" terminates after ") ", "Step 1: text" after ": ").
//
// If no such termination is found the line has no structural marker → returns ''.
//
// Known limitation: "range" markers like "[5 & 6. text]" produce "[##." while "[1. text]"
// produces "[#." — these won't match as siblings because & is skipped, leaving two # tokens.
function getPrefixSignature(trimmedLine: string): string {
  const src = trimmedLine;
  let sig = '';
  let i = 0;
  let lastWasSpecial = false;

  while (i < src.length) {
    const ch = src[i];

    if (ch === ' ' || ch === '\t') {
      if (lastWasSpecial) return sig;
      i++;
      continue;
    }

    if (SPECIAL_SET.has(ch)) {
      sig += ch;
      lastWasSpecial = true;
      i++;
      continue;
    }

    if (/[0-9]/.test(ch)) {
      while (i < src.length && /[0-9]/.test(src[i])) i++;
      sig += '#';
      lastWasSpecial = false;
      continue;
    }

    if (isLetter(ch)) {
      let word = '';
      while (i < src.length && isLetter(src[i])) word += src[i++];
      sig += isRoman(word) ? '%' : '@';
      lastWasSpecial = false;
      continue;
    }

    i++; // skip other chars (emoji, symbols not in SPECIAL_SET, etc.)
  }

  // Reached end-of-input: valid termination only if last token was a SPECIAL char.
  return lastWasSpecial ? sig : '';
}

export function parseTasks(inputText: string): TaskItem[] {
  const lines = inputText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const parentSignature = getPrefixSignature(lines[0].trim());

  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    const isIndented = INDENTED_REGEX.test(line);
    const isParent = !isIndented && getPrefixSignature(trimmedLine) === parentSignature;
    const text = trimmedLine.replace(/ \\ /g, '\n');

    return {
      id: Date.now().toString() + '-' + index,
      text,
      checked: false,
      isChild: !isParent,
    };
  });
}
