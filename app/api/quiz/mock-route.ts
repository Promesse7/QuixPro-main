import { NextRequest, NextResponse } from "next/server"

// Mock data when MongoDB is not available
const mockQuizzes = [
  {
    _id: "quiz_1",
    id: "quiz_1",
    title: "Introduction to Forces",
    subject: "Physics",
    level: "S1",
    description: "Basic concepts of forces and motion in physics",
    difficulty: "easy",
    duration: 30,
    levelId: "level_1",
    courseId: "course_1",
    unitId: "unit_1",
    questions: [
      {
        question: "What is force defined as?",
        options: ["Push or pull on an object", "Energy of motion", "Mass of an object", "Speed of movement"],
        correct: 0,
        explanation: "Force is defined as a push or pull on an object"
      },
      {
        question: "What unit is force measured in?",
        options: ["Joules", "Newtons", "Meters per second", "Kilograms"],
        correct: 1,
        explanation: "Force is measured in Newtons (N)"
      },
      {
        question: "What is Newton's First Law of Motion?",
        options: ["F = ma", "Action and reaction are equal", "Object in motion stays in motion", "Energy is conserved"],
        correct: 2,
        explanation: "Newton's First Law states that an object in motion stays in motion unless acted upon by an external force"
      },
      {
        question: "Which of these is a type of force?",
        options: ["Gravity", "Temperature", "Color", "Sound"],
        correct: 0,
        explanation: "Gravity is a fundamental force of nature"
      },
      {
        question: "What happens when forces are balanced?",
        options: ["Object accelerates", "Object remains at rest or constant velocity", "Object changes direction", "Object stops moving"],
        correct: 1,
        explanation: "Balanced forces result in no change in motion"
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "quiz_2",
    id: "quiz_2",
    title: "Heat Transfer Quiz",
    subject: "Physics",
    level: "S1",
    description: "Understanding the three methods of heat transfer",
    difficulty: "medium",
    duration: 45,
    levelId: "level_1",
    courseId: "course_1",
    unitId: "unit_2",
    questions: [
      {
        question: "What is conduction?",
        options: ["Heat transfer through direct contact", "Heat transfer through fluids", "Heat transfer through electromagnetic waves", "No heat transfer"],
        correct: 0,
        explanation: "Conduction is heat transfer through direct contact between particles"
      },
      {
        question: "Which method of heat transfer requires a medium?",
        options: ["Conduction and convection", "Radiation only", "All methods", "None require a medium"],
        correct: 0,
        explanation: "Conduction and convection require a medium, radiation does not"
      },
      {
        question: "What is convection?",
        options: ["Heat transfer through particle movement in fluids", "Heat transfer through space", "Heat transfer through solids only", "No heat transfer"],
        correct: 0,
        explanation: "Convection is heat transfer through the movement of fluids"
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "quiz_3",
    id: "quiz_3",
    title: "Atomic Structure Basics",
    subject: "Chemistry",
    level: "S1",
    description: "Fundamental concepts of atomic structure",
    difficulty: "easy",
    duration: 25,
    levelId: "level_1",
    courseId: "course_2",
    unitId: "unit_4",
    questions: [
      {
        question: "What is the center of an atom called?",
        options: ["Nucleus", "Electron cloud", "Proton field", "Neutron zone"],
        correct: 0,
        explanation: "The center of an atom is called the nucleus"
      },
      {
        question: "Which particles are found in the nucleus?",
        options: ["Protons and neutrons", "Electrons only", "Protons only", "Electrons and neutrons"],
        correct: 0,
        explanation: "The nucleus contains protons and neutrons"
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "quiz_4",
    id: "quiz_4",
    title: "Cell Structure and Function",
    subject: "Biology",
    level: "S1",
    description: "Understanding basic cell biology",
    difficulty: "medium",
    duration: 35,
    levelId: "level_1",
    courseId: "course_3",
    unitId: "unit_6",
    questions: [
      {
        question: "What is the powerhouse of the cell?",
        options: ["Mitochondria", "Nucleus", "Ribosome", "Cell membrane"],
        correct: 0,
        explanation: "Mitochondria are known as the powerhouse of the cell"
      },
      {
        question: "Which organelle controls cell activities?",
        options: ["Nucleus", "Mitochondria", "Cytoplasm", "Cell wall"],
        correct: 0,
        explanation: "The nucleus controls all cell activities"
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "quiz_5",
    id: "quiz_5",
    title: "Algebra Fundamentals",
    subject: "Mathematics",
    level: "S1",
    description: "Basic algebraic concepts and equations",
    difficulty: "easy",
    duration: 40,
    levelId: "level_1",
    courseId: "course_4",
    unitId: "unit_8",
    questions: [
      {
        question: "What is the value of x in 2x + 3 = 7?",
        options: ["x = 2", "x = 3", "x = 4", "x = 5"],
        correct: 0,
        explanation: "2x + 3 = 7, so 2x = 4, therefore x = 2"
      },
      {
        question: "What is a variable in algebra?",
        options: ["A symbol for an unknown value", "A fixed number", "An operation", "A result"],
        correct: 0,
        explanation: "A variable represents an unknown value in algebra"
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "quiz_6",
    id: "quiz_6",
    title: "Wave Properties",
    subject: "Physics",
    level: "S1",
    description: "Understanding wave characteristics and behavior",
    difficulty: "hard",
    duration: 50,
    levelId: "level_1",
    courseId: "course_1",
    unitId: "unit_3",
    questions: [
      {
        question: "What is the frequency of a wave?",
        options: ["Number of waves per second", "Height of the wave", "Distance between waves", "Speed of the wave"],
        correct: 0,
        explanation: "Frequency is the number of complete waves that pass a point per second"
      },
      {
        question: "What is the amplitude of a wave?",
        options: ["Maximum displacement from equilibrium", "Distance between peaks", "Wave speed", "Wave frequency"],
        correct: 0,
        explanation: "Amplitude is the maximum displacement from the equilibrium position"
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const dynamic = "force-dynamic"

// GET /api/quiz - Mock quizzes when MongoDB is not available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unit = searchParams.get("unit")
    const unitId = searchParams.get("unitId")
    const difficulty = searchParams.get("difficulty")
    const level = searchParams.get("level")
    const levelId = searchParams.get("levelId")
    const course = searchParams.get("course")
    const courseId = searchParams.get("courseId")
    const limit = searchParams.get("limit")
    
    console.log("📊 Using mock quiz data (MongoDB not available)")
    console.log(`🔍 Filters - level: ${level}, course: ${course}, unit: ${unit}, difficulty: ${difficulty}`)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    
    let filteredQuizzes = mockQuizzes
    
    // Apply filters
    if (levelId) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.levelId === levelId)
    } else if (level) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.level === level)
    }
    
    if (courseId) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.courseId === courseId)
    } else if (course) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.subject === course)
    }
    
    if (unitId) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.unitId === unitId)
    } else if (unit) {
      // Filter by unit name (description contains unit name)
      filteredQuizzes = filteredQuizzes.filter(quiz => 
        quiz.description.toLowerCase().includes(unit.toLowerCase())
      )
    }
    
    if (difficulty && difficulty !== "any") {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.difficulty === difficulty)
    }
    
    if (limit && !isNaN(parseInt(limit))) {
      filteredQuizzes = filteredQuizzes.slice(0, parseInt(limit))
    }
    
    return NextResponse.json({ 
      success: true,
      quizzes: filteredQuizzes,
      count: filteredQuizzes.length,
      filters: {
        level: level || levelId,
        course: course || courseId,
        unit: unit || unitId,
        difficulty
      }
    })
  } catch (error) {
    console.error("Mock quiz error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch mock quizzes" 
    }, { status: 500 })
  }
}

// POST /api/quiz - Create mock quiz (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📊 Creating mock quiz (MongoDB not available)")
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newQuiz = {
      _id: `quiz_${Date.now()}`,
      id: `quiz_${Date.now()}`,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    return NextResponse.json({ 
      success: true,
      quiz: newQuiz,
      message: "Mock quiz created successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Mock quiz creation error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create mock quiz" 
    }, { status: 500 })
  }
}
