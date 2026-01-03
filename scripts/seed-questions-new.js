const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI ||
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

const client = new MongoClient(uri);

// ============================================================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================================================
const CONFIG = {
  subject: "PHARMACOLOGY S6 ANP",           // Subject name (e.g., "History", "Mathematics", "Biology")
  level: "S6",                  // Level (e.g., "S1", "S2", "S3", "S4", "S5", "S6")
  
  // Duration settings for each difficulty (in minutes)
  durations: {
    easy: 20,
    medium: 25,
    hard: 30,
    application: 15
  }
};

// ============================================================================
// PASTE YOUR QUESTION TEMPLATES HERE
// ============================================================================

const questionTemplates = {
  "Unit 1: Antifungal Drugs": [
    {
      "question": "What is the primary difference between fungal cells and bacterial cells that explains why fungi are resistant to antibiotics?",
      "options": [
        "Fungi lack a rigid cell wall structure.",
        "The fungal cell wall is composed of chitin and the cell membrane contains ergosterol.",
        "Fungal cells undergo rapid cell division that antibiotics cannot track.",
        "Fungi are multicellular organisms while bacteria are always unicellular."
      ],
      "correctAnswer": "The fungal cell wall is composed of chitin and the cell membrane contains ergosterol.",
      "difficulty": "easy",
      "explanation": "Fungi have a unique cellular makeup including a rigid cell wall made of chitin and polysaccharides, and a membrane containing ergosterol, whereas bacteria lack these specific components, making them unaffected by antibiotics designed to target bacterial structures.",
      "type": "single"
    },
    {
      "question": "An infection caused by a fungus is medically referred to as a:",
      "options": [
        "Bacteremia",
        "Mycosis",
        "Sepsis",
        "Dermatitis"
      ],
      "correctAnswer": "Mycosis",
      "difficulty": "easy",
      "explanation": "A mycosis is the specific medical term for any disease or infection caused by a fungus. Bacteremia refers to bacteria in the blood, while dermatitis is a general term for skin inflammation.",
      "type": "fillBlank"
    },
    {
      "question": "Which of the following classes of antifungal drugs are categorized based on their mechanism of action or chemical structure? (Select all that apply)",
      "options": [
        "Azoles",
        "Polyenes",
        "Echinocandins",
        "Topical antifungals"
      ],
      "correctAnswer": ["Azoles", "Polyenes", "Echinocandins"],
      "difficulty": "moderate",
      "explanation": "Azoles, polyenes, and echinocandins are classes defined by their chemical structure and how they affect the fungus. 'Topical antifungals' is a classification based on the site of application/effect, not mechanism.",
      "multiSelect": true,
      "type": "multiple"
    },
    {
      "question": "Why has the incidence of opportunistic fungal infections, such as those caused by Candida, increased in recent years?",
      "options": [
        "Fungi have evolved to become more aggressive in the environment.",
        "There is a growing population of immunocompromised individuals, such as those with AIDS or those undergoing cancer treatment.",
        "Antibiotics are being used less frequently, allowing fungi to thrive.",
        "Fungi have developed the ability to spread through the air more effectively."
      ],
      "correctAnswer": "There is a growing population of immunocompromised individuals, such as those with AIDS or those undergoing cancer treatment.",
      "difficulty": "moderate",
      "explanation": "Immunocompromised individuals (e.g., patients with HIV/AIDS, transplant recipients, or cancer patients) have weakened immune systems that cannot protect against fungi that are normally found in the environment or on mucous membranes.",
      "type": "single"
    },
    {
      "question": "Assertion (A): Amphotericin B is considered a major therapeutic advance but its use is often limited.\nReason (R): Amphotericin B is associated with severe side effects, including renal impairment and bone marrow suppression.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "hard",
      "explanation": "Amphotericin B is highly effective for invasive infections, but its significant toxicity (nephrotoxicity and bone marrow suppression) limits its clinical application to severe cases where other treatments fail.",
      "type": "assertionReason"
    },
    {
      "question": "A patient is prescribed Fluconazole for the treatment of oropharyngeal candidiasis. How does this 'azole' antifungal primarily exert its effect?",
      "options": [
        "By binding to human cholesterol to weaken the fungal cell.",
        "By blocking the synthesis of ergosterol, leading to the inability of the fungus to form a functional cell membrane.",
        "By inhibiting the production of chitin in the fungal cell wall.",
        "By directly poisoning the fungal nucleus to prevent cell division."
      ],
      "correctAnswer": "By blocking the synthesis of ergosterol, leading to the inability of the fungus to form a functional cell membrane.",
      "difficulty": "moderate",
      "explanation": "Azoles like fluconazole work by inhibiting the synthesis of ergosterol, an essential component of the fungal cell membrane. Without ergosterol, the membrane loses integrity, resulting in cell death (fungicidal) or inhibited growth (fungistatic).",
      "type": "single"
    },
    {
      "question": "Which of the following antifungal drugs is commonly used at the primary healthcare level as a shampoo to treat dandruff?",
      "options": [
        "Amphotericin B",
        "Ketoconazole",
        "Nystatin",
        "Griseofulvin"
      ],
      "correctAnswer": "Ketoconazole",
      "difficulty": "easy",
      "explanation": "Ketoconazole (Nizoral) is available in various forms, including a shampoo specifically indicated to reduce the scaling associated with dandruff.",
      "type": "single"
    },
    {
      "question": "A 55-year-old male with AIDS is being treated for cryptococcal meningitis. The medical team chooses to use an intravenous polyene antifungal known for its potency but high risk of nephrotoxicity. Which drug is this?",
      "options": [
        "Fluconazole",
        "Caspofungin",
        "Amphotericin B",
        "Terbinafine"
      ],
      "correctAnswer": "Amphotericin B",
      "difficulty": "moderate",
      "explanation": "Amphotericin B is a polyene antifungal often used for serious systemic infections like cryptococcal meningitis in immunocompromised patients, though it requires close monitoring for kidney damage.",
      "scenario": "A 55-year-old male with AIDS is being treated for cryptococcal meningitis.",
      "type": "caseBased"
    },
    {
      "question": "In the scenario above, what specific adverse effect should the nurse monitor most closely during the administration of the intravenous antifungal?",
      "options": [
        "Increased hair growth",
        "Renal impairment and electrolyte imbalances",
        "Hypersensitivity to sunlight",
        "Excessive weight gain"
      ],
      "correctAnswer": "Renal impairment and electrolyte imbalances",
      "difficulty": "hard",
      "explanation": "Amphotericin B is notoriously nephrotoxic. Nurses must monitor renal function tests (BUN, creatinine) and electrolytes, as it can cause significant kidney damage and mineral loss.",
      "scenario": "A 55-year-old male with AIDS is being treated for cryptococcal meningitis.",
      "type": "caseBased"
    },
    {
      "question": "The echinocandin class of antifungals, such as anidulafungin and caspofungin, is unique because it:",
      "options": [
        "Targets ergosterol in the cell membrane.",
        "Inhibits glucan synthesis in the fungal cell wall.",
        "Works by disrupting fungal DNA replication.",
        "Is only effective against bacteria."
      ],
      "correctAnswer": "Inhibits glucan synthesis in the fungal cell wall.",
      "difficulty": "moderate",
      "explanation": "Echinocandins inhibit the enzyme glucan synthase. Since glucan is a component of the fungal cell wall but absent in human cells, these drugs specifically target the fungus with potentially fewer host side effects.",
      "type": "single"
    },
    {
      "question": "What is a major contraindication for the use of most systemic azole antifungals?",
      "options": [
        "History of common cold",
        "Known liver toxicity or severe hepatic impairment",
        "Seasonal allergies",
        "Concurrent use of vitamin C"
      ],
      "correctAnswer": "Known liver toxicity or severe hepatic impairment",
      "difficulty": "moderate",
      "explanation": "Many azoles are associated with liver toxicity. They are also known to strongly inhibit the CYP450 enzyme system, leading to numerous drug-drug interactions.",
      "type": "single"
    },
    {
      "question": "Identify the error in the following statement regarding antifungal pharmacokinetics: 'Ketoconazole, itraconazole, and posaconazole are exclusively administered via intravenous infusion for systemic infections.'",
      "options": [
        "The statement is correct.",
        "Ketoconazole, itraconazole, and posaconazole are primarily administered orally.",
        "These drugs cannot be used for systemic infections.",
        "Posaconazole is only available as a topical cream."
      ],
      "correctAnswer": "Ketoconazole, itraconazole, and posaconazole are primarily administered orally.",
      "difficulty": "moderate",
      "explanation": "While some azoles like fluconazole have both oral and IV forms, ketoconazole, itraconazole, and posaconazole are notably administered orally for systemic treatment.",
      "type": "errorIdentification"
    },
    {
      "question": "Which of the following is a topical antifungal commonly used for 'athlete's foot' (tinea pedis)?",
      "options": [
        "Amoxicillin",
        "Clotrimazole",
        "Metronidazole",
        "Insulin"
      ],
      "correctAnswer": "Clotrimazole",
      "difficulty": "easy",
      "explanation": "Clotrimazole is a common topical azole-type antifungal used to treat skin infections like tinea pedis (athlete's foot) and tinea cruris (jock itch).",
      "type": "single"
    },
    {
      "question": "When administering systemic antifungals, why is it critical to obtain a culture of the fungus before starting treatment?",
      "options": [
        "To ensure the patient is not allergic to the fungus.",
        "To identify the specific fungus and ensure the right drug is used, minimizing unnecessary exposure to toxic side effects.",
        "To satisfy administrative requirements for the hospital.",
        "Because antifungal drugs only work if the culture is positive."
      ],
      "correctAnswer": "To identify the specific fungus and ensure the right drug is used, minimizing unnecessary exposure to toxic side effects.",
      "difficulty": "moderate",
      "explanation": "Systemic antifungals can be quite toxic. Proper identification via culture ensures the most effective, least toxic drug is selected for the specific pathogen.",
      "type": "single"
    },
    {
      "question": "All of the following are examples of azole-type topical antifungals EXCEPT:",
      "options": [
        "Miconazole",
        "Ketoconazole",
        "Nystatin",
        "Tioconazole"
      ],
      "correctAnswer": "Nystatin",
      "difficulty": "moderate",
      "explanation": "Nystatin is a polyene antifungal, not an azole. Miconazole, ketoconazole, and tioconazole are all members of the azole family.",
      "type": "negative"
    },
    {
      "question": "A patient taking Warfarin is prescribed Fluconazole for a systemic yeast infection. What is the most likely drug-drug interaction the nurse should anticipate?",
      "options": [
        "Fluconazole will decrease the effectiveness of Warfarin.",
        "Fluconazole will increase the serum levels of Warfarin, increasing the risk of bleeding.",
        "Warfarin will prevent Fluconazole from working.",
        "There is no interaction between these two drugs."
      ],
      "correctAnswer": "Fluconazole will increase the serum levels of Warfarin, increasing the risk of bleeding.",
      "difficulty": "hard",
      "explanation": "Fluconazole inhibits the CYP450 liver enzyme system, which metabolizes Warfarin. This leads to higher levels of Warfarin in the blood and a significantly increased risk of hemorrhage.",
      "type": "single"
    },
    {
      "question": "Which of these instructions is most important for a patient applying a topical antifungal cream for a foot infection?",
      "options": [
        "Apply the cream over thick socks.",
        "Clean and thoroughly dry the affected area before application.",
        "Apply the cream only once a week.",
        "Cover the area with an airtight plastic wrap after application."
      ],
      "correctAnswer": "Clean and thoroughly dry the affected area before application.",
      "difficulty": "easy",
      "explanation": "Fungi thrive in moist environments. Drying the area before applying the medication helps the drug work effectively and discourages further fungal growth.",
      "type": "situational"
    },
    {
      "question": "What is the primary indication for the use of Echinocandin antifungals like Caspofungin?",
      "options": [
        "Mild dandruff",
        "Candidemia and invasive aspergillosis in patients resistant to other therapies",
        "Bacterial pneumonia",
        "Viral influenza"
      ],
      "correctAnswer": "Candidemia and invasive aspergillosis in patients resistant to other therapies",
      "difficulty": "moderate",
      "explanation": "Echinocandins are reserved for serious infections like candidemia (bloodstream infection) or invasive aspergillosis, especially when other treatments are not tolerated.",
      "type": "single"
    },
    {
      "question": "True or False: Topical antifungal agents are generally safe to use on open, draining wounds because they do not get absorbed systemically.",
      "options": [
        "True",
        "False"
      ],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "explanation": "Topical agents reserved for local use can be toxic if absorbed systemically. Applying them to open or draining wounds increases the risk of systemic absorption.",
      "type": "trueFalse"
    },
    {
      "question": "Itraconazole carries a 'Black Box Warning' regarding which of the following risks when combined with certain drugs like lovastatin?",
      "options": [
        "Severe skin rash",
        "Serious cardiovascular effects",
        "Sudden hearing loss",
        "Increased appetite"
      ],
      "correctAnswer": "Serious cardiovascular effects",
      "difficulty": "hard",
      "explanation": "Itraconazole has a black box warning due to the potential for serious cardiovascular risks when taken with specific drugs like certain statins or midazolam.",
      "type": "single"
    },
    {
      "question": "Which antifungal is an allylamine that inhibits ergosterol biosynthesis by targeting squalene epoxidase?",
      "options": [
        "Fluconazole",
        "Terbinafine",
        "Amphotericin B",
        "Nystatin"
      ],
      "correctAnswer": "Terbinafine",
      "difficulty": "moderate",
      "explanation": "Terbinafine is an allylamine antifungal. It works at an earlier stage of ergosterol synthesis than azoles by inhibiting the enzyme squalene epoxidase.",
      "type": "single"
    },
    {
      "question": "A patient with vaginal candidiasis (yeast infection) is prescribed a topical antifungal. The nurse knows that the causative organism is likely:",
      "options": [
        "Tinea pedis",
        "Candida",
        "Aspergillus",
        "Histoplasma"
      ],
      "correctAnswer": "Candida",
      "difficulty": "easy",
      "explanation": "Candida is a fungus normally found on mucous membranes that can cause 'thrush' in the GI tract or 'vaginitis' in the vagina when overgrowth occurs.",
      "type": "single"
    },
    {
      "question": "What is the adult dosage for Fluconazole on the first day of treatment for systemic candidiasis?",
      "options": [
        "10 mg PO",
        "200–400 mg PO",
        "1000 mg IV bolus",
        "5 mg/kg PO"
      ],
      "correctAnswer": "200–400 mg PO",
      "difficulty": "moderate",
      "explanation": "According to typical treatment protocols, adults receive a loading dose of 200–400 mg PO on day 1, followed by a daily maintenance dose (often 100 mg).",
      "type": "calculation"
    },
    {
      "question": "Which of the following describes the therapeutic action of Polyene antifungals like Nystatin?",
      "options": [
        "They inhibit glucan synthesis in the cell wall.",
        "They interact with sterols in the cell membrane to form channels that leak cellular contents.",
        "They prevent the fungus from absorbing glucose.",
        "They block viral reverse transcriptase."
      ],
      "correctAnswer": "They interact with sterols in the cell membrane to form channels that leak cellular contents.",
      "difficulty": "hard",
      "explanation": "Polyenes bind to ergosterol in the fungal membrane, creating pores or channels that allow small molecules to leak out, leading to cell death.",
      "type": "single"
    },
    {
      "question": "Nystatin is primarily used for the treatment of which condition?",
      "options": [
        "Systemic aspergillosis",
        "Candidal infections of the skin, mouth, and vagina",
        "Bacterial meningitis",
        "Hypertension"
      ],
      "correctAnswer": "Candidal infections of the skin, mouth, and vagina",
      "difficulty": "easy",
      "explanation": "Nystatin is widely used topically or as an oral 'swish and swallow' for local Candida infections of the skin and mucous membranes.",
      "type": "single"
    },
    {
      "question": "Which of these statements best defines a 'fungicidal' effect?",
      "options": [
        "The drug slows down the growth of the fungus.",
        "The drug causes the death of the fungal cell.",
        "The drug makes the fungus more visible to the immune system.",
        "The drug prevents the fungus from attaching to human cells."
      ],
      "correctAnswer": "The drug causes the death of the fungal cell.",
      "difficulty": "easy",
      "explanation": "Suffix '-cidal' refers to killing. Therefore, a fungicidal drug kills the fungal cell, whereas a fungistatic drug merely inhibits its replication.",
      "type": "single"
    },
    {
      "question": "Vaginal antifungals such as Tioconazole should be administered in which manner?",
      "options": [
        "Orally with a full glass of water",
        "Inserted high into the vagina, usually at bedtime",
        "Applied to the outer skin only",
        "Mixed with food"
      ],
      "correctAnswer": "Inserted high into the vagina, usually at bedtime",
      "difficulty": "easy",
      "explanation": "Vaginal antifungal preparations are designed for local internal effect and should be inserted high into the vaginal canal to ensure proper coverage.",
      "type": "situational"
    },
    {
      "question": "Which of the following drugs is a morpholine antifungal that inhibits ergosterol biosynthesis?",
      "options": [
        "Amorolfine",
        "Amphotericin B",
        "Ketoconazole",
        "Micafungin"
      ],
      "correctAnswer": "Amorolfine",
      "difficulty": "moderate",
      "explanation": "Amorolfine is a member of the morpholine class. Like allylamines and azoles, it targets the ergosterol pathway but at a different enzymatic step.",
      "type": "single"
    },
    {
      "question": "A patient on Ketoconazole reports dark urine and yellowing of the skin. Which organ is likely being affected by the medication?",
      "options": [
        "Kidneys",
        "Liver",
        "Heart",
        "Lungs"
      ],
      "correctAnswer": "Liver",
      "difficulty": "moderate",
      "explanation": "Dark urine and jaundice (yellowing) are signs of hepatotoxicity. Azoles are known to be potentially toxic to the liver.",
      "type": "single"
    },
    {
      "question": "Identify the correct order of fungal cell structure from outermost to innermost:",
      "options": [
        "Cell membrane, Cell wall, Nucleus",
        "Cell wall, Cell membrane, Nucleus",
        "Nucleus, Cell membrane, Cell wall",
        "Cell wall, Nucleus, Cell membrane"
      ],
      "orderCorrect": ["Cell wall", "Cell membrane", "Nucleus"],
      "difficulty": "easy",
      "explanation": "The fungal cell has a rigid outer cell wall (containing chitin), followed by a cell membrane (containing ergosterol), with the nucleus inside.",
      "type": "ordering"
    },
    {
      "question": "Which antifungal is specifically indicated for the prophylaxis of candidiasis in bone marrow transplant recipients?",
      "options": [
        "Griseofulvin",
        "Fluconazole",
        "Gentian Violet",
        "Amphotericin B"
      ],
      "correctAnswer": "Fluconazole",
      "difficulty": "moderate",
      "explanation": "Fluconazole is commonly used as a prophylactic agent to prevent Candida infections in high-risk patients, such as those receiving bone marrow transplants.",
      "type": "single"
    },
    {
      "question": "Griseofulvin is an antifungal drug whose use has largely been replaced by newer agents. What is its most frequent adverse effect?",
      "options": [
        "Liver failure",
        "Headache and CNS changes",
        "High blood pressure",
        "Hearing loss"
      ],
      "correctAnswer": "Headache and CNS changes",
      "difficulty": "moderate",
      "explanation": "While griseofulvin can have various side effects, headache and central nervous system changes are reported as the most frequent ones.",
      "type": "single"
    },
    {
      "question": "Why are bacteria naturally resistant to antifungal drugs?",
      "options": [
        "Bacteria are too small for the drugs to find.",
        "Bacteria have a different cellular makeup, such as lacking ergosterol in their membranes.",
        "Bacteria produce enzymes that digest antifungal drugs.",
        "Bacteria do not have a cell wall."
      ],
      "correctAnswer": "Bacteria have a different cellular makeup, such as lacking ergosterol in their membranes.",
      "difficulty": "moderate",
      "explanation": "Antifungals target specific fungal components like ergosterol or chitin. Because bacteria do not have these components, they are not affected by these drugs.",
      "type": "single"
    },
    {
      "question": "A patient with a fungal nail infection (onychomycosis) is likely to be prescribed which of the following?",
      "options": [
        "Topical Ketoconazole shampoo",
        "Systemic or topical antifungal agents specific for dermatophytes",
        "Oral Amoxicillin",
        "Intravenous Amphotericin B"
      ],
      "correctAnswer": "Systemic or topical antifungal agents specific for dermatophytes",
      "difficulty": "easy",
      "explanation": "Onychomycosis is a fungal infection of the nails. It is typically treated with either topical lacquers or systemic antifungals that can penetrate the nail bed.",
      "type": "single"
    },
    {
      "question": "Which of the following is a potential side effect of Amphotericin B administration at the injection site?",
      "options": [
        "Improved skin texture",
        "Phlebitis or thrombophlebitis",
        "Increased muscle strength",
        "Numbness in the toes"
      ],
      "correctAnswer": "Phlebitis or thrombophlebitis",
      "difficulty": "moderate",
      "explanation": "Amphotericin B is irritating to the veins and can cause inflammation (phlebitis) or blood clots (thrombophlebitis) at the IV site.",
      "type": "single"
    },
    {
      "question": "The newest class of antifungals that works by inhibiting glucan synthesis is:",
      "options": [
        "Azoles",
        "Polyenes",
        "Echinocandins",
        "Allylamines"
      ],
      "correctAnswer": "Echinocandins",
      "difficulty": "easy",
      "explanation": "Echinocandins (like caspofungin) are a relatively new class of antifungals that target the fungal cell wall by inhibiting glucan synthesis.",
      "type": "single"
    },
    {
      "question": "Which drug would be most appropriate to treat 'thrush' (oral candidiasis) in a patient?",
      "options": [
        "Nystatin oral suspension",
        "Amphotericin B injection",
        "Voriconazole tablets",
        "Whitfield's Ointment"
      ],
      "correctAnswer": "Nystatin oral suspension",
      "difficulty": "easy",
      "explanation": "Nystatin in an oral suspension ('swish and swallow') is a standard treatment for local yeast infections in the mouth, known as thrush.",
      "type": "bestAnswer"
    },
    {
      "question": "Voriconazole (Vfend) should NOT be combined with which of the following due to the risk of ergotism?",
      "options": [
        "Vitamin D",
        "Ergot alkaloids",
        "Acetaminophen",
        "Aspirin"
      ],
      "correctAnswer": "Ergot alkaloids",
      "difficulty": "hard",
      "explanation": "Voriconazole can interact with ergot alkaloids, leading to ergotism (a toxic condition), and thus the combination must be avoided.",
      "type": "single"
    },
    {
      "question": "A student nurse is asked to name three systemic azole antifungals. Which list is correct?",
      "options": [
        "Fluconazole, Ketoconazole, Itraconazole",
        "Nystatin, Amphotericin B, Griseofulvin",
        "Clotrimazole, Miconazole, Tioconazole",
        "Penicillin, Amoxicillin, Erythromycin"
      ],
      "correctAnswer": "Fluconazole, Ketoconazole, Itraconazole",
      "difficulty": "easy",
      "explanation": "Fluconazole, Ketoconazole, and Itraconazole are all azoles used for systemic fungal infections. Clotrimazole and Miconazole are typically topical.",
      "type": "single"
    },
    {
      "question": "What happens when anidulafungin inhibits the enzyme glucan synthase in a fungal cell?",
      "options": [
        "The fungus stops producing energy.",
        "The fungal cell wall cannot form, leading to cell death.",
        "The fungus becomes a bacterium.",
        "The cell membrane becomes too thick."
      ],
      "correctAnswer": "The fungal cell wall cannot form, leading to cell death.",
      "difficulty": "moderate",
      "explanation": "Glucan is a vital component of the fungal cell wall. Inhibiting its synthesis prevents the wall from forming, causing the cell to lose its protective structure and die.",
      "type": "single"
    },
    {
      "question": "Which antifungal agent is an example of an allylamine?",
      "options": [
        "Ketoconazole",
        "Terbinafine",
        "Anidulafungin",
        "Nystatin"
      ],
      "correctAnswer": "Terbinafine",
      "difficulty": "easy",
      "explanation": "Terbinafine belongs to the allylamine class, whereas ketoconazole is an azole, anidulafungin is an echinocandin, and nystatin is a polyene.",
      "type": "single"
    },
    {
      "question": "A patient is prescribed a 'swish and swallow' medication for a mouth infection. The drug is likely a:",
      "options": [
        "Topical antifungal used for local mucosal effect",
        "Systemic antibiotic for internal infection",
        "Steroid for inflammation",
        "Painkiller"
      ],
      "correctAnswer": "Topical antifungal used for local mucosal effect",
      "difficulty": "easy",
      "explanation": "Swish and swallow preparations (like Nystatin) are topical treatments designed to treat the mucous membranes of the mouth and esophagus directly.",
      "type": "single"
    }
  ],
    "Unit 2: Drugs Acting on Gastrointestinal Tract": [
    {
      "question": "Which of the following describes the mechanism of action of Proton Pump Inhibitors (PPIs) like Omeprazole?",
      "options": [
        "Competitive inhibition of H2 receptors on parietal cells",
        "Irreversible inhibition of the H+/K+ ATPase enzyme system",
        "Neutralization of existing gastric hydrochloric acid",
        "Forming a protective physical barrier over the ulcer crater"
      ],
      "correctAnswer": "Irreversible inhibition of the H+/K+ ATPase enzyme system",
      "difficulty": "moderate",
      "explanation": "PPIs bind covalently and irreversibly to the H+/K+ ATPase enzyme (the 'proton pump') in gastric parietal cells, blocking the final step of acid secretion. This is more potent than H2 blockers which only address one pathway of activation.",
      "type": "single"
    },
    {
      "question": "A patient is prescribed Cimetidine for peptic ulcer disease. Which significant side effect or interaction should the nurse prioritize during education?",
      "options": [
        "Inhibition of the hepatic cytochrome P450 enzyme system",
        "Irreversible staining of the teeth",
        "Stimulation of aldosterone secretion causing edema",
        "Rapid development of physical dependence"
      ],
      "correctAnswer": "Inhibition of the hepatic cytochrome P450 enzyme system",
      "difficulty": "hard",
      "explanation": "Cimetidine is a potent inhibitor of the P450 enzyme system. This can lead to toxic levels of other drugs like warfarin, phenytoin, or theophylline. It also has anti-androgenic effects (e.g., gynecomastia).",
      "type": "single"
    },
    {
      "question": "How do H2-receptor antagonists specifically reduce gastric acid secretion?",
      "options": [
        "By blocking the action of gastrin on the G-cells",
        "By blocking histamine from binding to receptors on parietal cells",
        "By stimulating the production of protective mucus",
        "By killing Helicobacter pylori bacteria"
      ],
      "correctAnswer": "By blocking histamine from binding to receptors on parietal cells",
      "difficulty": "moderate",
      "explanation": "Histamine is a major stimulant of acid secretion. H2 blockers like Ranitidine or Famotidine prevent histamine from binding to H2 receptors, thereby reducing the volume and concentration of gastric acid.",
      "type": "single"
    },
    {
      "question": "Which statement accurately describes the administration of Antacids in relation to other oral medications?",
      "options": [
        "Antacids should be taken simultaneously with all medications to enhance absorption.",
        "Other medications should be taken at least 1-2 hours apart from antacids.",
        "Antacids only interact with liquid-form medications.",
        "Antacids increase the acidity of the stomach to help dissolve pills."
      ],
      "correctAnswer": "Other medications should be taken at least 1-2 hours apart from antacids.",
      "difficulty": "moderate",
      "explanation": "Antacids can alter gastric pH and chelate (bind) other drugs, significantly reducing their absorption. Therefore, they should not be taken within 1 to 2 hours of other oral medications.",
      "type": "single"
    },
    {
      "question": "In the management of Peptic Ulcer Disease (PUD) associated with H. pylori, why is a 'Triple Therapy' regimen used?",
      "options": [
        "To provide three different ways to neutralize stomach acid",
        "To combine two antibiotics with a PPI to eradicate the bacteria and promote healing",
        "To ensure the patient has enough calories while on a restricted diet",
        "To prevent the common side effect of constipation"
      ],
      "correctAnswer": "To combine two antibiotics with a PPI to eradicate the bacteria and promote healing",
      "difficulty": "moderate",
      "explanation": "Triple therapy typically includes a PPI (to reduce acid) and two antibiotics (like Clarithromycin and Amoxicillin) to eliminate the H. pylori infection, which is the underlying cause of the ulcer.",
      "type": "single"
    },
    {
      "question": "What is the primary therapeutic goal of using Sucralfate in the treatment of gastric ulcers?",
      "options": [
        "To systemicallly lower the body's pH",
        "To create a viscous, adhesive paste that protects the ulcerated tissue from acid",
        "To inhibit the release of acetylcholine from the vagus nerve",
        "To provide a source of magnesium for the patient"
      ],
      "correctAnswer": "To create a viscous, adhesive paste that protects the ulcerated tissue from acid",
      "difficulty": "moderate",
      "explanation": "Sucralfate is a mucosal protectant. In an acidic environment, it forms a complex that binds to the proteins of the ulcer crater, creating a physical barrier against acid, pepsin, and bile.",
      "type": "single"
    },
    {
      "question": "Assertion (A): Magnesium-containing antacids are frequently combined with Aluminum-containing antacids.\nReason (R): Magnesium causes diarrhea, while Aluminum causes constipation; combining them balances the effect on bowel movements.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "explanation": "A common side effect of Magnesium is diarrhea, and for Aluminum, it is constipation. Most commercial antacids (like Maalox) combine them to provide acid neutralization without causing significant bowel dysfunction.",
      "type": "assertionReason"
    },
    {
      "question": "Which of the following antiemetics is a 5-HT3 receptor antagonist commonly used to prevent chemotherapy-induced nausea?",
      "options": [
        "Metoclopramide",
        "Ondansetron",
        "Promethazine",
        "Hyoscine"
      ],
      "correctAnswer": "Ondansetron",
      "difficulty": "moderate",
      "explanation": "Ondansetron blocks serotonin (5-HT3) receptors both peripherally on vagal nerve terminals and centrally in the Chemoreceptor Trigger Zone (CTZ), making it highly effective for severe nausea.",
      "type": "single"
    },
    {
      "question": "A patient with diabetic gastroparesis is prescribed Metoclopramide. How does this drug facilitate gastric emptying?",
      "options": [
        "By relaxing the pyloric sphincter and increasing upper GI motility",
        "By slowing down the movement of the small intestine",
        "By increasing the production of bile",
        "By inhibiting the central vomiting center only"
      ],
      "correctAnswer": "By relaxing the pyloric sphincter and increasing upper GI motility",
      "difficulty": "hard",
      "explanation": "Metoclopramide is a prokinetic agent. It sensitizes tissues to acetylcholine and blocks dopamine receptors, which increases peristalsis in the upper GI tract and hastens gastric emptying.",
      "type": "single"
    },
    {
      "question": "What is a significant neurologic risk associated with long-term or high-dose use of Metoclopramide?",
      "options": [
        "Loss of hearing",
        "Extrapyramidal symptoms and Tardive Dyskinesia",
        "Peripheral neuropathy in the lower limbs",
        "Acute blindness"
      ],
      "correctAnswer": "Extrapyramidal symptoms and Tardive Dyskinesia",
      "difficulty": "hard",
      "explanation": "Because Metoclopramide blocks dopamine receptors in the brain, it can cause movement disorders known as extrapyramidal symptoms (EPS), including the potentially irreversible tardive dyskinesia.",
      "type": "single"
    },
    {
      "question": "Laxatives are classified by their mechanism. Match the following drug to its correct class: Bisacodyl.",
      "options": [
        "Bulk-forming laxative",
        "Stool softener/Surfactant",
        "Stimulant laxative",
        "Osmotic laxative"
      ],
      "correctAnswer": "Stimulant laxative",
      "difficulty": "moderate",
      "explanation": "Bisacodyl is a stimulant laxative. It works by irritating the intestinal mucosa or stimulating the nerve plexus to increase peristalsis.",
      "type": "single"
    },
    {
      "question": "Why are bulk-forming laxatives, like Psyllium, considered the safest for long-term use?",
      "options": [
        "They are absorbed into the bloodstream to act on the brain.",
        "They mimic the natural action of dietary fiber by pulling water into the stool.",
        "They chemically burn the lining of the colon to force movement.",
        "They do not require the patient to drink water."
      ],
      "correctAnswer": "They mimic the natural action of dietary fiber by pulling water into the stool.",
      "difficulty": "moderate",
      "explanation": "Bulk-forming laxatives absorb water to increase the size of the fecal mass, which naturally stimulates the stretch receptors in the bowel wall to initiate peristalsis.",
      "type": "single"
    },
    {
      "question": "When preparing a home-made Oral Rehydration Solution (ORS), what is the correct ratio of sugar and salt to one liter of water?",
      "options": [
        "1 teaspoon salt and 1 teaspoon sugar",
        "Half a teaspoon salt and 6 teaspoons sugar",
        "6 teaspoons salt and half a teaspoon sugar",
        "1 tablespoon salt and 1 cup sugar"
      ],
      "correctAnswer": "Half a teaspoon salt and 6 teaspoons sugar",
      "difficulty": "moderate",
      "explanation": "The standard WHO-recommended home-made ORS ratio is approximately 1/2 teaspoon of salt and 6 level teaspoons of sugar dissolved in 1 liter of clean water.",
      "type": "calculation"
    },
    {
      "question": "What is the primary physiological purpose of the sugar (glucose) in Oral Rehydration Salts?",
      "options": [
        "To make the solution taste better for children",
        "To provide energy for the bacteria in the gut",
        "To facilitate the co-transport of sodium and water across the intestinal wall",
        "To act as a preservative for the solution"
      ],
      "correctAnswer": "To facilitate the co-transport of sodium and water across the intestinal wall",
      "difficulty": "hard",
      "explanation": "Sodium-glucose co-transport is a mechanism in the small intestine. Glucose helps the gut absorb sodium, and water follows the sodium osmotically, which is vital for rehydration during diarrhea.",
      "type": "single"
    },
    {
      "question": "Hyoscine Butylbromide (Buscopan) is classified as which type of GI drug?",
      "options": [
        "H2-receptor antagonist",
        "Antispasmodic / Anticholinergic",
        "Osmotic laxative",
        "Proton pump inhibitor"
      ],
      "correctAnswer": "Antispasmodic / Anticholinergic",
      "difficulty": "moderate",
      "explanation": "Hyoscine Butylbromide is an antispasmodic. It blocks muscarinic receptors on smooth muscle, reducing GI spasms and cramping.",
      "type": "single"
    },
    {
      "question": "Which of the following is a contraindication for the use of Stimulant Laxatives?",
      "options": [
        "Occasional constipation",
        "Preparation for a colonoscopy",
        "Undiagnosed abdominal pain or suspected bowel obstruction",
        "Being over the age of 60"
      ],
      "correctAnswer": "Undiagnosed abdominal pain or suspected bowel obstruction",
      "difficulty": "hard",
      "explanation": "If a patient has a bowel obstruction, stimulating peristalsis can lead to bowel perforation. Laxatives should never be given to patients with undiagnosed 'acute abdomen'.",
      "type": "single"
    },
    {
      "question": "Misoprostol is a prostaglandin E1 analogue used in GI therapy. What is its primary indication?",
      "options": [
        "Treatment of motion sickness",
        "Prevention of NSAID-induced gastric ulcers",
        "Stopping severe diarrhea",
        "Increasing appetite in cancer patients"
      ],
      "correctAnswer": "Prevention of NSAID-induced gastric ulcers",
      "difficulty": "moderate",
      "explanation": "NSAIDs inhibit prostaglandins that protect the stomach lining. Misoprostol replaces these prostaglandins, stimulating mucus and bicarbonate secretion and inhibiting acid secretion.",
      "type": "single"
    },
    {
      "question": "Why is Misoprostol strictly contraindicated in pregnant women?",
      "options": [
        "It causes severe hypertension in the fetus.",
        "It is a potent abortifacient that causes uterine contractions.",
        "It leads to gestational diabetes.",
        "It prevents the absorption of folic acid."
      ],
      "correctAnswer": "It is a potent abortifacient that causes uterine contractions.",
      "difficulty": "moderate",
      "explanation": "Misoprostol stimulates uterine contractions and is used clinically for labor induction or abortion; therefore, it is contraindicated for ulcer prevention during pregnancy.",
      "type": "single"
    },
    {
      "question": "A patient with chronic renal failure should avoid which type of antacid to prevent toxicity?",
      "options": [
        "Calcium carbonate",
        "Magnesium-based antacids",
        "Sodium bicarbonate",
        "Aluminum hydroxide"
      ],
      "correctAnswer": "Magnesium-based antacids",
      "difficulty": "hard",
      "explanation": "In renal failure, the kidneys cannot excrete magnesium. Accumulation of magnesium can lead to hypermagnesemia, causing cardiac arrhythmias and respiratory depression.",
      "type": "single"
    },
    {
      "question": "Loperamide (Imodium) acts as an antidiarrheal by which mechanism?",
      "options": [
        "Killing the bacteria causing the diarrhea",
        "Acting on opioid receptors in the gut to slow peristalsis",
        "Increasing the osmotic pressure in the bowel",
        "Neutralizing bacterial toxins"
      ],
      "correctAnswer": "Acting on opioid receptors in the gut to slow peristalsis",
      "difficulty": "moderate",
      "explanation": "Loperamide is an opioid agonist that stays in the GI tract. It slows intestinal transit time, allowing for more water absorption and firmer stools.",
      "type": "single"
    },
    {
      "question": "Which antiemetic is most appropriate for a patient suffering from motion sickness (sea sickness)?",
      "options": [
        "Ondansetron",
        "Hyoscine (Scopolamine)",
        "Metoclopramide",
        "Misoprostol"
      ],
      "correctAnswer": "Hyoscine (Scopolamine)",
      "difficulty": "moderate",
      "explanation": "Motion sickness involves the vestibular system (inner ear). Anticholinergics like Hyoscine are effective at blocking the cholinergic pathways from the vestibular apparatus to the vomiting center.",
      "type": "single"
    },
    {
      "question": "What is the 'acid rebound' phenomenon associated with Calcium Carbonate antacids?",
      "options": [
        "The antacid makes the stomach too alkaline, causing the patient to vomit.",
        "The antacid causes a paradoxical increase in acid secretion after its effects wear off.",
        "The antacid prevents the stomach from ever producing acid again.",
        "The antacid causes the esophagus to produce acid."
      ],
      "correctAnswer": "The antacid causes a paradoxical increase in acid secretion after its effects wear off.",
      "difficulty": "hard",
      "explanation": "Calcium carbonate can stimulate gastrin release, which leads to a rebound increase in gastric acid production once the neutralizing effect of the antacid has finished.",
      "type": "single"
    },
    {
      "question": "In the context of gastrointestinal drugs, what does the term 'Prokinetic' refer to?",
      "options": [
        "Drugs that stop the movement of the GI tract",
        "Drugs that increase the strength and frequency of GI contractions",
        "Drugs that promote the growth of healthy bacteria",
        "Drugs that prevent the absorption of fats"
      ],
      "correctAnswer": "Drugs that increase the strength and frequency of GI contractions",
      "difficulty": "moderate",
      "explanation": "Prokinetic agents (like Metoclopramide or Domperidone) enhance GI motility and speed up the passage of food through the stomach and intestines.",
      "type": "single"
    },
    {
      "question": "Which of the following is an example of an Osmotic Laxative?",
      "options": [
        "Lactulose",
        "Senna",
        "Liquid paraffin",
        "Methylcellulose"
      ],
      "correctAnswer": "Lactulose",
      "difficulty": "moderate",
      "explanation": "Lactulose is a non-absorbable sugar that stays in the bowel and draws water in via osmosis, softening the stool and increasing volume.",
      "type": "single"
    },
    {
      "question": "Which drug is often added to ORS to help reduce the duration and severity of diarrhea in children?",
      "options": [
        "Calcium",
        "Zinc",
        "Iron",
        "Vitamin B12"
      ],
      "correctAnswer": "Zinc",
      "difficulty": "moderate",
      "explanation": "Zinc supplementation is recommended by WHO/UNICEF as an adjunct to ORS to reduce the severity of the current episode and prevent future episodes of diarrhea for 2-3 months.",
      "type": "single"
    },
    {
      "question": "What is a common side effect of using Bismuth Subsalicylate (Pepto-Bismol)?",
      "options": [
        "Bright red stools",
        "Harmless blackening of the stool and tongue",
        "Severe insomnia",
        "Uncontrollable sneezing"
      ],
      "correctAnswer": "Harmless blackening of the stool and tongue",
      "difficulty": "moderate",
      "explanation": "Bismuth reacts with sulfur in the saliva and digestive tract to form bismuth sulfide, which is black, resulting in temporary, harmless darkening of the tongue and stool.",
      "type": "single"
    },
    {
      "question": "Which class of drugs is preferred for the treatment of Zollinger-Ellison Syndrome (a condition of extreme gastrin and acid hypersecretion)?",
      "options": [
        "Antacids",
        "H2-receptor antagonists",
        "Proton Pump Inhibitors (PPIs)",
        "Laxatives"
      ],
      "correctAnswer": "Proton Pump Inhibitors (PPIs)",
      "difficulty": "moderate",
      "explanation": "Because PPIs block the final common pathway of acid secretion (the proton pump), they are the most effective for hypersecretory conditions like Zollinger-Ellison syndrome.",
      "type": "single"
    },
    {
      "question": "A patient is taking Aluminum Hydroxide. The nurse should assess for which common adverse effect?",
      "options": [
        "Diarrhea",
        "Constipation",
        "Hypoglycemia",
        "Bradycardia"
      ],
      "correctAnswer": "Constipation",
      "difficulty": "moderate",
      "explanation": "Aluminum-based antacids are well known for causing constipation as a primary side effect.",
      "type": "single"
    },
    {
      "question": "Which statement regarding 'Home-made ORS' is TRUE?",
      "options": [
        "It is always superior to commercial ORS packets.",
        "It should be boiled for 20 minutes after mixing.",
        "It must be discarded after 24 hours to prevent bacterial growth.",
        "It should be concentrated (more salt/sugar) to work faster."
      ],
      "correctAnswer": "It must be discarded after 24 hours to prevent bacterial growth.",
      "difficulty": "hard",
      "explanation": "Both commercial and home-made ORS provide a medium for bacterial growth. Any unused portion must be thrown away after 24 hours.",
      "type": "trueFalse"
    },
    {
      "question": "What is the 'Chemoreceptor Trigger Zone' (CTZ)?",
      "options": [
        "A part of the stomach that detects toxins",
        "An area in the brain (medulla) that senses blood-borne toxins to initiate vomiting",
        "A valve between the esophagus and stomach",
        "The area in the tongue that tastes bitterness"
      ],
      "correctAnswer": "An area in the brain (medulla) that senses blood-borne toxins to initiate vomiting",
      "difficulty": "moderate",
      "explanation": "The CTZ is located outside the blood-brain barrier. It detects chemicals, drugs, and toxins in the blood and signals the vomiting center to trigger the emetic reflex.",
      "type": "single"
    },
    {
      "question": "Identify the drug that is a Dopamine (D2) receptor antagonist used specifically for its antiemetic properties.",
      "options": [
        "Loperamide",
        "Domperidone",
        "Pantoprazole",
        "Psyllium"
      ],
      "correctAnswer": "Domperidone",
      "difficulty": "moderate",
      "explanation": "Domperidone is a dopamine antagonist. Unlike metoclopramide, it does not easily cross the blood-brain barrier, reducing the risk of central nervous system side effects.",
      "type": "single"
    },
    {
      "question": "Why should Antispasmodics like Hyoscine be used with caution in patients with Glaucoma?",
      "options": [
        "They cause the eyes to produce too much fluid.",
        "Their anticholinergic effects can increase intraocular pressure.",
        "They cause permanent color blindness.",
        "They interact with eye drops to cause infection."
      ],
      "correctAnswer": "Their anticholinergic effects can increase intraocular pressure.",
      "difficulty": "hard",
      "explanation": "Anticholinergics cause pupillary dilation (mydriasis), which can block the drainage of aqueous humor in the eye, dangerously increasing intraocular pressure in patients with narrow-angle glaucoma.",
      "type": "single"
    },
    {
      "question": "Which of the following is the 'Best Answer' regarding the administration of PPIs?",
      "options": [
        "Take them immediately after a large meal.",
        "Take them 30-60 minutes before the first meal of the day.",
        "Take them only when you feel heartburn.",
        "Crush the enteric-coated tablets for faster action."
      ],
      "correctAnswer": "Take them 30-60 minutes before the first meal of the day.",
      "difficulty": "hard",
      "explanation": "PPIs work best when the proton pumps are being stimulated by a meal. Taking the drug 30-60 minutes before breakfast ensures the peak drug levels coincide with maximal pump activity.",
      "type": "bestAnswer"
    },
    {
      "question": "Which laxative works by lowering the surface tension of the stool, allowing water and lipids to penetrate?",
      "options": [
        "Docusate Sodium",
        "Magnesium Citrate",
        "Senna",
        "Psyllium"
      ],
      "correctAnswer": "Docusate Sodium",
      "difficulty": "moderate",
      "explanation": "Docusate Sodium is a stool softener (surfactant). It doesn't stimulate the bowel; it simply makes the stool softer and easier to pass by allowing water to mix into the fecal mass.",
      "type": "single"
    },
    {
      "question": "The use of Liquid Paraffin as a laxative is associated with which risk if accidentally aspirated?",
      "options": [
        "Lipid pneumonia",
        "Bacterial sinus infection",
        "Sudden drop in blood sugar",
        "Increased heart rate"
      ],
      "correctAnswer": "Lipid pneumonia",
      "difficulty": "hard",
      "explanation": "Liquid paraffin is a mineral oil. If it enters the lungs (aspiration), it can cause a severe inflammatory reaction known as lipid pneumonia.",
      "type": "single"
    },
    {
      "question": "Which of these is a typical side effect of H2-receptor antagonists like Ranitidine?",
      "options": [
        "Severe hypertension",
        "Confusion (especially in elderly patients)",
        "Orange-colored urine",
        "Increased risk of bone fractures"
      ],
      "correctAnswer": "Confusion (especially in elderly patients)",
      "difficulty": "hard",
      "explanation": "H2 blockers, especially Cimetidine and Ranitidine, can cross the blood-brain barrier and cause CNS effects like confusion, hallucinations, or lethargy, particularly in older adults or those with renal impairment.",
      "type": "single"
    },
    {
      "question": "What is the purpose of adding an antibiotic to the treatment of a gastric ulcer?",
      "options": [
        "To prevent a secondary flu infection",
        "To eradicate H. pylori bacteria which causes most ulcers",
        "To help the antacid work more quickly",
        "To stop the patient from coughing"
      ],
      "correctAnswer": "To eradicate H. pylori bacteria which causes most ulcers",
      "difficulty": "moderate",
      "explanation": "H. pylori is a bacterium that weakens the protective coating of the stomach. Eradicating it with antibiotics is necessary for permanent ulcer healing and preventing recurrence.",
      "type": "single"
    },
    {
      "question": "Select ALL the factors that can contribute to the development of Peptic Ulcer Disease (PUD):",
      "options": [
        "Helicobacter pylori infection",
        "Chronic use of NSAIDs (e.g., Aspirin, Ibuprofen)",
        "Zollinger-Ellison Syndrome",
        "Consuming a high-fiber diet"
      ],
      "correctAnswer": ["Helicobacter pylori infection", "Chronic use of NSAIDs (e.g., Aspirin, Ibuprofen)", "Zollinger-Ellison Syndrome"],
      "difficulty": "moderate",
      "explanation": "H. pylori, NSAIDs, and excessive acid secretion (Zollinger-Ellison) are primary causes. A high-fiber diet is generally protective and does not cause ulcers.",
      "multiSelect": true,
      "type": "multiple"
    },
    {
      "question": "Which antiemetic is also used as a 'pre-medication' before surgery to dry up secretions and prevent postoperative nausea?",
      "options": [
        "Loperamide",
        "Hyoscine (Scopolamine)",
        "Aluminum hydroxide",
        "Lactulose"
      ],
      "correctAnswer": "Hyoscine (Scopolamine)",
      "difficulty": "moderate",
      "explanation": "As an anticholinergic, Hyoscine reduces glandular secretions (saliva, bronchial) and helps prevent nausea associated with anesthesia and surgery.",
      "type": "single"
    },
    {
      "question": "What is the primary risk of using Sodium Bicarbonate as an antacid frequently?",
      "options": [
        "Metabolic acidosis",
        "Metabolic alkalosis and fluid retention",
        "Permanent yellowing of the skin",
        "Loss of appetite"
      ],
      "correctAnswer": "Metabolic alkalosis and fluid retention",
      "difficulty": "hard",
      "explanation": "Sodium bicarbonate is systemic and highly absorbable. Excessive use can lead to alkalosis (high blood pH) and high sodium levels, which causes fluid retention—dangerous for patients with heart failure.",
      "type": "single"
    },
    {
      "question": "A patient with severe diarrhea is given ORS. How should the ORS be administered?",
      "options": [
        "Drink the entire liter as quickly as possible.",
        "Take small, frequent sips to ensure absorption and avoid vomiting.",
        "Wait until the diarrhea stops before drinking.",
        "Mix it with a carbonated soda to improve the effect."
      ],
      "correctAnswer": "Take small, frequent sips to ensure absorption and avoid vomiting.",
      "difficulty": "moderate",
      "explanation": "Small, frequent sips are better tolerated, especially if the patient is nauseated, and allow for steady rehydration.",
      "type": "situational"
    },
    {
      "question": "Which of the following is NOT a characteristic of Proton Pump Inhibitors (PPIs)?",
      "options": [
        "They are more effective than H2 blockers.",
        "They should be taken with food for best absorption.",
        "Long-term use is associated with a risk of osteoporosis/fractures.",
        "They are often formulated as enteric-coated granules."
      ],
      "correctAnswer": "They should be taken with food for best absorption.",
      "difficulty": "hard",
      "explanation": "PPIs should be taken *before* food (on an empty stomach) to ensure they are present in the blood when the proton pumps are activated by eating.",
      "type": "negative"
    },
    {
      "question": "A patient reports a 'chalky' taste and constipation after starting an ulcer medication. Which drug are they likely taking?",
      "options": [
        "Omeprazole",
        "Calcium Carbonate",
        "Metoclopramide",
        "Loperamide"
      ],
      "correctAnswer": "Calcium Carbonate",
      "difficulty": "moderate",
      "explanation": "Calcium carbonate antacids (like Tums) are known for their chalky texture and their tendency to cause constipation.",
      "type": "single"
    },
    {
      "question": "Why is it important to increase fluid intake when taking bulk-forming laxatives?",
      "options": [
        "The fluid prevents the medication from tasting bad.",
        "Without enough fluid, the bulk-forming mass can harden and cause an intestinal obstruction.",
        "The fluid activates the chemicals in the psyllium.",
        "Bulk-forming laxatives cause severe dehydration."
      ],
      "correctAnswer": "Without enough fluid, the bulk-forming mass can harden and cause an intestinal obstruction.",
      "difficulty": "hard",
      "explanation": "Bulk laxatives need water to swell and create a soft mass. If taken with insufficient water, they can form a solid 'plug' in the esophagus or intestine, leading to obstruction.",
      "type": "single"
    },
    {
      "question": "Identify the 'Error' in this instruction: 'When a patient has infectious diarrhea caused by Salmonella, the first priority is to give Loperamide to stop the bowel movements immediately.'",
      "options": [
        "No error; Loperamide is always the first choice.",
        "Error: In infectious diarrhea, stopping peristalsis can trap the toxins and bacteria in the gut, worsening the condition.",
        "Error: Loperamide only works for constipation.",
        "Error: Salmonella is treated with antacids."
      ],
      "correctAnswer": "Error: In infectious diarrhea, stopping peristalsis can trap the toxins and bacteria in the gut, worsening the condition.",
      "difficulty": "hard",
      "explanation": "In some bacterial infections, the diarrhea is the body's way of 'flushing' the pathogen. Slowing the gut can lead to toxic megacolon or prolonged infection.",
      "type": "errorIdentification"
    },
    {
      "question": "Which of the following describes the therapeutic effect of 'Lube' or Lubricant laxatives like Liquid Paraffin?",
      "options": [
        "They increase the water content of the stool.",
        "They coat the stool and the intestinal wall with a waterproof film to ease passage.",
        "They stimulate the nerves in the colon.",
        "They expand to fill the colon."
      ],
      "correctAnswer": "They coat the stool and the intestinal wall with a waterproof film to ease passage.",
      "difficulty": "moderate",
      "explanation": "Lubricants soften fecal matter and lubricate the intestinal track, making the passage of stool smoother without stimulating the bowel itself.",
      "type": "single"
    }
  ],
 "Unit 3: Medications Used for Non-Communicable Diseases": [
    {
      "question": "A patient with hypertension and a history of gout is being evaluated for diuretic therapy. Which class of diuretics should be used with extreme caution because it competes with uric acid for secretion in the renal tubules?",
      "options": ["Loop diuretics", "Thiazide diuretics", "Potassium-sparing diuretics", "Osmotic diuretics"],
      "correctAnswer": "Thiazide diuretics",
      "difficulty": "moderate",
      "explanation": "Thiazide diuretics (like Hydrochlorothiazide) can cause hyperuricemia. They compete with uric acid for the organic acid secretory pathway in the proximal tubule, which can precipitate a gout attack in susceptible patients.",
      "type": "single"
    },
    {
      "question": "Which specific mechanism allows Angiotensin-Converting Enzyme (ACE) Inhibitors to provide a 'renoprotective' effect in diabetic patients?",
      "options": [
        "By increasing systemic blood pressure to improve kidney perfusion",
        "By dilating the efferent arteriole, thereby reducing intraglomerular pressure",
        "By constricting the afferent arteriole to limit glucose entry into the nephron",
        "By increasing the production of aldosterone to retain sodium"
      ],
      "correctAnswer": "By dilating the efferent arteriole, thereby reducing intraglomerular pressure",
      "difficulty": "hard",
      "explanation": "ACE inhibitors reduce Angiotensin II levels. Angiotensin II normally constricts the efferent arteriole more than the afferent. Inhibiting it causes efferent vasodilation, lowering the pressure inside the glomerulus and slowing the progression of diabetic nephropathy.",
      "type": "single"
    },
    {
      "question": "A patient taking Enalapril develops a persistent, dry, non-productive cough. What is the physiological mediator responsible for this common adverse effect?",
      "options": ["Angiotensin I", "Renin", "Bradykinin", "Aldosterone"],
      "correctAnswer": "Bradykinin",
      "difficulty": "moderate",
      "explanation": "ACE is responsible for the breakdown of bradykinin. When ACE is inhibited, bradykinin levels rise in the lungs, which can irritate the sensory nerves and cause the characteristic dry cough associated with ACE inhibitors.",
      "type": "single"
    },
    {
      "question": "Which of the following describes the unique pharmacological property of Dihydropyridine Calcium Channel Blockers (e.g., Nifedipine) compared to Non-dihydropyridines (e.g., Verapamil)?",
      "options": [
        "They have a high affinity for calcium channels in the cardiac conduction system.",
        "They are more selective for vascular smooth muscle than for the myocardium.",
        "They significantly slow the heart rate by acting on the AV node.",
        "They are primarily used to treat supraventricular tachycardias."
      ],
      "correctAnswer": "They are more selective for vascular smooth muscle than for the myocardium.",
      "difficulty": "hard",
      "explanation": "Dihydropyridines (Amlodipine, Nifedipine) are potent vasodilators with little effect on cardiac conduction at therapeutic doses. Non-dihydropyridines (Verapamil, Diltiazem) have significant negative inotropic and chronotropic effects.",
      "type": "single"
    },
    {
      "question": "A patient is prescribed Spironolactone. Which of the following lab values requires the most immediate nursing intervention?",
      "options": ["Sodium 136 mEq/L", "Potassium 5.8 mEq/L", "Glucose 110 mg/dL", "Creatinine 1.0 mg/dL"],
      "correctAnswer": "Potassium 5.8 mEq/L",
      "difficulty": "moderate",
      "explanation": "Spironolactone is a potassium-sparing diuretic. A potassium level of 5.8 mEq/L indicates hyperkalemia (normal range is 3.5-5.0 mEq/L), which can lead to life-threatening cardiac arrhythmias.",
      "type": "calculation"
    },
    {
      "question": "What is the primary hemodynamic effect of direct-acting vasodilators like Hydralazine?",
      "options": [
        "Decreased preload through venous dilation",
        "Decreased afterload through arterial dilation",
        "Inhibition of the sympathetic nervous system",
        "Reduction in circulating blood volume"
      ],
      "correctAnswer": "Decreased afterload through arterial dilation",
      "difficulty": "moderate",
      "explanation": "Hydralazine acts primarily on the smooth muscle of arterioles (resistance vessels), decreasing peripheral vascular resistance (afterload). It has little to no effect on the venous (capacitance) system.",
      "type": "single"
    },
    {
      "question": "Assertion (A): Propanolol is contraindicated in patients with severe asthma.\nReason (R): Non-selective beta-blockers antagonize Beta-2 receptors in the bronchi, leading to bronchoconstriction.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "hard",
      "explanation": "Propranolol blocks both Beta-1 (heart) and Beta-2 (bronchi) receptors. In asthmatic patients, blocking Beta-2 receptors can trigger life-threatening bronchospasm by preventing the bronchodilatory effects of sympathetic stimulation.",
      "type": "assertionReason"
    },
    {
      "question": "A patient is switched from an ACE inhibitor to an Angiotensin II Receptor Blocker (ARB) like Losartan. What is the main advantage of this switch?",
      "options": [
        "ARBs are more effective at lowering blood pressure.",
        "ARBs do not affect the breakdown of bradykinin, thus avoiding the dry cough.",
        "ARBs do not cause hyperkalemia.",
        "ARBs can be safely used during the second trimester of pregnancy."
      ],
      "correctAnswer": "ARBs do not affect the breakdown of bradykinin, thus avoiding the dry cough.",
      "difficulty": "moderate",
      "explanation": "ARBs block the AT1 receptor directly rather than inhibiting the ACE enzyme. Because they don't inhibit the enzyme, bradykinin is still broken down normally, and the cough is avoided.",
      "type": "single"
    },
    {
      "question": "Metformin, a Biguanide, lowers blood glucose primarily by which mechanism?",
      "options": [
        "Stimulating the beta cells of the pancreas to release more insulin",
        "Decreasing hepatic glucose production and improving insulin sensitivity",
        "Increasing the absorption of glucose from the GI tract",
        "Directly mimicking the action of insulin in the muscle"
      ],
      "correctAnswer": "Decreasing hepatic glucose production and improving insulin sensitivity",
      "difficulty": "moderate",
      "explanation": "Unlike sulfonylureas, Metformin does not stimulate insulin secretion (so it rarely causes hypoglycemia). It reduces gluconeogenesis in the liver and increases peripheral glucose uptake in the tissues.",
      "type": "single"
    },
    {
      "question": "Which of the following is a 'Black Box Warning' or major safety concern for the use of Pioglitazone (a Thiazolidinedione)?",
      "options": [
        "Severe lactic acidosis",
        "Exacerbation of heart failure due to fluid retention",
        "Permanent discoloration of the skin",
        "Acute hearing loss"
      ],
      "correctAnswer": "Exacerbation of heart failure due to fluid retention",
      "difficulty": "hard",
      "explanation": "Thiazolidinediones can cause significant fluid retention and peripheral edema, which can worsen or precipitate congestive heart failure in at-risk patients.",
      "type": "single"
    },
    {
      "question": "A patient is diagnosed with Type 2 Diabetes and prescribed Glibenclamide. What is the most important education point regarding meal timing?",
      "options": [
        "Take the medication with a high-fat meal to improve absorption.",
        "Take the medication 30 minutes before a meal to prevent hypoglycemia.",
        "Take the medication only if blood sugar is above 200 mg/dL.",
        "Take the medication at bedtime on an empty stomach."
      ],
      "correctAnswer": "Take the medication 30 minutes before a meal to prevent hypoglycemia.",
      "difficulty": "moderate",
      "explanation": "Glibenclamide is a Sulfonylurea that stimulates insulin release. It must be timed with food intake; if the drug peaks while the patient hasn't eaten, severe hypoglycemia can occur.",
      "type": "situational"
    },
    {
      "question": "Which type of insulin should the nurse expect to administer intravenously in a patient with Diabetic Ketoacidosis (DKA)?",
      "options": ["Insulin Glargine (Lantus)", "Insulin NPH (Humulin N)", "Regular Insulin (Humulin R)", "Insulin Detemir (Levemir)"],
      "correctAnswer": "Regular Insulin (Humulin R)",
      "difficulty": "moderate",
      "explanation": "Regular insulin is the only insulin that can be administered intravenously. It has a rapid onset and short duration, allowing for the precise titration needed in emergency DKA management.",
      "type": "single"
    },
    {
      "question": "When teaching a patient about 'Rotation of Sites' for insulin injections, the nurse explains that this is done to prevent:",
      "options": ["Systemic infection", "Lipodystrophy", "Wasting of insulin", "Rapid absorption"],
      "correctAnswer": "Lipodystrophy",
      "difficulty": "moderate",
      "explanation": "Repeated injections in the same small area can cause lipodystrophy (atrophy or hypertrophy of subcutaneous fat), which can lead to unpredictable insulin absorption.",
      "type": "single"
    },
    {
      "question": "Which of the following describes the pharmacological profile of Insulin Glargine?",
      "options": [
        "Rapid onset, peaks in 1 hour, lasts 3 hours",
        "Slow onset, peaks in 8 hours, lasts 16 hours",
        "Delayed onset, peakless, lasts approximately 24 hours",
        "Immediate onset, peaks in 30 minutes, lasts 5 hours"
      ],
      "correctAnswer": "Delayed onset, peakless, lasts approximately 24 hours",
      "difficulty": "hard",
      "explanation": "Glargine is a long-acting basal insulin. It is designed to provide a steady level of insulin over 24 hours without a pronounced peak, mimicking natural basal pancreatic secretion.",
      "type": "single"
    },
    {
      "question": "A patient is experiencing an acute asthma attack. Which medication is the 'Drug of Choice' for immediate relief?",
      "options": ["Salmeterol", "Salbutamol", "Fluticasone", "Theophylline"],
      "correctAnswer": "Salbutamol",
      "difficulty": "moderate",
      "explanation": "Salbutamol (Albuterol) is a Short-Acting Beta-2 Agonist (SABA). It causes rapid bronchodilation and is the primary 'rescue' inhaler used during acute exacerbations.",
      "type": "bestAnswer"
    },
    {
      "question": "What is the primary rationale for using inhaled corticosteroids (ICS) like Beclomethasone in chronic asthma management?",
      "options": [
        "To provide rapid bronchodilation during an attack",
        "To suppress the underlying airway inflammation and reduce bronchial hyper-reactivity",
        "To thin the mucus secretions in the lungs",
        "To prevent the development of a secondary bacterial infection"
      ],
      "correctAnswer": "To suppress the underlying airway inflammation and reduce bronchial hyper-reactivity",
      "difficulty": "moderate",
      "explanation": "Asthma is an inflammatory disease. While bronchodilators treat the symptoms, ICS treat the underlying cause by reducing inflammation, which prevents future attacks.",
      "type": "single"
    },
    {
      "question": "A patient using a Beclomethasone MDI (metered-dose inhaler) is instructed to rinse their mouth after each use. This is to prevent:",
      "options": ["Tooth decay", "Oral candidiasis (thrush)", "Loss of taste", "Systemic absorption of the drug"],
      "correctAnswer": "Oral candidiasis (thrush)",
      "difficulty": "moderate",
      "explanation": "Corticosteroids suppress local immunity. If the drug particles remain in the mouth/throat, they can allow an overgrowth of Candida albicans.",
      "type": "single"
    },
    {
      "question": "How do Leukotriene Receptor Antagonists (e.g., Montelukast) differ from SABAs in asthma therapy?",
      "options": [
        "They are only available via inhalation.",
        "They are used for long-term prophylaxis and maintenance, not for acute relief.",
        "They cause immediate relaxation of airway smooth muscle.",
        "They are the first-line treatment for an acute attack."
      ],
      "correctAnswer": "They are used for long-term prophylaxis and maintenance, not for acute relief.",
      "difficulty": "moderate",
      "explanation": "Montelukast is an oral medication that blocks leukotrienes (inflammatory mediators). It takes days to weeks to reach full effectiveness and has no role in treating an active, acute bronchospasm.",
      "type": "single"
    },
    {
      "question": "Which of the following is a potential side effect of high-dose or frequent use of Salbutamol?",
      "options": ["Bradycardia", "Hypokalemia and Tremors", "Urinary retention", "Sedation"],
      "correctAnswer": "Hypokalemia and Tremors",
      "difficulty": "hard",
      "explanation": "Beta-2 agonists stimulate the Na+/K+ ATPase pump, which can drive potassium into cells, causing low serum potassium. They also stimulate Beta receptors in skeletal muscle, causing tremors and tachycardia.",
      "type": "single"
    },
    {
      "question": "A patient on Theophylline therapy has a serum level of 25 mcg/mL. What should the nurse's first action be?",
      "options": [
        "Administer the next dose as scheduled.",
        "Increase the dose to reach the therapeutic range.",
        "Hold the dose and notify the provider for signs of toxicity.",
        "Encourage the patient to drink more caffeine to help the drug work."
      ],
      "correctAnswer": "Hold the dose and notify the provider for signs of toxicity.",
      "difficulty": "hard",
      "explanation": "The therapeutic range for Theophylline is narrow (typically 10-20 mcg/mL). A level of 25 mcg/mL is toxic and can cause seizures and life-threatening arrhythmias.",
      "type": "situational"
    },
    {
      "question": "Identify the error in this statement: 'To manage an acute asthma attack, the patient should first use their Salmeterol inhaler followed by Fluticasone.'",
      "options": [
        "There is no error.",
        "Error: Salmeterol is a Long-Acting Beta Agonist (LABA) and has a slow onset; it should never be used for acute relief.",
        "Error: Fluticasone should be used before any bronchodilator.",
        "Error: Salmeterol is an oral medication."
      ],
      "correctAnswer": "Error: Salmeterol is a Long-Acting Beta Agonist (LABA) and has a slow onset; it should never be used for acute relief.",
      "difficulty": "hard",
      "explanation": "LABAs like Salmeterol are for maintenance. Using them during an acute attack is dangerous because they do not work quickly enough to resolve airway obstruction.",
      "type": "errorIdentification"
    },
    {
      "question": "Which of the following is a classic sign of hypoglycemia that a patient on insulin should be taught to recognize?",
      "options": ["Increased thirst and urination", "Fruity-smelling breath", "Sweating, shakiness, and confusion", "Deep, rapid breathing"],
      "correctAnswer": "Sweating, shakiness, and confusion",
      "difficulty": "moderate",
      "explanation": "Hypoglycemia triggers a sympathetic nervous system response (sweating, tachycardia, shakiness) and neuroglycopenic symptoms (confusion, irritability). Thirst and fruity breath are signs of hyperglycemia/DKA.",
      "type": "single"
    },
    {
      "question": "In the 'Stepwise Approach' to asthma management, what is typically the first-line 'controller' medication for persistent asthma?",
      "options": ["Oral Prednisolone", "Inhaled Low-dose Corticosteroids", "Theophylline tablets", "SABA as needed only"],
      "correctAnswer": "Inhaled Low-dose Corticosteroids",
      "difficulty": "moderate",
      "explanation": "For any level of persistent asthma (where symptoms occur more than twice a week), daily low-dose inhaled corticosteroids are the preferred maintenance therapy to prevent progression.",
      "type": "single"
    },
    {
      "question": "Which mechanism of action is associated with Ipratropium Bromide in the treatment of COPD and asthma?",
      "options": [
        "Beta-2 receptor stimulation",
        "Antagonism of muscarinic cholinergic receptors",
        "Inhibition of phosphodiesterase",
        "Stabilization of mast cell membranes"
      ],
      "correctAnswer": "Antagonism of muscarinic cholinergic receptors",
      "difficulty": "moderate",
      "explanation": "Ipratropium is an anticholinergic (antimuscarinic). It blocks the parasympathetic nerve signals that cause airway constriction and mucus secretion.",
      "type": "single"
    },
    {
      "question": "A patient with diabetes is also taking a non-selective beta-blocker for hypertension. Why is this combination concerning?",
      "options": [
        "Beta-blockers can cause severe hyperglycemia.",
        "Beta-blockers can mask the autonomic warning signs of hypoglycemia (like tachycardia).",
        "Beta-blockers prevent insulin from being absorbed.",
        "Beta-blockers increase the risk of diabetic foot ulcers."
      ],
      "correctAnswer": "Beta-blockers can mask the autonomic warning signs of hypoglycemia (like tachycardia).",
      "difficulty": "hard",
      "explanation": "Tachycardia is a key warning sign of low blood sugar. Since beta-blockers prevent the heart rate from rising, the patient may not realize their sugar is dangerously low until they lose consciousness.",
      "type": "single"
    },
    {
      "question": "Which diuretic is the first-line choice for treating pulmonary edema associated with acute heart failure?",
      "options": ["Hydrochlorothiazide", "Furosemide", "Triamterene", "Mannitol"],
      "correctAnswer": "Furosemide",
      "difficulty": "moderate",
      "explanation": "Furosemide is a potent loop diuretic. It has a rapid onset (especially IV) and can move large volumes of fluid quickly, which is necessary to clear fluid from the lungs.",
      "type": "single"
    },
    {
      "question": "What is the primary site of action for Loop Diuretics within the nephron?",
      "options": [
        "Proximal convoluted tubule",
        "Thick ascending limb of the Loop of Henle",
        "Distal convoluted tubule",
        "Collecting duct"
      ],
      "correctAnswer": "Thick ascending limb of the Loop of Henle",
      "difficulty": "moderate",
      "explanation": "Loop diuretics inhibit the Na+/K+/2Cl- symporter in the thick ascending limb. This is where about 25% of sodium is usually reabsorbed, making these the most 'efficacious' diuretics.",
      "type": "single"
    },
    {
      "question": "A patient on Amlodipine complains of swollen ankles. What is the pharmacological basis for this side effect?",
      "options": [
        "The drug causes the kidneys to retain sodium.",
        "The drug causes precapillary vasodilation, increasing capillary hydrostatic pressure.",
        "The drug causes an allergic reaction in the joints.",
        "The drug reduces the heart's ability to pump blood."
      ],
      "correctAnswer": "The drug causes precapillary vasodilation, increasing capillary hydrostatic pressure.",
      "difficulty": "hard",
      "explanation": "Calcium Channel Blockers (especially dihydropyridines) cause arterial dilation. This increases the pressure in the capillaries, forcing fluid into the surrounding tissues (peripheral edema). It is not caused by fluid overload.",
      "type": "single"
    },
    {
      "question": "Which of the following classes of antihypertensives is considered 'first-line' for a Black patient without chronic kidney disease, according to many guidelines?",
      "options": ["ACE Inhibitors", "Beta Blockers", "Calcium Channel Blockers or Thiazide Diuretics", "ARBs"],
      "correctAnswer": "Calcium Channel Blockers or Thiazide Diuretics",
      "difficulty": "moderate",
      "explanation": "Clinical trials have shown that Black patients often respond better to CCBs and Thiazides than to ACEIs or Beta Blockers when used as monotherapy for hypertension.",
      "type": "single"
    },
    {
      "question": "When administering Insulin NPH, the nurse should be aware that its peak action typically occurs at:",
      "options": ["30–60 minutes", "1–2 hours", "4–12 hours", "18–24 hours"],
      "correctAnswer": "4–12 hours",
      "difficulty": "moderate",
      "explanation": "NPH is an intermediate-acting insulin. Because it peaks between 4 and 12 hours after injection, this is the time when the patient is at the highest risk for a hypoglycemic episode.",
      "type": "single"
    },
    {
      "question": "Which of the following is a classic adverse effect of Alpha-1 Blockers (e.g., Prazosin) used for hypertension?",
      "options": ["First-dose orthostatic hypotension", "Hyperkalemia", "Dry cough", "Bradycardia"],
      "correctAnswer": "First-dose orthostatic hypotension",
      "difficulty": "moderate",
      "explanation": "Alpha-1 blockers cause significant venous and arterial dilation. This can lead to a dramatic drop in blood pressure when the patient stands up, especially after the very first dose.",
      "type": "single"
    },
    {
      "question": "A patient with diabetes is experiencing 'Kussmaul breathing' and has a blood glucose of 550 mg/dL. These are indicators of:",
      "options": ["Hypoglycemic shock", "Diabetic Ketoacidosis (DKA)", "Non-compliance with exercise", "Somogyi effect"],
      "correctAnswer": "Diabetic Ketoacidosis (DKA)",
      "difficulty": "moderate",
      "explanation": "Kussmaul breathing (deep, rapid respiration) is the body's attempt to blow off CO2 to compensate for metabolic acidosis in DKA. It is accompanied by extreme hyperglycemia.",
      "type": "single"
    },
    {
      "question": "In the context of diabetic therapy, what is the 'Somogyi Effect'?",
      "options": [
        "Hyperglycemia in the morning due to growth hormone release.",
        "Rebound hyperglycemia in the morning following an undetected hypoglycemic episode during the night.",
        "The inability of the body to absorb insulin from the gut.",
        "A skin reaction at the site of insulin injection."
      ],
      "correctAnswer": "Rebound hyperglycemia in the morning following an undetected hypoglycemic episode during the night.",
      "difficulty": "hard",
      "explanation": "When blood sugar drops too low at night, the body releases counter-regulatory hormones (epinephrine, cortisol) to raise it, resulting in high sugar levels by morning.",
      "type": "single"
    },
    {
      "question": "Which oral antidiabetic drug works by inhibiting the alpha-glucosidase enzyme in the small intestine?",
      "options": ["Acarbose", "Glimepiride", "Metformin", "Sitagliptin"],
      "correctAnswer": "Acarbose",
      "difficulty": "moderate",
      "explanation": "Acarbose slows down the breakdown of complex carbohydrates into glucose, thereby delaying glucose absorption and reducing post-prandial (after-meal) blood sugar spikes.",
      "type": "single"
    },
    {
      "question": "A patient is taking both Furosemide and Digoxin. Why is the nurse concerned about the patient's potassium level?",
      "options": [
        "Furosemide causes hyperkalemia, which blocks Digoxin.",
        "Hypokalemia (caused by Furosemide) increases the risk of Digoxin toxicity.",
        "Digoxin causes the kidneys to excrete more potassium.",
        "The two drugs neutralize each other in the blood."
      ],
      "correctAnswer": "Hypokalemia (caused by Furosemide) increases the risk of Digoxin toxicity.",
      "difficulty": "hard",
      "explanation": "Digoxin competes with potassium for binding sites on the Na+/K+ ATPase pump. If potassium levels are low, more Digoxin binds, leading to toxic effects even at 'normal' drug levels.",
      "type": "single"
    },
    {
      "question": "Which medication is an 'Inhaled Mast Cell Stabilizer' used for long-term asthma prevention, particularly in children?",
      "options": ["Cromolyn Sodium", "Salbutamol", "Ipratropium", "Prednisone"],
      "correctAnswer": "Cromolyn Sodium",
      "difficulty": "moderate",
      "explanation": "Cromolyn prevents mast cells from degranulating and releasing histamine and leukotrienes. It is only effective if used *before* exposure to an allergen or exercise.",
      "type": "single"
    },
    {
      "question": "The 'Rule of 15' for treating conscious patients with hypoglycemia involves:",
      "options": [
        "Giving 15 grams of fast-acting carbohydrate and rechecking in 15 minutes.",
        "Giving 15 units of insulin and waiting 15 minutes.",
        "Exercising for 15 minutes and drinking 15 oz of water.",
        "Calling 911 if the sugar is below 15 mg/dL."
      ],
      "correctAnswer": "Giving 15 grams of fast-acting carbohydrate and rechecking in 15 minutes.",
      "difficulty": "moderate",
      "explanation": "If the patient is conscious, 15g of simple carbs (like 4oz juice) is given. If sugar is still low after 15 minutes, the process is repeated.",
      "type": "situational"
    },
    {
      "question": "Which of the following medications is a Selective Beta-1 Blocker (Cardioselective)?",
      "options": ["Propranolol", "Atenolol", "Carvedilol", "Labetalol"],
      "correctAnswer": "Atenolol",
      "difficulty": "moderate",
      "explanation": "Atenolol and Metoprolol primarily target Beta-1 receptors in the heart. Propranolol is non-selective, and Carvedilol/Labetalol block both beta and alpha receptors.",
      "type": "single"
    },
    {
      "question": "A patient on long-term systemic Prednisone for asthma should be monitored for which of the following 'Cushingoid' side effects?",
      "options": ["Weight loss and hypoglycemia", "Osteoporosis, weight gain, and impaired wound healing", "Increased hair growth on the head and low blood pressure", "Excessive energy and improved sleep"],
      "correctAnswer": ["Osteoporosis, weight gain, and impaired wound healing"],
      "difficulty": "moderate",
      "explanation": "Chronic high-dose glucocorticoids lead to fat redistribution (moon face, buffalo hump), bone loss, skin thinning, and suppressed immune response.",
      "multiSelect": true,
      "type": "multiple"
    },
    {
      "question": "What is the primary danger of stopping Clonidine (a centrally acting alpha-2 agonist) abruptly?",
      "options": ["Sudden drop in blood sugar", "Rebound hypertensive crisis", "Severe diarrhea", "Permanent loss of taste"],
      "correctAnswer": "Rebound hypertensive crisis",
      "difficulty": "hard",
      "explanation": "Abrupt withdrawal of Clonidine can cause a massive surge in sympathetic activity, leading to dangerously high blood pressure, tachycardia, and tremors.",
      "type": "single"
    },
    {
      "question": "Which insulin should be drawn up *first* when mixing Regular and NPH insulin in the same syringe?",
      "options": ["NPH (Cloudy)", "Regular (Clear)", "It doesn't matter.", "They should never be mixed."],
      "correctAnswer": "Regular (Clear)",
      "difficulty": "moderate",
      "explanation": "The mnemonic 'Clear before Cloudy' ensures that the short-acting (Regular) insulin is not contaminated with the protein-containing NPH insulin, which would alter its onset.",
      "type": "ordering"
    },
    {
      "question": "A patient with asthma is prescribed Montelukast. The nurse should instruct the patient to take this medication:",
      "options": ["Once daily in the evening", "Only when they feel short of breath", "Every 4 hours during an attack", "Immediately before using their rescue inhaler"],
      "correctAnswer": "Once daily in the evening",
      "difficulty": "moderate",
      "explanation": "Montelukast is typically dosed once daily in the evening for asthma to help control nocturnal symptoms and maintain airway stability throughout the next day.",
      "type": "situational"
    },
    {
      "question": "Which electrolyte abnormality is a common side effect of ACE inhibitors and ARBs?",
      "options": ["Hyponatremia", "Hypokalemia", "Hyperkalemia", "Hypercalcemia"],
      "correctAnswer": "Hyperkalemia",
      "difficulty": "moderate",
      "explanation": "By reducing aldosterone (which normally promotes potassium excretion), ACE inhibitors and ARBs cause the body to retain potassium.",
      "type": "single"
    },
    {
      "question": "Which of the following is a symptom of Theophylline toxicity that affects the Gastrointestinal system?",
      "options": ["Constipation", "Nausea and Persistent Vomiting", "Increased appetite", "Jaundice"],
      "correctAnswer": "Nausea and Persistent Vomiting",
      "difficulty": "moderate",
      "explanation": "Nausea and vomiting are often the first signs of theophylline toxicity, followed by more severe neurological and cardiac symptoms.",
      "type": "single"
    },
    {
      "question": "A patient is prescribed both an Inhaled Bronchodilator and an Inhaled Corticosteroid. Which one should they use first?",
      "options": ["The corticosteroid first to reduce inflammation", "The bronchodilator first to open the airways", "Mix them together in the mouth", "It doesn't matter as long as both are used"],
      "correctAnswer": "The bronchodilator first to open the airways",
      "difficulty": "moderate",
      "explanation": "Using the bronchodilator first opens the bronchial tubes, allowing for deeper and more effective penetration of the corticosteroid into the lungs.",
      "type": "ordering"
    },
    {
      "question": "Glycated Hemoglobin (HbA1c) is used in diabetes management to monitor:",
      "options": ["The blood sugar at the exact moment of the test.", "The average blood glucose control over the past 2–3 months.", "The amount of insulin the pancreas is producing.", "The patient's risk of developing Type 1 diabetes."],
      "correctAnswer": "The average blood glucose control over the past 2–3 months.",
      "difficulty": "moderate",
      "explanation": "Glucose attaches to hemoglobin. Since red blood cells live for about 120 days, the A1c provides a long-term picture of glucose control rather than a single snapshot.",
      "type": "single"
    },
    {
      "question": "Which diuretic is often used to reduce intracranial pressure following a head injury?",
      "options": ["Furosemide", "Hydrochlorothiazide", "Mannitol", "Spironolactone"],
      "correctAnswer": "Mannitol",
      "difficulty": "moderate",
      "explanation": "Mannitol is an osmotic diuretic. It stays in the blood and 'pulls' fluid from the brain tissues into the vascular space by osmosis, which is then excreted by the kidneys.",
      "type": "single"
    },
    {
      "question": "What is a common side effect of Niacin (Vitamin B3) used for cholesterol that can be prevented by taking Aspirin 30 minutes before?",
      "options": ["Severe Diarrhea", "Facial Flushing", "Extreme Drowsiness", "Metallic Taste"],
      "correctAnswer": "Facial Flushing",
      "difficulty": "moderate",
      "explanation": "Niacin triggers prostaglandin release, causing vasodilation and flushing. Aspirin inhibits prostaglandin synthesis, reducing this uncomfortable effect.",
      "type": "single"
    },
    {
      "question": "A diabetic patient is 'found down' and unresponsive. Their blood sugar is 30 mg/dL. What is the appropriate emergency treatment?",
      "options": ["Give 4 oz of orange juice", "Administer 10 units of Regular insulin", "Administer IM Glucagon or IV Dextrose (D50)", "Wait for the patient to wake up before giving food"],
      "correctAnswer": "Administer IM Glucagon or IV Dextrose (D50)",
      "difficulty": "hard",
      "explanation": "If the patient is unconscious, they cannot swallow safely. Glucagon stimulates the liver to release stored glucose, and IV Dextrose provides immediate sugar.",
      "type": "situational"
    },
    {
      "question": "Which medication belongs to the SGLT2 inhibitor class, which lowers blood sugar by causing the kidneys to excrete glucose in the urine?",
      "options": ["Dapagliflozin", "Sitagliptin", "Exenatide", "Repaglinide"],
      "correctAnswer": "Dapagliflozin",
      "difficulty": "hard",
      "explanation": "SGLT2 inhibitors (the 'gliflozins') block glucose reabsorption in the proximal tubule of the kidney, resulting in glucosuria and lower blood sugar.",
      "type": "single"
    },
    {
      "question": "In hypertension treatment, what is meant by the 'Stepped Care' approach?",
      "options": [
        "Increasing the number of steps a patient walks daily.",
        "Starting with lifestyle modifications, then moving to single-drug therapy, and then adding more drugs if targets aren't met.",
        "Changing the medication every week to see which one works best.",
        "Giving the highest possible dose of one drug before trying another."
      ],
      "correctAnswer": "Starting with lifestyle modifications, then moving to single-drug therapy, and then adding more drugs if targets aren't met.",
      "difficulty": "moderate",
      "explanation": "Stepped care emphasizes a gradual escalation of treatment to achieve goal BP while minimizing side effects and costs.",
      "type": "single"
    }
  ],
    "Unit 4: Antiviral Drugs": [
    {
      "question": "What is the primary pharmacological distinction between Nucleoside Reverse Transcriptase Inhibitors (NRTIs) and Non-Nucleoside Reverse Transcriptase Inhibitors (NNRTIs)?",
      "options": [
        "NRTIs require intracellular phosphorylation to become active, whereas NNRTIs bind directly to the enzyme.",
        "NNRTIs act as competitive inhibitors of DNA polymerase, while NRTIs are non-competitive.",
        "NRTIs target the HIV protease enzyme, while NNRTIs target the integrase enzyme.",
        "NNRTIs are only effective against HIV-2, whereas NRTIs work only against HIV-1."
      ],
      "correctAnswer": "NRTIs require intracellular phosphorylation to become active, whereas NNRTIs bind directly to the enzyme.",
      "difficulty": "hard",
      "explanation": "NRTIs are prodrugs that must be triphosphorylated by host cell kinases to mimic natural deoxynucleotides and cause chain termination. NNRTIs bind to a specific hydrophobic pocket on the Reverse Transcriptase enzyme itself, causing a conformational change that stops its activity without needing activation.",
      "type": "single"
    },
    {
      "question": "A patient on Zidovudine (AZT) therapy presents with extreme fatigue and pallor. Which laboratory finding would be most consistent with a known dose-limiting toxicity of this drug?",
      "options": [
        "Elevated serum amylase and lipase",
        "Severe macrocytic anemia and granulocytopenia",
        "Peripheral neuropathy in the lower extremities",
        "Hyperbilirubinemia and jaundice"
      ],
      "correctAnswer": "Severe macrocytic anemia and granulocytopenia",
      "difficulty": "moderate",
      "explanation": "Zidovudine is notoriously associated with bone marrow suppression. This manifests as anemia (low red blood cells) and neutropenia/granulocytopenia (low white blood cells), requiring regular monitoring of the Complete Blood Count (CBC).",
      "type": "caseBased"
    },
    {
      "question": "Which of the following describes the 'Booster' effect of Ritonavir when used in combination with other Protease Inhibitors (PIs)?",
      "options": [
        "It increases the patient's appetite to prevent HIV-related wasting.",
        "It inhibits the CYP3A4 enzyme, thereby increasing the plasma concentration and half-life of the co-administered PI.",
        "It acts as a catalyst to help the other PI cross the blood-brain barrier.",
        "It stimulates the production of more CD4 cells directly."
      ],
      "correctAnswer": "It inhibits the CYP3A4 enzyme, thereby increasing the plasma concentration and half-life of the co-administered PI.",
      "difficulty": "hard",
      "explanation": "Ritonavir is a potent inhibitor of the cytochrome P450 3A4 enzyme. When given in low doses with other PIs (like Lopinavir), it 'boosts' their levels, allowing for lower doses and less frequent dosing of the primary drug.",
      "type": "single"
    },
    {
      "question": "Dolutegravir (DTG) belongs to which class of antiretroviral drugs?",
      "options": [
        "Integrase Strand Transfer Inhibitors (INSTIs)",
        "CCR5 Antagonists",
        "Protease Inhibitors",
        "Fusion Inhibitors"
      ],
      "correctAnswer": "Integrase Strand Transfer Inhibitors (INSTIs)",
      "difficulty": "moderate",
      "explanation": "Dolutegravir is an INSTI. It works by blocking the integrase enzyme, which HIV uses to insert its viral DNA into the host cell's genome. It is currently a cornerstone of first-line ART regimens.",
      "type": "single"
    },
    {
      "question": "Assertion (A): Tenofovir Disoproxil Fumarate (TDF) should be used with caution in patients with pre-existing renal disease.\nReason (R): TDF is known to cause proximal renal tubulopathy and a decline in Glomerular Filtration Rate (GFR).",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "hard",
      "explanation": "TDF is excreted by the kidneys and can cause nephrotoxicity, including Fanconi syndrome. Monitoring creatinine clearance and urine protein is essential for patients on Tenofovir-based regimens.",
      "type": "assertionReason"
    },
    {
      "question": "In the prevention of Mother-to-Child Transmission (PMTCT), when should antiretroviral therapy ideally be initiated for a pregnant woman diagnosed with HIV?",
      "options": [
        "Only after the first trimester to avoid birth defects",
        "Immediately upon diagnosis, regardless of the gestational age",
        "Only when the CD4 count drops below 350 cells/mm³",
        "Just before the onset of labor"
      ],
      "correctAnswer": "Immediately upon diagnosis, regardless of the gestational age",
      "difficulty": "moderate",
      "explanation": "Current 'Option B+' guidelines recommend that all pregnant and breastfeeding women living with HIV should initiate lifelong ART immediately upon diagnosis to protect their health and minimize the risk of transmission to the infant.",
      "type": "single"
    },
    {
      "question": "Which ARV drug is associated with a high risk of hypersensitivity reactions, specifically linked to the HLA-B*5701 genetic allele?",
      "options": [
        "Abacavir",
        "Lamivudine",
        "Efavirenz",
        "Atazanavir"
      ],
      "correctAnswer": "Abacavir",
      "difficulty": "hard",
      "explanation": "Abacavir hypersensitivity is a potentially fatal systemic reaction. Patients should ideally be screened for the HLA-B*5701 allele; if positive, Abacavir is strictly contraindicated.",
      "type": "single"
    },
    {
      "question": "A 30-year-old male on Efavirenz (EFV) complains of vivid dreams, dizziness, and feelings of depression shortly after starting the medication. What is the best clinical advice?",
      "options": [
        "Stop the medication immediately as these are signs of an allergic reaction.",
        "Take the medication at bedtime to minimize daytime CNS effects, and reassure him that these symptoms often resolve after a few weeks.",
        "Double the dose to get through the symptoms faster.",
        "Switch to an NRTI immediately without consulting a physician."
      ],
      "correctAnswer": "Take the medication at bedtime to minimize daytime CNS effects, and reassure him that these symptoms often resolve after a few weeks.",
      "difficulty": "moderate",
      "explanation": "Efavirenz is known for Neuropsychiatric side effects. Taking it on an empty stomach at bedtime helps. Most patients develop tolerance to these side effects within the first 2-4 weeks of therapy.",
      "type": "situational"
    },
    {
      "question": "What is the physiological target of the drug Maraviroc?",
      "options": [
        "The gp41 protein on the HIV envelope",
        "The CD4 receptor on the T-cell",
        "The CCR5 co-receptor on the host cell surface",
        "The CXCR4 co-receptor on the host cell surface"
      ],
      "correctAnswer": "The CCR5 co-receptor on the host cell surface",
      "difficulty": "hard",
      "explanation": "Maraviroc is an entry inhibitor (specifically a CCR5 antagonist). It prevents the HIV virus from attaching to the host cell by blocking the CCR5 co-receptor, but it only works against 'R5-tropic' strains of the virus.",
      "type": "single"
    },
    {
      "question": "Which of the following is the preferred first-line ART regimen for adults and adolescents in many national guidelines?",
      "options": [
        "TDF + 3TC + EFV",
        "TDF + 3TC + DTG",
        "AZT + 3TC + NVP",
        "ABC + 3TC + LPV/r"
      ],
      "correctAnswer": "TDF + 3TC + DTG",
      "difficulty": "moderate",
      "explanation": "Tenofovir (TDF), Lamivudine (3TC), and Dolutegravir (DTG) is the current preferred first-line regimen due to its high efficacy, high barrier to resistance, and better tolerability compared to Efavirenz-based regimens.",
      "type": "single"
    },
    {
      "question": "For a newborn with 'High Risk' HIV exposure, which prophylactic regimen is generally recommended?",
      "options": [
        "NVP only for 6 weeks",
        "AZT only for 6 weeks",
        "AZT (6 weeks) + NVP (at birth and then for 6-12 weeks)",
        "DTG + TDF + 3TC"
      ],
      "correctAnswer": "AZT (6 weeks) + NVP (at birth and then for 6-12 weeks)",
      "difficulty": "hard",
      "explanation": "High-risk infants (e.g., mothers with high viral loads or those who didn't receive ART) require dual prophylaxis (Zidovudine and Nevirapine) rather than the single-drug prophylaxis used for low-risk infants.",
      "type": "single"
    },
    {
      "question": "Lipodystrophy (redistribution of body fat) and metabolic abnormalities like insulin resistance and hyperlipidemia are most frequently associated with which class of ARVs?",
      "options": [
        "NRTIs",
        "NNRTIs",
        "Protease Inhibitors (PIs)",
        "Integrase Inhibitors (INSTIs)"
      ],
      "correctAnswer": "Protease Inhibitors (PIs)",
      "difficulty": "moderate",
      "explanation": "While several ARVs can contribute, Protease Inhibitors are classic causes of metabolic syndrome, including the 'buffalo hump' (fat accumulation) and thinning of limbs, along with elevated blood sugar and cholesterol.",
      "type": "single"
    },
    {
      "question": "Nevirapine (NVP) carries a 'Black Box Warning' for which of the following severe adverse effects during the first few weeks of therapy?",
      "options": [
        "Hepatotoxicity and severe skin reactions like Stevens-Johnson Syndrome (SJS)",
        "Acute renal failure",
        "Sudden cardiac arrest",
        "Permanent blindness"
      ],
      "correctAnswer": "Hepatotoxicity and severe skin reactions like Stevens-Johnson Syndrome (SJS)",
      "difficulty": "hard",
      "explanation": "NVP can cause life-threatening liver damage and skin rashes. This is why a 'lead-in' dose (once daily for 14 days) is used to monitor the patient before increasing to the full twice-daily dose.",
      "type": "single"
    },
    {
      "question": "What is the goal of 'Pre-Exposure Prophylaxis' (PrEP) for HIV-discordant couples?",
      "options": [
        "To cure the partner who is HIV-positive",
        "For the HIV-negative partner to take ARVs to reduce the risk of acquiring the virus",
        "To ensure the couple cannot have children",
        "To replace the need for condoms entirely"
      ],
      "correctAnswer": "For the HIV-negative partner to take ARVs to reduce the risk of acquiring the virus",
      "difficulty": "moderate",
      "explanation": "PrEP involves the HIV-negative individual taking ARVs (usually TDF/FTC) to maintain a protective level of drug in their system in case of exposure to the virus.",
      "type": "single"
    },
    {
      "question": "Why is Lamivudine (3TC) or Emtricitabine (FTC) almost always included in a 3-drug ART regimen?",
      "options": [
        "They are the strongest drugs available.",
        "They have a very high barrier to resistance.",
        "They are highly effective, well-tolerated, and also have activity against Hepatitis B.",
        "They prevent the other drugs from being metabolized by the liver."
      ],
      "correctAnswer": "They are highly effective, well-tolerated, and also have activity against Hepatitis B.",
      "difficulty": "moderate",
      "explanation": "3TC and FTC are cytosine analogues that are essential components of almost all regimens. Their dual activity against HBV makes them especially useful in co-infected patients.",
      "type": "single"
    },
    {
      "question": "The term 'Undetectable = Untransmittable' (U=U) refers to the fact that:",
      "options": [
        "The virus has been completely cured and removed from the body.",
        "A person with an undetectable viral load on ART cannot sexually transmit HIV to others.",
        "The HIV test will now show as 'Negative'.",
        "The person no longer needs to take their medication."
      ],
      "correctAnswer": "A person with an undetectable viral load on ART cannot sexually transmit HIV to others.",
      "difficulty": "moderate",
      "explanation": "When ART suppresses the viral load to undetectable levels in the blood, the risk of sexual transmission is effectively zero. This is a key public health message.",
      "type": "single"
    },
    {
      "question": "Which of the following describes the mechanism of action of HIV Protease Inhibitors?",
      "options": [
        "They prevent the virus from uncoating.",
        "They inhibit the enzyme that cleaves polyproteins into functional viral proteins, resulting in immature, non-infectious virions.",
        "They block the entry of HIV into the CD4 cell.",
        "They stop the transcription of RNA into DNA."
      ],
      "correctAnswer": "They inhibit the enzyme that cleaves polyproteins into functional viral proteins, resulting in immature, non-infectious virions.",
      "difficulty": "hard",
      "explanation": "HIV Protease is like 'scissors' that cuts long protein chains into the pieces needed to make a mature virus. Inhibiting this enzyme produces viral particles that cannot infect other cells.",
      "type": "single"
    },
    {
      "question": "Identify the error in this statement: 'Tenofovir should be avoided in patients with Hepatitis B co-infection because it worsens liver inflammation.'",
      "options": [
        "No error.",
        "Error: Tenofovir is actually a first-line treatment for both HIV and Hepatitis B.",
        "Error: Tenofovir only works against Hepatitis C.",
        "Error: Tenofovir is a Protease Inhibitor."
      ],
      "correctAnswer": "Error: Tenofovir is actually a first-line treatment for both HIV and Hepatitis B.",
      "difficulty": "hard",
      "explanation": "Tenofovir is highly effective against the HBV virus. In fact, if a co-infected patient stops Tenofovir, they may experience a severe flare-up of Hepatitis B.",
      "type": "errorIdentification"
    },
    {
      "question": "Which ARV is commonly used in pediatric 'granule' or 'syrup' formulations but requires a high fat intake for better absorption?",
      "options": [
        "Lopinavir/ritonavir (LPV/r)",
        "Tenofovir",
        "Lamivudine",
        "Nevirapine"
      ],
      "correctAnswer": "Lopinavir/ritonavir (LPV/r)",
      "difficulty": "moderate",
      "explanation": "LPV/r is frequently used in pediatric second-line or first-line regimens. The liquid and pellet forms often have specific dietary requirements or taste issues that affect adherence in children.",
      "type": "single"
    },
    {
      "question": "What is the most critical factor in preventing the development of drug-resistant HIV strains?",
      "options": [
        "Taking the medication with orange juice",
        "Maintaining >95% adherence to the prescribed ART schedule",
        "Eating a high-protein diet",
        "Avoiding all exercise"
      ],
      "correctAnswer": "Maintaining >95% adherence to the prescribed ART schedule",
      "difficulty": "moderate",
      "explanation": "HIV replicates rapidly and mutates easily. If drug levels drop due to missed doses, the virus can replicate in the presence of low drug concentrations, leading to the selection of resistant mutants.",
      "type": "single"
    },
    {
      "question": "Tenofovir Alafenamide (TAF) is often preferred over Tenofovir Disoproxil Fumarate (TDF) because:",
      "options": [
        "TAF is cheaper.",
        "TAF has lower rates of bone and kidney toxicity because it reaches higher intracellular concentrations with lower plasma levels.",
        "TAF is the only drug that works for HIV-2.",
        "TAF does not cause nausea."
      ],
      "correctAnswer": "TAF has lower rates of bone and kidney toxicity because it reaches higher intracellular concentrations with lower plasma levels.",
      "difficulty": "hard",
      "explanation": "TAF is a more targeted prodrug of Tenofovir. Because it delivers the active drug more efficiently into the target cells, much lower doses can be used, sparing the kidneys and bones from high systemic exposure.",
      "type": "single"
    },
    {
      "question": "A healthcare worker is splashed with HIV-positive blood. According to Post-Exposure Prophylaxis (PEP) protocols, how soon should ART be started?",
      "options": [
        "Within 72 hours, but ideally within 2 hours",
        "Wait 1 week to see if they test positive",
        "Only if they develop a fever",
        "Within 24 hours only if the patient has AIDS"
      ],
      "correctAnswer": "Within 72 hours, but ideally within 2 hours",
      "difficulty": "moderate",
      "explanation": "PEP is an emergency measure. Its effectiveness decreases with time. It must be started within 72 hours of exposure and continued for 28 days.",
      "type": "situational"
    },
    {
      "question": "Which of the following is a potential side effect of the NNRTI Etravirine?",
      "options": [
        "Severe rash",
        "Insulin resistance",
        "Kidney stones",
        "Metallic taste"
      ],
      "correctAnswer": "Severe rash",
      "difficulty": "moderate",
      "explanation": "Like other NNRTIs, Etravirine is associated with skin rashes, which can rarely progress to Stevens-Johnson Syndrome.",
      "type": "single"
    },
    {
      "question": "What is the specific role of 'Integrase' in the HIV life cycle?",
      "options": [
        "It cuts the viral proteins.",
        "It converts RNA to DNA.",
        "It hides the virus from the immune system.",
        "It integrates the viral DNA into the host cell's DNA."
      ],
      "correctAnswer": "It integrates the viral DNA into the host cell's DNA.",
      "difficulty": "easy",
      "explanation": "Integrase is the enzyme responsible for splicing the viral genetic material into the host cell's chromosomes, making the infection permanent.",
      "type": "single"
    },
    {
      "question": "A patient on Atazanavir (ATV) notices that the whites of their eyes have turned slightly yellow, but liver enzymes are normal. What is the most likely explanation?",
      "options": [
        "Acute viral Hepatitis",
        "Benign indirect hyperbilirubinemia, a common side effect of Atazanavir",
        "A sign that the drug is not working",
        "Severe drug-induced liver failure"
      ],
      "correctAnswer": "Benign indirect hyperbilirubinemia, a common side effect of Atazanavir",
      "difficulty": "hard",
      "explanation": "Atazanavir inhibits the UGT1A1 enzyme, which conjugates bilirubin. This leads to 'icterus' (yellow eyes) in many patients. While it looks concerning, it is usually harmless if liver function tests are otherwise normal.",
      "type": "caseBased"
    },
    {
      "question": "In the context of HIV, what does 'Viral Load' measure?",
      "options": [
        "The number of white blood cells in the body",
        "The number of copies of HIV RNA per milliliter of blood",
        "The weight of the patient",
        "The strength of the patient's immune system"
      ],
      "correctAnswer": "The number of copies of HIV RNA per milliliter of blood",
      "difficulty": "moderate",
      "explanation": "Viral load is the primary marker of how well ART is working. The goal of therapy is to reach 'undetectable' levels (usually <50 copies/ml).",
      "type": "single"
    },
    {
      "question": "Which of the following describes the mechanism of the Fusion Inhibitor Enfuvirtide?",
      "options": [
        "It blocks the CD4 receptor.",
        "It binds to the gp41 subunit of the viral envelope, preventing the virus from fusing with the host cell membrane.",
        "It is taken orally once a week.",
        "It inhibits reverse transcriptase."
      ],
      "correctAnswer": "It binds to the gp41 subunit of the viral envelope, preventing the virus from fusing with the host cell membrane.",
      "difficulty": "hard",
      "explanation": "Enfuvirtide (T-20) is a large peptide that must be injected subcutaneously. It blocks the structural change in the viral envelope needed for fusion with the host cell.",
      "type": "single"
    },
    {
      "question": "What is 'Immune Reconstitution Inflammatory Syndrome' (IRIS)?",
      "options": [
        "An allergic reaction to all ARV drugs.",
        "A paradoxical worsening of a pre-existing infection as the immune system recovers and begins to fight it after starting ART.",
        "The complete failure of the immune system.",
        "A side effect that causes the patient to lose weight rapidly."
      ],
      "correctAnswer": "A paradoxical worsening of a pre-existing infection as the immune system recovers and begins to fight it after starting ART.",
      "difficulty": "hard",
      "explanation": "As ART suppresses the virus and CD4 counts rise, the 'reborn' immune system may overreact to hidden infections (like TB or Cryptococcus), causing intense inflammation and worsening symptoms.",
      "type": "single"
    },
    {
      "question": "Which NNRTI is known for being 'second-generation' and having a higher barrier to resistance than Efavirenz or Nevirapine?",
      "options": [
        "Etravirine",
        "Delavirdine",
        "Lamivudine",
        "Zidovudine"
      ],
      "correctAnswer": "Etravirine",
      "difficulty": "moderate",
      "explanation": "Etravirine was designed to be effective against HIV strains that have already developed resistance to the first-generation NNRTIs (EFV and NVP).",
      "type": "single"
    },
    {
      "question": "A patient is prescribed the 'Fixed-Dose Combination' TLD. What drugs does this contain?",
      "options": [
        "Tenofovir, Lamivudine, Dolutegravir",
        "Tenofovir, Lopinavir, Darunavir",
        "Zidovudine, Lamivudine, Dolutegravir",
        "Tenofovir, Lamivudine, Efavirenz"
      ],
      "correctAnswer": "Tenofovir, Lamivudine, Dolutegravir",
      "difficulty": "moderate",
      "explanation": "TLD is the standard single-pill, once-a-day regimen used in many global health programs for first-line HIV treatment.",
      "type": "single"
    },
    {
      "question": "Which of the following statements about ART in children is TRUE?",
      "options": [
        "Children use the exact same dosages as adults.",
        "Drug doses in children must be frequently adjusted based on weight or body surface area as the child grows.",
        "Children only need one drug for treatment.",
        "ART is not recommended for children under 5 years old."
      ],
      "correctAnswer": "Drug doses in children must be frequently adjusted based on weight or body surface area as the child grows.",
      "difficulty": "moderate",
      "explanation": "Because children grow rapidly, their metabolism and weight change. Under-dosing due to growth can lead to treatment failure and drug resistance.",
      "type": "single"
    },
    {
      "question": "Protease Inhibitors are often associated with which 'confusing' drug-drug interaction?",
      "options": [
        "They make all other drugs stop working.",
        "They are potent inhibitors of liver enzymes (CYP450), which can lead to dangerously high levels of other medications.",
        "They cause the body to excrete all vitamins.",
        "They cannot be taken with water."
      ],
      "correctAnswer": "They are potent inhibitors of liver enzymes (CYP450), which can lead to dangerously high levels of other medications.",
      "difficulty": "hard",
      "explanation": "Many PIs, especially Ritonavir, block the enzymes that break down other drugs (like certain statins, sedatives, or blood thinners), potentially leading to toxicity.",
      "type": "single"
    },
    {
      "question": "What is the primary reason for using multiple classes of drugs (Combination Therapy) in ART?",
      "options": [
        "To make the treatment more expensive",
        "To attack the virus at different stages of its life cycle and prevent the development of drug resistance",
        "Because one drug is never strong enough to kill a single virus",
        "To allow the patient to skip doses occasionally"
      ],
      "correctAnswer": "To attack the virus at different stages of its life cycle and prevent the development of drug resistance",
      "difficulty": "moderate",
      "explanation": "Using drugs from different classes (e.g., 2 NRTIs + 1 INSTI) makes it much harder for the virus to develop all the mutations necessary to become resistant to the entire regimen simultaneously.",
      "type": "single"
    },
    {
      "question": "A pregnant woman on ART delivers a baby. What is the standard duration for the infant's ARV prophylaxis in most settings?",
      "options": [
        "Until the baby is 18 years old",
        "6 weeks",
        "24 hours",
        "1 year"
      ],
      "correctAnswer": "6 weeks",
      "difficulty": "moderate",
      "explanation": "In standard 'low-risk' scenarios where the mother is virally suppressed, the infant receives prophylaxis (usually NVP or AZT) for 6 weeks to prevent transmission during and immediately after birth.",
      "type": "single"
    },
    {
      "question": "Which of the following NRTIs is also used in the treatment of chronic Hepatitis B?",
      "options": [
        "Tenofovir and Lamivudine",
        "Zidovudine and Stavudine",
        "Abacavir and Didanosine",
        "Efavirenz and Nevirapine"
      ],
      "correctAnswer": "Tenofovir and Lamivudine",
      "difficulty": "moderate",
      "explanation": "Both Tenofovir and Lamivudine have potent activity against the Hepatitis B virus polymerase, making them ideal for patients co-infected with HIV and HBV.",
      "type": "single"
    },
    {
      "question": "Identify the 'Integrase Inhibitor' from the following list:",
      "options": [
        "Raltegravir",
        "Darunavir",
        "Rilpivirine",
        "Stavudine"
      ],
      "correctAnswer": "Raltegravir",
      "difficulty": "moderate",
      "explanation": "Raltegravir was the first INSTI approved for HIV treatment. Darunavir is a PI, Rilpivirine is an NNRTI, and Stavudine is an NRTI.",
      "type": "single"
    },
    {
      "question": "What is the recommended timing for checking the first viral load after a patient starts a new ART regimen?",
      "options": [
        "After 2 days",
        "After 6 months",
        "After 5 years",
        "Every week"
      ],
      "correctAnswer": "After 6 months",
      "difficulty": "moderate",
      "explanation": "In most guidelines, the first viral load check occurs 6 months after initiation to confirm that the patient has reached viral suppression.",
      "type": "single"
    },
    {
      "question": "Which condition is a significant concern for HIV-positive individuals who are also heavy smokers?",
      "options": [
        "Increased risk of ARV drug-drug interactions with tobacco",
        "Higher risk of cardiovascular disease and lung cancer, which is already elevated in HIV",
        "Smoking makes the ARVs turn purple",
        "Smoking prevents the CD4 cells from moving"
      ],
      "correctAnswer": "Higher risk of cardiovascular disease and lung cancer, which is already elevated in HIV",
      "difficulty": "moderate",
      "explanation": "Chronic inflammation from HIV and side effects from some ARVs already increase cardiovascular risk. Smoking compounds this risk significantly.",
      "type": "single"
    },
    {
      "question": "Which of the following is a symptom of Zidovudine-induced myopathy?",
      "options": [
        "Muscle weakness and pain, particularly in the proximal muscles",
        "Increased muscle strength",
        "Sudden loss of hair",
        "Bright blue urine"
      ],
      "correctAnswer": "Muscle weakness and pain, particularly in the proximal muscles",
      "difficulty": "hard",
      "explanation": "Zidovudine can cause mitochondrial toxicity, leading to a condition called myopathy, characterized by muscle wasting and weakness.",
      "type": "single"
    },
    {
      "question": "In the 'Life Cycle' of HIV, when does the process of 'Budding' occur?",
      "options": [
        "At the very beginning, when the virus enters the cell.",
        "After the new viral RNA and proteins move to the cell surface and a new virus forms and leaves the cell.",
        "When the RNA is turned into DNA.",
        "When the virus is killed by the immune system."
      ],
      "correctAnswer": "After the new viral RNA and proteins move to the cell surface and a new virus forms and leaves the cell.",
      "difficulty": "moderate",
      "explanation": "Budding is the final stage where the newly assembled virus pushes out from the host cell membrane, taking a piece of the membrane with it to form its own envelope.",
      "type": "single"
    },
    {
      "question": "Which ARV is most likely to cause 'Kidney Stones' (nephrolithiasis) if the patient does not drink enough water?",
      "options": [
        "Indinavir",
        "Lamivudine",
        "Efavirenz",
        "Dolutegravir"
      ],
      "correctAnswer": "Indinavir",
      "difficulty": "hard",
      "explanation": "Indinavir (a PI) can crystallize in the urinary tract. Patients are advised to drink at least 1.5 to 2 liters of water daily to prevent stone formation.",
      "type": "single"
    },
    {
      "question": "What is 'Salvage Therapy' in the context of HIV treatment?",
      "options": [
        "Treatment for patients who have been in a shipwreck.",
        "A regimen for patients who have developed resistance to multiple standard ARV classes.",
        "The first time a patient ever takes a pill.",
        "A way to clean the blood using filters."
      ],
      "correctAnswer": "A regimen for patients who have developed resistance to multiple standard ARV classes.",
      "difficulty": "moderate",
      "explanation": "When first and second-line treatments fail due to resistance, 'salvage' or 'third-line' therapy uses newer or less common drugs to try and regain viral suppression.",
      "type": "single"
    },
    {
      "question": "Select all the NRTI drugs from the following list:",
      "options": [
        "Stavudine (d4T)",
        "Didanosine (ddI)",
        "Efavirenz (EFV)",
        "Darunavir (DRV)"
      ],
      "correctAnswer": ["Stavudine (d4T)", "Didanosine (ddI)"],
      "difficulty": "moderate",
      "explanation": "Stavudine and Didanosine are older NRTIs. Efavirenz is an NNRTI and Darunavir is a PI.",
      "multiSelect": true,
      "type": "multiple"
    },
    {
      "question": "Lactic Acidosis and hepatic steatosis (fatty liver) are rare but severe 'class side effects' associated with which group of drugs?",
      "options": [
        "NRTIs",
        "NNRTIs",
        "PIs",
        "INSTIs"
      ],
      "correctAnswer": "NRTIs",
      "difficulty": "hard",
      "explanation": "This is due to mitochondrial toxicity caused by NRTIs, especially older ones like Stavudine (d4T) and Didanosine (ddI). It is a medical emergency.",
      "type": "single"
    },
    {
      "question": "Which drug is often used for PEP (Post-Exposure Prophylaxis) in a 3-drug combination?",
      "options": [
        "TDF + 3TC (or FTC) + DTG (or Raltegravir)",
        "Aspirin + Vitamin C + Calcium",
        "NVP + EFV + ABC",
        "Only one dose of NVP"
      ],
      "correctAnswer": "TDF + 3TC (or FTC) + DTG (or Raltegravir)",
      "difficulty": "moderate",
      "explanation": "Modern PEP regimens use the same potent 3-drug combinations used for treatment to ensure the highest chance of preventing infection after exposure.",
      "type": "single"
    },
    {
      "question": "A patient on ART presents with a 'Moon Face' and a 'Buffalo Hump'. Which drug class is the most likely culprit?",
      "options": [
        "NRTIs",
        "NNRTIs",
        "Protease Inhibitors",
        "Fusion Inhibitors"
      ],
      "correctAnswer": "Protease Inhibitors",
      "difficulty": "moderate",
      "explanation": "These are classic signs of lipodystrophy (abnormal fat distribution) associated with Protease Inhibitors.",
      "type": "caseBased"
    },
    {
      "question": "What happens if a patient on Efavirenz eats a very high-fat meal before taking their dose?",
      "options": [
        "The drug will not be absorbed at all.",
        "The absorption increases significantly, which can lead to increased toxicity and CNS side effects.",
        "The fat neutralizes the drug.",
        "The patient will lose weight."
      ],
      "correctAnswer": "The absorption increases significantly, which can lead to increased toxicity and CNS side effects.",
      "difficulty": "hard",
      "explanation": "Fat increases Efavirenz levels in the blood. This is why it is strictly recommended to take Efavirenz on an empty stomach to avoid severe dizziness and confusion.",
      "type": "single"
    },
    {
      "question": "Which ARV is a liquid that should be stored in the refrigerator in most tropical climates to maintain stability?",
      "options": [
        "Ritonavir (Norvir) capsules or solution",
        "Tenofovir tablets",
        "Efavirenz capsules",
        "Abacavir tablets"
      ],
      "correctAnswer": "Ritonavir (Norvir) capsules or solution",
      "difficulty": "moderate",
      "explanation": "Some formulations of Ritonavir are heat-sensitive and require cold chain storage to remain effective.",
      "type": "single"
    },
    {
      "question": "The 'Eclipse Phase' of HIV infection refers to:",
      "options": [
        "When the moon covers the sun.",
        "The period immediately after infection when the virus is replicating but cannot yet be detected in the blood.",
        "When the patient feels perfectly healthy.",
        "The final stage of AIDS."
      ],
      "correctAnswer": "The period immediately after infection when the virus is replicating but cannot yet be detected in the blood.",
      "difficulty": "hard",
      "explanation": "During this early time (approx. 7-10 days), the virus is spreading through the lymph nodes but hasn't reached levels detectable by standard viral load tests.",
      "type": "single"
    },
    {
      "question": "Why is the use of 'Monotherapy' (using only one ARV) strictly forbidden in the treatment of HIV infection?",
      "options": [
        "Because it is too cheap.",
        "Because the virus will quickly develop resistance to that single drug, making it useless.",
        "Because the patient will get lonely taking only one pill.",
        "Because one drug causes more side effects than three."
      ],
      "correctAnswer": "Because the virus will quickly develop resistance to that single drug, making it useless.",
      "difficulty": "easy",
      "explanation": "Monotherapy is the fastest way to create drug-resistant HIV. Three drugs from at least two different classes are required to successfully suppress the virus long-term.",
      "type": "single"
    },
    {
      "question": "Correctly order the steps of the HIV Life Cycle:",
      "options": [
        "1. Integration, 2. Binding, 3. Budding, 4. Reverse Transcription",
        "1. Binding, 2. Reverse Transcription, 3. Integration, 4. Budding",
        "1. Budding, 2. Integration, 3. Binding, 4. Reverse Transcription",
        "1. Reverse Transcription, 2. Binding, 3. Integration, 4. Budding"
      ],
      "orderCorrect": ["Binding", "Reverse Transcription", "Integration", "Budding"],
      "difficulty": "moderate",
      "explanation": "The virus first binds to the cell, converts its RNA to DNA, integrates into the host genome, and finally buds off to form new viruses.",
      "type": "ordering"
    }
  ],
    "PHARMACOLOGY S6 ANP Comprehensive Review Quiz Units 1 - 4 (GI, NCDs, and Antivirals)": [
    {
      "question": "Which of the following describes the 'First-Pass Effect' in pharmacology?",
      "options": [
        "The rapid distribution of a drug to the brain after injection",
        "The metabolism of a drug by the liver before it reaches systemic circulation",
        "The initial binding of a drug to plasma albumin",
        "The excretion of drug metabolites through the kidneys on the first cycle"
      ],
      "correctAnswer": "The metabolism of a drug by the liver before it reaches systemic circulation",
      "difficulty": "moderate",
      "explanation": "Orally administered drugs are absorbed from the GI tract into the portal vein and travel to the liver. Some drugs are extensively metabolized here, reducing the amount of active drug that reaches the rest of the body.",
      "type": "single"
    },
    {
      "question": "A patient taking Warfarin is prescribed Cimetidine for heartburn. What is the most likely clinical outcome of this interaction?",
      "options": [
        "Decreased effectiveness of Warfarin and risk of blood clots",
        "Increased plasma levels of Warfarin and increased risk of bleeding",
        "Neutralization of Cimetidine's acid-blocking properties",
        "Delayed absorption of both drugs due to gastric pH changes"
      ],
      "correctAnswer": "Increased plasma levels of Warfarin and increased risk of bleeding",
      "difficulty": "hard",
      "explanation": "Cimetidine is a potent inhibitor of the Cytochrome P450 enzyme system. Since Warfarin is metabolized by these enzymes, Cimetidine slows its breakdown, leading to toxic levels and potential hemorrhage.",
      "type": "single"
    },
    {
      "question": "Why is the use of Magnesium Hydroxide contraindicated in patients with severe chronic kidney disease?",
      "options": [
        "It causes severe metabolic acidosis.",
        "Magnesium accumulation can lead to CNS depression and cardiac arrhythmias.",
        "It prevents the kidneys from secreting erythropoietin.",
        "It causes the formation of kidney stones containing magnesium."
      ],
      "correctAnswer": "Magnesium accumulation can lead to CNS depression and cardiac arrhythmias.",
      "difficulty": "moderate",
      "explanation": "The kidneys are responsible for magnesium excretion. In renal failure, magnesium levels can rise dangerously (hypermagnesemia), causing muscle weakness, hypotension, and bradycardia.",
      "type": "single"
    },
    {
      "question": "Which specific mechanism allows Omeprazole to provide longer-lasting acid suppression compared to Famotidine?",
      "options": [
        "It has a longer plasma half-life of 24 hours.",
        "It binds irreversibly to the H+/K+ ATPase pump, requiring new enzyme synthesis.",
        "It acts as a competitive antagonist, which is harder to displace.",
        "It stimulates the production of more protective mucus in the stomach."
      ],
      "correctAnswer": "It binds irreversibly to the H+/K+ ATPase pump, requiring new enzyme synthesis.",
      "difficulty": "hard",
      "explanation": "PPIs like Omeprazole permanently 'shut down' the proton pump. Even though the drug leaves the blood quickly, the effect lasts until the parietal cell produces new pumps, which takes 24-48 hours.",
      "type": "single"
    },
    {
      "question": "A patient is prescribed Misoprostol alongside an NSAID. What is the primary reason for this combination?",
      "options": [
        "To increase the analgesic effect of the NSAID",
        "To prevent NSAID-induced gastric mucosal injury by replacing prostaglandins",
        "To reduce the risk of NSAID-induced renal failure",
        "To prevent the patient from developing a cough"
      ],
      "correctAnswer": "To prevent NSAID-induced gastric mucosal injury by replacing prostaglandins",
      "difficulty": "moderate",
      "explanation": "NSAIDs inhibit COX enzymes, reducing protective prostaglandins in the stomach. Misoprostol is a synthetic prostaglandin E1 analog that restores this protection.",
      "type": "single"
    },
    {
      "question": "Which of the following antiemetics is a 5-HT3 receptor antagonist most suitable for a patient undergoing highly emetogenic chemotherapy?",
      "options": ["Metoclopramide", "Promethazine", "Ondansetron", "Dicyclomine"],
      "correctAnswer": "Ondansetron",
      "difficulty": "moderate",
      "explanation": "Ondansetron blocks serotonin receptors in the CTZ and on the vagal nerve, making it extremely effective for chemotherapy-induced nausea and vomiting (CINV).",
      "type": "single"
    },
    {
      "question": "Metoclopramide (Reglan) acts as a prokinetic agent. What is its effect on the Lower Esophageal Sphincter (LES)?",
      "options": [
        "It relaxes the LES to allow food to pass into the stomach.",
        "It increases the tone/pressure of the LES to prevent gastric reflux.",
        "It has no effect on the LES.",
        "It causes the LES to spasm, slowing down digestion."
      ],
      "correctAnswer": "It increases the tone/pressure of the LES to prevent gastric reflux.",
      "difficulty": "hard",
      "explanation": "By increasing LES tone and stimulating upper GI motility, Metoclopramide helps prevent reflux and hastens gastric emptying.",
      "type": "single"
    },
    {
      "question": "A patient with a suspected bowel obstruction should NOT receive which of the following?",
      "options": ["Intravenous fluids", "Bisacodyl", "Nasogastric suction", "Pain management"],
      "correctAnswer": "Bisacodyl",
      "difficulty": "moderate",
      "explanation": "Bisacodyl is a stimulant laxative. If the bowel is obstructed, stimulating peristalsis can lead to severe pain, vomiting, or bowel perforation.",
      "type": "single"
    },
    {
      "question": "What is the primary rationale for including Potassium Chloride in Oral Rehydration Salts (ORS)?",
      "options": [
        "To make the solution taste better",
        "To replace the potassium lost through stool during diarrhea",
        "To help the glucose cross the intestinal wall",
        "To prevent the solution from becoming contaminated"
      ],
      "correctAnswer": "To replace the potassium lost through stool during diarrhea",
      "difficulty": "moderate",
      "explanation": "Diarrheal stools contain high concentrations of potassium. Replacing it prevents hypokalemia, which can cause muscle weakness and heart rhythm issues.",
      "type": "single"
    },
    {
      "question": "In the treatment of H. pylori, what is the role of Clarithromycin?",
      "options": [
        "To neutralize stomach acid",
        "To provide a protective coating over the ulcer",
        "To inhibit bacterial protein synthesis and eradicate the infection",
        "To decrease the production of gastrin"
      ],
      "correctAnswer": "To inhibit bacterial protein synthesis and eradicate the infection",
      "difficulty": "moderate",
      "explanation": "Clarithromycin is a macrolide antibiotic used in 'triple therapy' to kill the H. pylori bacteria responsible for the ulcer.",
      "type": "single"
    },
    {
      "question": "Which of the following describes the mechanism of action of Loop Diuretics like Furosemide?",
      "options": [
        "Inhibition of the Na+/Cl- symporter in the distal tubule",
        "Inhibition of the Na+/K+/2Cl- symporter in the ascending limb of the Loop of Henle",
        "Antagonism of aldosterone receptors in the collecting duct",
        "Osmotic pull of water in the proximal tubule"
      ],
      "correctAnswer": "Inhibition of the Na+/K+/2Cl- symporter in the ascending limb of the Loop of Henle",
      "difficulty": "moderate",
      "explanation": "Loop diuretics block the reabsorption of sodium, potassium, and chloride in the thick ascending limb, leading to powerful diuresis.",
      "type": "single"
    },
    {
      "question": "A patient on Spironolactone is found to have a serum potassium level of 6.2 mEq/L. Which EKG change is most characteristic of this condition?",
      "options": ["Prominent U waves", "Tall, peaked T waves", "ST-segment depression", "Shortened PR interval"],
      "correctAnswer": "Tall, peaked T waves",
      "difficulty": "hard",
      "explanation": "Hyperkalemia (>5.0 mEq/L) typically manifests on an EKG as tall, peaked T waves, followed by widening of the QRS and loss of P waves as levels rise.",
      "type": "single"
    },
    {
      "question": "How do ACE inhibitors like Lisinopril lower blood pressure?",
      "options": [
        "By blocking the binding of Angiotensin II to its receptor",
        "By preventing the conversion of Angiotensin I to the vasoconstrictor Angiotensin II",
        "By decreasing the heart rate and force of contraction",
        "By directly dilating the veins to reduce preload"
      ],
      "correctAnswer": "By preventing the conversion of Angiotensin I to the vasoconstrictor Angiotensin II",
      "difficulty": "moderate",
      "explanation": "ACE inhibitors block the Angiotensin-Converting Enzyme, leading to lower Angiotensin II levels (vasodilation) and lower Aldosterone levels (less sodium/water retention).",
      "type": "single"
    },
    {
      "question": "Which medication is specifically used as a 'Rescue Inhaler' during an acute asthma exacerbation?",
      "options": ["Salmeterol", "Fluticasone", "Salbutamol", "Montelukast"],
      "correctAnswer": "Salbutamol",
      "difficulty": "moderate",
      "explanation": "Salbutamol (Albuterol) is a short-acting beta-2 agonist (SABA) with a rapid onset, making it the drug of choice for acute bronchospasm.",
      "type": "single"
    },
    {
      "question": "What is the primary mechanism of action of Metformin in Type 2 Diabetes?",
      "options": [
        "Increasing insulin secretion from pancreatic beta cells",
        "Decreasing hepatic glucose production and increasing insulin sensitivity",
        "Slowing the absorption of carbohydrates in the gut",
        "Excreting glucose through the urine"
      ],
      "correctAnswer": "Decreasing hepatic glucose production and increasing insulin sensitivity",
      "difficulty": "moderate",
      "explanation": "Metformin reduces the amount of glucose the liver makes and helps peripheral tissues use insulin more effectively without causing hypoglycemia.",
      "type": "single"
    },
    {
      "question": "A patient with Type 1 Diabetes is found unconscious with a blood glucose of 28 mg/dL. If IV access is unavailable, which medication should be administered IM?",
      "options": ["Regular Insulin", "Glucagon", "Normal Saline", "Dextrose 5%"],
      "correctAnswer": "Glucagon",
      "difficulty": "moderate",
      "explanation": "IM Glucagon stimulates the liver to convert stored glycogen into glucose, raising blood sugar rapidly in emergency situations.",
      "type": "situational"
    },
    {
      "question": "Which class of ARVs requires the drug to be triphosphorylated by cellular enzymes to become active?",
      "options": ["NRTIs", "NNRTIs", "Protease Inhibitors", "Integrase Inhibitors"],
      "correctAnswer": "NRTIs",
      "difficulty": "hard",
      "explanation": "Nucleoside Reverse Transcriptase Inhibitors (NRTIs) are prodrugs that mimic natural nucleotides; they must be phosphorylated by the host cell's kinases to inhibit viral DNA synthesis.",
      "type": "single"
    },
    {
      "question": "A patient on Zidovudine (AZT) therapy reports severe weakness. Lab results show a Hemoglobin of 7.2 g/dL. What is the pharmacological cause?",
      "options": [
        "Drug-induced hemolysis",
        "Bone marrow suppression causing macrocytic anemia",
        "Blood loss from GI irritation",
        "Inhibition of iron absorption"
      ],
      "correctAnswer": "Bone marrow suppression causing macrocytic anemia",
      "difficulty": "hard",
      "explanation": "AZT is well known for its hematological toxicity, particularly anemia and neutropenia, due to its effect on bone marrow progenitor cells.",
      "type": "caseBased"
    },
    {
      "question": "What is the 'Lead-in' period when starting Nevirapine (NVP) designed to prevent?",
      "options": [
        "Immediate drug resistance",
        "Severe skin rash and hepatotoxicity",
        "Gastrointestinal upset",
        "Insomnia"
      ],
      "correctAnswer": "Severe skin rash and hepatotoxicity",
      "difficulty": "moderate",
      "explanation": "NVP is started at a lower dose for 14 days. If no severe rash or liver issues occur, the dose is increased. This reduces the incidence of Stevens-Johnson Syndrome.",
      "type": "single"
    },
    {
      "question": "Which of the following is a symptom of 'Lactic Acidosis,' a rare but fatal side effect of NRTIs?",
      "options": [
        "Hyperactivity and insomnia",
        "Abdominal pain, nausea, and deep/rapid breathing (Kussmaul breathing)",
        "Sudden weight gain and edema",
        "Severe itching and hives"
      ],
      "correctAnswer": "Abdominal pain, nausea, and deep/rapid breathing (Kussmaul breathing)",
      "difficulty": "hard",
      "explanation": "Lactic acidosis results from mitochondrial toxicity. The body attempts to compensate for the acidic pH by blowing off CO2 through rapid, deep breathing.",
      "type": "single"
    },
    {
      "question": "The 'Peak' of NPH insulin (intermediate-acting) typically occurs at what time after injection?",
      "options": ["30-60 minutes", "1-2 hours", "4-12 hours", "18-24 hours"],
      "correctAnswer": "4-12 hours",
      "difficulty": "moderate",
      "explanation": "NPH peaks between 4 and 12 hours. This is the period when the patient is at the highest risk for hypoglycemia and should ideally have a snack.",
      "type": "single"
    },
    {
      "question": "Amlodipine, a Calcium Channel Blocker, is most likely to cause which of the following side effects?",
      "options": ["Dry cough", "Peripheral edema (swollen ankles)", "Hypokalemia", "Hyperglycemia"],
      "correctAnswer": "Peripheral edema (swollen ankles)",
      "difficulty": "moderate",
      "explanation": "Dihydropyridine CCBs cause arterial vasodilation, which increases capillary hydrostatic pressure and leads to fluid leaking into the tissues of the lower extremities.",
      "type": "single"
    },
    {
      "question": "Why is it dangerous to give an asthmatic patient a non-selective beta-blocker like Propranolol?",
      "options": [
        "It will cause their blood pressure to drop too low.",
        "It will block Beta-2 receptors in the lungs, causing bronchoconstriction.",
        "It will increase the heart rate excessively.",
        "It will make the asthma inhalers stop being absorbed."
      ],
      "correctAnswer": "It will block Beta-2 receptors in the lungs, causing bronchoconstriction.",
      "difficulty": "moderate",
      "explanation": "Beta-2 receptors are responsible for bronchodilation. Propranolol blocks these, which can trigger a severe, potentially fatal asthma attack.",
      "type": "single"
    },
    {
      "question": "Which ARV drug is an Integrase Strand Transfer Inhibitor (INSTI)?",
      "options": ["Dolutegravir", "Efavirenz", "Atazanavir", "Tenofovir"],
      "correctAnswer": "Dolutegravir",
      "difficulty": "moderate",
      "explanation": "Dolutegravir (DTG) prevents the HIV DNA from being integrated into the host cell's DNA. It is a key component of modern TLD therapy.",
      "type": "single"
    },
    {
      "question": "A patient with hypertension and heart failure is prescribed Enalapril. What should the nurse monitor most closely during the first few days of therapy?",
      "options": ["Blood sugar", "Serum potassium and blood pressure", "Hearing acuity", "Liver enzymes"],
      "correctAnswer": "Serum potassium and blood pressure",
      "difficulty": "moderate",
      "explanation": "ACE inhibitors can cause 'first-dose hypotension' and hyperkalemia (due to reduced aldosterone).",
      "type": "situational"
    },
    {
      "question": "What is the primary action of the 'sulfonylurea' class of drugs (e.g., Glibenclamide)?",
      "options": [
        "To prevent the kidneys from reabsorbing glucose",
        "To stimulate the pancreas to secrete more insulin",
        "To block the absorption of fat in the gut",
        "To decrease the body's need for insulin"
      ],
      "correctAnswer": "To stimulate the pancreas to secrete more insulin",
      "difficulty": "moderate",
      "explanation": "Sulfonylureas are 'insulin secretagogues.' They bind to ATP-sensitive potassium channels on beta cells, causing them to release more insulin.",
      "type": "single"
    },
    {
      "question": "Which of the following is an 'Osmotic Laxative' that is also used to treat hepatic encephalopathy?",
      "options": ["Lactulose", "Bisacodyl", "Psyllium", "Castor oil"],
      "correctAnswer": "Lactulose",
      "difficulty": "hard",
      "explanation": "Lactulose draws water into the colon (osmotic effect) and also traps ammonia in the gut, helping to lower blood ammonia levels in liver failure patients.",
      "type": "single"
    },
    {
      "question": "A patient on Atazanavir develops yellowing of the sclera (jaundice) but feels fine. The nurse knows this is likely:",
      "options": [
        "A sign of liver failure requiring drug cessation",
        "A benign side effect of the drug inhibiting bilirubin conjugation",
        "An allergic reaction",
        "A sign that the HIV virus is attacking the liver"
      ],
      "correctAnswer": "A benign side effect of the drug inhibiting bilirubin conjugation",
      "difficulty": "hard",
      "explanation": "Atazanavir often causes unconjugated hyperbilirubinemia, which is visible as jaundice but is usually clinically harmless.",
      "type": "caseBased"
    },
    {
      "question": "What is the correct ratio for preparing a home-made ORS with sugar, salt, and water?",
      "options": [
        "1 liter water, 1 teaspoon salt, 1 teaspoon sugar",
        "1 liter water, 6 level teaspoons sugar, half a teaspoon salt",
        "1 liter water, 2 tablespoons salt, 4 tablespoons sugar",
        "Half a liter water, 6 teaspoons salt, 1 teaspoon sugar"
      ],
      "correctAnswer": "1 liter water, 6 level teaspoons sugar, half a teaspoon salt",
      "difficulty": "moderate",
      "explanation": "This specific ratio (6:0.5 in 1L) provides the correct osmolarity for optimal water and sodium absorption in the small intestine.",
      "type": "calculation"
    },
    {
      "question": "Which drug is a 'Mast Cell Stabilizer' used for the long-term prophylaxis of asthma?",
      "options": ["Cromolyn Sodium", "Ipratropium", "Salbutamol", "Theophylline"],
      "correctAnswer": "Cromolyn Sodium",
      "difficulty": "moderate",
      "explanation": "Cromolyn prevents mast cells from releasing inflammatory mediators like histamine. It must be used regularly and is not effective for acute attacks.",
      "type": "single"
    },
    {
      "question": "A patient with diabetes is experiencing 'Kussmaul breathing' and a 'fruity' breath odor. The most likely diagnosis is:",
      "options": ["Hypoglycemia", "Diabetic Ketoacidosis (DKA)", "Asthma attack", "Lactic Acidosis from Metformin"],
      "correctAnswer": "Diabetic Ketoacidosis (DKA)",
      "difficulty": "moderate",
      "explanation": "Fruity breath is caused by acetone (a ketone). Kussmaul breathing is the respiratory compensation for the metabolic acidosis found in DKA.",
      "type": "single"
    },
    {
      "question": "Which of the following is a potential side effect of 'Aluminum-based' antacids?",
      "options": ["Diarrhea", "Constipation", "Kidney stones", "Metallic taste"],
      "correctAnswer": "Constipation",
      "difficulty": "moderate",
      "explanation": "Aluminum salts cause constipation, which is why they are often combined with Magnesium salts (which cause diarrhea) to balance the effect.",
      "type": "single"
    },
    {
      "question": "What is the primary mechanism of action of the antidiarrheal drug Loperamide?",
      "options": [
        "Killing the bacteria in the gut",
        "Slowing GI motility by acting on opioid receptors in the intestinal wall",
        "Absorbing water to make the stool bulkier",
        "Neutralizing the toxins produced by E. coli"
      ],
      "correctAnswer": "Slowing GI motility by acting on opioid receptors in the intestinal wall",
      "difficulty": "moderate",
      "explanation": "Loperamide is an opioid agonist that does not cross the blood-brain barrier significantly. It slows peristalsis, allowing for more water absorption.",
      "type": "single"
    },
    {
      "question": "Hyoscine Butylbromide is used to treat which of the following?",
      "options": ["Acid reflux", "Intestinal spasms and cramping", "Bacterial diarrhea", "Constipation"],
      "correctAnswer": "Intestinal spasms and cramping",
      "difficulty": "moderate",
      "explanation": "Hyoscine (Buscopan) is an antispasmodic/anticholinergic that relaxes the smooth muscle of the GI tract.",
      "type": "single"
    },
    {
      "question": "Which insulin is 'Clear' and has a duration of action of approximately 24 hours without a peak?",
      "options": ["NPH", "Regular", "Glargine", "Lispro"],
      "correctAnswer": "Glargine",
      "difficulty": "moderate",
      "explanation": "Insulin Glargine is a long-acting basal insulin. It provides a steady level of insulin for 24 hours and should not be mixed with other insulins.",
      "type": "single"
    },
    {
      "question": "A patient is prescribed both an inhaled corticosteroid (ICS) and a SABA. How should they be used?",
      "options": [
        "Use the ICS first, wait 5 minutes, then use the SABA.",
        "Use the SABA first, wait 5 minutes, then use the ICS.",
        "Use them both at the same time.",
        "Only use the ICS when they have trouble breathing."
      ],
      "correctAnswer": "Use the SABA first, wait 5 minutes, then use the ICS.",
      "difficulty": "moderate",
      "explanation": "The SABA (bronchodilator) opens the airways first, which allows the ICS (anti-inflammatory) to reach deeper into the lungs.",
      "type": "ordering"
    },
    {
      "question": "Which of the following describes the mechanism of action of 'ARBs' like Losartan?",
      "options": [
        "They prevent the formation of Angiotensin II.",
        "They block the Angiotensin II type 1 (AT1) receptors.",
        "They increase the levels of Bradykinin.",
        "They block the release of Renin."
      ],
      "correctAnswer": "They block the Angiotensin II type 1 (AT1) receptors.",
      "difficulty": "moderate",
      "explanation": "Unlike ACE inhibitors, ARBs do not stop the production of Angiotensin II; they simply block its effect at the receptor site and do not cause a cough.",
      "type": "single"
    },
    {
      "question": "Which diuretic works by blocking the V2 receptors in the collecting duct and is used for SIADH?",
      "options": ["Furosemide", "Tolvaptan", "Spironolactone", "Mannitol"],
      "correctAnswer": "Tolvaptan",
      "difficulty": "hard",
      "explanation": "Tolvaptan is a vasopressin antagonist (vaptan). It prevents water reabsorption in the collecting ducts without affecting sodium levels significantly.",
      "type": "single"
    },
    {
      "question": "A patient on Tenofovir (TDF) should have which lab value monitored regularly to check for toxicity?",
      "options": ["Liver enzymes", "Serum creatinine / GFR", "White blood cell count", "Blood glucose"],
      "correctAnswer": "Serum creatinine / GFR",
      "difficulty": "moderate",
      "explanation": "TDF is associated with nephrotoxicity and a decline in renal function, making kidney monitoring essential.",
      "type": "single"
    },
    {
      "question": "What does the term 'Fixed-Dose Combination' (FDC) refer to?",
      "options": [
        "A drug that has a fixed price",
        "A single pill containing two or more active pharmacological agents",
        "A drug that must be taken at the same time every day",
        "A combination of a drug and a specific food"
      ],
      "correctAnswer": "A single pill containing two or more active pharmacological agents",
      "difficulty": "moderate",
      "explanation": "FDCs like TLD (Tenofovir/Lamivudine/Dolutegravir) improve adherence by reducing pill burden.",
      "type": "single"
    },
    {
      "question": "A 'Black Box Warning' for Metoclopramide (Reglan) concerns the risk of developing:",
      "options": [
        "Acute renal failure",
        "Tardive Dyskinesia (irreversible movement disorder)",
        "Severe liver damage",
        "Cardiac arrest"
      ],
      "correctAnswer": "Tardive Dyskinesia (irreversible movement disorder)",
      "difficulty": "hard",
      "explanation": "Because it blocks dopamine receptors in the brain, long-term use can lead to EPS and tardive dyskinesia.",
      "type": "single"
    },
    {
      "question": "Which of the following medications is a 'Proton Pump Inhibitor'?",
      "options": ["Ranitidine", "Pantoprazole", "Sucralfate", "Misoprostol"],
      "correctAnswer": "Pantoprazole",
      "difficulty": "moderate",
      "explanation": "The suffix '-prazole' identifies PPIs. Pantoprazole is frequently used for GERD and ulcer healing.",
      "type": "single"
    },
    {
      "question": "How does 'Sucralfate' promote ulcer healing?",
      "options": [
        "By neutralizing stomach acid",
        "By creating a physical paste-like barrier over the ulcerated tissue",
        "By killing H. pylori",
        "By increasing the production of gastric acid"
      ],
      "correctAnswer": "By creating a physical paste-like barrier over the ulcerated tissue",
      "difficulty": "moderate",
      "explanation": "Sucralfate is a mucosal protectant. It binds to the proteins of the ulcer crater, protecting it from acid and pepsin.",
      "type": "single"
    },
    {
      "question": "The medication 'Efavirenz' should be taken on an empty stomach because:",
      "options": [
        "Food prevents it from being absorbed.",
        "Fatty meals significantly increase absorption and the risk of CNS side effects.",
        "It causes severe nausea if taken with food.",
        "It reacts with stomach acid to form a toxin."
      ],
      "correctAnswer": "Fatty meals significantly increase absorption and the risk of CNS side effects.",
      "difficulty": "hard",
      "explanation": "High-fat meals increase the peak plasma concentration of Efavirenz, which worsens side effects like dizziness, vivid dreams, and confusion.",
      "type": "single"
    },
    {
      "question": "Identify the 'Potassium-Sparing' diuretic from the following list:",
      "options": ["Hydrochlorothiazide", "Amiloride", "Bumetanide", "Chlorthalidone"],
      "correctAnswer": "Amiloride",
      "difficulty": "moderate",
      "explanation": "Amiloride and Triamterene work by blocking sodium channels in the collecting duct, thereby sparing potassium.",
      "type": "single"
    },
    {
      "question": "What is the primary pharmacological benefit of 'Atenolol' over 'Propranolol' for a patient with hypertension and COPD?",
      "options": [
        "Atenolol is more potent.",
        "Atenolol is cardioselective (Beta-1) and less likely to cause bronchospasm.",
        "Atenolol stays in the body longer.",
        "Atenolol also treats the COPD directly."
      ],
      "correctAnswer": "Atenolol is cardioselective (Beta-1) and less likely to cause bronchospasm.",
      "difficulty": "moderate",
      "explanation": "Atenolol primarily targets the Beta-1 receptors in the heart, making it safer for patients with respiratory issues than non-selective blockers.",
      "type": "single"
    },
    {
      "question": "In HIV therapy, 'Viral Suppression' is generally defined as a viral load of:",
      "options": [
        "Less than 1,000,000 copies/mL",
        "Exactly zero copies/mL",
        "Less than 50 or 20 copies/mL (undetectable)",
        "The same as the CD4 count"
      ],
      "correctAnswer": "Less than 50 or 20 copies/mL (undetectable)",
      "difficulty": "moderate",
      "explanation": "The goal of ART is to suppress the virus below the limit of detection of standard assays.",
      "type": "single"
    },
    {
      "question": "Which of the following is a symptom of 'Digitalis Toxicity,' which can be precipitated by hypokalemia from diuretics?",
      "options": [
        "Hyperactivity",
        "Yellow-green halos around lights and nausea",
        "Increased appetite",
        "Loss of hearing"
      ],
      "correctAnswer": "Yellow-green halos around lights and nausea",
      "difficulty": "hard",
      "explanation": "Digoxin (Digitalis) toxicity often presents with visual disturbances and GI symptoms. Low potassium levels make this toxicity more likely.",
      "type": "single"
    },
    {
      "question": "Assertion (A): Patients on Glyburide (Glibenclamide) should be warned about alcohol consumption.\nReason (R): Sulfonylureas can cause a Disulfiram-like reaction (flushing, nausea, palpitations) when mixed with alcohol.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "hard",
      "explanation": "Some first and second-generation sulfonylureas interfere with alcohol metabolism, leading to an accumulation of acetaldehyde and unpleasant physical symptoms.",
      "type": "assertionReason"
    },
    {
      "question": "Which drug is a 'Dopamine Antagonist' antiemetic that should not be used in patients with Parkinson's Disease?",
      "options": ["Ondansetron", "Promethazine", "Dronabinol", "Scopolamine"],
      "correctAnswer": "Promethazine",
      "difficulty": "hard",
      "explanation": "Promethazine (Phenergan) blocks dopamine receptors. In Parkinson's patients, who already have a dopamine deficit, this can significantly worsen their motor symptoms.",
      "type": "single"
    },
    {
      "question": "In the management of Type 2 Diabetes, which drug class increases the risk of genital yeast infections due to glucosuria?",
      "options": ["Biguanides", "SGLT2 inhibitors", "DPP-4 inhibitors", "Sulfonylureas"],
      "correctAnswer": "SGLT2 inhibitors",
      "difficulty": "moderate",
      "explanation": "SGLT2 inhibitors (e.g., Dapagliflozin) cause the kidneys to excrete glucose in the urine. This sugary environment promotes the growth of yeast (Candida).",
      "type": "single"
    },
    {
      "question": "The 'Incretin Effect' refers to:",
      "options": [
        "The fact that oral glucose causes a higher insulin release than IV glucose due to gut hormones.",
        "The way insulin is absorbed into the muscle.",
        "The breakdown of glycogen in the liver.",
        "The process of creating new glucose from protein."
      ],
      "correctAnswer": "The fact that oral glucose causes a higher insulin release than IV glucose due to gut hormones.",
      "difficulty": "hard",
      "explanation": "Gut hormones called incretins (like GLP-1) are released when food is eaten, which signals the pancreas to prepare more insulin.",
      "type": "single"
    },
    {
      "question": "Which drug is used for the treatment of 'Diabetes Insipidus' (not DM)?",
      "options": ["Insulin", "Desmopressin (ADH)", "Metformin", "Furosemide"],
      "correctAnswer": "Desmopressin (ADH)",
      "difficulty": "moderate",
      "explanation": "Diabetes Insipidus is a condition of ADH deficiency. Desmopressin is a synthetic ADH that helps the kidneys retain water.",
      "type": "single"
    },
    {
      "question": "A patient with asthma is prescribed Theophylline. Which of the following should they avoid to prevent toxicity?",
      "options": ["Caffeine", "Orange juice", "High-protein meals", "Exercise"],
      "correctAnswer": "Caffeine",
      "difficulty": "moderate",
      "explanation": "Caffeine is a methylxanthine, just like theophylline. Consuming it can lead to additive stimulant effects and increase the risk of toxicity (tachycardia, seizures).",
      "type": "single"
    },
    {
      "question": "Which of the following is an example of a 'Bulk-forming' laxative?",
      "options": ["Bisacodyl", "Psyllium (Metamucil)", "Docusate", "Mineral oil"],
      "correctAnswer": "Psyllium (Metamucil)",
      "difficulty": "moderate",
      "explanation": "Bulk-forming laxatives absorb water and increase fecal mass, which is the safest way to treat chronic constipation.",
      "type": "single"
    },
    {
      "question": "The primary goal of 'Pre-Exposure Prophylaxis' (PrEP) is to:",
      "options": [
        "Treat an existing HIV infection",
        "Prevent an HIV-negative person from becoming infected",
        "Cure AIDS",
        "Make the virus less aggressive"
      ],
      "correctAnswer": "Prevent an HIV-negative person from becoming infected",
      "difficulty": "moderate",
      "explanation": "PrEP is used by people at high risk of HIV to prevent the virus from establishing an infection if they are exposed.",
      "type": "single"
    },
    {
      "question": "What is 'Option B+' in the context of PMTCT (Prevention of Mother to Child Transmission)?",
      "options": [
        "Giving ART to the baby only",
        "Giving lifelong ART to all HIV-positive pregnant/breastfeeding women regardless of CD4 count",
        "Giving ART only during labor",
        "Using formula feeding instead of breastfeeding"
      ],
      "correctAnswer": "Giving lifelong ART to all HIV-positive pregnant/breastfeeding women regardless of CD4 count",
      "difficulty": "moderate",
      "explanation": "Option B+ ensures the mother's health and provides continuous protection for future pregnancies.",
      "type": "single"
    },
    {
      "question": "Which of the following describes 'Bioavailability'?",
      "options": [
        "The time it takes for half the drug to leave the body",
        "The percentage of the administered dose that reaches the systemic circulation unchanged",
        "The way a drug binds to its receptor",
        "The toxicity of a drug"
      ],
      "correctAnswer": "The percentage of the administered dose that reaches the systemic circulation unchanged",
      "difficulty": "moderate",
      "explanation": "Bioavailability is 100% for IV drugs but varies for oral drugs due to absorption and first-pass metabolism.",
      "type": "single"
    },
    {
      "question": "Why should 'Tetracycline' antibiotics NOT be taken with Antacids?",
      "options": [
        "The antacid makes the antibiotic more toxic.",
        "The antacid contains metal ions (Ca, Mg, Al) that chelate (bind) the antibiotic, preventing its absorption.",
        "The antacid causes the antibiotic to be excreted too fast.",
        "There is no interaction between them."
      ],
      "correctAnswer": "The antacid contains metal ions (Ca, Mg, Al) that chelate (bind) the antibiotic, preventing its absorption.",
      "difficulty": "hard",
      "explanation": "Antacids create a chemical bond with tetracyclines, forming an insoluble complex that cannot be absorbed into the blood.",
      "type": "single"
    },
    {
      "question": "Which of the following is a symptom of 'Cushing's Syndrome' caused by long-term corticosteroid use?",
      "options": [
        "Weight loss and hypotension",
        "Moon face, buffalo hump, and thinning skin",
        "Extreme growth of muscles",
        "Improvement in vision"
      ],
      "correctAnswer": "Moon face, buffalo hump, and thinning skin",
      "difficulty": "moderate",
      "explanation": "Exogenous steroids cause a redistribution of fat and a breakdown of connective tissue, leading to these characteristic physical changes.",
      "type": "single"
    },
    {
      "question": "A patient with diabetes takes their morning insulin but skips breakfast. What is the most likely result?",
      "options": ["Hyperglycemia", "Hypoglycemia", "Ketoacidosis", "No effect"],
      "correctAnswer": "Hypoglycemia",
      "difficulty": "moderate",
      "explanation": "Insulin lowers blood sugar. If no glucose (food) is provided, the blood sugar will drop to dangerously low levels.",
      "type": "situational"
    },
    {
      "question": "Identify the 'H2-receptor antagonist' from the list:",
      "options": ["Omeprazole", "Ranitidine", "Sucralfate", "Atropine"],
      "correctAnswer": "Ranitidine",
      "difficulty": "moderate",
      "explanation": "H2 blockers (like Ranitidine and Famotidine) compete with histamine at the H2 receptors on parietal cells.",
      "type": "single"
    },
    {
      "question": "Which of the following is the 'Correct Order' for treating a conscious patient with hypoglycemia?",
      "options": [
        "1. Give 15g simple carbs, 2. Wait 15 mins, 3. Recheck sugar",
        "1. Give insulin, 2. Wait 15 mins, 3. Recheck sugar",
        "1. Recheck sugar, 2. Give 15g carbs, 3. Give insulin",
        "1. Wait 15 mins, 2. Give carbs, 3. Recheck sugar"
      ],
      "orderCorrect": ["Give 15g simple carbs", "Wait 15 mins", "Recheck sugar"],
      "difficulty": "moderate",
      "explanation": "The 'Rule of 15' is the standard protocol for treating mild to moderate hypoglycemia.",
      "type": "ordering"
    },
    {
      "question": "In a patient taking Warfarin, which food should be kept consistent (neither increased nor decreased) to avoid interactions?",
      "options": ["Red meat", "Green leafy vegetables (Vitamin K)", "Citrus fruits", "Dairy products"],
      "correctAnswer": "Green leafy vegetables (Vitamin K)",
      "difficulty": "moderate",
      "explanation": "Warfarin works by inhibiting Vitamin K. Large changes in Vitamin K intake can drastically change how 'thin' the blood is.",
      "type": "single"
    },
    {
      "question": "What is the primary site of action for 'Thiazide' diuretics?",
      "options": ["Proximal tubule", "Loop of Henle", "Distal convoluted tubule", "Collecting duct"],
      "correctAnswer": "Distal convoluted tubule",
      "difficulty": "moderate",
      "explanation": "Thiazides block the Na+/Cl- symporter in the distal tubule. They are less potent than loop diuretics but effective for hypertension.",
      "type": "single"
    },
    {
      "question": "Which medication is used to treat 'Motion Sickness' and is often given as a patch behind the ear?",
      "options": ["Metoclopramide", "Hyoscine (Scopolamine)", "Ondansetron", "Loperamide"],
      "correctAnswer": "Hyoscine (Scopolamine)",
      "difficulty": "moderate",
      "explanation": "Scopolamine is an anticholinergic that blocks the vestibular signals that trigger nausea.",
      "type": "single"
    },
    {
      "question": "What is the 'Therapeutic Index' of a drug?",
      "options": [
        "The list of diseases the drug treats",
        "The ratio of the toxic dose to the effective dose",
        "The time the drug takes to work",
        "The cost of the drug"
      ],
      "correctAnswer": "The ratio of the toxic dose to the effective dose",
      "difficulty": "moderate",
      "explanation": "A narrow therapeutic index (like Theophylline or Digoxin) means there is a small margin between a safe dose and a poisonous one.",
      "type": "single"
    },
    {
      "question": "A patient is prescribed both 'TLD' (fixed-dose combination) and 'Rifampicin' (for TB). Why is this concerning?",
      "options": [
        "Rifampicin makes TLD toxic.",
        "Rifampicin is a potent enzyme inducer that can lower the levels of Dolutegravir (DTG) significantly.",
        "They cause the patient's skin to turn blue.",
        "There is no interaction."
      ],
      "correctAnswer": "Rifampicin is a potent enzyme inducer that can lower the levels of Dolutegravir (DTG) significantly.",
      "difficulty": "hard",
      "explanation": "Rifampicin speeds up the metabolism of many ARVs. When used with DTG, the dose of DTG often needs to be doubled to remain effective.",
      "type": "single"
    },
    {
      "question": "Which drug is used to treat 'Opioid Overdose'?",
      "options": ["Naloxone", "Methadone", "Loperamide", "Morphine"],
      "correctAnswer": "Naloxone",
      "difficulty": "moderate",
      "explanation": "Naloxone is a pure opioid antagonist that rapidly reverses respiratory depression caused by opioids.",
      "type": "single"
    },
    {
      "question": "Which of the following describes 'Pharmacokinetics'?",
      "options": [
        "What the drug does to the body",
        "What the body does to the drug (Absorption, Distribution, Metabolism, Excretion)",
        "The study of drug prices",
        "The manufacturing of drugs"
      ],
      "correctAnswer": "What the body does to the drug (Absorption, Distribution, Metabolism, Excretion)",
      "difficulty": "moderate",
      "explanation": "Pharmacokinetics (ADME) deals with the movement of drugs through the body.",
      "type": "single"
    },
    {
      "question": "A patient with heart failure is taking Furosemide. Which electrolyte should they be encouraged to eat in their diet?",
      "options": ["Sodium", "Potassium", "Calcium", "Chloride"],
      "correctAnswer": "Potassium",
      "difficulty": "moderate",
      "explanation": "Loop diuretics cause significant potassium loss. Patients are often encouraged to eat potassium-rich foods like bananas or take supplements.",
      "type": "situational"
    },
    {
      "question": "The 'Chemoreceptor Trigger Zone' (CTZ) is located in which part of the brain?",
      "options": ["Cerebrum", "Medulla Oblongata", "Cerebellum", "Hypothalamus"],
      "correctAnswer": "Medulla Oblongata",
      "difficulty": "moderate",
      "explanation": "The CTZ is in the area postrema of the medulla, where it can detect toxins in the blood.",
      "type": "single"
    },
    {
      "question": "Which drug is a prostaglandin analog used to 'ripen the cervix' and induce labor, but also used in GI for ulcer prevention?",
      "options": ["Misoprostol", "Oxytocin", "Mifepristone", "Dinoprostone"],
      "correctAnswer": "Misoprostol",
      "difficulty": "moderate",
      "explanation": "Misoprostol has multiple clinical uses including GI protection and obstetric procedures.",
      "type": "single"
    },
    {
      "question": "A patient has 'Type 1' Diabetes. Which statement is TRUE?",
      "options": [
        "They can be treated with oral Metformin alone.",
        "They have an absolute deficiency of insulin and require lifelong insulin injections.",
        "They can cure their disease with diet and exercise.",
        "Their body produces too much insulin."
      ],
      "correctAnswer": "They have an absolute deficiency of insulin and require lifelong insulin injections.",
      "difficulty": "moderate",
      "explanation": "In Type 1, the pancreatic beta cells are destroyed, meaning the patient must receive exogenous insulin to survive.",
      "type": "single"
    },
    {
      "question": "The 'Alpha-Glucosidase Inhibitors' (e.g., Acarbose) should be taken:",
      "options": [
        "First thing in the morning on an empty stomach",
        "With the first bite of each main meal",
        "At bedtime",
        "Only when the patient has high blood sugar"
      ],
      "correctAnswer": "With the first bite of each main meal",
      "difficulty": "hard",
      "explanation": "They work by inhibiting the enzymes that break down carbs in the gut, so they must be present when the food arrives.",
      "type": "single"
    },
    {
      "question": "Which of the following is a symptom of 'Lactic Acidosis' in a patient taking Metformin?",
      "options": [
        "Sudden increase in energy",
        "Muscle pain, cold feeling, and trouble breathing",
        "Weight gain",
        "Improved digestion"
      ],
      "correctAnswer": "Muscle pain, cold feeling, and trouble breathing",
      "difficulty": "hard",
      "explanation": "Lactic acidosis is a rare but serious side effect of metformin, especially in patients with kidney problems.",
      "type": "single"
    },
    {
      "question": "What is 'Prophylaxis'?",
      "options": [
        "The treatment of a disease",
        "The prevention of a disease",
        "The diagnosis of a disease",
        "The study of the cause of a disease"
      ],
      "correctAnswer": "The prevention of a disease",
      "difficulty": "moderate",
      "explanation": "Prophylaxis (like PEP or PrEP) is treatment given to prevent an infection from occurring.",
      "type": "single"
    },
    {
      "question": "The 'Half-Life' of a drug is:",
      "options": [
        "The time it takes for half of the drug to be absorbed",
        "The time it takes for the concentration of the drug in the blood to decrease by 50%",
        "The duration of the drug's effect",
        "The time it takes for the drug to be manufactured"
      ],
      "correctAnswer": "The time it takes for the concentration of the drug in the blood to decrease by 50%",
      "difficulty": "moderate",
      "explanation": "Half-life helps determine how often a drug needs to be dosed.",
      "type": "single"
    },
    {
      "question": "Which of the following is NOT a common symptom of 'Hypoglycemia'?",
      "options": ["Sweating", "Tachycardia (fast heart rate)", "Polyuria (excessive urination)", "Confusion"],
      "correctAnswer": "Polyuria (excessive urination)",
      "difficulty": "moderate",
      "explanation": "Polyuria is a symptom of hyperglycemia (high sugar), not hypoglycemia.",
      "type": "negative"
    },
    {
      "question": "Which antiemetic is also used to treat 'Gastroparesis' (slow stomach emptying)?",
      "options": ["Ondansetron", "Metoclopramide", "Promethazine", "Scopolamine"],
      "correctAnswer": "Metoclopramide",
      "difficulty": "moderate",
      "explanation": "Because it is a prokinetic, it speeds up the movement of the stomach.",
      "type": "single"
    },
    {
      "question": "A patient with 'Gout' should avoid which diuretic?",
      "options": ["Hydrochlorothiazide", "Spironolactone", "Amiloride", "Triamterene"],
      "correctAnswer": "Hydrochlorothiazide",
      "difficulty": "hard",
      "explanation": "Thiazides can increase uric acid levels in the blood, which can trigger a gout attack.",
      "type": "single"
    },
    {
      "question": "What is the specific 'Target' of the drug Maraviroc?",
      "options": ["Reverse Transcriptase", "Integrase", "CCR5 Co-receptor", "gp120"],
      "correctAnswer": "CCR5 Co-receptor",
      "difficulty": "hard",
      "explanation": "Maraviroc is an entry inhibitor that blocks the CCR5 receptor on the human cell.",
      "type": "single"
    }
  ]
};
// ============================================================================
// AUTO-SEEDING FUNCTION - NO NEED TO EDIT BELOW THIS LINE
// ============================================================================

