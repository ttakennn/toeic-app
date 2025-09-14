# TOEIC Phrases API Usage Guide

## API Endpoints

### 1. Get All Categories
```
GET /api/part1/phrases
```

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "key": "people",
      "title": "Cụm từ tả người",
      "description": "Học các cụm từ mô tả người và hoạt động của con người",
      "itemCount": 8,
      "difficulty": {
        "easy": 5,
        "medium": 3,
        "hard": 0
      }
    }
  ],
  "totalCategories": 4,
  "totalItems": 25,
  "timestamp": "2025-01-13T..."
}
```

### 2. Get Specific Category Data
```
GET /api/part1/phrases/[category]
```

**Example:** `/api/part1/phrases/people`

**Response:**
```json
{
  "success": true,
  "category": "people",
  "title": "Cụm từ tả người",
  "description": "Học các cụm từ mô tả người và hoạt động của con người",
  "data": [
    {
      "id": 1,
      "image": "/images/placeholder/toeic-placeholder.svg",
      "audio": "https://res.cloudinary.com/dwksn9rn6/video/upload/v1757736721/toeic-part1/cum-tu-ta-nguoi/the-man-is-holding-a-ball-in-his-hands_dzpk30.mp3",
      "english": "The man is holding a ball in his hands.",
      "vietnamese": "Một người đàn ông đang giữ một quả bóng trong tay.",
      "phonetic": "/ðə mæn ɪz ˈholɪŋ ə bɔl ɪn ɪz hændz/",
      "difficulty": "easy",
      "tags": ["holding", "ball", "hands"]
    }
  ],
  "totalItems": 8,
  "timestamp": "2025-01-13T..."
}
```

## Available Categories

1. **people** - Cụm từ tả người (8 items)
2. **scene** - Cụm từ tả cảnh (6 items)  
3. **object** - Cụm từ tả vật (5 items)
4. **people-object** - Cụm từ tả người + vật/cảnh (6 items)

## Features Implemented

### ✅ API Structure
- RESTful API endpoints
- JSON data storage
- Error handling
- Network delay simulation

### ✅ Loading States
- Skeleton loading for UI components
- Loading indicators
- Smooth transitions

### ✅ Error Handling
- Network error handling
- 404 for missing categories
- User-friendly error messages
- Retry functionality

### ✅ Image Fallback
- Empty images automatically use `/images/placeholder/toeic-placeholder.svg`
- Handled in API response processing

### ✅ Data Management
- Centralized JSON data file
- TypeScript interfaces
- Proper data validation

## Usage in Components

```typescript
// Example: Fetching category data
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/part1/phrases/${category}`);
      const data = await response.json();
      setCategoryData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, [category]);
```

## Testing the API

You can test the API endpoints directly:

1. **Get all categories:** `http://localhost:3000/api/part1/phrases`
2. **Get people category:** `http://localhost:3000/api/part1/phrases/people`
3. **Get scene category:** `http://localhost:3000/api/part1/phrases/scene`
4. **Test 404:** `http://localhost:3000/api/part1/phrases/nonexistent`

## Next Steps

1. **Update Audio URLs:** Replace placeholder audio URLs with actual Cloudinary URLs
2. **Add Images:** Upload images and update the image URLs in the JSON data
3. **Extend Data:** Add more phrases to each category as needed
4. **Cache Strategy:** Consider implementing caching for better performance
5. **Database Migration:** Eventually migrate from JSON to a proper database
