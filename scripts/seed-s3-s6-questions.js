const { MongoClient, ObjectId } = require("mongodb");
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

    // Create or fetch levels
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

    // Create courses
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

    // Helper to build questions with proper structure
    const buildQuestions = (items) => {
      return items.map((q) => {
        const correctIndex = typeof q.correctAnswer === "number"
          ? q.correctAnswer
          : q.options.findIndex(o => String(o) === String(q.correctAnswer));
        
        return {
          _id: new ObjectId(),
          question: q.question,
          options: q.options,
          correctAnswer: correctIndex,
          explanation: q.explanation || undefined
        };
      });
    };

    // Define quizzes data
    const quizzesData = [
      // S3 - Unit 1: Cell Structure and Function
      {
        title: "Biology S3 - Cell Structure and Function (Easy)",
        description: "Fundamentals of cell structure and basic functions.",
        subject: "Biology",
        level: "S3",
        difficulty: "easy",
        duration: 10,
        levelId: s3LevelId,
        courseId: s3BiologyCourseId,
        unitId: s3Unit1Id,
        questions: buildQuestions([
          { question: "What is the basic unit of life?", options: ["Cell", "Atom", "Molecule", "Tissue"], correctAnswer: "Cell", explanation: "The cell is the basic structural and functional unit of all living organisms." },
          { question: "Which organelle is known as the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi body"], correctAnswer: "Mitochondrion" },
          { question: "Which part controls the activities of the cell?", options: ["Nucleus", "Chloroplast", "Vacuole", "Cell wall"], correctAnswer: "Nucleus" },
          { question: "Plant cells have an extra rigid layer called the:", options: ["Cell wall", "Cell membrane", "Cytoplasm", "Lysosome"], correctAnswer: "Cell wall" },
          { question: "Which structure is present in plant cells but not in animal cells?", options: ["Chloroplast", "Mitochondrion", "Ribosome", "Nucleus"], correctAnswer: "Chloroplast" }
        ])
      },
      {
        title: "Biology S3 - Cell Structure and Function (Medium)",
        description: "Intermediate questions on organelles and their functions.",
        subject: "Biology",
        level: "S3",
        difficulty: "medium",
        duration: 12,
        levelId: s3LevelId,
        courseId: s3BiologyCourseId,
        unitId: s3Unit1Id,
        questions: buildQuestions([
          { question: "Which organelle synthesizes proteins?", options: ["Ribosome", "Golgi apparatus", "Lysosome", "Smooth ER"], correctAnswer: "Ribosome" },
          { question: "Which structure modifies, sorts, and packages proteins?", options: ["Nucleus", "Golgi apparatus", "Rough ER", "Vacuole"], correctAnswer: "Golgi apparatus" },
          { question: "Which is the site of photosynthesis?", options: ["Mitochondrion", "Chloroplast", "Cytoplasm", "Nucleolus"], correctAnswer: "Chloroplast" },
          { question: "Which component regulates substances entering and leaving the cell?", options: ["Cell wall", "Cell membrane", "Cytoskeleton", "Centrosome"], correctAnswer: "Cell membrane" },
          { question: "Which organelle contains digestive enzymes?", options: ["Lysosome", "Peroxisome", "Centrioles", "Ribosome"], correctAnswer: "Lysosome" }
        ])
      },
      {
        title: "Biology S3 - Cell Structure and Function (Hard)",
        description: "Challenging questions on cellular processes and relationships.",
        subject: "Biology",
        level: "S3",
        difficulty: "hard",
        duration: 15,
        levelId: s3LevelId,
        courseId: s3BiologyCourseId,
        unitId: s3Unit1Id,
        questions: buildQuestions([
          { question: "The relationship between rough ER and protein secretion is best described as:", options: ["Rough ER stores proteins", "Rough ER has ribosomes that synthesize proteins for secretion", "Rough ER breaks down proteins", "Rough ER is unrelated to secretion"], correctAnswer: "Rough ER has ribosomes that synthesize proteins for secretion", explanation: "Ribosomes attached to rough ER synthesize proteins destined for secretion or membranes." },
          { question: "Which statement about semi-autonomous organelles is correct?", options: ["Mitochondria and chloroplasts have their own DNA", "Only mitochondria have DNA", "Only chloroplasts have DNA", "Neither has DNA"], correctAnswer: "Mitochondria and chloroplasts have their own DNA" },
          { question: "Which transport requires energy?", options: ["Diffusion", "Osmosis", "Active transport", "Facilitated diffusion"], correctAnswer: "Active transport" },
          { question: "Which change would most directly reduce ATP production?", options: ["Fewer ribosomes", "Damaged mitochondria", "Thicker cell wall", "Bigger vacuole"], correctAnswer: "Damaged mitochondria" },
          { question: "Which best explains turgor pressure in plant cells?", options: ["Water into vacuole increasing internal pressure", "Protein synthesis in rough ER", "ATP production in chloroplasts", "DNA replication in nucleus"], correctAnswer: "Water into vacuole increasing internal pressure" }
        ])
      },
      {
        title: "Biology S3 - Cell Structure and Function (Application)",
        description: "Apply knowledge of cells to real-world scenarios.",
        subject: "Biology",
        level: "S3",
        difficulty: "application",
        duration: 15,
        levelId: s3LevelId,
        courseId: s3BiologyCourseId,
        unitId: s3Unit1Id,
        questions: buildQuestions([
          { question: "A cell has damaged lysosomes. What is the likely consequence?", options: ["Accumulation of cellular waste", "Increased protein synthesis", "Enhanced cell division", "Better energy production"], correctAnswer: "Accumulation of cellular waste" },
          { question: "Leaf cells in drought conditions will most likely:", options: ["Gain turgor pressure", "Lose turgor and wilt", "Increase chloroplast number immediately", "Become animal-like"], correctAnswer: "Lose turgor and wilt" },
          { question: "A toxin blocks ribosomes. Which process is most affected?", options: ["Protein synthesis", "DNA replication", "ATP production", "Photosynthesis light reactions"], correctAnswer: "Protein synthesis" },
          { question: "Removal of cell wall from a plant cell results in a:", options: ["Protoplast", "Spheroplast", "Myoplast", "Chromoplast"], correctAnswer: "Protoplast" },
          { question: "A cell placed in hypertonic solution will:", options: ["Gain water and burst", "Lose water and shrink", "Not change volume", "Divide rapidly"], correctAnswer: "Lose water and shrink" }
        ])
      },

      // S3 - Unit 2: Transport in Plants
      {
        title: "Biology S3 - Transport in Plants (Easy)",
        description: "Basics of xylem, phloem, and transpiration.",
        subject: "Biology",
        level: "S3",
        difficulty: "easy",
        duration: 10,
        levelId: s3LevelId,
        courseId: s3BiologyCourseId,
        unitId: s3Unit2Id,
        questions: buildQuestions([
          { question: "Xylem primarily transports:", options: ["Water and minerals", "Manufactured food", "Hormones", "Proteins"], correctAnswer: "Water and minerals" },
          { question: "Phloem transports:", options: ["Sugars/food from leaves", "Oxygen only", "Minerals only", "Water only"], correctAnswer: "Sugars/food from leaves" },
          { question: "Loss of water vapor from plant leaves is called:", options: ["Transpiration", "Respiration", "Photosynthesis", "Germination"], correctAnswer: "Transpiration" },
          { question: "Stomata are mainly found on:", options: ["Leaves", "Roots", "Seeds", "Flowers"], correctAnswer: "Leaves" },
          { question: "Which factor increases transpiration?", options: ["High humidity", "Wind", "Darkness", "Waterlogged soil"], correctAnswer: "Wind" }
        ])
      },

      // S6 - Unit 1: Genetics and Evolution
      {
        title: "Biology S6 - Genetics and Evolution (Easy)",
        description: "Core facts in genetics and inheritance.",
        subject: "Biology",
        level: "S6",
        difficulty: "easy",
        duration: 12,
        levelId: s6LevelId,
        courseId: s6BiologyCourseId,
        unitId: s6Unit1Id,
        questions: buildQuestions([
          { question: "DNA copying itself is called:", options: ["Replication", "Transcription", "Translation", "Mutation"], correctAnswer: "Replication" },
          { question: "The unit of heredity is the:", options: ["Gene", "Chromosome", "Protein", "Ribosome"], correctAnswer: "Gene" },
          { question: "Phenotype refers to:", options: ["Observable characteristics", "Genetic makeup only", "Chromosome number only", "RNA sequence"], correctAnswer: "Observable characteristics" },
          { question: "Homozygous genotype means:", options: ["Two identical alleles", "Two different alleles", "One allele only", "No alleles present"], correctAnswer: "Two identical alleles" },
          { question: "Variation introduced by meiosis is mainly due to:", options: ["Crossing over", "DNA repair", "Mitosis", "Translation"], correctAnswer: "Crossing over" }
        ])
      },
      {
        title: "Biology S6 - Genetics and Evolution (Medium)",
        description: "Punnett squares, ratios, and molecular basics.",
        subject: "Biology",
        level: "S6",
        difficulty: "medium",
        duration: 14,
        levelId: s6LevelId,
        courseId: s6BiologyCourseId,
        unitId: s6Unit1Id,
        questions: buildQuestions([
          { question: "In a dihybrid cross, typical F2 phenotypic ratio is:", options: ["9:3:3:1", "3:1", "1:2:1", "1:1"], correctAnswer: "9:3:3:1" },
          { question: "mRNA is synthesized from DNA by:", options: ["Transcription", "Replication", "Translation", "Reverse transcription"], correctAnswer: "Transcription" },
          { question: "A and a represent:", options: ["Alleles of a gene", "Different genes", "Haploid sets", "Proteins"], correctAnswer: "Alleles of a gene" },
          { question: "An individual with genotype Aa is:", options: ["Heterozygous", "Homozygous dominant", "Homozygous recessive", "Hemizygous"], correctAnswer: "Heterozygous" },
          { question: "Which base pairs with Adenine in DNA?", options: ["Thymine", "Uracil", "Cytosine", "Guanine"], correctAnswer: "Thymine" }
        ])
      },
      {
        title: "Biology S6 - Genetics and Evolution (Hard)",
        description: "Advanced concepts in recombination and inheritance patterns.",
        subject: "Biology",
        level: "S6",
        difficulty: "hard",
        duration: 16,
        levelId: s6LevelId,
        courseId: s6BiologyCourseId,
        unitId: s6Unit1Id,
        questions: buildQuestions([
          { question: "Crossing-over during prophase I leads to:", options: ["Genetic recombination", "Chromosome duplication", "Sister chromatid formation", "Independent assortment only"], correctAnswer: "Genetic recombination", explanation: "Homologous chromosomes exchange segments, creating new allele combinations." },
          { question: "Linked genes tend to:", options: ["Be inherited together", "Assort independently always", "Disappear in F2", "Cause lethality"], correctAnswer: "Be inherited together" },
          { question: "A pedigree consistent with mitochondrial inheritance shows:", options: ["Maternal transmission", "Paternal-only transmission", "Equal parent transmission", "Random transmission"], correctAnswer: "Maternal transmission" },
          { question: "A test cross involves crossing with a:", options: ["Homozygous recessive", "Homozygous dominant", "Heterozygote", "Any genotype"], correctAnswer: "Homozygous recessive" },
          { question: "Nonsense mutation results in:", options: ["Premature stop codon", "Amino acid substitution", "Frameshift only", "No change in protein"], correctAnswer: "Premature stop codon" }
        ])
      },
      {
        title: "Biology S6 - Genetics and Evolution (Application)",
        description: "Apply inheritance to counseling and probability scenarios.",
        subject: "Biology",
        level: "S6",
        difficulty: "application",
        duration: 16,
        levelId: s6LevelId,
        courseId: s6BiologyCourseId,
        unitId: s6Unit1Id,
        questions: buildQuestions([
          { question: "Two carriers (Aa x Aa) have a child. Probability the child is affected (aa):", options: ["25%", "50%", "75%", "100%"], correctAnswer: "25%", explanation: "Classic monohybrid cross with two heterozygotes yields 1/4 aa." },
          { question: "Carrier mother (X^aX) and unaffected father (XY). Probability of affected son:", options: ["50%", "25%", "0%", "75%"], correctAnswer: "50%" },
          { question: "A couple seeks advice for an autosomal dominant disorder. Risk to offspring from affected heterozygote x unaffected:", options: ["50%", "25%", "0%", "75%"], correctAnswer: "50%" },
          { question: "Blood group cross: IAi x IBi. Possible child blood groups:", options: ["A, B, AB, O", "A only", "B only", "AB only"], correctAnswer: "A, B, AB, O" },
          { question: "A deletion on one chromosome of a pair most likely causes:", options: ["Loss of genetic material", "Gain of genetic material", "No phenotypic effect always", "Triploidy"], correctAnswer: "Loss of genetic material" }
        ])
      },

      // S6 - Unit 2: Ecology and Conservation
      {
        title: "Biology S6 - Ecology and Conservation (Easy)",
        description: "Basic ecological terms and conservation ideas.",
        subject: "Biology",
        level: "S6",
        difficulty: "easy",
        duration: 10,
        levelId: s6LevelId,
        courseId: s6BiologyCourseId,
        unitId: s6Unit2Id,
        questions: buildQuestions([
          { question: "A community plus its abiotic environment is a:", options: ["Ecosystem", "Population", "Biome", "Biosphere"], correctAnswer: "Ecosystem" },
          { question: "Species richness refers to:", options: ["Number of species", "Number of individuals", "Biomass only", "Area size"], correctAnswer: "Number of species" },
          { question: "Conservation aims to:", options: ["Sustain biodiversity", "Eliminate predators only", "Increase pollution", "Reduce habitats"], correctAnswer: "Sustain biodiversity" },
          { question: "Which is a renewable resource?", options: ["Solar energy", "Coal", "Natural gas", "Oil"], correctAnswer: "Solar energy" },
          { question: "Deforestation often leads to:", options: ["Soil erosion", "More rainfall", "Higher biodiversity", "Less CO2"], correctAnswer: "Soil erosion" }
        ])
      }
    ];

    // Insert quizzes
    console.log("🌱 Seeding S3/S6 quizzes...");
    for (const q of quizzesData) {
      // Create unique quiz ID
      const quizId = new ObjectId();
      
      await quizzesCol.insertOne({
        _id: quizId,
        title: q.title,
        subject: q.subject,
        level: q.level,
        description: q.description,
        courseId: q.courseId,
        levelId: q.levelId,
        unitId: q.unitId,
        questions: q.questions,
        duration: q.duration,
        difficulty: q.difficulty,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAdaptive: false,
        analytics: {
          totalAttempts: 0,
          averageScore: 0,
          averageTimeSpent: 0,
          commonMistakes: []
        }
      });
      console.log(`✅ Inserted quiz: ${q.title} (${q.difficulty}) with ${q.questions.length} questions.`);
    }

    console.log(`✅ Seeded ${quizzesData.length} quizzes for S3/S6 Biology.`);

  } catch (err) {
    console.error("❌ Error seeding questions:", err);
  } finally {
    await client.close();
  }
}

seedS3S6Questions();