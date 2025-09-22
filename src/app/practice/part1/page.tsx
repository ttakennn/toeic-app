'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Box, Grid, Divider } from '@mui/material';
import { Category, TrendingUp } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Part1PhraseCategory as IPart1PhraseCategory } from '@/types/part1.interface';
import { getPart1PhraseCategories, getPart1PracticeQuestions } from '@/actions/part1';
import PracticeHeader from '@/UI/practice-header';
import practiceItemsData from '@/data/part1/questions/practiceItems.json';
import PracticeError from '@/UI/practice-error';
import PracticeTitle from '@/UI/practice-title';
import PracticeItemSkeleton from '@/components/practice/part1/practice-item-skeleton';
import PracticeLoadingError from '@/UI/practice-loading-error';
import PracticeAction from '@/UI/practice-action';
import PracticeCategory from '@/UI/practice-category';
import { PracticeCategory as IPracticeCategory } from '@/types/core.interface';
import PhraseCategorySkeleton from '@/components/practice/part1/phrase-category-skeleton';
import Part1PhraseCategory from '@/components/practice/part1/phrase-category';

export default function Part1Page() {
  // State để quản lý đề TEST được chọn cho mỗi practice item
  const [selectedPracticeTests, setSelectedPracticeTests] = useState<{ [key: string]: number }>({
    basic: 1,
    advanced: 1,
    simulation: 1,
    mixed: 1,
  });

  // State để quản lý luyện tập (practice categories)
  const [practiceCategories, setPracticeCategories] = useState<IPracticeCategory[]>([]);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  // State để quản lý cụm từ thường gặp (phrase categories)
  const [phraseCategories, setPhraseCategories] = useState<IPart1PhraseCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const handlePracticeTestChange = (practiceId: string, testNumber: number) => {
    setSelectedPracticeTests((prev) => ({
      ...prev,
      [practiceId]: testNumber,
    }));
  };

  // Fetch phrase categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);

        const data = await getPart1PhraseCategories();
        setPhraseCategories(data);
      } catch (error) {
        console.error('Error fetching phrase categories:', error);
        setCategoriesError('Không thể tải danh sách cụm từ. Vui lòng thử lại.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch practice questions from API
  useEffect(() => {
    const fetchPracticeQuestions = async () => {
      try {
        setPracticeLoading(true);
        setPracticeError(null);

        const data = await getPart1PracticeQuestions();
        setPracticeCategories(data.categories);

        // Initialize selected tests with first available test for each category
        const initialSelected: { [key: string]: number } = {};
        data.categories.forEach((category) => {
          const firstAvailableTest = category.tests.find((test) => test.available);
          initialSelected[category.id] = firstAvailableTest ? firstAvailableTest.id : 1;
        });
        setSelectedPracticeTests(initialSelected);
      } catch (error) {
        console.error('Error fetching practice questions:', error);
        setPracticeError('Không thể tải danh sách bài luyện tập. Vui lòng thử lại.');
      } finally {
        setPracticeLoading(false);
      }
    };

    fetchPracticeQuestions();
  }, []);

  // Handle start test button click
  const handleStartTest = async (categoryId: string, testId: number) => {
    const category = practiceCategories.find((cat) => cat.id === categoryId);
    const test = category?.tests.find((t) => t.id === testId);

    if (!test) {
      alert('Không tìm thấy bài test này!');
      return;
    }

    if (!test.available) {
      alert('Bài test này chưa có sẵn. Vui lòng chọn bài test khác!');
      return;
    }

    // Navigate to test page
    window.location.href = `/practice/part1/${categoryId}/test?testId=${testId}`;
  };

  return (
    <DashboardLayout>
      <Box>
        <PracticeHeader {...practiceItemsData.header} />
        {/* Section 1: Luyện tập */}
        <Box sx={{ mb: 6 }}>
          <PracticeTitle title="Luyện tập" icon={<TrendingUp />} />
          <PracticeError error={practiceError} />
          <Grid container spacing={3}>
            {practiceLoading ? (
              <PracticeItemSkeleton />
            ) : (
              practiceCategories.map((item, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <PracticeCategory
                    item={item}
                    selectedPracticeTests={selectedPracticeTests}
                    handlePracticeTestChange={handlePracticeTestChange}
                    handleStartTest={handleStartTest}
                  />
                </Grid>
              ))
            )}
          </Grid>
          {!practiceLoading && practiceCategories.length === 0 && !practiceError && <PracticeLoadingError />}
        </Box>
        <Divider sx={{ my: 5, borderColor: 'primary.main', borderWidth: 1 }} />
        {/* Section 2: Cụm từ thường gặp */}
        <Box>
          <PracticeTitle
            icon={<Category />}
            title={practiceItemsData.category.title}
            content={practiceItemsData.category.description}
          />
          <PracticeError error={categoriesError} isReload={false} />
          <Grid container spacing={3}>
            {categoriesLoading ? (
              <PhraseCategorySkeleton />
            ) : (
              phraseCategories.map((category, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                  <Part1PhraseCategory category={category} />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
        <PracticeAction {...practiceItemsData.action} />
      </Box>
    </DashboardLayout>
  );
}
