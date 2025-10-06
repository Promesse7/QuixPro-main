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

    console.log("🗑️ Clearing existing data...")
    await Promise.all([
      countriesCol.deleteMany({}),
      schoolsCol.deleteMany({}),
      levelsCol.deleteMany({}),
      coursesCol.deleteMany({}),
      quizzesCol.deleteMany({}),
      usersCol.deleteMany({}),
      tutorsCol.deleteMany({}),
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

    // Insert Sample Quizzes
    console.log("📝 Inserting sample quizzes...")
    const sampleQuizzes = [
      {
        _id: new ObjectId(),
        courseId: courses.find((c) => c.name === "Mathematics")._id,
        name: "Math Quiz 1",
        questions: [
          // Sample questions here
        ],
      },
      {
        _id: new ObjectId(),
        courseId: courses.find((c) => c.name === "Physics")._id,
        name: "Physics Quiz 1",
        questions: [
          // Sample questions here
        ],
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