/**
 * Normalizes difficulty levels to standard format
 */
const normalizeDifficulty = (diff) => {
  if (!diff) return "easy";
  const normalized = diff.toLowerCase().trim();
  if (normalized === "moderate") return "medium";
  if (normalized === "expert") return "application";
  if (normalized === "beginner") return "easy";
  if (["easy", "medium", "hard", "application"].includes(normalized)) {
    return normalized;
  }
  console.warn(`⚠️  Unknown difficulty "${diff}" - defaulting to easy`);
  return "easy";
};

/**
 * Builds questions with proper MongoDB format
 */
const buildQuestions = (items) => {
  return items.map((q, index) => {
    let correctIndex;
    
    // Skip questions without options
    if (!q.options || !Array.isArray(q.options)) {
      console.warn(`⚠️  Warning: Question ${index + 1} has no options array: "${q.question.substring(0, 50)}..."`);
      return null;
    }
    
    // Handle different correctAnswer formats
    if (typeof q.correctAnswer === "number") {
      correctIndex = q.correctAnswer;
    } else if (Array.isArray(q.correctAnswer)) {
      // For multi-select questions
      correctIndex = q.correctAnswer.map(ans => 
        q.options.findIndex(o => String(o) === String(ans))
      );
    } else {
      // String answer - find matching option
      correctIndex = q.options.findIndex(o => String(o) === String(q.correctAnswer));
    }

    // Validate correctIndex
    if (correctIndex === -1 || (Array.isArray(correctIndex) && correctIndex.includes(-1))) {
      console.warn(`⚠️  Warning: Could not find correct answer for question ${index + 1}: "${q.question.substring(0, 50)}..."`);
      console.warn(`   Correct answer: "${q.correctAnswer}"`);
      console.warn(`   Options: ${JSON.stringify(q.options)}`);
    }

    return {
      _id: new ObjectId(),
      question: q.question,
      options: q.options,
      correctAnswer: correctIndex,
      explanation: q.explanation || undefined,
      type: q.type || (q.multiSelect ? "multiSelect" : "singleChoice")
    };
  }).filter(q => q !== null); // Filter out null questions
};

