// MongoDB Seed Script for Qouta Platform
// Run with: node scripts/seed-database.js

const { MongoClient, ObjectId } = require("mongodb")

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

    // 1. Insert Countries
    console.log("🌍 Inserting countries...")
    const countries = [
      { _id: new ObjectId(), name: "Rwanda", code: "RW", active: true },
      { _id: new ObjectId(), name: "Kenya", code: "KE", active: true },
      { _id: new ObjectId(), name: "Uganda", code: "UG", active: true },
      { _id: new ObjectId(), name: "Tanzania", code: "TZ", active: true },
    ]
    await countriesCol.insertMany(countries)
    const rwandaId = countries.find((c) => c.code === "RW")._id

    // 2. Insert Schools
    console.log("🏫 Inserting schools...")
    const schools = [
      {
        _id: new ObjectId(),
        name: "Byimana Secondary School",
        type: "SECONDARY",
        countryId: rwandaId,
        address: "Byimana, Ruhango",
        levels: [],
      },
      {
        _id: new ObjectId(),
        name: "Kigali Primary School",
        type: "PRIMARY",
        countryId: rwandaId,
        address: "Kigali City",
        levels: [],
      },
      {
        _id: new ObjectId(),
        name: "University of Rwanda",
        type: "HIGHER",
        countryId: rwandaId,
        address: "Kigali",
        levels: [],
      },
    ]
    await schoolsCol.insertMany(schools)

    // 3. Insert Levels (Rwanda CBC)
    console.log("📚 Inserting education levels...")
    const levelNames = [
      // Primary
      "P1",
      "P2",
      "P3",
      "P4",
      "P5",
      "P6",
      // O-Level (Lower Secondary)
      "S1",
      "S2",
      "S3",
      // A-Level (Upper Secondary)
      "S4",
      "S5",
      "S6",
      // Higher Education
      "Year1",
      "Year2",
      "Year3",
      "Year4",
    ]

    const levels = levelNames.map((name) => ({
      _id: new ObjectId(),
      name,
      type: name.startsWith("P")
        ? "PRIMARY"
        : ["S1", "S2", "S3"].includes(name)
          ? "OLEVEL"
          : ["S4", "S5", "S6"].includes(name)
            ? "ALEVEL"
            : "HIGHER",
      schoolId: schools.find(
        (s) =>
          (name.startsWith("P") && s.type === "PRIMARY") ||
          (["S1", "S2", "S3", "S4", "S5", "S6"].includes(name) && s.type === "SECONDARY") ||
          (name.startsWith("Year") && s.type === "HIGHER"),
      )?._id,
      courses: [],
    }))
    await levelsCol.insertMany(levels)

    // 4. Insert Courses (Rwanda CBC aligned)
    console.log("📖 Inserting courses...")
    const courseData = [
      // Primary courses
      { name: "Mathematics", levels: ["P1", "P2", "P3", "P4", "P5", "P6"] },
      { name: "English", levels: ["P1", "P2", "P3", "P4", "P5", "P6"] },
      { name: "Kinyarwanda", levels: ["P1", "P2", "P3", "P4", "P5", "P6"] },
      { name: "Science & Elementary Technology", levels: ["P4", "P5", "P6"] },
      { name: "Social Studies", levels: ["P4", "P5", "P6"] },

      // O-Level courses
      { name: "Mathematics", levels: ["S1", "S2", "S3"] },
      { name: "Biology", levels: ["S1", "S2", "S3"] },
      { name: "Physics", levels: ["S1", "S2", "S3"] },
      { name: "Chemistry", levels: ["S1", "S2", "S3"] },
      { name: "History", levels: ["S1", "S2", "S3"] },
      { name: "Geography", levels: ["S1", "S2", "S3"] },
      { name: "English", levels: ["S1", "S2", "S3"] },
      { name: "Kinyarwanda", levels: ["S1", "S2", "S3"] },
      { name: "ICT", levels: ["S1", "S2", "S3"] },

      // A-Level courses
      { name: "Advanced Mathematics", levels: ["S4", "S5", "S6"] },
      { name: "Biology", levels: ["S4", "S5", "S6"] },
      { name: "Physics", levels: ["S4", "S5", "S6"] },
      { name: "Chemistry", levels: ["S4", "S5", "S6"] },
      { name: "Economics", levels: ["S4", "S5", "S6"] },
      { name: "Literature", levels: ["S4", "S5", "S6"] },
      { name: "Computer Science", levels: ["S4", "S5", "S6"] },

      // Higher Education
      { name: "Computer Science", levels: ["Year1", "Year2", "Year3", "Year4"] },
      { name: "Medicine", levels: ["Year1", "Year2", "Year3", "Year4"] },
      { name: "Engineering", levels: ["Year1", "Year2", "Year3", "Year4"] },
    ]

    const courses = []
    for (const courseInfo of courseData) {
      for (const levelName of courseInfo.levels) {
        const level = levels.find((l) => l.name === levelName)
        if (level) {
          courses.push({
            _id: new ObjectId(),
            name: `${courseInfo.name} - ${levelName}`, // Fix: Include level in name to avoid duplicates
            displayName: courseInfo.name, // Keep original name for display
            description: `${courseInfo.name} for ${levelName}`,
            levelId: level._id,
            resources: [],
          })
        }
      }
    }
    await coursesCol.insertMany(courses)

    // 4.5 Insert Units for each course
    console.log("📚 Inserting units...")
    const unitsCol = db.collection("units")
    const units = []

    // Define unit templates for different subjects
    const unitTemplates = {
      Mathematics: [
        "Numbers and Operations", "Algebra", "Geometry", "Statistics", "Probability", "Calculus"
      ],
      Biology: [
        "Cell Biology", "Genetics", "Ecology", "Human Biology", "Evolution", "Plant Biology"
      ],
      Physics: [
        "Mechanics", "Thermodynamics", "Waves", "Electricity", "Magnetism", "Modern Physics"
      ],
      Chemistry: [
        "Atomic Structure", "Chemical Bonding", "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"
      ],
      English: [
        "Grammar", "Comprehension", "Writing Skills", "Literature", "Vocabulary", "Communication"
      ],
      History: [
        "Ancient History", "Medieval History", "Modern History", "Rwandan History", "World History", "Historical Methods"
      ],
      Geography: [
        "Physical Geography", "Human Geography", "Economic Geography", "Rwandan Geography", "Climate Studies", "Cartography"
      ],
      "Science & Elementary Technology": [
        "Basic Science", "Living Things", "Materials", "Energy", "Environment", "Technology Basics"
      ],
      Social Studies: [
        "Community", "Culture", "Government", "Economics", "Citizenship", "Global Issues"
      ],
      Kinyarwanda: [
        "Imvugo", "Inyandiko", "Ubumenyi", "Ururimi", "Umuco", "Ibyamamare"
      ],
      ICT: [
        "Computer Basics", "Digital Literacy", "Programming", "Internet Skills", "Software Applications", "Digital Safety"
      ],
      "Advanced Mathematics": [
        "Advanced Algebra", "Calculus", "Statistics", "Probability", "Linear Algebra", "Discrete Mathematics"
      ],
      Economics: [
        "Microeconomics", "Macroeconomics", "Economic Theory", "Development Economics", "International Economics", "Financial Economics"
      ],
      Literature: [
        "Literary Analysis", "Poetry", "Drama", "Fiction", "Critical Theory", "World Literature"
      ],
      "Computer Science": [
        "Programming Fundamentals", "Data Structures", "Algorithms", "Database Systems", "Software Engineering", "Computer Networks"
      ],
      Medicine: [
        "Anatomy", "Physiology", "Biochemistry", "Pharmacology", "Pathology", "Clinical Medicine"
      ],
      Engineering: [
        "Engineering Mathematics", "Engineering Physics", "Materials Science", "Thermodynamics", "Fluid Mechanics", "Engineering Design"
      ]
    }

    for (const course of courses) {
      const subjectName = course.displayName || course.name.split(' - ')[0]
      const levelName = course.name.includes(' - ') ? course.name.split(' - ')[1] : ''
      const templateUnits = unitTemplates[subjectName] || ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"]
      
      // Create units for this course
      for (let i = 0; i < templateUnits.length; i++) {
        units.push({
          _id: new ObjectId(),
          courseId: course._id,
          levelId: course.levelId,
          name: templateUnits[i],
          title: templateUnits[i],
          description: `${templateUnits[i]} - ${subjectName} for ${levelName}`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
    
    if (units.length > 0) {
      await unitsCol.insertMany(units)
    }

    // 5. Insert Sample Quizzes with different difficulty levels
    console.log("❓ Inserting sample quizzes...")
    const sampleQuizzes = []
    const difficulties = ["easy", "moderate", "hard", "expert"]

    // Sample questions for different subjects
    const questionTemplates = {
      Mathematics: [
        {
          question: "What is 2 + 2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4",
          difficulty: "easy",
        },
        {
          question: "Solve for x: 2x + 5 = 15",
          options: ["5", "10", "7", "3"],
          correctAnswer: "5",
          difficulty: "moderate",
        },
      ],
      "Social Studies": [
        {
          question: "What is the capital city of Rwanda?",
          options: ["Kigali", "Musanze", "Huye", "Rubavu"],
          correctAnswer: "Kigali",
          difficulty: "easy",
        },
        {
          question: "Who is the current president of Rwanda?",
          options: ["Paul Kagame", "John Magufuli", "Uhuru Kenyatta", "Samia Suluhu"],
          correctAnswer: "Paul Kagame",
          difficulty: "moderate",
        },
      ],
    }

    for (const course of courses.slice(0, 10)) {
      // Sample for first 10 courses
      const subjectQuestions = questionTemplates[course.name] || questionTemplates["Mathematics"]

      for (const template of subjectQuestions) {
        sampleQuizzes.push({
          _id: new ObjectId(),
          courseId: course._id,
          difficulty: template.difficulty,
          question: template.question,
          options: template.options.map((option, index) => ({
            key: String.fromCharCode(65 + index), // A, B, C, D
            text: option,
          })),
          correctAnswer: String.fromCharCode(65 + template.options.indexOf(template.correctAnswer)),
          explanation: `The correct answer is ${template.correctAnswer}.`,
        })
      }
    }
    await quizzesCol.insertMany(sampleQuizzes)

    // 6. Insert Sample Users
    console.log("👥 Inserting sample users...")
    const sampleUsers = [
      {
        _id: new ObjectId(),
        role: "student",
        name: "Aline Uwimana",
        email: "aline.uwimana@student.rw",
        passwordHash: "hashed_password_here", // In real app, use proper hashing
        countryId: rwandaId,
        schoolId: schools.find((s) => s.type === "SECONDARY")._id,
        levelId: levels.find((l) => l.name === "S3")._id,
        stats: {
          totalQuizzes: 24,
          completedQuizzes: 18,
          averageScore: 85,
          totalPoints: 1420,
          certificates: 3,
          streak: 7,
        },
      },
      {
        _id: new ObjectId(),
        role: "student",
        name: "Jean Baptiste Nkurunziza",
        email: "jean.baptiste@student.rw",
        passwordHash: "hashed_password_here",
        countryId: rwandaId,
        schoolId: schools.find((s) => s.type === "SECONDARY")._id,
        levelId: levels.find((l) => l.name === "S6")._id,
        stats: {
          totalQuizzes: 45,
          completedQuizzes: 42,
          averageScore: 92,
          totalPoints: 2850,
          certificates: 8,
          streak: 15,
        },
      },
    ]
    await usersCol.insertMany(sampleUsers)

    // 7. Insert Sample Tutors for Peer Tutoring
    console.log("🎓 Inserting sample tutors...")
    const sampleTutors = [
      {
        _id: new ObjectId(),
        userId: sampleUsers[1]._id, // Jean Baptiste as tutor
        subjects: ["Mathematics", "Physics", "Chemistry"],
        rating: 4.9,
        reviews: 23,
        hourlyRate: 2000,
        location: "Kigali",
        availability: "Mon-Fri 4-8 PM",
        description: "Expert in advanced mathematics and sciences. Helped 50+ students improve their grades.",
        languages: ["English", "Kinyarwanda", "French"],
        isActive: true,
      },
    ]
    await tutorsCol.insertMany(sampleTutors)

    console.log("✅ Database seeded successfully!")
    console.log(`📊 Inserted:
    - ${countries.length} countries
    - ${schools.length} schools  
    - ${levels.length} education levels
    - ${courses.length} courses
    - ${units.length} units
    - ${sampleQuizzes.length} sample quizzes
    - ${sampleUsers.length} sample users
    - ${sampleTutors.length} sample tutors`)
  } catch (error) {
    console.error("❌ Seeding error:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the seed function
seedDatabase()
