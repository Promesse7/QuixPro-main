const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/QuixDB';
const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('QuixDB');
    
    // Clear existing collections
    await db.collection('quizzes').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('stories').deleteMany({});
    
    console.log('Collections cleared');
    
    // Seed users
    const users = [
      {
        id: uuidv4(),
        name: 'John Doe',
        email: 'john@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        role: 'student',
        level: 'intermediate',
        school: 'Springfield Elementary',
        points: 1250,
        quizzesTaken: 15,
        quizzesPassed: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Jane Smith',
        email: 'jane@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        role: 'teacher',
        level: 'advanced',
        school: 'Springfield High',
        points: 2800,
        quizzesTaken: 25,
        quizzesPassed: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Alex Johnson',
        email: 'alex@example.com',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        role: 'student',
        level: 'beginner',
        school: 'Springfield Elementary',
        points: 750,
        quizzesTaken: 8,
        quizzesPassed: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('users').insertMany(users);
    console.log('Users seeded');
    
    // Seed quizzes
    const quizzes = [
      {
        id: uuidv4(),
        title: 'Basic Mathematics',
        subject: 'Mathematics',
        level: 'beginner',
        description: 'Test your basic math skills with this quiz covering addition, subtraction, multiplication, and division.',
        questions: 10,
        duration: 15,
        difficulty: 'easy',
        rating: 4.5,
        createdBy: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        questionIds: []
      },
      {
        id: uuidv4(),
        title: 'World Geography',
        subject: 'Geography',
        level: 'intermediate',
        description: 'Test your knowledge of world geography, countries, capitals, and landmarks.',
        questions: 15,
        duration: 20,
        difficulty: 'medium',
        rating: 4.2,
        createdBy: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        questionIds: []
      },
      {
        id: uuidv4(),
        title: 'Advanced Physics',
        subject: 'Physics',
        level: 'advanced',
        description: 'Challenge yourself with complex physics problems and theoretical concepts.',
        questions: 12,
        duration: 30,
        difficulty: 'hard',
        rating: 4.8,
        createdBy: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        questionIds: []
      }
    ];
    
    await db.collection('quizzes').insertMany(quizzes);
    console.log('Quizzes seeded');
    
    // Seed stories
    const stories = [
      {
        id: uuidv4(),
        title: 'The Adventure of Learning',
        description: 'A story about the joy of discovering new knowledge and skills.',
        content: 'Once upon a time, there was a young student named Maya who discovered the magic of learning...',
        imageUrl: 'https://source.unsplash.com/random/300x200?learning',
        category: 'Educational',
        readingLevel: 'beginner',
        readingTime: 5,
        author: 'Jane Smith',
        createdBy: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true
      },
      {
        id: uuidv4(),
        title: 'The Math Mystery',
        description: 'Follow Detective Numbers as he solves the case of the missing equation.',
        content: "Detective Numbers was called to the scene of a most unusual crime. The town's most valuable equation had been stolen...",
        imageUrl: 'https://source.unsplash.com/random/300x200?math',
        category: 'Mathematics',
        readingLevel: 'intermediate',
        readingTime: 8,
        author: 'John Doe',
        createdBy: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true
      },
      {
        id: uuidv4(),
        title: 'Journey to the Center of the Atom',
        description: 'An exciting adventure into the microscopic world of atoms and particles.',
        content: 'Professor Quark invited his students on an extraordinary field trip. Using his newest invention, the Nano-Shrink 3000, they were about to embark on a journey to explore the atom from the inside...',
        imageUrl: 'https://source.unsplash.com/random/300x200?atom',
        category: 'Science',
        readingLevel: 'advanced',
        readingTime: 12,
        author: 'Alex Johnson',
        createdBy: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true
      }
    ];
    
    await db.collection('stories').insertMany(stories);
    console.log('Stories seeded');
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seedDatabase();
