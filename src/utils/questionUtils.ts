import { Word, QuestionType, AnswerType, QuestionItem } from '../types';
import { shuffleArray } from './arrayUtils';

export type { QuestionType, AnswerType };
export type { QuestionItem } from '../types';

export interface QuestionConfig {
  questionType: QuestionType;
  answerType: AnswerType;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export const ALL_QUESTION_TYPES: QuestionType[] = ['kana', 'kanji', 'indonesian'];

// Rules: which answer types are allowed for each question type
const ALLOWED_ANSWER_TYPES: Record<QuestionType, AnswerType[]> = {
  kana: ['indonesian', 'kanji'],
  kanji: ['kana', 'indonesian'],
  indonesian: ['kanji', 'kana'],
};

function getField(word: Word, type: QuestionType | AnswerType): string {
  switch (type) {
    case 'kana': return word.japanese;
    case 'kanji': return word.kanji ?? word.japanese;
    case 'indonesian': return word.indonesian;
  }
}

function hasField(word: Word, type: AnswerType): boolean {
  switch (type) {
    case 'kana': return true;
    case 'kanji': return !!word.kanji && !word.kanjiInfoOnly;
    case 'indonesian': return true;
  }
}

function getDistractors(
  currentWord: Word,
  activeWords: Word[],
  answerType: AnswerType
): string[] {
  const pool = activeWords
    .filter(w => w !== currentWord && hasField(w, answerType))
    .map(w => getField(w, answerType));

  const unique = [...new Set(pool)];
  return shuffleArray(unique).slice(0, 3);
}

/**
 * Build a question queue that covers all question types across the level.
 * Each word appears ~2-3 times with different question/answer combos.
 * Ensures every question type (kana, kanji, romaji, indonesian) appears at least once.
 */
export function buildQuestionQueue(words: Word[], unlockedCount: number): QuestionItem[] {
  const activeWords = words.slice(0, unlockedCount);
  const queue: QuestionItem[] = [];

  // Determine which question types are globally valid
  const hasKanji = activeWords.some(w => !!w.kanji && !w.kanjiInfoOnly);
  const validTypes = hasKanji
    ? [...ALL_QUESTION_TYPES]
    : ALL_QUESTION_TYPES.filter(t => t !== 'kanji');

  // Ensure every question type appears at least once (pick a word that supports it)
  for (const qType of validTypes) {
    const candidates = activeWords
      .map((w, i) => ({ word: w, index: i }))
      .filter(({ word }) => {
        if (qType === 'kanji') return !!word.kanji && !word.kanjiInfoOnly;
        return true;
      });

    if (candidates.length === 0) continue;

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const allowed = ALLOWED_ANSWER_TYPES[qType].filter(
      t => t !== qType && hasField(pick.word, t)
    );

    if (allowed.length > 0) {
      queue.push({
        wordIndex: pick.index,
        questionType: qType,
        answerType: allowed[Math.floor(Math.random() * allowed.length)],
      });
    }
  }

  // Fill remaining slots: each word gets ~2-3 items total
  const targetPerWord = Math.max(2, Math.floor((40 - queue.length) / activeWords.length));
  const totalTarget = Math.min(50, Math.max(30, activeWords.length * targetPerWord));

  while (queue.length < totalTarget) {
    for (let wi = 0; wi < activeWords.length && queue.length < totalTarget; wi++) {
      const word = activeWords[wi];
      const wordValidTypes = validTypes.filter(t => {
        if (t === 'kanji') return !!word.kanji && !word.kanjiInfoOnly;
        return true;
      });

      const qType = wordValidTypes[Math.floor(Math.random() * wordValidTypes.length)];
      const allowed = ALLOWED_ANSWER_TYPES[qType].filter(
        t => t !== qType && hasField(word, t)
      );

      if (allowed.length === 0) continue;

      queue.push({
        wordIndex: wi,
        questionType: qType,
        answerType: allowed[Math.floor(Math.random() * allowed.length)],
      });
    }
  }

  return shuffleArray(queue);
}

export function generateQuestionConfig(
  currentWord: Word,
  activeWords: Word[]
): QuestionConfig {
  const validQuestionTypes: QuestionType[] = ['kana', 'indonesian'];
  if (currentWord.kanji && !currentWord.kanjiInfoOnly) {
    validQuestionTypes.push('kanji');
  }

  const questionType = validQuestionTypes[Math.floor(Math.random() * validQuestionTypes.length)];

  const allowedByRule = ALLOWED_ANSWER_TYPES[questionType];
  const validAnswerTypes = allowedByRule.filter(
    t => t !== questionType && hasField(currentWord, t)
  );

  const answerType = validAnswerTypes.length > 0
    ? validAnswerTypes[Math.floor(Math.random() * validAnswerTypes.length)]
    : allowedByRule[0];

  const questionText = getField(currentWord, questionType);
  const correctAnswer = getField(currentWord, answerType);
  const distractors = getDistractors(currentWord, activeWords, answerType);

  const options = shuffleArray([correctAnswer, ...distractors]).slice(0, 4);

  return {
    questionType,
    answerType,
    questionText,
    options,
    correctAnswer,
  };
}

export function buildQuestionConfig(
  word: Word,
  activeWords: Word[],
  questionType: QuestionType,
  answerType: AnswerType
): QuestionConfig {
  const questionText = getField(word, questionType);
  const correctAnswer = getField(word, answerType);
  const distractors = getDistractors(word, activeWords, answerType);
  const options = shuffleArray([correctAnswer, ...distractors]).slice(0, 4);

  return {
    questionType,
    answerType,
    questionText,
    options,
    correctAnswer,
  };
}
