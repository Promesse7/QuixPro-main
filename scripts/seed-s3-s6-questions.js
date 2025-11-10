const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI ||
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

const client = new MongoClient(uri);

async function seedS3S6Questions() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("QuixDB");
    const quizzesCol = db.collection("quizzes");
    const coursesCol = db.collection("courses");
    const levelsCol = db.collection("levels");
    const schoolsCol = db.collection("schools");
    const unitsCol = db.collection("units");

    // Fetch secondary school
    const secondarySchool = await schoolsCol.findOne({ type: "SECONDARY" });
    if (!secondarySchool) {
      throw new Error("Secondary school not found!");
    }
    const secondarySchoolId = secondarySchool._id;

    // Create or fetch S3 and S6 levels
    const createOrGetLevel = async (levelName) => {
      let level = await levelsCol.findOne({ name: levelName });
      if (!level) {
        const result = await levelsCol.insertOne({
          name: levelName,
          schoolId: secondarySchoolId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        level = { _id: result.insertedId, name: levelName };
      }
      return level._id;
    };

    const s3LevelId = await createOrGetLevel("S3");
    const s6LevelId = await createOrGetLevel("S6");

    // Create courses for each level
    const createOrGetCourse = async (courseName, levelId) => {
      let course = await coursesCol.findOne({
        name: courseName,
        levelId: levelId
      });
      if (!course) {
        const result = await coursesCol.insertOne({
          name: courseName,
          levelId: levelId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        course = { _id: result.insertedId };
      }
      return course._id;
    };

    // Create Biology courses for S3 and S6
    const s3BiologyCourseId = await createOrGetCourse("Biology", s3LevelId);
    const s6BiologyCourseId = await createOrGetCourse("Biology", s6LevelId);

    // Create units
    const createOrGetUnit = async (unitName, courseId) => {
      let unit = await unitsCol.findOne({
        name: unitName,
        courseId: courseId
      });
      if (!unit) {
        const result = await unitsCol.insertOne({
          name: unitName,
          courseId: courseId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        unit = { _id: result.insertedId };
      }
      return unit._id;
    };

    // S3 Biology Units
    const s3Unit1Id = await createOrGetUnit("Unit 1: Cell Structure and Function", s3BiologyCourseId);
    const s3Unit2Id = await createOrGetUnit("Unit 2: Transport in Plants", s3BiologyCourseId);

    // S6 Biology Units
    const s6Unit1Id = await createOrGetUnit("Unit 1: Genetics and Evolution", s6BiologyCourseId);
    const s6Unit2Id = await createOrGetUnit("Unit 2: Ecology and Conservation", s6BiologyCourseId);

    // Sample questions for S3 Unit 1 (Cell Structure)
    const s3Unit1Questions = [
      // Easy questions
      {
        unitId: s3Unit1Id,
        difficulty: "easy",
        question: "What is the basic unit of life?",
        options: ["Cell", "Atom", "Molecule", "Tissue"],
        correctAnswer: "Cell",
        explanation: "The cell is the basic structural and functional unit of all living organisms."
      },
      // Moderate questions
      {
        unitId: s3Unit1Id,
        difficulty: "moderate",
        question: "Which organelle is responsible for protein synthesis in a cell?",
        options: ["Ribosome", "Mitochondria", "Nucleus", "Golgi apparatus"],
        correctAnswer: "Ribosome",
        explanation: "Ribosomes are the cellular structures where protein synthesis occurs through the process of translation."
      },
      // Hard questions
      {
        unitId: s3Unit1Id,
        difficulty: "hard",
        question: "Explain the relationship between the rough endoplasmic reticulum and protein secretion.",
        options: [
          "The rough ER has ribosomes that synthesize proteins for secretion",
          "The rough ER only stores proteins",
          "The rough ER breaks down proteins",
          "The rough ER has no role in protein secretion"
        ],
        correctAnswer: "The rough ER has ribosomes that synthesize proteins for secretion",
        explanation: "The rough ER contains ribosomes on its surface that synthesize proteins destined for secretion from the cell."
      },
      // Application questions
      {
        unitId: s3Unit1Id,
        difficulty: "application",
        question: "A cell has damaged lysosomes. What would be the most likely consequence?",
        options: [
          "Accumulation of cellular waste",
          "Increased protein synthesis",
          "Enhanced cell division",
          "Better energy production"
        ],
        correctAnswer: "Accumulation of cellular waste",
        explanation: "Lysosomes contain digestive enzymes that break down cellular waste. Damaged lysosomes would lead to waste accumulation."
      }
    ];

    // Sample questions for S6 Unit 1 (Genetics and Evolution)
    const s6Unit1Questions = [
      // Easy questions
      {
        unitId: s6Unit1Id,
        difficulty: "easy",
        question: "What is the name of the process by which DNA makes a copy of itself?",
        options: ["Replication", "Transcription", "Translation", "Mutation"],
        correctAnswer: "Replication",
        explanation: "DNA replication is the biological process of producing two identical replicas of DNA from one original DNA molecule."
      },
      // Moderate questions
      {
        unitId: s6Unit1Id,
        difficulty: "moderate",
        question: "In a dihybrid cross, what is the phenotypic ratio in F2 generation?",
        options: ["9:3:3:1", "3:1", "1:2:1", "1:1"],
        correctAnswer: "9:3:3:1",
        explanation: "In a dihybrid cross, the F2 generation shows a 9:3:3:1 ratio when both traits show complete dominance."
      },
      // Hard questions
      {
        unitId: s6Unit1Id,
        difficulty: "hard",
        question: "What would be the result of a crossing-over event during prophase I of meiosis?",
        options: [
          "Genetic recombination between homologous chromosomes",
          "Chromosome duplication",
          "Formation of sister chromatids",
          "Separation of homologous chromosomes"
        ],
        correctAnswer: "Genetic recombination between homologous chromosomes",
        explanation: "Crossing-over leads to genetic recombination between homologous chromosomes, increasing genetic diversity."
      },
      // Application questions
      {
        unitId: s6Unit1Id,
        difficulty: "application",
        question: "A genetic counselor is working with a couple where both parents carry a recessive allele for a genetic disorder. What is the probability that their child will have the disorder?",
        options: ["25%", "50%", "75%", "100%"],
        correctAnswer: "25%",
        explanation: "When both parents are carriers (Aa x Aa), there is a 25% chance their child will receive both recessive alleles (aa) and have the disorder."
      }
    ];

    // Insert all questions
    const allQuestions = [...s3Unit1Questions, ...s6Unit1Questions];
    
    console.log("🌱 Seeding questions...");
    await quizzesCol.insertMany(allQuestions);
    
    console.log("✅ Seeding completed successfully!");

  } catch (err) {
    console.error("❌ Error seeding questions:", err);
  } finally {
    await client.close();
  }
}

seedS3S6Questions();