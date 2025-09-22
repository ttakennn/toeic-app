'use client';

import { PhraseCategoryResponse } from '@/types/phrases.interface';

const URL_PART1_PHRASE_CATEGORY = '/api/part1/phrases/';

export async function getPart1PhraseCategory(category: string) {
  const response = await fetch(`${URL_PART1_PHRASE_CATEGORY}${category}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch data');
  }

  const data: PhraseCategoryResponse = await response.json();
  return data;
}
