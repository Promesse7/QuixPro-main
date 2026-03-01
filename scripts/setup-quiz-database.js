/**
 * Database Setup Script for Quiz Selection System
 * This script ensures proper relationships between levels, courses, units, and quizzes
 */

const { MongoClient } = require('mongodb');

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quixpro';
const DB_NAME = 'quixpro';

async function setupQuizDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('📊 Setting up quiz database relationships...');
    
    // 1. Ensure indexes for better performance
    console.log('🔍 Creating indexes...');
    
    // Levels collection indexes
    await db.collection('levels').createIndex({ name: 1 }, { unique: true });
    await db.collection('levels').createIndex({ stage: 1 });
    
    // Courses collection indexes
    await db.collection('courses').createIndex({ name: 1 });
    await db.collection('courses').createIndex({ levelId: 1 });
    await db.collection('courses').createIndex({ subject: 1 });
    
    // Units collection indexes
    await db.collection('units').createIndex({ name: 1 });
    await db.collection('units').createIndex({ courseId: 1 });
    await db.collection('units').createIndex({ levelId: 1 });
    
    // Quizzes collection indexes
    await db.collection('quizzes').createIndex({ title: 1 });
    await db.collection('quizzes').createIndex({ levelId: 1 });
    await db.collection('quizzes').createIndex({ courseId: 1 });
    await db.collection('quizzes').createIndex({ unitId: 1 });
    await db.collection('quizzes').createIndex({ difficulty: 1 });
    await db.collection('quizzes').createIndex({ subject: 1 });
    
    console.log('✅ Indexes created successfully');
    
    // 2. Validate existing data relationships
    console.log('🔍 Validating data relationships...');
    
    // Check levels
    const levelsCount = await db.collection('levels').countDocuments();
    console.log(`📚 Found ${levelsCount} levels`);
    
    if (levelsCount === 0) {
      console.log('⚠️  No levels found. Creating sample levels...');
      await createSampleLevels(db);
    }
    
    // Check courses
    const coursesCount = await db.collection('courses').countDocuments();
    console.log(`📖 Found ${coursesCount} courses`);
    
    // Check units
    const unitsCount = await db.collection('units').countDocuments();
    console.log(`📝 Found ${unitsCount} units`);
    
    // Check quizzes
    const quizzesCount = await db.collection('quizzes').countDocuments();
    console.log(`🎯 Found ${quizzesCount} quizzes`);
    
    // 3. Fix orphaned records
    console.log('🔧 Fixing orphaned records...');
    
    // Fix courses without valid levelId
    const orphanedCourses = await db.collection('courses').find({
      $or: [
        { levelId: { $exists: false } },
        { levelId: null }
      ]
    }).toArray();
    
    if (orphanedCourses.length > 0) {
      console.log(`⚠️  Found ${orphanedCourses.length} orphaned courses`);
      // Assign default level or mark for review
      const defaultLevel = await db.collection('levels').findOne({ name: 'S1' });
      if (defaultLevel) {
        await db.collection('courses').updateMany(
          { $or: [{ levelId: { $exists: false } }, { levelId: null }] },
          { $set: { levelId: defaultLevel._id } }
        );
        console.log('✅ Fixed orphaned courses');
      }
    }
    
    // Fix units without valid courseId
    const orphanedUnits = await db.collection('units').find({
      $or: [
        { courseId: { $exists: false } },
        { courseId: null }
      ]
    }).toArray();
    
    if (orphanedUnits.length > 0) {
      console.log(`⚠️  Found ${orphanedUnits.length} orphaned units`);
      // Assign to first available course or mark for review
      const firstCourse = await db.collection('courses').findOne();
      if (firstCourse) {
        await db.collection('units').updateMany(
          { $or: [{ courseId: { $exists: false } }, { courseId: null }] },
          { $set: { courseId: firstCourse._id } }
        );
        console.log('✅ Fixed orphaned units');
      }
    }
    
    // 4. Update quiz relationships
    console.log('🔄 Updating quiz relationships...');
    
    // Update quizzes to have proper levelId, courseId, unitId based on their metadata
    const quizzes = await db.collection('quizzes').find({}).toArray();
    
    for (const quiz of quizzes) {
      const updates = {};
      
      // Set levelId based on level name
      if (quiz.level && !quiz.levelId) {
        const levelDoc = await db.collection('levels').findOne({ name: quiz.level });
        if (levelDoc) {
          updates.levelId = levelDoc._id;
        }
      }
      
      // Set courseId based on subject name
      if (quiz.subject && !quiz.courseId) {
        const courseDoc = await db.collection('courses').findOne({ name: quiz.subject });
        if (courseDoc) {
          updates.courseId = courseDoc._id;
        }
      }
      
      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await db.collection('quizzes').updateOne(
          { _id: quiz._id },
          { $set: updates }
        );
      }
    }
    
    console.log('✅ Quiz relationships updated');
    
    // 5. Create sample data if needed
    if (coursesCount === 0 || unitsCount === 0 || quizzesCount === 0) {
      console.log('📝 Creating sample data...');
      await createSampleData(db);
    }
    
    // 6. Final validation
    console.log('🔍 Final validation...');
    
    const finalStats = {
      levels: await db.collection('levels').countDocuments(),
      courses: await db.collection('courses').countDocuments(),
      units: await db.collection('units').countDocuments(),
      quizzes: await db.collection('quizzes').countDocuments()
    };
    
    console.log('📊 Final Database Stats:', finalStats);
    
    // Test API queries
    console.log('🧪 Testing API queries...');
    
    // Test levels query
    const levels = await db.collection('levels').find({}).toArray();
    console.log(`✅ Levels query: ${levels.length} results`);
    
    // Test courses with levelId
    if (levels.length > 0) {
      const courses = await db.collection('courses').find({ 
        levelId: levels[0]._id 
      }).toArray();
      console.log(`✅ Courses by levelId: ${courses.length} results`);
    }
    
    // Test units with courseId
    if (finalStats.courses > 0) {
      const firstCourse = await db.collection('courses').findOne();
      const units = await db.collection('units').find({ 
        courseId: firstCourse._id 
      }).toArray();
      console.log(`✅ Units by courseId: ${units.length} results`);
    }
    
    // Test quizzes with filters
    if (finalStats.quizzes > 0) {
      const quizzes = await db.collection('quizzes').find({
        $and: [
          { levelId: { $exists: true } },
          { courseId: { $exists: true } }
        ]
      }).toArray();
      console.log(`✅ Quizzes with relationships: ${quizzes.length} results`);
    }
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function createSampleLevels(db) {
  const levels = [
    { name: 'S1', stage: 'Senior 1', code: 'S1', description: 'Senior Secondary Level 1' },
    { name: 'S2', stage: 'Senior 2', code: 'S2', description: 'Senior Secondary Level 2' },
    { name: 'S3', stage: 'Senior 3', code: 'S3', description: 'Senior Secondary Level 3' },
    { name: 'S4', stage: 'Senior 4', code: 'S4', description: 'Senior Secondary Level 4' },
    { name: 'S5', stage: 'Senior 5', code: 'S5', description: 'Senior Secondary Level 5' },
    { name: 'S6', stage: 'Senior 6', code: 'S6', description: 'Senior Secondary Level 6' }
  ];
  
  await db.collection('levels').insertMany(levels);
  console.log('✅ Sample levels created');
}

