/**
 * MongoDB Quiz Seeder for Quix Platform - Biology S1 Units 2 & 3
 * Run with: node seed-questions.js
 */

import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI ||
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

const client = new MongoClient(uri);

async function seedQuestions() {
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
    if (!secondarySchool) throw new Error("No secondary school found");
    const secondarySchoolId = secondarySchool._id;

    // Create or fetch S1 level
    let s1Level = await levelsCol.findOne({ name: "S1" });
    if (!s1Level) {
      s1Level = await levelsCol.insertOne({
        _id: new ObjectId(),
        name: "S1",
        type: "OLEVEL",
        schoolId: secondarySchoolId,
        courses: [],
      });
      console.log("📚 Created S1 level");
    }
    const s1LevelId = s1Level._id;

    // Create or fetch Biology course for S1
    let biologyCourse = await coursesCol.findOne({ 
      name: "Biology", 
      levelId: s1LevelId 
    });
    if (!biologyCourse) {
      biologyCourse = await coursesCol.insertOne({
        _id: new ObjectId(),
        name: "Biology",
        description: "Biology for S1",
        levelId: s1LevelId,
        resources: [],
      });
      await levelsCol.updateOne(
        { _id: s1LevelId },
        { $push: { courses: biologyCourse._id } }
      );
      console.log("📖 Created Biology S1 course");
    }
    const biologyCourseId = biologyCourse._id;

    // Create or fetch units
    const createOrGetUnit = async (unitName) => {
      let unit = await unitsCol.findOne({ name: unitName });
      if (!unit) {
        unit = await unitsCol.insertOne({
          _id: new ObjectId(),
          name: unitName,
          courseId: biologyCourseId,
        });
        console.log(`📂 Created unit: ${unitName}`);
      }
      return unit._id;
    };

    const unit2Id = await createOrGetUnit("Unit 2: Introduction to Classification");
    const unit3Id = await createOrGetUnit("Unit 3: The External Structure and Importance of Flowering Plants");

    // ====== CHANGEABLE PART: Define quizzes for each unit ======
    const quizzesData = [
      {
        id: "quiz-biology-s1-unit2",
        title: "Biology S1 - Unit 2: Introduction to Classification",
        subject: "Biology",
        level: "S1",
        description: "Test your understanding of classification concepts",
        courseId: biologyCourseId,
        unitId: unit2Id,
        duration: 20,
        difficulty: "medium",
        isAdaptive: false,
        questionTemplates: [
          {
            question: "What is the main purpose of biological classification?",
            options: [
              "To group organisms based on similarities and differences",
              "To give every organism the same name",
              "To list animals alphabetically",
              "To separate humans from other species"
            ],
            correctAnswer: "To group organisms based on similarities and differences",
            difficulty: "easy",
            explanation: "Classification helps biologists organize living organisms into groups based on shared characteristics, making study and identification easier."
          },
          {
            question: "Which of the following is NOT a reason for classifying living organisms?",
            options: [
              "To make identification easier",
              "To understand evolutionary relationships",
              "To predict characteristics of related organisms",
              "To confuse students"
            ],
            correctAnswer: "To confuse students",
            difficulty: "easy",
            explanation: "Classification is meant to simplify biological study, not confuse learners. It helps scientists communicate and compare organisms accurately."
          },
          {
            question: "Who developed the binomial system of naming organisms?",
            options: [
              "Aristotle",
              "Charles Darwin",
              "Carl Linnaeus",
              "Louis Pasteur"
            ],
            correctAnswer: "Carl Linnaeus",
            difficulty: "moderate",
            explanation: "Carl Linnaeus introduced the binomial nomenclature system, giving each organism a unique two-part Latin name."
          },
          {
            question: "In the binomial system, the first name represents the ________ and the second name represents the ________.",
            options: [
              "species; genus",
              "family; order",
              "genus; species",
              "order; class"
            ],
            correctAnswer: "genus; species",
            difficulty: "moderate",
            explanation: "In binomial nomenclature, the first word (capitalized) is the genus, and the second (lowercase) is the species identifier."
          },
          {
            question: "Which of the following correctly represents a scientific name?",
            options: [
              "Homo sapiens",
              "Homo Sapiens",
              "HOMO SAPIENS",
              "homo sapiens"
            ],
            correctAnswer: "Homo sapiens",
            difficulty: "easy",
            explanation: "The genus name starts with a capital letter and the species name with a small letter, both italicized or underlined when handwritten."
          },
          {
            question: "Which scientist’s system divided living organisms into two groups: plants and animals?",
            options: [
              "Aristotle",
              "Linnaeus",
              "Darwin",
              "Hooke"
            ],
            correctAnswer: "Aristotle",
            difficulty: "moderate",
            explanation: "Aristotle was among the first to classify organisms into plants and animals based on movement and habitat."
          },
          {
            question: "Which of the following is the correct order of classification ranks from largest to smallest?",
            options: [
              "Kingdom → Phylum → Class → Order → Family → Genus → Species",
              "Species → Genus → Family → Order → Class → Phylum → Kingdom",
              "Family → Kingdom → Phylum → Order → Class → Genus → Species",
              "Kingdom → Order → Family → Class → Genus → Phylum → Species"
            ],
            correctAnswer: "Kingdom → Phylum → Class → Order → Family → Genus → Species",
            difficulty: "moderate",
            explanation: "The taxonomic hierarchy moves from broad to specific categories, organizing all living things systematically."
          },
          {
            question: "Which kingdom contains organisms that make their own food using sunlight?",
            options: [
              "Animalia",
              "Plantae",
              "Fungi",
              "Protista"
            ],
            correctAnswer: "Plantae",
            difficulty: "easy",
            explanation: "Members of Kingdom Plantae are autotrophic—they make their own food by photosynthesis."
          },
          {
            question: "What characteristic distinguishes animals from plants?",
            options: [
              "Animals can move and lack cell walls",
              "Animals have chlorophyll",
              "Animals use photosynthesis",
              "Animals have rigid cells"
            ],
            correctAnswer: "Animals can move and lack cell walls",
            difficulty: "moderate",
            explanation: "Animal cells lack cell walls and chloroplasts, and animals are generally capable of locomotion."
          },
          {
            question: "Which of these kingdoms includes bacteria?",
            options: [
              "Fungi",
              "Monera",
              "Protista",
              "Plantae"
            ],
            correctAnswer: "Monera",
            difficulty: "easy",
            explanation: "Kingdom Monera includes all prokaryotic organisms, such as bacteria, which lack a true nucleus."
          },
          {
            question: "Which kingdom consists of mainly single-celled eukaryotic organisms like amoeba and paramecium?",
            options: [
              "Fungi",
              "Protista",
              "Monera",
              "Plantae"
            ],
            correctAnswer: "Protista",
            difficulty: "moderate",
            explanation: "Kingdom Protista includes unicellular eukaryotes that may live freely in water or as parasites."
          },
          {
            question: "Fungi differ from plants because they:",
            options: [
              "Make their own food through photosynthesis",
              "Feed on dead organic matter",
              "Have chlorophyll",
              "Move from place to place"
            ],
            correctAnswer: "Feed on dead organic matter",
            difficulty: "moderate",
            explanation: "Fungi are heterotrophic saprophytes that obtain nutrients by decomposing organic matter, unlike photosynthetic plants."
          },
          {
            question: "Viruses are sometimes excluded from classification because:",
            options: [
              "They have a nucleus",
              "They show both living and non-living characteristics",
              "They can photosynthesize",
              "They have cell membranes"
            ],
            correctAnswer: "They show both living and non-living characteristics",
            difficulty: "hard",
            explanation: "Viruses are active only inside host cells (living) but can crystallize outside (non-living), so their classification is controversial."
          },
          {
            question: "Which of these organisms is correctly paired with its kingdom?",
            options: [
              "Mushroom – Fungi",
              "Amoeba – Plantae",
              "Bacteria – Protista",
              "Frog – Monera"
            ],
            correctAnswer: "Mushroom – Fungi",
            difficulty: "easy",
            explanation: "Mushrooms are heterotrophic decomposers belonging to the Kingdom Fungi."
          },
          {
            question: "Why is binomial nomenclature preferred over common names?",
            options: [
              "It avoids confusion caused by language differences",
              "It is easier to remember",
              "It changes every year",
              "It uses local names"
            ],
            correctAnswer: "It avoids confusion caused by language differences",
            difficulty: "moderate",
            explanation: "Scientific names are universal and reduce confusion from local or regional naming variations."
          },
          {
            question: "An organism named *Panthera leo* belongs to which genus?",
            options: [
              "Panthera",
              "leo",
              "Felidae",
              "Carnivora"
            ],
            correctAnswer: "Panthera",
            difficulty: "easy",
            explanation: "The first word in the scientific name, 'Panthera,' is the genus; 'leo' identifies the species."
          },
          {
            question: "Which of these characteristics do all living things share, making classification possible?",
            options: [
              "They have similar genetic material (DNA/RNA)",
              "They live in the same environment",
              "They all look alike",
              "They all breathe oxygen"
            ],
            correctAnswer: "They have similar genetic material (DNA/RNA)",
            difficulty: "hard",
            explanation: "All living things share fundamental genetic molecules, allowing scientists to compare evolutionary relationships for classification."
          },
          {
            question: "What is the significance of classification in medicine and agriculture?",
            options: [
              "It helps identify beneficial and harmful species accurately",
              "It is only used for naming crops",
              "It prevents evolution",
              "It replaces experimentation"
            ],
            correctAnswer: "It helps identify beneficial and harmful species accurately",
            difficulty: "moderate",
            explanation: "Classification helps distinguish useful species (like crops and drugs) from harmful ones (like pathogens or weeds)."
          },
          {
            question: "Which level of classification contains organisms that can interbreed to produce fertile offspring?",
            options: [
              "Species",
              "Genus",
              "Family",
              "Order"
            ],
            correctAnswer: "Species",
            difficulty: "easy",
            explanation: "Members of the same species share similar traits and can interbreed successfully to produce fertile offspring."
          },
          {
            question: "The classification of living things into five kingdoms was proposed by:",
            options: [
              "Robert Whittaker",
              "Charles Darwin",
              "Gregor Mendel",
              "Carl Linnaeus"
            ],
            correctAnswer: "Robert Whittaker",
            difficulty: "moderate",
            explanation: "In 1969, Robert Whittaker proposed the five-kingdom system: Monera, Protista, Fungi, Plantae, and Animalia."
          }
        ]
      },
      {
        id: "quiz-biology-s1-unit3",
        title: "Biology S1 - Unit 3: The External Structure and Importance of Flowering Plants",
        subject: "Biology",
        level: "S1",
        description: "Test your understanding of flowering plants structure and importance",
        courseId: biologyCourseId,
        unitId: unit3Id,
        duration: 20,
        difficulty: "medium",
        isAdaptive: false,
        questionTemplates: [
          {
            question: "Which of the following best defines a flowering plant?",
            options: [
              "A plant that produces seeds within fruits after pollination",
              "A plant that reproduces only by spores",
              "A plant without roots or stems",
              "A plant that lives only in water"
            ],
            correctAnswer: "A plant that produces seeds within fruits after pollination",
            difficulty: "easy",
            explanation: "Flowering plants, also called angiosperms, produce flowers for sexual reproduction. Their seeds develop inside fruits."
          },
          {
            question: "Which of the following is NOT part of the main structure of a flowering plant?",
            options: [
              "Root system",
              "Shoot system",
              "Leaf veins",
              "Flower system"
            ],
            correctAnswer: "Flower system",
            difficulty: "easy",
            explanation: "The plant body is divided into the root system (below ground) and shoot system (stems, leaves, and flowers)."
          },
          {
            question: "Which structure anchors the plant and absorbs water and mineral salts?",
            options: [
              "Stem",
              "Leaf",
              "Root",
              "Flower"
            ],
            correctAnswer: "Root",
            difficulty: "easy",
            explanation: "Roots fix the plant firmly in the soil and absorb water and minerals for photosynthesis and growth."
          },
          {
            question: "Which type of root system is typical in monocot plants such as maize and grasses?",
            options: [
              "Taproot system",
              "Fibrous root system",
              "Adventitious root system",
              "Storage root system"
            ],
            correctAnswer: "Fibrous root system",
            difficulty: "moderate",
            explanation: "Monocots have fibrous roots, which are many thin roots of similar size spreading from the base of the stem."
          },
          {
            question: "The taproot system is mainly found in:",
            options: [
              "Dicot plants like beans and carrots",
              "Monocot plants like maize",
              "Ferns and mosses",
              "Algae and fungi"
            ],
            correctAnswer: "Dicot plants like beans and carrots",
            difficulty: "moderate",
            explanation: "Dicots develop a main taproot with smaller lateral roots branching from it."
          },
          {
            question: "Which part of a plant carries water and minerals from roots to other parts?",
            options: [
              "Xylem tissue",
              "Phloem tissue",
              "Epidermis",
              "Cortex"
            ],
            correctAnswer: "Xylem tissue",
            difficulty: "moderate",
            explanation: "Xylem transports water and dissolved minerals upward from roots to leaves and flowers."
          },
          {
            question: "What is the main function of the stem?",
            options: [
              "To anchor the plant and absorb minerals",
              "To support leaves and transport substances",
              "To produce pollen grains",
              "To absorb sunlight directly"
            ],
            correctAnswer: "To support leaves and transport substances",
            difficulty: "easy",
            explanation: "The stem holds leaves and flowers upright, and contains vascular tissues (xylem and phloem) for transport."
          },
          {
            question: "Which of the following correctly describes phloem function?",
            options: [
              "Transports water from roots to leaves",
              "Transports manufactured food from leaves to other parts",
              "Stores minerals in the stem",
              "Produces chlorophyll for photosynthesis"
            ],
            correctAnswer: "Transports manufactured food from leaves to other parts",
            difficulty: "moderate",
            explanation: "Phloem carries sugars and other food substances made in the leaves to storage organs and growing tissues."
          },
          {
            question: "Leaves are known as the ‘food factories’ of the plant because they:",
            options: [
              "Absorb water from the soil",
              "Carry out photosynthesis using sunlight, carbon dioxide, and water",
              "Support the stem",
              "Store minerals"
            ],
            correctAnswer: "Carry out photosynthesis using sunlight, carbon dioxide, and water",
            difficulty: "easy",
            explanation: "Leaves contain chlorophyll that captures sunlight energy to make food (glucose) during photosynthesis."
          },
          {
            question: "What is the flat, broad part of the leaf called?",
            options: [
              "Petiole",
              "Blade (lamina)",
              "Midrib",
              "Stipule"
            ],
            correctAnswer: "Blade (lamina)",
            difficulty: "easy",
            explanation: "The leaf blade or lamina is the broad surface that absorbs sunlight and allows gas exchange for photosynthesis."
          },
          {
            question: "The arrangement of veins in a leaf is called:",
            options: [
              "Venation",
              "Pollination",
              "Germination",
              "Transpiration"
            ],
            correctAnswer: "Venation",
            difficulty: "easy",
            explanation: "Venation refers to the pattern of veins in the leaf; it can be parallel (monocots) or net-like (dicots)."
          },
          {
            question: "Which part of a flower produces pollen grains?",
            options: [
              "Ovary",
              "Anther",
              "Stigma",
              "Petal"
            ],
            correctAnswer: "Anther",
            difficulty: "easy",
            explanation: "The anther, part of the stamen, produces pollen grains that contain male gametes."
          },
          {
            question: "The female part of the flower that receives pollen is the:",
            options: [
              "Ovary",
              "Stigma",
              "Style",
              "Petal"
            ],
            correctAnswer: "Stigma",
            difficulty: "moderate",
            explanation: "The stigma, found at the top of the carpel, is sticky to trap pollen grains during pollination."
          },
          {
            question: "What is the main function of petals?",
            options: [
              "To protect flower buds",
              "To attract pollinators with color and scent",
              "To produce pollen grains",
              "To form seeds"
            ],
            correctAnswer: "To attract pollinators with color and scent",
            difficulty: "easy",
            explanation: "Petals are brightly colored and sometimes scented to attract insects and birds for pollination."
          },
          {
            question: "Which statement best describes the role of sepals?",
            options: [
              "They produce seeds",
              "They protect the flower bud before it opens",
              "They absorb water",
              "They store food"
            ],
            correctAnswer: "They protect the flower bud before it opens",
            difficulty: "easy",
            explanation: "Sepals are green leaf-like structures that protect the developing flower bud."
          },
          {
            question: "Which of the following pairs shows the correct relationship between plant organ and its function?",
            options: [
              "Root – Photosynthesis",
              "Leaf – Absorption of water",
              "Stem – Transport of substances",
              "Flower – Anchoring the plant"
            ],
            correctAnswer: "Stem – Transport of substances",
            difficulty: "easy",
            explanation: "The stem connects roots and leaves through vascular tissues for transport of water, minerals, and food."
          },
          {
            question: "Which plant part is adapted to store food in carrots and cassava?",
            options: [
              "Stem",
              "Root",
              "Leaf",
              "Flower"
            ],
            correctAnswer: "Root",
            difficulty: "moderate",
            explanation: "Carrots and cassava have modified roots that store food for later use in growth or reproduction."
          },
          {
            question: "Transpiration mainly occurs through which plant structure?",
            options: [
              "Cuticle",
              "Stomata",
              "Xylem",
              "Root hairs"
            ],
            correctAnswer: "Stomata",
            difficulty: "moderate",
            explanation: "Stomata are small openings on leaves that allow water vapor to escape and gases to be exchanged."
          },
          {
            question: "Which of the following shows the correct sequence of plant organ organization?",
            options: [
              "Cell → Tissue → Organ → System → Organism",
              "Tissue → Cell → Organ → System → Organism",
              "Organ → System → Tissue → Cell → Organism",
              "Organism → System → Organ → Tissue → Cell"
            ],
            correctAnswer: "Cell → Tissue → Organ → System → Organism",
            difficulty: "moderate",
            explanation: "Biological organization starts from the smallest living unit (cell) and increases in complexity up to the organism level."
          },
          {
            question: "Why are flowering plants important to humans and the environment?",
            options: [
              "They only produce oxygen",
              "They provide food, medicine, raw materials, and maintain ecological balance",
              "They reduce soil fertility",
              "They cause diseases"
            ],
            correctAnswer: "They provide food, medicine, raw materials, and maintain ecological balance",
            difficulty: "moderate",
            explanation: "Flowering plants support life by producing food, oxygen, medicines, and providing habitats for other organisms."
          },
          {
            question: "Which part of the flower develops into fruit after fertilization?",
            options: [
              "Ovary",
              "Stigma",
              "Petal",
              "Anther"
            ],
            correctAnswer: "Ovary",
            difficulty: "moderate",
            explanation: "After fertilization, the ovary develops into a fruit containing seeds that ensure species continuity."
          },
          {
            question: "Why are some plants with large, colorful flowers mostly pollinated by insects?",
            options: [
              "Their colors and scents attract insects that transfer pollen",
              "They can’t produce pollen",
              "They grow only in sunlight",
              "They have no seeds"
            ],
            correctAnswer: "Their colors and scents attract insects that transfer pollen",
            difficulty: "hard",
            explanation: "Insect-pollinated plants use color, scent, and nectar to attract pollinators that help in pollen transfer."
          },
          {
            question: "How do plants contribute to the balance of gases in the atmosphere?",
            options: [
              "They take in oxygen and release carbon dioxide",
              "They release oxygen during photosynthesis and absorb carbon dioxide",
              "They release both gases equally",
              "They only store gases in roots"
            ],
            correctAnswer: "They release oxygen during photosynthesis and absorb carbon dioxide",
            difficulty: "moderate",
            explanation: "Through photosynthesis, plants remove CO₂ from the air and produce O₂, essential for respiration in other organisms."
          },
          {
            question: "Which of the following human activities reduces the benefits provided by flowering plants?",
            options: [
              "Deforestation and overharvesting",
              "Tree planting and gardening",
              "Pollination and seed dispersal",
              "Organic farming"
            ],
            correctAnswer: "Deforestation and overharvesting",
            difficulty: "hard",
            explanation: "Destroying vegetation disrupts ecosystems, reduces biodiversity, and affects oxygen and food production."
          }
        ]
      }
    ];
    // ===================================================

    // Difficulty mapping
    const difficultyMap = { easy: 1, moderate: 3, hard: 5, application: 4 };

    for (const data of quizzesData) {
      const questions = [];
      data.questionTemplates.forEach((template, index) => {
        const optLetters = ['a', 'b', 'c', 'd'];
        const opts = template.options.map((text, i) => ({
          id: optLetters[i],
          text,
          correct: text === template.correctAnswer
        }));
        questions.push({
          id: `q${index + 1}`,
          text: template.question,
          options: opts,
          explanation: template.explanation,
          marks: 1,
          difficultyLevel: difficultyMap[template.difficulty] || 2,
          hints: ["Think about the basic concept first", "Review the key terms from the unit"],
          tags: ["biology-s1", data.id.split('-')[3]],
          timeEstimate: 60
        });
      });

      const quizDoc = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        level: data.level,
        description: data.description,
        courseId: data.courseId,
        unitId: data.unitId,
        questions,
        duration: data.duration,
        difficulty: data.difficulty,
        createdAt: new Date(),
        updatedAt: new Date(),
        adaptiveSettings: null,
        analytics: {
          totalAttempts: 0,
          averageScore: 0,
          averageTimeSpent: 0,
          commonMistakes: []
        },
        isAdaptive: data.isAdaptive
      };

      await quizzesCol.deleteOne({ id: data.id });
      await quizzesCol.insertOne(quizDoc);
      console.log(`✅ Inserted quiz: ${data.title} with ${questions.length} questions.`);
    }

    console.log(`✅ Seeded ${quizzesData.length} quizzes for Biology S1.`);
  } catch (err) {
    console.error("❌ Error seeding quizzes:", err);
  } finally {
    await client.close();
    console.log("🔌 Database connection closed.");
  }
}

seedQuestions();