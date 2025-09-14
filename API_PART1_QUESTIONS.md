# Part 1 Questions API Documentation

## Overview
APIs để lấy dữ liệu câu hỏi Part 1 TOEIC theo từng category và test.

## Base URL
```
/api/part1/questions
```

## Endpoints

### 1. Get All Categories Overview
**GET** `/api/part1/questions`

Lấy tổng quan tất cả categories và tests có sẵn.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": "basic",
      "title": "Cụm từ tả người",
      "description": "Học các cụm từ mô tả người và hoạt động...",
      "icon": "/images/categories/people-icon.svg",
      "color": "#4caf50",
      "bgColor": "#e8f5e8",
      "totalTests": 5,
      "availableTests": 5,
      "tests": [...]
    }
  ],
  "totalCategories": 4,
  "totalTests": 19,
  "totalAvailable": 19,
  "completionRate": 100,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### 2. Get Tests by Category
**GET** `/api/part1/questions/[category]`

Lấy tất cả tests trong một category cụ thể.

**Parameters:**
- `category`: `basic` | `advanced` | `simulation` | `mixed`

**Example:** `/api/part1/questions/basic`

**Response:**
```json
{
  "success": true,
  "category": {
    "id": "basic",
    "title": "Cụm từ tả người",
    "description": "Học các cụm từ mô tả người...",
    "icon": "/images/categories/people-icon.svg",
    "color": "#4caf50",
    "bgColor": "#e8f5e8",
    "totalTests": 5
  },
  "tests": [
    {
      "id": 1,
      "title": "TEST 1 - Người cơ bản",
      "difficulty": "Dễ",
      "questions": 10,
      "duration": "15 phút",
      "available": true,
      "description": "Bài test cơ bản về mô tả người..."
    }
  ],
  "availableCount": 5,
  "totalCount": 5,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

### 3. Get Specific Test Data
**GET** `/api/part1/questions/[category]/[testId]`

Lấy dữ liệu chi tiết của một test cụ thể.

**Parameters:**
- `category`: `basic` | `advanced` | `simulation` | `mixed`
- `testId`: Số test (1, 2, 3, ...)

**Example:** `/api/part1/questions/basic/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "testInfo": {
      "id": 1,
      "title": "TEST 1 - Người cơ bản",
      "difficulty": "Dễ",
      "questions": 10,
      "duration": "15 phút",
      "category": "basic",
      "description": "Bài test cơ bản về mô tả người..."
    },
    "questions": [
      {
        "id": 1,
        "imageUrl": "/images/test/basic/test1/question1.jpg",
        "audioUrl": "/audio/test/basic/test1/question1.mp3",
        "options": [
          "A woman is reading a book",
          "A woman is writing a letter",
          "A woman is drinking coffee",
          "A woman is talking on the phone"
        ],
        "correctAnswer": "A",
        "explanation": "Trong hình, người phụ nữ đang đọc sách...",
        "theme": "Hoạt động học tập",
        "vocabulary": ["reading", "book", "woman"]
      }
    ]
  },
  "category": "basic",
  "testId": 1,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid category",
  "message": "Category must be one of: basic, advanced, simulation, mixed"
}
```

### 404 Not Found
```json
{
  "error": "Test not found",
  "message": "Test 5 not found in category advanced"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to fetch test data"
}
```

## Available Categories and Tests

### Basic (Cụm từ tả người) - 5 tests
1. **TEST 1 - Người cơ bản** (Dễ, 10 câu, 15 phút)
2. **TEST 2 - Hoạt động thường ngày** (TB, 12 câu, 18 phút)
3. **TEST 3 - Nghề nghiệp** (Khó, 15 câu, 22 phút)
4. **TEST 4 - Cảm xúc & Hành động** (TB, 14 câu, 20 phút)
5. **TEST 5 - Tổng hợp người** (Khó, 18 câu, 25 phút)

### Advanced (Cụm từ tả cảnh) - 4 tests
1. **TEST 1 - Môi trường cơ bản** (Dễ, 12 câu, 16 phút)
2. **TEST 2 - Cảnh quan thiên nhiên** (TB, 15 câu, 20 phút)
3. **TEST 3 - Không gian công cộng** (Khó, 16 câu, 24 phút)
4. **TEST 4 - Tổng hợp cảnh** (Khó, 20 câu, 30 phút)

### Simulation (Cụm từ tả vật) - 4 tests
1. **TEST 1 - Đồ dùng cơ bản** (Dễ, 8 câu, 12 phút)
2. **TEST 2 - Thiết bị văn phòng** (TB, 10 câu, 15 phút)
3. **TEST 3 - Vật dụng gia đình** (TB, 12 câu, 18 phút)
4. **TEST 4 - Công cụ chuyên dụng** (Khó, 15 câu, 22 phút)

### Mixed (Cụm từ tả người + vật/cảnh) - 6 tests
1. **TEST 1 - Tương tác cơ bản** (Dễ, 10 câu, 15 phút)
2. **TEST 2 - Hoạt động hàng ngày** (TB, 12 câu, 18 phút)
3. **TEST 3 - Môi trường làm việc** (TB, 14 câu, 20 phút)
4. **TEST 4 - Hoạt động giải trí** (Khó, 16 câu, 24 phút)
5. **TEST 5 - Tình huống phức tạp** (Khó, 18 câu, 27 phút)
6. **TEST 6 - Thử thách toàn diện** (Khó, 20 câu, 30 phút)

## Usage Example trong Frontend

```typescript
// Lấy tất cả categories
const getAllCategories = async () => {
  const response = await fetch('/api/part1/questions');
  return await response.json();
};

// Lấy tests trong category
const getCategoryTests = async (category: string) => {
  const response = await fetch(`/api/part1/questions/${category}`);
  return await response.json();
};

// Lấy test cụ thể
const getTestData = async (category: string, testId: number) => {
  const response = await fetch(`/api/part1/questions/${category}/${testId}`);
  return await response.json();
};
```

## Notes

- Tất cả API đều có loading delay nhỏ (100-300ms) để cải thiện UX
- Image và audio URLs là placeholder, sẽ được thêm sau
- Tất cả test data đã được generate hoàn chỉnh cho cả 4 categories
- APIs hỗ trợ error handling và validation đầy đủ
