// MongoDB Seed Script for Qouta Platform with Authentication
// Run with: node scripts/seed-database-with-auth.js

const { MongoClient, ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")

// Use the provided MongoDB connection string
const uri =
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function seedDatabase() {
  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()
    const db = client.db("QuixDB")

    // Collections
    const countriesCol = db.collection("countries")
    const schoolsCol = db.collection("schools")
    const levelsCol = db.collection("levels")
    const coursesCol = db.collection("courses")
    const quizzesCol = db.collection("quizzes")
    const usersCol = db.collection("users")
    const tutorsCol = db.collection("tutors")
    const certificatesCol = db.collection("certificates")

    console.log("🗑️ Clearing existing data...")
    await Promise.all([
      countriesCol.deleteMany({}),
      schoolsCol.deleteMany({}),
      levelsCol.deleteMany({}),
      coursesCol.deleteMany({}),
      quizzesCol.deleteMany({}),
      usersCol.deleteMany({}),
      tutorsCol.deleteMany({}),
      certificatesCol.deleteMany({}),
    ])

    // Insert Sample Countries
    console.log("🌍 Inserting sample countries...")
    const countries = [
      {
        _id: new ObjectId(),
        name: "Rwanda",
        code: "RW",
      },
    ]
    const insertedCountries = await countriesCol.insertMany(countries)
    const rwandaId = insertedCountries.insertedIds[0]

    // Insert Sample Schools
    console.log("🏫 Inserting sample schools...")
    const schools = [
      {
        _id: new ObjectId(),
        name: "Kigali Secondary School",
        type: "SECONDARY",
        countryId: rwandaId,
      },
    ]
    await schoolsCol.insertMany(schools)

    // Insert Sample Levels
    console.log("📚 Inserting sample education levels...")
    const levels = [
      {
        _id: new ObjectId(),
        name: "S3",
        stage: "Lower Secondary",
      },
      {
        _id: new ObjectId(),
        name: "S6",
        stage: "Upper Secondary",
      },
    ]
    await levelsCol.insertMany(levels)

    // Insert Sample Courses
    console.log("📚 Inserting sample courses...")
    const courses = [
      {
        _id: new ObjectId(),
        name: "Mathematics",
        levelId: levels.find((l) => l.name === "S3")._id,
      },
      {
        _id: new ObjectId(),
        name: "Physics",
        levelId: levels.find((l) => l.name === "S6")._id,
      },
    ]
    await coursesCol.insertMany(courses)

    // Insert Sample Units
    console.log("📖 Inserting sample units...")
    const sampleUnits = [
      {
        _id: new ObjectId(),
        name: "Unit 1: Basic Algebraic Operations",
        courseId: courses.find((c) => c.name === "Mathematics")._id,
        levelId: levels.find((l) => l.name === "S3")._id,
        description: "Introduction to basic algebraic operations and solving simple equations",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: "Unit 2: Linear Functions and Graphs",
        courseId: courses.find((c) => c.name === "Mathematics")._id,
        levelId: levels.find((l) => l.name === "S3")._id,
        description: "Understanding linear functions, slope, and graphing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: "Unit 1: Newton's Laws of Motion",
        courseId: courses.find((c) => c.name === "Physics")._id,
        levelId: levels.find((l) => l.name === "S6")._id,
        description: "Fundamental principles of mechanics and motion",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await db.collection("units").insertMany(sampleUnits)

    // Insert Sample Quizzes
    console.log("📝 Inserting sample quizzes...")
    const sampleQuizzes = [
      {
        _id: new ObjectId(),
        id: "quiz-1",
        title: "Mathematics S3 - Basic Algebra",
        subject: "Mathematics",
        level: "S3",
        description: "Test your understanding of basic algebraic concepts",
        courseId: courses.find((c) => c.name === "Mathematics")._id,
        unitId: sampleUnits.find((u) => u.name === "Unit 1: Basic Algebraic Operations")._id,
        questions: [
          {
            id: "q1",
            text: "What is the value of x in the equation 2x + 5 = 13?",
            options: [
              { id: "a", text: "3", correct: false },
              { id: "b", text: "4", correct: true },
              { id: "c", text: "5", correct: false },
              { id: "d", text: "6", correct: false },
            ],
            explanation: "To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4",
            marks: 1,
          },
          {
            id: "q2",
            text: "Simplify: 3(x + 2) - 2x",
            options: [
              { id: "a", text: "x + 6", correct: true },
              { id: "b", text: "x + 2", correct: false },
              { id: "c", text: "5x + 6", correct: false },
              { id: "d", text: "3x + 4", correct: false },
            ],
            explanation: "3(x + 2) - 2x = 3x + 6 - 2x = x + 6",
            marks: 1,
          },
          {
            id: "q3",
            text: "What is the slope of the line y = 2x + 3?",
            options: [
              { id: "a", text: "2", correct: true },
              { id: "b", text: "3", correct: false },
              { id: "c", text: "5", correct: false },
              { id: "d", text: "1/2", correct: false },
            ],
            explanation: "In the equation y = mx + b, m is the slope. So the slope is 2",
            marks: 1,
          },
        ],
        duration: 15,
        difficulty: "medium",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        id: "quiz-2",
        title: "Physics S6 - Mechanics",
        subject: "Physics",
        level: "S6",
        description: "Advanced mechanics concepts for S6 students",
        courseId: courses.find((c) => c.name === "Physics")._id,
        unitId: sampleUnits.find((u) => u.name === "Unit 1: Newton's Laws of Motion")._id,
        questions: [
          {
            id: "q1",
            text: "What is Newton's First Law of Motion?",
            options: [
              { id: "a", text: "F = ma", correct: false },
              { id: "b", text: "An object at rest stays at rest unless acted upon by an external force", correct: true },
              { id: "c", text: "For every action there is an equal and opposite reaction", correct: false },
              { id: "d", text: "Energy cannot be created or destroyed", correct: false },
            ],
            explanation: "Newton's First Law states that an object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force",
            marks: 1,
          },
          {
            id: "q2",
            text: "What is the unit of force in the SI system?",
            options: [
              { id: "a", text: "Joule", correct: false },
              { id: "b", text: "Newton", correct: true },
              { id: "c", text: "Watt", correct: false },
              { id: "d", text: "Pascal", correct: false },
            ],
            explanation: "Force is measured in Newtons (N) in the SI system",
            marks: 1,
          },
        ],
        duration: 20,
        difficulty: "hard",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await quizzesCol.insertMany(sampleQuizzes)

    // Insert Sample Users with proper password hashing
    console.log("👥 Inserting sample users...")
    const hashedPassword = await bcrypt.hash("password123", 12)

    const sampleUsers = [
      {
        _id: new ObjectId(),
        role: "student",
        name: "Aline Uwimana",
        email: "aline.uwimana@student.rw",
        passwordHash: hashedPassword,
        countryId: rwandaId,
        schoolId: schools.find((s) => s.type === "SECONDARY")._id,
        levelId: levels.find((l) => l.name === "S3")._id,
        level: "S3",
        stage: "Lower Secondary",
        stats: {
          totalQuizzes: 24,
          completedQuizzes: 18,
          averageScore: 85,
          totalPoints: 1420,
          certificates: 3,
          streak: 7,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        role: "student",
        name: "Jean Baptiste Nkurunziza",
        email: "jean.baptiste@student.rw",
        passwordHash: hashedPassword,
        countryId: rwandaId,
        schoolId: schools.find((s) => s.type === "SECONDARY")._id,
        levelId: levels.find((l) => l.name === "S6")._id,
        level: "S6",
        stage: "Upper Secondary",
        stats: {
          totalQuizzes: 45,
          completedQuizzes: 42,
          averageScore: 92,
          totalPoints: 2850,
          certificates: 8,
          streak: 15,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        role: "teacher",
        name: "Marie Claire Mukamana",
        email: "teacher@qouta.rw",
        passwordHash: hashedPassword,
        countryId: rwandaId,
        schoolId: schools.find((s) => s.type === "SECONDARY")._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        role: "admin",
        name: "Admin User",
        email: "admin@qouta.rw",
        passwordHash: hashedPassword,
        countryId: rwandaId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await usersCol.insertMany(sampleUsers)

    // Insert Sample Certificates
    console.log("🏅 Inserting sample certificates...")
    const sampleCertificates = [
      {
        _id: new ObjectId(),
        userId: sampleUsers[0]._id.toString(),
        title: "Mathematics Excellence",
        course: "Mathematics",
        score: 95,
        level: "S3",
        type: "quiz",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        userId: sampleUsers[0]._id.toString(),
        title: "Physics Mastery",
        course: "Physics",
        score: 88,
        level: "S3",
        type: "course",
        createdAt: new Date(),
      },
      {
        _id: new ObjectId(),
        userId: sampleUsers[0]._id.toString(),
        title: "Perfect Attendance",
        course: "General",
        score: 100,
        level: "S3",
        type: "achievement",
        createdAt: new Date(),
      },
    ]
    await certificatesCol.insertMany(sampleCertificates)

    // Insert Sample Tutors
    console.log("👨‍🏫 Inserting sample tutors...")
    const sampleTutors = [
      {
        _id: new ObjectId(),
        name: "Dr. John Doe",
        email: "john.doe@qouta.rw",
        countryId: rwandaId,
        schoolId: schools.find((s) => s.type === "SECONDARY")._id,
        courses: [courses.find((c) => c.name === "Mathematics")._id],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    await tutorsCol.insertMany(sampleTutors)

    console.log("✅ Database seeded successfully!")
    console.log(
      `📊 Inserted:\n    - ${countries.length} countries\n    - ${schools.length} schools\n    - ${levels.length} education levels\n    - ${courses.length} courses\n    - ${sampleQuizzes.length} sample quizzes\n    - ${sampleUsers.length} sample users\n    - ${sampleTutors.length} sample tutors`,
    )
  } catch (error) {
    console.error("❌ Seeding error:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the seed function
seedDatabase()
