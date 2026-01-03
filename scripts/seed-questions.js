const questionTemplates = {
  "Final Mastery Review: Mixed Units 1 - 4": [
    {
      "question": "Which of the following describes the 'Pharmacodynamic' interaction between a Beta-blocker and a Beta-2 agonist (Salbutamol)?",
      "options": [
        "The Beta-blocker increases the absorption of the Salbutamol.",
        "The Beta-blocker competitively antagonizes the effect of the Salbutamol, potentially leading to bronchospasm.",
        "The Salbutamol prevents the Beta-blocker from reaching the heart.",
        "They work synergistically to improve lung function."
      ],
      "correctAnswer": "The Beta-blocker competitively antagonizes the effect of the Salbutamol, potentially leading to bronchospasm.",
      "difficulty": "hard",
      "explanation": "This is a classic pharmacodynamic antagonism. The Beta-blocker (antagonist) occupies the same receptors that the Salbutamol (agonist) needs to stimulate for bronchodilation.",
      "type": "single"
    },
    {
      "question": "A patient with peptic ulcer disease is prescribed Bismuth Subsalicylate. Which side effect should they be warned about to prevent unnecessary alarm?",
      "options": [
        "Bright red blood in the stool",
        "Blackening of the tongue and stool",
        "Permanent loss of taste",
        "Sudden yellowing of the skin"
      ],
      "correctAnswer": "Blackening of the tongue and stool",
      "difficulty": "moderate",
      "explanation": "Bismuth reacts with sulfur in saliva and the GI tract to form Bismuth Sulfide, which is black. This is harmless but can be mistaken for melena (upper GI bleeding).",
      "type": "single"
    },
    {
      "question": "Why is 'Ceftriaxone' contraindicated in newborns receiving intravenous Calcium-containing solutions?",
      "options": [
        "It prevents the calcium from strengthening the bones.",
        "It can form life-threatening precipitates in the lungs and kidneys.",
        "The calcium makes the antibiotic stop working.",
        "It causes the baby's skin to turn grey."
      ],
      "correctAnswer": "It can form life-threatening precipitates in the lungs and kidneys.",
      "difficulty": "hard",
      "explanation": "Calcium and Ceftriaxone can react to form insoluble crystals. In neonates, this has led to fatal organ damage.",
      "type": "single"
    },
    {
      "question": "Which of the following is a primary clinical use for the drug 'Spironolactone' beyond its diuretic effect?",
      "options": [
        "Treatment of hyperthyroidism",
        "Management of hyperaldosteronism and acne in females",
        "Treatment of acute asthma attacks",
        "Emergency reversal of hypoglycemia"
      ],
      "correctAnswer": "Management of hyperaldosteronism and acne in females",
      "difficulty": "moderate",
      "explanation": "Spironolactone is an aldosterone antagonist and also has anti-androgenic effects, making it useful for conditions like PCOS and hormonal acne.",
      "type": "single"
    },
    {
      "question": "An HIV-positive patient on ART presents with 'Fanconi Syndrome' (proteinuria, glycosuria, and phosphaturia). Which drug is the most likely cause?",
      "options": ["Zidovudine", "Tenofovir Disoproxil Fumarate (TDF)", "Efavirenz", "Lamivudine"],
      "correctAnswer": "Tenofovir Disoproxil Fumarate (TDF)",
      "difficulty": "hard",
      "explanation": "Fanconi syndrome is a specific type of proximal renal tubular injury uniquely associated with Tenofovir (TDF) toxicity.",
      "type": "caseBased"
    },
    {
      "question": "What is the physiological role of the enzyme 'Alpha-Glucosidase' which is inhibited by the drug Acarbose?",
      "options": [
        "It breaks down glycogen in the liver.",
        "It breaks down complex carbohydrates into monosaccharides in the small intestine.",
        "It helps the pancreas release insulin.",
        "It converts glucose into fat for storage."
      ],
      "correctAnswer": "It breaks down complex carbohydrates into monosaccharides in the small intestine.",
      "difficulty": "moderate",
      "explanation": "By inhibiting this enzyme, Acarbose slows the absorption of glucose, preventing 'spikes' in blood sugar after a meal.",
      "type": "single"
    },
    {
      "question": "Which drug is the 'Antidote' for a Heparin overdose?",
      "options": ["Vitamin K", "Protamine Sulfate", "Naloxone", "Flumazenil"],
      "correctAnswer": "Protamine Sulfate",
      "difficulty": "moderate",
      "explanation": "Protamine is a positively charged protein that binds to the negatively charged Heparin, neutralizing its anticoagulant effect.",
      "type": "single"
    },
    {
      "question": "A patient taking Digoxin begins taking Hydrochlorothiazide. What is the most critical risk of this combination?",
      "options": [
        "The thiazide will make the Digoxin stop working.",
        "Hypokalemia caused by the thiazide increases the risk of Digoxin toxicity.",
        "The patient will develop severe hypertension.",
        "The patient will become excessively thirsty."
      ],
      "correctAnswer": "Hypokalemia caused by the thiazide increases the risk of Digoxin toxicity.",
      "difficulty": "hard",
      "explanation": "Digoxin competes with Potassium for binding sites on the Na+/K+ ATPase pump. If potassium is low, more Digoxin binds, leading to toxicity even at 'normal' doses.",
      "type": "single"
    },
    {
      "question": "What is the primary mechanism of 'Montelukast' in asthma management?",
      "options": [
        "Blocking Beta-2 receptors",
        "Leukotriene receptor antagonism to reduce airway inflammation and mucus",
        "Directly thinning the mucus in the lungs",
        "Stimulating the cough reflex"
      ],
      "correctAnswer": "Leukotriene receptor antagonism to reduce airway inflammation and mucus",
      "difficulty": "moderate",
      "explanation": "Leukotrienes are inflammatory chemicals released during an asthma attack. Montelukast blocks their receptors.",
      "type": "single"
    },
    {
      "question": "Which of the following is a symptom of 'Cinchonism,' a toxicity associated with the antimalarial and antiarrhythmic drug Quinidine?",
      "options": [
        "Blue-tinted vision",
        "Tinnitus (ringing in the ears), headache, and dizziness",
        "Excessive hair growth",
        "Dry mouth and constipation"
      ],
      "correctAnswer": "Tinnitus (ringing in the ears), headache, and dizziness",
      "difficulty": "moderate",
      "explanation": "Cinchonism is a cluster of symptoms caused by quinidine or quinine overdose.",
      "type": "single"
    },
    {
      "question": "Assertion (A): Nitroglycerin tablets must be stored in their original dark glass bottle.\nReason (R): Nitroglycerin is highly volatile and unstable when exposed to light, heat, or air.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "explanation": "Nitroglycerin loses its potency very quickly if not protected from environmental factors.",
      "type": "assertionReason"
    },
    {
      "question": "A patient with 'Prinzmetal’s Angina' (vasospastic angina) should generally avoid which class of drugs?",
      "options": ["Calcium Channel Blockers", "Nitrates", "Non-selective Beta-blockers", "Statins"],
      "correctAnswer": "Non-selective Beta-blockers",
      "difficulty": "hard",
      "explanation": "Beta-blockers can leave alpha-receptors unopposed, which may actually worsen coronary artery vasospasm.",
      "type": "single"
    },
    {
      "question": "Which drug is used to treat a 'Dry, Non-productive Cough' by acting on the cough center in the medulla?",
      "options": ["Guaifenesin", "Dextromethorphan", "Salbutamol", "Ambroxol"],
      "correctAnswer": "Dextromethorphan",
      "difficulty": "moderate",
      "explanation": "Dextromethorphan is an antitussive. Guaifenesin is an expectorant (used for wet coughs).",
      "type": "single"
    },
    {
      "question": "The 'Somogyi Effect' in diabetes management refers to:",
      "options": [
        "Morning hyperglycemia caused by a rebound response to nighttime hypoglycemia.",
        "Morning hyperglycemia caused by not enough insulin.",
        "A permanent allergy to insulin.",
        "Weight gain caused by insulin use."
      ],
      "correctAnswer": "Morning hyperglycemia caused by a rebound response to nighttime hypoglycemia.",
      "difficulty": "hard",
      "explanation": "If blood sugar drops too low at night, the body releases 'counter-regulatory' hormones (like adrenaline) that cause the sugar to swing too high by morning.",
      "type": "single"
    },
    {
      "question": "Which of the following is a classic sign of 'Atropine' (anticholinergic) toxicity?",
      "options": [
        "Pinpoint pupils and excessive salivation",
        "Dry as a bone, red as a beet, mad as a hatter (confusion/dry skin/flushing)",
        "Slow heart rate and low blood pressure",
        "Increased bowel sounds and diarrhea"
      ],
      "correctAnswer": "Dry as a bone, red as a beet, mad as a hatter (confusion/dry skin/flushing)",
      "difficulty": "moderate",
      "explanation": "Anticholinergics block the 'rest and digest' system, leading to dry membranes, tachycardia, and dilated pupils.",
      "type": "single"
    },
    {
      "question": "Which NRTI is often avoided in patients with high cardiovascular risk due to concerns about increased rates of myocardial infarction?",
      "options": ["Abacavir", "Tenofovir", "Lamivudine", "Zidovudine"],
      "correctAnswer": "Abacavir",
      "difficulty": "hard",
      "explanation": "Some large observational studies suggested a link between Abacavir use and a slightly higher risk of heart attacks, leading to caution in patients with heart disease.",
      "type": "single"
    },
    {
      "question": "A patient is taking 'Sucralfate' and 'Ciprofloxacin'. How should these be scheduled?",
      "options": [
        "Take them together for better absorption.",
        "Take Ciprofloxacin 2 hours before or 6 hours after Sucralfate.",
        "Take Sucralfate first, then Ciprofloxacin immediately.",
        "They cannot be taken by the same patient ever."
      ],
      "correctAnswer": "Take Ciprofloxacin 2 hours before or 6 hours after Sucralfate.",
      "difficulty": "hard",
      "explanation": "Sucralfate contains aluminum, which binds to fluoroquinolone antibiotics like Ciprofloxacin, preventing their absorption.",
      "type": "situational"
    },
    {
      "question": "What is the primary danger of stopping 'Clonidine' (alpha-2 agonist) abruptly?",
      "options": [
        "The patient will fall asleep instantly.",
        "Severe rebound hypertension (crisis).",
        "The patient's blood sugar will drop.",
        "Permanent loss of appetite."
      ],
      "correctAnswer": "Severe rebound hypertension (crisis).",
      "difficulty": "moderate",
      "explanation": "Abrupt withdrawal causes a massive surge in catecholamines (like adrenaline), leading to dangerously high blood pressure.",
      "type": "single"
    },
    {
      "question": "Which class of anti-diabetic drugs is associated with 'Euglycemic Ketoacidosis' (DKA with near-normal blood sugar)?",
      "options": ["Sulfonylureas", "SGLT2 Inhibitors", "Biguanides", "DPP-4 Inhibitors"],
      "correctAnswer": "SGLT2 Inhibitors",
      "difficulty": "hard",
      "explanation": "SGLT2 inhibitors (e.g., Empagliflozin) can cause the body to produce ketones even when blood sugar isn't extremely high, making DKA harder to diagnose.",
      "type": "single"
    },
    {
      "question": "Identify the 'Negative' effect of using mineral oil as a laxative over a long period.",
      "options": [
        "It causes high blood pressure.",
        "It can interfere with the absorption of fat-soluble vitamins (A, D, E, K).",
        "It makes the stool too hard to pass.",
        "It causes the teeth to turn yellow."
      ],
      "correctAnswer": "It can interfere with the absorption of fat-soluble vitamins (A, D, E, K).",
      "difficulty": "moderate",
      "explanation": "Mineral oil coats the gut and 'traps' fat-soluble vitamins inside it, so they are excreted instead of being absorbed.",
      "type": "negative"
    }
  ]
};