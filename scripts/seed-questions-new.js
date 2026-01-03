const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI ||
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

const client = new MongoClient(uri);

// ============================================================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================================================
const CONFIG = {
  subject: "Biology",           // Subject name (e.g., "History", "Mathematics", "Biology")
  level: "S3",                  // Level (e.g., "S1", "S2", "S3", "S4", "S5", "S6")
  
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
  "Unit 1: Interdependence among organisms in an ecosystem": [
    {
      "question": "Which of the following best defines the term 'interdependence' in an ecosystem?",
      "options": [
        "The ability of an organism to survive without interacting with others.",
        "The way organisms rely on each other for resources like food, shelter, and mates.",
        "A relationship where only one organism benefits from the interaction.",
        "The process by which organisms produce their own food using sunlight."
      ],
      "correctAnswer": "The way organisms rely on each other for resources like food, shelter, and mates.",
      "difficulty": "easy",
      "explanation": "Interdependence refers to the mutual reliance of organisms on one another for survival, which includes obtaining food, finding shelter, or locating mates. [cite: 8]"
    },
    {
      "question": "In a forest, two different species of birds eat the same type of seed. This is an example of:",
      "options": [
        "Intraspecific competition",
        "Interspecific competition",
        "Intraspecific cooperation",
        "Interspecific cooperation"
      ],
      "correctAnswer": "Interspecific competition",
      "difficulty": "easy",
      "explanation": "Competition between members of different species for the same resources, such as food, is termed interspecific competition. [cite: 8]"
    },
    {
      "question": "Which scenario illustrates an intraspecific relationship?",
      "options": [
        "A lion preying on a zebra.",
        "A tick feeding on a cow's blood.",
        "Female lions hunting together to provide food for their pride.",
        "A bird building a nest in a tree."
      ],
      "correctAnswer": "Female lions hunting together to provide food for their pride.",
      "difficulty": "moderate",
      "explanation": "Intraspecific relationships occur between members of the same species. Cooperation among female lions in a pride is a clear example. [cite: 8]"
    },
    {
      "question": "Identify the type of interaction where one organism benefits while the other is harmed but not immediately killed.",
      "options": [
        "Predation",
        "Mutualism",
        "Parasitism",
        "Commensalism"
      ],
      "correctAnswer": "Parasitism",
      "difficulty": "easy",
      "explanation": "Parasitism is an interspecific relationship where the parasite benefits by obtaining nutrients from the host, which is harmed. [cite: 8]"
    },
    {
      "question": "In the relationship between a lion and an impala, what is the ecological role of the lion?",
      "options": [
        "Host",
        "Prey",
        "Predator",
        "Parasite"
      ],
      "correctAnswer": "Predator",
      "difficulty": "easy",
      "explanation": "A predator is an organism that hunts, kills, and eats another organism (the prey). [cite: 8]"
    },
    {
      "question": "What happens in a stable predator-prey relationship if the prey population significantly decreases?",
      "options": [
        "The predator population increases due to lack of competition.",
        "The predator population decreases due to starvation.",
        "The predator population remains constant by switching to plants.",
        "The prey population becomes extinct immediately."
      ],
      "correctAnswer": "The predator population decreases due to starvation.",
      "difficulty": "moderate",
      "explanation": "As the prey population decreases, less food is available for predators, leading to a decline in the predator population due to starvation. [cite: 8]"
    },
    {
      "question": "Which of the following is a physical adaptation of a predator to help it catch prey?",
      "options": [
        "Camouflage in the environment",
        "Possessing toxic chemicals",
        "Having hard shells or spines",
        "Sharp eyes facing forward for depth perception"
      ],
      "correctAnswer": "Sharp eyes facing forward for depth perception",
      "difficulty": "moderate",
      "explanation": "Eagles and other predators often have forward-facing eyes, providing a greater sense of sight and depth to help locate and strike prey. [cite: 8]"
    },
    {
      "question": "Which of these interactions is considered 'cooperation'?",
      "options": [
        "Two male hippos fighting for territory.",
        "Worker bees in a hive sharing roles to support the queen.",
        "A cheetah and a leopard competing for a carcass.",
        "A flea living on a dog's skin."
      ],
      "correctAnswer": "Worker bees in a hive sharing roles to support the queen.",
      "difficulty": "easy",
      "explanation": "Cooperation involves organisms of the same species living together and sharing work for the benefit of the group. [cite: 8]"
    },
    {
      "question": "Assertion: Intraspecific competition is often more intense than interspecific competition.\nReason: Members of the same species occupy the same niche and require exactly the same resources.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "The more similar two organisms are (same species), the more intense the competition because they compete for food, mates, and space within the same niche. [cite: 8]"
    },
    {
      "question": "Select ALL examples of interspecific interactions from the list below:",
      "multiSelect": true,
      "options": [
        "A spider eating a fly",
        "Ants sharing duties in an anthill",
        "A tick on a dog",
        "Two male birds fighting for a mate",
        "Lichen (fungi and algae living together)"
      ],
      "correctAnswer": ["A spider eating a fly", "A tick on a dog", "Lichen (fungi and algae living together)"],
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "Interspecific interactions involve different species (Spider/Fly, Tick/Dog, Fungi/Algae). Ants or birds of the same species represent intraspecific interactions. [cite: 8]"
    },
    {
      "question": "Which feature is a behavioral adaptation used by prey to avoid being eaten?",
      "options": [
        "Having a long, sticky tongue",
        "Developing poisonous thorns",
        "Fleeing or running away from enemies",
        "Having sharp, pointed teeth"
      ],
      "correctAnswer": "Fleeing or running away from enemies",
      "difficulty": "easy",
      "explanation": "Behavioral adaptations include actions like avoiding, fleeing from, or defending against predators. [cite: 8]"
    },
    {
      "question": "What is the primary cause of competition in an ecosystem?",
      "options": [
        "An abundance of resources for all organisms.",
        "A lack of predators in the environment.",
        "Resources like food, water, and space being in limited supply.",
        "Organisms choosing to interact for social benefits."
      ],
      "correctAnswer": "Resources like food, water, and space being in limited supply.",
      "difficulty": "easy",
      "explanation": "Organisms tend to compete for resources when the supply is not enough to meet the needs of all individuals. [cite: 8]"
    },
    {
      "question": "True or False: Competition only occurs between different species.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Competition occurs both between the same species (intraspecific) and between different species (interspecific). [cite: 8]"
    },
    {
      "question": "According to the graph of a stable predator-prey relationship (e.g., lion and impala), what typically follows a peak in the prey population?",
      "options": [
        "A decrease in the predator population.",
        "A peak in the predator population shortly after.",
        "Immediate extinction of the prey.",
        "The predator population remains unchanged."
      ],
      "correctAnswer": "A peak in the predator population shortly after.",
      "difficulty": "moderate",
      "explanation": "When the prey population increases, food becomes abundant for predators, causing their numbers to rise. [cite: 8]"
    },
    {
      "question": "Lice, ticks, and mites are examples of:",
      "options": [
        "Endoparasites",
        "Ectoparasites",
        "Predators",
        "Decomposers"
      ],
      "correctAnswer": "Ectoparasites",
      "difficulty": "moderate",
      "explanation": "Lice, ticks, and mites live on the external surface of the host and are known as ectoparasites. [cite: 8]"
    },
    {
      "question": "Which of the following is NOT a resource that animals of the same species typically compete for?",
      "options": [
        "Mates",
        "Space",
        "Sunlight for photosynthesis",
        "Food"
      ],
      "correctAnswer": "Sunlight for photosynthesis",
      "difficulty": "easy",
      "type": "negative",
      "explanation": "Animals do not perform photosynthesis; therefore, they do not compete for sunlight for that purpose. [cite: 8]"
    },
    {
      "question": "A tick feeds on a cow. In this relationship, the cow is the _____.",
      "options": ["Predator", "Parasite", "Host", "Prey"],
      "correctAnswer": "Host",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "In parasitism, the organism from which the parasite gets its nutrients is called the host. [cite: 8]"
    },
    {
      "question": "What is the ultimate result of intense competition between two species where one is better adapted?",
      "options": [
        "Both species will increase in number.",
        "The less fit species must migrate, die, or shift its niche.",
        "The species will begin to cooperate to share resources.",
        "The better-adapted species will immediately die off."
      ],
      "correctAnswer": "The less fit species must migrate, die, or shift its niche.",
      "difficulty": "moderate",
      "explanation": "Intense competition leads to the elimination of the less fit organism unless it adapts or moves. [cite: 8]"
    },
    {
      "question": "Why is 'cooperation' vital for social insects like termites?",
      "options": [
        "It increases competition for the queen's attention.",
        "It allows for division of labor to ensure the colony's survival.",
        "It prevents predators from seeing the colony.",
        "It allows each termite to live independently."
      ],
      "correctAnswer": "It allows for division of labor to ensure the colony's survival.",
      "difficulty": "moderate",
      "explanation": "In social insects, every member has a diverse role (division of labor), working together for the group benefit. [cite: 8]"
    },
    {
      "question": "The relationship between a cheetah and a lion both hunting the same gazelle is:",
      "options": [
        "Intraspecific competition",
        "Interspecific competition",
        "Predation",
        "Mutualism"
      ],
      "correctAnswer": "Interspecific competition",
      "difficulty": "easy",
      "explanation": "Since cheetahs and lions are different species competing for the same resource (gazelle), it is interspecific competition. [cite: 8]"
    },
    {
      "question": "Which statement about parasites is correct?",
      "options": [
        "They always kill their host immediately.",
        "They live at the expense of another organism called the host.",
        "They provide food to the host in exchange for shelter.",
        "They only live inside the host's body."
      ],
      "correctAnswer": "They live at the expense of another organism called the host.",
      "difficulty": "moderate",
      "explanation": "Parasites obtain nutrients from the host, causing harm but usually not killing it immediately. [cite: 8]"
    },
    {
      "question": "Case Study: In Akagera National Park, the population of zebras increases. Assuming lions only eat zebras, what is the most likely outcome for the lion population?",
      "options": [
        "The lion population will decrease due to overcrowding.",
        "The lion population will increase because food is abundant.",
        "The lion population will stay the same.",
        "The lions will stop eating zebras and start eating grass."
      ],
      "correctAnswer": "The lion population will increase because food is abundant.",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Abundance of prey (zebras) provides more food for the predators (lions), leading to a population increase. [cite: 8]"
    },
    {
      "question": "Which of the following describes 'amensalism'?",
      "options": [
        "Both organisms benefit.",
        "One organism is harmed while the other is unaffected.",
        "One organism benefits while the other is unaffected.",
        "Both organisms are harmed."
      ],
      "correctAnswer": "One organism is harmed while the other is unaffected.",
      "difficulty": "hard",
      "explanation": "Amensalism is an interaction where one species is inhibited or harmed while the other remains unaffected. [cite: 8]"
    },
    {
      "question": "A chameleon using its color to blend into its surroundings is an example of:",
      "options": [
        "Camouflage as a prey defense",
        "Cooperation",
        "Parasitism",
        "Intraspecific competition"
      ],
      "correctAnswer": "Camouflage as a prey defense",
      "difficulty": "easy",
      "explanation": "Camouflage makes it difficult for predators to locate prey, which is a vital survival adaptation. [cite: 8]"
    },
    {
      "question": "Assertion: Mosquitoes are considered temporary parasites.\nReason: They only visit the host to feed on blood and do not live on or in the host permanently.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "Mosquitoes are temporary parasites because they do not spend their entire life cycle on the host. [cite: 8]"
    },
    {
      "question": "Order the following events in a predator-prey cycle starting with an increase in prey:",
      "options": ["A. Predator population increases", "B. Prey population increases", "C. Predator population decreases", "D. Prey population decreases"],
      "orderCorrect": ["Prey population increases", "Predator population increases", "Prey population decreases", "Predator population decreases"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Increased prey leads to increased predators, which then reduces the prey population, eventually causing the predator population to drop due to starvation. [cite: 8]"
    },
    {
      "question": "Which of these is a functional benefit of competition in a species?",
      "options": [
        "It ensures that only the fittest individuals survive and reproduce.",
        "It makes sure all individuals have equal amounts of food.",
        "It encourages organisms to leave the ecosystem entirely.",
        "It prevents any variation from occurring in the population."
      ],
      "correctAnswer": "It ensures that only the fittest individuals survive and reproduce.",
      "difficulty": "moderate",
      "explanation": "Competition acts as a selection pressure, ensuring individuals with favorable traits survive to pass them on. [cite: 8, 19]"
    },
    {
      "question": "Which of the following organisms would most likely compete for the same ecological niche?",
      "options": [
        "A lion and a spider",
        "An elephant and a rabbit",
        "A zebra and a wildebeest",
        "A vulture and a giraffe"
      ],
      "correctAnswer": "A zebra and a wildebeest",
      "difficulty": "moderate",
      "explanation": "Zebas and wildebeests both eat grass in the savannah, meaning they occupy similar niches and compete for the same food. [cite: 8]"
    },
    {
      "question": "Predation helps in _____ the population size of both the predator and the prey.",
      "options": ["Increasing", "Stabilizing/Regulating", "Eliminating", "Ignoring"],
      "correctAnswer": "Stabilizing/Regulating",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Predation brings about population balance by regulating the numbers of both species involved. [cite: 8]"
    },
    {
      "question": "An interaction where one organism benefits and the other is neither helped nor harmed is called:",
      "options": [
        "Mutualism",
        "Parasitism",
        "Commensalism",
        "Competition"
      ],
      "correctAnswer": "Commensalism",
      "difficulty": "easy",
      "explanation": "Commensalism is a relationship where one species benefits while the other is unaffected. [cite: 8]"
    },
    {
      "question": "Which group of organisms exhibits high levels of intraspecific cooperation?",
      "options": [
        "Lions and zebras",
        "Ticks and fleas",
        "Bees and termites",
        "Spiders and flies"
      ],
      "correctAnswer": "Bees and termites",
      "difficulty": "easy",
      "explanation": "Social insects like bees and termites are classic examples of organisms that live together and share work. [cite: 8]"
    },
    {
      "question": "What is the result of 'survival for the fittest' in a changing environment?",
      "options": [
        "Organisms with favorable adaptations survive.",
        "Organisms with non-beneficial variations increase in number.",
        "All organisms in the population die.",
        "Nature stops selecting which organisms live."
      ],
      "correctAnswer": "Organisms with favorable adaptations survive.",
      "difficulty": "moderate",
      "explanation": "Natural selection ensures that those with adaptations to environmental changes survive and reproduce. [cite: 19]"
    },
    {
      "question": "A situation where livestock and wildlife compete for limited grass near human settlements is an example of:",
      "options": [
        "Interspecific competition",
        "Intraspecific cooperation",
        "Mutualism",
        "Predation"
      ],
      "correctAnswer": "Interspecific competition",
      "difficulty": "moderate",
      "explanation": "Livestock (domesticated) and wildlife (wild grazers) are different species competing for the same resource (grass). [cite: 8]"
    },
    {
      "question": "Which of these is NOT an adaptation of a prey to avoid predation?",
      "options": [
        "Toxic chemicals",
        "Hard shells",
        "Acute senses to locate prey",
        "Camouflage"
      ],
      "correctAnswer": "Acute senses to locate prey",
      "difficulty": "easy",
      "type": "negative",
      "explanation": "Acute senses to locate prey is an adaptation of a *predator*, not a prey. [cite: 8]"
    },
    {
      "question": "True or False: Intraspecific interaction only involves competition.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Intraspecific relationships include both competition and cooperation. [cite: 8]"
    },
    {
      "question": "In a bee colony, what is the role of 'soldier bees'?",
      "options": [
        "Gathering nectar",
        "Protecting the queen bee",
        "Laying eggs",
        "Building the hive"
      ],
      "correctAnswer": "Protecting the queen bee",
      "difficulty": "moderate",
      "explanation": "In bee colonies, soldier bees are specifically in charge of protecting the queen. [cite: 8]"
    },
    {
      "question": "Competition for mates is typically a form of:",
      "options": [
        "Interspecific competition",
        "Intraspecific competition",
        "Commensalism",
        "Predation"
      ],
      "correctAnswer": "Intraspecific competition",
      "difficulty": "moderate",
      "explanation": "Normally, animals of the same species compete with each other for mates. [cite: 8]"
    },
    {
      "question": "Which of the following is an example of a 'temporary parasite'?",
      "options": ["Lice", "Ticks", "Mosquitoes", "Mites"],
      "correctAnswer": "Mosquitoes",
      "difficulty": "moderate",
      "explanation": "Mosquitoes are noted as temporary parasites because they feed and leave rather than living on the host. [cite: 8]"
    },
    {
      "question": "Which term describes a relationship where both organisms benefit from each other?",
      "options": [
        "Parasitism",
        "Commensalism",
        "Mutualism",
        "Predation"
      ],
      "correctAnswer": "Mutualism",
      "difficulty": "easy",
      "explanation": "Mutualism is an interspecific relationship where both parties derive benefits. [cite: 8]"
    },
    {
      "question": "What kind of teeth would a predator like a lion most likely have?",
      "options": [
        "Broad, flat molars for grinding",
        "Sharp, pointed teeth for tearing flesh",
        "No teeth at all",
        "Small, weak teeth"
      ],
      "correctAnswer": "Sharp, pointed teeth for tearing flesh",
      "difficulty": "easy",
      "explanation": "Predators have teeth, fangs, or claws designed to catch and subdue their prey. [cite: 8]"
    },
    {
      "question": "Situational Judgment: You observe a bird following a herd of cattle, eating the insects stirred up by the cows' movement. The cows are unaffected. What is this relationship?",
      "options": [
        "Mutualism",
        "Commensalism",
        "Parasitism",
        "Competition"
      ],
      "correctAnswer": "Commensalism",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "The bird benefits (gets food) while the cattle are unaffected, fitting the definition of commensalism. [cite: 8]"
    },
    {
      "question": "In the 'struggle for existence', what determines which organisms survive?",
      "options": [
        "Luck",
        "Their inherited characteristics and variations",
        "The size of the ecosystem",
        "The number of offspring they have"
      ],
      "correctAnswer": "Their inherited characteristics and variations",
      "difficulty": "moderate",
      "explanation": "Variations that enable organisms to compete effectively (beneficial variations) lead to survival. [cite: 19]"
    },
    {
      "question": "Fill in the blank: In an ecosystem, _____ refers to the fact that no organism is self-reliant.",
      "options": ["Competition", "Interdependence", "Isolation", "Independence"],
      "correctAnswer": "Interdependence",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Interdependence describes how all organisms depend on each other for survival. [cite: 8]"
    },
    {
      "question": "Which of the following describes the 'negative acceleration phase' of a population growth curve?",
      "options": [
        "Rapid increase in numbers.",
        "A decline in growth rate as the population stabilizes.",
        "The starting phase with slow growth.",
        "Total extinction of the species."
      ],
      "correctAnswer": "A decline in growth rate as the population stabilizes.",
      "difficulty": "hard",
      "explanation": "In an S-shaped curve, the negative acceleration phase occurs as growth slows down before stabilization. [cite: 9]"
    },
    {
      "question": "Select the correct pair of interaction and its definition:",
      "options": [
        "Predation: Both organisms are harmed.",
        "Mutualism: One benefits, one is harmed.",
        "Intraspecific: Interaction between the same species.",
        "Interspecific: Interaction within the same family."
      ],
      "correctAnswer": "Intraspecific: Interaction between the same species.",
      "difficulty": "moderate",
      "explanation": "Intraspecific interaction is explicitly defined as occurring between organisms of the same species. [cite: 8]"
    },
    {
      "question": "Why would there be NO competition between an elephant and a rabbit in the same habitat?",
      "options": [
        "They are the same size.",
        "They do not depend on the same food (different niches).",
        "They are the same species.",
        "They are both predators."
      ],
      "correctAnswer": "They do not depend on the same food (different niches).",
      "difficulty": "moderate",
      "explanation": "Competition only occurs between organisms in the same or closely related ecological niches. [cite: 8]"
    },
    {
      "question": "Which of the following is a result of overpopulation?",
      "options": [
        "Decreased competition for resources.",
        "Improved climate stability.",
        "Increased pollution and conflicts over resources.",
        "Expansion of natural habitats."
      ],
      "correctAnswer": "Increased pollution and conflicts over resources.",
      "difficulty": "easy",
      "explanation": "Overpopulation leads to negative effects like climate change, pollution, and increased resource competition. [cite: 9]"
    }
  ],
    "Unit 2: Population Size": [
    {
      "question": "Which of the following refers to the maximum population size of a species that an environment can sustain indefinitely?",
      "options": ["Biotic potential", "Carrying capacity", "Population density", "Environmental resistance"],
      "correctAnswer": "Carrying capacity",
      "difficulty": "easy",
      "explanation": "Carrying capacity is the limit of the environment to support a population based on available resources. [cite: 16]"
    },
    {
      "question": "Identify the environmental factor that acts as a 'limiting factor' for population size.",
      "options": ["Availability of food", "Presence of predators", "Spread of diseases", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Food, predators, and diseases are all environmental factors that can restrict the growth and size of a population. [cite: 1, 6]"
    },
    {
      "question": "In the sigmoid (S-shaped) population growth curve, what is the first phase called?",
      "options": ["Log phase", "Lag phase", "Stationary phase", "Deceleration phase"],
      "correctAnswer": "Lag phase",
      "difficulty": "moderate",
      "explanation": "The lag phase is the initial period of slow growth where organisms are adapting to their new environment. [cite: 1]"
    },
    {
      "question": "During which phase of the population growth curve is the birth rate approximately equal to the death rate?",
      "options": ["Exponential phase", "Lag phase", "Stationary phase", "Log phase"],
      "correctAnswer": "Stationary phase",
      "difficulty": "moderate",
      "explanation": "In the stationary phase, the population size remains constant because birth and death rates balance each other out. [cite: 1]"
    },
    {
      "question": "What happens during the 'Log phase' or 'Exponential phase' of growth?",
      "options": ["Population size decreases rapidly", "Birth rate is much higher than the death rate", "The population reaches carrying capacity", "Organisms are dying as fast as they are born"],
      "correctAnswer": "Birth rate is much higher than the death rate",
      "difficulty": "moderate",
      "explanation": "During the log phase, resources are abundant, allowing for rapid, exponential population increase. [cite: 1]"
    },
    {
      "question": "Which of the following is a direct effect of human overpopulation on the environment?",
      "options": ["Decreased pollution", "Increased biodiversity", "Habitat destruction", "Reforestation"],
      "correctAnswer": "Habitat destruction",
      "difficulty": "easy",
      "explanation": "Large human populations require more land for housing and agriculture, leading to the destruction of natural habitats. [cite: 8]"
    },
    {
      "question": "Assertion: Population growth slows down as it approaches the carrying capacity.\nReason: Resources such as food and space become limited, increasing competition.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "As a population nears its carrying capacity, environmental resistance (limited resources) increases, slowing growth. [cite: 1, 6]"
    },
    {
      "question": "Which term describes the number of individuals of a species per unit area or volume?",
      "options": ["Population distribution", "Population density", "Population dynamics", "Population growth"],
      "correctAnswer": "Population density",
      "difficulty": "easy",
      "explanation": "Population density is a measure of how crowded a population is in a specific area. [cite: 1]"
    },
    {
      "question": "Which of these is NOT a consequence of rapid human population growth?",
      "options": ["Increased demand for clean water", "Higher rates of waste production", "Reduced pressure on natural resources", "Expansion of urban areas"],
      "correctAnswer": "Reduced pressure on natural resources",
      "difficulty": "easy",
      "type": "negative",
      "explanation": "Rapid human growth increases pressure on resources, it does not reduce it. [cite: 7, 8]"
    },
    {
      "question": "True or False: Abiotic factors like temperature and rainfall can limit population size.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Non-living (abiotic) factors are crucial in determining if an environment can support a specific population size. [cite: 1]"
    },
    {
      "question": "A sudden drop in population size due to a natural disaster is an example of:",
      "options": ["Density-dependent factor", "Density-independent factor", "Carrying capacity", "Symbiosis"],
      "correctAnswer": "Density-independent factor",
      "difficulty": "moderate",
      "explanation": "Natural disasters affect populations regardless of their density, making them density-independent factors. [cite: 1]"
    },
    {
      "question": "In Rwanda, what is a primary concern regarding the effect of human population growth on land?",
      "options": ["Land fragmentation", "Lack of people to farm", "Too much unused forest", "Decrease in urban migration"],
      "correctAnswer": "Land fragmentation",
      "difficulty": "moderate",
      "explanation": "High population density in Rwanda leads to small, fragmented land plots for farming. [cite: 8]"
    },
    {
      "question": "Which phase of the growth curve shows the fastest increase in numbers?",
      "options": ["Lag", "Deceleration", "Exponential", "Stationary"],
      "correctAnswer": "Exponential",
      "difficulty": "easy",
      "explanation": "The exponential (log) phase is characterized by the maximum growth rate. [cite: 1]"
    },
    {
      "question": "What is 'environmental resistance'?",
      "options": [
        "The ability of an organism to survive in harsh conditions.",
        "The total of all factors that limit the growth of a population.",
        "The speed at which a population reproduces.",
        "The lack of predators in an ecosystem."
      ],
      "correctAnswer": "The total of all factors that limit the growth of a population.",
      "difficulty": "moderate",
      "explanation": "Environmental resistance includes all factors (like food shortage or disease) that prevent a population from reaching its maximum potential. [cite: 1]"
    },
    {
      "question": "Place the phases of a typical population growth curve in order:",
      "orderCorrect": ["Lag phase", "Exponential phase", "Deceleration phase", "Stationary phase"],
      "difficulty": "moderate",
      "type": "ordering",
      "explanation": "A standard growth curve starts with slow growth (lag), followed by rapid growth (exponential), then slowing down (deceleration) until it levels off (stationary). [cite: 1]"
    },
    {
      "question": "Which of the following describes the relationship between a parasite and the host's population growth?",
      "options": [
        "Parasites always increase host population growth.",
        "Parasites have no effect on host population.",
        "Parasites can reduce host population growth by causing disease or death.",
        "Parasites only affect the predator's population."
      ],
      "correctAnswer": "Parasites can reduce host population growth by causing disease or death.",
      "difficulty": "moderate",
      "explanation": "By harming the host, parasites can lower reproduction rates or increase death rates in the host population. [cite: 5]"
    },
    {
      "question": "How does intensive livestock production help manage population needs?",
      "options": [
        "By using more land for fewer animals.",
        "By producing more food per acre to feed more people.",
        "By letting animals roam freely in forests.",
        "By decreasing the amount of meat produced."
      ],
      "correctAnswer": "By producing more food per acre to feed more people.",
      "difficulty": "moderate",
      "explanation": "Intensive farming is designed to maximize output in limited space to support growing human populations. [cite: 7]"
    },
    {
      "question": "The 'carrying capacity' of a habitat can change if:",
      "options": [
        "A new food source is introduced.",
        "A natural disaster destroys resources.",
        "Climate change alters water availability.",
        "All of the above."
      ],
      "correctAnswer": "All of the above.",
      "difficulty": "moderate",
      "explanation": "Since carrying capacity depends on resources, any change in resources will change the capacity. [cite: 6, 16]"
    },
    {
      "question": "What is the primary reason for the 'deceleration phase' in a population growth curve?",
      "options": [
        "The population is dying out.",
        "Environmental resistance starts to increase.",
        "The species has no more predators.",
        "The birth rate becomes zero."
      ],
      "correctAnswer": "Environmental resistance starts to increase.",
      "difficulty": "hard",
      "explanation": "As the population increases, resources become scarcer and waste accumulates, causing the growth rate to slow down. [cite: 1]"
    },
    {
      "question": "Which of the following is a density-dependent limiting factor?",
      "options": ["Forest fire", "Competition for food", "Earthquake", "Tsunami"],
      "correctAnswer": "Competition for food",
      "difficulty": "moderate",
      "explanation": "Competition is density-dependent because it becomes more intense as the number of individuals increases. [cite: 1]"
    },
    {
      "question": "Human population growth is currently described as:",
      "options": ["Exponential", "In the lag phase", "Declining", "In the stationary phase"],
      "correctAnswer": "Exponential",
      "difficulty": "easy",
      "explanation": "Global human population has been increasing very rapidly, following an exponential growth pattern. [cite: 1, 7]"
    },
    {
      "question": "What is the impact of overgrazing on soil?",
      "options": ["It adds nutrients.", "It prevents erosion.", "It leads to soil erosion and degradation.", "It helps plants grow faster."],
      "correctAnswer": "It leads to soil erosion and degradation.",
      "difficulty": "moderate",
      "explanation": "When too many animals graze, they remove the ground cover that protects the soil from wind and rain. [cite: 7]"
    },
    {
      "question": "What can be inferred if a population is in the 'death phase' or 'decline phase'?",
      "options": [
        "The death rate is higher than the birth rate.",
        "The birth rate is higher than the death rate.",
        "The population has reached its peak.",
        "Resources have suddenly become infinite."
      ],
      "correctAnswer": "The death rate is higher than the birth rate.",
      "difficulty": "moderate",
      "explanation": "In the decline phase, conditions are so poor that the population size decreases. [cite: 1]"
    },
    {
      "question": "Case Study: A population of rabbits is introduced to an island with plenty of grass and no predators. Predict the initial growth pattern.",
      "options": ["Immediate decline", "Lag phase followed by exponential growth", "Constant stationary phase", "Slow decline and then extinction"],
      "correctAnswer": "Lag phase followed by exponential growth",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "They will initially adapt (lag), then reproduce rapidly due to lack of limiting factors (exponential). [cite: 1]"
    },
    {
      "question": "Which of these is a social impact of human overpopulation?",
      "options": ["Better healthcare for all", "Increased pressure on public services", "More land for wildlife", "Decreased urban crime"],
      "correctAnswer": "Increased pressure on public services",
      "difficulty": "easy",
      "explanation": "More people require more schools, hospitals, and infrastructure, which can strain a government's resources. [cite: 8]"
    },
    {
      "question": "What is the main cause of the current 'global warming' mentioned in the context of human activities?",
      "options": [
        "Natural forest growth",
        "Build-up of greenhouse gases from industrial and farming activities",
        "Reduction in human population",
        "Decrease in the use of fossil fuels"
      ],
      "correctAnswer": "Build-up of greenhouse gases from industrial and farming activities",
      "difficulty": "moderate",
      "explanation": "Human activities like intensive farming and fuel use contribute to greenhouse gases. [cite: 7]"
    },
    {
      "question": "The phase where organisms are mature and the environment is at its carrying capacity is the:",
      "options": ["Lag phase", "Log phase", "Stationary phase", "Exponential phase"],
      "correctAnswer": "Stationary phase",
      "difficulty": "easy",
      "explanation": "Stationary phase occurs when the population size is stable and at its maximum limit. [cite: 1]"
    },
    {
      "question": "Which of the following describes 'monoculture'?",
      "options": [
        "Growing many different crops in one area.",
        "Growing only one type of crop on a large scale.",
        "Rearing only cattle.",
        "Rotating crops every season."
      ],
      "correctAnswer": "Growing only one type of crop on a large scale.",
      "difficulty": "easy",
      "explanation": "Monoculture is the practice of planting a single species over a large area. [cite: 7, 8]"
    },
    {
      "question": "Why does monoculture increase the risk of pest outbreaks?",
      "options": [
        "Pests hate large fields.",
        "Lack of genetic diversity makes the whole crop susceptible.",
        "It encourages biological controls.",
        "The crops are too strong for pests."
      ],
      "correctAnswer": "Lack of genetic diversity makes the whole crop susceptible.",
      "difficulty": "moderate",
      "explanation": "Since all plants are the same, a pest that can kill one can kill them all easily. [cite: 7]"
    },
    {
      "question": "True or False: A population can grow exponentially forever.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Limited resources and environmental resistance will eventually cause growth to stop. [cite: 1, 6]"
    },
    {
      "question": "Which factor is most likely to cause a population to exceed its carrying capacity temporarily?",
      "options": ["An increase in predators", "A seasonal abundance of food", "A severe drought", "A new disease outbreak"],
      "correctAnswer": "A seasonal abundance of food",
      "difficulty": "moderate",
      "explanation": "Temporary increases in resources can lead to temporary population spikes. [cite: 1]"
    },
    {
      "question": "Which of these contributes to Rwandan land fragmentation?",
      "options": ["Low population density", "High population growth", "Lack of inheritance laws", "Large scale industrialization"],
      "correctAnswer": "High population growth",
      "difficulty": "moderate",
      "explanation": "As the population grows, land is divided among more people, leading to fragmentation. [cite: 8]"
    },
    {
      "question": "What is the purpose of Rwanda Environmental Management Authority (REMA)?",
      "options": [
        "To increase the population size.",
        "To coordinate the implementation of government policies on environmental issues.",
        "To encourage deforestation.",
        "To stop all agricultural activities."
      ],
      "correctAnswer": "To coordinate the implementation of government policies on environmental issues.",
      "difficulty": "moderate",
      "explanation": "REMA is a government institution focused on managing and protecting the environment in Rwanda. [cite: 8]"
    },
    {
      "question": "Which phrase best describes the relationship between 'birth rate' and 'death rate' during the Log phase?",
      "options": ["Birth rate < Death rate", "Birth rate = Death rate", "Birth rate > Death rate", "Birth rate = 0"],
      "correctAnswer": "Birth rate > Death rate",
      "difficulty": "easy",
      "explanation": "The population increases because more individuals are being born than are dying. [cite: 1]"
    },
    {
      "question": "What is 'fossil fuel' formed from?",
      "options": ["Fresh rainwater", "Remains of living organisms from the geological past", "Inorganic chemicals in rocks", "Solar energy"],
      "correctAnswer": "Remains of living organisms from the geological past",
      "difficulty": "easy",
      "explanation": "Fossil fuels like coal or gas are formed over millions of years from organic remains. [cite: 10]"
    },
    {
      "question": "Select ALL that are density-independent factors:",
      "multiSelect": true,
      "options": ["Predation", "Volcanic eruption", "Floods", "Competition", "Severe frost"],
      "correctAnswer": ["Volcanic eruption", "Floods", "Severe frost"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Physical environmental events like floods and frost affect organisms regardless of how many are in the area. [cite: 1]"
    },
    {
      "question": "Which of these is a symptom of 'soil degradation' due to intensive farming?",
      "options": ["Increased moisture", "Loss of topsoil through erosion", "High microbial diversity", "Reduced use of fertilizers"],
      "correctAnswer": "Loss of topsoil through erosion",
      "difficulty": "moderate",
      "explanation": "Intensive farming often removes natural ground cover, leading to soil loss. [cite: 7]"
    },
    {
      "question": "What is the relationship between 'reproduction' and 'population size'?",
      "options": [
        "Reproduction ensures the continuity and increase of a population.",
        "Reproduction has no effect on population size.",
        "Reproduction always leads to a decrease in population.",
        "Reproduction only happens in the stationary phase."
      ],
      "correctAnswer": "Reproduction ensures the continuity and increase of a population.",
      "difficulty": "easy",
      "explanation": "Reproduction is the mechanism by which new individuals are added to a species. [cite: 12]"
    },
    {
      "question": "The process of 'urbanization' caused by human population growth results in:",
      "options": ["More space for agriculture", "Conversion of natural habitats into cities", "Increased forest cover", "Reduction in waste production"],
      "correctAnswer": "Conversion of natural habitats into cities",
      "difficulty": "easy",
      "explanation": "Urbanization is the shift of populations to cities, leading to the construction of buildings and roads on natural land. [cite: 8]"
    },
    {
      "question": "Which phase of growth shows the population 'adapting' to its surroundings?",
      "options": ["Exponential phase", "Lag phase", "Stationary phase", "Decline phase"],
      "correctAnswer": "Lag phase",
      "difficulty": "easy",
      "explanation": "The lag phase is where organisms settle and begin to utilize resources before rapid reproduction starts. [cite: 1]"
    },
    {
      "question": "What does the 'polluter-pays' principle mean?",
      "options": [
        "The government pays for all pollution.",
        "Those who cause environmental damage should bear the cost of cleaning it up.",
        "Pollution is free for everyone.",
        "Only the youth should pay for pollution."
      ],
      "correctAnswer": "Those who cause environmental damage should bear the cost of cleaning it up.",
      "difficulty": "moderate",
      "explanation": "This principle acts as a deterrent by making the responsible party financially accountable for pollution. [cite: 8]"
    },
    {
      "question": "Fill in the blank: _____ resources are those that are replenished at a rate equal to or greater than the rate of consumption.",
      "options": ["Non-renewable", "Sustainable", "Fossil", "Depleted"],
      "correctAnswer": "Sustainable",
      "difficulty": "moderate",
      "type": "fillBlank",
      "explanation": "Sustainability involves using resources at a pace that allows them to be naturally replaced. [cite: 10]"
    },
    {
      "question": "In a predator-prey graph, why does the predator population lag behind the prey population?",
      "options": [
        "Predators are slower than prey.",
        "Predators need time to reproduce in response to more food.",
        "Prey animals kill predators.",
        "Predators eat plants when prey is low."
      ],
      "correctAnswer": "Predators need time to reproduce in response to more food.",
      "difficulty": "hard",
      "explanation": "The predator population increases only after there is enough prey to support a larger number of predators. [cite: 6]"
    },
    {
      "question": "Assertion: Monoculture can contribute to climate change.\nReason: It often requires large inputs of energy from fossil fuels for machinery and chemical production.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "The industrial mode of food production in monocultures is a major contributor to greenhouse gases. [cite: 7]"
    },
    {
      "question": "Which of the following is a way to reduce waste effectively?",
      "options": ["Increasing consumption", "Throwing things in rivers", "Reduction and reuse", "Burning all plastic"],
      "correctAnswer": "Reduction and reuse",
      "difficulty": "easy",
      "explanation": "Not creating waste in the first place (reduction) or using items again (reuse) are the best strategies. [cite: 10]"
    },
    {
      "question": "Which term describes a species at serious risk of extinction?",
      "options": ["Common species", "Endangered species", "Invasive species", "Sustainable species"],
      "correctAnswer": "Endangered species",
      "difficulty": "easy",
      "explanation": "A species is endangered when its population falls to a level that threatens its existence. [cite: 9, 10]"
    },
    {
      "question": "Why is the involvement of youth and women important in environmental protection in Rwanda?",
      "options": [
        "Because they are the only ones who pollute.",
        "To ensure active and effective participation across the entire population.",
        "Because they do not work in agriculture.",
        "To stop them from using resources."
      ],
      "correctAnswer": "To ensure active and effective participation across the entire population.",
      "difficulty": "moderate",
      "explanation": "Inclusive participation is a key principle of Rwanda's environmental policy. [cite: 8]"
    }
  ],
    "Unit 3: Nutrient Cycles": [
    {
      "question": "Which process in the water cycle involves the release of water vapor from the leaves of plants into the atmosphere?",
      "options": ["Evaporation", "Condensation", "Transpiration", "Precipitation"],
      "correctAnswer": "Transpiration",
      "difficulty": "easy",
      "explanation": "Transpiration is the biological process where plants lose water vapor through stomata in their leaves."
    },
    {
      "question": "In the carbon cycle, which process is primarily responsible for removing carbon dioxide from the atmosphere?",
      "options": ["Respiration", "Combustion", "Photosynthesis", "Decomposition"],
      "correctAnswer": "Photosynthesis",
      "difficulty": "easy",
      "explanation": "Green plants use carbon dioxide from the atmosphere to produce glucose during photosynthesis, effectively 'fixing' the carbon."
    },
    {
      "question": "What is the primary role of nitrogen-fixing bacteria in the nitrogen cycle?",
      "options": [
        "To convert atmospheric nitrogen (N2) into ammonia (NH3) or nitrates.",
        "To convert nitrates back into atmospheric nitrogen gas.",
        "To decompose dead organic matter into carbon dioxide.",
        "To release nitrogen from rocks into the soil."
      ],
      "correctAnswer": "To convert atmospheric nitrogen (N2) into ammonia (NH3) or nitrates.",
      "difficulty": "moderate",
      "explanation": "Nitrogen fixation is the process of converting unreactive atmospheric nitrogen into reactive forms that plants can absorb."
    },
    {
      "question": "The phosphorous cycle is unique among the major nutrient cycles because it does NOT include a significant phase in the:",
      "options": ["Hydrosphere (Water)", "Lithosphere (Rocks)", "Atmosphere (Air)", "Biosphere (Living things)"],
      "correctAnswer": "Atmosphere (Air)",
      "difficulty": "moderate",
      "explanation": "Phosphorus does not circulate through the atmosphere as a gas; it stays mainly in land, rock, and water."
    },
    {
      "question": "Which human activity significantly increases the amount of carbon dioxide in the atmosphere?",
      "options": ["Reforestation", "Burning of fossil fuels", "Organic farming", "Water purification"],
      "correctAnswer": "Burning of fossil fuels",
      "difficulty": "easy",
      "explanation": "Combustion of coal, oil, and gas releases stored carbon into the atmosphere as CO2, contributing to the greenhouse effect."
    },
    {
      "question": "Identify the process where water changes from a gas (vapor) to a liquid, forming clouds.",
      "options": ["Sublimation", "Evaporation", "Condensation", "Infiltration"],
      "correctAnswer": "Condensation",
      "difficulty": "easy",
      "explanation": "Condensation occurs when water vapor cools down and turns back into liquid droplets."
    },
    {
      "question": "Assertion: Decomposers are essential for the continuation of nutrient cycles.\nReason: They break down dead organic matter, returning locked nutrients back to the soil or atmosphere.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "Without decomposers like bacteria and fungi, nutrients would remain trapped in dead organisms and would not be available for new life."
    },
    {
      "question": "Which of the following describes 'nitrification'?",
      "options": [
        "Conversion of nitrates to nitrogen gas.",
        "Conversion of ammonia into nitrites and then nitrates.",
        "Absorption of nitrogen by plant roots.",
        "Release of nitrogen through animal waste."
      ],
      "correctAnswer": "Conversion of ammonia into nitrites and then nitrates.",
      "difficulty": "moderate",
      "explanation": "Nitrification is a two-step process carried out by specialized soil bacteria to turn ammonia into nitrates."
    },
    {
      "question": "Leguminous plants (like beans and peas) are important in the nitrogen cycle because they:",
      "options": [
        "Release large amounts of oxygen into the soil.",
        "Have root nodules containing nitrogen-fixing bacteria.",
        "Prevent the phosphorous cycle from occurring.",
        "Absorb nitrogen directly through their leaves."
      ],
      "correctAnswer": "Have root nodules containing nitrogen-fixing bacteria.",
      "difficulty": "moderate",
      "explanation": "The symbiotic relationship between legumes and Rhizobium bacteria allows for efficient nitrogen fixation in the soil."
    },
    {
      "question": "What happens during 'denitrification'?",
      "options": [
        "Bacteria convert nitrates in the soil back into nitrogen gas (N2).",
        "Plants release nitrogen into the air during respiration.",
        "Lightning fixes nitrogen into the soil.",
        "Rain washes nitrates into the ocean."
      ],
      "correctAnswer": "Bacteria convert nitrates in the soil back into nitrogen gas (N2).",
      "difficulty": "moderate",
      "explanation": "Denitrifying bacteria operate in anaerobic conditions to return nitrogen to the atmosphere."
    },
    {
      "question": "Which of these is a reservoir for phosphorus?",
      "options": ["The clouds", "Sedimentary rocks", "The ozone layer", "The sun"],
      "correctAnswer": "Sedimentary rocks",
      "difficulty": "easy",
      "explanation": "The largest reservoir of phosphorus is in sedimentary rocks, from which it is released by weathering."
    },
    {
      "question": "Order the following steps of the water cycle starting from the ocean:",
      "orderCorrect": ["Evaporation", "Condensation", "Precipitation", "Surface runoff"],
      "difficulty": "moderate",
      "type": "ordering",
      "explanation": "Water evaporates from the sea, condenses into clouds, falls as rain (precipitation), and flows back to the sea via runoff."
    },
    {
      "question": "What is the result of 'eutrophication' caused by excessive nitrogen or phosphorus runoff?",
      "options": [
        "Increased oxygen levels in lakes.",
        "Rapid algal growth leading to oxygen depletion and death of aquatic life.",
        "Clearer water in ponds.",
        "Decrease in the number of decomposers."
      ],
      "correctAnswer": "Rapid algal growth leading to oxygen depletion and death of aquatic life.",
      "difficulty": "hard",
      "explanation": "Nutrient runoff causes 'algal blooms'; when the algae die, decomposers use up all the oxygen, killing fish."
    },
    {
      "question": "Which process returns carbon to the atmosphere as a byproduct of breaking down glucose for energy in living cells?",
      "options": ["Photosynthesis", "Cellular Respiration", "Ingestion", "Egestion"],
      "correctAnswer": "Cellular Respiration",
      "difficulty": "moderate",
      "explanation": "Both plants and animals release CO2 as a waste product of aerobic respiration."
    },
    {
      "question": "True or False: Most organisms can use nitrogen gas (N2) directly from the atmosphere.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "N2 gas is very stable; most organisms can only use nitrogen when it is fixed into forms like nitrates or ammonium."
    },
    {
      "question": "What is the primary source of energy that drives the water cycle?",
      "options": ["Geothermal heat", "The Sun", "Wind energy", "Ocean currents"],
      "correctAnswer": "The Sun",
      "difficulty": "easy",
      "explanation": "Solar energy powers evaporation and the movement of air masses that carry water vapor."
    },
    {
      "question": "In the nitrogen cycle, 'ammonification' refers to:",
      "options": [
        "The process of making ammonia from atmospheric nitrogen by lightning.",
        "The conversion of organic nitrogen from dead organisms into ammonia by decomposers.",
        "The industrial production of fertilizers.",
        "The absorption of ammonia by plant roots."
      ],
      "correctAnswer": "The conversion of organic nitrogen from dead organisms into ammonia by decomposers.",
      "difficulty": "hard",
      "explanation": "Decomposers break down proteins and DNA in dead matter, releasing nitrogen as ammonium/ammonia."
    },
    {
      "question": "Select ALL processes that release Carbon Dioxide into the atmosphere:",
      "multiSelect": true,
      "options": ["Photosynthesis", "Volcanic eruptions", "Respiration", "Combustion", "Decomposition"],
      "correctAnswer": ["Volcanic eruptions", "Respiration", "Combustion", "Decomposition"],
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "Photosynthesis is the only process listed that *removes* CO2; the others all release it."
    },
    {
      "question": "How does 'weathering' contribute to the phosphorous cycle?",
      "options": [
        "It turns phosphorus into a gas.",
        "It breaks down rocks, releasing phosphate ions into the soil and water.",
        "It causes plants to absorb phosphorus faster.",
        "It prevents phosphorus from entering the ocean."
      ],
      "correctAnswer": "It breaks down rocks, releasing phosphate ions into the soil and water.",
      "difficulty": "moderate",
      "explanation": "Rain and wind erode rocks, which are the primary source of phosphorus for ecosystems."
    },
    {
      "question": "The term 'carbon sink' refers to:",
      "options": [
        "A place where carbon is stored for long periods, like forests or oceans.",
        "A machine used to clean carbon from the air.",
        "The kitchen sink where carbon accumulates.",
        "A process that releases carbon into the air."
      ],
      "correctAnswer": "A place where carbon is stored for long periods, like forests or oceans.",
      "difficulty": "moderate",
      "explanation": "Carbon sinks (oceans, forests, peatlands) absorb more CO2 than they release, helping regulate the climate."
    },
    {
      "question": "Which of the following is a way phosphorus enters the food chain?",
      "options": [
        "Animals breathe in phosphorus from the air.",
        "Plants absorb dissolved phosphates from the soil through their roots.",
        "Bacteria fix phosphorus gas from the clouds.",
        "Phosphorus is produced by plants during photosynthesis."
      ],
      "correctAnswer": "Plants absorb dissolved phosphates from the soil through their roots.",
      "difficulty": "moderate",
      "explanation": "Phosphorus enters the biotic part of the cycle when producers (plants) take up inorganic phosphate."
    },
    {
      "question": "What is 'aquifer' in the context of the water cycle?",
      "options": [
        "A type of cloud that produces heavy rain.",
        "An underground layer of water-bearing rock or sediment.",
        "The process of water evaporating from the ocean.",
        "A machine used to measure rainfall."
      ],
      "correctAnswer": "An underground layer of water-bearing rock or sediment.",
      "difficulty": "moderate",
      "explanation": "Groundwater is stored in aquifers, which can be tapped for human use."
    },
    {
      "question": "In the carbon cycle, what happens to the remains of organisms that do not decompose completely over millions of years?",
      "options": [
        "They turn into water.",
        "They disappear into space.",
        "They form fossil fuels like coal, oil, and gas.",
        "They are converted into oxygen by rocks."
      ],
      "correctAnswer": "They form fossil fuels like coal, oil, and gas.",
      "difficulty": "easy",
      "explanation": "Fossilization traps carbon underground for geological time scales."
    },
    {
      "question": "Which form of nitrogen is most easily absorbed and used by most plants?",
      "options": ["Nitrogen gas (N2)", "Nitrates (NO3-)", "Nitrites (NO2-)", "Organic nitrogen in proteins"],
      "correctAnswer": "Nitrates (NO3-)",
      "difficulty": "moderate",
      "explanation": "Plants primarily take up nitrogen in the form of nitrates from the soil solution."
    },
    {
      "question": "Case Study: A farmer notices her crops are yellowish and stunted. She adds a fertilizer rich in nitrates. Which cycle is she intervening in?",
      "options": ["Carbon cycle", "Nitrogen cycle", "Phosphorous cycle", "Water cycle"],
      "correctAnswer": "Nitrogen cycle",
      "difficulty": "easy",
      "type": "caseBased",
      "explanation": "Nitrates are a key component of the nitrogen cycle, and nitrogen deficiency often causes yellowing (chlorosis) in plants."
    },
    {
      "question": "What role does lightning play in the nitrogen cycle?",
      "options": [
        "It kills denitrifying bacteria.",
        "It provides energy to convert atmospheric N2 into nitrogen oxides that fall with rain.",
        "It evaporates water containing nitrogen.",
        "It helps plants absorb phosphorus."
      ],
      "correctAnswer": "It provides energy to convert atmospheric N2 into nitrogen oxides that fall with rain.",
      "difficulty": "hard",
      "explanation": "Atmospheric fixation occurs via lightning, which has enough energy to break the strong triple bonds of N2 gas."
    },
    {
      "question": "Phosphorus is a critical component of which biological molecules?",
      "options": ["Glucose and starch", "DNA, RNA, and ATP", "Water and Carbon Dioxide", "Hemoglobin"],
      "correctAnswer": ["DNA, RNA, and ATP"],
      "multiSelect": true,
      "difficulty": "hard",
      "explanation": "Phosphorus forms the backbone of nucleic acids and the energy-carrying phosphate groups in ATP."
    },
    {
      "question": "Which of the following processes is part of the 'short-term' carbon cycle?",
      "options": ["Formation of limestone", "Photosynthesis and Respiration", "Formation of fossil fuels", "Weathering of silicate rocks"],
      "correctAnswer": "Photosynthesis and Respiration",
      "difficulty": "moderate",
      "explanation": "Biological processes cycle carbon quickly (days to years), whereas geological processes take millions of years."
    },
    {
      "question": "What is 'infiltration'?",
      "options": [
        "Water turning into vapor.",
        "The movement of water into the soil from the surface.",
        "The flow of water in rivers.",
        "Plants taking up water through roots."
      ],
      "correctAnswer": "The movement of water into the soil from the surface.",
      "difficulty": "easy",
      "explanation": "Infiltration describes how precipitation soaks into the ground to become soil moisture or groundwater."
    },
    {
      "question": "Assertion: The nitrogen cycle is largely a 'gaseous' cycle, while the phosphorous cycle is a 'sedimentary' cycle.\nReason: Nitrogen has a major reservoir in the atmosphere, while phosphorus is mainly stored in crustal rocks.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "This distinction describes where the bulk of the nutrient is stored and how it moves through the environment."
    },
    {
      "question": "Why is 'leaching' a problem in the nitrogen cycle?",
      "options": [
        "It makes the soil too dry.",
        "It washes soluble nitrates out of the soil into water bodies, causing pollution.",
        "It prevents nitrogen from turning into gas.",
        "It increases the number of bacteria in the soil."
      ],
      "correctAnswer": "It washes soluble nitrates out of the soil into water bodies, causing pollution.",
      "difficulty": "moderate",
      "explanation": "Nitrates are very soluble and easily washed away by rain, leading to nutrient loss in soil and pollution in rivers."
    },
    {
      "question": "The conversion of nitrates (NO3-) to nitrites (NO2-) and eventually to ammonia (NH3) within a plant is called:",
      "options": ["Assimilation", "Nitrification", "Nitrogen Fixation", "Ammonification"],
      "correctAnswer": "Assimilation",
      "difficulty": "hard",
      "explanation": "Assimilation is the process where plants incorporate inorganic nitrogen into organic molecules like proteins."
    },
    {
      "question": "Which of these is a way that humans can help balance the carbon cycle?",
      "options": ["Deforestation", "Increasing the use of coal", "Planting trees (Afforestation)", "Building more factories"],
      "correctAnswer": "Planting trees (Afforestation)",
      "difficulty": "easy",
      "explanation": "Trees act as carbon sinks, pulling CO2 out of the atmosphere through photosynthesis."
    },
    {
      "question": "What would happen to the phosphorous cycle if all decomposers were removed?",
      "options": [
        "Phosphorus would cycle faster.",
        "Phosphorus would stop being returned from dead organic matter to the soil.",
        "Rocks would weather faster.",
        "Plants would produce their own phosphorus."
      ],
      "correctAnswer": "Phosphorus would stop being returned from dead organic matter to the soil.",
      "difficulty": "moderate",
      "explanation": "Decomposers are responsible for recycling phosphorus from the biotic (living) back to the abiotic (soil) part of the cycle."
    },
    {
      "question": "True or False: The total amount of water on Earth remains relatively constant due to the water cycle.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "The water cycle is a closed system; water changes state and location but is not created or destroyed."
    },
    {
      "question": "Which of the following is NOT a form of precipitation?",
      "options": ["Rain", "Snow", "Mist/Fog", "Hail"],
      "correctAnswer": "Mist/Fog",
      "difficulty": "moderate",
      "type": "negative",
      "explanation": "While mist and fog involve liquid water droplets, they are suspended in the air. Precipitation refers to water falling to the ground."
    },
    {
      "question": "How do animals obtain the nitrogen they need for building proteins?",
      "options": [
        "By breathing it from the air.",
        "By drinking water with dissolved nitrates.",
        "By eating plants or other animals.",
        "By absorbing it through their skin."
      ],
      "correctAnswer": "By eating plants or other animals.",
      "difficulty": "easy",
      "explanation": "Consumers get their nitrogen in organic form (amino acids/proteins) through their diet."
    },
    {
      "question": "In the carbon cycle, what is the role of the oceans?",
      "options": [
        "They only release carbon dioxide.",
        "They act as a major carbon sink by dissolving CO2 from the atmosphere.",
        "They have no role in the carbon cycle.",
        "They convert carbon into nitrogen."
      ],
      "correctAnswer": "They act as a major carbon sink by dissolving CO2 from the atmosphere.",
      "difficulty": "moderate",
      "explanation": "Oceans absorb a huge percentage of anthropogenic CO2, though this leads to ocean acidification."
    },
    {
      "question": "The process of 'guano' (seabird droppings) accumulation is associated with which cycle?",
      "options": ["Water cycle", "Nitrogen cycle", "Carbon cycle", "Phosphorous cycle"],
      "correctAnswer": "Phosphorous cycle",
      "difficulty": "hard",
      "explanation": "Guano is extremely rich in phosphorus and was historically mined as a major source of fertilizer."
    },
    {
      "question": "Identify the 'error' in this nitrogen cycle sequence: N2 -> Ammonia -> Nitrates -> Nitrites -> N2.",
      "options": [
        "Ammonia cannot come from N2.",
        "Nitrates are usually formed *after* nitrites.",
        "Nitrites cannot turn into N2.",
        "There is no error."
      ],
      "correctAnswer": "Nitrates are usually formed *after* nitrites.",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "In nitrification, ammonia is first converted to nitrites (by Nitrosomonas) and then to nitrates (by Nitrobacter)."
    },
    {
      "question": "What is 'surface runoff'?",
      "options": [
        "Water that evaporates from the soil.",
        "Water that flows over the land surface into streams and rivers.",
        "Water that plants release.",
        "Water stored in the atmosphere."
      ],
      "correctAnswer": "Water that flows over the land surface into streams and rivers.",
      "difficulty": "easy",
      "explanation": "Runoff occurs when the soil is saturated or the surface is impermeable, leading to water flow across the ground."
    },
    {
      "question": "During which process is 'energy' stored in carbon-based molecules?",
      "options": ["Respiration", "Combustion", "Photosynthesis", "Decomposition"],
      "correctAnswer": "Photosynthesis",
      "difficulty": "moderate",
      "explanation": "Photosynthesis converts solar energy into chemical energy stored in the bonds of glucose."
    },
    {
      "question": "Which of these bacteria are responsible for 'nitrogen fixation' in the soil?",
      "options": ["Nitrobacter", "Nitrosomonas", "Rhizobium", "Denitrifiers"],
      "correctAnswer": "Rhizobium",
      "difficulty": "moderate",
      "explanation": "Rhizobium is the classic example of nitrogen-fixing bacteria found in legume root nodules."
    },
    {
      "question": "Situational Judgment: If a city experiences a massive increase in concrete buildings and paved roads, what happens to the water cycle in that area?",
      "options": [
        "Infiltration increases and runoff decreases.",
        "Infiltration decreases and surface runoff increases.",
        "Evaporation stops entirely.",
        "Precipitation will stop occurring over the city."
      ],
      "correctAnswer": "Infiltration decreases and surface runoff increases.",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Impermeable surfaces prevent water from soaking into the ground (infiltration), causing it to run off the surface instead, often leading to floods."
    },
    {
      "question": "What is the 'greenhouse effect' primarily caused by in the carbon cycle?",
      "options": [
        "The lack of oxygen in the air.",
        "Heat trapped by gases like CO2 in the atmosphere.",
        "The sun getting hotter.",
        "Plants producing too much glucose."
      ],
      "correctAnswer": "Heat trapped by gases like CO2 in the atmosphere.",
      "difficulty": "easy",
      "explanation": "Greenhouse gases reflect infrared radiation back to Earth's surface, warming the planet."
    },
    {
      "question": "What is the main difference between 'evaporation' and 'transpiration'?",
      "options": [
        "Evaporation happens in plants, transpiration in oceans.",
        "Evaporation is a biological process, transpiration is physical.",
        "Evaporation is from water bodies/soil; transpiration is from living plants.",
        "There is no difference."
      ],
      "correctAnswer": "Evaporation is from water bodies/soil; transpiration is from living plants.",
      "difficulty": "moderate",
      "explanation": "Both turn liquid water into vapor, but the source (living tissue vs. non-living surface) differs."
    }
  ],
   "Unit 4: Effects of human activities on ecosystems 1": [
    {
      "question": "Which of the following is the primary reason for the recent rapid increase in global food production?",
      "options": ["Decrease in human population", "Improved agricultural technologies and use of fertilizers", "Reduction in the use of irrigation", "Shift from monoculture to subsistence farming"],
      "correctAnswer": "Improved agricultural technologies and use of fertilizers",
      "difficulty": "easy",
      "explanation": "Modern agriculture utilizes machinery, chemical fertilizers, herbicides, and selective breeding to maximize food yield for a growing population."
    },
    {
      "question": "Large-scale monoculture of crop plants often leads to which of the following ecological problems?",
      "options": ["Increased genetic diversity", "Decrease in pest populations", "Reduction in biodiversity", "Natural restoration of soil nutrients"],
      "correctAnswer": "Reduction in biodiversity",
      "difficulty": "easy",
      "explanation": "Monoculture involves growing only one species over a vast area, which removes the variety of plants and animals that would naturally live there."
    },
    {
      "question": "What is the main environmental concern regarding intensive livestock production?",
      "options": ["It requires very little land", "The production of large amounts of methane and waste runoff", "It increases the number of wild predators", "It uses no water"],
      "correctAnswer": "The production of large amounts of methane and waste runoff",
      "difficulty": "moderate",
      "explanation": "Intensive farming concentrates animals, leading to high levels of waste that can pollute water and methane gas which contributes to global warming."
    },
    {
      "question": "The process where a water body becomes overly enriched with nutrients, leading to excessive growth of algae, is called:",
      "options": ["Biomagnification", "Eutrophication", "Nitrification", "Desertification"],
      "correctAnswer": "Eutrophication",
      "difficulty": "easy",
      "explanation": "Runoff of fertilizers or sewage into water provides excess nitrates and phosphates, causing algal blooms that deplete oxygen."
    },
    {
      "question": "Which human activity is the leading cause of habitat destruction worldwide?",
      "options": ["Industrial fishing", "Agriculture and land conversion", "Urban gardening", "Recycling programs"],
      "correctAnswer": "Agriculture and land conversion",
      "difficulty": "easy",
      "explanation": "Clearing forests and wetlands to create space for crops and livestock is the single largest cause of habitat loss."
    },
    {
      "question": "What is 'biomagnification' (or bioaccumulation)?",
      "options": [
        "The increase in size of organisms in a population.",
        "The increasing concentration of a toxic chemical in the tissues of organisms at higher trophic levels.",
        "The process of plants absorbing nutrients from the soil.",
        "The growth of bacteria in a laboratory setting."
      ],
      "correctAnswer": "The increasing concentration of a toxic chemical in the tissues of organisms at higher trophic levels.",
      "difficulty": "moderate",
      "explanation": "Persistent chemicals like DDT or mercury are not broken down; they accumulate and become more concentrated as they move up the food chain."
    },
    {
      "question": "Assertion: Deforestation contributes to global warming.\nReason: Trees absorb carbon dioxide during photosynthesis; removing them increases the concentration of CO2 in the atmosphere.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "Trees act as carbon sinks. When they are cut or burned, that storage is lost and the carbon is released back into the air."
    },
    {
      "question": "Which pollutant is primarily responsible for the formation of acid rain?",
      "options": ["Carbon dioxide", "Sulfur dioxide", "Methane", "CFCs"],
      "correctAnswer": "Sulfur dioxide",
      "difficulty": "moderate",
      "explanation": "Sulfur dioxide and nitrogen oxides from burning fossil fuels react with water vapor in the atmosphere to form sulfuric and nitric acids."
    },
    {
      "question": "What is the impact of 'soil erosion' caused by overgrazing?",
      "options": ["Improved soil fertility", "Loss of the nutrient-rich topsoil layer", "Faster plant growth", "Lower water evaporation"],
      "correctAnswer": "Loss of the nutrient-rich topsoil layer",
      "difficulty": "moderate",
      "explanation": "When vegetation is removed, wind and rain easily carry away the topsoil, which contains the most organic matter and nutrients."
    },
    {
      "question": "In the context of pollution, what does 'leaching' refer to?",
      "options": [
        "The process of planting trees in a circle.",
        "The washing away of soluble nutrients or chemicals from the soil into groundwater or rivers.",
        "The way insects eat crop leaves.",
        "The conversion of solar energy into chemical energy."
      ],
      "correctAnswer": "The washing away of soluble nutrients or chemicals from the soil into groundwater or rivers.",
      "difficulty": "moderate",
      "explanation": "Leaching often occurs when it rains heavily on fields treated with chemical fertilizers, moving pollutants into water systems."
    },
    {
      "question": "Select ALL that are negative impacts of large-scale monoculture:",
      "multiSelect": true,
      "options": [
        "Increased risk of total crop failure from a single disease",
        "Higher soil nutrient depletion",
        "Increased genetic diversity of the crop",
        "Heavy reliance on chemical pesticides",
        "Creation of complex food webs"
      ],
      "correctAnswer": ["Increased risk of total crop failure from a single disease", "Higher soil nutrient depletion", "Heavy reliance on chemical pesticides"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Monocultures lack variety, making them vulnerable to specific pests and requiring intensive chemical input to maintain yields."
    },
    {
      "question": "Which of the following is a non-biodegradable pollutant?",
      "options": ["Food waste", "Paper", "Plastic bottles", "Animal manure"],
      "correctAnswer": "Plastic bottles",
      "difficulty": "easy",
      "explanation": "Non-biodegradable materials cannot be broken down by natural decomposers and persist in the environment for centuries."
    },
    {
      "question": "What happens to aquatic life during a 'fish kill' caused by eutrophication?",
      "options": [
        "They die because they have too much food.",
        "They die due to a lack of dissolved oxygen in the water.",
        "They grow larger because the water is warmer.",
        "They migrate to the ocean to find more salt."
      ],
      "correctAnswer": "They die due to a lack of dissolved oxygen in the water.",
      "difficulty": "moderate",
      "explanation": "When the massive algal bloom dies, decomposers (bacteria) use up the oxygen to break down the algae, leaving none for the fish."
    },
    {
      "question": "Case Study: In a valley, a forest is replaced by a large coffee plantation. Local birds that nested in the forest disappear. This is an example of:",
      "options": ["Natural selection", "Habitat destruction", "Pollution", "Climate change"],
      "correctAnswer": "Habitat destruction",
      "difficulty": "easy",
      "type": "caseBased",
      "explanation": "Replacing a natural ecosystem with a man-made one destroys the homes and resources of the original species."
    },
    {
      "question": "True or False: Using insecticides always helps the environment by killing pests.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Insecticides often kill beneficial insects (like bees) and can accumulate in the food chain, causing harm to higher-level consumers."
    },
    {
      "question": "Which of these is a greenhouse gas primarily released by rice paddies and cattle?",
      "options": ["Oxygen", "Nitrogen", "Methane", "Argon"],
      "correctAnswer": "Methane",
      "difficulty": "moderate",
      "explanation": "Anaerobic bacteria in flooded rice fields and the digestive systems of ruminants produce methane (CH4)."
    },
    {
      "question": "What is the main goal of 'sustainable' agriculture?",
      "options": [
        "To produce as much food as possible regardless of environmental cost.",
        "To produce food while protecting resources for future generations.",
        "To stop using all technology and return to primitive farming.",
        "To only grow food in laboratories."
      ],
      "correctAnswer": "To produce food while protecting resources for future generations.",
      "difficulty": "moderate",
      "explanation": "Sustainability balances current human needs with the health of the ecosystem to ensure long-term viability."
    },
    {
      "question": "Which of the following describes the 'edge effect' in habitat fragmentation?",
      "options": [
        "The center of a forest is always the safest.",
        "Species at the boundaries of a fragment are exposed to different conditions and more predators.",
        "Fragmented habitats have more resources than continuous ones.",
        "The edges of a habitat are immune to pollution."
      ],
      "correctAnswer": "Species at the boundaries of a fragment are exposed to different conditions and more predators.",
      "difficulty": "hard",
      "explanation": "Fragmentation increases the 'edge' of a habitat, where environment-sensitive species are more vulnerable to external threats."
    },
    {
      "question": "How do chemical fertilizers lead to soil degradation over time?",
      "options": [
        "They make the soil too soft.",
        "They can alter soil pH and kill beneficial microorganisms.",
        "They turn the soil into water.",
        "They prevent rain from reaching the roots."
      ],
      "correctAnswer": "They can alter soil pH and kill beneficial microorganisms.",
      "difficulty": "moderate",
      "explanation": "Over-reliance on chemicals can destroy the natural biological health of the soil, making it less productive in the long run."
    },
    {
      "question": "The use of herbicides is intended to:",
      "options": ["Kill insect pests", "Kill fungal diseases", "Kill weeds that compete with crops", "Increase the rate of photosynthesis"],
      "correctAnswer": "Kill weeds that compete with crops",
      "difficulty": "easy",
      "explanation": "Herbicides are chemicals used to eliminate unwanted plants (weeds) in agricultural fields."
    },
    {
      "question": "What is the 'Green Revolution'?",
      "options": [
        "A political movement to plant more flowers.",
        "A period of significant increase in agricultural productivity due to new technologies.",
        "The natural change of seasons.",
        "A process where the sky turns green due to pollution."
      ],
      "correctAnswer": "A period of significant increase in agricultural productivity due to new technologies.",
      "difficulty": "moderate",
      "explanation": "The Green Revolution introduced high-yield varieties and modern techniques that transformed global food supply."
    },
    {
      "question": "Identify the primary source of 'marine plastic pollution'.",
      "options": ["Natural volcanic activity", "Improper waste management on land", "Fish scales", "Underwater plants"],
      "correctAnswer": "Improper waste management on land",
      "difficulty": "easy",
      "explanation": "Most plastic in the ocean comes from land-based sources where waste is not recycled or contained correctly."
    },
    {
      "question": "Which of these is a likely result of 'acid rain' on a forest ecosystem?",
      "options": [
        "Trees grow much taller.",
        "Leaves are damaged and soil nutrients like calcium are leached away.",
        "The soil becomes more alkaline.",
        "Pests are killed, helping the trees."
      ],
      "correctAnswer": "Leaves are damaged and soil nutrients like calcium are leached away.",
      "difficulty": "hard",
      "explanation": "Acid rain lowers the pH of the soil, which can dissolve and wash away essential nutrients while releasing toxic metals like aluminum."
    },
    {
      "question": "Fill in the blank: _____ is the clearing of forests to provide land for other uses.",
      "options": ["Afforestation", "Deforestation", "Reforestation", "Transpiration"],
      "correctAnswer": "Deforestation",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Deforestation is a major contributor to loss of biodiversity and climate change."
    },
    {
      "question": "Why are top predators (like eagles or sharks) most affected by bioaccumulation?",
      "options": [
        "They are the weakest organisms.",
        "They eat large quantities of prey that already contain accumulated toxins.",
        "They live longer than plants.",
        "They are allergic to chemicals."
      ],
      "correctAnswer": "They eat large quantities of prey that already contain accumulated toxins.",
      "difficulty": "moderate",
      "explanation": "Because they are at the top of the food chain, they consume the sum total of toxins accumulated in all the levels below them."
    },
    {
      "question": "Which of the following describes 'urbanization'?",
      "options": [
        "Increasing the number of farms.",
        "The movement of people from rural areas to cities, leading to city growth.",
        "Protecting wild animals in parks.",
        "The process of water freezing."
      ],
      "correctAnswer": "The movement of people from rural areas to cities, leading to city growth.",
      "difficulty": "easy",
      "explanation": "Urbanization often leads to the destruction of surrounding natural habitats to make room for infrastructure."
    },
    {
      "question": "Order the steps of Eutrophication:",
      "orderCorrect": [
        "Nutrient runoff enters water",
        "Algal bloom occurs",
        "Algae die and sink",
        "Bacteria decompose algae and use up oxygen",
        "Fish die from lack of oxygen"
      ],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "This sequence shows how nutrient pollution leads to a 'dead zone' in aquatic environments."
    },
    {
      "question": "What is 'organic' farming?",
      "options": [
        "Farming that uses only machines.",
        "Farming that avoids synthetic fertilizers and pesticides.",
        "Farming in space.",
        "Farming without any water."
      ],
      "correctAnswer": "Farming that avoids synthetic fertilizers and pesticides.",
      "difficulty": "moderate",
      "explanation": "Organic farming focuses on natural processes and biological controls to maintain soil health and manage pests."
    },
    {
      "question": "Which pollutant is a primary cause of the 'ozone layer' depletion?",
      "options": ["Nitrogen gas", "Carbon dioxide", "Chlorofluorocarbons (CFCs)", "Water vapor"],
      "correctAnswer": "Chlorofluorocarbons (CFCs)",
      "difficulty": "moderate",
      "explanation": "CFCs from old refrigerators and aerosols reach the stratosphere and break down ozone molecules."
    },
    {
      "question": "How does 'monoculture' affect the food web of an area?",
      "options": [
        "It makes the food web more complex.",
        "It simplifies the food web, reducing the number of interconnections.",
        "It has no effect on the food web.",
        "It creates more niches for different animals."
      ],
      "correctAnswer": "It simplifies the food web, reducing the number of interconnections.",
      "difficulty": "moderate",
      "explanation": "By providing only one type of producer, only a few specific consumers can survive, leading to a fragile and simple ecosystem."
    },
    {
      "question": "Situational Judgment: A company proposes building a dam on a river. Which group of organisms is most likely to suffer first from habitat fragmentation?",
      "options": ["Migratory fish", "Birds that fly over the river", "Bacteria in the soil", "Small insects in the air"],
      "correctAnswer": "Migratory fish",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "A dam physically blocks the movement of fish that need to travel upstream or downstream to spawn or find food."
    },
    {
      "question": "Which of the following is a symptom of 'desertification'?",
      "options": ["Increase in forest cover", "Expansion of arid, unproductive land", "Higher rainfall", "Higher biodiversity"],
      "correctAnswer": "Expansion of arid, unproductive land",
      "difficulty": "easy",
      "explanation": "Desertification occurs when once-productive land becomes desert-like due to drought or improper land use."
    },
    {
      "question": "True or False: Carbon monoxide is a poisonous gas produced by incomplete combustion of fossil fuels.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Carbon monoxide binds to hemoglobin in the blood, preventing oxygen transport, which can be fatal."
    },
    {
      "question": "What is the environmental impact of 'overfishing'?",
      "options": [
        "It helps the ocean clean itself.",
        "It disrupts marine food webs and can lead to the collapse of fish populations.",
        "It makes fish grow faster.",
        "It increases the amount of coral reefs."
      ],
      "correctAnswer": "It disrupts marine food webs and can lead to the collapse of fish populations.",
      "difficulty": "moderate",
      "explanation": "Removing fish faster than they can reproduce leads to population crashes and affects all organisms that depend on those fish."
    },
    {
      "question": "Which chemical is often found in large-scale livestock waste that contributes to eutrophication?",
      "options": ["Calcium", "Phosphates and Nitrates", "Glucose", "Iron"],
      "correctAnswer": "Phosphates and Nitrates",
      "difficulty": "moderate",
      "explanation": "Animal waste is high in nitrogen and phosphorus, which act as nutrients for algae in water bodies."
    },
    {
      "question": "What is 'slash-and-burn' agriculture?",
      "options": [
        "A modern way to harvest wheat.",
        "A traditional method of clearing land by cutting and burning vegetation.",
        "A way to produce plastic.",
        "A method of watering plants."
      ],
      "correctAnswer": "A traditional method of clearing land by cutting and burning vegetation.",
      "difficulty": "moderate",
      "explanation": "While it can be sustainable on a small scale, it causes massive habitat loss and CO2 release when practiced by large populations."
    },
    {
      "question": "Assertion: Noise pollution can affect animal behavior.\nReason: Many animals rely on sound for communication, mating, and avoiding predators.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Human noise (traffic, sonar, industry) can 'mask' natural sounds, making it hard for animals to survive."
    },
    {
      "question": "Which of these is a way to reduce the negative impact of agriculture on ecosystems?",
      "options": [
        "Increasing the use of chemical pesticides",
        "Integrated Pest Management (IPM) and crop rotation",
        "Clearing more forests for fields",
        "Switching entirely to monoculture"
      ],
      "correctAnswer": "Integrated Pest Management (IPM) and crop rotation",
      "difficulty": "moderate",
      "explanation": "IPM uses biological and physical controls alongside minimal chemicals to reduce environmental damage."
    },
    {
      "question": "The 'enhanced' greenhouse effect refers to:",
      "options": [
        "The natural warming of the Earth.",
        "The additional warming caused by human-produced greenhouse gases.",
        "The cooling of the Earth due to pollution.",
        "The reflection of all sunlight by clouds."
      ],
      "correctAnswer": "The additional warming caused by human-produced greenhouse gases.",
      "difficulty": "moderate",
      "explanation": "Human activities have increased gas concentrations, trapping more heat than the natural cycle would."
    },
    {
      "question": "Which of the following is a primary 'point source' of water pollution?",
      "options": ["Rainwater from a city street", "A factory discharge pipe", "Agricultural runoff from a whole county", "Wind-blown dust"],
      "correctAnswer": "A factory discharge pipe",
      "difficulty": "moderate",
      "explanation": "Point source pollution comes from a single, identifiable location."
    },
    {
      "question": "What is the role of 'wetlands' in preventing pollution?",
      "options": [
        "They have no role.",
        "They act as natural filters, trapping sediments and absorbing excess nutrients.",
        "They produce pollutants.",
        "They are just areas for mosquitoes to breed."
      ],
      "correctAnswer": "They act as natural filters, trapping sediments and absorbing excess nutrients.",
      "difficulty": "hard",
      "explanation": "Wetlands are critical 'ecosystem services' that clean water before it reaches larger lakes or oceans."
    },
    {
      "question": "In the context of the environment, what does 'mitigation' mean?",
      "options": [
        "Ignoring the problem.",
        "Actions taken to reduce the severity or impact of environmental damage.",
        "The process of making things worse.",
        "Moving to a different planet."
      ],
      "correctAnswer": "Actions taken to reduce the severity or impact of environmental damage.",
      "difficulty": "easy",
      "explanation": "Mitigation includes things like building water treatment plants or restoring forests."
    },
    {
      "question": "Which of these is a social effect of habitat destruction?",
      "options": [
        "Loss of medicinal plants used by local communities",
        "Increase in urban property prices",
        "Better internet access",
        "Discovery of new fossil fuels"
      ],
      "correctAnswer": "Loss of medicinal plants used by local communities",
      "difficulty": "moderate",
      "explanation": "Many humans rely directly on healthy ecosystems for food, medicine, and livelihoods."
    },
    {
      "question": "Identify the 'error' in this statement: 'Biomagnification only occurs with water-soluble chemicals.'",
      "options": [
        "Biomagnification doesn't exist.",
        "Biomagnification actually occurs with fat-soluble chemicals that stay in the body.",
        "Biomagnification only happens in plants.",
        "There is no error."
      ],
      "correctAnswer": "Biomagnification actually occurs with fat-soluble chemicals that stay in the body.",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "Fat-soluble toxins are stored in the fatty tissues of organisms and are not excreted, allowing them to accumulate up the food chain."
    },
    {
      "question": "True or False: Overpopulation is the root cause behind many of the negative human impacts on the ecosystem.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "More people require more food, space, and resources, leading to increased agriculture, habitat loss, and pollution."
    },
    {
      "question": "Which of the following is a way to conserve water in agriculture?",
      "options": ["Using open flood irrigation", "Drip irrigation", "Watering plants at midday", "Cutting down all surrounding trees"],
      "correctAnswer": "Drip irrigation",
      "difficulty": "moderate",
      "explanation": "Drip irrigation delivers water directly to the roots, minimizing waste through evaporation or runoff."
    },
    {
      "question": "The accumulation of plastic in the 'Great Pacific Garbage Patch' is an example of:",
      "options": ["Air pollution", "Marine pollution and the persistence of non-biodegradable waste", "Biodiversity", "Eutrophication"],
      "correctAnswer": "Marine pollution and the persistence of non-biodegradable waste",
      "difficulty": "moderate",
      "explanation": "Ocean currents concentrate plastic waste that does not break down, creating massive floating 'islands' of trash."
    }
  ],
   "Unit 5: Effects of human activities on ecosystems 2 (conservation and sustainability)": [
    {
      "question": "Which of the following best describes 'sustainable development'?",
      "options": [
        "Development that maximizes current profit regardless of the future.",
        "Development that meets the needs of the present without compromising the ability of future generations to meet theirs.",
        "A total stop to all industrial and agricultural expansion.",
        "The use of non-renewable resources at an accelerated rate."
      ],
      "correctAnswer": "Development that meets the needs of the present without compromising the ability of future generations to meet theirs.",
      "difficulty": "easy",
      "explanation": "Sustainable development balances economic growth with environmental protection and social equity for long-term survival."
    },
    {
      "question": "Which of these is considered a 'renewable' resource?",
      "options": ["Crude oil", "Natural gas", "Solar energy", "Coal"],
      "correctAnswer": "Solar energy",
      "difficulty": "easy",
      "explanation": "Renewable resources are those that are replenished naturally over short periods and cannot be exhausted by human use."
    },
    {
      "question": "In the process of sewage treatment, what is the primary purpose of the 'screening' stage?",
      "options": [
        "To add chlorine to kill bacteria.",
        "To remove large floating objects like sticks, rags, and plastic.",
        "To allow bacteria to break down organic matter.",
        "To settle out fine sand and grit."
      ],
      "correctAnswer": "To remove large floating objects like sticks, rags, and plastic.",
      "difficulty": "moderate",
      "explanation": "Screening is the first physical step in sewage treatment to prevent damage to machinery and blockages in pipes."
    },
    {
      "question": "Which of the following is an example of 'recycling' rather than 'reusing'?",
      "options": [
        "Washing a jam jar and using it to store spices.",
        "Melting down old glass bottles to make new glass jars.",
        "Giving old clothes to a younger sibling.",
        "Using an old car tire as a garden planter."
      ],
      "correctAnswer": "Melting down old glass bottles to make new glass jars.",
      "difficulty": "moderate",
      "explanation": "Recycling involves processing waste materials into new products, whereas reusing involves using an item again in its original form."
    },
    {
      "question": "What is the primary goal of conserving endangered species?",
      "options": [
        "To keep animals in cages for entertainment.",
        "To prevent the extinction of species and maintain biodiversity.",
        "To increase the price of rare animal products.",
        "To replace natural habitats with modern zoos."
      ],
      "correctAnswer": "To prevent the extinction of species and maintain biodiversity.",
      "difficulty": "easy",
      "explanation": "Conservation efforts aim to protect species whose populations have reached critically low levels, ensuring ecosystem stability."
    },
    {
      "question": "Which international organization is famous for creating the 'Red List' of threatened species?",
      "options": ["WHO", "UNESCO", "IUCN", "WTO"],
      "correctAnswer": "IUCN",
      "difficulty": "moderate",
      "explanation": "The International Union for Conservation of Nature (IUCN) maintains the most comprehensive list of the global conservation status of species."
    },
    {
      "question": "In sewage treatment, what happens during the 'secondary treatment' (biological) stage?",
      "options": [
        "Large stones are filtered out.",
        "Microorganisms decompose the dissolved organic matter.",
        "Heavy metals are chemically precipitated.",
        "Water is evaporated to remove salt."
      ],
      "correctAnswer": "Microorganisms decompose the dissolved organic matter.",
      "difficulty": "hard",
      "explanation": "Secondary treatment uses aerobic or anaerobic bacteria to break down organic waste into harmless substances."
    },
    {
      "question": "Which of the following is a requirement for successful sustainable development?",
      "options": [
        "High rates of deforestation for timber export.",
        "Active participation of local communities in resource management.",
        "Ignoring environmental laws to favor industrial growth.",
        "Total reliance on fossil fuels for energy."
      ],
      "correctAnswer": "Active participation of local communities in resource management.",
      "difficulty": "moderate",
      "explanation": "Sustainable development requires social inclusion and the cooperation of the people who interact with the resources daily."
    },
    {
      "question": "What is a 'seed bank'?",
      "options": [
        "A place where farmers buy seeds at high interest rates.",
        "A facility that stores seeds to preserve genetic diversity of plants.",
        "A garden where only one type of crop is grown.",
        "A natural forest where seeds fall on the ground."
      ],
      "correctAnswer": "A facility that stores seeds to preserve genetic diversity of plants.",
      "difficulty": "easy",
      "explanation": "Seed banks are a form of ex-situ conservation used to protect plant species from extinction due to habitat loss or climate change."
    },
    {
      "question": "Which of these is a benefit of conservation programmes?",
      "options": [
        "Reduced opportunities for ecotourism.",
        "Protection of ecosystem services like water purification and pollination.",
        "Increased rate of species extinction.",
        "Expansion of industrial waste sites."
      ],
      "correctAnswer": "Protection of ecosystem services like water purification and pollination.",
      "difficulty": "moderate",
      "explanation": "Conservation ensures that the natural processes we rely on for survival, such as clean water and air, continue to function."
    },
    {
      "question": "Assertion: Captive breeding programs are essential for some endangered species.\nReason: They allow species to reproduce in a protected environment when their natural habitat is too dangerous or destroyed.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "Captive breeding (in zoos or sanctuaries) helps increase numbers of critically endangered animals before potential reintroduction to the wild."
    },
    {
      "question": "Which stage of sewage treatment involves adding chlorine or using UV light?",
      "options": ["Primary treatment", "Tertiary treatment/Disinfection", "Screening", "Sedimentation"],
      "correctAnswer": "Tertiary treatment/Disinfection",
      "difficulty": "moderate",
      "explanation": "Disinfection is the final step to kill any remaining pathogens (disease-causing organisms) before water is released."
    },
    {
      "question": "The 'polluter-pays' principle is a tool for:",
      "options": ["Resource depletion", "Environmental legislation and sustainability", "Increasing industrial pollution", "Encouraging waste production"],
      "correctAnswer": "Environmental legislation and sustainability",
      "difficulty": "easy",
      "explanation": "This principle holds parties responsible for the costs of managing the pollution they create, incentivizing cleaner practices."
    },
    {
      "question": "Which of the following describes 'ex-situ' conservation?",
      "options": [
        "Conserving a species in its natural habitat (e.g., National Park).",
        "Conserving a species outside its natural habitat (e.g., Zoo or Seed Bank).",
        "Allowing a species to go extinct naturally.",
        "Introducing a foreign species to a new environment."
      ],
      "correctAnswer": "Conserving a species outside its natural habitat (e.g., Zoo or Seed Bank).",
      "difficulty": "moderate",
      "explanation": "Ex-situ means 'off-site'—protecting an endangered species away from its natural area."
    },
    {
      "question": "True or False: Sustainable development only focuses on protecting the environment.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Sustainable development has three pillars: environmental protection, economic viability, and social equity."
    },
    {
      "question": "Which of these is a major threat to the Mountain Gorillas in Rwanda?",
      "options": ["Overabundance of food", "Habitat loss and poaching", "Too much ecotourism", "Lack of scientists"],
      "correctAnswer": "Habitat loss and poaching",
      "difficulty": "easy",
      "explanation": "Fragmentation of forest habitat and illegal hunting remain the primary threats to large primates."
    },
    {
      "question": "Why is 'sludge' from sewage treatment plants sometimes used in agriculture?",
      "options": [
        "It is toxic and kills all insects.",
        "It is rich in organic matter and nutrients that can act as fertilizer.",
        "It turns the soil into plastic.",
        "It prevents the plants from needing water."
      ],
      "correctAnswer": "It is rich in organic matter and nutrients that can act as fertilizer.",
      "difficulty": "moderate",
      "explanation": "Treated sludge (biosolids) can be recycled as a soil conditioner if it is free from heavy metals and pathogens."
    },
    {
      "question": "Which of the following is a non-renewable resource?",
      "options": ["Wind", "Biomass", "Phosphates (mined)", "Water"],
      "correctAnswer": "Phosphates (mined)",
      "difficulty": "moderate",
      "explanation": "Mineral deposits like phosphates are finite and take millions of years to form, making them non-renewable on a human timescale."
    },
    {
      "question": "What is the primary benefit of 'ecotourism'?",
      "options": [
        "It allows hunters to pay for permits.",
        "It provides economic income for local communities while encouraging the protection of nature.",
        "It replaces all farming in the country.",
        "It ensures that animals become used to human food."
      ],
      "correctAnswer": "It provides economic income for local communities while encouraging the protection of nature.",
      "difficulty": "moderate",
      "explanation": "Ecotourism creates a financial incentive for conservation by making live animals and intact forests more valuable than dead ones."
    },
    {
      "question": "Identify the 'error' in this waste management hierarchy (from most preferred to least preferred): Recycling -> Reuse -> Reduction -> Disposal.",
      "options": [
        "Disposal should be first.",
        "Reduction should be first, followed by Reuse, then Recycle.",
        "Recycling is better than Reduction.",
        "There is no error."
      ],
      "correctAnswer": "Reduction should be first, followed by Reuse, then Recycle.",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "The waste hierarchy starts with 'Refuse/Reduce' (not creating waste), then 'Reuse', and only then 'Recycle' for what remains."
    },
    {
      "question": "In Rwanda, the ban on plastic bags is an example of:",
      "options": [
        "Sustainable resource management and waste reduction.",
        "A way to increase government profit.",
        "A program to stop people from shopping.",
        "In-situ conservation of insects."
      ],
      "correctAnswer": "Sustainable resource management and waste reduction.",
      "difficulty": "easy",
      "explanation": "By banning non-biodegradable bags, the country reduces litter and long-term environmental pollution."
    },
    {
      "question": "What is 'In-situ' conservation?",
      "options": [
        "Keeping animals in a botanical garden.",
        "Protecting species in their natural environment by creating protected areas like Akagera National Park.",
        "Storing DNA in a freezer.",
        "Moving all wild animals to a city park."
      ],
      "correctAnswer": "Protecting species in their natural environment by creating protected areas like Akagera National Park.",
      "difficulty": "easy",
      "explanation": "In-situ means 'on-site'—conserving species within their ecosystems where they naturally occur."
    },
    {
      "question": "Which of the following contributes most to the sustainability of a forest?",
      "options": [
        "Clear-cutting all trees at once for timber.",
        "Selective logging (cutting only some trees) and replanting.",
        "Replacing the forest with a palm oil plantation.",
        "Burning the forest floor to clear weeds."
      ],
      "correctAnswer": "Selective logging (cutting only some trees) and replanting.",
      "difficulty": "moderate",
      "explanation": "Selective logging allows the forest ecosystem to remain intact while still providing resources."
    },
    {
      "question": "What is the main environmental risk of releasing untreated sewage into a river?",
      "options": ["It makes the water too salty.", "It causes eutrophication and spreads water-borne diseases.", "It increases the number of fish.", "It stops the water from flowing."],
      "correctAnswer": "It causes eutrophication and spreads water-borne diseases.",
      "difficulty": "moderate",
      "explanation": "Sewage contains nutrients (leading to algal blooms) and pathogens like cholera and typhoid."
    },
    {
      "question": "Which of these is a requirement for the conservation of a specific habitat?",
      "options": [
        "Removing all humans from the entire continent.",
        "Legislation to prevent activities like illegal logging and hunting.",
        "Building a wall around every tree.",
        "Feeding all wild animals by hand."
      ],
      "correctAnswer": "Legislation to prevent activities like illegal logging and hunting.",
      "difficulty": "moderate",
      "explanation": "Law enforcement and policy are necessary to manage human impact on protected areas."
    },
    {
      "question": "Case Study: A community starts a project to use biogas from animal waste for cooking instead of cutting firewood. This is an example of:",
      "options": ["Habitat destruction", "Sustainable use of resources", "Ex-situ conservation", "Intraspecific competition"],
      "correctAnswer": "Sustainable use of resources",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Biogas is a renewable alternative that reduces the pressure on forests for fuel."
    },
    {
      "question": "True or False: The use of chemical fertilizers is the most sustainable way to maintain soil fertility forever.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Long-term use of synthetic fertilizers can degrade soil structure and kill beneficial soil life; organic methods are more sustainable."
    },
    {
      "question": "Which of these is a social benefit of maintaining biodiversity?",
      "options": ["Increased industrial noise", "Discovery of new medicines and crops", "Higher cost of food", "Decrease in rainfall"],
      "correctAnswer": "Discovery of new medicines and crops",
      "difficulty": "easy",
      "explanation": "Many of our modern medicines are derived from wild plants; losing biodiversity means losing potential cures."
    },
    {
      "question": "Select ALL strategies used for the conservation of endangered species:",
      "multiSelect": true,
      "options": [
        "Monitoring and research",
        "Captive breeding and reintroduction",
        "Habitat restoration",
        "Expansion of urban roads through parks",
        "Public education and awareness"
      ],
      "correctAnswer": ["Monitoring and research", "Captive breeding and reintroduction", "Habitat restoration", "Public education and awareness"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Conservation is multi-faceted, involving science, direct animal care, habitat work, and changing human behavior."
    },
    {
      "question": "What happens in the 'sedimentation' (settling) tank during sewage treatment?",
      "options": [
        "Bacteria are killed by sunlight.",
        "Heavy solids (sludge) sink to the bottom while grease floats to the top.",
        "Water is boiled to remove impurities.",
        "Oxygen is pumped into the water."
      ],
      "correctAnswer": "Heavy solids (sludge) sink to the bottom while grease floats to the top.",
      "difficulty": "moderate",
      "explanation": "Sedimentation uses gravity to separate solid waste from the liquid portion of sewage."
    },
    {
      "question": "A 'Buffer Zone' in a conservation area is:",
      "options": [
        "A zone where no animals are allowed.",
        "An area surrounding a protected core where limited human activity is allowed to reduce impact on the center.",
        "A place where garbage is dumped.",
        "The very center of a national park."
      ],
      "correctAnswer": "An area surrounding a protected core where limited human activity is allowed to reduce impact on the center.",
      "difficulty": "hard",
      "explanation": "Buffer zones help transition between high-intensity human use and strictly protected wilderness."
    },
    {
      "question": "Which of the following is a drawback of using fossil fuels?",
      "options": ["They are renewable.", "They release greenhouse gases when burned.", "They are found everywhere in the world.", "They produce no waste."],
      "correctAnswer": "They release greenhouse gases when burned.",
      "difficulty": "easy",
      "explanation": "The combustion of coal, oil, and gas is the main driver of anthropogenic climate change."
    },
    {
      "question": "Sustainable development requires balancing which three factors?",
      "options": [
        "Money, Power, and Fame",
        "Economy, Environment, and Society",
        "Mining, Farming, and Fishing",
        "Cities, Roads, and Factories"
      ],
      "correctAnswer": "Economy, Environment, and Society",
      "difficulty": "moderate",
      "explanation": "Often called the 'Triple Bottom Line', these three must be balanced for a sustainable future."
    },
    {
      "question": "How does 'reforestation' help in the conservation of ecosystems?",
      "options": [
        "It increases the amount of carbon dioxide in the air.",
        "It provides new habitats for wildlife and prevents soil erosion.",
        "It stops the water cycle from working.",
        "It makes the land hotter."
      ],
      "correctAnswer": "It provides new habitats for wildlife and prevents soil erosion.",
      "difficulty": "easy",
      "explanation": "Replanting trees restores the complex structure of the forest ecosystem."
    },
    {
      "question": "Order the stages of sewage treatment:",
      "orderCorrect": ["Screening", "Primary Sedimentation", "Biological (Secondary) Treatment", "Disinfection"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Sewage treatment follows a logical progression from large physical removal to biological cleaning to final disinfection."
    },
    {
      "question": "Which of the following organisms is often used in the biological treatment of sewage?",
      "options": ["Lions", "Aerobic bacteria and protozoa", "Large fish", "Aquatic plants only"],
      "correctAnswer": "Aerobic bacteria and protozoa",
      "difficulty": "moderate",
      "explanation": "These microorganisms 'eat' the organic waste in the sewage, cleaning the water."
    },
    {
      "question": "Situational Judgment: A city is running out of space for its landfill. Which action should the government prioritize according to the waste hierarchy?",
      "options": [
        "Building a larger landfill further away.",
        "Encouraging citizens to reduce the amount of packaging they buy.",
        "Burning all the trash in open pits.",
        "Giving everyone a free plastic bag."
      ],
      "correctAnswer": "Encouraging citizens to reduce the amount of packaging they buy.",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Reduction is the most effective and preferred method of waste management."
    },
    {
      "question": "Why is 'genetic diversity' important for a species' survival?",
      "options": [
        "It makes all individuals look the same.",
        "It allows a population to adapt to environmental changes or diseases.",
        "It prevents reproduction.",
        "It makes the species easier to hunt."
      ],
      "correctAnswer": "It allows a population to adapt to environmental changes or diseases.",
      "difficulty": "moderate",
      "explanation": "A diverse gene pool ensures that some individuals may have traits that help them survive new threats."
    },
    {
      "question": "Fill in the blank: The _____ of a habitat is the number of different species living in that area.",
      "options": ["Density", "Biodiversity", "Biomass", "Capacity"],
      "correctAnswer": "Biodiversity",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Biodiversity is a key indicator of ecosystem health."
    },
    {
      "question": "Which of these is a form of 'bioremediation'?",
      "options": [
        "Using bacteria to clean up an oil spill.",
        "Building a concrete dam.",
        "Cutting down trees to make paper.",
        "Hunting animals for sport."
      ],
      "correctAnswer": "Using bacteria to clean up an oil spill.",
      "difficulty": "hard",
      "explanation": "Bioremediation is the use of living organisms (usually microbes) to remove or neutralize pollutants from a contaminated site."
    },
    {
      "question": "In Rwanda, 'Umuganda' (community work) often involves tree planting and cleaning. This supports:",
      "options": [
        "Individual wealth accumulation.",
        "Environmental sustainability and community engagement.",
        "The destruction of natural resources.",
        "International trade of plastic."
      ],
      "correctAnswer": "Environmental sustainability and community engagement.",
      "difficulty": "easy",
      "explanation": "Umuganda is a cultural and policy tool that mobilizes the population for public works, including conservation."
    },
    {
      "question": "What is the primary danger of 'poaching'?",
      "options": [
        "It makes animals run faster.",
        "It leads to the rapid decline or extinction of vulnerable species.",
        "It helps the ecosystem by removing old animals.",
        "It increases the amount of food for other animals."
      ],
      "correctAnswer": "It leads to the rapid decline or extinction of vulnerable species.",
      "difficulty": "easy",
      "explanation": "Poaching (illegal hunting) targets specific high-value species, often faster than they can reproduce."
    },
    {
      "question": "Which of the following is a 'tertiary' level of sewage treatment?",
      "options": [
        "Filtering through sand or charcoal to remove fine particles.",
        "Adding oxygen to the water.",
        "Removing sticks and leaves.",
        "Letting mud settle."
      ],
      "correctAnswer": "Filtering through sand or charcoal to remove fine particles.",
      "difficulty": "hard",
      "explanation": "Tertiary treatment provides an advanced level of cleaning to remove specific inorganic compounds or pathogens."
    },
    {
      "question": "True or False: A sustainable resource can be used indefinitely if managed correctly.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "By definition, sustainable use ensures that the resource is not depleted over time."
    },
    {
      "question": "Identify the 'non-renewable' energy source among the following:",
      "options": ["Geothermal", "Nuclear (Uranium)", "Hydroelectric", "Wind"],
      "correctAnswer": "Nuclear (Uranium)",
      "difficulty": "moderate",
      "explanation": "While it produces low carbon emissions, uranium is a finite mineral resource that does not renew itself."
    }
  ],
  "Unit 6: Mitosis and Meiosis": [
    {
      "question": "What is the normal number of chromosomes found in a somatic (body) cell of a human being?",
      "options": ["23", "46", "12", "92"],
      "correctAnswer": "46",
      "difficulty": "easy",
      "explanation": "Human somatic cells are diploid (2n), containing 46 chromosomes organized into 23 pairs."
    },
    {
      "question": "Each chromosome consists of two identical structures joined at a centromere. What are these structures called?",
      "options": ["Genes", "Nuclei", "Chromatids", "Bases"],
      "correctAnswer": "Chromatids",
      "difficulty": "easy",
      "explanation": "Before cell division, DNA replicates, and each chromosome consists of two identical sister chromatids."
    },
    {
      "question": "Which of the following statements regarding chromosome number is correct?",
      "options": [
        "The chromosome number varies between cells of the same tissue.",
        "The chromosome number is constant within individuals of the same species.",
        "The chromosome number is the same for all different species in an ecosystem.",
        "Gametes contain the same number of chromosomes as somatic cells."
      ],
      "correctAnswer": "The chromosome number is constant within individuals of the same species.",
      "difficulty": "moderate",
      "explanation": "Every species has a characteristic and constant number of chromosomes in its somatic cells (e.g., 46 for humans, 14 for garden peas)."
    },
    {
      "question": "What is the primary function of mitosis in multicellular organisms?",
      "options": [
        "Production of gametes for sexual reproduction",
        "Growth, tissue repair, and asexual reproduction",
        "Increasing genetic variation in offspring",
        "Reducing the chromosome number by half"
      ],
      "correctAnswer": "Growth, tissue repair, and asexual reproduction",
      "difficulty": "easy",
      "explanation": "Mitosis produces genetically identical cells, which is essential for increasing body size and replacing damaged cells."
    },
    {
      "question": "In which stage of mitosis do the chromosomes align at the equator of the cell?",
      "options": ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      "correctAnswer": "Metaphase",
      "difficulty": "moderate",
      "explanation": "During metaphase, spindle fibers pull the chromosomes to the center (equator) of the cell."
    },
    {
      "question": "What occurs during 'Anaphase' of mitosis?",
      "options": [
        "The nuclear membrane disappears.",
        "Chromosomes reach opposite poles and uncoil.",
        "Sister chromatids separate and move toward opposite poles.",
        "DNA replication takes place."
      ],
      "correctAnswer": "Sister chromatids separate and move toward opposite poles.",
      "difficulty": "moderate",
      "explanation": "In anaphase, the centromeres split, and the spindle fibers pull the individual chromatids (now called chromosomes) to opposite ends of the cell."
    },
    {
      "question": "Identify the dye used to stain chromosomes in the onion root tip experiment to make them visible under a microscope.",
      "options": ["Iodine solution", "Methylene blue", "Orcein dye", "Benedict's solution"],
      "correctAnswer": "Orcein dye",
      "difficulty": "moderate",
      "explanation": "Orcein is a biological stain specifically used to highlight DNA and chromosomes during cell division observations."
    },
    {
      "question": "How many daughter cells are produced at the end of a single mitotic division?",
      "options": ["Two diploid cells", "Four haploid cells", "Two haploid cells", "One diploid cell"],
      "correctAnswer": "Two diploid cells",
      "difficulty": "easy",
      "explanation": "Mitosis results in two daughter cells that are genetically identical to the parent cell and to each other."
    },
    {
      "question": "Meiosis is specifically responsible for the production of:",
      "options": ["Skin cells", "Muscle cells", "Gametes (sperm and egg)", "Nerve cells"],
      "correctAnswer": "Gametes (sperm and egg)",
      "difficulty": "easy",
      "explanation": "Meiosis is a reduction division that occurs in reproductive organs to produce haploid sex cells."
    },
    {
      "question": "What is the chromosomal status of a human gamete?",
      "options": ["Diploid (46 chromosomes)", "Triploid (69 chromosomes)", "Haploid (23 chromosomes)", "Tetraploid (92 chromosomes)"],
      "correctAnswer": "Haploid (23 chromosomes)",
      "difficulty": "moderate",
      "explanation": "Gametes must be haploid (n) so that when they fuse during fertilization, the resulting zygote has the correct diploid (2n) number."
    },
    {
      "question": "Which process during meiosis leads to increased genetic variation in the offspring?",
      "options": ["Cytokinesis", "Crossing over", "Centromere duplication", "Spindle fiber formation"],
      "correctAnswer": "Crossing over",
      "difficulty": "hard",
      "explanation": "Crossing over occurs during Prophase I, where homologous chromosomes exchange segments of DNA, creating new genetic combinations."
    },
    {
      "question": "At which stage of meiosis do homologous chromosomes separate, while sister chromatids remain attached?",
      "options": ["Anaphase I", "Anaphase II", "Metaphase I", "Prophase II"],
      "correctAnswer": "Anaphase I",
      "difficulty": "hard",
      "explanation": "In Anaphase I, the pairs of homologous chromosomes are pulled apart. Separation of sister chromatids does not happen until Anaphase II."
    },
    {
      "question": "How many nuclear divisions occur during the process of meiosis?",
      "options": ["One", "Two", "Three", "Four"],
      "correctAnswer": "Two",
      "difficulty": "moderate",
      "explanation": "Meiosis consists of two successive divisions: Meiosis I (reduction division) and Meiosis II (similar to mitosis)."
    },
    {
      "question": "True or False: Mitosis maintains the chromosome number, whereas meiosis halves it.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Mitosis produces 2n cells from a 2n parent; meiosis produces n cells from a 2n parent."
    },
    {
      "question": "What is the term for a pair of chromosomes (one from each parent) that are similar in shape, size, and genetic content?",
      "options": ["Sister chromatids", "Homologous chromosomes", "Bivalents", "Genotypes"],
      "correctAnswer": "Homologous chromosomes",
      "difficulty": "moderate",
      "explanation": "Homologous pairs carry genes for the same traits at the same positions (loci)."
    },
    {
      "question": "In the onion root tip experiment, why is the tip placed in 1M Hydrochloric Acid (HCl)?",
      "options": [
        "To stain the nucleus.",
        "To soften the cell walls and separate the cells.",
        "To provide nutrients for the cells to divide faster.",
        "To stop the microscope from sliding."
      ],
      "correctAnswer": "To soften the cell walls and separate the cells.",
      "difficulty": "hard",
      "explanation": "The acid breaks down the pectin (middle lamella) that holds the cells together, allowing them to be squashed into a single layer."
    },
    {
      "question": "Which of the following describes 'Prophase' of mitosis?",
      "options": [
        "Chromosomes disappear.",
        "The nuclear envelope breaks down and chromosomes condense.",
        "The cell membrane pinches into two.",
        "DNA is replicated."
      ],
      "correctAnswer": "The nuclear envelope breaks down and chromosomes condense.",
      "difficulty": "moderate",
      "explanation": "Prophase is the first stage where chromosomes become visible under a light microscope."
    },
    {
      "question": "The region where two sister chromatids are held together is the:",
      "options": ["Centrosome", "Centromere", "Centriole", "Chiasma"],
      "correctAnswer": "Centromere",
      "difficulty": "easy",
      "explanation": "The centromere is the constricted region of a chromosome that serves as the attachment point for spindle fibers."
    },
    {
      "question": "What is the result of 'independent assortment' during meiosis?",
      "options": [
        "Identical twin formation",
        "Reduction in the number of genes",
        "Genetic variation in gametes",
        "Fixing damaged DNA"
      ],
      "correctAnswer": "Genetic variation in gametes",
      "difficulty": "hard",
      "explanation": "Independent assortment refers to the random orientation of homologous pairs during Metaphase I, leading to different combinations of maternal and paternal chromosomes."
    },
    {
      "question": "Which cell type would you NOT expect to undergo mitosis?",
      "options": ["Skin cell", "Root tip cell", "Mature red blood cell", "Embryonic cell"],
      "correctAnswer": "Mature red blood cell",
      "difficulty": "moderate",
      "explanation": "Mature mammalian red blood cells lack a nucleus and cannot undergo cell division."
    },
    {
      "question": "In meiosis, four daughter cells are produced. Are they genetically identical?",
      "options": [
        "Yes, they are clones of the parent.",
        "No, they are genetically different from each other and the parent.",
        "Only two of them are identical.",
        "They are identical only if mutation occurs."
      ],
      "correctAnswer": "No, they are genetically different from each other and the parent.",
      "difficulty": "moderate",
      "explanation": "Due to crossing over and independent assortment, each of the four haploid cells has a unique genetic makeup."
    },
    {
      "question": "Assertion: Meiosis is essential for sexual reproduction.\nReason: It ensures that the chromosome number of a species remains constant across generations.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "By halving the chromosome number in gametes, meiosis allows fertilization to restore the diploid number rather than doubling it every generation."
    },
    {
      "question": "During which phase of the cell cycle does DNA replication occur?",
      "options": ["Prophase", "Interphase", "Cytokinesis", "Anaphase"],
      "correctAnswer": "Interphase",
      "difficulty": "moderate",
      "explanation": "Interphase is the period between divisions where the cell grows and copies its DNA (specifically in the S phase)."
    },
    {
      "question": "What is 'Cytokinesis'?",
      "options": [
        "The division of the nucleus.",
        "The division of the cytoplasm to form two separate cells.",
        "The replication of chromosomes.",
        "The lining up of chromosomes."
      ],
      "correctAnswer": "The division of the cytoplasm to form two separate cells.",
      "difficulty": "easy",
      "explanation": "Cytokinesis usually follows telophase to complete the process of cell division."
    },
    {
      "question": "In plants, what structure forms during cytokinesis to divide the cell?",
      "options": ["Cleavage furrow", "Cell plate", "Centromere", "Spindle"],
      "correctAnswer": "Cell plate",
      "difficulty": "moderate",
      "explanation": "Because of the rigid cell wall, plant cells form a cell plate in the center that eventually becomes the new cell wall."
    },
    {
      "question": "A cell with 20 chromosomes undergoes mitosis. How many chromosomes will each daughter cell have?",
      "options": ["10", "20", "40", "5"],
      "correctAnswer": "20",
      "difficulty": "easy",
      "type": "calculation",
      "explanation": "Mitosis maintains the chromosome number (2n -> 2n)."
    },
    {
      "question": "A cell with 20 chromosomes undergoes meiosis. How many chromosomes will each daughter cell have?",
      "options": ["10", "20", "40", "5"],
      "correctAnswer": "10",
      "difficulty": "moderate",
      "type": "calculation",
      "explanation": "Meiosis halves the chromosome number (2n -> n)."
    },
    {
      "question": "The point where non-sister chromatids of homologous chromosomes cross over is called the:",
      "options": ["Centromere", "Chiasma", "Locus", "Allele"],
      "correctAnswer": "Chiasma",
      "difficulty": "hard",
      "explanation": "Chiasmata (plural) are the physical manifestations of crossing over."
    },
    {
      "question": "Which of the following occurs in Meiosis II but NOT in Meiosis I?",
      "options": [
        "Separation of homologous chromosomes",
        "Crossing over",
        "Separation of sister chromatids",
        "Reduction division"
      ],
      "correctAnswer": "Separation of sister chromatids",
      "difficulty": "hard",
      "explanation": "Meiosis II is very similar to mitosis; it separates the sister chromatids that were held together through Meiosis I."
    },
    {
      "question": "In which part of a flowering plant would meiosis occur?",
      "options": ["Root tip", "Shoot apex", "Anther and Ovule", "Xylem vessels"],
      "correctAnswer": "Anther and Ovule",
      "difficulty": "moderate",
      "explanation": "Meiosis occurs in the reproductive organs to produce pollen (male) and egg cells (female)."
    },
    {
      "question": "What is the appearance of chromosomes during Telophase?",
      "options": [
        "Highly condensed and visible as X-shapes.",
        "Lined up at the center of the cell.",
        "They reach the poles and begin to decondense (uncoil).",
        "They are being pulled apart by spindle fibers."
      ],
      "correctAnswer": "They reach the poles and begin to decondense (uncoil).",
      "difficulty": "moderate",
      "explanation": "Telophase is the final stage where nuclear membranes reform around the two new sets of chromosomes."
    },
    {
      "question": "Situational Judgment: If a drug prevents the formation of spindle fibers, which stage of mitosis will be directly blocked first?",
      "options": ["Prophase", "Metaphase", "Telophase", "Interphase"],
      "correctAnswer": "Metaphase",
      "difficulty": "hard",
      "type": "situational",
      "explanation": "Without spindle fibers, chromosomes cannot be moved to the equator for metaphase or pulled apart for anaphase."
    },
    {
      "question": "A 'diploid' cell is one that:",
      "options": [
        "Has only one set of chromosomes.",
        "Has two sets of chromosomes (homologous pairs).",
        "Has twice the normal DNA because it's about to die.",
        "Is only found in bacteria."
      ],
      "correctAnswer": "Has two sets of chromosomes (homologous pairs).",
      "difficulty": "easy",
      "explanation": "Somatic cells in humans are diploid, represented as 2n."
    },
    {
      "question": "Which of the following is a difference between mitosis and meiosis?",
      "options": [
        "Mitosis involves two divisions; meiosis involves one.",
        "Mitosis produces haploid cells; meiosis produces diploid cells.",
        "Mitosis produces two cells; meiosis produces four cells.",
        "Mitosis causes genetic variation; meiosis does not."
      ],
      "correctAnswer": "Mitosis produces two cells; meiosis produces four cells.",
      "difficulty": "moderate",
      "explanation": "Meiosis results in four haploid daughter cells, while mitosis results in two diploid daughter cells."
    },
    {
      "question": "True or False: Homologous chromosomes pair up only in meiosis, not in mitosis.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "hard",
      "type": "trueFalse",
      "explanation": "Synapsis (pairing of homologs) is unique to Meiosis I (Prophase I), which allows for crossing over."
    },
    {
      "question": "What is the significance of the reduction division in meiosis?",
      "options": [
        "It makes the cells smaller.",
        "It ensures that fertilization does not double the chromosome number indefinitely.",
        "It allows the cell to store more energy.",
        "It speeds up the process of cell growth."
      ],
      "correctAnswer": "It ensures that fertilization does not double the chromosome number indefinitely.",
      "difficulty": "moderate",
      "explanation": "By halving the number, it maintains the species-specific chromosome count after gamete fusion."
    },
    {
      "question": "Identify the incorrect pair:",
      "options": [
        "Prophase - Chromosomes condense",
        "Metaphase - Chromosomes line up at equator",
        "Anaphase - Nuclear membrane reforms",
        "Telophase - Two nuclei form"
      ],
      "correctAnswer": "Anaphase - Nuclear membrane reforms",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "The nuclear membrane reforms during Telophase, not Anaphase (where chromosomes are moving to poles)."
    },
    {
      "question": "Order the phases of mitosis correctly:",
      "orderCorrect": ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      "difficulty": "easy",
      "type": "ordering",
      "explanation": "The stages follow the sequence PMAT."
    },
    {
      "question": "Fill in the blank: The _____ is the substance in the nucleus that condenses to form chromosomes.",
      "options": ["Chlorophyll", "Chromatin", "Cytoplasm", "Cellulose"],
      "correctAnswer": "Chromatin",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Chromatin consists of DNA and proteins; it coils tightly to form visible chromosomes during division."
    },
    {
      "question": "Which of these is NOT a source of genetic variation in sexual reproduction?",
      "options": ["Crossing over", "Independent assortment", "Random fertilization", "Mitotic division of the zygote"],
      "correctAnswer": "Mitotic division of the zygote",
      "difficulty": "hard",
      "explanation": "Mitosis produces identical cells; the variation is established during meiosis and fertilization."
    },
    {
      "question": "During the onion root tip experiment, why do we use 'young' root tips?",
      "options": [
        "They are easier to see.",
        "They contain meristematic tissue where cells are actively dividing.",
        "They have no cell walls.",
        "They are already stained."
      ],
      "correctAnswer": "They contain meristematic tissue where cells are actively dividing.",
      "difficulty": "moderate",
      "explanation": "Mitosis is most frequent in growth regions like root tips."
    },
    {
      "question": "The total number of chromosomes in a cell is known as its:",
      "options": ["Karyotype", "Genotype", "Phenotype", "Ploidy"],
      "correctAnswer": "Ploidy",
      "difficulty": "hard",
      "explanation": "Ploidy refers to the number of sets of chromosomes in a cell (haploid, diploid, etc.)."
    },
    {
      "question": "What happens to the spindle fibers during telophase?",
      "options": ["They get stronger.", "They pull the chromosomes to the equator.", "They disappear/break down.", "They replicate."],
      "correctAnswer": "They disappear/break down.",
      "difficulty": "moderate",
      "explanation": "Once the chromosomes have reached the poles, the spindle apparatus is no longer needed and is disassembled."
    },
    {
      "question": "Case Study: A scientist observes a cell with 46 chromosomes dividing. At the end, there are four cells, each with 23 chromosomes. What process was observed?",
      "options": ["Mitosis", "Binary fission", "Meiosis", "Budding"],
      "correctAnswer": "Meiosis",
      "difficulty": "easy",
      "type": "caseBased",
      "explanation": "The halving of chromosome number and production of four cells are defining features of meiosis."
    },
    {
      "question": "Which phase is the longest part of the cell cycle?",
      "options": ["Mitosis", "Interphase", "Cytokinesis", "Meiosis"],
      "correctAnswer": "Interphase",
      "difficulty": "easy",
      "explanation": "Cells spend most of their life in interphase performing normal functions and preparing for division."
    },
    {
      "question": "True or False: Identical twins come from the same zygote, which divided by mitosis.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Monozygotic twins result from one fertilized egg (zygote) splitting into two identical embryos via mitosis."
    }
  ],
    "Unit 7: Heterotrophic nutrition": [
    {
      "question": "Which form of heterotrophic nutrition involves an organism living on or inside another living organism and obtaining nutrients at the host's expense?",
      "options": ["Holozoic nutrition", "Saprotrophic nutrition", "Parasitic nutrition", "Mutualism"],
      "correctAnswer": "Parasitic nutrition",
      "difficulty": "easy",
      "explanation": "Parasitism is a relationship where the parasite benefits by taking nutrients from a living host, which is usually harmed."
    },
    {
      "question": "What is the primary characteristic of saprotrophic nutrition?",
      "options": [
        "Ingesting solid organic matter",
        "Feeding on dead and decaying organic matter through extracellular digestion",
        "Producing food using sunlight",
        "Killing and eating other animals"
      ],
      "correctAnswer": "Feeding on dead and decaying organic matter through extracellular digestion",
      "difficulty": "moderate",
      "explanation": "Saprotrophs, like fungi and certain bacteria, secrete enzymes onto dead matter and absorb the simplified products."
    },
    {
      "question": "Which type of human tooth is specifically adapted for tearing and piercing food?",
      "options": ["Incisors", "Canines", "Premolars", "Molars"],
      "correctAnswer": "Canines",
      "difficulty": "easy",
      "explanation": "Canines are pointed and sharp, making them ideal for tearing tough food like meat."
    },
    {
      "question": "The hardest substance in the human body, which covers the crown of the tooth, is called:",
      "options": ["Dentin", "Cementum", "Enamel", "Pulp"],
      "correctAnswer": "Enamel",
      "difficulty": "easy",
      "explanation": "Enamel is a highly mineralized tissue that protects the tooth from the wear and tear of chewing."
    },
    {
      "question": "Identify the tooth part that contains blood vessels and nerves.",
      "options": ["Enamel", "Dentin", "Pulp cavity", "Root"],
      "correctAnswer": "Pulp cavity",
      "difficulty": "moderate",
      "explanation": "The pulp is the living part of the tooth that provides sensation and nutrients to the tooth tissues."
    },
    {
      "question": "What is the dental formula for an adult human (per half of the jaw)?",
      "options": ["2:1:2:3", "2:1:0:2", "3:1:4:3", "1:1:2:3"],
      "correctAnswer": "2:1:2:3",
      "difficulty": "hard",
      "explanation": "This represents 2 incisors, 1 canine, 2 premolars, and 3 molars in one quadrant of the mouth."
    },
    {
      "question": "Which enzyme is found in human saliva and begins the digestion of starch?",
      "options": ["Pepsin", "Salivary amylase", "Lipase", "Trypsin"],
      "correctAnswer": "Salivary amylase",
      "difficulty": "easy",
      "explanation": "Salivary amylase (ptyalin) breaks down cooked starch into simpler sugars like maltose."
    },
    {
      "question": "What is the role of the epiglottis during swallowing?",
      "options": [
        "To produce mucus to lubricate food.",
        "To cover the trachea (windpipe) and prevent food from entering the lungs.",
        "To push food into the stomach using peristalsis.",
        "To secrete digestive enzymes."
      ],
      "correctAnswer": "To cover the trachea (windpipe) and prevent food from entering the lungs.",
      "difficulty": "moderate",
      "explanation": "The epiglottis is a cartilaginous flap that acts as a switch to ensure food goes down the esophagus."
    },
    {
      "question": "The rhythmic contraction and relaxation of muscles that moves food through the digestive tract is called:",
      "options": ["Absorption", "Peristalsis", "Assimilation", "Egestion"],
      "correctAnswer": "Peristalsis",
      "difficulty": "easy",
      "explanation": "Peristalsis occurs throughout the gut, moving the bolus or chyme forward automatically."
    },
    {
      "question": "Which acidic substance is produced in the stomach to kill bacteria and provide the optimum pH for enzymes?",
      "options": ["Sulfuric acid", "Hydrochloric acid", "Lactic acid", "Acetic acid"],
      "correctAnswer": "Hydrochloric acid",
      "difficulty": "easy",
      "explanation": "Hydrochloric acid (HCl) creates a pH of about 2, which activates pepsin and destroys most ingested microbes."
    },
    {
      "question": "The enzyme pepsin, found in the stomach, is responsible for the digestion of:",
      "options": ["Fats", "Carbohydrates", "Proteins", "Vitamins"],
      "correctAnswer": "Proteins",
      "difficulty": "moderate",
      "explanation": "Pepsin breaks down long protein chains into shorter polypeptides."
    },
    {
      "question": "Where is bile produced, and where is it stored?",
      "options": [
        "Produced in the Gallbladder, stored in the Liver",
        "Produced in the Liver, stored in the Gallbladder",
        "Produced in the Pancreas, stored in the Stomach",
        "Produced in the Duodenum, stored in the Ileum"
      ],
      "correctAnswer": "Produced in the Liver, stored in the Gallbladder",
      "difficulty": "moderate",
      "explanation": "The liver synthesizes bile, which is then concentrated and stored in the gallbladder until needed for fat digestion."
    },
    {
      "question": "What is the primary function of bile in the duodenum?",
      "options": [
        "Digesting proteins into amino acids.",
        "Emulsifying fats into small droplets.",
        "Converting glucose into glycogen.",
        "Producing Vitamin K."
      ],
      "correctAnswer": "Emulsifying fats into small droplets.",
      "difficulty": "moderate",
      "explanation": "Emulsification increases the surface area of fats, allowing lipase enzymes to work more efficiently."
    },
    {
      "question": "Which organ produces pancreatic juice containing amylase, trypsin, and lipase?",
      "options": ["Liver", "Pancreas", "Stomach", "Salivary glands"],
      "correctAnswer": "Pancreas",
      "difficulty": "easy",
      "explanation": "The pancreas is a vital exocrine gland that secretes a cocktail of enzymes into the small intestine."
    },
    {
      "question": "The finger-like projections in the ileum that increase surface area for absorption are called:",
      "options": ["Alveoli", "Villi", "Nephrons", "Flagella"],
      "correctAnswer": "Villi",
      "difficulty": "easy",
      "explanation": "Villi (and microvilli) vastly increase the internal surface area of the small intestine to maximize nutrient uptake."
    },
    {
      "question": "In a villus, which structure is responsible for absorbing fatty acids and glycerol?",
      "options": ["Blood capillary", "Lacteal", "Nerve fiber", "Mucus gland"],
      "correctAnswer": "Lacteal",
      "difficulty": "hard",
      "explanation": "Lacteals are lymph vessels that absorb fats, which are too large to enter the blood capillaries directly."
    },
    {
      "question": "What is the main function of the large intestine (colon)?",
      "options": [
        "Digestion of proteins.",
        "Absorption of water and mineral salts.",
        "Production of bile.",
        "Storing digestive enzymes."
      ],
      "correctAnswer": "Absorption of water and mineral salts.",
      "difficulty": "easy",
      "explanation": "The colon reclaims water from the indigestible food residue, turning it into solid feces."
    },
    {
      "question": "Assertion: The small intestine is the longest part of the digestive canal.\nReason: It needs a large surface area and time to complete digestion and absorb most nutrients.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "The length of the small intestine (roughly 6-7 meters) is an adaptation to its intensive role in nutrient processing."
    },
    {
      "question": "Dental caries (tooth decay) is primarily caused by:",
      "options": [
        "Eating too much salt.",
        "Bacteria converting sugar into acid that dissolves enamel.",
        "Drinking too much water.",
        "Brushing teeth too often."
      ],
      "correctAnswer": "Bacteria converting sugar into acid that dissolves enamel.",
      "difficulty": "easy",
      "explanation": "Plaque bacteria ferment sugars to produce acids, which demineralize the tooth structure."
    },
    {
      "question": "Which of the following is a symptom of 'constipation'?",
      "options": [
        "Frequent watery stools.",
        "Difficulty in passing hard, dry stools.",
        "Pain in the chest after eating.",
        "Vomiting blood."
      ],
      "correctAnswer": "Difficulty in passing hard, dry stools.",
      "difficulty": "easy",
      "explanation": "Constipation occurs when too much water is absorbed in the colon or when diet lacks sufficient fiber."
    },
    {
      "question": "How does dietary fiber (roughage) help the digestive system?",
      "options": [
        "It provides a lot of energy.",
        "It adds bulk to the food and stimulates peristalsis.",
        "It dissolves teeth.",
        "It turns into protein in the stomach."
      ],
      "correctAnswer": "It adds bulk to the food and stimulates peristalsis.",
      "difficulty": "moderate",
      "explanation": "Fiber is indigestible cellulose that keeps the gut muscles active and prevents constipation."
    },
    {
      "question": "What is 'assimilation'?",
      "options": [
        "Breaking down food into small pieces.",
        "The movement of digested food into the cells where they are used.",
        "The removal of undigested waste from the body.",
        "The production of enzymes in the pancreas."
      ],
      "correctAnswer": "The movement of digested food into the cells where they are used.",
      "difficulty": "moderate",
      "explanation": "Assimilation is the final step where nutrients become part of the living tissues or are used for energy."
    },
    {
      "question": "Order the parts of the human digestive system through which food passes:",
      "orderCorrect": ["Mouth", "Esophagus", "Stomach", "Duodenum", "Ileum", "Colon", "Rectum"],
      "difficulty": "moderate",
      "type": "ordering",
      "explanation": "Food travels from the oral cavity through the gut tube in this specific sequence."
    },
    {
      "question": "Which of these is a good health practice for the digestive system?",
      "options": [
        "Eating very quickly without chewing.",
        "Consuming plenty of water and fiber-rich foods.",
        "Eating only sugary snacks.",
        "Exercising immediately after a heavy meal."
      ],
      "correctAnswer": "Consuming plenty of water and fiber-rich foods.",
      "difficulty": "easy",
      "explanation": "Hydration and fiber are key to maintaining smooth transit and preventing digestive disorders."
    },
    {
      "question": "True or False: De-worming is necessary because intestinal parasites compete with the host for nutrients.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Parasitic worms like tapeworms live in the gut and absorb nutrients meant for the human host, leading to malnutrition."
    },
    {
      "question": "What is the function of 'maltase' in the ileum?",
      "options": [
        "Breaking down maltose into glucose.",
        "Breaking down proteins into amino acids.",
        "Emulsifying fats.",
        "Killing bacteria."
      ],
      "correctAnswer": "Breaking down maltose into glucose.",
      "difficulty": "moderate",
      "explanation": "Maltase is an enzyme in the intestinal juice that completes carbohydrate digestion."
    },
    {
      "question": "Which condition is characterized by a burning sensation in the chest caused by stomach acid flowing back into the esophagus?",
      "options": ["Diarrhea", "Heartburn (Acid reflux)", "Appendicitis", "Cholera"],
      "correctAnswer": "Heartburn (Acid reflux)",
      "difficulty": "easy",
      "explanation": "The lining of the esophagus is not protected against acid, unlike the stomach, causing pain when acid escapes upward."
    },
    {
      "question": "Identify the 'error' in this statement: 'The liver produces enzymes that digest proteins in the duodenum.'",
      "options": [
        "The liver does not produce digestive enzymes; it produces bile.",
        "Proteins are only digested in the stomach.",
        "The liver produces amylase.",
        "There is no error."
      ],
      "correctAnswer": "The liver does not produce digestive enzymes; it produces bile.",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "The liver's role in digestion is solely the production of bile for fat emulsification; the pancreas produces the protein-digesting enzymes for the duodenum."
    },
    {
      "question": "In the 'Holozoic' form of nutrition, food is processed in what sequence?",
      "orderCorrect": ["Ingestion", "Digestion", "Absorption", "Assimilation", "Egestion"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Holozoic organisms (like humans) take in solid food and process it internally through these five steps."
    },
    {
      "question": "Which of the following is a common cause of stomach ulcers?",
      "options": [
        "Eating too many vegetables.",
        "Infection by the bacterium Helicobacter pylori.",
        "Drinking too much pure water.",
        "Lack of sleep."
      ],
      "correctAnswer": "Infection by the bacterium Helicobacter pylori.",
      "difficulty": "moderate",
      "explanation": "While stress and spicy food can worsen symptoms, the majority of ulcers are caused by H. pylori infection."
    },
    {
      "question": "What happens to excess glucose in the liver?",
      "options": [
        "It is converted into protein.",
        "It is converted into glycogen for storage.",
        "It is excreted in the urine immediately.",
        "It is turned into bile."
      ],
      "correctAnswer": "It is converted into glycogen for storage.",
      "difficulty": "moderate",
      "explanation": "The liver helps regulate blood sugar levels by storing glucose as glycogen under the influence of insulin."
    },
    {
      "question": "The 'Duodenum' is the first part of the:",
      "options": ["Stomach", "Large intestine", "Small intestine", "Esophagus"],
      "correctAnswer": "Small intestine",
      "difficulty": "easy",
      "explanation": "The small intestine consists of the duodenum, jejunum, and ileum."
    },
    {
      "question": "Which enzyme converts fats into fatty acids and glycerol?",
      "options": ["Protease", "Lipase", "Amylase", "Sucrase"],
      "correctAnswer": "Lipase",
      "difficulty": "easy",
      "explanation": "Lipases are enzymes that catalyze the breakdown of lipids (fats)."
    },
    {
      "question": "What is 'Chyme'?",
      "options": [
        "The food in the mouth mixed with saliva.",
        "The semi-liquid mass of partially digested food that leaves the stomach.",
        "The waste stored in the rectum.",
        "The juice produced by the pancreas."
      ],
      "correctAnswer": "The semi-liquid mass of partially digested food that leaves the stomach.",
      "difficulty": "moderate",
      "explanation": "After mechanical and chemical churning in the stomach, the bolus becomes an acidic fluid called chyme."
    },
    {
      "question": "Select ALL that apply to 'Saprotrophic' organisms:",
      "multiSelect": true,
      "options": [
        "They carry out extracellular digestion.",
        "They are also known as decomposers.",
        "They hunt other living organisms.",
        "They play a vital role in nutrient recycling.",
        "They include mushrooms and molds."
      ],
      "correctAnswer": ["They carry out extracellular digestion.", "They are also known as decomposers.", "They play a vital role in nutrient recycling.", "They include mushrooms and molds."],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Saprotrophs are essential for breaking down dead matter and returning nutrients to the ecosystem."
    },
    {
      "question": "Which mineral is essential for building strong tooth enamel?",
      "options": ["Iron", "Calcium", "Iodine", "Sodium"],
      "correctAnswer": "Calcium",
      "difficulty": "easy",
      "explanation": "Calcium and phosphorus are the primary minerals that make up the hydroxyapatite in teeth."
    },
    {
      "question": "The 'rectum' serves what purpose in the digestive system?",
      "options": [
        "Digesting remaining proteins.",
        "Storing feces before they are egested.",
        "Absorbing most of the nutrients.",
        "Producing insulin."
      ],
      "correctAnswer": "Storing feces before they are egested.",
      "difficulty": "easy",
      "explanation": "The rectum is the final straight section of the large intestine where waste is held until defecation."
    },
    {
      "question": "What is the biological importance of chewing (mastication)?",
      "options": [
        "It makes food taste better.",
        "It increases the surface area of food for enzyme action.",
        "It prevents the stomach from working too hard.",
        "It kills all the bacteria in food."
      ],
      "correctAnswer": "It increases the surface area of food for enzyme action.",
      "difficulty": "moderate",
      "explanation": "Mechanical digestion breaks food into smaller pieces so that chemical digestion can happen faster."
    },
    {
      "question": "Which of these is a water-borne disease that causes severe diarrhea and dehydration?",
      "options": ["Scurvy", "Cholera", "Rickets", "Anemia"],
      "correctAnswer": "Cholera",
      "difficulty": "easy",
      "explanation": "Cholera is caused by Vibrio cholerae bacteria and is transmitted through contaminated water."
    },
    {
      "question": "Case Study: A patient has their gallbladder removed. Which type of food should they eat in limited amounts?",
      "options": ["Sugary fruits", "Lean proteins", "High-fat fried foods", "Whole grain bread"],
      "correctAnswer": "High-fat fried foods",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Without a gallbladder to store and release concentrated bile, the body struggles to digest large amounts of fat at once."
    },
    {
      "question": "Situational Judgment: You find a skull with very long, pointed canines and sharp carnassial molars. What was the most likely diet of this animal?",
      "options": ["Herbivore (Plants)", "Carnivore (Meat)", "Frugivore (Fruit)", "Detritivore (Waste)"],
      "correctAnswer": "Carnivore (Meat)",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Teeth shape is a direct reflection of an animal's diet; sharp teeth are used for killing and cutting flesh."
    },
    {
      "question": "Fill in the blank: The _____ is a common passage for both food and air.",
      "options": ["Pharynx", "Esophagus", "Trachea", "Larynx"],
      "correctAnswer": "Pharynx",
      "difficulty": "moderate",
      "type": "fillBlank",
      "explanation": "The pharynx (throat) leads to both the respiratory and digestive tracts."
    },
    {
      "question": "What is the function of the 'appendix' in humans?",
      "options": [
        "Main site of protein digestion.",
        "It is a vestigial organ with no major digestive function, though it may have an immune role.",
        "It stores bile.",
        "It produces salivary amylase."
      ],
      "correctAnswer": "It is a vestigial organ with no major digestive function, though it may have an immune role.",
      "difficulty": "moderate",
      "explanation": "In humans, the appendix is a small pouch where the small and large intestines meet; inflammation leads to appendicitis."
    },
    {
      "question": "True or False: Assimilated glucose is primarily used by cells for cellular respiration to produce energy.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Glucose is the preferred 'fuel' for most cells to generate ATP."
    },
    {
      "question": "Which of the following is NOT part of the 'Alimentary Canal'?",
      "options": ["Mouth", "Stomach", "Pancreas", "Small Intestine"],
      "correctAnswer": "Pancreas",
      "difficulty": "hard",
      "explanation": "The alimentary canal is the tube food actually passes through. The pancreas is an 'accessory organ' that secretes into the canal but food does not enter it."
    }
  ],
   "Unit 8: Circulatory system in humans": [
    {
      "question": "Which of the following describes a 'double' circulatory system?",
      "options": ["Blood passes through the heart once in a complete circuit.", "Blood passes through the heart twice in one complete circuit.", "Oxygenated and deoxygenated blood mix in a single ventricle.", "Blood is pumped directly from the lungs to the body tissues."],
      "correctAnswer": "Blood passes through the heart twice in one complete circuit.",
      "difficulty": "easy",
      "explanation": "Humans have a double circulation: pulmonary (to the lungs) and systemic (to the rest of the body)."
    },
    {
      "question": "Which chamber of the heart has the thickest muscular wall?",
      "options": ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"],
      "correctAnswer": "Left ventricle",
      "difficulty": "moderate",
      "explanation": "The left ventricle must pump blood at high pressure to the entire body, requiring more muscle than the right ventricle which only pumps to the lungs."
    },
    {
      "question": "The valve located between the left atrium and the left ventricle is the:",
      "options": ["Tricuspid valve", "Bicuspid (mitral) valve", "Pulmonary valve", "Aortic valve"],
      "correctAnswer": "Bicuspid (mitral) valve",
      "difficulty": "moderate",
      "explanation": "The bicuspid valve prevents the backflow of oxygenated blood into the left atrium during ventricular contraction."
    },
    {
      "question": "Which blood vessel carries deoxygenated blood from the heart to the lungs?",
      "options": ["Aorta", "Pulmonary vein", "Pulmonary artery", "Vena cava"],
      "correctAnswer": "Pulmonary artery",
      "difficulty": "easy",
      "explanation": "Arteries carry blood away from the heart. The pulmonary artery is unique because it carries deoxygenated blood."
    },
    {
      "question": "What is the primary function of the coronary arteries?",
      "options": ["To carry blood to the brain", "To supply the heart muscle with oxygen and nutrients", "To carry blood from the lungs", "To regulate blood pressure in the aorta"],
      "correctAnswer": "To supply the heart muscle with oxygen and nutrients",
      "difficulty": "moderate",
      "explanation": "The heart is a muscle that needs its own dedicated blood supply to function and stay alive."
    },
    {
      "question": "How does physical activity affect the heart rate?",
      "options": ["It decreases the heart rate to save energy.", "It has no effect on heart rate.", "It increases the heart rate to supply more oxygen to working muscles.", "It causes the heart to stop momentarily."],
      "correctAnswer": "It increases the heart rate to supply more oxygen to working muscles.",
      "difficulty": "easy",
      "explanation": "During exercise, muscles respire faster and require more oxygen and glucose, necessitating a faster heart rate."
    },
    {
      "question": "Which of the following is a major risk factor for Coronary Heart Disease (CHD)?",
      "options": ["High intake of saturated fats", "Regular exercise", "Drinking plenty of water", "High fiber diet"],
      "correctAnswer": "High intake of saturated fats",
      "difficulty": "easy",
      "explanation": "Saturated fats can lead to cholesterol buildup (plaque) in the coronary arteries, narrowing them."
    },
    {
      "question": "What happens during 'diastole' in the cardiac cycle?",
      "options": ["The heart muscle contracts and pumps blood.", "The heart muscle relaxes and chambers fill with blood.", "The valves close with a loud sound.", "Blood pressure reaches its maximum."],
      "correctAnswer": "The heart muscle relaxes and chambers fill with blood.",
      "difficulty": "moderate",
      "explanation": "Diastole is the relaxation phase; Systole is the contraction phase."
    },
    {
      "question": "Which type of blood vessel has thin, permeable walls to allow for the exchange of materials?",
      "options": ["Arteries", "Veins", "Capillaries", "Venules"],
      "correctAnswer": "Capillaries",
      "difficulty": "easy",
      "explanation": "Capillary walls are only one cell thick, allowing oxygen, nutrients, and waste to diffuse between blood and tissues."
    },
    {
      "question": "Veins contain valves primarily to:",
      "options": ["Increase blood pressure", "Speed up blood flow", "Prevent the backflow of blood", "Separate oxygenated and deoxygenated blood"],
      "correctAnswer": "Prevent the backflow of blood",
      "difficulty": "easy",
      "explanation": "Because blood pressure in veins is low, valves are necessary to ensure blood keeps moving toward the heart, especially against gravity."
    },
    {
      "question": "The liquid part of the blood that carries dissolved nutrients and hormones is called:",
      "options": ["Hemoglobin", "Plasma", "Platelets", "Serum"],
      "correctAnswer": "Plasma",
      "difficulty": "easy",
      "explanation": "Plasma is about 90% water and serves as the medium for transporting cells and dissolved substances."
    },
    {
      "question": "Which blood component is responsible for carrying oxygen?",
      "options": ["White blood cells", "Platelets", "Red blood cells (erythrocytes)", "Plasma proteins"],
      "correctAnswer": "Red blood cells (erythrocytes)",
      "difficulty": "easy",
      "explanation": "Red blood cells contain hemoglobin, a protein that binds to oxygen."
    },
    {
      "question": "What is the function of 'phagocytes'?",
      "options": ["Producing antibodies", "Carrying carbon dioxide", "Engulfing and digesting pathogens", "Forming blood clots"],
      "correctAnswer": "Engulfing and digesting pathogens",
      "difficulty": "moderate",
      "explanation": "Phagocytes are a type of white blood cell that protects the body by ingesting harmful bacteria."
    },
    {
      "question": "Which cell fragment is essential for the process of blood clotting?",
      "options": ["Lymphocytes", "Platelets", "Monocytes", "Eosinophils"],
      "correctAnswer": "Platelets",
      "difficulty": "easy",
      "explanation": "Platelets (thrombocytes) aggregate at the site of a wound to plug leaks and initiate the clotting cascade."
    },
    {
      "question": "An individual with Blood Group O is considered a 'Universal Donor' because:",
      "options": ["Their red cells have both A and B antigens.", "Their red cells have no A or B antigens.", "Their plasma contains no antibodies.", "They can receive blood from any other group."],
      "correctAnswer": "Their red cells have no A or B antigens.",
      "difficulty": "hard",
      "explanation": "Because Group O cells lack A and B antigens, they will not be attacked by the antibodies in the recipient's blood."
    },
    {
      "question": "Which blood group is known as the 'Universal Recipient'?",
      "options": ["Group A", "Group B", "Group AB", "Group O"],
      "correctAnswer": "Group AB",
      "difficulty": "moderate",
      "explanation": "People with blood group AB have no anti-A or anti-B antibodies in their plasma, so they can safely receive any blood type."
    },
    {
      "question": "What is 'lymph'?",
      "options": ["A type of red blood cell.", "Fluid that has leaked out of capillaries and is collected by the lymphatic system.", "The waste product of the kidneys.", "A hormone produced by the heart."],
      "correctAnswer": "Fluid that has leaked out of capillaries and is collected by the lymphatic system.",
      "difficulty": "moderate",
      "explanation": "Lymph is essentially tissue fluid that is returned to the circulatory system via lymph vessels."
    },
    {
      "question": "Where are 'lymph nodes' primarily located?",
      "options": ["Only in the brain", "In the heart chambers", "At intervals along lymph vessels (e.g., neck, armpits, groin)", "Inside the lungs"],
      "correctAnswer": "At intervals along lymph vessels (e.g., neck, armpits, groin)",
      "difficulty": "moderate",
      "explanation": "Lymph nodes filter the lymph and contain white blood cells to fight infections."
    },
    {
      "question": "Order the following structures to show the path of blood starting from the Vena Cava:",
      "orderCorrect": ["Right Atrium", "Right Ventricle", "Pulmonary Artery", "Lungs", "Pulmonary Vein", "Left Atrium", "Left Ventricle", "Aorta"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "This sequence follows the path of blood through both the pulmonary and systemic circuits."
    },
    {
      "question": "True or False: Mature red blood cells have a nucleus to help them divide faster.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Red blood cells lose their nucleus during maturation to provide more space for hemoglobin."
    },
    {
      "question": "What is the function of 'lymphocytes'?",
      "options": ["Carrying oxygen", "Producing antibodies", "Clotting blood", "Filtering urine"],
      "correctAnswer": "Producing antibodies",
      "difficulty": "moderate",
      "explanation": "Lymphocytes are white blood cells that recognize specific pathogens and produce antibodies to neutralize them."
    },
    {
      "question": "A person with a heart rate of 70 beats per minute and a stroke volume of 70 mL has a cardiac output of:",
      "options": ["140 mL/min", "4900 mL/min", "1 mL/min", "700 mL/min"],
      "correctAnswer": "4900 mL/min",
      "difficulty": "hard",
      "type": "calculation",
      "explanation": "Cardiac Output = Heart Rate × Stroke Volume (70 × 70 = 4900)."
    },
    {
      "question": "Which of the following describes 'angina'?",
      "options": ["A total blockage of the aorta.", "Chest pain caused by reduced blood flow to the heart muscle.", "A type of blood cancer.", "The process of blood clotting in a cut."],
      "correctAnswer": "Chest pain caused by reduced blood flow to the heart muscle.",
      "difficulty": "moderate",
      "explanation": "Angina is often a warning sign of coronary heart disease."
    },
    {
      "question": "Assertion: Arteries have thick, elastic walls.\nReason: They must withstand and maintain high pressure as blood is pumped from the heart.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Arterial walls contain muscle and elastic fibers to handle the surge of blood from the ventricles."
    },
    {
      "question": "In the lymphatic system, what is the role of the 'spleen'?",
      "options": ["Producing bile", "Filtering blood and removing old red blood cells", "Pumping lymph through the body", "Digesting proteins"],
      "correctAnswer": "Filtering blood and removing old red blood cells",
      "difficulty": "hard",
      "explanation": "The spleen acts as a giant lymph node for the blood system, recycling old cells and storing white blood cells."
    },
    {
      "question": "Which of these is NOT a function of the circulatory system?",
      "options": ["Transport of hormones", "Regulation of body temperature", "Production of digestive enzymes", "Defense against disease"],
      "correctAnswer": "Production of digestive enzymes",
      "difficulty": "moderate",
      "explanation": "Digestive enzymes are produced by the digestive system (exocrine glands like the pancreas), not the circulatory system."
    },
    {
      "question": "What happens during a 'heart attack' (myocardial infarction)?",
      "options": [
        "The heart beats too fast.",
        "A coronary artery is completely blocked, causing heart muscle cells to die.",
        "The lungs stop providing oxygen.",
        "Blood pressure drops to zero instantly."
      ],
      "correctAnswer": "A coronary artery is completely blocked, causing heart muscle cells to die.",
      "difficulty": "moderate",
      "explanation": "A heart attack occurs when the blood supply to a part of the heart is cut off."
    },
    {
      "question": "Which blood vessel has a very large lumen and thin walls?",
      "options": ["Artery", "Vein", "Capillary", "Arteriole"],
      "correctAnswer": "Vein",
      "difficulty": "moderate",
      "explanation": "Veins have a large lumen to reduce resistance to blood flow as it returns to the heart under low pressure."
    },
    {
      "question": "The 'biconcave' shape of red blood cells is an adaptation for:",
      "options": ["Fitting through wide arteries", "Increasing surface area for faster oxygen diffusion", "Storing more nutrients", "Protecting the nucleus"],
      "correctAnswer": "Increasing surface area for faster oxygen diffusion",
      "difficulty": "moderate",
      "explanation": "The shape increases the surface-area-to-volume ratio, facilitating gas exchange."
    },
    {
      "question": "Identify the 'error' in this statement: 'The pulmonary vein carries deoxygenated blood from the lungs to the heart.'",
      "options": [
        "The pulmonary vein carries oxygenated blood.",
        "The pulmonary vein carries blood to the lungs.",
        "The pulmonary vein is actually an artery.",
        "There is no error."
      ],
      "correctAnswer": "The pulmonary vein carries oxygenated blood.",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Veins usually carry deoxygenated blood, but the pulmonary vein is the exception—it returns freshly oxygenated blood from the lungs."
    },
    {
      "question": "What is the 'pacemaker' of the heart?",
      "options": ["The brain", "The Sinoatrial (SA) node", "The Aorta", "The Bicuspid valve"],
      "correctAnswer": "The Sinoatrial (SA) node",
      "difficulty": "hard",
      "explanation": "The SA node in the right atrium sends out electrical impulses that trigger the heart to beat."
    },
    {
      "question": "Situational Judgment: A person has a low platelet count. What symptom are they most likely to experience?",
      "options": ["Shortness of breath", "Difficulty fighting infections", "Prolonged bleeding from minor cuts", "Chest pain during exercise"],
      "correctAnswer": "Prolonged bleeding from minor cuts",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Platelets are necessary for clotting; without enough of them, blood cannot seal wounds effectively."
    },
    {
      "question": "In a blood transfusion, what happens during 'agglutination'?",
      "options": [
        "Blood flows faster.",
        "Red blood cells clump together because of incompatible antigens and antibodies.",
        "The blood becomes thinner.",
        "Platelets dissolve."
      ],
      "correctAnswer": "Red blood cells clump together because of incompatible antigens and antibodies.",
      "difficulty": "hard",
      "explanation": "Agglutination is dangerous as it can block small blood vessels."
    },
    {
      "question": "Which of the following is a way to prevent Coronary Heart Disease?",
      "options": ["Smoking", "High salt diet", "Regular aerobic exercise", "Sedentary lifestyle"],
      "correctAnswer": "Regular aerobic exercise",
      "difficulty": "easy",
      "explanation": "Exercise strengthens the heart muscle and helps manage cholesterol levels."
    },
    {
      "question": "The septum in the heart is important because:",
      "options": [
        "It acts as a valve.",
        "It prevents oxygenated and deoxygenated blood from mixing.",
        "It produces blood cells.",
        "It connects the heart to the lungs."
      ],
      "correctAnswer": "It prevents oxygenated and deoxygenated blood from mixing.",
      "difficulty": "moderate",
      "explanation": "The septum is the muscular wall that divides the left and right sides of the heart."
    },
    {
      "question": "What is 'oedema'?",
      "options": [
        "A type of heart valve failure.",
        "Swelling caused by an accumulation of tissue fluid in the body.",
        "The process of red blood cell production.",
        "A blockage in the aorta."
      ],
      "correctAnswer": "Swelling caused by an accumulation of tissue fluid in the body.",
      "difficulty": "hard",
      "explanation": "Oedema can happen if the lymphatic system is blocked or if blood pressure is too high."
    },
    {
      "question": "Which blood vessel has the highest pressure?",
      "options": ["Vena cava", "Pulmonary vein", "Aorta", "Hepatic portal vein"],
      "correctAnswer": "Aorta",
      "difficulty": "moderate",
      "explanation": "The aorta receives blood directly from the powerful contraction of the left ventricle."
    },
    {
      "question": "A 'sphygmomanometer' is a device used to measure:",
      "options": ["Heart rate", "Blood pressure", "Lung capacity", "Body temperature"],
      "correctAnswer": "Blood pressure",
      "difficulty": "moderate",
      "explanation": "It measures systolic and diastolic pressure in the arteries."
    },
    {
      "question": "Select ALL blood components that are involved in the body's immune defense:",
      "multiSelect": true,
      "options": [
        "Phagocytes",
        "Lymphocytes",
        "Red blood cells",
        "Platelets",
        "Plasma antibodies"
      ],
      "correctAnswer": ["Phagocytes", "Lymphocytes", "Plasma antibodies"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Red blood cells transport oxygen and platelets handle clotting; the others are part of the immune system."
    },
    {
      "question": "What is the role of the 'Hepatic Portal Vein'?",
      "options": [
        "Carrying blood from the heart to the liver.",
        "Carrying nutrient-rich blood from the gut to the liver.",
        "Carrying deoxygenated blood from the liver to the heart.",
        "Carrying bile to the gallbladder."
      ],
      "correctAnswer": "Carrying nutrient-rich blood from the gut to the liver.",
      "difficulty": "hard",
      "explanation": "This unique vein allows the liver to process and detoxify nutrients absorbed by the intestines before they reach the rest of the body."
    },
    {
      "question": "Fill in the blank: _____ is a protein in red blood cells that contains iron and binds to oxygen.",
      "options": ["Fibrin", "Hemoglobin", "Insulin", "Albumin"],
      "correctAnswer": "Hemoglobin",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Hemoglobin gives blood its red color when oxygenated."
    },
    {
      "question": "Why does the body need to 'shunt' blood away from the digestive system during intense exercise?",
      "options": [
        "To prevent vomiting.",
        "To prioritize blood flow to the heart and skeletal muscles.",
        "Because the stomach stops working forever.",
        "To make the person run faster."
      ],
      "correctAnswer": "To prioritize blood flow to the heart and skeletal muscles.",
      "difficulty": "moderate",
      "explanation": "The body redirects blood to where oxygen demand is highest."
    },
    {
      "question": "Which of these is a symptom of 'anemia'?",
      "options": ["High blood pressure", "Chest pain", "Tiredness and pale skin", "Swelling of the legs"],
      "correctAnswer": "Tiredness and pale skin",
      "difficulty": "moderate",
      "explanation": "Anemia is a shortage of red blood cells or hemoglobin, reducing the blood's capacity to carry oxygen."
    },
    {
      "question": "Case Study: A patient has a blockage in their left coronary artery. Which part of their heart is most at risk?",
      "options": ["The right atrium", "The left ventricle muscle", "The pulmonary artery", "The tricuspid valve"],
      "correctAnswer": "The left ventricle muscle",
      "difficulty": "hard",
      "type": "caseBased",
      "explanation": "The left coronary artery supplies the left side of the heart, which is responsible for systemic circulation."
    },
    {
      "question": "True or False: The lymphatic system has its own heart to pump lymph.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Lymph is moved by the contraction of surrounding skeletal muscles and the presence of valves; there is no central pump."
    },
    {
      "question": "What happens to the chest sounds 'lub-dub'?",
      "options": [
        "They are caused by blood rushing through the aorta.",
        "They are caused by the closing of heart valves.",
        "They are caused by the heart hitting the ribs.",
        "They are the sound of the lungs inflating."
      ],
      "correctAnswer": "They are caused by the closing of heart valves.",
      "difficulty": "moderate",
      "explanation": "The 'lub' is the AV valves closing; the 'dub' is the semilunar valves closing."
    },
    {
      "question": "Which blood vessel returns blood to the right atrium from the body?",
      "options": ["Aorta", "Pulmonary vein", "Vena cava", "Carotid artery"],
      "correctAnswer": "Vena cava",
      "difficulty": "easy",
      "explanation": "The superior and inferior vena cava are the largest veins returning deoxygenated blood to the heart."
    },
    {
      "question": "In the process of blood clotting, fibrinogen is converted into:",
      "options": ["Platelets", "Fibrin", "Plasma", "Hemoglobin"],
      "correctAnswer": "Fibrin",
      "difficulty": "hard",
      "explanation": "Fibrin forms a mesh of threads that traps blood cells to form a stable clot."
    },
    {
      "question": "Which of the following describes 'hypertension'?",
      "options": ["Low blood sugar", "High blood pressure", "A fast heart rate", "Lack of oxygen in blood"],
      "correctAnswer": "High blood pressure",
      "difficulty": "easy",
      "explanation": "Chronic high blood pressure can damage the heart and blood vessels."
    },
    {
      "question": "What is the function of 'tissue fluid'?",
      "options": [
        "To lubricate joints.",
        "To bathe the cells and facilitate the exchange of substances between blood and cells.",
        "To produce white blood cells.",
        "To carry oxygen to the lungs."
      ],
      "correctAnswer": "To bathe the cells and facilitate the exchange of substances between blood and cells.",
      "difficulty": "moderate",
      "explanation": "Tissue fluid is formed from plasma leaking out of capillaries under pressure."
    },
    {
      "question": "Which blood group can safely donate to a person with Blood Group B?",
      "options": ["Group A and O", "Group B and O", "Group AB and B", "Only Group B"],
      "correctAnswer": "Group B and O",
      "difficulty": "moderate",
      "explanation": "Group B can receive from B and from the universal donor O."
    }
  ],
  "Unit 9: Cellular respiration": [
    {
      "question": "What does the abbreviation 'ATP' stand for in biology?",
      "options": ["Adenosine Triphosphate", "Adenine Total Protein", "Advanced Terminal Phosphate", "Ammonium Tri-phosphite"],
      "correctAnswer": "Adenosine Triphosphate",
      "difficulty": "easy",
      "explanation": "ATP is the universal energy currency of cells, storing and providing energy for metabolic processes."
    },
    {
      "question": "Which of the following describes the role of ATP in metabolism?",
      "options": ["It is a long-term storage of fat.", "It acts as an immediate source of energy for cellular activities.", "It is the primary structural component of cell walls.", "It serves as the genetic blueprint for proteins."],
      "correctAnswer": "It acts as an immediate source of energy for cellular activities.",
      "difficulty": "easy",
      "explanation": "ATP provides energy for tasks such as muscle contraction, active transport, and chemical synthesis."
    },
    {
      "question": "When ATP is hydrolyzed into ADP and an inorganic phosphate, what is released?",
      "options": ["Glucose", "Energy", "Carbon dioxide", "Oxygen"],
      "correctAnswer": "Energy",
      "difficulty": "moderate",
      "explanation": "Breaking the high-energy bond between the second and third phosphate groups releases energy that the cell can use."
    },
    {
      "question": "Which process describes the 'recharging' of ADP back into ATP?",
      "options": ["Hydrolysis", "Phosphorylation", "Dehydration", "Decarboxylation"],
      "correctAnswer": "Phosphorylation",
      "difficulty": "hard",
      "explanation": "Phosphorylation is the addition of a phosphate group to ADP using energy derived from the breakdown of food molecules."
    },
    {
      "question": "What is the primary difference between aerobic and anaerobic respiration?",
      "options": ["Aerobic requires light; anaerobic does not.", "Aerobic requires oxygen; anaerobic does not.", "Aerobic occurs in the cytoplasm; anaerobic occurs in the nucleus.", "Aerobic produces less energy than anaerobic."],
      "correctAnswer": "Aerobic requires oxygen; anaerobic does not.",
      "difficulty": "easy",
      "explanation": "Aerobic respiration uses oxygen to fully oxidize glucose, while anaerobic respiration occurs in the absence of oxygen."
    },
    {
      "question": "Where in the cell does most of the aerobic respiration process take place?",
      "options": ["Ribosomes", "Chloroplasts", "Mitochondria", "Vacuoles"],
      "correctAnswer": "Mitochondria",
      "difficulty": "easy",
      "explanation": "Mitochondria are often called the 'powerhouse of the cell' because they are the site of ATP production through aerobic respiration."
    },
    {
      "question": "What are the end products of aerobic respiration in humans?",
      "options": ["Lactic acid and water", "Ethanol and carbon dioxide", "Carbon dioxide, water, and ATP", "Glucose and oxygen"],
      "correctAnswer": "Carbon dioxide, water, and ATP",
      "difficulty": "moderate",
      "explanation": "The complete breakdown of glucose in the presence of oxygen yields CO2, H2O, and a significant amount of energy (ATP)."
    },
    {
      "question": "Which type of respiration yields the highest amount of ATP per molecule of glucose?",
      "options": ["Lactic acid fermentation", "Alcoholic fermentation", "Aerobic respiration", "Anaerobic respiration in bacteria"],
      "correctAnswer": "Aerobic respiration",
      "difficulty": "moderate",
      "explanation": "Aerobic respiration can produce up to 38 ATP molecules, whereas anaerobic respiration typically produces only 2 ATP molecules per glucose."
    },
    {
      "question": "During strenuous exercise, human muscle cells may switch to anaerobic respiration. What product builds up as a result?",
      "options": ["Ethanol", "Lactic acid", "Glucose", "Nitrogen"],
      "correctAnswer": "Lactic acid",
      "difficulty": "easy",
      "explanation": "Lactic acid is produced in muscles when oxygen supply is insufficient to meet energy demands, leading to muscle fatigue."
    },
    {
      "question": "Which of the following organisms is most famous for performing alcoholic fermentation?",
      "options": ["Humans", "Yeast", "Amoeba", "Trees"],
      "correctAnswer": "Yeast",
      "difficulty": "easy",
      "explanation": "Yeast breaks down glucose into ethanol and carbon dioxide in the absence of oxygen."
    },
    {
      "question": "In the baking industry, yeast is used to make bread rise. Which product of fermentation is responsible for this?",
      "options": ["Ethanol", "Lactic acid", "Oxygen", "Carbon dioxide"],
      "correctAnswer": "Carbon dioxide",
      "difficulty": "moderate",
      "explanation": "CO2 gas bubbles get trapped in the dough, causing it to expand and rise."
    },
    {
      "question": "What is 'oxygen debt'?",
      "options": [
        "The amount of oxygen stored in the lungs.",
        "The extra oxygen needed after exercise to break down lactic acid.",
        "A condition where the body stops needing oxygen.",
        "The carbon dioxide produced during sleep."
      ],
      "correctAnswer": "The extra oxygen needed after exercise to break down lactic acid.",
      "difficulty": "hard",
      "explanation": "After intense activity, heavy breathing continues to provide the oxygen required to oxidize accumulated lactic acid in the liver."
    },
    {
      "question": "Which of the following is an application of anaerobic respiration in the food industry?",
      "options": ["Production of yogurt and cheese", "Baking bread", "Brewing beer", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Fermentation by bacteria (lactic acid) and yeast (alcohol/CO2) is central to many food production processes."
    },
    {
      "question": "Which of the following chemical equations represents aerobic respiration?",
      "options": [
        "C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy",
        "6CO2 + 6H2O + Energy → C6H12O6 + 6O2",
        "C6H12O6 → 2C2H5OH + 2CO2 + Energy",
        "C6H12O6 → 2C3H6O3 + Energy"
      ],
      "correctAnswer": "C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy",
      "difficulty": "hard",
      "explanation": "This equation shows glucose reacting with oxygen to produce carbon dioxide, water, and energy."
    },
    {
      "question": "True or False: Anaerobic respiration occurs entirely in the cytoplasm of the cell.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Unlike aerobic respiration, anaerobic respiration does not involve the mitochondria."
    },
    {
      "question": "Which stage of cellular respiration is common to both aerobic and anaerobic pathways?",
      "options": ["Krebs Cycle", "Electron Transport Chain", "Glycolysis", "Link Reaction"],
      "correctAnswer": "Glycolysis",
      "difficulty": "hard",
      "explanation": "Glycolysis is the initial breakdown of glucose into pyruvate and does not require oxygen."
    },
    {
      "question": "What is the total number of ATP molecules produced during the anaerobic breakdown of one glucose molecule?",
      "options": ["2", "4", "36", "38"],
      "correctAnswer": "2",
      "difficulty": "moderate",
      "type": "calculation",
      "explanation": "Anaerobic respiration is much less efficient, yielding only 2 net ATP from glycolysis."
    },
    {
      "question": "In the production of beer, the sugar source is often malted barley. What happens to the sugar during brewing?",
      "options": [
        "It is converted into protein.",
        "It is fermented by yeast into ethanol and CO2.",
        "It is oxidized into oxygen.",
        "It is frozen to preserve flavor."
      ],
      "correctAnswer": "It is fermented by yeast into ethanol and CO2.",
      "difficulty": "moderate",
      "explanation": "Alcoholic fermentation is the key step in producing beverages with alcohol content."
    },
    {
      "question": "Which acid is produced by bacteria during the making of yogurt?",
      "options": ["Citric acid", "Hydrochloric acid", "Lactic acid", "Amino acid"],
      "correctAnswer": "Lactic acid",
      "difficulty": "moderate",
      "explanation": "Lactic acid bacteria ferment the lactose in milk, which lowers the pH and causes the milk proteins to thicken."
    },
    {
      "question": "Why is cellular respiration considered an 'exothermic' or 'exergonic' reaction?",
      "options": ["It absorbs heat from the surroundings.", "It releases energy from chemical bonds.", "It only happens in cold temperatures.", "It requires a lot of light energy."],
      "correctAnswer": "It releases energy from chemical bonds.",
      "difficulty": "moderate",
      "explanation": "The process releases energy stored in the chemical bonds of glucose, which is then captured in ATP."
    },
    {
      "question": "Order the steps of energy release in a cell from glucose to activity:",
      "orderCorrect": ["Glucose breakdown (Respiration)", "Formation of ATP", "Hydrolysis of ATP to ADP", "Release of energy for cellular work"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Energy is first transferred from glucose to ATP, which then travels to where it is needed to be broken down again."
    },
    {
      "question": "Which of these is NOT a requirement for aerobic respiration?",
      "options": ["Glucose", "Oxygen", "Enzymes", "Chlorophyll"],
      "correctAnswer": "Chlorophyll",
      "difficulty": "easy",
      "explanation": "Chlorophyll is required for photosynthesis, not respiration. Even plants respire without needing chlorophyll for that specific process."
    },
    {
      "question": "Assertion: Anaerobic respiration is useful during intense short-distance sprints.\nReason: It allows for the rapid production of energy when the oxygen supply cannot keep up with demand.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Anaerobic respiration provides an 'emergency' energy boost when aerobic respiration is insufficient."
    },
    {
      "question": "What happens to the ethanol produced during bread making?",
      "options": [
        "It stays in the bread and makes it alcoholic.",
        "It evaporates during the baking process.",
        "It turns into sugar.",
        "It reacts with CO2 to form flour."
      ],
      "correctAnswer": "It evaporates during the baking process.",
      "difficulty": "moderate",
      "explanation": "High oven temperatures evaporate the small amount of ethanol produced by yeast during fermentation."
    },
    {
      "question": "The folding of the inner mitochondrial membrane into 'cristae' is an adaptation to:",
      "options": ["Store more glucose.", "Increase surface area for aerobic respiration enzymes.", "Filter out carbon dioxide.", "Make the cell look better."],
      "correctAnswer": "Increase surface area for aerobic respiration enzymes.",
      "difficulty": "hard",
      "explanation": "More surface area allows for more electron transport chain proteins, increasing ATP production capacity."
    },
    {
      "question": "Identify the 'error' in this equation for anaerobic respiration in yeast: C6H12O6 → 2C3H6O3 + Energy.",
      "options": [
        "This is the equation for lactic acid fermentation, not alcoholic fermentation.",
        "Yeast does not use glucose.",
        "No energy is produced in anaerobic respiration.",
        "Carbon dioxide should be a reactant."
      ],
      "correctAnswer": "This is the equation for lactic acid fermentation, not alcoholic fermentation.",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "Yeast produces ethanol (C2H5OH) and CO2, while the equation shown describes the production of lactic acid (found in muscles or bacteria)."
    },
    {
      "question": "Which of the following processes requires ATP?",
      "options": ["Active transport of ions across membranes", "Protein synthesis", "Muscle contraction", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Nearly all biological 'work' at the cellular level requires the energy provided by ATP."
    },
    {
      "question": "Fill in the blank: In the absence of oxygen, pyruvate is converted into _____ in human muscle cells.",
      "options": ["Ethanol", "Lactic acid", "Citric acid", "Sucrose"],
      "correctAnswer": "Lactic acid",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "This process is known as lactic acid fermentation."
    },
    {
      "question": "What is the biological benefit of seeds being able to respire anaerobically for a short time?",
      "options": [
        "It allows them to survive if soil is waterlogged and lacks oxygen.",
        "It makes the seeds grow into bigger trees.",
        "It prevents birds from eating them.",
        "It allows them to photosynthesize underground."
      ],
      "correctAnswer": "It allows them to survive if soil is waterlogged and lacks oxygen.",
      "difficulty": "moderate",
      "explanation": "Temporary anaerobic respiration can sustain the seed until better conditions (oxygen) are available."
    },
    {
      "question": "True or False: Cellular respiration is the same as breathing.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Breathing (ventilation) is the mechanical process of moving air in and out; cellular respiration is the chemical breakdown of food to release energy inside cells."
    },
    {
      "question": "Which of the following statements about the Krebs Cycle is true?",
      "options": [
        "It is part of anaerobic respiration.",
        "It occurs in the cytoplasm.",
        "It is a stage in aerobic respiration that occurs in the mitochondrial matrix.",
        "It produces ethanol."
      ],
      "correctAnswer": "It is a stage in aerobic respiration that occurs in the mitochondrial matrix.",
      "difficulty": "hard",
      "explanation": "The Krebs cycle follows the link reaction and is essential for generating electron carriers for the final stage of respiration."
    },
    {
      "question": "How is the energy from ATP actually used in muscle contraction?",
      "options": [
        "ATP is turned into heat only.",
        "ATP allows the protein filaments (actin and myosin) to slide over each other.",
        "ATP makes the muscle turn into water.",
        "ATP sends electrical signals to the brain."
      ],
      "correctAnswer": "ATP allows the protein filaments (actin and myosin) to slide over each other.",
      "difficulty": "moderate",
      "explanation": "The 'power stroke' of muscle contraction is powered by the hydrolysis of ATP."
    },
    {
      "question": "Which gas is used up during aerobic respiration?",
      "options": ["Carbon dioxide", "Oxygen", "Nitrogen", "Methane"],
      "correctAnswer": "Oxygen",
      "difficulty": "easy",
      "explanation": "Oxygen acts as the final electron acceptor in the electron transport chain."
    },
    {
      "question": "A scientist measures the gas produced by yeast in a sugar solution. What is the identity of this gas?",
      "options": ["Oxygen", "Carbon dioxide", "Hydrogen", "Argon"],
      "correctAnswer": "Carbon dioxide",
      "difficulty": "easy",
      "explanation": "Fermentation releases CO2, which can be tested using lime water (turns milky)."
    },
    {
      "question": "Case Study: An athlete is running a 100m sprint. Most of their ATP is likely being generated via:",
      "options": ["Aerobic respiration", "Anaerobic respiration", "Photosynthesis", "Digestion"],
      "correctAnswer": "Anaerobic respiration",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Short, explosive activities rely heavily on anaerobic pathways because the cardiovascular system cannot deliver oxygen fast enough."
    },
    {
      "question": "Situational Judgment: If a cell's mitochondria are damaged by a toxin, what will happen to its ATP production?",
      "options": [
        "It will increase to compensate.",
        "It will drop significantly, and the cell may die.",
        "It will stay the same as the cytoplasm takes over.",
        "The cell will start using sunlight."
      ],
      "correctAnswer": "It will drop significantly, and the cell may die.",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Since the mitochondria produce the vast majority of ATP, their loss is usually fatal for the cell."
    },
    {
      "question": "Which of these is a waste product of aerobic respiration that we exhale?",
      "options": ["Urea", "Carbon dioxide", "Sulfur", "Glucose"],
      "correctAnswer": "Carbon dioxide",
      "difficulty": "easy",
      "explanation": "CO2 is produced in the mitochondria, diffuses into the blood, and is expelled by the lungs."
    },
    {
      "question": "In metabolism, 'anabolism' refers to:",
      "options": [
        "The breakdown of large molecules to release energy.",
        "The synthesis of complex molecules from simpler ones using energy.",
        "The movement of molecules out of the cell.",
        "The process of aging."
      ],
      "correctAnswer": "The synthesis of complex molecules from simpler ones using energy.",
      "difficulty": "moderate",
      "explanation": "Anabolism (building) and catabolism (breaking down) together make up metabolism."
    },
    {
      "question": "Select ALL that are products of anaerobic respiration in yeast:",
      "multiSelect": true,
      "options": [
        "Ethanol",
        "Carbon dioxide",
        "ATP",
        "Oxygen",
        "Water"
      ],
      "correctAnswer": ["Ethanol", "Carbon dioxide", "ATP"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Yeast fermentation produces alcohol, gas, and a small amount of energy; it does not produce water as a major product compared to aerobic respiration."
    },
    {
      "question": "Why is the energy in glucose not released all at once?",
      "options": [
        "It would cause the cell to explode or be damaged by heat.",
        "The cell does not have enough space for it.",
        "Enzymes can only work on one molecule per day.",
        "Glucose is too small to contain that much energy."
      ],
      "correctAnswer": "It would cause the cell to explode or be damaged by heat.",
      "difficulty": "moderate",
      "explanation": "Cellular respiration occurs in a series of small, enzyme-controlled steps to release energy efficiently and safely."
    },
    {
      "question": "The conversion of glucose to lactic acid in muscles is called:",
      "options": ["Glycolysis", "Lactic acid fermentation", "The Link Reaction", "Oxidation"],
      "correctAnswer": "Lactic acid fermentation",
      "difficulty": "easy",
      "explanation": "This specific pathway is a type of fermentation used by animals and some bacteria."
    },
    {
      "question": "What is the 'active site' of an enzyme involved in respiration?",
      "options": [
        "The part of the cell where the enzyme is made.",
        "The specific region where the substrate (like glucose) binds and the reaction occurs.",
        "The nucleus of the enzyme.",
        "The tail of the enzyme."
      ],
      "correctAnswer": "The specific region where the substrate (like glucose) binds and the reaction occurs.",
      "difficulty": "moderate",
      "explanation": "Enzymes are protein catalysts, and their shape is critical for their function."
    },
    {
      "question": "Which of the following is true for both aerobic and anaerobic respiration?",
      "options": ["Both produce CO2 in humans.", "Both produce ATP.", "Both require mitochondria.", "Both produce ethanol."],
      "correctAnswer": "Both produce ATP.",
      "difficulty": "moderate",
      "explanation": "The ultimate goal of all respiration is the production of ATP, regardless of whether oxygen is used."
    },
    {
      "question": "In an experiment using a respirometer, what substance is used to absorb carbon dioxide so that oxygen uptake can be measured?",
      "options": ["Water", "Potassium hydroxide (KOH) or Soda lime", "Glucose solution", "Oil"],
      "correctAnswer": "Potassium hydroxide (KOH) or Soda lime",
      "difficulty": "hard",
      "explanation": "By removing CO2 as it is produced, the decrease in gas volume in the respirometer corresponds directly to the oxygen consumed by the organism."
    },
    {
      "question": "Which of these contains the most energy per gram?",
      "options": ["Proteins", "Carbohydrates", "Lipids (Fats)", "Vitamins"],
      "correctAnswer": "Lipids (Fats)",
      "difficulty": "moderate",
      "explanation": "Fats are the most energy-dense macronutrient, providing more energy per gram when respired than carbohydrates or proteins."
    },
    {
      "question": "True or False: Living organisms continue to respire even while they are sleeping.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Respiration is a continuous process needed to maintain vital functions like heartbeats, breathing, and temperature regulation."
    },
    {
      "question": "What happens to the rate of respiration as temperature increases (up to the point where enzymes denature)?",
      "options": ["It stays the same.", "It decreases.", "It increases.", "It stops immediately."],
      "correctAnswer": "It increases.",
      "difficulty": "moderate",
      "explanation": "Higher temperatures provide more kinetic energy for molecules, increasing the frequency of collisions between enzymes and substrates."
    },
    {
      "question": "The 'energy currency' of the cell is compared to a rechargeable battery. Which state represents the 'charged' battery?",
      "options": ["ADP", "AMP", "ATP", "Glucose"],
      "correctAnswer": "ATP",
      "difficulty": "easy",
      "explanation": "ATP holds the energy ready for use; once used, it becomes the 'uncharged' ADP."
    },
    {
      "question": "Which of these would decrease the rate of aerobic respiration in a cell?",
      "options": [
        "An increase in oxygen concentration.",
        "A decrease in available glucose.",
        "An increase in mitochondria number.",
        "Keeping the cell at its optimum temperature."
      ],
      "correctAnswer": "A decrease in available glucose.",
      "difficulty": "easy",
      "explanation": "Glucose is the fuel for respiration; without it, the rate must decline."
    },
    {
      "question": "In industrial biogas production, organic waste is broken down by bacteria in a process similar to:",
      "options": ["Aerobic respiration", "Anaerobic respiration (fermentation)", "Photosynthesis", "Combustion"],
      "correctAnswer": "Anaerobic respiration (fermentation)",
      "difficulty": "moderate",
      "explanation": "Biogas (methane) is produced by anaerobic digesters where bacteria break down waste without oxygen."
    }
  ],
  "Unit 10: Skin and homeostatic mechanisms": [
    {
      "question": "What is the definition of homeostasis?",
      "options": ["The ability of an organism to change its external environment.", "The maintenance of a constant internal environment despite external changes.", "The process of digesting food into simpler nutrients.", "The movement of water across a semi-permeable membrane."],
      "correctAnswer": "The maintenance of a constant internal environment despite external changes.",
      "difficulty": "easy",
      "explanation": "Homeostasis ensures that vital conditions like temperature and blood pH remain within narrow limits for optimal enzyme function."
    },
    {
      "question": "Which of the following is the outermost layer of the human skin?",
      "options": ["Dermis", "Hypodermis", "Epidermis", "Subcutaneous layer"],
      "correctAnswer": "Epidermis",
      "difficulty": "easy",
      "explanation": "The epidermis acts as a waterproof barrier and protects the body from infection."
    },
    {
      "question": "Which layer of the skin contains blood vessels, nerves, and sweat glands?",
      "options": ["Epidermis", "Dermis", "Cornified layer", "Malpighian layer"],
      "correctAnswer": "Dermis",
      "difficulty": "moderate",
      "explanation": "The dermis is the thick inner layer of the skin that houses sensory receptors and helps in thermoregulation."
    },
    {
      "question": "What is the primary role of 'Sebum' produced by sebaceous glands?",
      "options": ["To cool the body through evaporation.", "To keep the skin and hair moist and waterproof.", "To produce Vitamin D.", "To detect pressure changes."],
      "correctAnswer": "To keep the skin and hair moist and waterproof.",
      "difficulty": "moderate",
      "explanation": "Sebum is an oily substance that prevents the skin from drying out and has mild antiseptic properties."
    },
    {
      "question": "How does the skin respond when the body temperature rises above normal?",
      "options": ["Vasoconstriction and shivering", "Sweating and vasodilation", "Erection of hairs", "Decrease in metabolic rate"],
      "correctAnswer": "Sweating and vasodilation",
      "difficulty": "moderate",
      "explanation": "Vasodilation increases blood flow to the skin surface to lose heat, while sweat evaporation cools the skin."
    },
    {
      "question": "The process where blood vessels near the skin surface narrow to reduce heat loss is called:",
      "options": ["Vasodilation", "Vasoconstriction", "Sweating", "Osmoregulation"],
      "correctAnswer": "Vasoconstriction",
      "difficulty": "moderate",
      "explanation": "Vasoconstriction keeps warm blood away from the skin surface to conserve core body heat in cold conditions."
    },
    {
      "question": "Which hormone is released by the pancreas when blood glucose levels are too high?",
      "options": ["Glucagon", "Adrenaline", "Insulin", "Thyroxine"],
      "correctAnswer": "Insulin",
      "difficulty": "easy",
      "explanation": "Insulin stimulates cells to take up glucose and the liver to convert glucose into glycogen."
    },
    {
      "question": "What is the function of the hormone 'Glucagon'?",
      "options": ["To lower blood sugar levels.", "To convert excess glucose into fats.", "To stimulate the liver to convert glycogen back into glucose.", "To increase the rate of heartbeat."],
      "correctAnswer": "To stimulate the liver to convert glycogen back into glucose.",
      "difficulty": "moderate",
      "explanation": "Glucagon is released when blood sugar is low to ensure the body has enough fuel for respiration."
    },
    {
      "question": "Which organ acts as the main 'control center' for regulating body temperature in humans?",
      "options": ["Liver", "Hypothalamus", "Pancreas", "Kidney"],
      "correctAnswer": "Hypothalamus",
      "difficulty": "hard",
      "explanation": "Located in the brain, the hypothalamus acts like a thermostat, sensing blood temperature and sending signals to effectors."
    },
    {
      "question": "In the skin, what is the function of 'Erector Pili' muscles?",
      "options": ["To produce sweat.", "To pull hairs upright to trap a layer of insulating air.", "To pump blood to the epidermis.", "To produce melanin."],
      "correctAnswer": "To pull hairs upright to trap a layer of insulating air.",
      "difficulty": "moderate",
      "explanation": "When cold, these muscles contract (goosebumps), creating an insulating layer of air near the skin."
    },
    {
      "question": "Which of the following is NOT a function of the human skin?",
      "options": ["Protection against mechanical injury", "Synthesis of Vitamin D", "Exchange of gases for respiration", "Excretion of urea and salts"],
      "correctAnswer": "Exchange of gases for respiration",
      "difficulty": "moderate",
      "explanation": "While amphibians use skin for gas exchange, humans rely on lungs; human skin is largely impermeable to gases."
    },
    {
      "question": "Which cells in the skin produce the pigment that protects against UV radiation?",
      "options": ["Keratinocytes", "Melanocytes", "Leukocytes", "Adipocytes"],
      "correctAnswer": "Melanocytes",
      "difficulty": "moderate",
      "explanation": "Melanocytes produce melanin, which absorbs harmful ultraviolet rays from the sun."
    },
    {
      "question": "What happens to excess glucose that cannot be stored as glycogen in the liver or muscles?",
      "options": ["It is excreted by the kidneys.", "It is converted into fat and stored in adipose tissue.", "It is turned into protein.", "It is destroyed by the pancreas."],
      "correctAnswer": "It is converted into fat and stored in adipose tissue.",
      "difficulty": "moderate",
      "explanation": "The body stores long-term energy reserves as fat if glycogen stores are full."
    },
    {
      "question": "A person with Type 1 Diabetes usually:",
      "options": ["Produces too much insulin.", "Cannot produce enough insulin because pancreatic cells are damaged.", "Has cells that do not respond to insulin.", "Needs to eat more sugar to stay healthy."],
      "correctAnswer": "Cannot produce enough insulin because pancreatic cells are damaged.",
      "difficulty": "moderate",
      "explanation": "Type 1 diabetes is often an autoimmune condition where the pancreas fails to produce insulin."
    },
    {
      "question": "What is the normal core body temperature for a healthy human?",
      "options": ["25°C", "37°C", "42°C", "98°C"],
      "correctAnswer": "37°C",
      "difficulty": "easy",
      "explanation": "37°C (98.6°F) is the optimum temperature for human enzymes to function."
    },
    {
      "question": "Negative feedback is a mechanism where:",
      "options": ["A change in a variable triggers a response that amplifies the change.", "A change in a variable triggers a response that counteracts the change.", "The body stops responding to stimuli.", "Harmful bacteria are eliminated by the skin."],
      "correctAnswer": "A change in a variable triggers a response that counteracts the change.",
      "difficulty": "hard",
      "explanation": "Negative feedback brings a system back to its set point (e.g., cooling the body when it gets too hot)."
    },
    {
      "question": "Which part of the skin acts as an insulator against heat loss?",
      "options": ["Malpighian layer", "Cornified layer", "Adipose (fat) tissue", "Dermal papillae"],
      "correctAnswer": "Adipose (fat) tissue",
      "difficulty": "easy",
      "explanation": "The subcutaneous layer containing fat helps retain body heat."
    },
    {
      "question": "True or False: Excretion and Homeostasis are the same thing.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Excretion is the removal of metabolic waste; Homeostasis is the balance of internal conditions. They overlap but are distinct processes."
    },
    {
      "question": "Which of these is a symptom of 'hypothermia'?",
      "options": ["Excessive sweating", "Redness of skin", "Uncontrollable shivering and confusion", "High blood pressure"],
      "correctAnswer": "Uncontrollable shivering and confusion",
      "difficulty": "moderate",
      "explanation": "Hypothermia occurs when the body loses heat faster than it can produce it, causing the core temperature to drop dangerously."
    },
    {
      "question": "The 'Cornified layer' of the epidermis consists of:",
      "options": ["Living cells actively dividing.", "Dead cells filled with keratin.", "Cells containing many blood vessels.", "Sensory receptors for pain."],
      "correctAnswer": "Dead cells filled with keratin.",
      "difficulty": "moderate",
      "explanation": "Keratin makes the skin tough and waterproof, preventing water loss and pathogen entry."
    },
    {
      "question": "Which of the following is an 'effector' in the regulation of blood glucose?",
      "options": ["The Brain", "The Pancreas", "The Liver", "The Glucose itself"],
      "correctAnswer": "The Liver",
      "difficulty": "hard",
      "explanation": "The liver is the effector because it carries out the command (converting glucose to glycogen or vice versa)."
    },
    {
      "question": "In 'Type 2 Diabetes', the body typically:",
      "options": ["Does not produce any insulin.", "Has cells that become resistant to the effects of insulin.", "Has too much glucagon.", "Is unable to digest carbohydrates."],
      "correctAnswer": "Has cells that become resistant to the effects of insulin.",
      "difficulty": "moderate",
      "explanation": "Type 2 is often associated with lifestyle factors like obesity and lack of exercise."
    },
    {
      "question": "When you are frightened, which hormone can cause a temporary rise in blood glucose levels?",
      "options": ["Insulin", "Adrenaline", "Estrogen", "Melatonin"],
      "correctAnswer": "Adrenaline",
      "difficulty": "moderate",
      "explanation": "Adrenaline triggers the breakdown of glycogen to glucose to provide quick energy for 'fight or flight'."
    },
    {
      "question": "Order the steps of a feedback loop:",
      "orderCorrect": ["Stimulus", "Receptor", "Control Center", "Effector", "Response"],
      "difficulty": "moderate",
      "type": "ordering",
      "explanation": "This is the universal sequence for homeostatic control."
    },
    {
      "question": "What is the effect of alcohol on the skin's blood vessels?",
      "options": ["It causes vasoconstriction.", "It causes vasodilation, making the person feel warm but lose heat faster.", "It has no effect.", "It makes skin cells die."],
      "correctAnswer": "It causes vasodilation, making the person feel warm but lose heat faster.",
      "difficulty": "hard",
      "explanation": "Alcohol dilates surface vessels, which can lead to a dangerous drop in core temperature in cold environments."
    },
    {
      "question": "Which of these is a metabolic waste product excreted by the skin?",
      "options": ["Oxygen", "Urea", "Glucose", "Feces"],
      "correctAnswer": "Urea",
      "difficulty": "moderate",
      "explanation": "Sweat contains water, salts, and small amounts of urea."
    },
    {
      "question": "Assertion: Homeostasis is essential for the survival of mammals.\nReason: Enzymes in mammals are highly sensitive to temperature and pH changes.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Internal stability is required so that biochemical reactions can proceed at a constant rate."
    },
    {
      "question": "Fill in the blank: The _____ layer is the layer of the epidermis where new cells are constantly produced by mitosis.",
      "options": ["Cornified", "Malpighian", "Granular", "Dermal"],
      "correctAnswer": "Malpighian",
      "difficulty": "hard",
      "type": "fillBlank",
      "explanation": "New cells from the Malpighian layer push older cells toward the surface."
    },
    {
      "question": "During heavy exercise, how does the skin help the body stay cool?",
      "options": ["By producing more sebum.", "By increasing sweat production for evaporative cooling.", "By shrinking the sweat glands.", "By absorbing more oxygen."],
      "correctAnswer": "By increasing sweat production for evaporative cooling.",
      "difficulty": "easy",
      "explanation": "As sweat evaporates, it takes latent heat away from the skin, cooling the blood underneath."
    },
    {
      "question": "If a person's blood sugar drops to 50 mg/dL (very low), which hormone will the pancreas secrete?",
      "options": ["Insulin", "Glucagon", "Cortisol", "Growth hormone"],
      "correctAnswer": "Glucagon",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Glucagon acts to raise blood glucose back to the normal range of about 70-110 mg/dL."
    },
    {
      "question": "Which of the following describes an 'Islet of Langerhans'?",
      "options": ["A part of the skin that produces hair.", "Clusters of endocrine cells in the pancreas.", "A region in the brain that controls hunger.", "The gap between the epidermis and dermis."],
      "correctAnswer": "Clusters of endocrine cells in the pancreas.",
      "difficulty": "hard",
      "explanation": "These islets contain Alpha cells (glucagon) and Beta cells (insulin)."
    },
    {
      "question": "Why is 'shivering' an effective homeostatic response?",
      "options": ["It scares away predators.", "It uses muscle contraction to generate heat as a byproduct of respiration.", "It helps the skin absorb sunlight.", "It slows down the heart rate."],
      "correctAnswer": "It uses muscle contraction to generate heat as a byproduct of respiration.",
      "difficulty": "moderate",
      "explanation": "Muscle activity is inefficient, and the 'lost' energy is released as heat to warm the body."
    },
    {
      "question": "Which of these is a chronic condition characterized by high blood glucose levels?",
      "options": ["Hypoglycemia", "Diabetes Mellitus", "Anemia", "Hypertension"],
      "correctAnswer": "Diabetes Mellitus",
      "difficulty": "easy",
      "explanation": "Diabetes involves a failure in the insulin-based regulation of blood sugar."
    },
    {
      "question": "Identify the incorrect pair regarding thermoregulation:",
      "options": [
        "Hot environment - Vasodilation",
        "Cold environment - Shivering",
        "Hot environment - Hairs standing up",
        "Cold environment - Vasoconstriction"
      ],
      "correctAnswer": "Hot environment - Hairs standing up",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Hairs stand up in the cold to trap air; in the heat, they lie flat to allow air to circulate."
    },
    {
      "question": "What is the function of sensory receptors in the skin?",
      "options": ["To produce Vitamin D.", "To detect changes in the external environment like pressure and temperature.", "To release hormones into the blood.", "To hold the skin onto the muscles."],
      "correctAnswer": "To detect changes in the external environment like pressure and temperature.",
      "difficulty": "easy",
      "explanation": "Sensory receptors allow the brain to process touch, pain, heat, and cold."
    },
    {
      "question": "Select ALL that are involved in cooling the body:",
      "multiSelect": true,
      "options": [
        "Sweat glands",
        "Vasodilation",
        "Erector pili muscles relaxing",
        "Shivering",
        "Vasoconstriction"
      ],
      "correctAnswer": ["Sweat glands", "Vasodilation", "Erector pili muscles relaxing"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Shivering and vasoconstriction are mechanisms used to warm the body or conserve heat."
    },
    {
      "question": "How does the body 'sense' that blood glucose is too high?",
      "options": [
        "Receptors in the stomach detect the sugar.",
        "Beta cells in the pancreas detect the glucose concentration in the blood.",
        "The liver feels the weight of the glucose.",
        "The tongue sends a signal to the brain."
      ],
      "correctAnswer": "Beta cells in the pancreas detect the glucose concentration in the blood.",
      "difficulty": "hard",
      "explanation": "The pancreas acts as both the sensor and the control center in glucose regulation."
    },
    {
      "question": "Case Study: A man is stranded in a desert. He is sweating profusely but has no water to drink. What is the risk to his homeostasis?",
      "options": ["His blood glucose will rise too high.", "He will suffer from dehydration and loss of osmoregulation.", "He will develop hypothermia.", "His hair will fall out."],
      "correctAnswer": "He will suffer from dehydration and loss of osmoregulation.",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Loss of water through sweat must be balanced by intake to maintain blood volume and salt concentrations."
    },
    {
      "question": "The 'storage' form of glucose in the liver is:",
      "options": ["Starch", "Glycogen", "Cellulose", "Glucagon"],
      "correctAnswer": "Glycogen",
      "difficulty": "easy",
      "explanation": "Glycogen is a large, insoluble polysaccharide used for short-term energy storage in animals."
    },
    {
      "question": "What is the primary danger of extremely high body temperature (fever above 42°C)?",
      "options": [
        "The blood will turn into water.",
        "Enzymes will denature and stop functioning.",
        "The skin will turn blue.",
        "The person will become too energetic."
      ],
      "correctAnswer": "Enzymes will denature and stop functioning.",
      "difficulty": "moderate",
      "explanation": "Heat breaks the chemical bonds that hold enzymes in their specific shapes, stopping life-sustaining reactions."
    },
    {
      "question": "Which of these is a way the skin protects against pathogens?",
      "options": ["By being a physical barrier.", "By secreting acidic sebum and sweat.", "By having a layer of dead cells that shed.", "All of the above."],
      "correctAnswer": "All of the above.",
      "difficulty": "easy",
      "explanation": "The skin uses physical, chemical, and biological means to prevent infection."
    },
    {
      "question": "True or False: Type 1 diabetes is generally caused by obesity.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Type 2 diabetes is strongly linked to obesity; Type 1 is usually an insulin deficiency due to damaged pancreas cells."
    },
    {
      "question": "What is the role of 'Negative Feedback' in blood glucose control?",
      "options": [
        "It makes sure glucose levels keep rising.",
        "It ensures that once glucose levels return to normal, the production of insulin/glucagon is adjusted.",
        "It causes the person to feel hungry.",
        "It stops the liver from working."
      ],
      "correctAnswer": "It ensures that once glucose levels return to normal, the production of insulin/glucagon is adjusted.",
      "difficulty": "hard",
      "explanation": "Feedback loops prevent over-correction of blood sugar levels."
    },
    {
      "question": "Which of these results in 'Goosebumps'?",
      "options": ["Relaxation of skin muscles.", "Contraction of erector pili muscles.", "Excessive sweating.", "Dilation of blood vessels."],
      "correctAnswer": "Contraction of erector pili muscles.",
      "difficulty": "easy",
      "explanation": "This is a vestigial reflex from ancestors who had more body hair to trap heat."
    },
    {
      "question": "The 'hypodermis' is mainly composed of:",
      "options": ["Nerve endings", "Adipose (fat) and connective tissue", "Dead skin cells", "Melanin"],
      "correctAnswer": "Adipose (fat) and connective tissue",
      "difficulty": "moderate",
      "explanation": "Also called the subcutaneous layer, it attaches the skin to underlying bone and muscle."
    },
    {
      "question": "When blood glucose levels are low, the liver converts glycogen into glucose. This process is called:",
      "options": ["Glycolysis", "Glycogenolysis", "Photosynthesis", "Digestion"],
      "correctAnswer": "Glycogenolysis",
      "difficulty": "hard",
      "explanation": "Glycogenolysis is the 'splitting' (lysis) of glycogen."
    },
    {
      "question": "Which of these is NOT a sign of diabetes?",
      "options": ["Frequent urination", "Extreme thirst", "Glucose in the urine", "Increased hair growth"],
      "correctAnswer": "Increased hair growth",
      "difficulty": "moderate",
      "explanation": "Common signs include polyuria (urination), polydipsia (thirst), and glycosuria (sugar in urine)."
    },
    {
      "question": "Situational Judgment: You are shivering in a cold room. Which homeostatic system is currently most active?",
      "options": ["Osmoregulation", "Thermoregulation", "Blood glucose control", "Digestion"],
      "correctAnswer": "Thermoregulation",
      "difficulty": "easy",
      "type": "situational",
      "explanation": "Shivering is a response to maintain internal body temperature."
    },
    {
      "question": "How does the skin prevent 'desiccation' (drying out)?",
      "options": ["By absorbing water from the air.", "Through the waterproof keratin in the cornified layer and oily sebum.", "By increasing blood flow.", "By growing hair."],
      "correctAnswer": "Through the waterproof keratin in the cornified layer and oily sebum.",
      "difficulty": "moderate",
      "explanation": "These features keep the body's internal water from evaporating through the skin."
    },
    {
      "question": "Which hormone is sometimes called the 'hormone of hunger' or 'starvation hormone' because it is released when sugar is low?",
      "options": ["Insulin", "Glucagon", "Oxytocin", "Estrogen"],
      "correctAnswer": "Glucagon",
      "difficulty": "moderate",
      "explanation": "Glucagon acts to mobilize stored energy when external food sources are not available."
    }
  ],
   "Unit 11: Response and coordination in plants": [
    {
      "question": "What is the general term for a growth movement of a plant in response to a directional stimulus?",
      "options": ["Nastic movement", "Tactic movement", "Tropism", "Kinesis"],
      "correctAnswer": "Tropism",
      "difficulty": "easy",
      "explanation": "Tropisms are growth responses where the direction of growth is determined by the direction of the stimulus."
    },
    {
      "question": "Which of the following is a response of plant parts to the stimulus of light?",
      "options": ["Geotropism", "Hydrotropism", "Phototropism", "Thigmotropism"],
      "correctAnswer": "Phototropism",
      "difficulty": "easy",
      "explanation": "Phototropism comes from 'photo' (light) and 'tropism' (turn/growth)."
    },
    {
      "question": "Plant shoots are said to be:",
      "options": ["Positively phototropic and negatively geotropic", "Negatively phototropic and positively geotropic", "Positively phototropic and positively geotropic", "Negatively phototropic and negatively geotropic"],
      "correctAnswer": "Positively phototropic and negatively geotropic",
      "difficulty": "moderate",
      "explanation": "Shoots grow toward light (positive phototropism) and away from gravity (negative geotropism)."
    },
    {
      "question": "Which plant hormone is primarily responsible for controlling cell elongation in shoots?",
      "options": ["Ethylene", "Abscisic acid", "Auxin (IAA)", "Cytokinin"],
      "correctAnswer": "Auxin (IAA)",
      "difficulty": "easy",
      "explanation": "Auxins, specifically Indole-3-acetic acid (IAA), stimulate the stretching or elongation of cells in the shoot."
    },
    {
      "question": "Where is auxin primarily produced in a growing plant?",
      "options": ["In the mature leaves", "In the tips of shoots and roots (apical meristems)", "In the xylem vessels", "In the flower petals"],
      "correctAnswer": "In the tips of shoots and roots (apical meristems)",
      "difficulty": "moderate",
      "explanation": "Auxins are synthesized in the actively growing tips and then transported to other regions."
    },
    {
      "question": "In a shoot exposed to light from one side, where does auxin accumulate?",
      "options": ["On the side facing the light", "On the shaded side", "Equally on both sides", "In the center of the stem only"],
      "correctAnswer": "On the shaded side",
      "difficulty": "moderate",
      "explanation": "Auxin moves away from light. The higher concentration on the shaded side causes those cells to elongate faster, bending the shoot toward the light."
    },
    {
      "question": "What happens to a shoot if the tip is removed (decapitated)?",
      "options": ["It grows faster toward the light.", "It stops growing upward because the source of auxin is gone.", "It turns into a root.", "It immediately flowers."],
      "correctAnswer": "It stops growing upward because the source of auxin is gone.",
      "difficulty": "moderate",
      "explanation": "Without the tip, there is no auxin production to stimulate the elongation of the cells below."
    },
    {
      "question": "Geotropism is also known as:",
      "options": ["Chemotropism", "Gravitropism", "Heliotropism", "Thermotropism"],
      "correctAnswer": "Gravitropism",
      "difficulty": "easy",
      "explanation": "Gravity is the stimulus in geotropism, so 'gravitropism' is a frequently used synonym."
    },
    {
      "question": "How does auxin affect root growth compared to shoot growth?",
      "options": ["It stimulates elongation in both.", "It inhibits elongation in both.", "It stimulates elongation in shoots but inhibits it in roots.", "It inhibits elongation in shoots but stimulates it in roots."],
      "correctAnswer": "It stimulates elongation in shoots but inhibits it in roots.",
      "difficulty": "hard",
      "explanation": "Roots are much more sensitive to auxin; concentrations that stimulate shoots actually slow down root cell elongation."
    },
    {
      "question": "Which of the following describes 'Thigmotropism'?",
      "options": ["Growth toward water", "Growth in response to chemicals", "Growth in response to touch/contact", "Movement in response to temperature"],
      "correctAnswer": "Growth in response to touch/contact",
      "difficulty": "moderate",
      "explanation": "Climbing plants like vines use thigmotropism to wrap tendrils around supports."
    },
    {
      "question": "Which of these is a 'nastic' movement rather than a tropism?",
      "options": ["A stem bending toward a window.", "A root growing downward into the soil.", "The closing of a Venus Flytrap when an insect touches it.", "A pollen tube growing toward an ovule."],
      "correctAnswer": "The closing of a Venus Flytrap when an insect touches it.",
      "difficulty": "hard",
      "explanation": "Nastic movements are rapid, reversible, and their direction is independent of the direction of the stimulus."
    },
    {
      "question": "A clinostat is a device used in plant experiments to:",
      "options": ["Measure the rate of photosynthesis.", "Eliminate the effect of directional stimuli like gravity or light.", "Increase the concentration of auxin.", "Kill the plant's apical meristem."],
      "correctAnswer": "Eliminate the effect of directional stimuli like gravity or light.",
      "difficulty": "moderate",
      "explanation": "By rotating the plant slowly, the stimulus (like gravity) hits all sides equally, preventing a directional tropism."
    },
    {
      "question": "True or False: Phototropism helps plants maximize light absorption for photosynthesis.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "By bending toward light, the leaves are positioned to capture more solar energy."
    },
    {
      "question": "The growth of a pollen tube toward the chemicals secreted by an ovule is an example of:",
      "options": ["Phototropism", "Hydrotropism", "Chemotropism", "Geotropism"],
      "correctAnswer": "Chemotropism",
      "difficulty": "moderate",
      "explanation": "Chemotropism is a growth response to a chemical gradient."
    },
    {
      "question": "Hydrotropism is the growth of plant roots toward:",
      "options": ["Sunlight", "Moisture (water)", "Nutrients", "Oxygen"],
      "correctAnswer": "Moisture (water)",
      "difficulty": "easy",
      "explanation": "Roots grow toward areas of higher water potential to ensure the plant stays hydrated."
    },
    {
      "question": "Assertion: Roots are positively geotropic.\nReason: Gravity causes auxin to accumulate on the lower side of the root, which inhibits growth on that side.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "In roots, high auxin concentration on the lower side slows elongation, causing the upper side to grow faster and the root to bend downward."
    },
    {
      "question": "When a plant is placed horizontally, the shoot bends upward. This is because:",
      "options": ["Auxin moves to the upper side and inhibits growth.", "Auxin moves to the lower side and stimulates growth.", "Light is stronger on the top.", "Gravity pulls the stem physically."],
      "correctAnswer": "Auxin moves to the lower side and stimulates growth.",
      "difficulty": "moderate",
      "explanation": "Gravity causes auxin to settle on the lower side of the horizontal shoot, making the lower side grow more than the upper side."
    },
    {
      "question": "Which of these scientists is famous for early experiments on phototropism and coleoptiles?",
      "options": ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Robert Hooke"],
      "correctAnswer": "Charles Darwin",
      "difficulty": "hard",
      "explanation": "Darwin and his son Francis discovered that the tip of the coleoptile perceives the light stimulus."
    },
    {
      "question": "A 'coleoptile' is:",
      "options": ["A type of root hair.", "The protective sheath covering the shoot of a germinating grass or cereal.", "The chemical name for auxin.", "A specialized cell in the leaf."],
      "correctAnswer": "The protective sheath covering the shoot of a germinating grass or cereal.",
      "difficulty": "moderate",
      "explanation": "Coleoptiles are commonly used in lab experiments to study auxins."
    },
    {
      "question": "Which of the following describes 'Nyctinasty'?",
      "options": ["The 'sleep movements' of leaves opening by day and closing at night.", "The growth of roots toward the center of the earth.", "The rapid closing of Mimosa pudica leaves when touched.", "The growth of a plant toward a heat source."],
      "correctAnswer": "The 'sleep movements' of leaves opening by day and closing at night.",
      "difficulty": "hard",
      "explanation": "Nyctinasty is a nastic response to the daily light-dark cycle."
    },
    {
      "question": "If an opaque cap is placed over the tip of a shoot, and light is shone from the side, the shoot will:",
      "options": ["Bend toward the light.", "Bend away from the light.", "Grow straight up.", "Stop growing entirely."],
      "correctAnswer": "Grow straight up.",
      "difficulty": "moderate",
      "explanation": "The tip perceives the light. If it's covered, the plant doesn't 'know' the light is directional and grows straight."
    },
    {
      "question": "What is the effect of 'apical dominance'?",
      "options": ["The roots grow faster than the shoots.", "The main central stem grows more strongly than the side branches.", "The plant grows toward the sun.", "The leaves fall off in autumn."],
      "correctAnswer": "The main central stem grows more strongly than the side branches.",
      "difficulty": "moderate",
      "explanation": "Auxin produced in the apical bud inhibits the growth of lateral (side) buds."
    },
    {
      "question": "Which of these is NOT a characteristic of tropisms?",
      "options": ["They are growth movements.", "They are permanent/irreversible.", "They are very fast, occurring in seconds.", "They are directional."],
      "correctAnswer": "They are very fast, occurring in seconds.",
      "difficulty": "easy",
      "explanation": "Tropisms involve growth and cell division, which are slow processes compared to nastic movements."
    },
    {
      "question": "In a laboratory, if a root is placed in a chamber with moist air on one side and dry air on the other, the root will bend toward the moist side. This is:",
      "options": ["Positive geotropism", "Negative phototropism", "Positive hydrotropism", "Chemotropism"],
      "correctAnswer": "Positive hydrotropism",
      "difficulty": "easy",
      "explanation": "The root grows toward the source of water."
    },
    {
      "question": "What is the primary difference between a tropism and a tactic movement?",
      "options": ["Tropisms are in animals; tactic is in plants.", "Tropisms involve growth of a part; tactic involves the movement of the whole organism.", "Tropisms are fast; tactic movements are slow.", "There is no difference."],
      "correctAnswer": "Tropisms involve growth of a part; tactic involves the movement of the whole organism.",
      "difficulty": "hard",
      "explanation": "Tactic movements (taxes) are found in motile organisms like bacteria or algae moving toward light."
    },
    {
      "question": "When the tip of a Mimosa pudica leaf is touched, the leaflets fold inward. This is called:",
      "options": ["Heliotropism", "Thigmonasty (Seismonasty)", "Geotropism", "Phototrophy"],
      "correctAnswer": "Thigmonasty (Seismonasty)",
      "difficulty": "moderate",
      "explanation": "This is a rapid nastic response to touch/vibration, not a growth response (tropism)."
    },
    {
      "question": "Auxin transport in the plant is primarily:",
      "options": ["Multidirectional", "Polar (moves from the tip downward)", "Only through the air", "Inactive"],
      "correctAnswer": "Polar (moves from the tip downward)",
      "difficulty": "hard",
      "explanation": "Auxin generally moves from the shoot tip toward the base of the plant."
    },
    {
      "question": "What happens if an agar block containing auxin is placed on one side of a decapitated coleoptile in the dark?",
      "options": ["It grows straight up.", "It remains dormant.", "It bends away from the side with the agar block.", "It bends toward the side with the agar block."],
      "correctAnswer": "It bends away from the side with the agar block.",
      "difficulty": "hard",
      "explanation": "The auxin in the block causes cells on that side to elongate, while the other side stays the same, resulting in a bend away from the block."
    },
    {
      "question": "Which of the following helps a plant avoid 'etiolation' (becoming pale and weak)?",
      "options": ["Lack of water", "Positive phototropism", "Negative geotropism", "Excessive fertilizer"],
      "correctAnswer": "Positive phototropism",
      "difficulty": "moderate",
      "explanation": "Growing toward light ensures the plant produces chlorophyll and remains sturdy."
    },
    {
      "question": "Fill in the blank: The stimulus for geotropism is _____.",
      "options": ["Light", "Water", "Gravity", "Touch"],
      "correctAnswer": "Gravity",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Geo refers to the Earth/Gravity."
    },
    {
      "question": "True or False: Plant responses are coordinated through hormones rather than a nervous system.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Plants do not have nerves; they use chemical messengers (hormones) to communicate between different parts."
    },
    {
      "question": "Which part of the plant is 'negatively phototropic'?",
      "options": ["Leaves", "Flowers", "Roots", "Stems"],
      "correctAnswer": "Roots",
      "difficulty": "moderate",
      "explanation": "Roots typically grow away from light and toward the darkness of the soil."
    },
    {
      "question": "The bending of a plant toward light is caused by:",
      "options": ["Cells on the light side dividing faster.", "Cells on the shaded side elongating more.", "The light killing the cells on the shaded side.", "Auxin being destroyed by the light."],
      "correctAnswer": "Cells on the shaded side elongating more.",
      "difficulty": "moderate",
      "explanation": "Higher auxin concentration on the shaded side leads to greater elongation of those cells."
    },
    {
      "question": "Order the events in a phototropic response:",
      "orderCorrect": ["Unidirectional light hits the shoot tip", "Auxin is produced in the tip", "Auxin migrates to the shaded side", "Cells on the shaded side elongate faster", "The shoot bends toward the light"],
      "difficulty": "moderate",
      "type": "ordering",
      "explanation": "This sequence describes the physiological process of phototropism."
    },
    {
      "question": "Which of these is an example of a 'Positive' tropism?",
      "options": ["A root growing away from light.", "A shoot growing upward against gravity.", "A root growing toward a water source.", "A stem growing away from a wall."],
      "correctAnswer": "A root growing toward a water source.",
      "difficulty": "easy",
      "explanation": "Positive means moving toward the stimulus."
    },
    {
      "question": "What is the role of 'Statoliths' (heavy starch grains) in plant cells?",
      "options": ["They capture sunlight for photosynthesis.", "They help the plant sense the direction of gravity.", "They store water for droughts.", "They protect the plant from pests."],
      "correctAnswer": "They help the plant sense the direction of gravity.",
      "difficulty": "hard",
      "explanation": "Statoliths settle at the bottom of specialized cells, allowing the plant to 'feel' which way is down."
    },
    {
      "question": "Identify the 'error' in this statement: 'In a horizontal root, auxin accumulates on the lower side and stimulates growth, causing it to bend down.'",
      "options": [
        "Auxin accumulates on the upper side, not the lower.",
        "In roots, auxin on the lower side inhibits growth, not stimulates it.",
        "Roots don't respond to gravity.",
        "There is no error."
      ],
      "correctAnswer": "In roots, auxin on the lower side inhibits growth, not stimulates it.",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "High concentrations of auxin inhibit cell elongation in roots, which is why the lower side grows less than the upper side."
    },
    {
      "question": "Which hormone is used as a 'weed killer' (herbicide) by over-stimulating growth?",
      "options": ["Low doses of Auxin", "High doses of synthetic Auxin (2,4-D)", "Abscisic acid", "Glucose"],
      "correctAnswer": "High doses of synthetic Auxin (2,4-D)",
      "difficulty": "moderate",
      "explanation": "Synthetic auxins can cause weeds to grow so fast they cannot sustain themselves and die."
    },
    {
      "question": "How do nastic movements differ from tropisms in terms of direction?",
      "options": [
        "Tropisms are directional; nastic movements are non-directional.",
        "Tropisms are non-directional; nastic movements are directional.",
        "Both are directional.",
        "Neither is directional."
      ],
      "correctAnswer": "Tropisms are directional; nastic movements are non-directional.",
      "difficulty": "moderate",
      "explanation": "A flower closing at night does so because it is dark, but it doesn't close 'toward' or 'away' from a specific direction of darkness."
    },
    {
      "question": "If you want a plant to grow bushier (more side branches), you should:",
      "options": ["Give it more water.", "Remove the apical bud (tip).", "Put it in total darkness.", "Add more auxin to the tip."],
      "correctAnswer": "Remove the apical bud (tip).",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Removing the apical bud removes the source of auxin that inhibits side buds, allowing them to grow."
    },
    {
      "question": "The 'sensitive plant' (Mimosa pudica) uses changes in _____ to move its leaves quickly.",
      "options": ["Cell wall thickness", "Turgor pressure", "DNA sequence", "Chloroplast speed"],
      "correctAnswer": "Turgor pressure",
      "difficulty": "hard",
      "explanation": "Rapid loss of water from specialized cells (pulvini) at the base of leaflets causes them to collapse."
    },
    {
      "question": "Select ALL that are examples of plant hormones:",
      "multiSelect": true,
      "options": [
        "Auxins",
        "Gibberellins",
        "Adrenaline",
        "Ethylene",
        "Insulin"
      ],
      "correctAnswer": ["Auxins", "Gibberellins", "Ethylene"],
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "Adrenaline and Insulin are animal hormones."
    },
    {
      "question": "Which of the following is a 'Negative' tropism?",
      "options": ["A root growing toward gravity.", "A stem growing toward light.", "A stem growing upward away from gravity.", "A tendril wrapping around a pole."],
      "correctAnswer": "A stem growing upward away from gravity.",
      "difficulty": "easy",
      "explanation": "Growing away from the stimulus (gravity) makes it negative geotropism."
    },
    {
      "question": "Case Study: A plant is growing in a pot that has fallen on its side. After a few days, the stem is seen curving upward. What is this response?",
      "options": ["Positive phototropism", "Negative geotropism", "Positive hydrotropism", "Negative thigmotropism"],
      "correctAnswer": "Negative geotropism",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "The stem is growing away from the pull of gravity."
    },
    {
      "question": "True or False: Auxin only affects the shoot and root tips.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "While produced in the tips, auxin travels to and affects cells in the elongation zone and lateral buds."
    },
    {
      "question": "The stimulus for thigmotropism is:",
      "options": ["Chemicals", "Heat", "Mechanical contact (touch)", "Electricity"],
      "correctAnswer": "Mechanical contact (touch)",
      "difficulty": "easy",
      "explanation": "Thigmo- is a prefix relating to touch."
    },
    {
      "question": "Which of these is the most common natural auxin?",
      "options": ["Acetic acid", "Indole-3-acetic acid (IAA)", "Citric acid", "Gibberellic acid"],
      "correctAnswer": "Indole-3-acetic acid (IAA)",
      "difficulty": "moderate",
      "explanation": "IAA is the primary auxin found in most plants."
    }
  ],
   "Unit 12: Response and coordination in animals": [
    {
      "question": "What are the two main systems responsible for coordination and response in animals?",
      "options": ["Digestive and Respiratory", "Nervous and Endocrine", "Circulatory and Skeletal", "Excretory and Immune"],
      "correctAnswer": "Nervous and Endocrine",
      "difficulty": "easy",
      "explanation": "The nervous system provides fast, short-lived electrical responses, while the endocrine system provides slower, long-lasting chemical responses."
    },
    {
      "question": "The Central Nervous System (CNS) consists of which two major organs?",
      "options": ["Brain and Spinal Cord", "Brain and Cranial Nerves", "Spinal Cord and Spinal Nerves", "Nerves and Sense Organs"],
      "correctAnswer": "Brain and Spinal Cord",
      "difficulty": "easy",
      "explanation": "The CNS acts as the processing hub for the body, consisting of the brain and the spinal cord."
    },
    {
      "question": "Which part of the brain is responsible for higher functions such as thinking, memory, and voluntary actions?",
      "options": ["Cerebellum", "Medulla oblongata", "Cerebrum", "Hypothalamus"],
      "correctAnswer": "Cerebrum",
      "difficulty": "moderate",
      "explanation": "The cerebrum is the largest part of the brain and controls conscious activities and intelligence."
    },
    {
      "question": "Which part of the brain coordinates balance and muscle precision?",
      "options": ["Cerebrum", "Cerebellum", "Pituitary gland", "Thalamus"],
      "correctAnswer": "Cerebellum",
      "difficulty": "moderate",
      "explanation": "The cerebellum (small brain) ensures smooth, balanced movements like walking or riding a bike."
    },
    {
      "question": "The medulla oblongata is responsible for controlling:",
      "options": ["Memory and speech", "Vision and hearing", "Involuntary actions like heartbeat and breathing", "Temperature regulation"],
      "correctAnswer": "Involuntary actions like heartbeat and breathing",
      "difficulty": "moderate",
      "explanation": "The medulla controls vital autonomic functions that occur without conscious effort."
    },
    {
      "question": "Which type of neuron carries impulses from the sense organs to the central nervous system?",
      "options": ["Motor neuron", "Relay neuron", "Sensory neuron", "Intermediate neuron"],
      "correctAnswer": "Sensory neuron",
      "difficulty": "easy",
      "explanation": "Sensory neurons detect stimuli and transmit the information toward the brain and spinal cord."
    },
    {
      "question": "The junction or gap between two neurons is called a:",
      "options": ["Dendrite", "Axon", "Synapse", "Myelin sheath"],
      "correctAnswer": "Synapse",
      "difficulty": "easy",
      "explanation": "Chemicals called neurotransmitters cross the synapse to pass the signal from one neuron to the next."
    },
    {
      "question": "What is the function of the myelin sheath in a neuron?",
      "options": ["To produce neurotransmitters", "To provide energy to the cell", "To insulate the axon and speed up impulse transmission", "To receive signals from other cells"],
      "correctAnswer": "To insulate the axon and speed up impulse transmission",
      "difficulty": "moderate",
      "explanation": "The fatty myelin sheath prevents electrical leakage and allows the impulse to 'jump' along the axon."
    },
    {
      "question": "Which type of neuron is located entirely within the Central Nervous System?",
      "options": ["Sensory neuron", "Motor neuron", "Relay (Intermediate) neuron", "Effector neuron"],
      "correctAnswer": "Relay (Intermediate) neuron",
      "difficulty": "moderate",
      "explanation": "Relay neurons connect sensory neurons to motor neurons within the spinal cord or brain."
    },
    {
      "question": "A reflex action is best defined as:",
      "options": ["A slow, thought-out response", "A fast, automatic, and involuntary response to a stimulus", "A movement controlled by the cerebrum", "A learned behavior"],
      "correctAnswer": "A fast, automatic, and involuntary response to a stimulus",
      "difficulty": "easy",
      "explanation": "Reflexes are protective and occur without conscious thought to minimize harm."
    },
    {
      "question": "Order the components of a reflex arc from stimulus to response:",
      "orderCorrect": ["Receptor", "Sensory neuron", "Relay neuron", "Motor neuron", "Effector"],
      "difficulty": "moderate",
      "type": "ordering",
      "explanation": "This is the pathway followed by a nerve impulse during a reflex action."
    },
    {
      "question": "In a reflex arc, what is the role of the 'Effector'?",
      "options": ["To detect the stimulus", "To process the information in the brain", "To carry out the response (muscle or gland)", "To transmit impulses to the spinal cord"],
      "correctAnswer": "To carry out the response (muscle or gland)",
      "difficulty": "moderate",
      "explanation": "Effectors are usually muscles that contract or glands that secrete hormones/substances."
    },
    {
      "question": "Which part of the eye controls the amount of light entering the pupil?",
      "options": ["Retina", "Iris", "Lens", "Cornea"],
      "correctAnswer": "Iris",
      "difficulty": "easy",
      "explanation": "The iris contains muscles that dilate or constrict the pupil based on light intensity."
    },
    {
      "question": "The sensitive layer of the eye containing photoreceptors (rods and cones) is the:",
      "options": ["Sclera", "Choroid", "Retina", "Optic nerve"],
      "correctAnswer": "Retina",
      "difficulty": "easy",
      "explanation": "The retina is where the image is focused and converted into nerve impulses."
    },
    {
      "question": "What is the function of 'Cone' cells in the retina?",
      "options": ["Seeing in dim light", "Detection of color and detail in bright light", "Protection of the eyeball", "Refracting light rays"],
      "correctAnswer": "Detection of color and detail in bright light",
      "difficulty": "moderate",
      "explanation": "Cones are responsible for color vision, while rods help us see in the dark."
    },
    {
      "question": "Accommodation in the eye refers to:",
      "options": ["The eye's ability to see different colors.", "The adjustment of the lens shape to focus on near or distant objects.", "The closing of eyelids in bright light.", "The movement of both eyes to follow an object."],
      "correctAnswer": "The adjustment of the lens shape to focus on near or distant objects.",
      "difficulty": "hard",
      "explanation": "Ciliary muscles change the curvature of the lens to ensure a sharp image falls on the retina."
    },
    {
      "question": "When focusing on a distant object, the ciliary muscles _____ and the lens becomes _____.",
      "options": ["Contract, thicker", "Relax, thinner", "Contract, thinner", "Relax, thicker"],
      "correctAnswer": "Relax, thinner",
      "difficulty": "hard",
      "explanation": "Relaxed ciliary muscles pull the suspensory ligaments taut, stretching the lens into a thinner shape."
    },
    {
      "question": "Which part of the ear is responsible for converting sound vibrations into nerve impulses?",
      "options": ["Eardrum (Tympanic membrane)", "Ossicles", "Cochlea", "Semicircular canals"],
      "correctAnswer": "Cochlea",
      "difficulty": "moderate",
      "explanation": "The cochlea contains fluid and hair cells that transform vibrations into electrical signals."
    },
    {
      "question": "The primary function of the semi-circular canals in the ear is:",
      "options": ["Hearing high-pitched sounds", "Equalizing air pressure", "Maintaining balance and posture", "Protecting the inner ear"],
      "correctAnswer": "Maintaining balance and posture",
      "difficulty": "moderate",
      "explanation": "These canals detect head movement and help the brain maintain equilibrium."
    },
    {
      "question": "Which tube connects the middle ear to the throat and equalizes pressure?",
      "options": ["Auditory canal", "Eustachian tube", "Cochlear duct", "Fallopian tube"],
      "correctAnswer": "Eustachian tube",
      "difficulty": "moderate",
      "explanation": "The Eustachian tube opens during swallowing to balance air pressure on either side of the eardrum."
    },
    {
      "question": "Endocrine glands are described as 'ductless' because:",
      "options": ["They do not produce any secretions.", "They release hormones directly into the bloodstream.", "They only work inside the brain.", "They are part of the nervous system."],
      "correctAnswer": "They release hormones directly into the bloodstream.",
      "difficulty": "moderate",
      "explanation": "Unlike exocrine glands (like sweat glands), endocrine glands have no tubes; hormones travel via the blood."
    },
    {
      "question": "Which hormone is often called the 'fight or flight' hormone?",
      "options": ["Insulin", "Adrenaline", "Thyroxine", "Estrogen"],
      "correctAnswer": "Adrenaline",
      "difficulty": "easy",
      "explanation": "Adrenaline prepares the body for action by increasing heart rate, breathing, and blood sugar."
    },
    {
      "question": "The 'Master Gland' that controls other endocrine glands is the:",
      "options": ["Adrenal gland", "Thyroid gland", "Pituitary gland", "Pancreas"],
      "correctAnswer": "Pituitary gland",
      "difficulty": "moderate",
      "explanation": "The pituitary gland produces hormones that trigger other glands like the ovaries, testes, and thyroid."
    },
    {
      "question": "Where are the adrenal glands located?",
      "options": ["In the brain", "On top of each kidney", "In the neck", "In the abdomen"],
      "correctAnswer": "On top of each kidney",
      "difficulty": "easy",
      "explanation": "The adrenal glands sit like caps on the kidneys."
    },
    {
      "question": "Which of the following is an effect of adrenaline?",
      "options": ["Dilation of pupils", "Decreased breathing rate", "Diversion of blood to the digestive system", "Lowering of blood pressure"],
      "correctAnswer": "Dilation of pupils",
      "difficulty": "moderate",
      "explanation": "Dilation of pupils allows more light in, improving awareness in dangerous situations."
    },
    {
      "question": "Fill in the blank: The _____ is the nerve that carries visual information from the eye to the brain.",
      "options": ["Auditory nerve", "Optic nerve", "Olfactory nerve", "Sciatic nerve"],
      "correctAnswer": "Optic nerve",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "The optic nerve connects the retina to the visual cortex of the brain."
    },
    {
      "question": "True or False: Hormonal responses are generally faster than nervous responses.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Nerve impulses travel in milliseconds, while hormones must travel through the blood and can take minutes or longer to take effect."
    },
    {
      "question": "Identify the 'error' in this statement: 'The spinal cord is responsible for complex voluntary decisions.'",
      "options": [
        "The spinal cord only carries blood.",
        "The cerebrum, not the spinal cord, handles complex voluntary decisions.",
        "The spinal cord is not part of the CNS.",
        "There is no error."
      ],
      "correctAnswer": "The cerebrum, not the spinal cord, handles complex voluntary decisions.",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "The spinal cord handles reflexes and transmits signals, while the brain handles decision-making."
    },
    {
      "question": "Assertion: You cannot see colors clearly in a dark room.\nReason: Rod cells are sensitive to low light but cannot distinguish between different colors.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Rod cells work in dim light but provide only grayscale vision; cones need bright light for color."
    },
    {
      "question": "What is the function of the 'Blind Spot' in the eye?",
      "options": ["It is where we see most clearly.", "It is the area where the optic nerve leaves the eye and has no photoreceptors.", "It is where color vision is strongest.", "It protects the eye from dust."],
      "correctAnswer": "It is the area where the optic nerve leaves the eye and has no photoreceptors.",
      "difficulty": "moderate",
      "explanation": "Because there are no rods or cones at the optic disk, light falling on this spot cannot be detected."
    },
    {
      "question": "A person is unable to maintain balance after a head injury. Which part of the brain is likely damaged?",
      "options": ["Medulla", "Cerebrum", "Cerebellum", "Hypothalamus"],
      "correctAnswer": "Cerebellum",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "The cerebellum is the center for motor coordination and balance."
    },
    {
      "question": "Select ALL structures found in the middle ear:",
      "multiSelect": true,
      "options": [
        "Pinna",
        "Malleus (Hammer)",
        "Incus (Anvil)",
        "Stapes (Stirrup)",
        "Cochlea"
      ],
      "correctAnswer": ["Malleus (Hammer)", "Incus (Anvil)", "Stapes (Stirrup)"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "The Pinna is outer ear; the Cochlea is inner ear. The three ossicles are in the middle ear."
    },
    {
      "question": "What happens during the 'pupil reflex' when you walk into a very bright room?",
      "options": [
        "Circular muscles of the iris contract, and the pupil gets smaller.",
        "Radial muscles contract, and the pupil gets larger.",
        "The lens becomes thicker.",
        "The optic nerve stops working."
      ],
      "correctAnswer": "Circular muscles of the iris contract, and the pupil gets smaller.",
      "difficulty": "hard",
      "explanation": "Contraction of circular muscles constricts the pupil to protect the retina from too much light."
    },
    {
      "question": "Which hormone regulates the 'basal metabolic rate' of the body?",
      "options": ["Insulin", "Glucagon", "Thyroxine", "Progesterone"],
      "correctAnswer": "Thyroxine",
      "difficulty": "moderate",
      "explanation": "Thyroxine, produced by the thyroid gland, controls how quickly the body uses energy."
    },
    {
      "question": "What is the destination of the 'Auditory Nerve'?",
      "options": ["The spinal cord", "The cerebellum", "The temporal lobe of the cerebrum", "The retina"],
      "correctAnswer": "The temporal lobe of the cerebrum",
      "difficulty": "hard",
      "explanation": "The auditory nerve carries sound information to the hearing centers in the cerebrum for interpretation."
    },
    {
      "question": "Case Study: A patient has high blood sugar and glucose in their urine. Which gland and hormone are likely involved?",
      "options": ["Thyroid - Thyroxine", "Adrenal - Adrenaline", "Pancreas - Insulin", "Pituitary - ADH"],
      "correctAnswer": "Pancreas - Insulin",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "These are classic signs of diabetes, caused by a lack of insulin production or response."
    },
    {
      "question": "The 'Gray Matter' of the spinal cord primarily contains:",
      "options": ["Myelinated axons", "Cell bodies of neurons", "Cerebrospinal fluid", "Bone marrow"],
      "correctAnswer": "Cell bodies of neurons",
      "difficulty": "hard",
      "explanation": "Gray matter is composed of neuron cell bodies and dendrites; white matter contains the myelinated axons."
    },
    {
      "question": "How does 'Hypermetropia' (long-sightedness) occur?",
      "options": [
        "The eyeball is too long or the lens is too strong.",
        "The eyeball is too short or the lens is too weak.",
        "The cornea is uneven.",
        "The retina is detached."
      ],
      "correctAnswer": "The eyeball is too short or the lens is too weak.",
      "difficulty": "hard",
      "explanation": "In long-sightedness, near objects are focused behind the retina rather than on it."
    },
    {
      "question": "Which of these is NOT a sense organ?",
      "options": ["Skin", "Tongue", "Liver", "Nose"],
      "correctAnswer": "Liver",
      "difficulty": "easy",
      "explanation": "The five primary sense organs are the eyes, ears, nose, tongue, and skin."
    },
    {
      "question": "The 'fovea' (yellow spot) is the part of the retina where:",
      "options": ["Vision is completely absent.", "Rods are most concentrated.", "Cones are most concentrated and vision is sharpest.", "The optic nerve begins."],
      "correctAnswer": "Cones are most concentrated and vision is sharpest.",
      "difficulty": "moderate",
      "explanation": "The fovea provides high-acuity color vision."
    },
    {
      "question": "Neurotransmitters are chemicals that are released into the:",
      "options": ["Bloodstream", "Synaptic cleft", "Spinal cord", "Stomach"],
      "correctAnswer": "Synaptic cleft",
      "difficulty": "moderate",
      "explanation": "Neurotransmitters bridge the gap between two neurons."
    },
    {
      "question": "True or False: All reflexes involve the brain.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Many reflexes, such as the knee-jerk or pulling away from a hot object, are processed in the spinal cord without needing the brain."
    },
    {
      "question": "What is the result of 'Short-sightedness' (Myopia)?",
      "options": [
        "Distant objects appear blurry because they are focused in front of the retina.",
        "Near objects appear blurry.",
        "The person cannot see the color red.",
        "The person is blind in one eye."
      ],
      "correctAnswer": "Distant objects appear blurry because they are focused in front of the retina.",
      "difficulty": "moderate",
      "explanation": "Myopia occurs when the eyeball is too long or the lens too curved."
    },
    {
      "question": "Which of the following is a role of the skeleton in response?",
      "options": [
        "Processing nerve impulses.",
        "Acting as a lever system that muscles pull on to create movement.",
        "Releasing hormones like insulin.",
        "Detecting light stimuli."
      ],
      "correctAnswer": "Acting as a lever system that muscles pull on to create movement.",
      "difficulty": "moderate",
      "explanation": "The skeleton provides the framework for the effector (muscle) to produce a response."
    },
    {
      "question": "What is the function of the 'Choroid' layer in the eye?",
      "options": [
        "To focus light.",
        "To absorb light and prevent internal reflection.",
        "To produce tears.",
        "To detect sound."
      ],
      "correctAnswer": "To absorb light and prevent internal reflection.",
      "difficulty": "hard",
      "explanation": "The choroid is a dark, pigmented layer that contains blood vessels and prevents light from bouncing around inside the eye."
    },
    {
      "question": "In the human ear, the 'Pinna' helps by:",
      "options": ["Vibrating against the ossicles.", "Collecting and directing sound waves into the auditory canal.", "Balancing the body.", "Producing earwax."],
      "correctAnswer": "Collecting and directing sound waves into the auditory canal.",
      "difficulty": "easy",
      "explanation": "The pinna is the visible outer part of the ear shaped to catch sound."
    }
  ],
   "Unit 13: Asexual and sexual reproduction": [
    {
      "question": "Which of the following is a defining characteristic of asexual reproduction?",
      "options": ["Involves two parents", "Produces genetically identical offspring (clones)", "Requires the fusion of gametes", "Increases genetic variation"],
      "correctAnswer": "Produces genetically identical offspring (clones)",
      "difficulty": "easy",
      "explanation": "Asexual reproduction involves only one parent and no fusion of gametes, resulting in offspring that are genetically identical to the parent."
    },
    {
      "question": "Which type of asexual reproduction is common in unicellular organisms like Amoeba?",
      "options": ["Budding", "Fragmentation", "Binary fission", "Spore formation"],
      "correctAnswer": "Binary fission",
      "difficulty": "easy",
      "explanation": "In binary fission, a single cell divides into two equal halves, each becoming a new individual."
    },
    {
      "question": "Yeast commonly reproduces asexually through a process where a small outgrowth develops into a new individual. This is called:",
      "options": ["Binary fission", "Budding", "Vegetative propagation", "Regeneration"],
      "correctAnswer": "Budding",
      "difficulty": "moderate",
      "explanation": "Budding involves the formation of a 'bud' on the parent body which eventually detaches to live independently."
    },
    {
      "question": "Which of the following is an example of natural vegetative propagation via a tuber?",
      "options": ["Onion", "Ginger", "Potato", "Strawberry"],
      "correctAnswer": "Potato",
      "difficulty": "moderate",
      "explanation": "Potatoes are underground stems (tubers) that store food and have 'eyes' from which new plants can grow."
    },
    {
      "question": "Strawberry plants spread across the ground and produce new plants at nodes along horizontal stems called:",
      "options": ["Rhizomes", "Runners (Stolons)", "Bulbs", "Corms"],
      "correctAnswer": "Runners (Stolons)",
      "difficulty": "moderate",
      "explanation": "Runners are horizontal stems that grow above the ground and take root at certain intervals to produce new clones."
    },
    {
      "question": "Which artificial method of asexual reproduction involves joining the stem of one plant to the roots of another?",
      "options": ["Cutting", "Grafting", "Layering", "Tissue culture"],
      "correctAnswer": "Grafting",
      "difficulty": "hard",
      "explanation": "In grafting, the 'scion' (shoot) is attached to the 'stock' (root system) to combine the best traits of both plants."
    },
    {
      "question": "What is a major disadvantage of asexual reproduction for a population?",
      "options": ["It is very slow.", "It requires a lot of energy to find a mate.", "The lack of genetic variation makes the population vulnerable to environmental changes.", "Only one offspring is produced at a time."],
      "correctAnswer": "The lack of genetic variation makes the population vulnerable to environmental changes.",
      "difficulty": "moderate",
      "explanation": "If the environment changes or a disease hits, every individual is equally susceptible because they are all genetically identical."
    },
    {
      "question": "In sexual reproduction, the fusion of a male gamete and a female gamete is called:",
      "options": ["Pollination", "Fertilization", "Germination", "Ovulation"],
      "correctAnswer": "Fertilization",
      "difficulty": "easy",
      "explanation": "Fertilization is the union of haploid gametes to form a diploid zygote."
    },
    {
      "question": "Which process ensures that gametes have half the number of chromosomes (haploid) as the parent cell?",
      "options": ["Mitosis", "Meiosis", "Binary fission", "Budding"],
      "correctAnswer": "Meiosis",
      "difficulty": "moderate",
      "explanation": "Meiosis is a reduction division that results in four daughter cells with half the chromosome number of the original cell."
    },
    {
      "question": "What is the primary advantage of sexual reproduction over asexual reproduction?",
      "options": ["It is faster and more efficient.", "It produces large numbers of offspring quickly.", "It creates genetic variation among offspring.", "It does not require energy to find a mate."],
      "correctAnswer": "It creates genetic variation among offspring.",
      "difficulty": "moderate",
      "explanation": "Genetic variation allows for evolution and adaptation, increasing the chances that some individuals will survive a change in the environment."
    },
    {
      "question": "In flowers, the male reproductive part is the _____ and the female reproductive part is the _____.",
      "options": ["Pistil, Stamen", "Stamen, Carpel (Pistil)", "Petal, Sepal", "Anther, Filament"],
      "correctAnswer": "Stamen, Carpel (Pistil)",
      "difficulty": "easy",
      "explanation": "The stamen consists of the anther and filament; the carpel consists of the stigma, style, and ovary."
    },
    {
      "question": "Which part of the flower produces pollen grains?",
      "options": ["Stigma", "Style", "Anther", "Ovary"],
      "correctAnswer": "Anther",
      "difficulty": "easy",
      "explanation": "The anther is the part of the stamen where pollen (containing male gametes) is formed."
    },
    {
      "question": "Pollination is the transfer of pollen from the _____ to the _____.",
      "options": ["Anther, Stigma", "Stigma, Anther", "Ovary, Ovule", "Filament, Petal"],
      "correctAnswer": "Anther, Stigma",
      "difficulty": "moderate",
      "explanation": "Pollination must occur for the male gametes to eventually reach the female gametes in the ovary."
    },
    {
      "question": "Which type of pollination involves pollen being transferred between different plants of the same species?",
      "options": ["Self-pollination", "Cross-pollination", "Artificial pollination", "Asexual pollination"],
      "correctAnswer": "Cross-pollination",
      "difficulty": "moderate",
      "explanation": "Cross-pollination increases genetic diversity because the offspring inherit traits from two different parent plants."
    },
    {
      "question": "After fertilization in plants, the ovule develops into a _____ and the ovary develops into a _____.",
      "options": ["Fruit, Seed", "Seed, Fruit", "Leaf, Stem", "Root, Flower"],
      "correctAnswer": "Seed, Fruit",
      "difficulty": "hard",
      "explanation": "The fertilized egg becomes the embryo, the ovule becomes the protective seed, and the ovary wall becomes the fruit."
    },
    {
      "question": "Which of the following is a characteristic of insect-pollinated flowers?",
      "options": ["Small, dull petals", "Feathery stigmas hanging outside the flower", "Brightly colored petals and nectar", "Light, smooth pollen produced in large quantities"],
      "correctAnswer": "Brightly colored petals and nectar",
      "difficulty": "moderate",
      "explanation": "These features attract insects to the flower so they can pick up and deposit pollen."
    },
    {
      "question": "True or False: A clone is an organism that is genetically different from its parent.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "By definition, a clone is genetically identical to the parent organism."
    },
    {
      "question": "Rhizomes, such as those found in ginger, are examples of:",
      "options": ["Underground roots", "Underground stems", "Aerial leaves", "Modified seeds"],
      "correctAnswer": "Underground stems",
      "difficulty": "hard",
      "explanation": "Rhizomes are horizontal underground stems that can produce both the shoot and root systems of a new plant."
    },
    {
      "question": "What happens during 'fragmentation' in organisms like Spirogyra?",
      "options": ["The organism explodes into seeds.", "The body breaks into pieces, and each piece grows into a new individual.", "The nucleus divides into many parts.", "The organism produces spores in a capsule."],
      "correctAnswer": "The body breaks into pieces, and each piece grows into a new individual.",
      "difficulty": "moderate",
      "explanation": "Fragmentation is a common form of asexual reproduction in certain multicellular algae and animals like starfish."
    },
    {
      "question": "Which of these is an advantage of asexual reproduction in a stable environment?",
      "options": ["It allows for rapid colonization of an area.", "It ensures high genetic diversity.", "It prevents the spread of diseases.", "It allows plants to find better habitats."],
      "correctAnswer": "It allows for colonization of an area.",
      "difficulty": "moderate",
      "explanation": "If the parent is well-adapted to the stable environment, producing many identical copies quickly is a successful strategy."
    },
    {
      "question": "A diploid cell in a human has 46 chromosomes. How many chromosomes are in a human sperm cell?",
      "options": ["46", "92", "23", "12"],
      "correctAnswer": "23",
      "difficulty": "moderate",
      "type": "calculation",
      "explanation": "Gametes are haploid (n), meaning they have half the number of chromosomes found in somatic (diploid, 2n) cells."
    },
    {
      "question": "Which part of the carpel is sticky to catch pollen grains?",
      "options": ["Style", "Ovary", "Ovule", "Stigma"],
      "correctAnswer": "Stigma",
      "difficulty": "easy",
      "explanation": "The stigma is the receptive tip of the carpel, often sticky or hairy to ensure pollen adheres to it."
    },
    {
      "question": "In the context of plant reproduction, what is 'tissue culture'?",
      "options": ["Growing plants in a large field.", "Growing whole plants from a few cells in a sterile nutrient medium.", "Cross-breeding different species of flowers.", "Using insects to spread pollen."],
      "correctAnswer": "Growing whole plants from a few cells in a sterile nutrient medium.",
      "difficulty": "hard",
      "explanation": "Also called micropropagation, this allows for the mass production of clones from very little parent material."
    },
    {
      "question": "Assertion: Asexual reproduction is faster than sexual reproduction.\nReason: Asexual reproduction does not require the search for a mate or the formation of gametes.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Efficiency in time and energy is a hallmark of asexual pathways."
    },
    {
      "question": "Identify the incorrect pair regarding asexual reproduction:",
      "options": [
        "Amoeba - Binary fission",
        "Hydra - Budding",
        "Mucor (Bread Mold) - Spore formation",
        "Human - Binary fission"
      ],
      "correctAnswer": "Human - Binary fission",
      "difficulty": "easy",
      "type": "errorIdentification",
      "explanation": "Humans reproduce only via sexual reproduction; binary fission is a characteristic of prokaryotes and some simple eukaryotes."
    },
    {
      "question": "The fusion of gametes results in the formation of a single diploid cell called a:",
      "options": ["Embryo", "Zygote", "Fetus", "Spore"],
      "correctAnswer": "Zygote",
      "difficulty": "easy",
      "explanation": "The zygote is the first cell of a new individual in sexual reproduction."
    },
    {
      "question": "Which of the following describes 'Self-pollination'?",
      "options": [
        "Pollen from a flower lands on the stigma of the same flower or another flower on the same plant.",
        "Pollen is carried by the wind to a different forest.",
        "A gardener moves pollen from one species to another.",
        "Pollen is eaten by an insect."
      ],
      "correctAnswer": "Pollen from a flower lands on the stigma of the same flower or another flower on the same plant.",
      "difficulty": "moderate",
      "explanation": "Self-pollination leads to less genetic variation than cross-pollination."
    },
    {
      "question": "Order the stages of sexual reproduction in a flowering plant:",
      "orderCorrect": ["Pollen formation", "Pollination", "Pollen tube growth", "Fertilization", "Seed development"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "This sequence shows the progression from gamete production to the formation of the next generation's embryo."
    },
    {
      "question": "Which of these structures is specifically designed for dispersal by wind?",
      "options": ["A sticky pollen grain", "A seed with a wing or parachute (like a dandelion)", "A heavy fruit like a coconut", "A brightly colored flower"],
      "correctAnswer": "A seed with a wing or parachute (like a dandelion)",
      "difficulty": "easy",
      "explanation": "Structures like 'parachutes' increase air resistance, allowing the wind to carry seeds further from the parent plant."
    },
    {
      "question": "Select ALL that apply to asexual reproduction:",
      "multiSelect": true,
      "options": [
        "Involves mitosis",
        "Increases genetic diversity",
        "Only one parent is required",
        "Produces gametes",
        "Offspring are clones"
      ],
      "correctAnswer": ["Involves mitosis", "Only one parent is required", "Offspring are clones"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Asexual reproduction relies on mitosis and produces clones; genetic diversity and gametes are hallmarks of sexual reproduction."
    },
    {
      "question": "What is the function of the 'Endosperm' in a seed?",
      "options": ["To protect the seed from fire.", "To provide a food store for the developing embryo.", "To help the seed float in water.", "To attract pollinators."],
      "correctAnswer": "To provide a food store for the developing embryo.",
      "difficulty": "moderate",
      "explanation": "The endosperm contains nutrients like starch and oils used during germination before the plant can photosynthesize."
    },
    {
      "question": "Why is 'genetic variation' important for the survival of a species?",
      "options": [
        "It makes all individuals look exactly the same.",
        "It allows some individuals to survive if the environment changes or a new disease appears.",
        "It makes the species grow faster.",
        "It prevents the species from ever going extinct."
      ],
      "correctAnswer": "It allows some individuals to survive if the environment changes or a new disease appears.",
      "difficulty": "moderate",
      "explanation": "Variety is the raw material for natural selection and adaptation."
    },
    {
      "question": "Which of the following is a disadvantage of sexual reproduction?",
      "options": ["It produces genetically identical offspring.", "It is often slower and requires finding a mate.", "It leads to better adaptation.", "It allows for repair of DNA."],
      "correctAnswer": "It is often slower and requires finding a mate.",
      "difficulty": "moderate",
      "explanation": "Finding a mate and the process of fertilization can be time-consuming and energy-intensive compared to asexual methods."
    },
    {
      "question": "A plant has flowers with long filaments and feathery stigmas that hang outside the petals. How is this plant most likely pollinated?",
      "options": ["By bees", "By the wind", "By water", "By birds"],
      "correctAnswer": "By the wind",
      "difficulty": "moderate",
      "explanation": "Hanging anthers release pollen into the air easily, and feathery stigmas provide a large surface area to catch wind-borne pollen."
    },
    {
      "question": "What is the role of the 'Pollen Tube'?",
      "options": ["To protect the pollen from rain.", "To carry the male gametes from the stigma to the ovule.", "To provide color to the flower.", "To turn into the root of the new plant."],
      "correctAnswer": "To carry the male gametes from the stigma to the ovule.",
      "difficulty": "moderate",
      "explanation": "After pollination, the pollen grain germinates on the stigma and grows a tube down the style to reach the ovary."
    },
    {
      "question": "Situational Judgment: A farmer wants to produce a large crop of tomatoes that are all exactly the same size and taste. Which method should he use?",
      "options": ["Sowing seeds from his best tomato.", "Vegetative propagation (cuttings) from his best tomato plant.", "Cross-pollinating two different tomato plants.", "Letting nature take its course."],
      "correctAnswer": "Vegetative propagation (cuttings) from his best tomato plant.",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Asexual reproduction (cuttings) ensures the offspring are clones with the exact same traits as the parent."
    },
    {
      "question": "The 'Micropyle' in a seed is a small hole that allows for the entry of:",
      "options": ["Pollen grains", "Water and oxygen during germination", "Sunlight", "Soil"],
      "correctAnswer": "Water and oxygen during germination",
      "difficulty": "hard",
      "explanation": "The micropyle is the opening through which the pollen tube entered the ovule, and later it facilitates the intake of water to start germination."
    },
    {
      "question": "Which of these is NOT a natural method of vegetative propagation?",
      "options": ["Runners", "Tubers", "Cuttings", "Rhizomes"],
      "correctAnswer": "Cuttings",
      "difficulty": "moderate",
      "explanation": "Cuttings are an artificial method because they require human intervention to slice the plant and plant the piece."
    },
    {
      "question": "What is 'Dormancy' in seeds?",
      "options": [
        "When the seed is actively growing.",
        "A period of inactivity where the seed does not germinate until conditions are favorable.",
        "When the seed is being eaten by an animal.",
        "The process of the seed falling from the tree."
      ],
      "correctAnswer": "A period of inactivity where the seed does not germinate until conditions are favorable.",
      "difficulty": "easy",
      "explanation": "Dormancy allows seeds to survive harsh conditions (like winter) and sprout only when they have a good chance of survival."
    },
    {
      "question": "How many parents are required for sexual reproduction?",
      "options": ["One", "Two", "Three", "Zero"],
      "correctAnswer": "Two",
      "difficulty": "easy",
      "explanation": "Sexual reproduction requires the contribution of genetic material from two different parents (or at least two different gamete types)."
    },
    {
      "question": "A 'Bulb', such as that of an onion, consists of a short stem surrounded by:",
      "options": ["Fleshy, food-storing leaves", "Long roots", "Hard seeds", "Flowers"],
      "correctAnswer": "Fleshy, food-storing leaves",
      "difficulty": "hard",
      "explanation": "The layers of an onion are actually modified leaves that store energy for the next growing season."
    },
    {
      "question": "Which of these describes 'Parthenogenesis'?",
      "options": [
        "Reproduction involving only male gametes.",
        "Development of an embryo from an unfertilized egg.",
        "The fusion of three gametes.",
        "A form of grafting."
      ],
      "correctAnswer": "Development of an embryo from an unfertilized egg.",
      "difficulty": "hard",
      "explanation": "Parthenogenesis is a form of asexual reproduction found in some insects, reptiles, and fish."
    },
    {
      "question": "What is the result of 'Double Fertilization' in flowering plants?",
      "options": [
        "Two identical twins are produced.",
        "One sperm fertilizes the egg (zygote) and another fertilizes two polar nuclei (endosperm).",
        "The flower dies immediately.",
        "The plant produces two fruits."
      ],
      "correctAnswer": "One sperm fertilizes the egg (zygote) and another fertilizes two polar nuclei (endosperm).",
      "difficulty": "hard",
      "explanation": "This unique process ensures that the developing embryo has a dedicated food supply (endosperm)."
    },
    {
      "question": "True or False: Most flowers contain both male and female reproductive organs.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "These are called 'perfect' or 'hermaphrodite' flowers. Some species have separate male and female flowers."
    },
    {
      "question": "Case Study: A scientist discovers a new species of plant in a rapidly changing environment. Would he expect it to primarily use sexual or asexual reproduction to survive long-term?",
      "options": ["Asexual", "Sexual", "Neither", "Both equally"],
      "correctAnswer": "Sexual",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Sexual reproduction provides the genetic variation necessary for a species to adapt to a changing environment."
    },
    {
      "question": "The 'Plumule' of a germinating seed eventually becomes the:",
      "options": ["Root", "Shoot (Stem and Leaves)", "Flower", "Fruit"],
      "correctAnswer": "Shoot (Stem and Leaves)",
      "difficulty": "moderate",
      "explanation": "The embryonic shoot is the plumule, while the embryonic root is the radicle."
    },
    {
      "question": "What is the primary function of fruit in plant biology?",
      "options": ["To provide food for humans.", "To protect the seeds and assist in their dispersal.", "To perform photosynthesis for the seeds.", "To absorb water from the ground."],
      "correctAnswer": "To protect the seeds and assist in their dispersal.",
      "difficulty": "moderate",
      "explanation": "Fruits encourage animals to eat them (and poop out the seeds elsewhere) or use wind/water to move seeds away from the parent."
    }
  ],
  "Unit 14: Sexual reproduction in flowering plants": [
    {
      "question": "Which whorl of the flower consists of the sepals and is primarily used for protection of the bud?",
      "options": ["Calyx", "Corolla", "Androecium", "Gynoecium"],
      "correctAnswer": "Calyx",
      "difficulty": "easy",
      "explanation": "The calyx is the outermost whorl of a flower, made up of sepals that protect the internal organs while in the bud stage."
    },
    {
      "question": "The male reproductive part of a flower, known as the stamen, consists of which two structures?",
      "options": ["Stigma and Style", "Anther and Filament", "Ovary and Ovule", "Petal and Sepal"],
      "correctAnswer": "Anther and Filament",
      "difficulty": "easy",
      "explanation": "The stamen (androecium) is composed of the anther, which produces pollen, and the filament, which supports the anther."
    },
    {
      "question": "What is the primary function of the petals (corolla) in insect-pollinated flowers?",
      "options": ["To produce nectar", "To protect the seeds", "To attract pollinators with color and scent", "To carry out photosynthesis"],
      "correctAnswer": "To attract pollinators with color and scent",
      "difficulty": "easy",
      "explanation": "Brightly colored and scented petals are adaptations to lure insects and birds for pollination."
    },
    {
      "question": "The female reproductive organ of the flower is called the:",
      "options": ["Androecium", "Carpel (Pistil)", "Receptacle", "Pedicel"],
      "correctAnswer": "Carpel (Pistil)",
      "difficulty": "easy",
      "explanation": "The carpel or pistil is the gynoecium, consisting of the stigma, style, and ovary."
    },
    {
      "question": "Where are the ovules (female gametes) produced in a flowering plant?",
      "options": ["Stigma", "Anther", "Ovary", "Style"],
      "correctAnswer": "Ovary",
      "difficulty": "moderate",
      "explanation": "The ovary is the swollen base of the carpel that contains one or more ovules."
    },
    {
      "question": "Pollination is defined as the transfer of pollen grains from the _____ to the _____.",
      "options": ["Anther, Stigma", "Stigma, Anther", "Ovary, Ovule", "Filament, Style"],
      "correctAnswer": "Anther, Stigma",
      "difficulty": "easy",
      "explanation": "Pollination is the mechanical transfer of pollen from the male part (anther) to the female receptive part (stigma)."
    },
    {
      "question": "Which type of pollination occurs when pollen from a flower lands on the stigma of the same flower or another flower on the same plant?",
      "options": ["Cross-pollination", "Self-pollination", "Artificial pollination", "Wind pollination"],
      "correctAnswer": "Self-pollination",
      "difficulty": "moderate",
      "explanation": "Self-pollination involves only one parent plant and results in less genetic variation."
    },
    {
      "question": "Which of the following is a characteristic feature of wind-pollinated flowers?",
      "options": ["Large, brightly colored petals", "Sticky or heavy pollen grains", "Feathery stigmas and long filaments", "Presence of nectar and scent"],
      "correctAnswer": "Feathery stigmas and long filaments",
      "difficulty": "moderate",
      "explanation": "Feathery stigmas provide a large surface area to catch pollen floating in the air, and long filaments allow anthers to be exposed to the wind."
    },
    {
      "question": "What happens immediately after a pollen grain lands on a compatible stigma?",
      "options": ["Fertilization occurs instantly", "The ovary turns into a fruit", "A pollen tube begins to grow down the style", "The flower petals fall off"],
      "correctAnswer": "A pollen tube begins to grow down the style",
      "difficulty": "moderate",
      "explanation": "The pollen grain germinates, sending a tube through the style to reach the micropyle of the ovule."
    },
    {
      "question": "In flowering plants, 'Double Fertilization' refers to:",
      "options": ["Two pollen grains entering one ovule", "One sperm fertilizing the egg and another fertilizing the polar nuclei", "The fertilization of two different ovaries", "Pollination followed by fertilization"],
      "correctAnswer": "One sperm fertilizing the egg and another fertilizing the polar nuclei",
      "difficulty": "hard",
      "explanation": "Double fertilization produces a diploid zygote and a triploid endosperm (food storage)."
    },
    {
      "question": "After fertilization, the ovule develops into the _____ and the ovary develops into the _____.",
      "options": ["Fruit, Seed", "Seed, Fruit", "Root, Stem", "Embryo, Ovule"],
      "correctAnswer": "Seed, Fruit",
      "difficulty": "moderate",
      "explanation": "The zygote within the ovule becomes the embryo, the ovule becomes the seed, and the surrounding ovary matures into the fruit."
    },
    {
      "question": "Which part of the seed provides nutrition to the developing embryo before it can photosynthesize?",
      "options": ["Testa", "Micropyle", "Endosperm or Cotyledon", "Radicle"],
      "correctAnswer": "Endosperm or Cotyledon",
      "difficulty": "moderate",
      "explanation": "The endosperm (in monocots) or cotyledons (in dicots) store starch, fats, and proteins for the embryo."
    },
    {
      "question": "The tough, protective outer layer of a seed is called the:",
      "options": ["Plumule", "Testa (Seed coat)", "Tegmen", "Hilum"],
      "correctAnswer": "Testa (Seed coat)",
      "difficulty": "easy",
      "explanation": "The testa protects the embryo from mechanical damage and drying out."
    },
    {
      "question": "A seed with wings (like a sycamore) or a parachute of hairs (like a dandelion) is adapted for dispersal by:",
      "options": ["Water", "Animals", "Wind", "Explosive mechanism"],
      "correctAnswer": "Wind",
      "difficulty": "easy",
      "explanation": "Wings and hairs increase surface area and air resistance, allowing the seed to be carried by air currents."
    },
    {
      "question": "Seeds of fruits like the coconut are primarily dispersed by:",
      "options": ["Wind", "Water", "Birds", "Self-ejection"],
      "correctAnswer": "Water",
      "difficulty": "moderate",
      "explanation": "Coconuts have a fibrous, air-filled mesocarp that allows them to float across oceans."
    },
    {
      "question": "What is the primary purpose of seed dispersal?",
      "options": ["To find a mate for the seed", "To reduce competition between the parent plant and the offspring", "To provide food for animals", "To ensure the seeds stay near the parent"],
      "correctAnswer": "To reduce competition between the parent plant and the offspring",
      "difficulty": "moderate",
      "explanation": "Dispersal ensures seeds move away from the parent to avoid competing for light, water, and soil nutrients."
    },
    {
      "question": "Which three environmental conditions are generally required for seed germination?",
      "options": ["Light, Soil, and Water", "Water, Oxygen, and Suitable Temperature", "Carbon dioxide, Light, and Warmth", "Oxygen, Soil, and Fertilizer"],
      "correctAnswer": "Water, Oxygen, and Suitable Temperature",
      "difficulty": "moderate",
      "explanation": "Water activates enzymes, oxygen is needed for aerobic respiration, and temperature affects enzyme activity."
    },
    {
      "question": "During germination, the embryonic root that emerges first is called the:",
      "options": ["Plumule", "Radicle", "Hypocotyl", "Epicotyl"],
      "correctAnswer": "Radicle",
      "difficulty": "easy",
      "explanation": "The radicle is the first part of the embryo to emerge, allowing the plant to absorb water and anchor itself."
    },
    {
      "question": "The embryonic shoot that develops into the stem and leaves is the:",
      "options": ["Radicle", "Plumule", "Cotyledon", "Micropyle"],
      "correctAnswer": "Plumule",
      "difficulty": "easy",
      "explanation": "The plumule grows upward to become the aerial parts of the plant."
    },
    {
      "question": "In epigeal germination, the _____ elongates and pushes the cotyledons above the ground.",
      "options": ["Epicotyl", "Hypocotyl", "Radicle", "Testa"],
      "correctAnswer": "Hypocotyl",
      "difficulty": "hard",
      "explanation": "In epigeal (above earth) germination, the hypocotyl arches and pulls the cotyledons out of the soil."
    },
    {
      "question": "True or False: Most wind-pollinated flowers have a strong scent and produce nectar.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Wind-pollinated flowers do not need to attract insects, so they typically lack scent, nectar, and bright colors."
    },
    {
      "question": "What is the 'micropyle'?",
      "options": ["A type of root", "A small hole in the seed coat where water enters", "The tip of the stamen", "The sugary liquid in a flower"],
      "correctAnswer": "A small hole in the seed coat where water enters",
      "difficulty": "moderate",
      "explanation": "The micropyle is the opening in the ovule through which the pollen tube entered; it later serves as a water entry point for germination."
    },
    {
      "question": "Identify the 'error' in this sequence of fertilization: Pollen lands on stigma -> Pollen tube grows -> Sperm enters ovary -> Seed forms.",
      "options": [
        "Pollen does not land on the stigma.",
        "The sperm must enter the ovule, not just the ovary, to fertilize the egg.",
        "Pollen tubes do not grow through the style.",
        "There is no error."
      ],
      "correctAnswer": "The sperm must enter the ovule, not just the ovary, to fertilize the egg.",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "Fertilization specifically occurs within the ovule where the female gamete (egg) is located."
    },
    {
      "question": "A 'succulent' fruit is one that is:",
      "options": ["Dry and hard", "Fleshy and juicy", "Pollinated by wind", "Lacking seeds"],
      "correctAnswer": "Fleshy and juicy",
      "difficulty": "easy",
      "explanation": "Succulent fruits (like tomatoes or mangoes) are usually adapted for animal dispersal."
    },
    {
      "question": "Which of these is an example of 'Explosive' or 'Mechanical' dispersal?",
      "options": ["Coconut floating", "Blackjack sticking to fur", "Pea pods drying and splitting open violently", "Dandelion seeds flying"],
      "correctAnswer": "Pea pods drying and splitting open violently",
      "difficulty": "moderate",
      "explanation": "In some plants, the drying of the fruit wall creates tension that eventually snaps, flinging the seeds away."
    },
    {
      "question": "Assertion: Cross-pollination is biologically superior to self-pollination.\nReason: It leads to greater genetic variation in the offspring.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Genetic variation is essential for evolution and adaptation to changing environments."
    },
    {
      "question": "Select ALL that apply to insect-pollinated flowers:",
      "multiSelect": true,
      "options": [
        "Large, sticky pollen grains",
        "Small, green petals",
        "Presence of nectaries",
        "Stigmas hidden inside the flower",
        "Feathery stigmas"
      ],
      "correctAnswer": ["Large, sticky pollen grains", "Presence of nectaries", "Stigmas hidden inside the flower"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Insect-pollinated flowers have adaptations to ensure insects make contact with reproductive organs while seeking nectar."
    },
    {
      "question": "What is the function of the 'style' in a flower?",
      "options": ["To produce pollen", "To hold the stigma in a position to receive pollen", "To protect the flower bud", "To turn into the fruit"],
      "correctAnswer": "To hold the stigma in a position to receive pollen",
      "difficulty": "moderate",
      "explanation": "The style is the stalk of the carpel through which the pollen tube grows."
    },
    {
      "question": "If a plant is 'Monoecious', it means:",
      "options": ["It has only male flowers.", "It has only female flowers.", "It has separate male and female flowers on the same plant.", "It has only one petal."],
      "correctAnswer": "It has separate male and female flowers on the same plant.",
      "difficulty": "hard",
      "explanation": "Maize is a common example of a monoecious plant."
    },
    {
      "question": "The 'hypocotyl' is the part of the embryo axis:",
      "options": ["Above the cotyledons", "Below the cotyledons", "That becomes the leaf", "That becomes the seed coat"],
      "correctAnswer": "Below the cotyledons",
      "difficulty": "hard",
      "explanation": "The hypocotyl is the region between the radicle and the cotyledonary node."
    },
    {
      "question": "Order the parts of a flower from the outermost to the innermost whorl:",
      "orderCorrect": ["Sepals (Calyx)", "Petals (Corolla)", "Stamens (Androecium)", "Carpels (Gynoecium)"],
      "difficulty": "moderate",
      "type": "ordering",
      "explanation": "This is the standard arrangement of a 'complete' flower."
    },
    {
      "question": "Blackjack (Bidens pilosa) seeds are dispersed by:",
      "options": ["Wind", "Water", "Hooks that stick to animal fur", "Explosion"],
      "correctAnswer": "Hooks that stick to animal fur",
      "difficulty": "easy",
      "explanation": "The seeds have hooked bristles that cling to passersby, facilitating transport."
    },
    {
      "question": "Why is oxygen necessary for seed germination?",
      "options": ["For photosynthesis", "For aerobic respiration to provide energy for growth", "To turn the seed green", "To keep the seed cool"],
      "correctAnswer": "For aerobic respiration to provide energy for growth",
      "difficulty": "moderate",
      "explanation": "The germinating embryo is highly active and requires ATP, which is produced via respiration using stored food and oxygen."
    },
    {
      "question": "In 'Hypogeal' germination (like in maize), the _____ remains below the ground.",
      "options": ["Radicle", "Plumule", "Cotyledon", "Epicotyl"],
      "correctAnswer": "Cotyledon",
      "difficulty": "hard",
      "explanation": "In hypogeal (under earth) germination, the epicotyl elongates, keeping the cotyledon(s) in the soil."
    },
    {
      "question": "The 'scutellum' in a maize grain is actually a modified:",
      "options": ["Root", "Cotyledon", "Endosperm", "Testa"],
      "correctAnswer": "Cotyledon",
      "difficulty": "hard",
      "explanation": "In monocots like maize, the single cotyledon is called a scutellum and absorbs nutrients from the endosperm."
    },
    {
      "question": "The fusion of the second male gamete with the two polar nuclei results in a triploid (3n) tissue called:",
      "options": ["Zygote", "Embryo", "Endosperm", "Testa"],
      "correctAnswer": "Endosperm",
      "difficulty": "hard",
      "explanation": "The endosperm provides high-energy food for the embryo."
    },
    {
      "question": "Which of the following describes a 'dicotyledonous' seed?",
      "options": ["It has one cotyledon.", "It has two cotyledons.", "It has no testa.", "It is always wind-dispersed."],
      "correctAnswer": "It has two cotyledons.",
      "difficulty": "easy",
      "explanation": "Dicot (two) seeds like beans have two seed leaves (cotyledons)."
    },
    {
      "question": "Situational Judgment: You find a flower that is small, green, and has no petals. It has large anthers hanging on long filaments. How would you classify its pollination method?",
      "options": ["Insect-pollinated", "Wind-pollinated", "Bird-pollinated", "Self-pollinated"],
      "correctAnswer": "Wind-pollinated",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "The lack of visual attractants and the exposed anthers are classic signs of wind pollination."
    },
    {
      "question": "What is the 'receptacle' of a flower?",
      "options": ["The part that produces nectar", "The tip of the stalk to which the flower parts are attached", "The tube for pollen", "The protective bud cover"],
      "correctAnswer": "The tip of the stalk to which the flower parts are attached",
      "difficulty": "moderate",
      "explanation": "The receptacle is the thickened part of a stem from which the flower organs grow."
    },
    {
      "question": "True or False: Seeds can germinate in total darkness.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Most seeds do not require light for the initial stages of germination, as they use stored energy. However, once leaves form, they need light for photosynthesis."
    },
    {
      "question": "The 'hilum' on a bean seed represents:",
      "options": ["Where the root will emerge", "The scar where the seed was attached to the ovary (pod) wall", "The entry point for oxygen", "The embryonic shoot"],
      "correctAnswer": "The scar where the seed was attached to the ovary (pod) wall",
      "difficulty": "hard",
      "explanation": "Similar to a belly button, it shows the point of attachment to the parent plant."
    },
    {
      "question": "Which of these is a 'dry' fruit?",
      "options": ["Orange", "Bean pod", "Apple", "Mango"],
      "correctAnswer": "Bean pod",
      "difficulty": "easy",
      "explanation": "The fruit wall of a bean (the pod) becomes dry and brittle at maturity, unlike succulent fruits."
    },
    {
      "question": "Pollination by birds is known as:",
      "options": ["Entomophily", "Anemophily", "Ornithophily", "Hydrophily"],
      "correctAnswer": "Ornithophily",
      "difficulty": "hard",
      "explanation": "Bird-pollinated flowers are often tubular and bright red or orange."
    },
    {
      "question": "What happens to the 'synergids' and 'antipodal' cells after fertilization?",
      "options": ["They become the seed coat.", "They degenerate and disappear.", "They turn into the embryo.", "They become the fruit wall."],
      "correctAnswer": "They degenerate and disappear.",
      "difficulty": "hard",
      "explanation": "These cells in the embryo sac play a role in guiding the pollen tube but are no longer needed after fertilization."
    },
    {
      "question": "Case Study: A plant produces seeds inside a bright red, sweet-tasting fruit. What is the most likely dispersal agent?",
      "options": ["The wind", "An animal (e.g., a bird or mammal)", "The ocean", "Gravity"],
      "correctAnswer": "An animal (e.g., a bird or mammal)",
      "difficulty": "easy",
      "type": "caseBased",
      "explanation": "The fruit is an 'incentive' for animals to eat it and disperse the seeds."
    },
    {
      "question": "The growth of a plant from a seed is called:",
      "options": ["Pollination", "Fertilization", "Germination", "Dispersal"],
      "correctAnswer": "Germination",
      "difficulty": "easy",
      "explanation": "Germination is the process of the embryo waking from dormancy and starting to grow."
    }
  ],
  "Unit 15: Reproduction in human beings": [
    {
      "question": "Which of the following organs is responsible for the production of sperm and testosterone?",
      "options": ["Epididymis", "Testes", "Prostate gland", "Vas deferens"],
      "correctAnswer": "Testes",
      "difficulty": "easy",
      "explanation": "The testes are the male primary reproductive organs where spermatogenesis and hormone production occur."
    },
    {
      "question": "What is the function of the scrotum in the male reproductive system?",
      "options": ["To produce seminal fluid", "To store mature sperm", "To maintain the testes at a temperature slightly lower than body temperature", "To transport sperm to the urethra"],
      "correctAnswer": "To maintain the testes at a temperature slightly lower than body temperature",
      "difficulty": "moderate",
      "explanation": "Sperm production requires a temperature about 2-3°C lower than the core body temperature."
    },
    {
      "question": "Which part of the female reproductive system is the site of fertilization?",
      "options": ["Ovary", "Uterus", "Oviduct (Fallopian tube)", "Cervix"],
      "correctAnswer": "Oviduct (Fallopian tube)",
      "difficulty": "easy",
      "explanation": "Fertilization typically occurs in the upper third of the fallopian tube."
    },
    {
      "question": "The muscular organ where a fetus develops during pregnancy is the:",
      "options": ["Vagina", "Oviduct", "Uterus", "Bladder"],
      "correctAnswer": "Uterus",
      "difficulty": "easy",
      "explanation": "The uterus (womb) has a thick muscular wall and a nutrient-rich lining called the endometrium to support the fetus."
    },
    {
      "question": "What is the primary role of the 'Epididymis'?",
      "options": ["Production of sperm", "Maturation and storage of sperm", "Neutralizing acidity in the urethra", "Providing sugar for sperm energy"],
      "correctAnswer": "Maturation and storage of sperm",
      "difficulty": "moderate",
      "explanation": "Sperm move from the testes to the epididymis to mature and gain motility."
    },
    {
      "question": "On which day of a typical 28-day menstrual cycle does ovulation usually occur?",
      "options": ["Day 1", "Day 7", "Day 14", "Day 28"],
      "correctAnswer": "Day 14",
      "difficulty": "easy",
      "explanation": "Ovulation, the release of an egg from the ovary, generally occurs mid-cycle."
    },
    {
      "question": "Which hormone is primarily responsible for the thickening of the uterine lining (endometrium)?",
      "options": ["Testosterone", "Progesterone", "Adrenaline", "Insulin"],
      "correctAnswer": "Progesterone",
      "difficulty": "moderate",
      "explanation": "Progesterone maintains the uterine lining in preparation for potential implantation."
    },
    {
      "question": "The shedding of the uterine lining when fertilization does not occur is called:",
      "options": ["Ovulation", "Menstruation", "Implantation", "Gestation"],
      "correctAnswer": "Menstruation",
      "difficulty": "easy",
      "explanation": "Menstruation marks the beginning of a new menstrual cycle (Day 1)."
    },
    {
      "question": "Which pituitary hormone stimulates the development of follicles in the ovary?",
      "options": ["Luteinizing Hormone (LH)", "Follicle Stimulating Hormone (FSH)", "Estrogen", "Oxytocin"],
      "correctAnswer": "Follicle Stimulating Hormone (FSH)",
      "difficulty": "moderate",
      "explanation": "FSH is released by the brain to signal the ovaries to mature an egg cell."
    },
    {
      "question": "A surge in which hormone triggers the process of ovulation?",
      "options": ["FSH", "LH", "Estrogen", "Progesterone"],
      "correctAnswer": "LH",
      "difficulty": "moderate",
      "explanation": "A sharp rise in Luteinizing Hormone (LH) causes the follicle to rupture and release the egg."
    },
    {
      "question": "What is 'Implantation'?",
      "options": ["The release of an egg from the ovary", "The fusion of sperm and egg", "The attachment of the embryo to the uterine wall", "The birth of the baby"],
      "correctAnswer": "The attachment of the embryo to the uterine wall",
      "difficulty": "moderate",
      "explanation": "Implantation occurs about 6-9 days after fertilization."
    },
    {
      "question": "The structure that allows for the exchange of nutrients, gases, and wastes between maternal and fetal blood is the:",
      "options": ["Amniotic sac", "Placenta", "Umbilical cord", "Cervix"],
      "correctAnswer": "Placenta",
      "difficulty": "moderate",
      "explanation": "The placenta acts as a barrier and a transport system, though maternal and fetal blood do not mix directly."
    },
    {
      "question": "What is the function of the amniotic fluid?",
      "options": ["To provide nutrition to the fetus", "To protect the fetus from physical shock and maintain temperature", "To produce hormones", "To carry oxygen to the fetus"],
      "correctAnswer": "To protect the fetus from physical shock and maintain temperature",
      "difficulty": "moderate",
      "explanation": "Amniotic fluid acts as a cushion/buffer for the developing embryo."
    },
    {
      "question": "Which hormone is responsible for the development of secondary sexual characteristics in males (e.g., deepening of voice, facial hair)?",
      "options": ["Estrogen", "Testosterone", "Progesterone", "LH"],
      "correctAnswer": "Testosterone",
      "difficulty": "easy",
      "explanation": "Testosterone is the primary male sex hormone produced in the testes."
    },
    {
      "question": "Secondary sexual characteristics in females, such as breast development, are primarily driven by:",
      "options": ["Testosterone", "Estrogen", "Insulin", "Thyroxine"],
      "correctAnswer": "Estrogen",
      "difficulty": "easy",
      "explanation": "Estrogen levels rise during puberty to develop female reproductive structures and features."
    },
    {
      "question": "The average duration of human pregnancy (gestation period) is approximately:",
      "options": ["6 months", "9 months (38-40 weeks)", "12 months", "3 months"],
      "correctAnswer": "9 months (38-40 weeks)",
      "difficulty": "easy",
      "explanation": "Gestation is the time between fertilization and birth."
    },
    {
      "question": "Which of the following should be avoided by a pregnant woman as part of 'ante-natal care'?",
      "options": ["Folic acid supplements", "Moderate exercise", "Alcohol and smoking", "Regular check-ups"],
      "correctAnswer": "Alcohol and smoking",
      "difficulty": "easy",
      "explanation": "Alcohol and nicotine can cross the placenta and cause developmental issues (e.g., Fetal Alcohol Syndrome)."
    },
    {
      "question": "What happens during the first stage of birth (labour)?",
      "options": ["The placenta is expelled", "The baby is pushed out of the vagina", "The cervix dilates (widens)", "The umbilical cord is cut"],
      "correctAnswer": "The cervix dilates (widens)",
      "difficulty": "moderate",
      "explanation": "Dilation allows the baby's head to pass from the uterus into the birth canal."
    },
    {
      "question": "Which hormone causes the uterus to contract during birth and stimulates milk let-down?",
      "options": ["Progesterone", "Oxytocin", "Estrogen", "Prolactin"],
      "correctAnswer": "Oxytocin",
      "difficulty": "hard",
      "explanation": "Oxytocin is often referred to as the 'birth hormone' for its role in uterine contractions."
    },
    {
      "question": "The 'Afterbirth' refers to the expulsion of the _____ after the baby is born.",
      "options": ["Amniotic fluid", "Placenta", "Umbilical cord", "Cervical mucus"],
      "correctAnswer": "Placenta",
      "difficulty": "moderate",
      "explanation": "After the baby is born, the placenta detaches from the uterine wall and is delivered."
    },
    {
      "question": "True or False: Maternal blood and fetal blood mix directly within the placenta.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "They remain separate to protect the fetus from high maternal blood pressure and potential immune attacks; exchange happens via diffusion."
    },
    {
      "question": "The neck of the uterus which opens into the vagina is called the:",
      "options": ["Oviduct", "Vulva", "Cervix", "Urethra"],
      "correctAnswer": "Cervix",
      "difficulty": "easy",
      "explanation": "The cervix stays tightly closed during pregnancy and dilates during birth."
    },
    {
      "question": "Order the stages of human development:",
      "orderCorrect": ["Zygote", "Morula", "Blastocyst", "Embryo", "Fetus"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "This shows the progression from a single fertilized cell to a recognizable human form."
    },
    {
      "question": "What is the function of the prostate gland and seminal vesicles?",
      "options": ["To produce sperm", "To produce fluid that nourishes and transports sperm", "To store urine", "To produce testosterone"],
      "correctAnswer": "To produce fluid that nourishes and transports sperm",
      "difficulty": "moderate",
      "explanation": "These glands add alkaline fluid and nutrients to sperm to form semen."
    },
    {
      "question": "Identify the incorrect pair regarding the menstrual cycle:",
      "options": [
        "Follicular phase - FSH levels rise",
        "Ovulation - Egg is released",
        "Luteal phase - Corpus luteum forms",
        "Menstruation - Progesterone levels are at their highest"
      ],
      "correctAnswer": "Menstruation - Progesterone levels are at their highest",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "Menstruation occurs because progesterone levels drop sharply."
    },
    {
      "question": "The umbilical cord contains blood vessels that:",
      "options": ["Connect the fetus to the mother's heart", "Connect the fetus to the placenta", "Carry waste from the mother to the baby", "Produce blood for the fetus"],
      "correctAnswer": "Connect the fetus to the placenta",
      "difficulty": "moderate",
      "explanation": "The umbilical cord contains arteries and a vein for transport between the fetus and the placenta."
    },
    {
      "question": "Which of these is a permanent method of contraception in males?",
      "options": ["Condom", "Vasectomy", "Withdrawal", "IUD"],
      "correctAnswer": "Vasectomy",
      "difficulty": "moderate",
      "explanation": "A vasectomy involves cutting/tying the vas deferens to prevent sperm from leaving the testes."
    },
    {
      "question": "What is 'Exclusive Breastfeeding'?",
      "options": ["Giving the baby milk and water", "Giving the baby only breast milk for the first 6 months", "Feeding the baby with a bottle only", "Feeding the baby once a day"],
      "correctAnswer": "Giving the baby only breast milk for the first 6 months",
      "difficulty": "easy",
      "explanation": "Breast milk contains all necessary nutrients and antibodies for an infant's early development."
    },
    {
      "question": "Assertion: Fertilization usually takes place in the Fallopian tube.\nReason: Sperm cells are highly motile and swim from the vagina, through the cervix and uterus, to reach the oviduct.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "The journey of the sperm is essential to meet the egg in the oviduct."
    },
    {
      "question": "Fill in the blank: The _____ is the temporary endocrine structure that forms in the ovary after ovulation and secretes progesterone.",
      "options": ["Graafian follicle", "Corpus luteum", "Zygote", "Placenta"],
      "correctAnswer": "Corpus luteum",
      "difficulty": "hard",
      "type": "fillBlank",
      "explanation": "If pregnancy doesn't occur, the corpus luteum degenerates, leading to menstruation."
    },
    {
      "question": "Which structure in the male reproductive system is shared by both the urinary and reproductive systems?",
      "options": ["Ureter", "Urethra", "Vas deferens", "Epididymis"],
      "correctAnswer": "Urethra",
      "difficulty": "moderate",
      "explanation": "The urethra carries both urine and semen, though not at the same time."
    },
    {
      "question": "Which of these is a sign of puberty in girls?",
      "options": ["Growth of facial hair", "Broadening of shoulders", "Menarche (start of menstruation)", "Lowering of voice pitch"],
      "correctAnswer": "Menarche (start of menstruation)",
      "difficulty": "easy",
      "explanation": "Menarche is the first menstrual period and a key sign of reproductive maturity in females."
    },
    {
      "question": "Select ALL that apply to the placenta:",
      "multiSelect": true,
      "options": [
        "Produces progesterone during pregnancy",
        "Filters all bacteria and viruses perfectly",
        "Exchange of CO2 and Oxygen",
        "Connects to the fetus via the umbilical cord",
        "Directly mixes maternal and fetal blood cells"
      ],
      "correctAnswer": ["Produces progesterone during pregnancy", "Exchange of CO2 and Oxygen", "Connects to the fetus via the umbilical cord"],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "The placenta takes over hormone production from the corpus luteum and is the site of gas exchange. It does not filter all pathogens (e.g., HIV or Rubella can pass)."
    },
    {
      "question": "A woman has a 30-day cycle. If her period started on Oct 1st, when is she most likely to ovulate?",
      "options": ["Oct 5th", "Oct 14th", "Oct 16th", "Oct 28th"],
      "correctAnswer": "Oct 16th",
      "difficulty": "hard",
      "type": "calculation",
      "explanation": "Ovulation usually occurs 14 days *before* the next period. 30 - 14 = Day 16."
    },
    {
      "question": "What is the primary danger of 'Ectopic Pregnancy'?",
      "options": ["The baby will be too small.", "The embryo implants outside the uterus (e.g., in the fallopian tube), which can cause internal bleeding.", "The mother will have twins.", "The placenta will not form."],
      "correctAnswer": "The embryo implants outside the uterus (e.g., in the fallopian tube), which can cause internal bleeding.",
      "difficulty": "moderate",
      "explanation": "Ectopic pregnancies are medical emergencies as the fallopian tube cannot support a growing fetus."
    },
    {
      "question": "Case Study: A woman is tracking her body temperature and notices a slight rise. This is often a sign of:",
      "options": ["Menstruation", "Ovulation", "Menopause", "Implantation"],
      "correctAnswer": "Ovulation",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Basal body temperature increases slightly after ovulation due to increased progesterone."
    },
    {
      "question": "Which of the following describes the 'Acrosome' of a sperm cell?",
      "options": ["The tail used for swimming", "The middle piece containing mitochondria", "The cap on the head containing enzymes to penetrate the egg", "The nucleus containing DNA"],
      "correctAnswer": "The cap on the head containing enzymes to penetrate the egg",
      "difficulty": "moderate",
      "explanation": "The acrosome reaction allows the sperm to digest the outer layer of the egg."
    },
    {
      "question": "Why is 'Folic Acid' recommended before and during early pregnancy?",
      "options": ["To prevent morning sickness", "To prevent neural tube defects (like Spina Bifida)", "To make the baby's eyes blue", "To increase the mother's milk production"],
      "correctAnswer": "To prevent neural tube defects (like Spina Bifida)",
      "difficulty": "moderate",
      "explanation": "Folic acid is vital for the proper development of the baby's brain and spinal cord."
    },
    {
      "question": "Which method of birth control also provides protection against STIs (Sexually Transmitted Infections)?",
      "options": ["The Pill", "IUD", "Condoms", "Diaphragm"],
      "correctAnswer": "Condoms",
      "difficulty": "easy",
      "explanation": "Condoms act as a physical barrier to both sperm and many pathogens."
    },
    {
      "question": "What happens to the level of estrogen and progesterone during pregnancy?",
      "options": ["They both drop to zero.", "They remain high to prevent further ovulation and maintain the uterus.", "Only estrogen stays high.", "They fluctuate wildly every day."],
      "correctAnswer": "They remain high to prevent further ovulation and maintain the uterus.",
      "difficulty": "moderate",
      "explanation": "High levels of these hormones inhibit FSH and LH, stopping the menstrual cycle during pregnancy."
    },
    {
      "question": "In the male reproductive system, where is 'fructose' (sugar) added to the semen?",
      "options": ["Testes", "Seminal vesicles", "Bulbourethral gland", "Bladder"],
      "correctAnswer": "Seminal vesicles",
      "difficulty": "hard",
      "explanation": "Fructose provides the energy source for sperm motility."
    },
    {
      "question": "What is the 'Blastocyst'?",
      "options": ["The name of the egg before fertilization", "A hollow ball of cells that implants in the uterus", "The umbilical cord", "The final stage of labor"],
      "correctAnswer": "A hollow ball of cells that implants in the uterus",
      "difficulty": "hard",
      "explanation": "The zygote divides into a morula, which then becomes a blastocyst before attaching to the endometrium."
    },
    {
      "question": "True or False: Identical twins come from two different eggs and two different sperm.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Identical (monozygotic) twins come from one egg and one sperm that splits. Fraternal (dizygotic) twins come from two different eggs and sperm."
    },
    {
      "question": "Situational Judgment: A couple is struggling to conceive. A sperm count reveals many sperm lack mitochondria in the middle piece. What is the likely result?",
      "options": ["Sperm cannot find the egg.", "Sperm lack the energy to swim to the egg.", "Sperm cannot penetrate the egg's wall.", "Sperm will have the wrong DNA."],
      "correctAnswer": "Sperm lack the energy to swim to the egg.",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Mitochondria provide the ATP (energy) needed for the flagellum (tail) to move."
    },
    {
      "question": "The end of a woman's reproductive life, when menstruation stops, is called:",
      "options": ["Puberty", "Gestation", "Menopause", "Lactation"],
      "correctAnswer": "Menopause",
      "difficulty": "easy",
      "explanation": "Menopause typically occurs between ages 45 and 55 when the ovaries stop releasing eggs."
    },
    {
      "question": "Which of these is the first milk produced after birth, rich in antibodies?",
      "options": ["Lactose", "Casein", "Colostrum", "Formula"],
      "correctAnswer": "Colostrum",
      "difficulty": "moderate",
      "explanation": "Colostrum provides essential passive immunity to the newborn."
    }
  ],
   "Unit 16: Social factors that affect good health": [
    {
      "question": "According to the World Health Organization (WHO), health is defined as:",
      "options": ["The absence of disease or infirmity", "A state of complete physical, mental, and social well-being", "The ability to exercise daily", "Having a balanced diet only"],
      "correctAnswer": "A state of complete physical, mental, and social well-being",
      "difficulty": "easy",
      "explanation": "Health is a holistic concept that encompasses more than just the lack of illness."
    },
    {
      "question": "Which of the following is considered a social factor that influences health?",
      "options": ["Genetic mutations", "Housing conditions and sanitation", "Viral infections", "Blood type"],
      "correctAnswer": "Housing conditions and sanitation",
      "difficulty": "easy",
      "explanation": "Social factors include the environment in which people live, work, and grow."
    },
    {
      "question": "What is the primary goal of public health services?",
      "options": ["To treat individual patients in private clinics", "To protect and improve the health of entire communities", "To sell pharmaceutical drugs for profit", "To perform complex surgeries"],
      "correctAnswer": "To protect and improve the health of entire communities",
      "difficulty": "moderate",
      "explanation": "Public health focuses on prevention, policy, and community-wide health outcomes."
    },
    {
      "question": "Which of these is a key responsibility of a country's Ministry of Health?",
      "options": ["Fixing local roads", "Ensuring safe water supply and waste disposal", "Manufacturing cars", "Managing international trade"],
      "correctAnswer": "Ensuring safe water supply and waste disposal",
      "difficulty": "moderate",
      "explanation": "Environmental sanitation is a core pillar of public health managed by health authorities."
    },
    {
      "question": "A drug is defined as any substance that:",
      "options": ["Is always illegal", "Must be injected", "Changes the way the body or mind functions", "Only treats bacterial infections"],
      "correctAnswer": "Changes the way the body or mind functions",
      "difficulty": "easy",
      "explanation": "Drugs include medicines, caffeine, alcohol, and illegal substances that alter physiological states."
    },
    {
      "question": "What does the term 'Drug Abuse' mean?",
      "options": ["Taking medicine according to a doctor's prescription", "Using a drug in a way that is harmful to oneself or others", "Buying expensive medicine", "Using a drug only once"],
      "correctAnswer": "Using a drug in a way that is harmful to oneself or others",
      "difficulty": "easy",
      "explanation": "Abuse refers to the misuse of substances, whether legal or illegal, leading to negative consequences."
    },
    {
      "question": "Which of the following is a 'Social' consequence of drug abuse?",
      "options": ["Liver cirrhosis", "Brain damage", "Breakdown of family relationships", "High blood pressure"],
      "correctAnswer": "Breakdown of family relationships",
      "difficulty": "moderate",
      "explanation": "While health issues are physical, the impact on family and community is a social consequence."
    },
    {
      "question": "Drug addiction is characterized by:",
      "options": ["Occasional use for fun", "A physical or psychological dependence on a substance", "The ability to stop using at any time", "Only using herbal remedies"],
      "correctAnswer": "A physical or psychological dependence on a substance",
      "difficulty": "moderate",
      "explanation": "Addiction involves a compulsive need for the drug, often leading to withdrawal symptoms if stopped."
    },
    {
      "question": "Which drug is the most widely abused legal substance globally?",
      "options": ["Heroin", "Cocaine", "Alcohol", "Ecstasy"],
      "correctAnswer": "Alcohol",
      "difficulty": "easy",
      "explanation": "Alcohol is a legal but potent depressant that is frequently misused."
    },
    {
      "question": "What is the effect of a 'Stimulant' drug on the central nervous system?",
      "options": ["It slows down brain activity", "It speeds up body functions and increases alertness", "It causes hallucinations", "It makes the user feel sleepy"],
      "correctAnswer": "It speeds up body functions and increases alertness",
      "difficulty": "moderate",
      "explanation": "Stimulants like caffeine or nicotine increase heart rate and brain activity."
    },
    {
      "question": "Which of the following is a 'Depressant' drug?",
      "options": ["Caffeine", "Cocaine", "Alcohol", "Nicotine"],
      "correctAnswer": "Alcohol",
      "difficulty": "moderate",
      "explanation": "Depressants slow down the messages between the brain and the body."
    },
    {
      "question": "The chemical in tobacco that causes addiction is:",
      "options": ["Tar", "Carbon monoxide", "Nicotine", "Arsenic"],
      "correctAnswer": "Nicotine",
      "difficulty": "easy",
      "explanation": "Nicotine is the highly addictive stimulant found in tobacco products."
    },
    {
      "question": "Long-term smoking primarily damages which organ system?",
      "options": ["Digestive system", "Respiratory system", "Skeletal system", "Excretory system"],
      "correctAnswer": "Respiratory system",
      "difficulty": "easy",
      "explanation": "Smoking causes lung cancer, bronchitis, and emphysema."
    },
    {
      "question": "What is 'Passive Smoking'?",
      "options": ["Smoking only once a week", "Breathing in smoke from other people's cigarettes", "Chewing tobacco instead of smoking it", "Using electronic cigarettes"],
      "correctAnswer": "Breathing in smoke from other people's cigarettes",
      "difficulty": "moderate",
      "explanation": "Second-hand smoke contains the same harmful chemicals as the smoke inhaled by the smoker."
    },
    {
      "question": "Which of the following is a hallucinogen?",
      "options": ["Aspirin", "LSD", "Penicillin", "Paracetamol"],
      "correctAnswer": "LSD",
      "difficulty": "moderate",
      "explanation": "Hallucinogens distort a person's perception of reality."
    },
    {
      "question": "Which disease is strongly associated with contaminated water and poor sanitation?",
      "options": ["Diabetes", "Cholera", "Lung cancer", "Asthma"],
      "correctAnswer": "Cholera",
      "difficulty": "easy",
      "explanation": "Cholera is a waterborne disease caused by the bacterium Vibrio cholerae."
    },
    {
      "question": "What is the purpose of 'Immunization' or vaccination programs?",
      "options": ["To cure people who are already sick", "To provide artificial immunity against specific diseases", "To clean the streets", "To provide free food"],
      "correctAnswer": "To provide artificial immunity against specific diseases",
      "difficulty": "moderate",
      "explanation": "Vaccines stimulate the immune system to recognize and fight pathogens before they cause illness."
    },
    {
      "question": "A person who needs larger and larger doses of a drug to get the same effect is showing:",
      "options": ["Withdrawal", "Tolerance", "Overdose", "Recovery"],
      "correctAnswer": "Tolerance",
      "difficulty": "hard",
      "explanation": "Tolerance occurs when the body adapts to the presence of a drug."
    },
    {
      "question": "Which of these is an example of an 'Over-the-Counter' (OTC) drug?",
      "options": ["Morphine", "Aspirin", "Antibiotics", "Anabolic steroids"],
      "correctAnswer": "Aspirin",
      "difficulty": "moderate",
      "explanation": "OTC drugs can be bought without a doctor's prescription."
    },
    {
      "question": "What is the main danger of sharing needles among drug users?",
      "options": ["Wasting the drug", "Transmission of blood-borne diseases like HIV and Hepatitis B", "Legal fines", "It makes the drug less effective"],
      "correctAnswer": "Transmission of blood-borne diseases like HIV and Hepatitis B",
      "difficulty": "easy",
      "explanation": "Needle sharing is a high-risk behavior for transmitting viruses through infected blood."
    },
    {
      "question": "True or False: Poverty is a social factor that can lead to poor health outcomes.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Poverty limits access to nutritious food, clean water, and healthcare."
    },
    {
      "question": "Which part of the brain is most affected by long-term alcohol abuse?",
      "options": ["The spinal cord", "The cerebellum (affecting balance)", "The skull", "The pituitary gland"],
      "correctAnswer": "The cerebellum (affecting balance)",
      "difficulty": "hard",
      "explanation": "Alcohol impairs the cerebellum, leading to the characteristic lack of coordination in intoxicated individuals."
    },
    {
      "question": "The 'Tar' in cigarette smoke is primarily responsible for:",
      "options": ["Addiction", "Staining teeth and causing lung cancer", "Reducing oxygen transport in blood", "Improving focus"],
      "correctAnswer": "Staining teeth and causing lung cancer",
      "difficulty": "moderate",
      "explanation": "Tar is a sticky black substance that coats the lungs and contains carcinogens."
    },
    {
      "question": "Which gas in cigarette smoke binds to hemoglobin and reduces the blood's oxygen-carrying capacity?",
      "options": ["Oxygen", "Nitrogen", "Carbon monoxide", "Carbon dioxide"],
      "correctAnswer": "Carbon monoxide",
      "difficulty": "hard",
      "explanation": "Carbon monoxide has a higher affinity for hemoglobin than oxygen."
    },
    {
      "question": "What is 'Self-medication'?",
      "options": ["Taking medicine as prescribed by a doctor", "Taking medicine on one's own initiative without professional advice", "Working as a pharmacist", "Exercising to stay healthy"],
      "correctAnswer": "Taking medicine on one's own initiative without professional advice",
      "difficulty": "moderate",
      "explanation": "Self-medication can lead to incorrect dosages or dangerous drug interactions."
    },
    {
      "question": "Which public health measure helps control the spread of malaria?",
      "options": ["Boiling drinking water", "Using insecticide-treated bed nets", "Washing hands before eating", "Wearing a face mask"],
      "correctAnswer": "Using insecticide-treated bed nets",
      "difficulty": "easy",
      "explanation": "Bed nets prevent the Anopheles mosquito from biting and transmitting the malaria parasite."
    },
    {
      "question": "Assertion: Proper sewage disposal is vital for community health.\nReason: Human waste can contain pathogens that cause diseases like typhoid and dysentery.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Sewage management prevents the contamination of food and water sources."
    },
    {
      "question": "Select ALL that are considered illegal drugs in most countries:",
      "multiSelect": true,
      "options": ["Heroin", "Cocaine", "Cannabis (in many regions)", "Caffeine", "Aspirin"],
      "correctAnswer": ["Heroin", "Cocaine", "Cannabis (in many regions)"],
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "Caffeine and Aspirin are legal substances."
    },
    {
      "question": "What are 'Withdrawal Symptoms'?",
      "options": ["The good feelings after taking a drug", "Physical and mental distress when an addict stops taking a drug", "The smell of a drug", "The cost of buying drugs"],
      "correctAnswer": "Physical and mental distress when an addict stops taking a drug",
      "difficulty": "moderate",
      "explanation": "Withdrawal occurs because the body has become dependent on the drug to function."
    },
    {
      "question": "Which of the following is a result of liver cirrhosis caused by alcohol?",
      "options": ["Stronger muscles", "Scarring of liver tissue and loss of liver function", "Clearer skin", "Improved digestion"],
      "correctAnswer": "Scarring of liver tissue and loss of liver function",
      "difficulty": "hard",
      "explanation": "Cirrhosis is the final stage of liver disease where healthy tissue is replaced by scar tissue."
    },
    {
      "question": "Situational Judgment: You see a friend being pressured to try an unknown pill at a party. What is the safest social response?",
      "options": ["Try it just once to be polite", "Firmly refuse and explain the dangers of unknown substances", "Hide the pill and pretend to take it", "Take half the pill to see what happens"],
      "correctAnswer": "Firmly refuse and explain the dangers of unknown substances",
      "difficulty": "easy",
      "type": "situational",
      "explanation": "Peer pressure should be met with firm refusal to protect one's health."
    },
    {
      "question": "Which factor describes 'Social Well-being'?",
      "options": ["Having a strong immune system", "Having good relationships and a sense of belonging in a community", "The absence of mental illness", "Being able to run a marathon"],
      "correctAnswer": "Having good relationships and a sense of belonging in a community",
      "difficulty": "moderate",
      "explanation": "Social well-being is about how we relate to others and the society around us."
    },
    {
      "question": "How does 'Health Education' help a community?",
      "options": ["By giving everyone free medicine", "By providing knowledge that helps people make healthy choices", "By building more roads", "By training everyone to be a doctor"],
      "correctAnswer": "By providing knowledge that helps people make healthy choices",
      "difficulty": "easy",
      "explanation": "Empowering people with information is a primary tool of preventive medicine."
    },
    {
      "question": "Identify the 'error' in this list of ways to maintain good health:",
      "options": [
        "Eating a balanced diet",
        "Engaging in regular physical exercise",
        "Using tobacco in moderation",
        "Ensuring adequate sleep"
      ],
      "correctAnswer": "Using tobacco in moderation",
      "difficulty": "easy",
      "type": "errorIdentification",
      "explanation": "There is no 'safe' or 'moderate' use of tobacco that contributes to good health; it is harmful in any amount."
    },
    {
      "question": "Which of these is a physical effect of 'Anabolic Steroids'?",
      "options": ["Weight loss", "Abnormal muscle growth and heart problems", "Improved vision", "Better sleep patterns"],
      "correctAnswer": "Abnormal muscle growth and heart problems",
      "difficulty": "hard",
      "explanation": "Anabolic steroids are often misused to increase muscle mass but have severe side effects."
    },
    {
      "question": "What is the role of 'Food Inspection' in public health?",
      "options": ["To make food taste better", "To ensure food is safe from pathogens and toxins before it reaches consumers", "To decide which foods are too expensive", "To cook for the community"],
      "correctAnswer": "To ensure food is safe from pathogens and toxins before it reaches consumers",
      "difficulty": "moderate",
      "explanation": "Inspections prevent outbreaks of foodborne illnesses."
    },
    {
      "question": "Which of the following describes 'Mental Health'?",
      "options": ["The size of the brain", "A state of well-being where an individual realizes their potential and can cope with stress", "Being happy all the time", "Never having any problems"],
      "correctAnswer": "A state of well-being where an individual realizes their potential and can cope with stress",
      "difficulty": "moderate",
      "explanation": "Mental health involves emotional and psychological resilience."
    },
    {
      "question": "Order the steps an individual should take if they realize they have a drug dependency:",
      "orderCorrect": ["Acknowledge the problem", "Seek professional medical help", "Join a support group", "Avoid environments where the drug is present"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Recovery begins with awareness followed by professional and community support."
    },
    {
      "question": "What is 'Emphysema'?",
      "options": ["A type of skin rash", "A lung condition where the air sacs (alveoli) are damaged, causing breathlessness", "A bacterial infection of the stomach", "High blood sugar levels"],
      "correctAnswer": "A lung condition where the air sacs (alveoli) are damaged, causing breathlessness",
      "difficulty": "hard",
      "explanation": "Commonly caused by smoking, it reduces the surface area for gas exchange."
    },
    {
      "question": "Case Study: A village has a high rate of diarrhea among children. Which action should the public health officer prioritize?",
      "options": ["Giving everyone vitamins", "Testing and treating the local water source", "Building a new playground", "Teaching the children how to read"],
      "correctAnswer": "Testing and treating the local water source",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Diarrheal diseases are frequently caused by contaminated water."
    },
    {
      "question": "The use of 'Analgesics' is to:",
      "options": ["Kill bacteria", "Relieve pain", "Prevent pregnancy", "Induce sleep"],
      "correctAnswer": "Relieve pain",
      "difficulty": "easy",
      "explanation": "Common analgesics include paracetamol and ibuprofen."
    },
    {
      "question": "Which of these is a symptom of 'Bronchitis'?",
      "options": ["Strong bones", "Inflammation of the bronchial tubes and a persistent cough", "Loss of hair", "Fractured ribs"],
      "correctAnswer": "Inflammation of the bronchial tubes and a persistent cough",
      "difficulty": "moderate",
      "explanation": "Bronchitis is often a result of irritation from smoke or infections."
    },
    {
      "question": "Why is 'Garbage Collection' essential for preventing the spread of disease?",
      "options": ["It makes the city look pretty", "It prevents the breeding of disease vectors like rats and flies", "It creates jobs", "It stops the wind from blowing"],
      "correctAnswer": "It prevents the breeding of disease vectors like rats and flies",
      "difficulty": "easy",
      "explanation": "Vectors thrive in uncollected waste and can carry pathogens to humans."
    },
    {
      "question": "Fill in the blank: _____ is a state of physical or mental dependence on a substance.",
      "options": ["Exercise", "Addiction", "Nutrition", "Hygiene"],
      "correctAnswer": "Addiction",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Addiction is a central theme in the study of drug abuse."
    },
    {
      "question": "What does 'STIs' stand for in health education?",
      "options": ["Socially Treated Illnesses", "Sexually Transmitted Infections", "Severe Tissue Injuries", "Standard Treatment Indicators"],
      "correctAnswer": "Sexually Transmitted Infections",
      "difficulty": "easy",
      "explanation": "STIs are infections spread through sexual contact."
    },
    {
      "question": "Which of the following is an effect of heroin on the body?",
      "options": ["Increased energy and focus", "Severe depression of the respiratory system and pain relief", "Stronger teeth", "Better memory"],
      "correctAnswer": "Severe depression of the respiratory system and pain relief",
      "difficulty": "hard",
      "explanation": "Heroin is an opioid that slows down vital functions, which can lead to death by overdose."
    }
  ],
  "Unit 17: Decision-making regarding sexual relationships": [
    {
      "question": "What is meant by the term 'Safe Sex'?",
      "options": ["Sexual activity only within marriage", "Sexual activity that reduces the risk of STIs and unplanned pregnancies", "Sexual activity without any physical contact", "Sexual activity only when using natural family planning"],
      "correctAnswer": "Sexual activity that reduces the risk of STIs and unplanned pregnancies",
      "difficulty": "easy",
      "explanation": "Safe sex involves practices and behaviors that protect individuals from infections and unintended conception."
    },
    {
      "question": "Which of the following is a 'Social' factor that may hinder the practice of safe sex?",
      "options": ["Lack of knowledge about biology", "Peer pressure and cultural taboos", "The cost of clinical procedures", "Genetic predisposition"],
      "correctAnswer": "Peer pressure and cultural taboos",
      "difficulty": "moderate",
      "explanation": "Social factors include the influence of friends, community expectations, and cultural beliefs that may discourage the use of protection."
    },
    {
      "question": "The concept of 'Dual Protection' refers to preventing:",
      "options": ["HIV and AIDS only", "Unplanned pregnancy and STIs (including HIV) simultaneously", "Two different types of STIs", "Pregnancy in two different partners"],
      "correctAnswer": "Unplanned pregnancy and STIs (including HIV) simultaneously",
      "difficulty": "easy",
      "explanation": "Dual protection is the use of methods or combinations of methods to address both reproductive health and infection risks at the same time."
    },
    {
      "question": "Which method is the most effective for providing dual protection in a single use?",
      "options": ["Birth control pills", "IUD", "Male or female condoms", "Withdrawal"],
      "correctAnswer": "Male or female condoms",
      "difficulty": "easy",
      "explanation": "Condoms act as a physical barrier that prevents both sperm and most pathogens from passing between partners."
    },
    {
      "question": "How can 'Gender Inequality' hinder the practice of safe sex?",
      "options": ["It makes condoms more expensive for women.", "It may prevent one partner from having the power to negotiate the use of protection.", "It only affects elderly people.", "It leads to better communication between partners."],
      "correctAnswer": "It may prevent one partner from having the power to negotiate the use of protection.",
      "difficulty": "moderate",
      "explanation": "In many societies, an imbalance of power means one partner (often the female) cannot insist on condom use without fear of conflict."
    },
    {
      "question": "Which of the following describes 'Abstinence' in the context of sexual health?",
      "options": ["Using two types of condoms", "Refraining from all sexual activity", "Using hormonal patches", "Having sex only during 'safe' days"],
      "correctAnswer": "Refraining from all sexual activity",
      "difficulty": "easy",
      "explanation": "Abstinence is the only 100% effective way to prevent both STIs and unplanned pregnancies."
    },
    {
      "question": "Why is 'Alcohol and Substance Abuse' considered a factor hindering safe sex?",
      "options": ["It makes condoms break more easily.", "It impairs judgment and reduces the likelihood of using protection.", "It increases the cost of contraceptives.", "It makes STIs more painful."],
      "correctAnswer": "It impairs judgment and reduces the likelihood of using protection.",
      "difficulty": "moderate",
      "explanation": "Substances lower inhibitions and affect the brain's decision-making ability, leading to higher-risk behaviors."
    },
    {
      "question": "A strategy involving the use of a hormonal contraceptive plus a condom is an example of:",
      "options": ["A mistake in family planning", "Dual protection strategy", "Ineffective protection", "Abstinence-plus"],
      "correctAnswer": "Dual protection strategy",
      "difficulty": "moderate",
      "explanation": "This 'double-barrel' approach ensures very high protection against pregnancy (hormonal) and protection against STIs (condom)."
    },
    {
      "question": "What role does 'Stigma' play in hindering safe sex practices?",
      "options": ["It makes it easier to talk to doctors.", "It may make individuals too embarrassed to buy or carry condoms.", "It provides more information about HIV.", "It encourages people to get tested frequently."],
      "correctAnswer": "It may make individuals too embarrassed to buy or carry condoms.",
      "difficulty": "moderate",
      "explanation": "Fear of being judged by others can prevent people from accessing the tools they need for safe sex."
    },
    {
      "question": "What is the primary benefit of 'Partner Communication' in a relationship?",
      "options": ["It guarantees no STIs will occur.", "It allows both partners to agree on and consistently use protection methods.", "It replaces the need for condoms.", "It makes the relationship last forever."],
      "correctAnswer": "It allows both partners to agree on and consistently use protection methods.",
      "difficulty": "easy",
      "explanation": "Open discussion about health and boundaries is key to effective decision-making and safety."
    },
    {
      "question": "True or False: Most STIs, including HIV, are always visible on a partner's body.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Many STIs are asymptomatic, meaning a person can look and feel healthy while still being able to transmit an infection."
    },
    {
      "question": "Which of these is a 'Cognitive' factor that might lead to unsafe sex?",
      "options": ["Lack of money to buy condoms", "The 'invulnerability myth' (thinking 'it won't happen to me')", "Living far from a clinic", "Strict religious laws"],
      "correctAnswer": "The 'invulnerability myth' (thinking 'it won't happen to me')",
      "difficulty": "hard",
      "explanation": "Cognitive factors relate to an individual's thought processes and perceptions of risk."
    },
    {
      "question": "How do 'Misconceptions' about contraceptives hinder safe sex?",
      "options": ["They provide accurate scientific data.", "False beliefs (e.g., that condoms cause infertility) may scare people away from using them.", "They make contraceptives more available in rural areas.", "They reduce the cost of healthcare."],
      "correctAnswer": "False beliefs (e.g., that condoms cause infertility) may scare people away from using them.",
      "difficulty": "moderate",
      "explanation": "Myths and rumors can be powerful deterrents to healthy decision-making."
    },
    {
      "question": "In the 'ABC' strategy for HIV prevention, what do the letters stand for?",
      "options": ["Always Be Careful", "Abstain, Be faithful, Condomize", "Avoid, Believe, Clean", "Action, Behavior, Control"],
      "correctAnswer": "Abstain, Be faithful, Condomize",
      "difficulty": "easy",
      "explanation": "This is a widely used public health framework for reducing the transmission of HIV."
    },
    {
      "question": "Which of the following is a biological factor that makes females more vulnerable to STIs during unprotected sex?",
      "options": ["They have less money.", "The larger surface area of the vaginal mucosa and potential for microscopic tears.", "They are generally shorter than males.", "They have a faster metabolism."],
      "correctAnswer": "The larger surface area of the vaginal mucosa and potential for microscopic tears.",
      "difficulty": "hard",
      "explanation": "Physiological differences mean that the risk of infection per act of unprotected sex is often higher for females."
    },
    {
      "question": "What is 'Negotiation' in a sexual relationship?",
      "options": ["Paying for sex", "The process of communicating and reaching an agreement on sexual health practices", "Arguing until one person gives up", "Ignoring the partner's wishes"],
      "correctAnswer": "The process of communicating and reaching an agreement on sexual health practices",
      "difficulty": "moderate",
      "explanation": "Effective negotiation involves respect, assertiveness, and mutual safety."
    },
    {
      "question": "Identify the 'error' in this list of dual protection methods:",
      "options": [
        "Consistent use of male condoms",
        "Abstinence",
        "Using a diaphragm without a condom",
        "Consistent use of female condoms"
      ],
      "correctAnswer": "Using a diaphragm without a condom",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "A diaphragm helps prevent pregnancy but provides little to no protection against most STIs, including HIV."
    },
    {
      "question": "Assertion: Testing for HIV is part of a safe sex decision-making process.\nReason: Knowing one's status helps in making informed decisions about protection and treatment.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Testing is a prerequisite for making truly informed choices in a relationship."
    },
    {
      "question": "Why is 'Poverty' a factor that hinders safe sex?",
      "options": ["Poor people don't care about health.", "It may limit access to education, clinics, and the ability to purchase condoms.", "It makes people immune to STIs.", "It only affects those living in cities."],
      "correctAnswer": "It may limit access to education, clinics, and the ability to purchase condoms.",
      "difficulty": "moderate",
      "explanation": "Economic barriers are significant obstacles to accessing reproductive health services."
    },
    {
      "question": "Which of these is a strategy for 'Risk Reduction' if a person is sexually active?",
      "options": ["Having multiple partners frequently", "Limiting the number of sexual partners and using condoms correctly every time", "Stopping the use of protection after one month", "Avoiding doctors"],
      "correctAnswer": "Limiting the number of sexual partners and using condoms correctly every time",
      "difficulty": "easy",
      "explanation": "Fewer partners and consistent barrier use significantly lower statistical risk."
    },
    {
      "question": "Select ALL that apply to female condoms:",
      "multiSelect": true,
      "options": [
        "They provide protection against STIs.",
        "They are controlled by the female partner.",
        "They are 100% effective even if they tear.",
        "They prevent pregnancy.",
        "They can be used at the same time as a male condom."
      ],
      "correctAnswer": ["They provide protection against STIs.", "They are controlled by the female partner.", "They prevent pregnancy."],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Using both male and female condoms simultaneously is not recommended as friction can cause both to break."
    },
    {
      "question": "What does 'Informed Consent' mean in a relationship?",
      "options": ["Doing what everyone else is doing", "Agreeing to an activity after being given all the facts and without being pressured", "Signing a legal contract every time", "Letting the older partner decide everything"],
      "correctAnswer": "Agreeing to an activity after being given all the facts and without being pressured",
      "difficulty": "moderate",
      "explanation": "Consent must be voluntary, specific, and based on an understanding of the risks and benefits."
    },
    {
      "question": "Which of the following is an example of 'Assertiveness' in safe sex?",
      "options": ["Being too shy to mention a condom", "Clearly stating 'I will only have sex if we use a condom'", "Allowing a partner to talk you out of using protection", "Getting angry and shouting"],
      "correctAnswer": "Clearly stating 'I will only have sex if we use a condom'",
      "difficulty": "moderate",
      "explanation": "Assertiveness is the ability to stand up for one's rights and health without being aggressive or passive."
    },
    {
      "question": "Fill in the blank: The practice of having only one sexual partner at a time who also only has you as a partner is called _____.",
      "options": ["Polygamy", "Mutual Monogamy", "Abstinence", "Isolation"],
      "correctAnswer": "Mutual Monogamy",
      "difficulty": "moderate",
      "type": "fillBlank",
      "explanation": "If both partners are uninfected and remain faithful, the risk of STIs is eliminated."
    },
    {
      "question": "Why is 'Early Marriage' often a factor hindering safe sex education?",
      "options": ["Married people don't need to know about safety.", "Younger individuals in such marriages may lack the maturity or power to negotiate safe practices.", "It makes clinics move further away.", "It increases the number of available condoms."],
      "correctAnswer": "Younger individuals in such marriages may lack the maturity or power to negotiate safe practices.",
      "difficulty": "hard",
      "explanation": "Age gaps and social pressures within early marriages can lead to reduced reproductive autonomy."
    },
    {
      "question": "What is the result of 'Correct and Consistent' condom use?",
      "options": ["It increases the chance of pregnancy.", "It highly reduces the risk of HIV transmission.", "It makes the condom break more often.", "It has no effect on STIs."],
      "correctAnswer": "It highly reduces the risk of HIV transmission.",
      "difficulty": "easy",
      "explanation": "Consistency (every time) and correctness (proper application) are vital for the effectiveness of condoms."
    },
    {
      "question": "Case Study: A young woman wants to use the 'Pill' for contraception but her partner refuses to use a condom because he 'trusts her'. What is the risk here?",
      "options": ["She will definitely get pregnant.", "She is protected against pregnancy but remains at risk for STIs/HIV.", "She is protected against everything.", "The Pill will stop working."],
      "correctAnswer": "She is protected against pregnancy but remains at risk for STIs/HIV.",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Trust is not a medical protection against pathogens; hormonal methods do not stop infections."
    },
    {
      "question": "What is a 'Barriers to Access' regarding safe sex?",
      "options": ["A high fence around a clinic", "Things that make it difficult for people to get condoms or health services (e.g., distance, cost, or lack of transport)", "Using a condom during sex", "A supportive family"],
      "correctAnswer": "Things that make it difficult for people to get condoms or health services (e.g., distance, cost, or lack of transport)",
      "difficulty": "easy",
      "explanation": "Environmental and economic barriers prevent people from acting on their safe-sex decisions."
    },
    {
      "question": "Which of these is a myth that hinders safe sex?",
      "options": ["Condoms can prevent HIV.", "You can get pregnant the first time you have sex.", "Washing after sex prevents pregnancy and STIs.", "STIs can lead to infertility."],
      "correctAnswer": "Washing after sex prevents pregnancy and STIs.",
      "difficulty": "moderate",
      "explanation": "Washing or douching does not prevent pregnancy or infections and may actually increase the risk of some infections."
    },
    {
      "question": "Order the steps of a healthy decision-making process for sexual health:",
      "orderCorrect": ["Identify the situation", "Gather accurate information", "Consider the consequences", "Make a choice based on values and safety", "Evaluate the outcome"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "A systematic approach helps individuals avoid impulsive, high-risk choices."
    },
    {
      "question": "What is 'Secondary Abstinence'?",
      "options": ["Abstaining from sex after having been sexually active in the past", "Using two condoms at once", "Only having sex on weekends", "Waiting until marriage to have a second child"],
      "correctAnswer": "Abstaining from sex after having been sexually active in the past",
      "difficulty": "moderate",
      "explanation": "It is always possible to choose to stop being sexually active to protect one's health and future."
    },
    {
      "question": "Situational Judgment: If a condom breaks during sex, what should the individuals do?",
      "options": ["Ignore it and continue.", "Seek medical advice immediately regarding Emergency Contraception and PEP (Post-Exposure Prophylaxis) for HIV.", "Wait a month to see if symptoms appear.", "Take an aspirin."],
      "correctAnswer": "Seek medical advice immediately regarding Emergency Contraception and PEP (Post-Exposure Prophylaxis) for HIV.",
      "difficulty": "hard",
      "type": "situational",
      "explanation": "Immediate medical intervention can significantly reduce the risk of both pregnancy and HIV after a barrier failure."
    },
    {
      "question": "Which of these is an example of 'Positive Peer Pressure'?",
      "options": ["Friends encouraging you to drink alcohol", "Friends supporting your decision to remain abstinent or use protection", "Friends making fun of you for being safe", "Friends telling you to ignore your parents"],
      "correctAnswer": "Friends supporting your decision to remain abstinent or use protection",
      "difficulty": "easy",
      "explanation": "Peer groups can be a powerful force for promoting healthy and safe behaviors."
    },
    {
      "question": "How does 'Life Skills Education' contribute to safe sex?",
      "options": ["It teaches how to fix cars.", "It develops skills like negotiation, critical thinking, and self-esteem to make healthy choices.", "It only teaches about plants.", "It encourages people to take more risks."],
      "correctAnswer": "It develops skills like negotiation, critical thinking, and self-esteem to make healthy choices.",
      "difficulty": "moderate",
      "explanation": "Knowledge alone is often not enough; people need the social and emotional skills to apply that knowledge."
    },
    {
      "question": "What is the 'window period' in HIV testing?",
      "options": ["The time when you can see through a clinic window.", "The time it takes for a person to get sick.", "The time after infection when a test might still show a negative result.", "The time when HIV is cured."],
      "correctAnswer": "The time after infection when a test might still show a negative result.",
      "difficulty": "hard",
      "explanation": "It takes time for the body to produce enough antibodies or for the virus to be detectable, so re-testing is often necessary."
    },
    {
      "question": "True or False: Using a condom means you don't 'trust' or 'love' your partner.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Using protection is a sign of respect and care for the health and well-being of both oneself and one's partner."
    },
    {
      "question": "Which of the following is NOT a reliable source of sexual health information?",
      "options": ["A medical doctor", "School health curriculum", "Unverified social media posts", "Public health brochures"],
      "correctAnswer": "Unverified social media posts",
      "difficulty": "easy",
      "explanation": "Always seek information from qualified medical or educational professionals."
    },
    {
      "question": "What is the primary risk of 'Serial Monogamy' (having one partner at a time, but many over a lifetime)?",
      "options": ["It is illegal.", "It creates a 'network' of partners that can still spread STIs if protection is not used.", "It makes you immune to STIs.", "It is the same as abstinence."],
      "correctAnswer": "It creates a 'network' of partners that can still spread STIs if protection is not used.",
      "difficulty": "moderate",
      "explanation": "Even if only one partner is present at a time, the cumulative risk increases with each new partner if safe sex is not practiced."
    },
    {
      "question": "How can 'Religious Beliefs' influence safe sex decisions?",
      "options": ["They have no influence.", "They can provide a moral framework for abstinence but may sometimes limit discussion on contraceptive use.", "They make HIV disappear.", "They only affect elderly people."],
      "correctAnswer": "They can provide a moral framework for abstinence but may sometimes limit discussion on contraceptive use.",
      "difficulty": "moderate",
      "explanation": "Religion is a significant cultural factor that shapes individual values and health behaviors."
    },
    {
      "question": "What is 'Assertive Communication'?",
      "options": ["Shouting at your partner to get your way", "Expressing your needs and boundaries clearly and respectfully", "Saying nothing and hoping for the best", "Manipulating your partner"],
      "correctAnswer": "Expressing your needs and boundaries clearly and respectfully",
      "difficulty": "moderate",
      "explanation": "This is a critical life skill for negotiating safe sex."
    },
    {
      "question": "Why is 'Vaginal Douching' discouraged after sex?",
      "options": ["It is too expensive.", "It can push bacteria/sperm further up and irritate the vaginal lining, increasing infection risk.", "It makes the woman too fertile.", "It is a 100% effective contraceptive."],
      "correctAnswer": "It can push bacteria/sperm further up and irritate the vaginal lining, increasing infection risk.",
      "difficulty": "hard",
      "explanation": "Douching disrupts the natural balance of bacteria and can lead to infections like BV or PID."
    },
    {
      "question": "Which of these is a consequence of 'Unplanned Pregnancy' for a teenager?",
      "options": ["Earlier graduation from school", "Potential interruption of education and increased economic stress", "Better physical health", "Lower risk of STIs"],
      "correctAnswer": "Potential interruption of education and increased economic stress",
      "difficulty": "easy",
      "explanation": "Teenage pregnancy often has significant social and economic impacts on the young parent's future."
    },
    {
      "question": "The 'Correct' way to use a male condom includes:",
      "options": ["Using it twice to save money", "Leaving a space at the tip for semen", "Applying it after sexual contact has already begun", "Using oil-based lubricants like Vaseline"],
      "correctAnswer": "Leaving a space at the tip for semen",
      "difficulty": "moderate",
      "explanation": "Oil-based lubricants weaken latex; condoms must be used from start to finish and handled carefully to prevent breakage."
    },
    {
      "question": "What does 'Self-Efficacy' mean in health behavior?",
      "options": ["The ability to buy drugs", "An individual's belief in their own ability to successfully practice safe sex or refuse unwanted sex", "Being selfish in a relationship", "The speed of one's metabolism"],
      "correctAnswer": "An individual's belief in their own ability to successfully practice safe sex or refuse unwanted sex",
      "difficulty": "hard",
      "explanation": "High self-efficacy is a strong predictor of whether a person will actually use a condom or say 'no' to risky situations."
    },
    {
      "question": "Which of these factors is MOST likely to lead to the 'consistent' use of safe sex practices?",
      "options": ["Fear of punishment", "High levels of health literacy and self-esteem", "Luck", "Occasional advice from friends"],
      "correctAnswer": "High levels of health literacy and self-esteem",
      "difficulty": "moderate",
      "explanation": "People who value themselves and understand the risks are more likely to protect their health consistently."
    }
  ],
  "Unit 18: HIV and AIDS (stigma, treatment, care and support)": [
    {
      "question": "What does the acronym PLHIV stand for?",
      "options": ["People Living with Human Viruses", "People Living with HIV", "Prevention of Low Immune Viruses", "Public Loss of Health in Villages"],
      "correctAnswer": "People Living with HIV",
      "difficulty": "easy",
      "explanation": "PLHIV is the standard term used to refer to individuals who are infected with the Human Immunodeficiency Virus."
    },
    {
      "question": "Which of the following is a fundamental human right for PLHIV?",
      "options": ["The right to be isolated from others", "The right to health and medical care", "The right to hide their status from a doctor", "The right to travel only to certain countries"],
      "correctAnswer": "The right to health and medical care",
      "difficulty": "easy",
      "explanation": "Everyone, regardless of their HIV status, has the right to the highest attainable standard of physical and mental health."
    },
    {
      "question": "What is meant by the 'Right to Confidentiality' for a person living with HIV?",
      "options": ["The right to keep their status secret from everyone, including themselves", "The right to have their medical information protected and shared only with consent", "The right to work without anyone knowing their name", "The right to receive free food"],
      "correctAnswer": "The right to have their medical information protected and shared only with consent",
      "difficulty": "moderate",
      "explanation": "Confidentiality ensures that medical records and HIV status are not disclosed to third parties without the individual's permission."
    },
    {
      "question": "Discrimination against PLHIV in the workplace, such as firing someone because of their status, is:",
      "options": ["Acceptable if they work in a kitchen", "A violation of human rights and labor laws", "Necessary to protect other employees", "Legal in most countries"],
      "correctAnswer": "A violation of human rights and labor laws",
      "difficulty": "easy",
      "explanation": "Laws protect PLHIV from unfair dismissal or refusal of employment based on their HIV status."
    },
    {
      "question": "What is 'Positive Living' for a person with HIV?",
      "options": ["Pretending the virus does not exist", "Adopting a healthy lifestyle and taking medication to live a long, productive life", "Only interacting with other people who have HIV", "Waiting for a cure without taking any action"],
      "correctAnswer": "Adopting a healthy lifestyle and taking medication to live a long, productive life",
      "difficulty": "moderate",
      "explanation": "Positive living involves adherence to treatment, good nutrition, exercise, and maintaining a positive mental attitude."
    },
    {
      "question": "What is the primary purpose of Antiretroviral Therapy (ART)?",
      "options": ["To cure HIV completely", "To suppress the virus and prevent it from damaging the immune system", "To make the person immune to other diseases", "To change the person's DNA"],
      "correctAnswer": "To suppress the virus and prevent it from damaging the immune system",
      "difficulty": "moderate",
      "explanation": "While ART is not a cure, it reduces the viral load to undetectable levels, allowing the immune system to recover."
    },
    {
      "question": "A support group for PLHIV is beneficial because it provides:",
      "options": ["Financial loans for everyone", "Emotional support and shared experiences with others in a similar situation", "Secret medicines that are not in hospitals", "A way to avoid going to work"],
      "correctAnswer": "Emotional support and shared experiences with others in a similar situation",
      "difficulty": "easy",
      "explanation": "Support groups help reduce isolation and provide a platform for learning about treatment adherence and coping mechanisms."
    },
    {
      "question": "What does the term 'Stigma' refer to in the context of HIV and AIDS?",
      "options": ["The medical symptoms of the disease", "Negative attitudes and beliefs directed at people living with HIV", "The cost of medication", "The way the virus reproduces in the blood"],
      "correctAnswer": "Negative attitudes and beliefs directed at people living with HIV",
      "difficulty": "moderate",
      "explanation": "Stigma involves prejudice and devaluation of people because they are perceived to have a certain condition."
    },
    {
      "question": "How does HIV-related stigma affect the fight against the epidemic?",
      "options": ["It makes the virus spread slower.", "It may prevent people from getting tested or seeking treatment for fear of judgment.", "It encourages people to be more careful.", "It has no effect on public health."],
      "correctAnswer": "It may prevent people from getting tested or seeking treatment for fear of judgment.",
      "difficulty": "moderate",
      "explanation": "Stigma creates a barrier to prevention and care services, making the epidemic harder to control."
    },
    {
      "question": "Which of these is an example of 'Institutional Discrimination'?",
      "options": ["A family member being sad about a diagnosis", "A hospital refusing to treat a patient because they are HIV positive", "A person deciding to start ART", "Talking to a friend about HIV"],
      "correctAnswer": "A hospital refusing to treat a patient because they are HIV positive",
      "difficulty": "moderate",
      "explanation": "Institutional discrimination occurs when organizations or systems have policies or practices that unfairly exclude or harm a specific group."
    },
    {
      "question": "True or False: HIV can be transmitted by sharing a meal or shaking hands with a PLHIV.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "HIV is not transmitted through casual social contact; it requires exchange of specific body fluids like blood or semen."
    },
    {
      "question": "What is 'Self-stigma' (Internalized stigma)?",
      "options": ["Stigma from the government", "When a person with HIV starts to believe the negative things said about them and feels shame", "When a person refuses to take medicine", "When a doctor shares private records"],
      "correctAnswer": "When a person with HIV starts to believe the negative things said about them and feels shame",
      "difficulty": "hard",
      "explanation": "Internalized stigma can lead to depression, low self-esteem, and poor adherence to medical treatment."
    },
    {
      "question": "Which document protects the rights of PLHIV in Rwanda?",
      "options": ["The Constitution of Rwanda", "The school rule book", "The driver's manual", "The local newspaper"],
      "correctAnswer": "The Constitution of Rwanda",
      "difficulty": "moderate",
      "explanation": "The Constitution and specific laws against discrimination protect all citizens, including those with HIV."
    },
    {
      "question": "What is 'Treatment Adherence'?",
      "options": ["Buying medicine and keeping it in a cupboard", "Taking HIV medication exactly as prescribed by a health worker", "Taking medicine only when you feel sick", "Giving your medicine to a friend"],
      "correctAnswer": "Taking HIV medication exactly as prescribed by a health worker",
      "difficulty": "moderate",
      "explanation": "Adherence is crucial to prevent drug resistance and keep the viral load suppressed."
    },
    {
      "question": "Why is 'Nutrition' a key component of positive living for PLHIV?",
      "options": ["Because medicine only works if you eat meat.", "A balanced diet helps strengthen the immune system and manage side effects of ART.", "It makes the virus disappear.", "Food is more important than medicine."],
      "correctAnswer": "A balanced diet helps strengthen the immune system and manage side effects of ART.",
      "difficulty": "moderate",
      "explanation": "Good nutrition supports the body's ability to fight opportunistic infections."
    },
    {
      "question": "What is an 'Opportunistic Infection' (OI)?",
      "options": ["An infection that only happens in the summer", "An infection that takes advantage of a weakened immune system", "An infection caused by the HIV virus itself", "A fake infection"],
      "correctAnswer": "An infection that takes advantage of a weakened immune system",
      "difficulty": "hard",
      "explanation": "Common OIs include tuberculosis (TB) and certain types of pneumonia that healthy immune systems can usually fight off."
    },
    {
      "question": "Which of the following is a way to promote 'Non-discrimination' in a community?",
      "options": ["Segregating PLHIV in separate housing", "Educating the public on how HIV is and is not transmitted", "Marking the houses of people with HIV", "Ignoring people with HIV"],
      "correctAnswer": "Educating the public on how HIV is and is not transmitted",
      "difficulty": "easy",
      "explanation": "Knowledge is the most effective tool for dismantling the fear and myths that drive discrimination."
    },
    {
      "question": "What is 'Sexuality Education' in the context of HIV programs?",
      "options": ["Teaching people how to have more partners", "Providing age-appropriate information about reproduction, relationships, and HIV prevention", "A program to discourage marriage", "Instruction on how to hide one's status"],
      "correctAnswer": "Providing age-appropriate information about reproduction, relationships, and HIV prevention",
      "difficulty": "moderate",
      "explanation": "Comprehensive sexuality education empowers youth to make informed, safe choices."
    },
    {
      "question": "Assertion: PLHIV can live a long and healthy life.\nReason: Modern Antiretroviral (ARV) drugs can suppress the virus to levels that allow the immune system to function nearly normally.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "With proper treatment, HIV is managed as a chronic condition rather than a death sentence."
    },
    {
      "question": "Identify the incorrect statement regarding the rights of PLHIV:",
      "options": [
        "They have the right to marry and found a family.",
        "They have the right to equal education opportunities.",
        "They have the right to infect others if they wish.",
        "They have the right to be free from torture or degrading treatment."
      ],
      "correctAnswer": "They have the right to infect others if they wish.",
      "difficulty": "easy",
      "type": "errorIdentification",
      "explanation": "Rights are balanced with responsibilities; knowingly exposing others to HIV is often a legal offense."
    },
    {
      "question": "What does 'GIPA' stand for in HIV programs?",
      "options": ["Greater Involvement of People Living with HIV/AIDS", "Global Initiative for Public Awareness", "Government Intervention for Patient Aid", "General Immunity Protection Association"],
      "correctAnswer": "Greater Involvement of People Living with HIV/AIDS",
      "difficulty": "hard",
      "explanation": "GIPA is a principle that ensures PLHIV are involved in the design and delivery of programs that affect them."
    },
    {
      "question": "A person with an 'Undetectable' viral load:",
      "options": ["Is cured of HIV.", "Cannot transmit the virus to a sexual partner (U=U).", "Does not need to take any more medicine.", "Has a broken immune system."],
      "correctAnswer": "Cannot transmit the virus to a sexual partner (U=U).",
      "difficulty": "hard",
      "explanation": "The 'Undetectable = Untransmittable' campaign highlights that effective ART prevents sexual transmission."
    },
    {
      "question": "Select ALL that are essential for 'Positive Living':",
      "multiSelect": true,
      "options": [
        "Adhering to ART",
        "Avoiding all exercise",
        "Eating a balanced diet",
        "Practicing safe sex",
        "Drinking large amounts of alcohol"
      ],
      "correctAnswer": ["Adhering to ART", "Eating a balanced diet", "Practicing safe sex"],
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "Alcohol and lack of exercise can weaken the body's ability to stay healthy with HIV."
    },
    {
      "question": "What is the role of 'Home-Based Care' (HBC)?",
      "options": ["Providing care and support to sick individuals in their own homes", "A way for hospitals to avoid treating patients", "Selling food to neighbors", "A type of prison for PLHIV"],
      "correctAnswer": "Providing care and support to sick individuals in their own homes",
      "difficulty": "moderate",
      "explanation": "HBC involves families and community volunteers providing physical and emotional care."
    },
    {
      "question": "How can a teacher support a student known to be living with HIV?",
      "options": ["By telling all the other students to be careful around them", "By ensuring the student's confidentiality and protecting them from bullying", "By giving them easier tests", "By making them sit at the back of the class"],
      "correctAnswer": "By ensuring the student's confidentiality and protecting them from bullying",
      "difficulty": "easy",
      "explanation": "Teachers play a critical role in creating a supportive, non-discriminatory school environment."
    },
    {
      "question": "What is the meaning of 'Social Support' for PLHIV?",
      "options": ["Giving someone money once a year", "The network of family, friends, and community that provides care and encouragement", "Being told what to do by the government", "Using social media to post status updates"],
      "correctAnswer": "The network of family, friends, and community that provides care and encouragement",
      "difficulty": "easy",
      "explanation": "Social support is vital for mental health and staying motivated to continue treatment."
    },
    {
      "question": "Which of these is a 'Legal Redress' for someone who has been discriminated against due to their HIV status?",
      "options": ["Fighting the person who discriminated", "Taking the case to a court of law or human rights commission", "Quitting their job and hiding", "Writing a letter to a friend"],
      "correctAnswer": "Taking the case to a court of law or human rights commission",
      "difficulty": "moderate",
      "explanation": "Legal systems provide mechanisms to challenge and correct human rights violations."
    },
    {
      "question": "What is 'Peer Education' in HIV/AIDS programs?",
      "options": ["When teachers learn from books", "When people of a similar age or background teach and support each other", "When parents teach their children", "When doctors talk to patients"],
      "correctAnswer": "When people of a similar age or background teach and support each other",
      "difficulty": "moderate",
      "explanation": "Peer education is often more effective because there is a shared level of trust and understanding."
    },
    {
      "question": "True or False: A woman living with HIV can have a healthy, HIV-negative baby.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "With PMTCT (Prevention of Mother-to-Child Transmission) services, the risk of transmission can be reduced to less than 5%."
    },
    {
      "question": "The 'Red Ribbon' is a global symbol for:",
      "options": ["Victory in war", "Solidarity with PLHIV and commitment to fighting HIV/AIDS", "Blood donation", "The Red Cross"],
      "correctAnswer": "Solidarity with PLHIV and commitment to fighting HIV/AIDS",
      "difficulty": "easy",
      "explanation": "It is worn to show awareness and support for people living with the virus."
    },
    {
      "question": "Order the steps an individual should take if they think they have been exposed to HIV:",
      "orderCorrect": ["Go to a clinic immediately", "Seek Post-Exposure Prophylaxis (PEP) within 72 hours", "Get tested and counselled", "Follow up with further tests after a few months"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Immediate action (PEP) is vital to preventing the virus from establishing an infection."
    },
    {
      "question": "Situational Judgment: You hear classmates making jokes about a student they suspect has AIDS. What is the best course of action?",
      "options": ["Join in the joke so you don't get bullied too", "Ignore it because it's not your business", "Speak up against the jokes and report the bullying to a teacher", "Tell the student to leave the school"],
      "correctAnswer": "Speak up against the jokes and report the bullying to a teacher",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Challenging stigma and bullying is necessary to maintain a safe and inclusive environment."
    },
    {
      "question": "What is 'Pre-exposure Prophylaxis' (PrEP)?",
      "options": ["Medicine taken after sex", "Medicine taken daily by HIV-negative people at high risk to prevent infection", "A type of vaccine", "The name of a support group"],
      "correctAnswer": "Medicine taken daily by HIV-negative people at high risk to prevent infection",
      "difficulty": "hard",
      "explanation": "PrEP is a highly effective prevention tool for individuals who do not have HIV but are at high risk."
    },
    {
      "question": "Case Study: A man is denied a bank loan because he disclosed he is on ART. This is an example of:",
      "options": ["A smart business decision", "Social stigma", "Economic discrimination", "Treatment failure"],
      "correctAnswer": "Economic discrimination",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "Denying financial services based on health status is a form of unfair discrimination."
    },
    {
      "question": "Why is it important to include 'Youth' in HIV programs?",
      "options": ["Because they are the only ones who get the virus.", "Because they are often at higher risk and are the leaders of the future.", "Because they have more time than adults.", "Because they like ribbons."],
      "correctAnswer": "Because they are often at higher risk and are the leaders of the future.",
      "difficulty": "easy",
      "explanation": "Empowering youth with knowledge ensures the next generation is equipped to end the epidemic."
    },
    {
      "question": "What is the function of the 'CD4 Count' test?",
      "options": ["To see how many viruses are in the blood", "To measure the strength of the immune system", "To check the person's blood type", "To see if the person has malaria"],
      "correctAnswer": "To measure the strength of the immune system",
      "difficulty": "moderate",
      "explanation": "CD4 cells are white blood cells that HIV attacks; the count shows how much damage the virus has done."
    },
    {
      "question": "Which of these is a 'Vulnerable Group' in the context of the HIV epidemic?",
      "options": ["Wealthy businessmen", "Orphans, street children, and refugees", "People who live near hospitals", "Professional athletes"],
      "correctAnswer": "Orphans, street children, and refugees",
      "difficulty": "moderate",
      "explanation": "Groups with less social protection and economic power are often more susceptible to infection and stigma."
    },
    {
      "question": "Fill in the blank: _____ is the act of treating people differently or unfairly based on their HIV status.",
      "options": ["Care", "Discrimination", "Prevention", "Support"],
      "correctAnswer": "Discrimination",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Discrimination is the outward action based on inward stigma."
    },
    {
      "question": "What is 'Psychological Support' for PLHIV?",
      "options": ["Giving them a gym membership", "Providing counseling to help manage stress, anxiety, and depression", "Telling them to stop being sad", "Forcing them to talk in front of a crowd"],
      "correctAnswer": "Providing counseling to help manage stress, anxiety, and depression",
      "difficulty": "moderate",
      "explanation": "Emotional well-being is as important as physical health for someone living with a chronic illness."
    },
    {
      "question": "How does 'Poverty' intersect with HIV/AIDS?",
      "options": ["It makes the medicine taste bad.", "It can make it harder for patients to afford transport to clinics or buy nutritious food.", "It cures the disease.", "It has no relationship to health."],
      "correctAnswer": "It can make it harder for patients to afford transport to clinics or buy nutritious food.",
      "difficulty": "moderate",
      "explanation": "Economic hardship can interfere with a person's ability to remain in care and adhere to treatment."
    },
    {
      "question": "What is the primary message of 'World AIDS Day' (December 1st)?",
      "options": ["To celebrate the end of the virus", "To raise awareness, show support for PLHIV, and remember those who have died", "To give everyone a day off from work", "To sell medical equipment"],
      "correctAnswer": "To raise awareness, show support for PLHIV, and remember those who have died",
      "difficulty": "easy",
      "explanation": "It is an international day dedicated to raising awareness of the AIDS pandemic."
    },
    {
      "question": "True or False: A person living with HIV should avoid all physical contact with children.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "HIV is not transmitted by hugging, kissing, or caring for children. PLHIV can be excellent parents and caregivers."
    },
    {
      "question": "Which of these is a way that a community can show 'Solidarity' with PLHIV?",
      "options": ["By making them live in a separate part of town", "By including them in all community events and social activities", "By talking about them behind their backs", "By refusing to eat food they have cooked"],
      "correctAnswer": "By including them in all community events and social activities",
      "difficulty": "easy",
      "explanation": "Inclusion and support are the opposite of stigma and discrimination."
    },
    {
      "question": "What happens if a person on ART stops taking their pills for a long time?",
      "options": ["They get better naturally.", "The virus can become resistant to the drugs, and their health will decline.", "Nothing happens if they were already healthy.", "The drugs stay in the blood forever."],
      "correctAnswer": "The virus can become resistant to the drugs, and their health will decline.",
      "difficulty": "hard",
      "explanation": "Interrupted treatment allows the virus to mutate and multiply, leading to treatment failure."
    },
    {
      "question": "Why is 'Empowerment' important for women living with HIV?",
      "options": ["So they can buy more clothes.", "To help them have the confidence and power to access health services and protect their rights.", "Because they are the only ones who need help.", "To make them look like men."],
      "correctAnswer": "To help them have the confidence and power to access health services and protect their rights.",
      "difficulty": "moderate",
      "explanation": "Empowerment addresses the gender-based inequalities that often worsen the impact of HIV."
    },
    {
      "question": "Which of these is NOT a myth about HIV?",
      "options": ["Mosquitoes can spread HIV.", "Curing HIV is possible with herbal tea.", "HIV is a death sentence in the modern era.", "PLHIV on effective treatment can have a near-normal life expectancy."],
      "correctAnswer": "PLHIV on effective treatment can have a near-normal life expectancy.",
      "difficulty": "moderate",
      "explanation": "This is a fact; modern medicine has transformed HIV from a fatal illness into a manageable chronic condition."
    }
  ],
  "Unit 19: Sexual behaviour and sexual response": [
    {
      "question": "What is the primary characteristic of 'Consensual Sex'?",
      "options": ["It happens within a marriage.", "Both partners give clear, voluntary, and informed agreement.", "It is done for the purpose of procreation.", "One partner eventually gives in to pressure."],
      "correctAnswer": "Both partners give clear, voluntary, and informed agreement.",
      "difficulty": "easy",
      "explanation": "Consent must be enthusiastic, specific, and can be withdrawn at any time."
    },
    {
      "question": "Which of the following is considered a 'High-Risk' sexual behaviour for HIV transmission?",
      "options": ["Hugging and kissing", "Mutual masturbation without broken skin", "Unprotected vaginal or anal intercourse", "Sharing a toilet seat"],
      "correctAnswer": "Unprotected vaginal or anal intercourse",
      "difficulty": "easy",
      "explanation": "Unprotected penetrative sex allows for the exchange of bodily fluids that carry high concentrations of the HIV virus."
    },
    {
      "question": "What is the most effective way to prevent both unintended pregnancy and STIs during sexual activity?",
      "options": ["Using the withdrawal method", "Calculating the menstrual cycle 'safe' days", "Consistent and correct use of condoms", "Using hormonal birth control pills alone"],
      "correctAnswer": "Consistent and correct use of condoms",
      "difficulty": "easy",
      "explanation": "Condoms are the only method that provides dual protection against both pathogens and sperm."
    },
    {
      "question": "Which communication skill is most vital for ensuring safe and consensual sex?",
      "options": ["Passive listening", "Assertive communication of boundaries", "Aggressive negotiation", "Silent assumption of agreement"],
      "correctAnswer": "Assertive communication of boundaries",
      "difficulty": "moderate",
      "explanation": "Being able to clearly state what you are and are not comfortable with is essential for sexual health and safety."
    },
    {
      "question": "The 'Sexual Response Cycle' generally consists of which four phases in order?",
      "options": ["Excitement, Plateau, Orgasm, Resolution", "Arousal, Climax, Sleep, Recovery", "Desire, Action, Plateau, End", "Excitement, Orgasm, Plateau, Resolution"],
      "correctAnswer": "Excitement, Plateau, Orgasm, Resolution",
      "difficulty": "hard",
      "explanation": "This model describes the physiological changes the body undergoes during sexual activity."
    },
    {
      "question": "Which of these is a barrier to effective communication about sexual health?",
      "options": ["High self-esteem", "Cultural taboos and embarrassment", "Mutual respect", "Accurate medical knowledge"],
      "correctAnswer": "Cultural taboos and embarrassment",
      "difficulty": "moderate",
      "explanation": "Shame or fear of judgment often prevents individuals from discussing protection or status with their partners."
    },
    {
      "question": "What does 'Withdrawal' (Coitus Interruptus) involve?",
      "options": ["Using a condom", "Pulling the penis out of the vagina before ejaculation", "Abstaining from sex for one month", "Using emergency contraception"],
      "correctAnswer": "Pulling the penis out of the vagina before ejaculation",
      "difficulty": "moderate",
      "explanation": "Withdrawal is highly unreliable because pre-ejaculatory fluid can contain sperm."
    },
    {
      "question": "Emergency Contraceptive Pills (ECPs) are most effective when taken within how many hours of unprotected sex?",
      "options": ["12 hours", "72 hours", "1 week", "2 weeks"],
      "correctAnswer": "72 hours",
      "difficulty": "moderate",
      "explanation": "Commonly known as the 'morning-after pill', efficacy decreases as time passes."
    },
    {
      "question": "Which of the following describes 'Abstinence'?",
      "options": ["Having sex only once a year", "Refraining from all forms of sexual intercourse", "Using only natural family planning", "Having only one partner"],
      "correctAnswer": "Refraining from all forms of sexual intercourse",
      "difficulty": "easy",
      "explanation": "Abstinence is the only foolproof method to prevent STIs and pregnancy."
    },
    {
      "question": "What is 'Sexual Harassment'?",
      "options": ["Mutual flirting", "Unwanted sexual advances or remarks that cause discomfort or fear", "Consensual physical contact", "Asking someone for their name"],
      "correctAnswer": "Unwanted sexual advances or remarks that cause discomfort or fear",
      "difficulty": "easy",
      "explanation": "Harassment is a violation of personal boundaries and is often illegal."
    },
    {
      "question": "How does alcohol consumption affect sexual decision-making?",
      "options": ["It makes people more responsible.", "It improves physical performance.", "It impairs judgment and increases the likelihood of risky, unprotected sex.", "It prevents the transmission of STIs."],
      "correctAnswer": "It impairs judgment and increases the likelihood of risky, unprotected sex.",
      "difficulty": "moderate",
      "explanation": "Alcohol lowers inhibitions, making individuals less likely to use condoms or negotiate consent properly."
    },
    {
      "question": "The presence of a 'Sore' or 'Ulcer' on the genitals increases the risk of HIV infection because:",
      "options": ["It makes the person more attractive.", "It provides an easy entry point for the virus into the bloodstream.", "The sore contains the HIV virus.", "It makes the immune system stronger."],
      "correctAnswer": "It provides an easy entry point for the virus into the bloodstream.",
      "difficulty": "hard",
      "explanation": "STIs that cause skin breakage act as gateways for other bloodborne pathogens."
    },
    {
      "question": "True or False: Consent given once means consent is automatically given for all future sexual acts.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Consent is continuous and must be obtained for every specific instance of sexual activity."
    },
    {
      "question": "Which of these is a sign of a 'Healthy' sexual relationship?",
      "options": ["One partner makes all the decisions.", "Pressure to perform acts you are uncomfortable with.", "Open communication and mutual respect for boundaries.", "Keeping secrets about sexual health history."],
      "correctAnswer": "Open communication and mutual respect for boundaries.",
      "difficulty": "easy",
      "explanation": "Health is defined by safety, honesty, and mutual agreement."
    },
    {
      "question": "What is 'Secondary Abstinence'?",
      "options": ["Having sex without a condom", "Deciding to stop having sex after a period of sexual activity", "Having a second sexual partner", "Using two forms of birth control"],
      "correctAnswer": "Deciding to stop having sex after a period of sexual activity",
      "difficulty": "moderate",
      "explanation": "It is a choice often made to focus on goals or wait for a committed relationship."
    },
    {
      "question": "Which method of protection is highly dependent on the 'User's consistency'?",
      "options": ["IUD", "Male Condom", "Hormonal Implant", "Sterilization"],
      "correctAnswer": "Male Condom",
      "difficulty": "moderate",
      "explanation": "Unlike long-acting methods, condoms must be used correctly every single time to be effective."
    },
    {
      "question": "Identify the 'error' in the list of ways HIV is NOT transmitted:",
      "options": ["Sitting next to a PLHIV", "Mosquito bites", "Sharing needles", "Using the same drinking glass"],
      "correctAnswer": "Sharing needles",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Sharing needles is a very high-risk activity for HIV transmission."
    },
    {
      "question": "What does 'Sexual Response' refer to?",
      "options": ["Writing a letter about sex", "The body's physiological and emotional reactions to sexual stimulation", "Answering questions in a biology test", "The act of getting married"],
      "correctAnswer": "The body's physiological and emotional reactions to sexual stimulation",
      "difficulty": "moderate",
      "explanation": "It involves changes in blood flow, muscle tension, and hormone levels."
    },
    {
      "question": "Assertion: Communication is as important as a condom in preventing STIs.\nReason: Without communication, partners cannot agree on testing or the use of protection.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Social and verbal skills are the foundation of physical safety."
    },
    {
      "question": "Select ALL methods that provide protection against BOTH pregnancy and HIV:",
      "multiSelect": true,
      "options": ["Abstinence", "Birth control pills", "Male Condoms", "Female Condoms", "Vasectomy"],
      "correctAnswer": ["Abstinence", "Male Condoms", "Female Condoms"],
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "The 'Pill' and Vasectomy do not protect against HIV."
    },
    {
      "question": "In the 'Excitement' phase of the sexual response cycle, what occurs in both males and females?",
      "options": ["Ejaculation", "Muscle relaxation", "Increased heart rate and blood flow to genitals", "Decrease in breathing rate"],
      "correctAnswer": "Increased heart rate and blood flow to genitals",
      "difficulty": "hard",
      "explanation": "Vasocongestion is the primary physical change during the arousal stage."
    },
    {
      "question": "What is the 'Plateau' phase?",
      "options": ["The end of sexual activity", "A period of high arousal that levels off before orgasm", "The first step of arousal", "The feeling of exhaustion after sex"],
      "correctAnswer": "A period of high arousal that levels off before orgasm",
      "difficulty": "hard",
      "explanation": "It is the stage of peak physical tension preceding the climax."
    },
    {
      "question": "What is 'Coercion' in a sexual context?",
      "options": ["Polite asking", "Using force, threats, or manipulation to get someone to agree to sex", "Agreeing to use a condom", "Talking about feelings"],
      "correctAnswer": "Using force, threats, or manipulation to get someone to agree to sex",
      "difficulty": "moderate",
      "explanation": "Sex obtained through coercion is not consensual; it is sexual assault."
    },
    {
      "question": "Situational Judgment: A partner says 'If you really loved me, you wouldn't make me use a condom.' This is an example of:",
      "options": ["Healthy communication", "Emotional manipulation (coercion)", "Scientific fact", "Honest trust"],
      "correctAnswer": "Emotional manipulation (coercion)",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Love should never be used as a reason to ignore health and safety boundaries."
    },
    {
      "question": "Which hormone is associated with the 'Orgasm' phase and feelings of bonding?",
      "options": ["Insulin", "Oxytocin", "Adrenaline", "Thyroxine"],
      "correctAnswer": "Oxytocin",
      "difficulty": "hard",
      "explanation": "Oxytocin is often called the 'cuddle hormone' or 'bonding hormone'."
    },
    {
      "question": "The 'Resolution' phase is characterized by:",
      "options": ["A sudden spike in heart rate", "The body returning to its normal, unaroused state", "The release of an egg", "Intense muscle contractions"],
      "correctAnswer": "The body returning to its normal, unaroused state",
      "difficulty": "moderate",
      "explanation": "This follows the orgasm phase as physical tension dissipates."
    },
    {
      "question": "What is 'Active Listening' in a relationship?",
      "options": ["Interrupting to give your own opinion", "Giving full attention and acknowledging what the partner is saying", "Listening while watching TV", "Doing exactly what the partner says without thinking"],
      "correctAnswer": "Giving full attention and acknowledging what the partner is saying",
      "difficulty": "easy",
      "explanation": "It ensures both partners feel heard and understood."
    },
    {
      "question": "Why is 'Natural Family Planning' (Rhythm Method) often ineffective?",
      "options": ["It requires a lot of money.", "Menstrual cycles can be irregular due to stress or illness, making ovulation hard to predict.", "It involves taking too many pills.", "It causes STIs."],
      "correctAnswer": "Menstrual cycles can be irregular due to stress or illness, making ovulation hard to predict.",
      "difficulty": "moderate",
      "explanation": "The 'safe period' is not always reliable because biological cycles vary."
    },
    {
      "question": "Which of these is a myth about sexual behavior?",
      "options": ["You can't get pregnant the first time.", "HIV can be spread through blood.", "Condoms have an expiration date.", "Consent can be withdrawn at any time."],
      "correctAnswer": "You can't get pregnant the first time.",
      "difficulty": "easy",
      "explanation": "Conception can occur during any instance of unprotected intercourse if ovulation has happened."
    },
    {
      "question": "What is the 'Refractory Period' in the sexual response cycle?",
      "options": ["The time when an egg is released", "A period after orgasm in males where they cannot reach another orgasm", "The time it takes for a sperm to reach the egg", "The nine months of pregnancy"],
      "correctAnswer": "A period after orgasm in males where they cannot reach another orgasm",
      "difficulty": "hard",
      "explanation": "This period varies in length among individuals and usually increases with age."
    },
    {
      "question": "Fill in the blank: _____ communication involves being honest about your needs while still respecting the needs of others.",
      "options": ["Aggressive", "Passive", "Assertive", "Manipulation"],
      "correctAnswer": "Assertive",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Assertiveness is the middle ground between being a 'doormat' and being a 'bully'."
    },
    {
      "question": "What is the 'Dual Protection Strategy'?",
      "options": ["Using two condoms at once", "Using a method for pregnancy prevention AND a method for STI prevention", "Having two sexual partners", "Protecting your body and your car"],
      "correctAnswer": "Using a method for pregnancy prevention AND a method for STI prevention",
      "difficulty": "easy",
      "explanation": "Commonly, this is using the Pill/Implant for pregnancy and a Condom for infections."
    },
    {
      "question": "Identify the 'safe' sexual behavior in terms of HIV risk:",
      "options": ["Sharing a razor with a stranger", "Unprotected sex with a trusted partner whose status is unknown", "Deep kissing with mouth sores", "Social hugging and handshaking"],
      "correctAnswer": "Social hugging and handshaking",
      "difficulty": "easy",
      "explanation": "Casual contact does not transmit HIV."
    },
    {
      "question": "Which of these is a physical sign of the 'Plateau' phase in females?",
      "options": ["Menstruation", "Increased lubrication and swelling of the vaginal tissues", "Loss of appetite", "Decrease in blood pressure"],
      "correctAnswer": "Increased lubrication and swelling of the vaginal tissues",
      "difficulty": "hard",
      "explanation": "The body prepares for intercourse during this phase of high arousal."
    },
    {
      "question": "Why is 'Peer Pressure' dangerous in adolescence?",
      "options": ["It helps you make more friends.", "It can lead to engage in sexual behaviors before one is emotionally or physically ready.", "It makes you study harder.", "It prevents drug use."],
      "correctAnswer": "It can lead to engage in sexual behaviors before one is emotionally or physically ready.",
      "difficulty": "easy",
      "explanation": "Seeking approval from peers can result in risky choices that an individual wouldn't make alone."
    },
    {
      "question": "What is the 'Window Period' for HIV testing?",
      "options": ["The time when the clinic is open", "The time after infection when a test may still be negative", "The time when you are most fertile", "The time between the first and second dose of a vaccine"],
      "correctAnswer": "The time after infection when a test may still be negative",
      "difficulty": "moderate",
      "explanation": "It takes time for the body to develop detectable antibodies; testing too early can give a false sense of security."
    },
    {
      "question": "Order the steps for the 'Correct Use of a Male Condom':",
      "orderCorrect": ["Check expiration date", "Squeeze tip to remove air", "Roll down to the base", "Hold rim during withdrawal"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Following these steps carefully is essential for the condom not to break or slip."
    },
    {
      "question": "What is 'Non-Verbal Communication' in consent?",
      "options": ["Shouting 'No'", "Body language, facial expressions, and pulling away", "Writing a text message", "Reading a book together"],
      "correctAnswer": "Body language, facial expressions, and pulling away",
      "difficulty": "moderate",
      "explanation": "A partner who seems hesitant or pulls away is communicating a lack of consent even if they don't speak."
    },
    {
      "question": "If a condom breaks, what should the first action be?",
      "options": ["Stop immediately.", "Continue and hope for the best.", "Wash with soap inside the body.", "Take a hot bath."],
      "correctAnswer": "Stop immediately.",
      "difficulty": "easy",
      "explanation": "Immediate cessation of activity is the first step, followed by seeking emergency medical help (ECP/PEP)."
    },
    {
      "question": "How can 'Stereotypes' affect sexual behavior?",
      "options": ["They provide accurate facts.", "They can pressure people to act in certain ways based on their gender (e.g., 'men should always want sex').", "They make everyone equal.", "They reduce the spread of diseases."],
      "correctAnswer": "They can pressure people to act in certain ways based on their gender (e.g., 'men should always want sex').",
      "difficulty": "moderate",
      "explanation": "Social expectations can make it difficult for individuals to communicate their true feelings or boundaries."
    },
    {
      "question": "What is 'Self-Esteem'?",
      "options": ["How much money you have", "How much you value and respect yourself", "How many friends you have", "Your height and weight"],
      "correctAnswer": "How much you value and respect yourself",
      "difficulty": "easy",
      "explanation": "High self-esteem helps individuals resist peer pressure and insist on safe practices."
    },
    {
      "question": "Case Study: A young man is afraid to ask his partner to use a condom because he thinks she will get angry. This shows a lack of:",
      "options": ["Physical strength", "Assertive communication skills", "Money", "Hormones"],
      "correctAnswer": "Assertive communication skills",
      "difficulty": "moderate",
      "type": "caseBased",
      "explanation": "The fear of conflict is preventing him from protecting his and his partner's health."
    },
    {
      "question": "Which of these is a 'Social' consequence of an unintended pregnancy?",
      "options": ["Weight gain", "Morning sickness", "Interruption of education and social stigma", "High blood pressure"],
      "correctAnswer": "Interruption of education and social stigma",
      "difficulty": "easy",
      "explanation": "Unintended pregnancy has far-reaching effects on a person's life path and community standing."
    },
    {
      "question": "True or False: Using two male condoms at once provides double protection.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Friction between the two layers of latex makes them both much more likely to tear."
    },
    {
      "question": "What is the 'Orgasm' phase?",
      "options": ["The beginning of arousal", "A series of rhythmic muscle contractions and intense pleasure", "The recovery period", "A type of contraceptive"],
      "correctAnswer": "A series of rhythmic muscle contractions and intense pleasure",
      "difficulty": "moderate",
      "explanation": "It is the peak of the sexual response cycle."
    },
    {
      "question": "Which of these provides the MOST reliable source of sexual health information?",
      "options": ["A movie", "Rumors from older friends", "A health professional or school curriculum", "Social media 'influencers'"],
      "correctAnswer": "A health professional or school curriculum",
      "difficulty": "easy",
      "explanation": "Accurate, evidence-based information is vital for making safe decisions."
    }
  ],
 "Unit 20: Genetics": [
    {
      "question": "What is the study of inheritance and variation of characteristics in individuals called?",
      "options": ["Physiology", "Genetics", "Ecology", "Histology"],
      "correctAnswer": "Genetics",
      "difficulty": "easy",
      "explanation": "Genetics is the branch of science dealing with how traits are passed from parents to offspring[cite: 344]."
    },
    {
      "question": "Who is known as the 'father of genetics'?",
      "options": ["Charles Darwin", "Louis Pasteur", "Gregor Mendel", "Robert Hooke"],
      "correctAnswer": "Gregor Mendel",
      "difficulty": "easy",
      "explanation": "Mendel, an Austrian monk, carried out the first investigations on inheritance[cite: 344]."
    },
    {
      "question": "What is the basic unit of inheritance located on DNA?",
      "options": ["Cell", "Allele", "Gene", "Chromosome"],
      "correctAnswer": "Gene",
      "difficulty": "easy",
      "explanation": "A gene is the unit of inheritance located on DNA that carries information for traits[cite: 400]."
    },
    {
      "question": "What term describes the different forms of the same gene?",
      "options": ["Genotypes", "Phenotypes", "Alleles", "Loci"],
      "correctAnswer": "Alleles",
      "difficulty": "moderate",
      "explanation": "Alleles are pairs representing a characteristic in a cell[cite: 346]."
    },
    {
      "question": "The physical appearance or outward expression of an organism's traits is known as its:",
      "options": ["Genotype", "Phenotype", "Hybrid", "Pedigree"],
      "correctAnswer": "Phenotype",
      "difficulty": "easy",
      "explanation": "Phenotype is the outward or physical appearance, such as 'tall' or 'short'[cite: 346]."
    },
    {
      "question": "Which of these represents the genetic makeup of an organism?",
      "options": ["Phenotype", "Genotype", "Locus", "Variation"],
      "correctAnswer": "Genotype",
      "difficulty": "easy",
      "explanation": "Genotype is the genetic constitution or makeup, usually denoted by letters like BB or Bb[cite: 346]."
    },
    {
      "question": "If an individual has two identical alleles for a trait (e.g., BB), they are said to be:",
      "options": ["Heterozygous", "Homozygous", "Hybrid", "Haploid"],
      "correctAnswer": "Homozygous",
      "difficulty": "moderate",
      "explanation": "When two alleles in a genotype are similar, the individual is homozygous or true-breeding[cite: 346]."
    },
    {
      "question": "What is the term for an organism with two different alleles (e.g., Bb) for a specific trait?",
      "options": ["Homozygous dominant", "Homozygous recessive", "Heterozygous", "Diplontic"],
      "correctAnswer": "Heterozygous",
      "difficulty": "moderate",
      "explanation": "Heterozygous means the two alleles for a trait are different[cite: 346]."
    },
    {
      "question": "Which type of allele can hide the expression of another allele?",
      "options": ["Recessive", "Dominant", "Co-dominant", "Linked"],
      "correctAnswer": "Dominant",
      "difficulty": "easy",
      "explanation": "A dominant allele influences a characteristic over another allele[cite: 346]."
    },
    {
      "question": "A recessive allele is only expressed in the phenotype when:",
      "options": ["A dominant allele is present", "It is in a heterozygous state", "It is in a homozygous state", "It is on the Y chromosome"],
      "correctAnswer": "It is in a homozygous state",
      "difficulty": "moderate",
      "explanation": "Recessive alleles cannot influence a trait in the presence of a dominant allele[cite: 346]."
    },
    {
      "question": "What is the exact position of a gene on a chromosome called?",
      "options": ["Allele", "Locus", "Centromere", "Chiasma"],
      "correctAnswer": "Locus",
      "difficulty": "moderate",
      "explanation": "Locus refers to the specific location of a gene on a chromosome[cite: 346]."
    },
    {
      "question": "How many chromosomes are in a typical human body (somatic) cell?",
      "options": ["23", "46", "44", "22"],
      "correctAnswer": "46",
      "difficulty": "easy",
      "explanation": "Humans have 46 chromosomes (23 pairs) in somatic cells[cite: 346]."
    },
    {
      "question": "Which cells in humans are haploid?",
      "options": ["Skin cells", "Nerve cells", "Gametes (sperms and eggs)", "Muscle cells"],
      "correctAnswer": "Gametes (sperms and eggs)",
      "difficulty": "moderate",
      "explanation": "Haploid cells, which have half the chromosome number, are the reproductive cells[cite: 346]."
    },
    {
      "question": "What does 'F1 generation' stand for?",
      "options": ["Final generation", "First Filial generation", "First Father generation", "Feature 1 generation"],
      "correctAnswer": "First Filial generation",
      "difficulty": "moderate",
      "explanation": "F1 refers to the first offspring produced after crossing parental genotypes[cite: 346]."
    },
    {
      "question": "In a monohybrid cross between two heterozygous (Tt) tall plants, what is the expected phenotypic ratio?",
      "options": ["1:1", "1:2:1", "3:1", "4:0"],
      "correctAnswer": "3:1",
      "difficulty": "hard",
      "explanation": "Mendel observed a 3:1 ratio (Tall to Dwarf) in the F2 generation of a monohybrid cross[cite: 350]."
    },
    {
      "question": "What tool is used to predict the possible genotypes and phenotypes of offspring?",
      "options": ["Microscope", "Pedigree Chart", "Punnett Square", "Karyotype"],
      "correctAnswer": "Punnett Square",
      "difficulty": "easy",
      "explanation": "A Punnett square is a grid used to illustrate and predict genetic crosses[cite: 350]."
    },
    {
      "question": "Which of these represents a homozygous recessive genotype?",
      "options": ["TT", "Tt", "tt", "XY"],
      "correctAnswer": "tt",
      "difficulty": "easy",
      "explanation": "Homozygous recessive is denoted by two small letters (e.g., tt)[cite: 346]."
    },
    {
      "question": "What is 'Monohybrid Inheritance'?",
      "options": ["Inheritance of two traits", "Inheritance of many traits", "Inheritance of a single characteristic", "Inheritance of sex only"],
      "correctAnswer": "Inheritance of a single characteristic",
      "difficulty": "moderate",
      "explanation": "Mendel's experiments involving one pair of contrasting characters are monohybrid[cite: 350]."
    },
    {
      "question": "In co-dominance, what happens in a heterozygous individual?",
      "options": ["One allele hides the other", "The alleles blend to form a new trait", "Both alleles are fully expressed", "Neither allele is expressed"],
      "correctAnswer": "Both alleles are fully expressed",
      "difficulty": "moderate",
      "explanation": "In co-dominance, both alleles of a gene pair are fully expressed in a heterozygote[cite: 353]."
    },
    {
      "question": "The ABO blood group system is an example of:",
      "options": ["Incomplete dominance", "Co-dominance and multiple alleles", "Sex-linkage", "Monogenic recessive inheritance"],
      "correctAnswer": "Co-dominance and multiple alleles",
      "difficulty": "hard",
      "explanation": "ABO blood groups involve three alleles where A and B are co-dominant[cite: 353]."
    },
    {
      "question": "Which blood group is considered the 'Universal Donor' because it has no antigens?",
      "options": ["Group A", "Group B", "Group AB", "Group O"],
      "correctAnswer": "Group O",
      "difficulty": "moderate",
      "explanation": "Genotype OO forms no antigens, resulting in blood group O[cite: 353]."
    },
    {
      "question": "If a person has blood group AB, their genotype must be:",
      "options": ["AA", "AO", "BB", "AB"],
      "correctAnswer": "AB",
      "difficulty": "moderate",
      "explanation": "Blood group AB results from the co-dominant genotype AB[cite: 353]."
    },
    {
      "question": "How many sex chromosomes determine a human's biological sex?",
      "options": ["1 pair (2 chromosomes)", "22 pairs", "23 pairs", "46 pairs"],
      "correctAnswer": "1 pair (2 chromosomes)",
      "difficulty": "easy",
      "explanation": "Humans have one pair of sex chromosomes (XX or XY)[cite: 355]."
    },
    {
      "question": "What is the chromosomal makeup of a human female?",
      "options": ["XY", "YY", "XX", "XO"],
      "correctAnswer": "XX",
      "difficulty": "easy",
      "explanation": "Females possess two X chromosomes[cite: 355]."
    },
    {
      "question": "What determines if a baby will be male?",
      "options": ["Two X chromosomes", "Presence of a Y chromosome from the father", "Maternal age", "Environmental factors"],
      "correctAnswer": "Presence of a Y chromosome from the father",
      "difficulty": "moderate",
      "explanation": "Males are XY; the Y chromosome is inherited from the father[cite: 355]."
    },
    {
      "question": "What are 'Sex-linked' traits?",
      "options": ["Traits found on autosomes", "Traits carried on the sex chromosomes", "Traits that only appear after puberty", "Traits determined by hormone levels"],
      "correctAnswer": "Traits carried on the sex chromosomes",
      "difficulty": "moderate",
      "explanation": "Sex-linked traits are those whose genes are located on the sex chromosomes[cite: 356]."
    },
    {
      "question": "Which chromosome typically carries most sex-linked genes?",
      "options": ["Y chromosome", "X chromosome", "Chromosome 21", "The Mitochondria"],
      "correctAnswer": "X chromosome",
      "difficulty": "moderate",
      "explanation": "Most sex-linked traits are X-linked[cite: 356]."
    },
    {
      "question": "Why are males more likely to suffer from X-linked disorders like color blindness?",
      "options": ["They have two X chromosomes", "The Y chromosome hides the trait", "They only have one X chromosome", "Males are naturally weaker"],
      "correctAnswer": "They only have one X chromosome",
      "difficulty": "hard",
      "explanation": "Since males are XY, a single recessive allele on their X chromosome will be expressed[cite: 356]."
    },
    {
      "question": "Which of these is a common sex-linked condition?",
      "options": ["Sickle cell anemia", "Albinism", "Hemophilia", "Down syndrome"],
      "correctAnswer": "Hemophilia",
      "difficulty": "moderate",
      "explanation": "Hemophilia and red-green color blindness are classic sex-linked traits[cite: 356]."
    },
    {
      "question": "If a carrier woman (XHXh) for hemophilia has children with a normal man (XHY), what is the chance a son will have hemophilia?",
      "options": ["0%", "25%", "50%", "100%"],
      "correctAnswer": "50%",
      "difficulty": "hard",
      "explanation": "Sons inherit one X from the mother; if she is a carrier, there is a 50% chance the son gets the 'h' allele[cite: 356]."
    },
    {
      "question": "A 'Pedigree' is used to:",
      "options": ["Predict future mutations", "Record the history of a trait in a family", "Measure the speed of inheritance", "Engineer new genes"],
      "correctAnswer": "Record the history of a trait in a family",
      "difficulty": "moderate",
      "explanation": "A pedigree is a historical or ancestral record shown in a chart or diagram[cite: 347]."
    },
    {
      "question": "What does a shaded square usually represent in a pedigree chart?",
      "options": ["A female with the trait", "A male with the trait", "A healthy female", "A carrier male"],
      "correctAnswer": "A male with the trait",
      "difficulty": "moderate",
      "explanation": "In pedigrees, squares represent males and shaded shapes represent individuals expressing the trait[cite: 351]."
    },
    {
      "question": "Mendel's 'First Law' is the Law of:",
      "options": ["Independent Assortment", "Segregation", "Dominance", "Natural Selection"],
      "correctAnswer": "Segregation",
      "difficulty": "hard",
      "explanation": "The Law of Segregation states that allele pairs separate during gamete formation[cite: 351]."
    },
    {
      "question": "In the ABO system, which alleles are dominant over O?",
      "options": ["A only", "B only", "Both A and B", "Neither A nor B"],
      "correctAnswer": "Both A and B",
      "difficulty": "moderate",
      "explanation": "Allele O is recessive to both alleles A and B[cite: 353]."
    },
    {
      "question": "Which genotype would result in Blood Group A?",
      "options": ["AA or AO", "BB or BO", "AB", "OO"],
      "correctAnswer": "AA or AO",
      "difficulty": "moderate",
      "explanation": "Both homozygous AA and heterozygous AO express the A antigen[cite: 353]."
    },
    {
      "question": "What is 'Incomplete Dominance'?",
      "options": ["Both alleles show fully", "Neither allele is dominant, resulting in a blend", "A trait that skips generations", "A gene that only works in males"],
      "correctAnswer": "Neither allele is dominant, resulting in a blend",
      "difficulty": "hard",
      "explanation": "Incomplete dominance results in an intermediate phenotype, like pink flowers from red and white parents[cite: 351]."
    },
    {
      "question": "A cross between a red bull and white cow producing 'roan' (red and white) calves is an example of:",
      "options": ["Complete dominance", "Co-dominance", "Mutation", "Recessiveness"],
      "correctAnswer": "Co-dominance",
      "difficulty": "moderate",
      "explanation": "Roan indicates both colors are present/expressed, a sign of co-dominance[cite: 351]."
    },
    {
      "question": "What are 'Autosomes'?",
      "options": ["Self-moving cells", "Non-sex chromosomes", "Mutated genes", "Plant chromosomes"],
      "correctAnswer": "Non-sex chromosomes",
      "difficulty": "moderate",
      "explanation": "Autosomes are chromosomes that do not determine the sex of an individual[cite: 346]."
    },
    {
      "question": "The total genetic constitution of any cell in an organism is called the:",
      "options": ["Genotype", "Genome", "Locus", "Allele"],
      "correctAnswer": "Genome",
      "difficulty": "moderate",
      "explanation": "A genome is the complete set of genetic material in a cell[cite: 400]."
    },
    {
      "question": "Which of the following is a result of variation within a species?",
      "options": ["All humans being the same height", "Differences in tongue-rolling ability", "All pea plants being tall", "Identical twins having different DNA"],
      "correctAnswer": "Differences in tongue-rolling ability",
      "difficulty": "easy",
      "explanation": "Traits like tongue-rolling demonstrate variation between individuals[cite: 344]."
    },
    {
      "question": "In genetics, what does 'Hybrid' mean?",
      "options": ["A pure-breeding organism", "An offspring of parents with contrasting traits", "An organism with a mutation", "An extinct species"],
      "correctAnswer": "An offspring of parents with contrasting traits",
      "difficulty": "moderate",
      "explanation": "A hybrid is produced by crossing individuals with different characteristics[cite: 347]."
    },
    {
      "question": "If a daughter is color-blind, which of the following MUST be true?",
      "options": ["Her mother is also color-blind", "Her father is color-blind", "Her brother is not color-blind", "She is a carrier"],
      "correctAnswer": "Her father is color-blind",
      "difficulty": "hard",
      "explanation": "A daughter needs two X-recessive alleles; she must get one from her father, who would then express the trait[cite: 356]."
    },
    {
      "question": "Diploid refers to a nucleus that has:",
      "options": ["Half the chromosomes", "Chromosomes in homologous pairs", "Three sets of chromosomes", "No chromosomes"],
      "correctAnswer": "Chromosomes in homologous pairs",
      "difficulty": "moderate",
      "explanation": "Diploid cells (2n) contain full pairs of chromosomes[cite: 346]."
    },
    {
      "question": "Which process maintains the 'Diploid' state of an organism during growth?",
      "options": ["Meiosis", "Mitosis", "Fertilization", "Mutation"],
      "correctAnswer": "Mitosis",
      "difficulty": "moderate",
      "explanation": "Mitosis produces identical diploid cells for growth and repair[cite: 346]."
    },
    {
      "question": "A cross between F1 hybrids (Tt x Tt) produces what genotypic ratio?",
      "options": ["3:1", "1:2:1", "1:1", "All Tt"],
      "correctAnswer": "1:2:1",
      "difficulty": "hard",
      "explanation": "The genotypes produced are 1TT, 2Tt, and 1tt[cite: 350]."
    },
    {
      "question": "The passing of genes from parents to offspring is called:",
      "options": ["Variation", "Heredity", "Evolution", "Mitosis"],
      "correctAnswer": "Heredity",
      "difficulty": "easy",
      "explanation": "Heredity is the principle behind the inheritance of characteristics[cite: 344]."
    },
    {
      "question": "Which scientist carried out investigations on inheritance using pea plants?",
      "options": ["Darwin", "Mendel", "Watson", "Franklin"],
      "correctAnswer": "Mendel",
      "difficulty": "easy",
      "explanation": "Mendel's work with pea plants founded the field of genetics[cite: 344]."
    },
    {
      "question": "What do we call the 'twos' or 'pairs' of letters used to denote genetic makeup?",
      "options": ["Phenotypes", "Genotypes", "Chromatids", "Gametes"],
      "correctAnswer": "Genotypes",
      "difficulty": "moderate",
      "explanation": "Genotypes like BB or Bb are always denoted in pairs[cite: 346]."
    },
    {
      "question": "Multiple alleles are seen in which human trait?",
      "options": ["Height", "Skin color", "ABO blood groups", "Biological sex"],
      "correctAnswer": "ABO blood groups",
      "difficulty": "moderate",
      "explanation": "ABO blood groups are determined by three alleles: A, B, and O[cite: 353]."
    },
    {
      "question": "True or False: A dominant allele is always represented by a small letter.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "explanation": "Dominant alleles are represented by capital letters[cite: 346]."
    },
    {
      "question": "What is the result of crossing a pure tall (TT) and pure dwarf (tt) plant?",
      "options": ["All dwarf plants", "All tall plants", "50% tall, 50% dwarf", "All medium plants"],
      "correctAnswer": "All tall plants",
      "difficulty": "moderate",
      "explanation": "All offspring (F1) will be Tt, which are phenotypically tall[cite: 349]."
    }
  ],
  "Unit 21: Gene technology": [
    {
      "question": "What is the primary definition of 'Genetic Engineering'?",
      "options": ["Breeding animals of the same species", "The artificial manipulation and alteration of genes", "Applying fertilizers to increase crop yield", "The natural mutation of DNA over time"],
      "correctAnswer": "The artificial manipulation and alteration of genes",
      "difficulty": "easy",
      "explanation": "Genetic engineering involves deliberately changing the genetic makeup of an organism by introducing, removing, or changing specific DNA sequences."
    },
    {
      "question": "What does the abbreviation 'GMO' stand for?",
      "options": ["Genetically Modified Organism", "General Mutant Observation", "Genomically Made Offspring", "Generated Molecular Organic"],
      "correctAnswer": "Genetically Modified Organism",
      "difficulty": "easy",
      "explanation": "A GMO is any organism whose genetic material has been altered using genetic engineering techniques."
    },
    {
      "question": "Which of these is commonly used as a 'vector' to transfer genes into bacteria?",
      "options": ["Ribosomes", "Plasmids", "Mitochondria", "Golgi apparatus"],
      "correctAnswer": "Plasmids",
      "difficulty": "moderate",
      "explanation": "Plasmids are small, circular DNA molecules found in bacteria that can be easily manipulated to carry foreign genes."
    },
    {
      "question": "In genetic engineering, 'Restriction Enzymes' are used to:",
      "options": ["Join two pieces of DNA together", "Copy DNA sequences", "Cut DNA at specific base sequences", "Stop the cell from dividing"],
      "correctAnswer": "Cut DNA at specific base sequences",
      "difficulty": "moderate",
      "explanation": "Restriction enzymes act like 'molecular scissors,' allowing scientists to isolate specific genes."
    },
    {
      "question": "Which enzyme is used to 'glue' or join the foreign gene into the plasmid DNA?",
      "options": ["Amylase", "DNA Ligase", "Protease", "DNA Polymerase"],
      "correctAnswer": "DNA Ligase",
      "difficulty": "moderate",
      "explanation": "DNA ligase seals the gaps between the sugar-phosphate backbones of DNA fragments."
    },
    {
      "question": "What is a major advantage of producing human insulin through genetic engineering?",
      "options": ["It is extracted from pigs and cows", "It is identical to human insulin and causes fewer allergic reactions", "It makes the bacteria turn green", "It is much more expensive to produce"],
      "correctAnswer": "It is identical to human insulin and causes fewer allergic reactions",
      "difficulty": "moderate",
      "explanation": "Before gene technology, insulin was taken from animals, which often caused immune responses in human patients."
    },
    {
      "question": "What is 'Recombinant DNA'?",
      "options": ["DNA that has been destroyed", "DNA formed by combining genetic material from different sources", "DNA found only in viruses", "Natural DNA found in twins"],
      "correctAnswer": "DNA formed by combining genetic material from different sources",
      "difficulty": "moderate",
      "explanation": "When a gene from one organism is inserted into the DNA of another, the result is recombinant DNA."
    },
    {
      "question": "Which of the following is an example of a GMO in agriculture?",
      "options": ["Hybrid corn produced by cross-pollination", "Bt cotton which produces its own insecticide", "Organic tomatoes grown without chemicals", "Wild berries found in a forest"],
      "correctAnswer": "Bt cotton which produces its own insecticide",
      "difficulty": "moderate",
      "explanation": "Bt cotton contains a gene from the bacterium Bacillus thuringiensis that kills specific pests."
    },
    {
      "question": "What is a potential 'disadvantage' of GMOs regarding the environment?",
      "options": ["Decreased use of pesticides", "The risk of 'superweeds' through cross-pollination with wild relatives", "Lower costs for farmers", "Increased nutritional value of food"],
      "correctAnswer": "The risk of 'superweeds' through cross-pollination with wild relatives",
      "difficulty": "hard",
      "explanation": "If herbicide-resistance genes spread to weeds, those weeds may become impossible to kill with standard chemicals."
    },
    {
      "question": "The term 'Transgenic' refers to an organism that:",
      "options": ["Has no DNA", "Contains a gene from a different species", "Is a clone of its parent", "Has been killed by radiation"],
      "correctAnswer": "Contains a gene from a different species",
      "difficulty": "moderate",
      "explanation": "Transgenic organisms are a subset of GMOs where DNA from a donor species is inserted into a recipient species."
    },
    {
      "question": "Which organism is most frequently used as a 'host' to produce human growth hormones?",
      "options": ["Yeast", "Escherichia coli (E. coli)", "Human skin cells", "Mosquitoes"],
      "correctAnswer": "Escherichia coli (E. coli)",
      "difficulty": "moderate",
      "explanation": "Bacteria like E. coli reproduce rapidly, making them excellent 'bio-factories' for medicine."
    },
    {
      "question": "What is 'Golden Rice' engineered to contain?",
      "options": ["Vitamin C", "Beta-carotene (Vitamin A precursor)", "High levels of iron", "Caffeine"],
      "correctAnswer": "Beta-carotene (Vitamin A precursor)",
      "difficulty": "moderate",
      "explanation": "Golden Rice was developed to combat Vitamin A deficiency in developing countries."
    },
    {
      "question": "In the process of genetic engineering, what is 'Transformation'?",
      "options": ["When a caterpillar becomes a butterfly", "The process of a host cell taking up the recombinant DNA", "The mutation of a gene due to UV light", "The death of a genetically modified cell"],
      "correctAnswer": "The process of a host cell taking up the recombinant DNA",
      "difficulty": "hard",
      "explanation": "Transformation is the specific step where the modified vector enters the target bacterial cell."
    },
    {
      "question": "Which of these is a 'Social' or 'Ethical' concern regarding GMOs?",
      "options": ["The possibility of creating new allergies", "Patent ownership of life forms by large corporations", "The speed of bacterial growth", "The color of modified crops"],
      "correctAnswer": "Patent ownership of life forms by large corporations",
      "difficulty": "hard",
      "explanation": "Ethical debates often center on whether companies should own the rights to modified seeds and food sources."
    },
    {
      "question": "True or False: Genetic engineering is the same as selective breeding.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Selective breeding relies on natural mating, whereas genetic engineering involves direct laboratory intervention at the molecular level."
    },
    {
      "question": "How can GMOs help solve world hunger?",
      "options": ["By making food more expensive", "By creating crops with higher yields and resistance to harsh climates", "By reducing the size of the human population", "By making food taste like chocolate"],
      "correctAnswer": "By creating crops with higher yields and resistance to harsh climates",
      "difficulty": "easy",
      "explanation": "Engineering crops to survive drought or pests can stabilize food supplies in vulnerable regions."
    },
    {
      "question": "Identify the 'odd one out' in the list of genetic engineering tools:",
      "options": ["Restriction enzymes", "Ligase", "Vectors", "Stethoscope"],
      "correctAnswer": "Stethoscope",
      "difficulty": "easy",
      "type": "errorIdentification",
      "explanation": "A stethoscope is a medical diagnostic tool, not a molecular tool for DNA manipulation."
    },
    {
      "question": "Assertion: GMOs can reduce the amount of chemical pesticides used in farming.\nReason: Some GMOs are engineered to produce their own toxins that kill specific pests.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Pest-resistant crops (like Bt corn) require fewer external sprays, which is an environmental advantage."
    },
    {
      "question": "Place the steps of genetic engineering in the correct order:",
      "orderCorrect": ["Isolating the desired gene", "Cutting the plasmid and gene with restriction enzymes", "Inserting the gene into the plasmid using ligase", "Transforming the host bacteria", "Selecting and cloning the modified bacteria"],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "The process must follow a logical sequence from isolation to expression."
    },
    {
      "question": "Which field uses 'Gene Therapy' to treat disorders like Cystic Fibrosis?",
      "options": ["Agriculture", "Medicine", "Forensics", "Archaeology"],
      "correctAnswer": "Medicine",
      "difficulty": "easy",
      "explanation": "Gene therapy involves inserting functional genes into a patient's cells to replace defective ones."
    },
    {
      "question": "What is a 'disadvantage' for a farmer using GMO seeds?",
      "options": ["They are usually cheaper", "The farmer often cannot save seeds for the next year and must buy new ones", "They require more water", "They grow slower"],
      "correctAnswer": "The farmer often cannot save seeds for the next year and must buy new ones",
      "difficulty": "moderate",
      "explanation": "Contractual and biological restrictions (terminator technology) often force farmers into an annual buying cycle."
    },
    {
      "question": "Which of the following is a potential health risk associated with GMOs?",
      "options": ["Increased intelligence", "Accidental introduction of allergens into new food sources", "Immunity to all diseases", "Growing extra limbs"],
      "correctAnswer": "Accidental introduction of allergens into new food sources",
      "difficulty": "moderate",
      "explanation": "There is concern that genes from allergenic foods (like nuts) might be moved into non-allergenic foods without labels."
    },
    {
      "question": "What is 'Pharming'?",
      "options": ["Traditional crop rotation", "Using genetically modified animals to produce pharmaceutical drugs", "Building farms in space", "The study of ancient agricultural tools"],
      "correctAnswer": "Using genetically modified animals to produce pharmaceutical drugs",
      "difficulty": "hard",
      "explanation": "Example: Engineering goats to produce medical proteins in their milk."
    },
    {
      "question": "Restriction enzymes leave 'Staggered' cuts in DNA which are known as:",
      "options": ["Hard ends", "Sticky ends", "Sugar ends", "Ligase loops"],
      "correctAnswer": "Sticky ends",
      "difficulty": "hard",
      "explanation": "Sticky ends allow the foreign gene and the plasmid to bind together easily through complementary base pairing."
    },
    {
      "question": "Why is 'Biodiversity' a concern with the use of GMOs?",
      "options": ["GMOs increase the number of species in the wild.", "Large-scale planting of a single GMO crop (monoculture) reduces genetic variety.", "GMOs prevent plants from evolving.", "Biodiversity is only a concern for animals, not plants."],
      "correctAnswer": "Large-scale planting of a single GMO crop (monoculture) reduces genetic variety.",
      "difficulty": "moderate",
      "explanation": "Reliance on a few varieties of seeds makes the food supply vulnerable to new diseases or climate shifts."
    },
    {
      "question": "Select ALL that apply to the role of plasmids in gene technology:",
      "multiSelect": true,
      "options": [
        "They act as vectors.",
        "They are found in the nucleus of human cells.",
        "They can replicate independently inside a bacterium.",
        "They are made of RNA.",
        "They can be easily cut and resealed."
      ],
      "correctAnswer": ["They act as vectors.", "They can replicate independently inside a bacterium.", "They can be easily cut and resealed."],
      "difficulty": "hard",
      "type": "multiple",
      "explanation": "Plasmids are bacterial DNA loops, not found in human nuclei, and are composed of DNA."
    },
    {
      "question": "What is the role of a 'Marker Gene' in genetic engineering?",
      "options": ["To make the plant grow taller", "To identify which cells have successfully taken up the recombinant DNA", "To change the taste of the fruit", "To kill the host cell"],
      "correctAnswer": "To identify which cells have successfully taken up the recombinant DNA",
      "difficulty": "hard",
      "explanation": "Often, antibiotic resistance genes are used as markers; only transformed cells will survive on an antibiotic-treated plate."
    },
    {
      "question": "In the context of GMOs, what is a 'Bio-safety' regulation?",
      "options": ["A law that bans all science", "Rules designed to protect human health and the environment from the potential risks of GMOs", "A lock on a laboratory door", "The cost of buying GMO seeds"],
      "correctAnswer": "Rules designed to protect human health and the environment from the potential risks of GMOs",
      "difficulty": "moderate",
      "explanation": "International agreements like the Cartagena Protocol manage the movement of GMOs between countries."
    },
    {
      "question": "Which of these is an example of GMO use in environmental cleanup?",
      "options": ["Genetically modified bacteria that can 'eat' oil spills", "Plants that grow blue leaves", "Animals that produce less waste", "Using more tractors"],
      "correctAnswer": "Genetically modified bacteria that can 'eat' oil spills",
      "difficulty": "moderate",
      "explanation": "This is called bioremediation, using modified organisms to break down pollutants."
    },
    {
      "question": "What is the 'Donor' organism in genetic engineering?",
      "options": ["The organism that receives the new gene", "The organism from which the desired gene is taken", "The person who pays for the experiment", "The laboratory equipment used"],
      "correctAnswer": "The organism from which the desired gene is taken",
      "difficulty": "easy",
      "explanation": "The donor provides the genetic trait, while the recipient (host) expresses it."
    },
    {
      "question": "The complete set of genes or genetic material present in a cell or organism is the:",
      "options": ["Genome", "Genotype", "Phenotype", "Proteome"],
      "correctAnswer": "Genome",
      "difficulty": "easy",
      "explanation": "Gene technology often starts with mapping the genome to find useful sequences."
    },
    {
      "question": "True or False: GMOs can be engineered to be resistant to drought and salt.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Abiotic stress resistance is a major focus of agricultural gene technology."
    },
    {
      "question": "Which of the following is a 'Nutritional' advantage of some GMOs?",
      "options": ["They last longer on the shelf", "They are larger in size", "Biofortification (increasing levels of vitamins/minerals)", "They contain more water"],
      "correctAnswer": "Biofortification (increasing levels of vitamins/minerals)",
      "difficulty": "moderate",
      "explanation": "Golden Rice is a prime example of biofortification."
    },
    {
      "question": "Situational: A scientist wants to produce a human blood-clotting factor in sheep milk. Which technique is required?",
      "options": ["Selective breeding", "Genetic engineering", "Cross-pollination", "Natural selection"],
      "correctAnswer": "Genetic engineering",
      "difficulty": "easy",
      "type": "situational",
      "explanation": "Moving a human gene into a sheep requires recombinant DNA technology."
    },
    {
      "question": "What is 'PCR' (Polymerase Chain Reaction) used for in gene technology?",
      "options": ["To cut DNA", "To amplify (make millions of copies of) a specific DNA segment", "To look at DNA under a light microscope", "To kill bacteria"],
      "correctAnswer": "To amplify (make millions of copies of) a specific DNA segment",
      "difficulty": "hard",
      "explanation": "PCR is essential when the sample of 'donor' DNA is very small."
    },
    {
      "question": "What is a 'disadvantage' regarding the cost of GMO technology?",
      "options": ["It makes food free for everyone", "High research and development costs can lead to higher seed prices for farmers", "It requires no investment", "It only costs money for the government"],
      "correctAnswer": "High research and development costs can lead to higher seed prices for farmers",
      "difficulty": "moderate",
      "explanation": "The high cost of technology often limits access to wealthy countries or large-scale industrial farms."
    },
    {
      "question": "Identify the potential 'ecological' risk of GMO fish:",
      "options": ["They might taste better", "They could escape and out-compete wild fish populations", "They will live on land", "They will grow legs"],
      "correctAnswer": "They could escape and out-compete wild fish populations",
      "difficulty": "moderate",
      "explanation": "Faster-growing modified fish could disrupt natural aquatic food webs if they enter the wild."
    },
    {
      "question": "Which of these is NOT a current application of genetic engineering?",
      "options": ["Production of vaccines", "Cloning of extinct dinosaurs", "Herbicide-resistant soybeans", "Production of clotting factors"],
      "correctAnswer": "Cloning of extinct dinosaurs",
      "difficulty": "easy",
      "explanation": "While a popular theme in movies, cloning extinct dinosaurs is not currently possible with our technology."
    },
    {
      "question": "In genetic engineering, what is the 'Recipient'?",
      "options": ["The organism that donates the gene", "The vector used to carry the gene", "The organism that receives and expresses the foreign gene", "The scientist performing the task"],
      "correctAnswer": "The organism that receives and expresses the foreign gene",
      "difficulty": "easy",
      "explanation": "The recipient expresses the trait encoded by the donor gene."
    },
    {
      "question": "How do 'Herbicide-Resistant' crops benefit the farmer?",
      "options": ["The farmer can spray the whole field with weed-killer and only the weeds will die.", "The crops produce their own weed-killer.", "The crops don't need any water.", "The crops grow in the winter."],
      "correctAnswer": "The farmer can spray the whole field with weed-killer and only the weeds will die.",
      "difficulty": "moderate",
      "explanation": "This allows for easier weed management but can lead to increased chemical use."
    },
    {
      "question": "What is 'cDNA' (complementary DNA)?",
      "options": ["DNA found in the cytoplasm", "DNA synthesized from a messenger RNA (mRNA) template", "DNA that is broken", "DNA used for cloning animals"],
      "correctAnswer": "DNA synthesized from a messenger RNA (mRNA) template",
      "difficulty": "hard",
      "explanation": "Scientists often use mRNA to get a gene without introns (non-coding sections), making it easier for bacteria to read."
    },
    {
      "question": "The 'Flavr Savr' tomato was the first GMO food; it was engineered to:",
      "options": ["Be blue", "Have a longer shelf life by delaying ripening", "Contain Vitamin C", "Grow without soil"],
      "correctAnswer": "Have a longer shelf life by delaying ripening",
      "difficulty": "moderate",
      "explanation": "It was designed to stay firm longer after being picked."
    },
    {
      "question": "Which of the following is an example of gene technology in 'Forensics'?",
      "options": ["Growing bigger corn", "DNA profiling (fingerprinting) to identify suspects", "Creating new medicines", "Cloning sheep"],
      "correctAnswer": "DNA profiling (fingerprinting) to identify suspects",
      "difficulty": "easy",
      "explanation": "Genetic technology allows for the comparison of DNA found at crime scenes with suspects."
    },
    {
      "question": "True or False: Most scientists agree that current GMO foods on the market are safe for human consumption.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Major scientific organizations have found no evidence that currently approved GMOs are less safe than conventional foods."
    },
    {
      "question": "What is 'Terminator Technology' in GMO seeds?",
      "options": ["Seeds that kill pests", "Seeds engineered to produce sterile offspring, forcing farmers to buy new seeds every year", "Seeds that grow very fast", "Seeds that can survive a fire"],
      "correctAnswer": "Seeds engineered to produce sterile offspring, forcing farmers to buy new seeds every year",
      "difficulty": "hard",
      "explanation": "This is a controversial technology designed to protect corporate intellectual property."
    },
    {
      "question": "Which of these is a potential 'indirect' effect of GMOs on non-target insects?",
      "options": ["The insects become larger.", "Pollinators like butterflies might be harmed by toxic pollen from pest-resistant plants.", "Insects will stop eating plants.", "Insects will migrate to the moon."],
      "correctAnswer": "Pollinators like butterflies might be harmed by toxic pollen from pest-resistant plants.",
      "difficulty": "hard",
      "explanation": "This is a major environmental concern regarding the use of Bt crops."
    },
    {
      "question": "Fill in the blank: The process of making many identical copies of a specific gene is called gene _____.",
      "options": ["Splicing", "Cloning", "Editing", "Cutting"],
      "correctAnswer": "Cloning",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "Gene cloning occurs when the host bacterium reproduces, copying the recombinant DNA along with its own."
    },
    {
      "question": "What is the name of the first mammal ever cloned from an adult cell?",
      "options": ["Dolly the sheep", "Bessie the cow", "Lassie the dog", "Snowball the cat"],
      "correctAnswer": "Dolly the sheep",
      "difficulty": "easy",
      "explanation": "Dolly was cloned in 1996 using the process of somatic cell nuclear transfer."
    },
    {
      "question": "In medicine, 'Recombinant Factor VIII' is used to treat which condition?",
      "options": ["Diabetes", "Hemophilia", "Dwarfism", "Anemia"],
      "correctAnswer": "Hemophilia",
      "difficulty": "moderate",
      "explanation": "Hemophiliacs lack this clotting factor, which can now be produced safely using gene technology."
    },
    {
      "question": "Which of the following is a potential 'disadvantage' to wild plant species near GMO farms?",
      "options": ["They will grow faster.", "They might lose their natural resistance to diseases.", "Genetic pollution (unintended transfer of modified genes to wild relatives).", "They will turn into GMOs automatically."],
      "correctAnswer": "Genetic pollution (unintended transfer of modified genes to wild relatives).",
      "difficulty": "moderate",
      "explanation": "Pollen from GMO crops can travel long distances and fertilize wild plants."
    },
    {
      "question": "What is the role of a 'Bioreactor' in gene technology?",
      "options": ["To cut DNA", "A large vessel used to grow transformed bacteria on a massive scale", "A machine that sequences DNA", "A type of safety suit for scientists"],
      "correctAnswer": "A large vessel used to grow transformed bacteria on a massive scale",
      "difficulty": "moderate",
      "explanation": "Bioreactors provide the perfect conditions (temperature, pH) for bacteria to produce the desired protein."
    },
    {
      "question": "Which of these is an example of an 'Abiotic' stress that GMOs can be designed to resist?",
      "options": ["Insects", "Bacteria", "Drought", "Fungi"],
      "correctAnswer": "Drought",
      "difficulty": "moderate",
      "explanation": "Abiotic stresses are non-living factors like temperature, salt, and water availability."
    },
    {
      "question": "Why is 'Labelling' of GMO products a subject of debate?",
      "options": ["It makes the package too heavy.", "Consumers argue they have the right to know what is in their food, while companies fear lower sales.", "Labels are too expensive to print.", "There are no words to describe GMOs."],
      "correctAnswer": "Consumers argue they have the right to know what is in their food, while companies fear lower sales.",
      "difficulty": "easy",
      "explanation": "Many countries now require mandatory labeling of any food containing GMO ingredients."
    },
    {
      "question": "What describes 'Horizontal Gene Transfer'?",
      "options": ["Passing genes from parent to child", "The movement of genes between different species (common in bacteria)", "The growth of a plant upwards", "Changing the order of genes on a chromosome"],
      "correctAnswer": "The movement of genes between different species (common in bacteria)",
      "difficulty": "hard",
      "explanation": "This is a mechanism that scientists worry might allow GMO genes to jump to unintended organisms."
    },
    {
      "question": "Which of these is a 'disadvantage' of GMOs for global biodiversity?",
      "options": ["Creating too many new species", "The dominance of a few high-yield varieties, leading to the extinction of traditional landraces", "GMOs don't have seeds", "GMOs are only grown in labs"],
      "correctAnswer": "The dominance of a few high-yield varieties, leading to the extinction of traditional landraces",
      "difficulty": "hard",
      "explanation": "As farmers switch to 'superior' GMO seeds, the unique genetic traits of local traditional crops may be lost forever."
    },
    {
      "question": "Which of the following describes 'Biofortification' in gene technology?",
      "options": ["Adding chemicals to food after harvest", "Increasing the nutritional value of crops through genetic engineering", "Growing crops in fortified greenhouses", "Using stronger pesticides on plants"],
      "correctAnswer": "Increasing the nutritional value of crops through genetic engineering",
      "difficulty": "moderate",
      "explanation": "Biofortification aims to improve the nutrient profile of staple crops, such as increasing Vitamin A in rice."
    },
    {
      "question": "What is the specific role of 'Agrobacterium tumefaciens' in plant genetic engineering?",
      "options": ["It acts as a natural pest killer.", "It is a natural vector used to transfer DNA into plant cells.", "It is a type of fertilizer.", "It prevents plants from cross-pollinating."],
      "correctAnswer": "It is a natural vector used to transfer DNA into plant cells",
      "difficulty": "hard",
      "explanation": "This bacterium has the natural ability to transfer part of its DNA (T-DNA) into the plant genome."
    },
    {
      "question": "The use of a 'Gene Gun' (biolistics) is a method primarily used to:",
      "options": ["Kill weeds in a field", "Shoot DNA-coated gold particles into plant cells", "Measure the speed of bacterial growth", "Protect laboratory scientists"],
      "correctAnswer": "Shoot DNA-coated gold particles into plant cells",
      "difficulty": "moderate",
      "explanation": "A gene gun is a physical method used to deliver recombinant DNA into cells that are difficult to transform."
    },
    {
      "question": "Which of these is a potential economic 'disadvantage' of GMO technology for developing nations?",
      "options": ["Improved crop yields", "Dependence on expensive, patented seeds from multinational corporations", "Reduced need for manual labor", "Lower food prices for consumers"],
      "correctAnswer": "Dependence on expensive, patented seeds from multinational corporations",
      "difficulty": "moderate",
      "explanation": "High costs and intellectual property laws can create a cycle of debt for small-scale farmers."
    },
    {
      "question": "In the production of recombinant insulin, why must 'Introns' be removed from the human gene before insertion into bacteria?",
      "options": ["Introns are toxic to bacteria.", "Bacteria lack the machinery to process or 'splice' introns out of mRNA.", "Introns make the DNA too heavy to enter the cell.", "Introns turn the insulin into a different protein."],
      "correctAnswer": "Bacteria lack the machinery to process or 'splice' introns out of mRNA.",
      "difficulty": "hard",
      "explanation": "Bacterial genes do not contain introns, so they cannot read human genes that still have them."
    },
    {
      "question": "What is the 'Precautionary Principle' in gene technology?",
      "options": ["Taking every risk to advance science", "The idea that if an action has a risk of causing harm, it should be avoided even if scientific certainty is lacking", "Wearing a lab coat at all times", "Testing a GMO only once before selling it"],
      "correctAnswer": "The idea that if an action has a risk of causing harm, it should be avoided even if scientific certainty is lacking",
      "difficulty": "hard",
      "explanation": "This principle is often cited in debates regarding the environmental release of GMOs."
    },
    {
      "question": "Which of these is an example of an 'Antisense' technology application?",
      "options": ["Creating a vaccine", "The Flavr Savr tomato (delaying ripening)", "Increasing the height of corn", "Making cows produce more milk"],
      "correctAnswer": "The Flavr Savr tomato (delaying ripening)",
      "difficulty": "hard",
      "explanation": "Antisense technology involves blocking the expression of a specific gene, such as the one that causes softening in fruit."
    },
    {
      "question": "Identify a 'Bio-ethical' concern related to the use of GMO animals:",
      "options": ["Animals might grow too fast.", "Welfare concerns regarding unintended physical or physiological stress on the animal.", "The cost of animal feed.", "The color of the animal's fur."],
      "correctAnswer": "Welfare concerns regarding unintended physical or physiological stress on the animal.",
      "difficulty": "moderate",
      "explanation": "Genetic changes can sometimes cause health problems or discomfort for the modified animal."
    },
    {
      "question": "What is the purpose of 'Cold Tolerance' engineering in crops?",
      "options": ["To allow crops to be stored in a freezer", "To enable crops to grow in high altitudes or during frost seasons", "To make the fruit feel cold when eaten", "To prevent the plant from sweating"],
      "correctAnswer": "To enable crops to grow in high altitudes or during frost seasons",
      "difficulty": "moderate",
      "explanation": "Anti-freeze proteins from fish are sometimes used as a source of genes for this trait."
    },
    {
      "question": "Which of the following is a potential 'Allergenicity' risk of GMOs?",
      "options": ["GMOs make people allergic to water.", "A gene from a known allergen (like a Brazil nut) could be transferred into a staple food (like soy).", "Eating GMOs cures allergies.", "Only people with allergies can eat GMOs."],
      "correctAnswer": "A gene from a known allergen (like a Brazil nut) could be transferred into a staple food (like soy).",
      "difficulty": "moderate",
      "explanation": "This is why strict testing and labeling of the source of inserted genes are required."
    },
    {
      "question": "True or False: Genetic engineering can be used to produce 'edible vaccines' in fruits like bananas.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Research is ongoing to create plants that produce vaccine proteins, which could be easier to distribute in remote areas."
    },
    {
      "question": "What is 'Biopharming'?",
      "options": ["Farming in a laboratory", "The use of GMO plants or animals to produce medical compounds like antibodies", "Selling organic vegetables", "The study of soil bacteria"],
      "correctAnswer": "The use of GMO plants or animals to produce medical compounds like antibodies",
      "difficulty": "hard",
      "explanation": "This turns living organisms into 'factories' for complex pharmaceutical drugs."
    },
    {
      "question": "Which enzyme is specifically responsible for making 'cDNA' from an mRNA template?",
      "options": ["Restriction enzyme", "DNA Ligase", "Reverse Transcriptase", "RNA Polymerase"],
      "correctAnswer": "Reverse Transcriptase",
      "difficulty": "hard",
      "explanation": "This enzyme 'reverses' the normal flow of genetic information (DNA to RNA)."
    },
    {
      "question": "In the context of GMOs, what does 'Substantial Equivalence' mean?",
      "options": ["All GMOs are identical to each other.", "A GMO is considered as safe as its conventional counterpart if its composition is similar.", "GMOs must be twice as big as normal food.", "The cost of GMOs is equal to normal food."],
      "correctAnswer": "A GMO is considered as safe as its conventional counterpart if its composition is similar.",
      "difficulty": "hard",
      "explanation": "This is a regulatory concept used to assess the safety of new biotech foods."
    },
    {
      "question": "What is the risk of 'Gene Flow' in gene technology?",
      "options": ["The DNA flowing out of a cell", "The movement of genes from GMO crops to wild or non-GMO plants via pollen", "The speed of blood in a modified animal", "Water flowing through a farm"],
      "correctAnswer": "The movement of genes from GMO crops to wild or non-GMO plants via pollen",
      "difficulty": "moderate",
      "explanation": "Gene flow can lead to 'contamination' of organic farms or the creation of hybrids in the wild."
    }
  ],
  "Unit 22: Variation and adaptive features": [
    {
      "question": "Which of the following best defines 'Variation'?",
      "options": ["Differences between individuals of the same species", "Differences between different species", "The process of cloning organisms", "The similarity between parents and offspring"],
      "correctAnswer": "Differences between individuals of the same species",
      "difficulty": "easy",
      "explanation": "Variation refers to the biological differences that exist between individuals belonging to the same species."
    },
    {
      "question": "What are the two main causes of variation in living organisms?",
      "options": ["Diet and exercise", "Genetic and environmental factors", "Mutation and cloning", "Climate and geography"],
      "correctAnswer": "Genetic and environmental factors",
      "difficulty": "easy",
      "explanation": "Variation can be inherited (genetic) or acquired through life experiences and surroundings (environmental)."
    },
    {
      "question": "Which type of variation is characterized by a range of intermediate phenotypes between two extremes?",
      "options": ["Discontinuous variation", "Continuous variation", "Discrete variation", "Mutational variation"],
      "correctAnswer": "Continuous variation",
      "difficulty": "moderate",
      "explanation": "Continuous variation shows a complete range of measurements, such as height or mass."
    },
    {
      "question": "In which type of variation do individuals fall into distinct categories with no intermediates?",
      "options": ["Continuous variation", "Environmental variation", "Discontinuous variation", "Polygenic variation"],
      "correctAnswer": "Discontinuous variation",
      "difficulty": "moderate",
      "explanation": "Discontinuous variation involves clear-cut categories, such as blood groups or the ability to roll the tongue."
    },
    {
      "question": "Which of the following is an example of continuous variation in humans?",
      "options": ["ABO Blood groups", "Biological sex", "Body mass", "Fingerprint patterns"],
      "correctAnswer": "Body mass",
      "difficulty": "easy",
      "explanation": "Body mass can take any value within a range and is influenced by both genes and diet."
    },
    {
      "question": "Discontinuous variation is usually controlled by:",
      "options": ["A single gene or a few genes", "Many genes (polygenes)", "Environmental factors only", "The age of the individual"],
      "correctAnswer": "A single gene or a few genes",
      "difficulty": "moderate",
      "explanation": "Because it results in distinct categories, it is usually the result of one or a few genes with little environmental influence."
    },
    {
      "question": "A graph showing continuous variation typically forms a:",
      "options": ["Bar chart with gaps", "Pie chart", "Normal distribution curve (bell-shaped)", "Linear line through the origin"],
      "correctAnswer": "Normal distribution curve (bell-shaped)",
      "difficulty": "moderate",
      "explanation": "Most individuals cluster around the mean, with fewer individuals at the extremes."
    },
    {
      "question": "Which of these is purely a result of genetic variation?",
      "options": ["Language spoken", "Blood group", "Muscle strength", "Tattoo patterns"],
      "correctAnswer": "Blood group",
      "difficulty": "easy",
      "explanation": "Blood groups are determined solely by the alleles inherited from parents."
    },
    {
      "question": "A random change in the base sequence of DNA is called a:",
      "options": ["Variation", "Mutation", "Adaptation", "Selection"],
      "correctAnswer": "Mutation",
      "difficulty": "easy",
      "explanation": "Mutations are spontaneous changes in the genetic code."
    },
    {
      "question": "What is the primary source of 'new' alleles in a population?",
      "options": ["Mitosis", "Mutation", "Fertilization", "Migration"],
      "correctAnswer": "Mutation",
      "difficulty": "moderate",
      "explanation": "Mutations create brand new genetic sequences, which introduces new alleles into the gene pool."
    },
    {
      "question": "Which of the following increases the rate of mutation?",
      "options": ["Drinking water", "Ionizing radiation (e.g., Gamma rays)", "Sleeping 8 hours", "Eating vegetables"],
      "correctAnswer": "Ionizing radiation (e.g., Gamma rays)",
      "difficulty": "easy",
      "explanation": "Mutagens like X-rays, UV light, and certain chemicals increase the frequency of mutations."
    },
    {
      "question": "Sickle-cell anemia is caused by a mutation that affects which protein?",
      "options": ["Insulin", "Amylase", "Hemoglobin", "Keratin"],
      "correctAnswer": "Hemoglobin",
      "difficulty": "moderate",
      "explanation": "A point mutation changes the shape of hemoglobin, causing red blood cells to become sickle-shaped."
    },
    {
      "question": "What are 'Adaptive Features'?",
      "options": ["Features that make an organism look pretty", "Inherited features that increase an organism's fitness and chance of survival", "Features acquired through surgery", "Random mutations that have no effect"],
      "correctAnswer": "Inherited features that increase an organism's fitness and chance of survival",
      "difficulty": "moderate",
      "explanation": "Adaptive features help an organism survive and reproduce in its specific environment."
    },
    {
      "question": "Hydrophytes are plants that are adapted to live in:",
      "options": ["Deserts", "Very salty water", "Water or very wet habitats", "Areas with high wind"],
      "correctAnswer": "Water or very wet habitats",
      "difficulty": "easy",
      "explanation": "Hydro- means water. Examples include water lilies."
    },
    {
      "question": "Which of the following is a common adaptation of a Xerophyte?",
      "options": ["Large, thin leaves", "Stomata on the upper surface of leaves", "Sunken stomata and thick waxy cuticles", "Lack of roots"],
      "correctAnswer": "Sunken stomata and thick waxy cuticles",
      "difficulty": "moderate",
      "explanation": "These features help reduce water loss through transpiration in dry environments."
    },
    {
      "question": "Why do many hydrophytes have large air spaces in their tissues?",
      "options": ["To store food", "To provide buoyancy and allow gas exchange", "To keep the plant warm", "To absorb more sunlight"],
      "correctAnswer": "To provide buoyancy and allow gas exchange",
      "difficulty": "moderate",
      "explanation": "Air spaces (aerenchyma) help the plant float and ensure oxygen reaches submerged parts."
    },
    {
      "question": "Fitness is defined as the probability of an organism:",
      "options": ["Winning a race", "Living a long time", "Surviving and reproducing in the environment in which it is found", "Mutation rate"],
      "correctAnswer": "Surviving and reproducing in the environment in which it is found",
      "difficulty": "moderate",
      "explanation": "Biological fitness is specifically about the ability to pass genes to the next generation."
    },
    {
      "question": "A plant with very long roots reaching deep underground is likely a:",
      "options": ["Hydrophyte", "Mesophyte", "Xerophyte", "Epiphyte"],
      "correctAnswer": "Xerophyte",
      "difficulty": "easy",
      "explanation": "Long roots allow desert plants to access deep water tables."
    },
    {
      "question": "What happens to the distribution of phenotypes in a population when natural selection occurs?",
      "options": ["It becomes random.", "Alleles for adaptive features become more frequent over time.", "The population size always decreases.", "Mutations stop occurring."],
      "correctAnswer": "Alleles for adaptive features become more frequent over time.",
      "difficulty": "hard",
      "explanation": "Individuals with better adaptations survive and pass those alleles to their offspring."
    },
    {
      "question": "Which type of graph would you use to represent the distribution of human blood groups?",
      "options": ["Line graph", "Histogram", "Bar chart", "Scatter plot"],
      "correctAnswer": "Bar chart",
      "difficulty": "moderate",
      "explanation": "Discontinuous data is plotted on bar charts with gaps between bars to represent distinct categories."
    },
    {
      "question": "Assertion: Mutation is always harmful to an organism.\nReason: Mutations change the DNA sequence which can alter protein function.",
      "options": ["Both Assertion and Reason are true, and Reason is the correct explanation.", "Both Assertion and Reason are true, but Reason is not the correct explanation.", "Assertion is false, but Reason is true.", "Assertion is true, but Reason is false."],
      "correctAnswer": "Assertion is false, but Reason is true.",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "While many mutations are harmful or neutral, some can be beneficial and lead to better adaptation."
    },
    {
      "question": "Select ALL examples of discontinuous variation:",
      "multiSelect": true,
      "options": ["Height", "Skin color", "Blood group", "Sex", "Eye color (distinct categories)"],
      "correctAnswer": ["Blood group", "Sex", "Eye color (distinct categories)"],
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "Height and skin color show a continuous range of variation."
    },
    {
      "question": "Which feature of a cactus is an adaptation to reduce transpiration?",
      "options": ["Green stem", "Spines instead of leaves", "Large flowers", "Fleshy fruit"],
      "correctAnswer": "Spines instead of leaves",
      "difficulty": "easy",
      "explanation": "Spines have a very small surface area compared to leaves, minimizing water loss."
    },
    {
      "question": "What is 'Natural Selection'?",
      "options": ["Humans choosing which animals to breed", "The process by which organisms with better adaptations survive and reproduce", "The creation of new species in a lab", "The migration of animals to new lands"],
      "correctAnswer": "The process by which organisms with better adaptations survive and reproduce",
      "difficulty": "moderate",
      "explanation": "It is the mechanism proposed by Charles Darwin to explain evolution."
    },
    {
      "question": "People who are heterozygous for the sickle-cell allele (HbS HbA) have a resistance to which disease?",
      "options": ["Cholera", "Malaria", "Influenza", "Tuberculosis"],
      "correctAnswer": "Malaria",
      "difficulty": "hard",
      "explanation": "This is known as heterozygote advantage; the sickle-cell trait provides protection against malaria parasites."
    },
    {
      "question": "Which of the following is an environmental factor that can cause variation in plants?",
      "options": ["Sunlight intensity", "Type of alleles inherited", "Number of chromosomes", "DNA replication speed"],
      "correctAnswer": "Sunlight intensity",
      "difficulty": "easy",
      "explanation": "Light, water, and soil nutrients are major environmental drivers of plant variation."
    },
    {
      "question": "What characterizes 'Normal Distribution'?",
      "options": ["All values are equal.", "Most values are at the extremes.", "Mean, median, and mode are the same, and data is symmetrical around the center.", "Data is randomly scattered."],
      "correctAnswer": "Mean, median, and mode are the same, and data is symmetrical around the center.",
      "difficulty": "hard",
      "explanation": "This describes the bell curve seen in continuous variation."
    },
    {
      "question": "A mutation that changes a single nucleotide in a gene is a:",
      "options": ["Gene mutation", "Chromosome mutation", "Cell mutation", "Species mutation"],
      "correctAnswer": "Gene mutation",
      "difficulty": "moderate",
      "explanation": "Gene mutations are small-scale changes within the DNA of a single gene."
    },
    {
      "question": "The development of antibiotic resistance in bacteria is an example of:",
      "options": ["Selective breeding", "Natural selection", "Discontinuous variation", "Hydrophytic adaptation"],
      "correctAnswer": "Natural selection",
      "difficulty": "moderate",
      "explanation": "Bacteria with mutations that allow them to survive antibiotics reproduce, passing the resistance to the next generation."
    },
    {
      "question": "Which adaptation is found in 'Water Lilies' (hydrophytes)?",
      "options": ["Stomata only on the bottom of the leaf", "Stomata only on the top of the leaf", "No stomata at all", "Stomata that stay closed all day"],
      "correctAnswer": "Stomata only on the top of the leaf",
      "difficulty": "hard",
      "explanation": "Since the bottom is in contact with water, stomata on the top allow for gas exchange with the atmosphere."
    },
    {
      "question": "Variation within a population is important because it:",
      "options": ["Makes everyone look the same", "Allows the population to adapt to changing environments", "Prevents mutations", "Decreases the chance of survival"],
      "correctAnswer": "Allows the population to adapt to changing environments",
      "difficulty": "moderate",
      "explanation": "Genetic variation is the raw material for natural selection."
    },
    {
      "question": "What is a 'Mutagen'?",
      "options": ["A person who studies mutations", "An agent that causes a mutation", "A beneficial mutation", "A type of bacteria"],
      "correctAnswer": "An agent that causes a mutation",
      "difficulty": "easy",
      "explanation": "Mutagens can be physical (radiation) or chemical (tobacco smoke)."
    },
    {
      "question": "In the context of evolution, 'Selection Pressure' refers to:",
      "options": ["The force of gravity", "Environmental factors that favor certain phenotypes over others", "The pressure inside a cell", "The weight of the atmosphere"],
      "correctAnswer": "Environmental factors that favor certain phenotypes over others",
      "difficulty": "hard",
      "explanation": "Selection pressures include predators, disease, and competition for resources."
    },
    {
      "question": "Which of these is a characteristic of discontinuous variation?",
      "options": ["Affected by environment", "Represented by a histogram", "Controlled by multiple genes", "No intermediate forms"],
      "correctAnswer": "No intermediate forms",
      "difficulty": "moderate",
      "explanation": "You either have the trait or you don't; there is no 'in-between'."
    },
    {
      "question": "Down syndrome is an example of a:",
      "options": ["Gene mutation", "Chromosome mutation", "Adaptive feature", "Continuous variation"],
      "correctAnswer": "Chromosome mutation",
      "difficulty": "moderate",
      "explanation": "It is caused by having an extra copy of chromosome 21 (Trisomy 21)."
    },
    {
      "question": "Xerophytes often have 'reduced leaves'. What is the purpose of this?",
      "options": ["To catch more rain", "To reduce the surface area for transpiration", "To make the plant lighter", "To hide from herbivores"],
      "correctAnswer": "To reduce the surface area for transpiration",
      "difficulty": "easy",
      "explanation": "Smaller surface area means fewer stomata and less water loss."
    },
    {
      "question": "Which of the following describes 'Acquired Characteristics'?",
      "options": ["Traits passed down through DNA", "Traits developed during an organism's life (e.g., a scar)", "Traits that never change", "Traits found in all members of a species"],
      "correctAnswer": "Traits developed during an organism's life (e.g., a scar)",
      "difficulty": "easy",
      "explanation": "Acquired traits are generally not passed on to offspring because they don't affect gametes."
    },
    {
      "question": "The range of height in a classroom of students is an example of:",
      "options": ["Continuous variation", "Discontinuous variation", "Mutation", "Genetic engineering"],
      "correctAnswer": "Continuous variation",
      "difficulty": "easy",
      "explanation": "Height can be measured precisely and varies incrementally."
    },
    {
      "question": "What is the result of 'Competition' in a population with limited resources?",
      "options": ["Everyone gets equal shares.", "Individuals with better adaptations are more likely to survive.", "All individuals die.", "Mutations stop happening."],
      "correctAnswer": "Individuals with better adaptations are more likely to survive.",
      "difficulty": "moderate",
      "explanation": "Competition is a key driver of natural selection ('survival of the fittest')."
    },
    {
      "question": "True or False: Most mutations are beneficial to an organism.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Most mutations are either neutral (no effect) or harmful (e.g., causing disease)."
    },
    {
      "question": "Which of the following is a structural adaptation of a camel for the desert?",
      "options": ["Storing water in humps", "Long eyelashes to keep out sand", "Hibernation during summer", "Eating meat"],
      "correctAnswer": "Long eyelashes to keep out sand",
      "difficulty": "easy",
      "explanation": "Note: Camel humps store fat, not liquid water, which provides energy and metabolic water."
    },
    {
      "question": "How do 'Sunken Stomata' help xerophytes?",
      "options": ["They absorb more CO2.", "They trap moist air near the leaf surface, reducing the diffusion gradient for water.", "They allow the plant to breathe underwater.", "They prevent the plant from being eaten."],
      "correctAnswer": "They trap moist air near the leaf surface, reducing the diffusion gradient for water.",
      "difficulty": "hard",
      "explanation": "By trapping moisture, they reduce the rate of transpiration."
    },
    {
      "question": "What is the genotypic basis for 'Discontinuous Variation'?",
      "options": ["Alleles of a single gene", "Interaction of many genes", "No genes involved", "Mutation of the whole genome"],
      "correctAnswer": "Alleles of a single gene",
      "difficulty": "moderate",
      "explanation": "Simple Mendelian inheritance patterns usually produce discontinuous variation."
    },
    {
      "question": "Identify the 'error' in the list of mutagenic agents:",
      "options": ["X-rays", "Benzene", "Nitrogen gas", "Radioactive waste"],
      "correctAnswer": "Nitrogen gas",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Nitrogen gas makes up 78% of our atmosphere and is not considered a mutagen."
    },
    {
      "question": "Which of these adaptations would be most useful for a plant living in a rainforest floor (low light)?",
      "options": ["Small, needle-like leaves", "Broad leaves with large surface area", "Thick waxy cuticle", "No roots"],
      "correctAnswer": "Broad leaves with large surface area",
      "difficulty": "moderate",
      "explanation": "Large leaves maximize the capture of the limited sunlight available under the canopy."
    },
    {
      "question": "What is 'Evolution'?",
      "options": ["The change in the frequency of alleles in a population over many generations", "The growth of a single animal", "A process that only happened in the past", "The same thing as mutation"],
      "correctAnswer": "The change in the frequency of alleles in a population over many generations",
      "difficulty": "hard",
      "explanation": "Evolution is a population-level process occurring over long time scales."
    },
    {
      "question": "In a histogram for continuous variation, what does the x-axis represent?",
      "options": ["Number of individuals", "The range of the characteristic (e.g., height in cm)", "Time", "Categories like 'Type A' or 'Type B'"],
      "correctAnswer": "The range of the characteristic (e.g., height in cm)",
      "difficulty": "moderate",
      "explanation": "The x-axis shows the continuous scale of measurement."
    },
    {
      "question": "Which term describes the role an organism plays in its environment, including its adaptations?",
      "options": ["Habitat", "Niche", "Community", "Ecosystem"],
      "correctAnswer": "Niche",
      "difficulty": "hard",
      "explanation": "An organism's niche is shaped by its adaptive features."
    },
    {
      "question": "Fill in the blank: _____ variation is influenced significantly by the environment, whereas _____ variation is not.",
      "options": ["Continuous, Discontinuous", "Discontinuous, Continuous", "Genetic, Environmental", "Mutation, Selection"],
      "correctAnswer": "Continuous, Discontinuous",
      "difficulty": "moderate",
      "type": "fillBlank",
      "explanation": "Environmental factors like diet affect continuous traits (height), but not discontinuous ones (blood group)."
    },
    {
      "question": "Why is 'Sickle-cell Anemia' common in West Africa?",
      "options": ["It is caused by the climate.", "The sickle-cell allele provides a survival advantage against malaria, which is common there.", "It is a contagious disease.", "Because people there don't eat enough iron."],
      "correctAnswer": "The sickle-cell allele provides a survival advantage against malaria, which is common there.",
      "difficulty": "moderate",
      "explanation": "Natural selection favors the allele in malaria-prone regions because carriers survive better."
    },
    {
      "question": "A mutation in a body (somatic) cell:",
      "options": ["Will be passed to all offspring", "Will only affect that individual and not be passed to offspring", "Causes the whole species to change", "Is always beneficial"],
      "correctAnswer": "Will only affect that individual and not be passed to offspring",
      "difficulty": "hard",
      "explanation": "Only mutations in gametes (eggs/sperm) can be inherited by the next generation."
    },
    {
      "question": "Which of these is a behavioral adaptation?",
      "options": ["A polar bear's thick fur", "A bird migrating south for the winter", "A cactus storing water", "A snake's venom"],
      "correctAnswer": "A bird migrating south for the winter",
      "difficulty": "easy",
      "explanation": "Behavioral adaptations involve the way an organism acts to survive."
    },
    {
      "question": "In a population of insects, some are green and some are brown. If the environment changes from a forest to a desert, what is likely to happen?",
      "options": ["They will all die.", "Brown insects will have a survival advantage and their population will likely increase.", "Green insects will turn brown immediately.", "No change will occur."],
      "correctAnswer": "Brown insects will have a survival advantage and their population will likely increase.",
      "difficulty": "moderate",
      "type": "situational",
      "explanation": "Camouflage is an adaptive feature that depends on the environment."
    },
    {
      "question": "What is the difference between 'Innate' and 'Learned' behavior?",
      "options": ["Innate is genetic; learned is acquired through experience.", "Innate is learned; learned is genetic.", "There is no difference.", "Innate only happens in plants."],
      "correctAnswer": "Innate is genetic; learned is acquired through experience.",
      "difficulty": "moderate",
      "explanation": "Both can be considered adaptive features if they improve survival."
    },
    {
      "question": "Which characteristic is most likely to show a bell-shaped curve in a population?",
      "options": ["Number of legs", "Intelligence quotient (IQ)", "Ability to roll the tongue", "Presence of a tail"],
      "correctAnswer": "Intelligence quotient (IQ)",
      "difficulty": "moderate",
      "explanation": "IQ is a polygenic trait influenced by the environment, typical of continuous variation."
    },
    {
      "question": "What is the main advantage of being a 'Carrier' (heterozygous) for a recessive genetic disorder?",
      "options": ["You have the disease but it is mild.", "You do not have the disease but may have a survival advantage against a different disease (like malaria).", "You can never pass the gene to your children.", "You are immune to all mutations."],
      "correctAnswer": "You do not have the disease but may have a survival advantage against a different disease (like malaria).",
      "difficulty": "hard",
      "explanation": "Carriers function normally but carry the hidden allele which can offer protection in specific environments."
    },
    {
      "question": "Which of these is a 'Physiological' adaptation?",
      "options": ["The production of concentrated urine by desert animals", "The presence of sharp claws on a lion", "A bird building a nest", "The white fur of a polar bear"],
      "correctAnswer": "The production of concentrated urine by desert animals",
      "difficulty": "hard",
      "explanation": "Physiological adaptations involve internal processes or chemical changes that help an organism survive."
    },
    {
      "question": "What is the primary reason for 'Stomatal Closure' during the hottest part of the day in xerophytes?",
      "options": ["To increase photosynthesis", "To prevent excessive water loss through transpiration", "To absorb more oxygen", "To cool down the leaf temperature"],
      "correctAnswer": "To prevent excessive water loss through transpiration",
      "difficulty": "moderate",
      "explanation": "Closing stomata reduces the exit of water vapor, preserving the plant's internal water supply."
    },
    {
      "question": "A 'Point Mutation' is best described as:",
      "options": ["The loss of an entire chromosome", "A change in a single base pair in DNA", "The doubling of the genome", "The movement of a gene to a new chromosome"],
      "correctAnswer": "A change in a single base pair in DNA",
      "difficulty": "moderate",
      "explanation": "Point mutations (like those causing sickle-cell) involve one 'point' or letter in the genetic code being changed."
    },
    {
      "question": "Which of the following describes 'Stabilizing Selection'?",
      "options": ["Selection that favors both extremes", "Selection that favors the average or intermediate phenotype", "Selection that favors only one extreme", "Selection that creates new mutations"],
      "correctAnswer": "Selection that favors the average or intermediate phenotype",
      "difficulty": "hard",
      "explanation": "Stabilizing selection reduces variation by selecting against extreme phenotypes (e.g., human birth weight)."
    },
    {
      "question": "In the 'Normal Distribution' of a trait, what percentage of the population typically falls within one standard deviation of the mean?",
      "options": ["50%", "68%", "95%", "99%"],
      "correctAnswer": "68%",
      "difficulty": "hard",
      "type": "calculation",
      "explanation": "In a bell curve, approximately 68% of individuals are very close to the average value."
    },
    {
      "question": "What is 'Polyploidy'?",
      "options": ["A gene mutation", "Having more than two complete sets of chromosomes", "A lack of skin pigment", "The ability to eat many different types of food"],
      "correctAnswer": "Having more than two complete sets of chromosomes",
      "difficulty": "hard",
      "explanation": "Polyploidy is a chromosome mutation common in plants that can lead to larger fruits or flowers."
    },
    {
      "question": "Which adaptation allows a 'Mangrove' tree to survive in salty, oxygen-poor mud?",
      "options": ["Sunken stomata", "Pneumatophores (breathing roots)", "Broad leaves", "Lack of a cuticle"],
      "correctAnswer": "Pneumatophores (breathing roots)",
      "difficulty": "hard",
      "explanation": "Pneumatophores grow upwards out of the water to absorb oxygen for the root system."
    },
    {
      "question": "What is the 'Gene Pool' of a population?",
      "options": ["A literal pool of water containing DNA", "The total collection of all alleles in a population", "The list of mutated genes only", "The DNA stored in a laboratory"],
      "correctAnswer": "The total collection of all alleles in a population",
      "difficulty": "moderate",
      "explanation": "Evolution is essentially the change in allele frequencies within the gene pool over time."
    },
    {
      "question": "Identify the 'Environmental' cause of variation in human skin color:",
      "options": ["Inherited melanin levels", "Exposure to ultraviolet (UV) sunlight", "The number of genes involved", "Parental genotypes"],
      "correctAnswer": "Exposure to ultraviolet (UV) sunlight",
      "difficulty": "easy",
      "explanation": "While baseline skin color is genetic, tanning is a variation caused by the environment."
    },
    {
      "question": "Which of the following is a result of 'Disruptive Selection'?",
      "options": ["The population becomes identical.", "The average phenotype is eliminated, favoring both extremes.", "The population goes extinct.", "Mutations are prevented."],
      "correctAnswer": "The average phenotype is eliminated, favoring both extremes.",
      "difficulty": "hard",
      "explanation": "Disruptive selection can lead to the formation of two distinct groups within a population."
    },
    {
      "question": "In xerophytes, 'Succulence' refers to:",
      "options": ["The sweetness of the fruit", "The storage of water in fleshy stems or leaves", "The ability to grow very fast", "The presence of thorns"],
      "correctAnswer": "The storage of water in fleshy stems or leaves",
      "difficulty": "moderate",
      "explanation": "Succulent plants (like Aloe) store water internally to survive long periods of drought."
    },
    {
      "question": "True or False: All mutations result in a change in the phenotype.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Silent mutations change the DNA but do not change the amino acid sequence, so the protein remains the same."
    },
    {
      "question": "Which term describes a mutation that provides a survival advantage in a specific environment?",
      "options": ["Harmful mutation", "Neutral mutation", "Beneficial mutation", "Silent mutation"],
      "correctAnswer": "Beneficial mutation",
      "difficulty": "easy",
      "explanation": "Beneficial mutations are the primary drivers of evolution through natural selection."
    },
    {
      "question": "What is 'Speciation'?",
      "options": ["The death of a species", "The formation of new and distinct species in the course of evolution", "The study of space", "The process of counting animals"],
      "correctAnswer": "The formation of new and distinct species in the course of evolution",
      "difficulty": "moderate",
      "explanation": "Speciation occurs when populations become so different that they can no longer interbreed."
    },
    {
      "question": "Adaptive features are the result of:",
      "options": ["Random luck", "Selective breeding by humans", "Natural selection acting on variation over many generations", "Intelligent planning by the organism"],
      "correctAnswer": "Natural selection acting on variation over many generations",
      "difficulty": "moderate",
      "explanation": "Adaptations are 'honed' over time as less fit individuals are removed from the gene pool."
    },
    {
      "question": "A person with 'Albinism' lacks the ability to produce:",
      "options": ["Insulin", "Melanin", "Hemoglobin", "Thyroxine"],
      "correctAnswer": "Melanin",
      "difficulty": "easy",
      "explanation": "Albinism is a genetic condition resulting in little or no pigment in the skin, hair, and eyes."
    },
    {
      "question": "Which graph type is used for 'Discrete' data like the number of petals on a flower?",
      "options": ["Line graph", "Bar chart", "Histogram", "Scatter plot"],
      "correctAnswer": "Bar chart",
      "difficulty": "moderate",
      "explanation": "Discrete data (whole numbers) is a form of discontinuous variation and uses bar charts."
    },
    {
      "question": "What is 'Genetic Drift'?",
      "options": ["The movement of genes through wind", "Random changes in allele frequencies, especially in small populations", "The intentional movement of genes by scientists", "When a species swims across an ocean"],
      "correctAnswer": "Random changes in allele frequencies, especially in small populations",
      "difficulty": "hard",
      "explanation": "Unlike natural selection, genetic drift is due to chance events, not 'fitness'."
    },
    {
      "question": "Which feature of a 'Polar Bear' is a structural adaptation for warmth?",
      "options": ["Black skin under white fur to absorb heat", "Hunting seals", "Hibernating in winter", "Swimming long distances"],
      "correctAnswer": "Black skin under white fur to absorb heat",
      "difficulty": "moderate",
      "explanation": "The black skin absorbs the sun's rays that pass through the translucent fur."
    },
    {
      "question": "Fill in the blank: The differences between a poodle and a bulldog are examples of _____ variation caused by human intervention.",
      "options": ["Natural", "Artificial", "Continuous", "Discontinuous"],
      "correctAnswer": "Artificial",
      "difficulty": "easy",
      "type": "fillBlank",
      "explanation": "This is specifically called 'artificial selection' or 'selective breeding'."
    }
  ],
   "Unit 23: Natural and artificial selection": [
    {
      "question": "Which scientist is best known for proposing the theory of natural selection?",
      "options": ["Gregor Mendel", "Charles Darwin", "Robert Hooke", "Louis Pasteur"],
      "correctAnswer": "Charles Darwin",
      "difficulty": "easy",
      "explanation": "Charles Darwin published 'On the Origin of Species' in 1859, explaining how evolution occurs via natural selection."
    },
    {
      "question": "What is the primary mechanism behind natural selection?",
      "options": ["Random mutation without reproduction", "Survival of the fittest and reproduction", "Artificial breeding by humans", "Acquiring traits during a lifetime"],
      "correctAnswer": "Survival of the fittest and reproduction",
      "difficulty": "easy",
      "explanation": "Natural selection occurs when individuals with advantageous traits survive and pass those traits to their offspring."
    },
    {
      "question": "In the context of natural selection, what does 'fitness' mean?",
      "options": ["The physical strength of an individual", "The ability to run fast", "The probability of an organism surviving and reproducing", "The size of an organism"],
      "correctAnswer": "The probability of an organism surviving and reproducing",
      "difficulty": "moderate",
      "explanation": "Biological fitness measures the success of an organism in passing its genes to the next generation."
    },
    {
      "question": "Which of the following is a key requirement for natural selection to occur?",
      "options": ["A stable environment", "Genetic variation within the population", "Identical offspring", "Unlimited resources"],
      "correctAnswer": "Genetic variation within the population",
      "difficulty": "moderate",
      "explanation": "Without variation, there would be no differences for nature to 'select' from."
    },
    {
      "question": "The production of more offspring than the environment can support leads to:",
      "options": ["Extinction", "Competition for resources", "Universal survival", "Mutation"],
      "correctAnswer": "Competition for resources",
      "difficulty": "moderate",
      "explanation": "Overproduction leads to a struggle for existence, where only the best-adapted individuals survive."
    },
    {
      "question": "What is 'Artificial Selection'?",
      "options": ["Selection controlled by environmental changes", "The process where humans breed organisms for desired traits", "Random mating in the wild", "The evolution of robots"],
      "correctAnswer": "The process where humans breed organisms for desired traits",
      "difficulty": "easy",
      "explanation": "Artificial selection, or selective breeding, is driven by human choice rather than environmental pressure."
    },
    {
      "question": "Which of the following is an example of artificial selection?",
      "options": ["Development of antibiotic resistance in bacteria", "The long neck of a giraffe", "Breeding cows for high milk production", "Camouflage in peppered moths"],
      "correctAnswer": "Breeding cows for high milk production",
      "difficulty": "easy",
      "explanation": "Humans choose cows that produce more milk to parent the next generation."
    },
    {
      "question": "What is a major disadvantage of selective breeding (artificial selection)?",
      "options": ["It takes too much time", "It results in higher yields", "It can lead to a loss of genetic diversity and inbreeding", "It creates new species too quickly"],
      "correctAnswer": "It can lead to a loss of genetic diversity and inbreeding",
      "difficulty": "moderate",
      "explanation": "Selective breeding often involves breeding closely related individuals, which can increase the risk of genetic disorders."
    },
    {
      "question": "The evolution of the peppered moth (Biston betularia) during the Industrial Revolution is a classic example of:",
      "options": ["Artificial selection", "Natural selection", "Selective breeding", "Genetic engineering"],
      "correctAnswer": "Natural selection",
      "difficulty": "moderate",
      "explanation": "The change in environment (soot-covered trees) gave dark moths a survival advantage over light ones."
    },
    {
      "question": "Which process is much faster at changing a population's characteristics?",
      "options": ["Natural selection", "Artificial selection", "Genetic drift", "Speciation"],
      "correctAnswer": "Artificial selection",
      "difficulty": "moderate",
      "explanation": "Humans can exert very strong selection pressure, changing traits significantly in just a few generations."
    },
    {
      "question": "Antibiotic resistance in bacteria is evidence of:",
      "options": ["Human error", "Natural selection in action", "Artificial selection", "Spontaneous generation"],
      "correctAnswer": "Natural selection in action",
      "difficulty": "moderate",
      "explanation": "Antibiotics act as a selection pressure; only resistant bacteria survive and multiply."
    },
    {
      "question": "Selective breeding in plants is often used to produce crops that are:",
      "options": ["Small and bitter", "Resistant to diseases and have high yields", "Wild and unmanageable", "Genetically identical to weeds"],
      "correctAnswer": "Resistant to diseases and have high yields",
      "difficulty": "easy",
      "explanation": "Agricultural breeding focuses on traits that benefit human consumption and food security."
    },
    {
      "question": "What is the primary selection pressure in 'Natural Selection'?",
      "options": ["Human demand", "The environment", "Laboratory equipment", "Pet owners"],
      "correctAnswer": "The environment",
      "difficulty": "easy",
      "explanation": "Environmental factors like predators, climate, and food availability determine survival."
    },
    {
      "question": "In artificial selection, the traits being selected are those that are:",
      "options": ["Beneficial for the organism's survival in the wild", "Beneficial to humans", "Completely random", "Hidden in the genotype"],
      "correctAnswer": "Beneficial to humans",
      "difficulty": "easy",
      "explanation": "Traits like sweetness in fruit or docility in dogs may not help the organism survive in nature, but humans prefer them."
    },
    {
      "question": "Which of these describes 'Inbreeding Depression'?",
      "options": ["An animal feeling sad", "Reduction in fitness due to breeding closely related individuals", "Increased genetic variation", "The process of extinction"],
      "correctAnswer": "Reduction in fitness due to breeding closely related individuals",
      "difficulty": "hard",
      "explanation": "Inbreeding increases the frequency of homozygous recessive genotypes, which may carry harmful mutations."
    },
    {
      "question": "How do new traits originally appear in a population?",
      "options": ["Through artificial selection", "Through natural selection", "Through mutation", "Through adaptation"],
      "correctAnswer": "Through mutation",
      "difficulty": "moderate",
      "explanation": "Mutations are the ultimate source of new genetic variation."
    },
    {
      "question": "Which of the following describes 'Directional Selection'?",
      "options": ["Selection that favors the average phenotype", "Selection that favors one extreme phenotype over others", "Selection that favors both extremes", "Selection that prevents change"],
      "correctAnswer": "Selection that favors one extreme phenotype over others",
      "difficulty": "hard",
      "explanation": "An example is the increase in beak size of finches during a drought."
    },
    {
      "question": "Wild mustard plants being bred to create broccoli, cabbage, and kale is an example of:",
      "options": ["Natural selection", "Artificial selection", "Natural variation", "Adaptive radiation"],
      "correctAnswer": "Artificial selection",
      "difficulty": "moderate",
      "explanation": "By selecting for different parts of the wild mustard plant, humans created diverse vegetable crops."
    },
    {
      "question": "Which term describes the process where organisms not closely related independently evolve similar traits?",
      "options": ["Convergent evolution", "Divergent evolution", "Co-evolution", "Artificial selection"],
      "correctAnswer": "Convergent evolution",
      "difficulty": "hard",
      "explanation": "Example: The streamlined bodies of dolphins (mammals) and sharks (fish)."
    },
    {
      "question": "Selection pressure is:",
      "options": ["The weight of an animal", "An environmental factor that alters the frequency of alleles in a population", "The blood pressure of a bird", "A tool used in artificial breeding"],
      "correctAnswer": "An environmental factor that alters the frequency of alleles in a population",
      "difficulty": "moderate",
      "explanation": "Selection pressures include competition, predation, and disease."
    },
    {
      "question": "True or False: Natural selection acts on the phenotype, but changes the genotype of the population over time.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "hard",
      "type": "trueFalse",
      "explanation": "Nature selects observable traits (phenotypes), which leads to changes in allele frequencies (genotypes) in the next generation."
    },
    {
      "question": "Which of the following is NOT a goal of selective breeding in animals?",
      "options": ["Faster growth rates", "Increased resistance to disease", "Maintaining high genetic diversity", "Improving the quality of wool or meat"],
      "correctAnswer": "Maintaining high genetic diversity",
      "difficulty": "moderate",
      "explanation": "Selective breeding actually tends to decrease genetic diversity because only a few individuals are chosen to breed."
    },
    {
      "question": "Darwin's finches on the Galápagos Islands show variation primarily in their:",
      "options": ["Color", "Beak shape", "Wing span", "Leg length"],
      "correctAnswer": "Beak shape",
      "difficulty": "easy",
      "explanation": "The beaks were adapted to different food sources available on different islands."
    },
    {
      "question": "What happens to individuals that are less 'fit' for their environment?",
      "options": ["They adapt immediately.", "They are less likely to survive and reproduce.", "They change their DNA to survive.", "They migrate to another planet."],
      "correctAnswer": "They are less likely to survive and reproduce",
      "difficulty": "easy",
      "explanation": "Poorly adapted individuals contribute fewer alleles to the gene pool of the next generation."
    },
    {
      "question": "Artificial selection is also known as:",
      "options": ["Natural choice", "Selective breeding", "Evolutionary drift", "Random selection"],
      "correctAnswer": "Selective breeding",
      "difficulty": "easy",
      "explanation": "These terms are used interchangeably in biology."
    },
    {
      "question": "The use of herbicides on weeds can lead to 'Superweeds' through:",
      "options": ["Artificial selection", "Natural selection", "Photosynthesis", "Inbreeding"],
      "correctAnswer": "Natural selection",
      "difficulty": "moderate",
      "explanation": "The herbicide is the selection pressure; only resistant weeds survive to reproduce."
    },
    {
      "question": "Which of the following is a result of natural selection?",
      "options": ["The existence of different dog breeds", "The high sugar content in seedless grapes", "The camouflage of a stick insect", "The docility of domestic cats"],
      "correctAnswer": "The camouflage of a stick insect",
      "difficulty": "moderate",
      "explanation": "Camouflage is a survival adaptation evolved in the wild."
    },
    {
      "question": "Assertion: Selective breeding can produce new varieties of plants in a short time.\nReason: Humans provide strong selection pressure by choosing only specific individuals to reproduce.",
      "options": [
        "Both Assertion and Reason are true, and Reason is the correct explanation.",
        "Both Assertion and Reason are true, but Reason is not the correct explanation.",
        "Assertion is true, but Reason is false.",
        "Assertion is false, but Reason is true."
      ],
      "correctAnswer": "Both Assertion and Reason are true, and Reason is the correct explanation.",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Human intervention accelerates the process compared to natural selection."
    },
    {
      "question": "The 'Gene Pool' of a population that has undergone heavy artificial selection is usually:",
      "options": ["Increased", "Reduced", "Unchanged", "Randomized"],
      "correctAnswer": "Reduced",
      "difficulty": "moderate",
      "explanation": "By selecting only specific traits, many other alleles are lost from the population."
    },
    {
      "question": "Which type of variation is most important for natural selection?",
      "options": ["Environmental variation", "Heritable genetic variation", "Acquired characteristics", "Variation in age"],
      "correctAnswer": "Heritable genetic variation",
      "difficulty": "moderate",
      "explanation": "Only traits that can be passed to offspring (genetic) contribute to evolution."
    },
    {
      "question": "Domesticated wheat having larger grains than wild wheat is due to:",
      "options": ["Natural selection", "Artificial selection", "Genetic drift", "Climate change"],
      "correctAnswer": "Artificial selection",
      "difficulty": "easy",
      "explanation": "Early farmers saved the seeds from plants with the largest grains to plant the next year."
    },
    {
      "question": "Natural selection can only occur if there is:",
      "options": ["Human interest", "Genetic variation", "A laboratory", "A very large animal"],
      "correctAnswer": "Genetic variation",
      "difficulty": "easy",
      "explanation": "Variation is the raw material for evolution."
    },
    {
      "question": "What is 'Speciation'?",
      "options": ["The extinction of a species", "The process by which one species splits into two or more new species", "The study of fossils", "The growth of an individual"],
      "correctAnswer": "The process by which one species splits into two or more new species",
      "difficulty": "moderate",
      "explanation": "Natural selection can lead to speciation if populations are isolated long enough."
    },
    {
      "question": "What is the common ancestor of all domestic dog breeds?",
      "options": ["The fox", "The gray wolf", "The hyena", "The coyote"],
      "correctAnswer": "The gray wolf",
      "difficulty": "easy",
      "explanation": "Humans selectively bred gray wolves over thousands of years to create modern dogs."
    },
    {
      "question": "In a population of birds, if those with medium-sized beaks survive better than those with very small or very large beaks, this is:",
      "options": ["Directional selection", "Stabilizing selection", "Disruptive selection", "Artificial selection"],
      "correctAnswer": "Stabilizing selection",
      "difficulty": "hard",
      "explanation": "Stabilizing selection favors the intermediate variants."
    },
    {
      "question": "Which of the following is a potential risk of selective breeding in crops?",
      "options": ["Higher food prices", "Increased vulnerability to a single disease due to genetic uniformity", "Crops becoming too nutritious", "Plants growing too slowly"],
      "correctAnswer": "Increased vulnerability to a single disease due to genetic uniformity",
      "difficulty": "hard",
      "explanation": "If all plants are genetically similar, a disease that kills one can kill the entire crop."
    },
    {
      "question": "Which term describes a trait that increases an organism's chance of survival?",
      "options": ["Mutation", "Adaptation", "Variation", "Genotype"],
      "correctAnswer": "Adaptation",
      "difficulty": "easy",
      "explanation": "Adaptations are the products of natural selection."
    },
    {
      "question": "Darwin observed that tortoises on different Galápagos islands had different shell shapes. This was an example of:",
      "options": ["Natural selection", "Artificial selection", "Genetic engineering", "Acquired traits"],
      "correctAnswer": "Natural selection",
      "difficulty": "moderate",
      "explanation": "The shell shapes were adapted to the vegetation and environment of each specific island."
    },
    {
      "question": "What is the main difference between natural and artificial selection?",
      "options": ["Only natural selection involves genes.", "Natural selection happens in the wild; artificial is driven by humans.", "Artificial selection is always slower.", "Natural selection only happens to animals."],
      "correctAnswer": "Natural selection happens in the wild; artificial is driven by humans.",
      "difficulty": "easy",
      "explanation": "The 'selector' is the environment in nature and humans in artificial selection."
    },
    {
      "question": "Selective breeding can lead to physical problems in animals, such as breathing difficulties in pugs. This is because:",
      "options": ["Pugs are natural animals.", "Humans selected for certain aesthetic traits without considering the animal's health.", "Pugs have too much genetic variation.", "Natural selection favored short snouts."],
      "correctAnswer": "Humans selected for certain aesthetic traits without considering the animal's health.",
      "difficulty": "moderate",
      "explanation": "Artificial selection focuses on human preferences, which can sometimes be harmful to the organism."
    },
    {
      "question": "The term 'Struggle for Existence' refers to:",
      "options": ["War between humans", "Competition for limited resources like food, water, and space", "The process of birth", "Hibernation"],
      "correctAnswer": "Competition for limited resources like food, water, and space",
      "difficulty": "moderate",
      "explanation": "This struggle is a central part of Darwin's theory of natural selection."
    },
    {
      "question": "A farmer chooses the two largest pigs to mate. This is an example of:",
      "options": ["Natural selection", "Selective breeding", "Evolution", "Mutation"],
      "correctAnswer": "Selective breeding",
      "difficulty": "easy",
      "explanation": "The farmer is intentionally choosing parents based on desired traits."
    },
    {
      "question": "Which of the following is NOT a step in natural selection?",
      "options": ["Variation", "Overproduction", "Human choice", "Inheritance"],
      "correctAnswer": "Human choice",
      "difficulty": "easy",
      "explanation": "Human choice is only a factor in artificial selection."
    },
    {
      "question": "When a population becomes divided by a physical barrier (like a mountain range), it can lead to:",
      "options": ["Artificial selection", "Speciation", "Universal mating", "Instant mutation"],
      "correctAnswer": "Speciation",
      "difficulty": "moderate",
      "explanation": "Geographical isolation prevents interbreeding, allowing populations to evolve separately."
    },
    {
      "question": "Which organism would likely evolve the fastest through natural selection?",
      "options": ["An elephant", "A human", "A bacterium", "A turtle"],
      "correctAnswer": "A bacterium",
      "difficulty": "moderate",
      "explanation": "Organisms with short generation times can evolve much faster."
    },
    {
      "question": "What is 'Inbreeding'?",
      "options": ["Breeding individuals with different traits", "Breeding closely related individuals", "Breeding two different species", "Mating in the wild"],
      "correctAnswer": "Breeding closely related individuals",
      "difficulty": "easy",
      "explanation": "Inbreeding is often used in artificial selection to 'fix' certain traits."
    },
    {
      "question": "Genetic variation is caused by:",
      "options": ["Mutation and sexual reproduction", "Cloning", "Identical twins", "Eating different foods"],
      "correctAnswer": "Mutation and sexual reproduction",
      "difficulty": "moderate",
      "explanation": "Mutations create new alleles, and sexual reproduction shuffles them into new combinations."
    },
    {
      "question": "True or False: Individuals can evolve during their own lifetime.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Populations evolve over generations; individuals only adapt or acclimate, they do not change their genetic makeup."
    },
    {
      "question": "The fact that all modern cabbage, broccoli, and cauliflower come from the same wild ancestor is a result of:",
      "options": ["Natural selection", "Artificial selection", "Photosynthesis", "Convergent evolution"],
      "correctAnswer": "Artificial selection",
      "difficulty": "moderate",
      "explanation": "Humans selected for different traits (buds, leaves, stems) from the same starting plant."
    },
    {
      "question": "Which of the following is an example of a 'Selection Pressure'?",
      "options": ["A predator", "A new disease", "A change in temperature", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Any factor that affects the survival or reproduction of an organism is a selection pressure."
    },
    {
      "question": "The 'Best-Adapted' individuals are those that:",
      "options": ["Are the strongest", "Are the biggest", "Have traits that allow them to survive and reproduce best in their current environment", "Have the most mutations"],
      "correctAnswer": "Have traits that allow them to survive and reproduce best in their current environment",
      "difficulty": "moderate",
      "explanation": "Adaptation is always relative to the specific environment."
    },
    {
      "question": "In artificial selection, what is the 'Desired Trait'?",
      "options": ["The trait that allows survival in the wild", "The trait that the breeder wants to see in the offspring", "A trait that is always a mutation", "The most common trait"],
      "correctAnswer": "The trait that the breeder wants to see in the offspring",
      "difficulty": "easy",
      "explanation": "Breeders select based on their own goals (e.g., speed in horses, color in flowers)."
    },
    {
      "question": "What happens to the frequency of advantageous alleles in a population over time?",
      "options": ["It decreases.", "It increases.", "It remains the same.", "It becomes zero."],
      "correctAnswer": "It increases.",
      "difficulty": "moderate",
      "explanation": "Because individuals with these alleles reproduce more successfully, the alleles become more common."
    },
    {
      "question": "Which of the following is a limitation of artificial selection?",
      "options": ["It can only work with existing genetic variation.", "It can create new genes out of nowhere.", "It is only possible with plants.", "It has no impact on DNA."],
      "correctAnswer": "It can only work with existing genetic variation.",
      "difficulty": "hard",
      "explanation": "Breeders can only select traits that are already present or appear through mutation; they cannot 'order' a specific new gene."
    },
    {
      "question": "Which of these traits was likely NOT favored by natural selection in the wild?",
      "options": ["Sharp teeth in a predator", "Resistance to cold in a penguin", "High fat content in modern domestic pigs", "Speed in a gazelle"],
      "correctAnswer": "High fat content in modern domestic pigs",
      "difficulty": "moderate",
      "explanation": "High fat content was selected for by humans for food; it would likely be a disadvantage in the wild."
    },
    {
      "question": "Place the steps of Natural Selection in the correct order:",
      "orderCorrect": [
        "Genetic variation exists in a population.",
        "Overproduction of offspring leads to competition.",
        "Individuals with advantageous traits survive.",
        "Advantageous alleles are passed to offspring.",
        "The frequency of the advantageous trait increases in the population."
      ],
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "The process moves from existing variation to environmental selection and finally to population-level change."
    }
  ],
    "Final Comprehensive Biology Review (Unit 1-23)": [
    {
      "question": "Which characteristic of living organisms involves the permanent increase in size and dry mass?",
      "options": ["Movement", "Excretion", "Growth", "Nutrition"],
      "correctAnswer": "Growth",
      "difficulty": "easy",
      "explanation": "Growth is defined as a permanent increase in size and dry mass by an increase in cell number or cell size."
    },
    {
      "question": "What is the correct order of classification levels, starting from the broadest?",
      "options": ["Kingdom, Phylum, Class, Order, Family, Genus, Species", "Kingdom, Class, Phylum, Order, Family, Genus, Species", "Species, Genus, Family, Order, Class, Phylum, Kingdom", "Phylum, Kingdom, Class, Order, Family, Genus, Species"],
      "correctAnswer": "Kingdom, Phylum, Class, Order, Family, Genus, Species",
      "difficulty": "moderate",
      "explanation": "The hierarchy of classification moves from general (Kingdom) to specific (Species)."
    },
    {
      "question": "Which organelle is known as the site of aerobic respiration?",
      "options": ["Chloroplast", "Ribosome", "Mitochondrion", "Vacuole"],
      "correctAnswer": "Mitochondrion",
      "difficulty": "easy",
      "explanation": "Mitochondria are the 'powerhouses' of the cell where energy is released from glucose."
    },
    {
      "question": "What is the function of the ciliated cells in the respiratory tract?",
      "options": ["To absorb oxygen", "To produce mucus", "To move mucus and trapped dust away from the lungs", "To detect odors"],
      "correctAnswer": "To move mucus and trapped dust away from the lungs",
      "difficulty": "moderate",
      "explanation": "Cilia are hair-like extensions that beat in a coordinated way to transport mucus."
    },
    {
      "question": "Diffusion is the net movement of particles from a region of:",
      "options": ["Lower concentration to higher concentration", "Higher concentration to lower concentration", "Equal concentration to zero concentration", "Inside the cell to outside only"],
      "correctAnswer": "Higher concentration to lower concentration",
      "difficulty": "easy",
      "explanation": "Diffusion is a passive process occurring down a concentration gradient."
    },
    {
      "question": "Osmosis is specifically the diffusion of which substance through a partially permeable membrane?",
      "options": ["Sugar", "Salt", "Water", "Oxygen"],
      "correctAnswer": "Water",
      "difficulty": "easy",
      "explanation": "Osmosis refers exclusively to the movement of water molecules."
    },
    {
      "question": "If a plant cell is placed in a solution with a higher water potential than the cell, it becomes:",
      "options": ["Turgid", "Flaccid", "Plasmolysed", "Crenated"],
      "correctAnswer": "Turgid",
      "difficulty": "moderate",
      "explanation": "Water enters the cell by osmosis, pushing the cytoplasm against the cell wall, making it turgid."
    },
    {
      "question": "Which chemical element is found in proteins but not in carbohydrates or lipids?",
      "options": ["Carbon", "Hydrogen", "Oxygen", "Nitrogen"],
      "correctAnswer": "Nitrogen",
      "difficulty": "moderate",
      "explanation": "Proteins (amino acids) contain Nitrogen (and sometimes Sulfur), whereas carbs and lipids contain only C, H, and O."
    },
    {
      "question": "What is the test for the presence of reducing sugars?",
      "options": ["Iodine test", "Biuret test", "Benedict's test", "Ethanol emulsion test"],
      "correctAnswer": "Benedict's test",
      "difficulty": "moderate",
      "explanation": "Benedict's solution turns from blue to brick-red when heated with a reducing sugar."
    },
    {
      "question": "Which part of an enzyme molecule is complementary to the shape of its substrate?",
      "options": ["The product site", "The active site", "The nucleus", "The ribosome"],
      "correctAnswer": "The active site",
      "difficulty": "easy",
      "explanation": "The 'Lock and Key' hypothesis describes how the substrate fits into the active site."
    },
    {
      "question": "Enzymes are biological catalysts because they:",
      "options": ["Are used up in the reaction", "Increase the activation energy", "Speed up chemical reactions without being changed", "Only work at 0°C"],
      "correctAnswer": "Speed up chemical reactions without being changed",
      "difficulty": "easy",
      "explanation": "Catalysts accelerate reactions and remain chemically unchanged at the end."
    },
    {
      "question": "What is the equation for photosynthesis?",
      "options": ["Carbon dioxide + Water -> Glucose + Oxygen", "Glucose + Oxygen -> Carbon dioxide + Water", "Carbon dioxide + Oxygen -> Glucose + Water", "Glucose + Water -> Carbon dioxide + Oxygen"],
      "correctAnswer": "Carbon dioxide + Water -> Glucose + Oxygen",
      "difficulty": "easy",
      "explanation": "Light energy is used to convert CO2 and water into chemical energy (glucose)."
    },
    {
      "question": "Which mineral ion is required by plants to make chlorophyll?",
      "options": ["Nitrate", "Magnesium", "Phosphate", "Potassium"],
      "correctAnswer": "Magnesium",
      "difficulty": "moderate",
      "explanation": "Magnesium forms the center of the chlorophyll molecule; without it, leaves turn yellow (chlorosis)."
    },
    {
      "question": "In which part of the leaf does most photosynthesis occur?",
      "options": ["Upper epidermis", "Spongy mesophyll", "Palisade mesophyll", "Vascular bundle"],
      "correctAnswer": "Palisade mesophyll",
      "difficulty": "moderate",
      "explanation": "Palisade cells are tightly packed and contain many chloroplasts to maximize light absorption."
    },
    {
      "question": "A balanced diet for a human must include:",
      "options": ["Only carbohydrates and proteins", "Carbohydrates, fats, proteins, vitamins, minerals, water, and fiber", "Only fast food and water", "Large amounts of sugar and salt"],
      "correctAnswer": "Carbohydrates, fats, proteins, vitamins, minerals, water, and fiber",
      "difficulty": "easy",
      "explanation": "A balanced diet provides all necessary nutrients in the correct proportions."
    },
    {
      "question": "Which vitamin deficiency leads to the disease 'Scurvy'?",
      "options": ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"],
      "correctAnswer": "Vitamin C",
      "difficulty": "easy",
      "explanation": "Vitamin C is essential for healthy skin and gums."
    },
    {
      "question": "What is 'Ingestion'?",
      "options": ["Breaking down large food molecules", "Taking substances into the body through the mouth", "Moving digested food into the blood", "Passing out indigestible food"],
      "correctAnswer": "Taking substances into the body through the mouth",
      "difficulty": "easy",
      "explanation": "Ingestion is the first stage of the digestive process."
    },
    {
      "question": "Where is bile produced and where is it stored?",
      "options": ["Produced in Stomach, stored in Liver", "Produced in Liver, stored in Gall bladder", "Produced in Pancreas, stored in Gall bladder", "Produced in Liver, stored in Pancreas"],
      "correctAnswer": "Produced in Liver, stored in Gall bladder",
      "difficulty": "moderate",
      "explanation": "Bile emulsifies fats and neutralizes stomach acid."
    },
    {
      "question": "Xylem vessels are responsible for the transport of:",
      "options": ["Sucrose and amino acids", "Water and mineral ions", "Oxygen and CO2", "Blood"],
      "correctAnswer": "Water and mineral ions",
      "difficulty": "easy",
      "explanation": "Xylem transports water upwards from roots to leaves."
    },
    {
      "question": "Transpiration is the loss of water vapor from plant leaves through the:",
      "options": ["Cuticle", "Stomata", "Xylem", "Phloem"],
      "correctAnswer": "Stomata",
      "difficulty": "easy",
      "explanation": "Water evaporates from the surfaces of mesophyll cells and exits via stomata."
    },
    {
      "question": "Which side of the human heart pumps deoxygenated blood to the lungs?",
      "options": ["Left side", "Right side", "Both sides", "The Septum"],
      "correctAnswer": "Right side",
      "difficulty": "moderate",
      "explanation": "The right ventricle pumps blood through the pulmonary artery to the lungs."
    },
    {
      "question": "Which blood vessel carries oxygenated blood from the lungs back to the heart?",
      "options": ["Pulmonary artery", "Pulmonary vein", "Aorta", "Vena cava"],
      "correctAnswer": "Pulmonary vein",
      "difficulty": "moderate",
      "explanation": "Veins usually carry deoxygenated blood, but the pulmonary vein is an exception."
    },
    {
      "question": "What is the function of phagocytes?",
      "options": ["Produce antibodies", "Carry oxygen", "Engulf and digest pathogenic microorganisms", "Clot the blood"],
      "correctAnswer": "Engulf and digest pathogenic microorganisms",
      "difficulty": "moderate",
      "explanation": "Phagocytosis is a non-specific immune response."
    },
    {
      "question": "The 'double circulatory system' means that:",
      "options": ["Blood flows through the heart twice for every one complete circuit of the body", "Humans have two hearts", "Blood flows in two directions in every vessel", "Oxygen and CO2 are carried by the same cell"],
      "correctAnswer": "Blood flows through the heart twice for every one complete circuit of the body",
      "difficulty": "moderate",
      "explanation": "It includes a pulmonary circuit (to lungs) and a systemic circuit (to body)."
    },
    {
      "question": "Which component of the blood is responsible for clotting?",
      "options": ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
      "correctAnswer": "Platelets",
      "difficulty": "easy",
      "explanation": "Platelets release chemicals to form a mesh that traps blood cells."
    },
    {
      "question": "In aerobic respiration, glucose is broken down in the presence of:",
      "options": ["Carbon dioxide", "Nitrogen", "Oxygen", "Water"],
      "correctAnswer": "Oxygen",
      "difficulty": "easy",
      "explanation": "Aerobic respiration releases a large amount of energy using oxygen."
    },
    {
      "question": "What is the product of anaerobic respiration in human muscle cells?",
      "options": ["Ethanol and CO2", "Lactic acid", "Glucose", "Water"],
      "correctAnswer": "Lactic acid",
      "difficulty": "moderate",
      "explanation": "Lactic acid buildup causes muscle fatigue and oxygen debt."
    },
    {
      "question": "Which structure in the respiratory system is the site of gas exchange?",
      "options": ["Trachea", "Bronchi", "Alveoli", "Diaphragm"],
      "correctAnswer": "Alveoli",
      "difficulty": "easy",
      "explanation": "Alveoli have a huge surface area and thin walls for efficient diffusion."
    },
    {
      "question": "During inhalation, the diaphragm and external intercostal muscles:",
      "options": ["Relax", "Contract", "Stay the same", "Expand"],
      "correctAnswer": "Contract",
      "difficulty": "moderate",
      "explanation": "Contraction increases the volume of the thorax and lowers pressure."
    },
    {
      "question": "Excretion is the removal of:",
      "options": ["Undigested food", "Toxic materials and waste products of metabolism", "Excess water only", "Oxygen"],
      "correctAnswer": "Toxic materials and waste products of metabolism",
      "difficulty": "moderate",
      "explanation": "Metabolic waste includes urea and CO2."
    },
    {
      "question": "Which organ excretes urea, excess water, and excess salts?",
      "options": ["Lungs", "Liver", "Kidneys", "Stomach"],
      "correctAnswer": "Kidneys",
      "difficulty": "easy",
      "explanation": "The kidneys filter blood to produce urine."
    },
    {
      "question": "What is the functional unit of the kidney called?",
      "options": ["Neuron", "Nephron", "Alveolus", "Villus"],
      "correctAnswer": "Nephron",
      "difficulty": "moderate",
      "explanation": "Thousands of nephrons perform filtration and reabsorption."
    },
    {
      "question": "Hormones are chemical substances produced by _____ and transported in the _____.",
      "options": ["Muscles, nerves", "Glands, blood", "Stomach, urine", "Brain, air"],
      "correctAnswer": "Glands, blood",
      "difficulty": "easy",
      "explanation": "Endocrine glands secrete hormones directly into the bloodstream."
    },
    {
      "question": "Which hormone is responsible for the 'fight or flight' response?",
      "options": ["Insulin", "Adrenaline", "Testosterone", "Oestrogen"],
      "correctAnswer": "Adrenaline",
      "difficulty": "easy",
      "explanation": "Adrenaline increases heart rate and blood glucose levels during stress."
    },
    {
      "question": "Homeostasis is the maintenance of a constant:",
      "options": ["External environment", "Internal environment", "Heart rate", "Height"],
      "correctAnswer": "Internal environment",
      "difficulty": "moderate",
      "explanation": "It regulates factors like temperature and blood glucose."
    },
    {
      "question": "Which hormone is secreted by the pancreas to lower blood glucose levels?",
      "options": ["Glucagon", "Insulin", "Glycogen", "Adrenaline"],
      "correctAnswer": "Insulin",
      "difficulty": "moderate",
      "explanation": "Insulin stimulates the liver to convert glucose into glycogen."
    },
    {
      "question": "In a simple reflex arc, what is the correct sequence of neurons?",
      "options": ["Motor -> Relay -> Sensory", "Sensory -> Relay -> Motor", "Relay -> Sensory -> Motor", "Sensory -> Motor -> Relay"],
      "correctAnswer": "Sensory -> Relay -> Motor",
      "difficulty": "hard",
      "explanation": "The impulse travels from the receptor to the CNS and then to the effector."
    },
    {
      "question": "What is the 'blind spot' in the eye?",
      "options": ["The center of the retina", "Where the optic nerve leaves the eye and there are no photoreceptors", "The pupil", "The lens"],
      "correctAnswer": "Where the optic nerve leaves the eye and there are no photoreceptors",
      "difficulty": "moderate",
      "explanation": "Images falling on this specific area cannot be detected."
    },
    {
      "question": "A tropism is a growth response of a plant to a directional:",
      "options": ["Hormone", "Stimulus", "Water", "Soil"],
      "correctAnswer": "Stimulus",
      "difficulty": "easy",
      "explanation": "Examples include phototropism (light) and gravitropism (gravity)."
    },
    {
      "question": "What is 'Asexual Reproduction'?",
      "options": ["Production of genetically different offspring", "Production of genetically identical offspring from one parent", "Fusion of two gametes", "Reproduction involving flowers only"],
      "correctAnswer": "Production of genetically identical offspring from one parent",
      "difficulty": "easy",
      "explanation": "It results in clones and does not involve fertilization."
    },
    {
      "question": "The fusion of haploid gamete nuclei is called:",
      "options": ["Pollination", "Fertilization", "Germination", "Mitosis"],
      "correctAnswer": "Fertilization",
      "difficulty": "easy",
      "explanation": "Fertilization produces a diploid zygote."
    },
    {
      "question": "In a flower, where are the female gametes (ovules) produced?",
      "options": ["Anther", "Stigma", "Ovary", "Filament"],
      "correctAnswer": "Ovary",
      "difficulty": "easy",
      "explanation": "The ovary contains ovules which develop into seeds after fertilization."
    },
    {
      "question": "Which hormone stimulates the development of secondary sexual characteristics in males?",
      "options": ["Progesterone", "Oestrogen", "Testosterone", "Insulin"],
      "correctAnswer": "Testosterone",
      "difficulty": "easy",
      "explanation": "Testosterone is produced in the testes."
    },
    {
      "question": "On which day of a typical 28-day menstrual cycle does ovulation usually occur?",
      "options": ["Day 1", "Day 7", "Day 14", "Day 28"],
      "correctAnswer": "Day 14",
      "difficulty": "moderate",
      "explanation": "Ovulation is triggered by a surge in LH."
    },
    {
      "question": "Which of these is a method of birth control that also protects against STIs?",
      "options": ["The Pill", "Vasectomy", "Condom", "IUD"],
      "correctAnswer": "Condom",
      "difficulty": "easy",
      "explanation": "Condoms provide a physical barrier against pathogens."
    },
    {
      "question": "What is the 'Genotype' of an organism?",
      "options": ["Its physical appearance", "Its genetic makeup", "Its favorite food", "Its age"],
      "correctAnswer": "Its genetic makeup",
      "difficulty": "easy",
      "explanation": "Genotype is usually represented by alleles (e.g., Bb)."
    },
    {
      "question": "If an individual has two different alleles for a trait (e.g., Tt), they are:",
      "options": ["Homozygous", "Heterozygous", "Haploid", "Recessive"],
      "correctAnswer": "Heterozygous",
      "difficulty": "moderate",
      "explanation": "Hetero- means different."
    },
    {
      "question": "A cross between a red flower (RR) and a white flower (rr) results in all offspring being (Rr). This is the:",
      "options": ["F1 generation", "F2 generation", "P generation", "Homozygous generation"],
      "correctAnswer": "F1 generation",
      "difficulty": "moderate",
      "explanation": "F1 stands for 'first filial'."
    },
    {
      "question": "The sex chromosomes of a human male are:",
      "options": ["XX", "YY", "XY", "XO"],
      "correctAnswer": "XY",
      "difficulty": "easy",
      "explanation": "Females are XX, males are XY."
    },
    {
      "question": "What is 'Co-dominance'?",
      "options": ["One allele hides another", "Both alleles are expressed in the phenotype", "Alleles blend together", "Only one allele exists"],
      "correctAnswer": "Both alleles are expressed in the phenotype",
      "difficulty": "moderate",
      "explanation": "An example is blood group AB."
    },
    {
      "question": "In genetic engineering, what is used to 'cut' the DNA?",
      "options": ["DNA Ligase", "Restriction enzymes", "Plasmids", "Microscopes"],
      "correctAnswer": "Restriction enzymes",
      "difficulty": "moderate",
      "explanation": "Restriction enzymes cut at specific base sequences."
    },
    {
      "question": "What is a 'GMO'?",
      "options": ["General Medical Organism", "Genetically Modified Organism", "Greater Molecular Organ", "Growth Modified Ovule"],
      "correctAnswer": "Genetically Modified Organism",
      "difficulty": "easy",
      "explanation": "An organism whose DNA has been altered using technology."
    },
    {
      "question": "Which enzyme 'glues' the gene into the plasmid?",
      "options": ["Amylase", "DNA Ligase", "Protease", "Lipase"],
      "correctAnswer": "DNA Ligase",
      "difficulty": "moderate",
      "explanation": "Ligase seals the sugar-phosphate backbone."
    },
    {
      "question": "What is an advantage of GMO crops like Bt cotton?",
      "options": ["They need more water", "They produce their own insecticide", "They are much smaller", "They only grow in the dark"],
      "correctAnswer": "They produce their own insecticide",
      "difficulty": "moderate",
      "explanation": "This reduces the need for chemical pesticide sprays."
    },
    {
      "question": "Variation that shows a range of intermediate values (like height) is:",
      "options": ["Discontinuous", "Continuous", "Mutation", "Selection"],
      "correctAnswer": "Continuous",
      "difficulty": "easy",
      "explanation": "Continuous variation is usually represented by a bell curve."
    },
    {
      "question": "A sudden change in the DNA sequence is called a:",
      "options": ["Variation", "Mutation", "Evolution", "Natural selection"],
      "correctAnswer": "Mutation",
      "difficulty": "easy",
      "explanation": "Mutations can be caused by radiation or chemicals."
    },
    {
      "question": "Which of these is an example of discontinuous variation?",
      "options": ["Height", "Blood group", "Body mass", "Intelligence"],
      "correctAnswer": "Blood group",
      "difficulty": "moderate",
      "explanation": "Blood groups have distinct categories with no intermediates."
    },
    {
      "question": "Natural selection was proposed by:",
      "options": ["Mendel", "Darwin", "Watson", "Crick"],
      "correctAnswer": "Darwin",
      "difficulty": "easy",
      "explanation": "Charles Darwin's observations led to the theory of evolution."
    },
    {
      "question": "Adaptive features are traits that increase an organism's:",
      "options": ["Size", "Fitness (survival and reproduction)", "Speed only", "Colors"],
      "correctAnswer": "Fitness (survival and reproduction)",
      "difficulty": "moderate",
      "explanation": "Fitness is the biological measure of success."
    },
    {
      "question": "Xerophytes are plants adapted to:",
      "options": ["Wetlands", "Saltwater", "Dry conditions", "Cold climates"],
      "correctAnswer": "Dry conditions",
      "difficulty": "easy",
      "explanation": "They have features like thick waxy cuticles and sunken stomata."
    },
    {
      "question": "Artificial selection is also called:",
      "options": ["Natural selection", "Selective breeding", "Genetic engineering", "Mutation"],
      "correctAnswer": "Selective breeding",
      "difficulty": "easy",
      "explanation": "Humans choose which individuals breed based on desired traits."
    },
    {
      "question": "Which blood vessel carries blood away from the heart?",
      "options": ["Vein", "Artery", "Capillary", "Vena cava"],
      "correctAnswer": "Artery",
      "difficulty": "easy",
      "explanation": "Arteries (A for Away) have thick muscular walls."
    },
    {
      "question": "What is the function of the ribosome?",
      "options": ["Energy production", "Protein synthesis", "Photosynthesis", "Digestion"],
      "correctAnswer": "Protein synthesis",
      "difficulty": "easy",
      "explanation": "Ribosomes read mRNA to build chains of amino acids."
    },
    {
      "question": "The movement of sucrose in the phloem is called:",
      "options": ["Transpiration", "Translocation", "Transformation", "Translation"],
      "correctAnswer": "Translocation",
      "difficulty": "moderate",
      "explanation": "Translocation moves sugars from 'source' to 'sink'."
    },
    {
      "question": "In a pedigree chart, what does a circle represent?",
      "options": ["A male", "A female", "An affected individual", "A carrier"],
      "correctAnswer": "A female",
      "difficulty": "easy",
      "explanation": "Squares represent males; circles represent females."
    },
    {
      "question": "Which gas is used in aerobic respiration?",
      "options": ["Carbon dioxide", "Oxygen", "Nitrogen", "Methane"],
      "correctAnswer": "Oxygen",
      "difficulty": "easy",
      "explanation": "Oxygen is the final electron acceptor in the process."
    },
    {
      "question": "Antibiotics are used to kill:",
      "options": ["Viruses", "Bacteria", "Fungi", "All of the above"],
      "correctAnswer": "Bacteria",
      "difficulty": "moderate",
      "explanation": "Antibiotics do not work against viruses (like the flu or HIV)."
    },
    {
      "question": "Where does fertilization usually occur in the human female?",
      "options": ["Vagina", "Uterus", "Oviduct (Fallopian tube)", "Ovary"],
      "correctAnswer": "Oviduct (Fallopian tube)",
      "difficulty": "moderate",
      "explanation": "The egg meets the sperm in the oviduct."
    },
    {
      "question": "What is the primary function of the large intestine?",
      "options": ["Digestion of protein", "Absorption of water", "Production of bile", "Breaking down fat"],
      "correctAnswer": "Absorption of water",
      "difficulty": "moderate",
      "explanation": "Water is reabsorbed from undigested food to form solid feces."
    },
    {
      "question": "Which of these is a biotic factor in an ecosystem?",
      "options": ["Temperature", "Rainfall", "Predators", "Soil pH"],
      "correctAnswer": "Predators",
      "difficulty": "easy",
      "explanation": "Biotic factors are the living components of an environment."
    },
    {
      "question": "A community and its abiotic environment is called an:",
      "options": ["Population", "Ecosystem", "Habitat", "Niche"],
      "correctAnswer": "Ecosystem",
      "difficulty": "easy",
      "explanation": "Ecosystems involve the interaction of living and non-living things."
    },
    {
      "question": "The ultimate source of energy for most ecosystems is:",
      "options": ["Glucose", "Water", "The Sun", "ATP"],
      "correctAnswer": "The Sun",
      "difficulty": "easy",
      "explanation": "Plants capture solar energy through photosynthesis."
    },
    {
      "question": "What is the position of an organism in a food chain called?",
      "options": ["Niche level", "Habitat level", "Trophic level", "Food level"],
      "correctAnswer": "Trophic level",
      "difficulty": "moderate",
      "explanation": "Producers are at the first trophic level."
    },
    {
      "question": "In a pyramid of energy, only about ___% of energy is transferred to the next level.",
      "options": ["1%", "10%", "50%", "90%"],
      "correctAnswer": "10%",
      "difficulty": "moderate",
      "explanation": "Most energy is lost as heat, movement, or undigested matter."
    },
    {
      "question": "Decomposers are organisms that:",
      "options": ["Make their own food", "Hunt other animals", "Break down dead organic matter", "Eat only plants"],
      "correctAnswer": "Break down dead organic matter",
      "difficulty": "easy",
      "explanation": "Fungi and bacteria are key decomposers that recycle nutrients."
    },
    {
      "question": "Which process removes Carbon Dioxide from the atmosphere?",
      "options": ["Respiration", "Combustion", "Photosynthesis", "Decomposition"],
      "correctAnswer": "Photosynthesis",
      "difficulty": "easy",
      "explanation": "Plants 'fix' carbon from the air into glucose."
    },
    {
      "question": "Global warming is primarily caused by the increase of:",
      "options": ["Oxygen", "Greenhouse gases like CO2 and Methane", "Nitrogen", "Helium"],
      "correctAnswer": "Greenhouse gases like CO2 and Methane",
      "difficulty": "easy",
      "explanation": "These gases trap heat in the Earth's atmosphere."
    },
    {
      "question": "What is 'Eutrophication'?",
      "options": ["The growth of trees", "The enrichment of water with nutrients leading to algae blooms and fish death", "The process of soil erosion", "The extinction of birds"],
      "correctAnswer": "The enrichment of water with nutrients leading to algae blooms and fish death",
      "difficulty": "hard",
      "explanation": "Often caused by fertilizer runoff into lakes or rivers."
    },
    {
      "question": "Which enzyme breaks down starch into maltose?",
      "options": ["Lipase", "Protease", "Amylase", "Maltase"],
      "correctAnswer": "Amylase",
      "difficulty": "moderate",
      "explanation": "Amylase is found in saliva and pancreatic juice."
    },
    {
      "question": "Human body temperature is maintained around:",
      "options": ["25°C", "37°C", "40°C", "98°C"],
      "correctAnswer": "37°C",
      "difficulty": "easy",
      "explanation": "This is the optimum temperature for human enzymes."
    },
    {
      "question": "What happens to the pupil in bright light?",
      "options": ["It dilates (gets bigger)", "It constricts (gets smaller)", "It stays the same", "It changes color"],
      "correctAnswer": "It constricts (gets smaller)",
      "difficulty": "moderate",
      "explanation": "This protects the retina from damage by limiting light entry."
    },
    {
      "question": "Which type of cell division produces gametes?",
      "options": ["Mitosis", "Meiosis", "Binary fission", "Fertilization"],
      "correctAnswer": "Meiosis",
      "difficulty": "moderate",
      "explanation": "Meiosis results in four non-identical haploid cells."
    },
    {
      "question": "What is the primary function of the amniotic sac?",
      "options": ["Provide food to the fetus", "Protect the fetus from physical damage and infection", "Allow gas exchange", "Connect to the mother's blood"],
      "correctAnswer": "Protect the fetus from physical damage and infection",
      "difficulty": "moderate",
      "explanation": "Amniotic fluid acts as a shock absorber."
    },
    {
      "question": "The movement of particles against a concentration gradient using energy is:",
      "options": ["Diffusion", "Osmosis", "Active transport", "Evaporation"],
      "correctAnswer": "Active transport",
      "difficulty": "moderate",
      "explanation": "Active transport requires protein carriers and ATP energy."
    },
    {
      "question": "Which of these is a greenhouse gas produced by cattle?",
      "options": ["Oxygen", "Methane", "Sulfur dioxide", "Carbon monoxide"],
      "correctAnswer": "Methane",
      "difficulty": "moderate",
      "explanation": "Livestock digestion is a major source of atmospheric methane."
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