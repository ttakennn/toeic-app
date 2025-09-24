'use client';

import { TestApiResponse, TestCategoryResponse } from '@/types/test.interface';

const URL_PART1_TEST_CATEGORY = '/api/part1/questions';

export async function getPart1TestCategoryByTestId(category: string, testId: number) {
  const response = await fetch(`${URL_PART1_TEST_CATEGORY}/${category}/${testId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: TestApiResponse = await response.json();
  if (!data.success) {
    throw new Error('Failed to fetch category test by test id');
  }

  return data;
}

export async function getPart1TestCategory(category: string) {
  const response = await fetch(`${URL_PART1_TEST_CATEGORY}/${category}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: TestCategoryResponse = await response.json();
  if (!data.success) {
    throw new Error('Failed to fetch category test');
  }

  console.log({ data });

  return data;
}
