# Quiz Selection System - Troubleshooting Guide

## 🔍 Issues Identified & Solutions

### **1. API Parameter Mismatch**

**Problem**: Frontend sends `level` parameter but courses API expects `levelId`

**Solution**: Updated `fetchCourses()` to first fetch levels, find the matching level document, then use its `_id` for the courses API call.

```javascript
// Before (Broken)
const res = await fetch(`${baseUrl}/api/courses?level=${level}`)

// After (Fixed)
const levelsRes = await fetch(`${baseUrl}/api/levels`)
const selectedLevelDoc = levelsData.levels.find(l => l.name === level)
const res = await fetch(`${baseUrl}/api/courses?levelId=${selectedLevelDoc._id}`)
```

### **2. Missing Quiz Fetching Triggers**

**Problem**: Unit selection didn't trigger quiz fetching

**Solution**: Added quiz fetching to unit and difficulty change handlers

```javascript
const handleUnitChange = (unit: string) => {
  setSelectedUnit(unit)
  setSelectedDifficulty("")
  // ✅ Added this
  if (unit && selectedLevel && selectedCourse) {
    fetchQuizzes(selectedLevel, selectedCourse, unit)
  }
}
```

### **3. Weak Database Relationships**

**Problem**: Quizzes don't have proper foreign key relationships with levels/courses/units

**Solution**: Created database setup script to fix relationships

```bash
# Run this script to fix database
node scripts/setup-quiz-database.js
```

### **4. Inconsistent Data Structure**

**Problem**: Frontend expects different data structure than backend provides

**Solution**: Enhanced quiz API with aggregation pipeline to enrich data

```javascript
// Enhanced API includes related data
const pipeline = [
  { $match: query },
  { $lookup: { from: "levels", localField: "levelId", foreignField: "_id", as: "levelInfo" } },
  { $lookup: { from: "courses", localField: "courseId", foreignField: "_id", as: "courseInfo" } },
  { $lookup: { from: "units", localField: "unitId", foreignField: "_id", as: "unitInfo" } }
]
```

## 🛠️ Step-by-Step Fix Implementation

### **Step 1: Update Frontend Code**
✅ Already completed - Updated quiz selection page with proper API calls

### **Step 2: Fix Database Relationships**
```bash
cd your-project
node scripts/setup-quiz-database.js
```

### **Step 3: Test API Endpoints**

#### Test Levels API
```bash
curl http://localhost:3000/api/levels
```

#### Test Courses API with Level ID
```bash
# First get a level ID from levels API
curl "http://localhost:3000/api/courses?levelId=YOUR_LEVEL_ID"
```

#### Test Units API with Course ID
```bash
curl "http://localhost:3000/api/units?courseId=YOUR_COURSE_ID"
```

#### Test Enhanced Quiz API
```bash
curl "http://localhost:3000/api/quiz/enhanced?level=S1&course=Physics"
```

### **Step 4: Verify Data Flow**

1. **Level Selection** → Fetches courses with proper `levelId`
2. **Course Selection** → Fetches units with proper `courseId`
3. **Unit Selection** → Fetches quizzes with proper `unitId`
4. **Difficulty Filter** → Applies additional filtering

## 🗄️ Database Schema Requirements

### **Levels Collection**
```javascript
{
  _id: ObjectId,
  name: "S1",
  stage: "Senior 1",
  code: "S1",
  description: "Senior Secondary Level 1"
}
```

### **Courses Collection**
```javascript
{
  _id: ObjectId,
  name: "Physics",
  levelId: ObjectId, // References levels._id
  subject: "Physics",
  gradeLevel: "S1"
}
```

### **Units Collection**
```javascript
{
  _id: ObjectId,
  name: "Mechanics",
  courseId: ObjectId, // References courses._id
  levelId: ObjectId,  // References levels._id
  description: "Introduction to Mechanics"
}
```

### **Quizzes Collection**
```javascript
{
  _id: ObjectId,
  title: "Introduction to Forces",
  subject: "Physics",
  level: "S1",
  levelId: ObjectId,   // References levels._id
  courseId: ObjectId,  // References courses._id
  unitId: ObjectId,    // References units._id
  difficulty: "easy",
  duration: 30,
  questions: [...]
}
```

## 🧪 Testing Checklist

### **Frontend Tests**
- [ ] Level selection loads courses
- [ ] Course selection loads units
- [ ] Unit selection loads quizzes
- [ ] Difficulty filter works
- [ ] Quiz cards display correctly
- [ ] Quiz navigation works

### **Backend Tests**
- [ ] `/api/levels` returns levels
- [ ] `/api/courses?levelId=X` returns filtered courses
- [ ] `/api/units?courseId=X` returns filtered units
- [ ] `/api/quiz` with filters returns correct quizzes
- [ ] Database relationships are valid

### **Database Tests**
- [ ] All levels have valid `_id`
- [ ] All courses have valid `levelId`
- [ ] All units have valid `courseId` and `levelId`
- [ ] All quizzes have valid relationships
- [ ] Indexes are created for performance

## 🚨 Common Issues & Solutions

### **Issue: "No courses found for this level"**
**Cause**: Level name doesn't match database or courses have invalid `levelId`
**Solution**: 
1. Check if level name exactly matches database
2. Run database setup script to fix relationships
3. Verify courses have valid `levelId`

### **Issue: "No units found for this course"**
**Cause**: Course name doesn't match or units have invalid `courseId`
**Solution**:
1. Verify course name matches database
2. Check units collection for valid `courseId`
3. Run setup script to fix orphaned records

### **Issue: "No quizzes found"**
**Cause**: Quizzes don't have proper relationships or filters are too restrictive
**Solution**:
1. Check quiz collection for valid `levelId`, `courseId`, `unitId`
2. Try without difficulty filter
3. Use enhanced quiz API for better debugging

### **Issue: Quiz navigation fails**
**Cause**: Quiz `_id` is not valid or quiz route doesn't exist
**Solution**:
1. Check if quiz has valid `_id`
2. Verify `/quiz/[id]` route exists
3. Check quiz data structure

## 🔄 Maintenance Tasks

### **Weekly**
- [ ] Check for orphaned records
- [ ] Verify API response times
- [ ] Test quiz selection flow

### **Monthly**
- [ ] Update database indexes
- [ ] Clean up unused data
- [ ] Review quiz content quality

### **As Needed**
- [ ] Run setup script after database changes
- [ ] Update API endpoints for new features
- [ ] Add new levels/courses/units as needed

## 📞 Support

If issues persist after following this guide:

1. Check browser console for JavaScript errors
2. Check network tab for failed API calls
3. Verify database connection and permissions
4. Run the setup script to ensure proper relationships
5. Test with sample data using the setup script

## 🎯 Success Metrics

- ✅ All dropdowns populate correctly
- ✅ Filters work as expected
- ✅ Quizzes load based on selections
- ✅ No console errors
- ✅ Fast API response times (<500ms)
- ✅ Proper data relationships in database
