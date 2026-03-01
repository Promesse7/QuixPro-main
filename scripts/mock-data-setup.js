/**
 * Mock Data Setup for Quiz Selection System
 * This creates mock API responses when MongoDB is not available
 */

// Mock data that matches the expected structure
const mockData = {
  levels: [
    { _id: "level_1", name: "S1", stage: "Senior 1", code: "S1", description: "Senior Secondary Level 1" },
    { _id: "level_2", name: "S2", stage: "Senior 2", code: "S2", description: "Senior Secondary Level 2" },
    { _id: "level_3", name: "S3", stage: "Senior 3", code: "S3", description: "Senior Secondary Level 3" },
    { _id: "level_4", name: "S4", stage: "Senior 4", code: "S4", description: "Senior Secondary Level 4" },
    { _id: "level_5", name: "S5", stage: "Senior 5", code: "S5", description: "Senior Secondary Level 5" },
    { _id: "level_6", name: "S6", stage: "Senior 6", code: "S6", description: "Senior Secondary Level 6" }
  ],
  
  courses: [
    { _id: "course_1", name: "Physics", displayName: "Physics", subject: "Physics", levelId: "level_1", gradeLevel: "S1" },
    { _id: "course_2", name: "Chemistry", displayName: "Chemistry", subject: "Chemistry", levelId: "level_1", gradeLevel: "S1" },
    { _id: "course_3", name: "Biology", displayName: "Biology", subject: "Biology", levelId: "level_1", gradeLevel: "S1" },
    { _id: "course_4", name: "Mathematics", displayName: "Mathematics", subject: "Mathematics", levelId: "level_1", gradeLevel: "S1" },
    { _id: "course_5", name: "English", displayName: "English", subject: "English", levelId: "level_1", gradeLevel: "S1" },
    { _id: "course_6", name: "History", displayName: "History", subject: "History", levelId: "level_1", gradeLevel: "S1" }
  ],
  
  units: [
    { _id: "unit_1", name: "Mechanics", courseId: "course_1", levelId: "level_1", description: "Introduction to Mechanics - Forces and Motion" },
    { _id: "unit_2", name: "Thermodynamics", courseId: "course_1", levelId: "level_1", description: "Heat transfer and energy" },
    { _id: "unit_3", name: "Waves", courseId: "course_1", levelId: "level_1", description: "Wave properties and sound" },
    { _id: "unit_4", name: "Atomic Structure", courseId: "course_2", levelId: "level_1", description: "Atoms, molecules and chemical bonds" },
    { _id: "unit_5", name: "Chemical Reactions", courseId: "course_2", levelId: "level_1", description: "Types of chemical reactions" },
    { _id: "unit_6", name: "Cell Biology", courseId: "course_3", levelId: "level_1", description: "Cell structure and function" },
    { _id: "unit_7", name: "Genetics", courseId: "course_3", levelId: "level_1", description: "Heredity and variation" },
    { _id: "unit_8", name: "Algebra", courseId: "course_4", levelId: "level_1", description: "Algebraic expressions and equations" },
    { _id: "unit_9", name: "Geometry", courseId: "course_4", levelId: "level_1", description: "Shapes and spatial reasoning" }
  ],
  
  quizzes: [
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
}

console.log("📊 Mock Data Setup Complete!")
console.log("================================")
console.log(`Levels: ${mockData.levels.length}`)
console.log(`Courses: ${mockData.courses.length}`)
console.log(`Units: ${mockData.units.length}`)
console.log(`Quizzes: ${mockData.quizzes.length}`)
console.log("================================")

// Export for use in API routes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockData
}

// For browser/console inspection
if (typeof window !== 'undefined') {
  window.mockData = mockData
}
