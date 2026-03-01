# Database Setup Guide for Quiz Selection System

## 🚨 MongoDB Connection Issue

The error you encountered indicates that MongoDB is not running or not accessible. Here's how to fix this:

### **Option 1: Start MongoDB Service**

#### **Windows:**
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or if using MongoDB Compass/Community Edition
# Start MongoDB from Services or run:
mongod
```

#### **MacOS:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

#### **Linux:**
```bash
# Using systemctl
sudo systemctl start mongod

# Or manually
mongod
```

### **Option 2: Check MongoDB Configuration**

1. **Check if MongoDB is installed:**
```bash
mongod --version
```

2. **Check connection string in your .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/quixpro
```

3. **Test connection:**
```bash
mongosh mongodb://localhost:27017/quixpro
```

### **Option 3: Use MongoDB Atlas (Cloud)**

1. **Create a free MongoDB Atlas account:** https://www.mongodb.com/cloud/atlas
2. **Create a free cluster**
3. **Get your connection string**
4. **Update your .env file:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quixpro
```

## 🗄️ Manual Database Setup

Once MongoDB is running, create the necessary collections and relationships:

### **1. Create Levels Collection**

```javascript
// Connect to your database and run:
db.levels.insertMany([
  { 
    name: 'S1', 
    stage: 'Senior 1', 
    code: 'S1', 
    description: 'Senior Secondary Level 1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    name: 'S2', 
    stage: 'Senior 2', 
    code: 'S2', 
    description: 'Senior Secondary Level 2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  { 
    name: 'S3', 
    stage: 'Senior 3', 
    code: 'S3', 
    description: 'Senior Secondary Level 3',
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

### **2. Create Courses Collection**

```javascript
// Get level IDs first
const s1Level = db.levels.findOne({ name: 'S1' })
const s2Level = db.levels.findOne({ name: 'S2' })

db.courses.insertMany([
  {
    name: 'Physics',
    displayName: 'Physics',
    subject: 'Physics',
    levelId: s1Level._id,
    gradeLevel: 'S1',
    status: 'published',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Chemistry',
    displayName: 'Chemistry',
    subject: 'Chemistry',
    levelId: s1Level._id,
    gradeLevel: 'S1',
    status: 'published',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Biology',
    displayName: 'Biology',
    subject: 'Biology',
    levelId: s1Level._id,
    gradeLevel: 'S1',
    status: 'published',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mathematics',
    displayName: 'Mathematics',
    subject: 'Mathematics',
    levelId: s1Level._id,
    gradeLevel: 'S1',
    status: 'published',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

### **3. Create Units Collection**

```javascript
// Get course IDs
const physicsCourse = db.courses.findOne({ name: 'Physics' })
const chemistryCourse = db.courses.findOne({ name: 'Chemistry' })
const biologyCourse = db.courses.findOne({ name: 'Biology' })

db.units.insertMany([
  {
    name: 'Mechanics',
    courseId: physicsCourse._id,
    levelId: s1Level._id,
    description: 'Introduction to Mechanics - Forces and Motion',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Thermodynamics',
    courseId: physicsCourse._id,
    levelId: s1Level._id,
    description: 'Heat transfer and energy',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Atomic Structure',
    courseId: chemistryCourse._id,
    levelId: s1Level._id,
    description: 'Atoms, molecules and chemical bonds',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cell Biology',
    courseId: biologyCourse._id,
    levelId: s1Level._id,
    description: 'Cell structure and function',
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

### **4. Create Quizzes Collection**

```javascript
// Get unit IDs
const mechanicsUnit = db.units.findOne({ name: 'Mechanics' })
const thermoUnit = db.units.findOne({ name: 'Thermodynamics' })

db.quizzes.insertMany([
  {
    title: 'Introduction to Forces',
    subject: 'Physics',
    level: 'S1',
    description: 'Basic concepts of forces and motion in physics',
    difficulty: 'easy',
    duration: 30,
    levelId: s1Level._id,
    courseId: physicsCourse._id,
    unitId: mechanicsUnit._id,
    questions: [
      {
        question: 'What is force defined as?',
        options: ['Push or pull on an object', 'Energy of motion', 'Mass of an object', 'Speed of movement'],
        correct: 0,
        explanation: 'Force is defined as a push or pull on an object'
      },
      {
        question: 'What unit is force measured in?',
        options: ['Joules', 'Newtons', 'Meters per second', 'Kilograms'],
        correct: 1,
        explanation: 'Force is measured in Newtons (N)'
      },
      {
        question: 'What is Newton\'s First Law of Motion?',
        options: ['F = ma', 'Action and reaction are equal', 'Object in motion stays in motion', 'Energy is conserved'],
        correct: 2,
        explanation: 'Newton\'s First Law states that an object in motion stays in motion unless acted upon by an external force'
      }
    ],
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Heat Transfer Quiz',
    subject: 'Physics',
    level: 'S1',
    description: 'Understanding the three methods of heat transfer',
    difficulty: 'medium',
    duration: 45,
    levelId: s1Level._id,
    courseId: physicsCourse._id,
    unitId: thermoUnit._id,
    questions: [
      {
        question: 'What is conduction?',
        options: ['Heat transfer through direct contact', 'Heat transfer through fluids', 'Heat transfer through electromagnetic waves', 'No heat transfer'],
        correct: 0,
        explanation: 'Conduction is heat transfer through direct contact between particles'
      },
      {
        question: 'Which method of heat transfer requires a medium?',
        options: ['Conduction and convection', 'Radiation only', 'All methods', 'None require a medium'],
        correct: 0,
        explanation: 'Conduction and convection require a medium, radiation does not'
      }
    ],
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

### **5. Create Indexes**

```javascript
// Create indexes for better performance
db.levels.createIndex({ name: 1 }, { unique: true })
db.levels.createIndex({ stage: 1 })

db.courses.createIndex({ name: 1 })
db.courses.createIndex({ levelId: 1 })
db.courses.createIndex({ subject: 1 })

db.units.createIndex({ name: 1 })
db.units.createIndex({ courseId: 1 })
db.units.createIndex({ levelId: 1 })

db.quizzes.createIndex({ title: 1 })
db.quizzes.createIndex({ levelId: 1 })
db.quizzes.createIndex({ courseId: 1 })
db.quizzes.createIndex({ unitId: 1 })
db.quizzes.createIndex({ difficulty: 1 })
db.quizzes.createIndex({ subject: 1 })
```

## 🧪 Test Your Setup

After setting up the database, test these endpoints:

### **1. Test Levels API**
```bash
curl http://localhost:3000/api/levels
```

### **2. Test Courses API**
```bash
# Replace LEVEL_ID with actual ID from levels API
curl "http://localhost:3000/api/courses?levelId=YOUR_LEVEL_ID"
```

### **3. Test Units API**
```bash
# Replace COURSE_ID with actual ID from courses API
curl "http://localhost:3000/api/units?courseId=YOUR_COURSE_ID"
```

### **4. Test Quiz API**
```bash
curl "http://localhost:3000/api/quiz?level=S1&course=Physics"
```

## 🔍 Troubleshooting

### **If APIs return empty results:**
1. Check if collections exist: `show collections`
2. Verify data: `db.levels.find().pretty()`
3. Check relationships: `db.courses.find().pretty()`

### **If connection still fails:**
1. Verify MongoDB is running: `mongosh`
2. Check port: MongoDB usually runs on 27017
3. Check firewall settings
4. Verify connection string format

### **If quiz selection still doesn't work:**
1. Check browser console for JavaScript errors
2. Check network tab for failed API calls
3. Verify data structure matches what frontend expects

## 📝 Quick Setup Script

If you want to automate this, create a file `setup-manual.js`:

```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/quixpro';
const client = new MongoClient(uri);

async function setup() {
  try {
    await client.connect();
    const db = client.db('quixpro');
    
    // Paste the JavaScript code from above here
    
    console.log('✅ Database setup completed!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
  } finally {
    await client.close();
  }
}

setup();
```

Then run: `node setup-manual.js`

## 🎯 Success Criteria

Your setup is successful when:
- ✅ MongoDB is running and accessible
- ✅ All collections are created with data
- ✅ API endpoints return proper data
- ✅ Quiz selection dropdowns populate correctly
- ✅ Quizzes load based on selections