/**
 * Creates or retrieves a level
 */
const createOrGetLevel = async (levelsCol, levelName, secondarySchoolId) => {
  let level = await levelsCol.findOne({ name: levelName });
  if (!level) {
    console.log(`  📝 Creating level: ${levelName}`);
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

/**
 * Creates or retrieves a course
 */
const createOrGetCourse = async (coursesCol, courseName, levelId) => {
  let course = await coursesCol.findOne({ name: courseName, levelId: levelId });
  if (!course) {
    console.log(`  📝 Creating course: ${courseName}`);
    const result = await coursesCol.insertOne({
      name: courseName,
      levelId: levelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    course = { _id: result.insertedId, name: courseName };
  }
  return course._id;
};

/**
 * Creates or retrieves a unit
 */
const createOrGetUnit = async (unitsCol, unitName, courseId) => {
  let unit = await unitsCol.findOne({ name: unitName, courseId: courseId });
  if (!unit) {
    console.log(`  📝 Creating unit: ${unitName}`);
    const result = await unitsCol.insertOne({
      name: unitName,
      courseId: courseId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    unit = { _id: result.insertedId, name: unitName };
  }
  return unit._id;
};

/**
 * Main seeding function
 */
async function autoSeedQuizzes() {
  try {
    console.log("\n" + "=".repeat(70));
    console.log("🚀 STARTING QUIZ SEEDER");
    console.log("=".repeat(70));
    console.log(`📚 Subject: ${CONFIG.subject}`);
    console.log(`🎓 Level: ${CONFIG.level}`);
    console.log(`📊 Units to process: ${Object.keys(questionTemplates).length}`);
    console.log("=".repeat(70) + "\n");

    console.log("🔗 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully!\n");

    const db = client.db("QuixDB");
    const quizzesCol = db.collection("quizzes");
    const coursesCol = db.collection("courses");
    const levelsCol = db.collection("levels");
    const schoolsCol = db.collection("schools");
    const unitsCol = db.collection("units");

    // Get secondary school
    const secondarySchool = await schoolsCol.findOne({ type: "SECONDARY" });
    if (!secondarySchool) {
      throw new Error("❌ Secondary school not found in database!");
    }
    const secondarySchoolId = secondarySchool._id;
    console.log(`🏫 Found secondary school: ${secondarySchool.name || 'Secondary School'}\n`);

    // Get or create level and course
    const levelId = await createOrGetLevel(levelsCol, CONFIG.level, secondarySchoolId);
    const courseId = await createOrGetCourse(coursesCol, CONFIG.subject, levelId);
    console.log("");

    let totalQuizzes = 0;
    let totalQuestions = 0;
    const unitSummary = [];

    // Process each unit in questionTemplates
    for (const [unitName, questions] of Object.entries(questionTemplates)) {
      console.log("─".repeat(70));
      console.log(`📚 Processing Unit: ${unitName}`);
      console.log(`   Total questions in unit: ${questions.length}`);
      console.log("─".repeat(70));
      
      if (questions.length === 0) {
        console.log("⚠️  No questions found - skipping unit\n");
        continue;
      }

      // Create or get unit
      const unitId = await createOrGetUnit(unitsCol, unitName, courseId);

      // Group questions by difficulty
      const groupedByDifficulty = {
        easy: [],
        medium: [],
        hard: [],
        application: []
      };

      questions.forEach((q, idx) => {
        const difficulty = normalizeDifficulty(q.difficulty);
        groupedByDifficulty[difficulty].push(q);
      });

      let unitQuizCount = 0;
      let unitQuestionCount = 0;

      // Create a quiz for each difficulty level that has questions
      for (const [difficulty, difficultyQuestions] of Object.entries(groupedByDifficulty)) {
        if (difficultyQuestions.length === 0) continue;

        // Extract unit number if present (e.g., "Unit 4: Title" -> "4")
        const unitMatch = unitName.match(/Unit\s+(\d+)/i);
        const unitNumber = unitMatch ? unitMatch[1] : "";
        
        // Create descriptive title
        const titleParts = [
          CONFIG.subject,
          CONFIG.level
        ];
        
        if (unitNumber) {
          titleParts.push(`Unit ${unitNumber}`);
        } else {
          // If no unit number, use abbreviated unit name
          const shortName = unitName.length > 40 ? unitName.substring(0, 37) + "..." : unitName;
          titleParts.push(shortName);
        }
        
        const capitalizedDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        titleParts.push(`(${capitalizedDiff})`);
        const quizTitle = titleParts.join(" - ");

        // Generate description
        const description = `${capitalizedDiff} level quiz covering ${unitName}. This quiz contains ${difficultyQuestions.length} questions designed to test your understanding of the key concepts and events covered in this unit.`;

        // Build and insert quiz
        const quizData = {
          _id: new ObjectId(),
          title: quizTitle,
          subject: CONFIG.subject,
          level: CONFIG.level,
          description: description,
          courseId: courseId,
          levelId: levelId,
          unitId: unitId,
          questions: buildQuestions(difficultyQuestions),
          duration: CONFIG.durations[difficulty],
          difficulty: difficulty,
          createdAt: new Date(),
          updatedAt: new Date(),
          isAdaptive: false,
          isPublished: true,
          analytics: {
            totalAttempts: 0,
            averageScore: 0,
            averageTimeSpent: 0,
            commonMistakes: []
          }
        };

        await quizzesCol.insertOne(quizData);
        
        console.log(`  ✅ Created ${capitalizedDiff} quiz: ${difficultyQuestions.length} questions (${CONFIG.durations[difficulty]} min)`);
        
        unitQuizCount++;
        unitQuestionCount += difficultyQuestions.length;
        totalQuizzes++;
        totalQuestions += difficultyQuestions.length;
      }

      unitSummary.push({
        unit: unitName,
        quizzes: unitQuizCount,
        questions: unitQuestionCount
      });

      console.log(`  📊 Unit Summary: ${unitQuizCount} quizzes, ${unitQuestionCount} questions\n`);
    }

    // Final summary
    console.log("\n" + "=".repeat(70));
    console.log("✅ SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(70));
    console.log(`📚 Subject: ${CONFIG.subject}`);
    console.log(`🎓 Level: ${CONFIG.level}`);
    console.log(`📊 Total Quizzes Created: ${totalQuizzes}`);
    console.log(`📝 Total Questions Seeded: ${totalQuestions}`);
    console.log(`📁 Units Processed: ${unitSummary.length}`);
    console.log("─".repeat(70));
    console.log("Unit Breakdown:");
    unitSummary.forEach((summary, idx) => {
      console.log(`  ${idx + 1}. ${summary.unit}`);
      console.log(`     └─ ${summary.quizzes} quiz(es), ${summary.questions} question(s)`);
    });
    console.log("=".repeat(70) + "\n");

  } catch (err) {
    console.error("\n" + "=".repeat(70));
    console.error("❌ ERROR OCCURRED");
    console.error("=".repeat(70));
    console.error(err);
    console.error("=".repeat(70) + "\n");
  } finally {
    await client.close();
    console.log("🔌 Database connection closed\n");
  }
}

// Run the seeder
autoSeedQuizzes();