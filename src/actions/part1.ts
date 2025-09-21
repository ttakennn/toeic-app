'use client';

import { Part1PhraseCategoriesResponse, Part1PracticeQuestionsResponse } from '@/app/types/part1.interface';

const URL_PART1_PHRASE_CATEGORIES = '/api/part1/categories';
const URL_PART1_PRACTICE_QUESTIONS = '/api/part1/questions';

export async function getPart1PhraseCategories() {
  const response = await fetch(URL_PART1_PHRASE_CATEGORIES);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: Part1PhraseCategoriesResponse = await response.json();
  if (!data.success) {
    throw new Error('Failed to fetch categories');
  }

  return data.categories;
}

export async function getPart1PracticeQuestions() {
  const response = await fetch(URL_PART1_PRACTICE_QUESTIONS);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: Part1PracticeQuestionsResponse = await response.json();
  if (!data.success) {
    throw new Error('Failed to fetch practice questions');
  }

  return data;
}