async function createSampleData(db) {
  const levels = await db.collection('levels').find({}).toArray();
  
  if (levels.length === 0) {
    console.log('⚠️  No levels found, skipping sample data creation');
    return;
  }
  
  // Create sample courses
  const courses = [
    { name: 'Physics', levelId: levels[0]._id, subject: 'Physics', gradeLevel: 'S1' },
    { name: 'Chemistry', levelId: levels[0]._id, subject: 'Chemistry', gradeLevel: 'S1' },
    { name: 'Biology', levelId: levels[0]._id, subject: 'Biology', gradeLevel: 'S1' },
    { name: 'Mathematics', levelId: levels[0]._id, subject: 'Mathematics', gradeLevel: 'S1' }
  ];
  
  const courseResult = await db.collection('courses').insertMany(courses);
  console.log('✅ Sample courses created');
  
  // Create sample units
  const units = [
    { name: 'Mechanics', courseId: courseResult.insertedIds[0], levelId: levels[0]._id, description: 'Introduction to Mechanics' },
    { name: 'Thermodynamics', courseId: courseResult.insertedIds[0], levelId: levels[0]._id, description: 'Heat and Energy' },
    { name: 'Atomic Structure', courseId: courseResult.insertedIds[1], levelId: levels[0]._id, description: 'Atoms and Molecules' },
    { name: 'Cell Biology', courseId: courseResult.insertedIds[2], levelId: levels[0]._id, description: 'Cell Structure and Function' }
  ];
  
  const unitResult = await db.collection('units').insertMany(units);
  console.log('✅ Sample units created');
  
  // Create sample quizzes
  const quizzes = [
    {
      title: 'Introduction to Forces',
      subject: 'Physics',
      level: 'S1',
      description: 'Basic concepts of forces and motion',
      difficulty: 'easy',
      duration: 30,
      questions: [
        { question: 'What is force?', options: ['Push or pull', 'Energy', 'Mass', 'Speed'], correct: 0 },
        { question: 'What unit is force measured in?', options: ['Joules', 'Newtons', 'Meters', 'Seconds'], correct: 1 }
      ],
      levelId: levels[0]._id,
      courseId: courseResult.insertedIds[0],
      unitId: unitResult.insertedIds[0],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Heat Transfer',
      subject: 'Physics',
      level: 'S1',
      description: 'Understanding heat transfer mechanisms',
      difficulty: 'medium',
      duration: 45,
      questions: [
        { question: 'What is conduction?', options: ['Heat transfer through direct contact', 'Heat through fluids', 'Heat through radiation', 'None'], correct: 0 }
      ],
      levelId: levels[0]._id,
      courseId: courseResult.insertedIds[0],
      unitId: unitResult.insertedIds[1],
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await db.collection('quizzes').insertMany(quizzes);
  console.log('✅ Sample quizzes created');
}

// Run the setup
if (require.main === module) {
  setupQuizDatabase()
    .then(() => {
      console.log('🎉 Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupQuizDatabase };
