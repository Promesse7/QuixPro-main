#!/usr/bin/env node

// Safe migration script - ONLY fixes course names and adds missing units
// Preserves all existing data including quizzes
// Run with: node scripts/fix-courses-only.js

const { MongoClient, ObjectId } = require("mongodb")

// Use the provided MongoDB connection string
const uri =
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster"
const client = new MongoClient(uri)

async function fixCoursesOnly() {
  try {
    console.log("🔗 Connecting to MongoDB...")
    await client.connect()
    const db = client.db("QuixDB")

    // Collections
    const coursesCol = db.collection("courses")
    const unitsCol = db.collection("units")
    const levelsCol = db.collection("levels")

    console.log("🔧 Fixing course names without touching existing data...")
    
    // Get all levels for reference
    const levels = await levelsCol.find({}).toArray()
    
    // Update existing courses to include level in name and add displayName
    const courses = await coursesCol.find({}).toArray()
    let coursesUpdated = 0
    
    for (const course of courses) {
      const level = levels.find(l => l._id.toString() === course.levelId.toString())
      if (level && !course.name.includes(' - ')) {
        const displayName = course.name
        const newName = `${course.name} - ${level.name}`
        
        await coursesCol.updateOne(
          { _id: course._id },
          { 
            $set: { 
              name: newName,
              displayName: displayName
            }
          }
        )
        coursesUpdated++
        console.log(`✓ Updated course: ${displayName} -> ${newName}`)
      } else if (course.name.includes(' - ') && !course.displayName) {
        // Add displayName to courses that already have the correct format
        const displayName = course.name.split(' - ')[0]
        await coursesCol.updateOne(
          { _id: course._id },
          { $set: { displayName: displayName } }
        )
        coursesUpdated++
        console.log(`✓ Added displayName to: ${course.name}`)
      }
    }

    console.log("📚 Adding missing units for courses that don't have them...")
    
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
      "Social Studies": [
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
      ],
      // Add your custom courses
      "GS & CS": [
        "Social Cohesion", "Governance", "Human Rights", "Democracy", "Citizenship", "Social Justice"
      ]
    }

    // Get updated courses
    const updatedCourses = await coursesCol.find({}).toArray()
    let unitsCreated = 0

    for (const course of updatedCourses) {
      // Check if course already has units
      const existingUnits = await unitsCol.find({ courseId: course._id }).toArray()
      
      if (existingUnits.length === 0) {
        const subjectName = course.displayName || course.name.split(' - ')[0]
        const levelName = course.name.includes(' - ') ? course.name.split(' - ')[1] : ''
        const templateUnits = unitTemplates[subjectName] || ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"]
        
        // Create units for this course
        const newUnits = []
        for (let i = 0; i < templateUnits.length; i++) {
          newUnits.push({
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
        
        if (newUnits.length > 0) {
          await unitsCol.insertMany(newUnits)
          unitsCreated += newUnits.length
          console.log(`✓ Created ${newUnits.length} units for ${course.displayName || course.name}`)
        }
      } else {
        console.log(`- Course ${course.displayName || course.name} already has ${existingUnits.length} units`)
      }
    }

    console.log("\n✅ Migration completed successfully!")
    console.log(`📊 Summary:
    - Updated ${coursesUpdated} course names
    - Created ${unitsCreated} new units
    - All existing quizzes and data preserved`)

  } catch (error) {
    console.error("❌ Migration error:", error)
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the migration
fixCoursesOnly()
