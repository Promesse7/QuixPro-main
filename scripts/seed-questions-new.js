const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI ||
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

const client = new MongoClient(uri);

// ============================================================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================================================
const CONFIG = {
  subject: "Biology ANP",           // Subject name (e.g., "History", "Mathematics", "Biology")
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
  "Unit 1: Population and Natural Resources": [
    {
      question: "Which of the following terms describes a group of organisms of the same species living in the same area at a specific period of time?",
      options: ["Ecosystem", "Community", "Population", "Biome"],
      correctAnswer: "Population",
      difficulty: "easy",
      explanation: "In biology, a population is defined specifically as a group of individuals belonging to the same species that occupy a particular geographic area at a given time. This differentiates it from a community, which involves multiple species, or an ecosystem, which includes abiotic factors."
    },
    {
      question: "An ecologist counts 500 Acacia trees in a 2 square kilometer area of a national park. What is the population density of the Acacia trees?",
      options: ["250 trees per km²", "500 trees per km²", "1000 trees per km²", "125 trees per km²"],
      correctAnswer: "250 trees per km²",
      difficulty: "moderate",
      type: "calculation",
      explanation: "Population density is calculated by dividing the total number of individuals by the total area (500 trees / 2 km² = 250 trees per km²)."
    },
    {
      question: "Which factor is categorized as density-independent regarding its effect on population growth?",
      options: ["Disease outbreak", "Predation", "Flood or drought", "Competition for food"],
      correctAnswer: "Flood or drought",
      difficulty: "easy",
      explanation: "Density-independent factors affect a population regardless of its size or density. Natural disasters like floods, droughts, and fires impact individuals in an area the same way whether the population is large or small."
    },
    {
      question: "Assertion (A): Food availability is a density-dependent factor.\nReason (R): As population density increases, the food available per individual decreases, leading to higher mortality or lower birth rates.",
      options: [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      correctAnswer: "Both A and R are true, and R explains A",
      difficulty: "moderate",
      type: "assertionReason",
      explanation: "Density-dependent factors are those whose effects vary with the size of the population. Food is a classic example because competition for limited resources intensifies as the population grows."
    },
    {
      question: "Which of the following is NOT a characteristic typically used to describe a population?",
      options: ["Birth rate", "Age structure", "Trophic level", "Growth pattern"],
      correctAnswer: "Trophic level",
      difficulty: "easy",
      type: "negative",
      explanation: "Population characteristics include density, birth rate (natality), death rate (mortality), age structure, and growth patterns. Trophic level refers to an organism's position in a food chain, which is a community-level concept."
    },
    {
      question: "A researcher uses the capture-recapture method to estimate a fish population. In the first visit, 40 fish are marked and released. In the second visit, 50 fish are caught, of which 10 are marked. What is the estimated total population?",
      options: ["100", "200", "400", "2000"],
      correctAnswer: "200",
      difficulty: "hard",
      type: "calculation",
      explanation: "Using the Lincoln Index (N = (n1 * n2) / m), where n1 is the first sample (40), n2 is the second sample (50), and m is the number of marked individuals recaptured (10): (40 * 50) / 10 = 2000 / 10 = 200."
    },
    {
      question: "Which of the following environmental factors would likely decrease population density?",
      options: ["Plenty of suitable space", "Ability to resist disease", "High reproductive rate", "Inadequate food supply"],
      correctAnswer: "Inadequate food supply",
      difficulty: "easy",
      explanation: "Inadequate food supply is a limiting factor that leads to starvation or reduced reproduction, thereby decreasing the population density over time."
    },
    {
      question: "What is the primary purpose of using a quadrat in population studies?",
      options: [
        "To track the migration of birds",
        "To estimate the population of stationary or slow-moving organisms",
        "To measure the height of trees in a forest",
        "To determine the genetic diversity of a species"
      ],
      correctAnswer: "To estimate the population of stationary or slow-moving organisms",
      difficulty: "moderate",
      explanation: "Quadrats are square frames used to isolate a standard unit of area for study. They are most effective for counting plants or very slow-moving animals to estimate total population size and frequency."
    },
    {
      question: "In the context of natural resources, which of the following is considered a non-renewable resource?",
      options: ["Solar energy", "Forests", "Fossil fuels", "Water"],
      correctAnswer: "Fossil fuels",
      difficulty: "easy",
      explanation: "Non-renewable resources are those that exist in fixed amounts and cannot be replaced within a human timeframe once consumed. Fossil fuels like coal and oil take millions of years to form."
    },
    {
      question: "What does the 'carrying capacity' of an environment represent?",
      options: [
        "The total weight of all organisms in an area",
        "The maximum population size an environment can sustain indefinitely",
        "The number of offspring a female can produce in her lifetime",
        "The speed at which a population grows under ideal conditions"
      ],
      correctAnswer: "The maximum population size an environment can sustain indefinitely",
      difficulty: "moderate",
      explanation: "Carrying capacity is the limit of individuals of a species that an environment can support based on available resources like food, water, and habitat."
    },
    {
      question: "Environmental resistance refers to:",
      options: [
        "The ability of a species to survive in harsh conditions",
        "The sum of limiting factors that prevent a population from reaching its biotic potential",
        "The physical barriers preventing migration",
        "The chemical resistance of insects to pesticides"
      ],
      correctAnswer: "The sum of limiting factors that prevent a population from reaching its biotic potential",
      difficulty: "moderate",
      explanation: "Environmental resistance includes factors like predation, competition, and resource scarcity that keep a population's growth in check, preventing it from growing exponentially forever."
    },
    {
      question: "Which conservation method involves protecting a species within its natural habitat?",
      options: ["Ex-situ conservation", "In-situ conservation", "Seed banks", "Botanical gardens"],
      correctAnswer: "In-situ conservation",
      difficulty: "easy",
      explanation: "In-situ conservation occurs 'on-site,' such as in national parks or wildlife reserves. Ex-situ conservation happens 'off-site,' like in zoos or seed banks."
    },
    {
      question: "When calculating species frequency using quadrats, if a species is found in 4 out of 10 quadrats, what is the frequency?",
      options: ["4%", "40%", "0.4%", "25%"],
      correctAnswer: "40%",
      difficulty: "moderate",
      type: "calculation",
      explanation: "Frequency is calculated as the number of quadrats containing the species divided by the total number of quadrats, then multiplied by 100 ((4/10) * 100 = 40%)."
    },
    {
      question: "A stable state in which natural communities of plants and animals exist and are maintained by interactions with their environment is known as:",
      options: ["Ecological succession", "Environmental resistance", "Balance of nature", "Biotic potential"],
      correctAnswer: "Balance of nature",
      difficulty: "easy",
      explanation: "The balance of nature describes a steady state where biotic factors (like predation and competition) and abiotic factors keep the ecosystem stable over time."
    },
    {
      question: "Which of the following is a density-dependent factor that can slow down population growth?",
      options: ["A sudden volcanic eruption", "A parasitic disease outbreak", "A severe winter freeze", "A forest fire"],
      correctAnswer: "A parasitic disease outbreak",
      difficulty: "moderate",
      explanation: "Parasitism and disease spread more easily in high-density populations because individuals are in closer contact, making it a density-dependent factor."
    },
    {
      question: "Select all that apply: Which of the following are examples of renewable resources?",
      options: ["Solar Energy", "Wind Energy", "Natural Gas", "Tidal Energy"],
      correctAnswer: ["Solar Energy", "Wind Energy", "Tidal Energy"],
      difficulty: "moderate",
      multiSelect: true,
      type: "multiple",
      explanation: "Solar, wind, and tidal energy are renewable because they are naturally replenished. Natural gas is a fossil fuel and is non-renewable."
    },
    {
      question: "The practice of family planning is highlighted as a tool to address which issue?",
      options: ["Species extinction", "Population explosion", "Soil erosion", "Deforestation"],
      correctAnswer: "Population explosion",
      difficulty: "easy",
      explanation: "Family planning helps regulate human population growth rates, preventing the negative environmental impacts associated with a population explosion."
    },
    {
      question: "Which method of measuring population density would be best for a field of wildflowers?",
      options: ["Capture-recapture", "Direct counting from a helicopter", "Quadrat sampling", "Lincoln Index"],
      correctAnswer: "Quadrat sampling",
      difficulty: "easy",
      explanation: "Quadrat sampling is the standard method for sessile (non-moving) organisms like plants."
    },
    {
      question: "Identify the error in this statement: 'Biotic potential is the maximum growth rate of a population when resources are limited.'",
      options: [
        "The error is 'maximum growth rate'",
        "The error is 'limited'",
        "The error is 'population'",
        "No error"
      ],
      correctAnswer: "The error is 'limited'",
      difficulty: "moderate",
      type: "errorIdentification",
      explanation: "Biotic potential is the maximum growth rate possible under *ideal* (unlimited) conditions, not limited ones."
    },
    {
      question: "Which human activity is explicitly mentioned as a major threat to biodiversity and leads to the extinction of species like elephants and rhinos?",
      options: ["Selective breeding", "Poaching", "Organic farming", "Rainwater harvesting"],
      correctAnswer: "Poaching",
      difficulty: "easy",
      explanation: "Poaching for tusks and skins is a significant driver of biodiversity loss and threatens many large mammal species with extinction."
    },
    {
      question: "What happens to a population's growth rate as it approaches its carrying capacity (K)?",
      options: [
        "It increases exponentially",
        "It remains constant",
        "It slows down and levels off",
        "It immediately drops to zero"
      ],
      correctAnswer: "It slows down and levels off",
      difficulty: "moderate",
      explanation: "As a population nears K, environmental resistance (limited resources, increased competition) reduces the growth rate until the population size stabilizes."
    },
    {
      question: "Which of the following is an example of ex-situ conservation?",
      options: ["Akagera National Park", "A DNA bank", "A forest reserve", "A marine protected area"],
      correctAnswer: "A DNA bank",
      difficulty: "moderate",
      explanation: "Ex-situ conservation involves preserving biological components outside their natural habitats. DNA banks, zoos, and seed banks are examples."
    },
    {
      question: "In a population age structure diagram, a broad base (many young individuals) typically indicates:",
      options: [
        "A declining population",
        "A stable population",
        "A rapidly growing population",
        "A high life expectancy"
      ],
      correctAnswer: "A rapidly growing population",
      difficulty: "moderate",
      explanation: "A broad base means there are many individuals entering reproductive age, which usually leads to rapid population growth."
    },
    {
      question: "The number of individuals of the same species per unit volume is a measure of:",
      options: ["Population distribution", "Population density", "Population frequency", "Population biomass"],
      correctAnswer: "Population density",
      difficulty: "easy",
      explanation: "Population density can be measured per unit area (for land organisms) or per unit volume (for aquatic or microscopic organisms)."
    },
    {
      question: "Which biotic interaction causes a reduction in prey numbers and affects the ecosystem balance?",
      options: ["Photosynthesis", "Predation", "Mutualism", "Commensalism"],
      correctAnswer: "Predation",
      difficulty: "easy",
      explanation: "Predation is a biotic factor where one organism kills and eats another, directly regulating the prey population size."
    },
    {
      question: "The _________ is the unit of natural selection and evolution.",
      options: ["Individual", "Population", "Community", "Ecosystem"],
      correctAnswer: "Population",
      difficulty: "moderate",
      type: "fillBlank",
      explanation: "Evolution is defined as changes in allele frequencies within a population over time; individuals do not evolve, populations do."
    },
    {
      question: "Which of these is a way to conserve water resources?",
      options: ["Increasing industrial waste runoff", "Deforestation of catchment areas", "Harvesting rainwater", "Overuse of groundwater"],
      correctAnswer: "Harvesting rainwater",
      difficulty: "easy",
      explanation: "Harvesting rainwater using tanks reduces the demand on natural water reservoirs like lakes and rivers."
    },
    {
      question: "If a population grows without any limiting factors, the growth pattern is described as:",
      options: ["Logistic", "Sigmoid", "Exponential", "Linear"],
      correctAnswer: "Exponential",
      difficulty: "moderate",
      explanation: "Exponential growth (J-shaped curve) occurs when resources are unlimited and environmental resistance is zero."
    },
    {
      question: "What is the result of 'enhanced greenhouse effect' caused by human activities like burning fossil fuels?",
      options: ["Global cooling", "Ozone layer thickening", "Global warming", "Reduction in atmospheric CO2"],
      correctAnswer: "Global warming",
      difficulty: "easy",
      explanation: "Increased concentrations of greenhouse gases trap more heat in the atmosphere, leading to an increase in the Earth's average surface temperature."
    },
    {
      question: "Which of the following describes the 'species frequency' in a quadrat study?",
      options: [
        "The total number of individuals in all quadrats",
        "The average number of individuals per quadrat",
        "The percentage of quadrats in which a species occurs",
        "The total biomass of the species per unit area"
      ],
      correctAnswer: "The percentage of quadrats in which a species occurs",
      difficulty: "moderate",
      explanation: "Species frequency measures how widely a species is distributed across an area, regardless of how many individuals are in each spot."
    },
    {
      question: "A line transect is most useful for:",
      options: [
        "Counting highly mobile animal populations",
        "Showing the change in species distribution across a gradient",
        "Measuring the birth rate of a population",
        "Estimating the age structure of humans"
      ],
      correctAnswer: "Showing the change in species distribution across a gradient",
      difficulty: "hard",
      explanation: "Line transects are used to observe how species composition changes along a physical line, such as from the edge of a forest to its center or up a mountainside."
    },
    {
      question: "Which gas is released by animals during respiration and used by plants for photosynthesis?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Methane"],
      correctAnswer: "Carbon dioxide",
      difficulty: "easy",
      explanation: "Respiration releases CO2 as a byproduct, which is then a necessary reactant for plants to produce food through photosynthesis."
    },
    {
      question: "Natural resources are important for the Rwandan economy because:",
      options: [
        "They are only for aesthetic value",
        "They provide raw materials and support sectors like tourism",
        "They prevent any form of industrialization",
        "They are infinite and don't need management"
      ],
      correctAnswer: "They provide raw materials and support sectors like tourism",
      difficulty: "easy",
      explanation: "Natural resources drive economic growth by providing energy, materials for production, and supporting eco-tourism."
    },
    {
      question: "Identify the density-dependent factor among these options:",
      options: ["Seasonal cycle", "Temperature", "Competition", "Sunlight"],
      correctAnswer: "Competition",
      difficulty: "moderate",
      explanation: "Competition for resources becomes more intense as the population density increases, whereas temperature and sunlight affect the population regardless of density."
    },
    {
      question: "Assertion (A): In-situ conservation is generally preferred for protecting entire ecosystems.\nReason (R): It allows species to continue evolving in their natural environment with their natural predators and competitors.",
      options: [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      correctAnswer: "Both A and R are true, and R explains A",
      difficulty: "moderate",
      type: "assertionReason",
      explanation: "In-situ conservation is often the primary choice because it preserves the ecological context and evolutionary processes that sustain species."
    },
    {
      question: "Which of these is a negative impact of human population explosion on the environment?",
      options: [
        "Increased biodiversity",
        "Habitat restoration",
        "Increased pollution and resource depletion",
        "Enhanced soil fertility"
      ],
      correctAnswer: "Increased pollution and resource depletion",
      difficulty: "easy",
      explanation: "A larger population requires more resources and generates more waste, leading to environmental degradation."
    },
    {
      question: "A quadrat of 0.5m² is used. In 10 quadrats, a total of 20 plants are counted. What is the species density per m²?",
      options: ["2 plants/m²", "4 plants/m²", "10 plants/m²", "40 plants/m²"],
      correctAnswer: "4 plants/m²",
      difficulty: "hard",
      type: "calculation",
      explanation: "Total area sampled = 10 * 0.5m² = 5m². Total individuals = 20. Density = 20 / 5 = 4 plants per m²."
    },
    {
      question: "Parasitism can slow down population growth by:",
      options: [
        "Increasing the birth rate",
        "Providing extra nutrients to the host",
        "Causing diseases that increase mortality",
        "Protecting the host from predators"
      ],
      correctAnswer: "Causing diseases that increase mortality",
      difficulty: "easy",
      explanation: "Parasites derive nutrients from their hosts, often weakening them or causing diseases that lead to death or reduced reproductive success."
    },
    {
      question: "What is the primary characteristic of a renewable resource?",
      options: [
        "It can never be exhausted no matter how it is used",
        "It can be replenished naturally over a short period of time",
        "It is found only in developed countries",
        "It is harmful to the environment"
      ],
      correctAnswer: "It can be replenished naturally over a short period of time",
      difficulty: "moderate",
      explanation: "Renewable resources like forests or water can replenish themselves, provided they are not consumed faster than their rate of renewal."
    },
    {
      question: "True or False: Human activities can only have negative impacts on the ecosystem.",
      options: ["True", "False"],
      correctAnswer: "False",
      difficulty: "moderate",
      type: "trueFalse",
      explanation: "While many activities are harmful, humans also engage in positive activities like conservation, restoration of degraded lands, and reforestation."
    },
    {
      question: "Which of the following is a density-independent factor?",
      options: ["Competition for mates", "Spread of a virus", "Level of soil acidity", "Predation pressure"],
      correctAnswer: "Level of soil acidity",
      difficulty: "moderate",
      explanation: "Abiotic factors like pH (acidity) or temperature affect the survival of organisms based on their physiological tolerance, not based on how many of them there are."
    },
    {
      question: "The J-shaped growth curve is characteristic of:",
      options: ["Logistic growth", "Exponential growth", "Population stability", "Environmental resistance"],
      correctAnswer: "Exponential growth",
      difficulty: "easy",
      explanation: "The J-shaped curve represents a population growing at its biotic potential without any limitations."
    },
    {
      question: "What is the first step in the capture-recapture method?",
      options: [
        "Counting the total population",
        "Marking all individuals in the area",
        "Capturing and marking a sample of the population",
        "Calculating the Lincoln Index"
      ],
      correctAnswer: "Capturing and marking a sample of the population",
      difficulty: "easy",
      explanation: "The process begins by capturing a random sample, marking them harmlessly, and releasing them back into the wild."
    },
    {
      question: "Which of these is NOT a method of conserving natural resources?",
      options: [
        "Judicious use of energy",
        "Prior treatment of industrial wastes",
        "Deforestation for agricultural expansion",
        "Use of biogas"
      ],
      correctAnswer: "Deforestation for agricultural expansion",
      difficulty: "easy",
      type: "negative",
      explanation: "Deforestation destroys habitats and reduces biodiversity, which is the opposite of conservation."
    },
    {
      question: "Biotic factors that affect the balance of nature include:",
      options: [
        "Respiration and Predation",
        "Temperature and Sunlight",
        "Rainfall and Soil pH",
        "Wind and Humidity"
      ],
      correctAnswer: "Respiration and Predation",
      difficulty: "moderate",
      explanation: "Biotic factors are those resulting from living organisms. Respiration, predation, and competition are biotic, while the other options listed are abiotic."
    },
    {
      question: "A population has 820 insects in 1.2 km². Another population has 560 plants in 0.2 km². Which has the greater density?",
      options: [
        "The insect population",
        "The plant population",
        "They have equal density",
        "Cannot be determined"
      ],
      correctAnswer: "The plant population",
      difficulty: "hard",
      type: "calculation",
      explanation: "Insect density = 820 / 1.2 ≈ 683 per km². Plant density = 560 / 0.2 = 2800 per km². The plants are much more densely packed."
    }
  ],
  "Unit 2: Concept of Ecosystem": [
    {
      question: "Which of the following best defines an ecosystem?",
      options: [
        "A group of individuals of the same species in a specific area",
        "Multiple populations of different species interacting in a habitat",
        "A natural unit consisting of all living organisms in an area functioning together with all non-living physical factors",
        "A broad regional type of vegetation characterized by a distinctive climate"
      ],
      correctAnswer: "A natural unit consisting of all living organisms in an area functioning together with all non-living physical factors",
      difficulty: "easy",
      explanation: "An ecosystem is the level of ecological organization that includes both the biotic (living) community and the abiotic (non-living) environment, such as air, water, and soil, interacting as a functional unit."
    },
    {
      question: "Which term refers to the physical environment in which a species lives and to which it is adapted?",
      options: ["Niche", "Habitat", "Community", "Biome"],
      correctAnswer: "Habitat",
      difficulty: "easy",
      explanation: "The habitat is the 'address' or physical location of an organism. It is primarily determined by abiotic factors like temperature and rainfall."
    },
    {
      question: "The competitive exclusion principle states that:",
      options: [
        "Two different species can occupy the same niche indefinitely",
        "Two different species cannot occupy the same niche in the same place for very long",
        "Predators always exclude prey from a habitat",
        "Only one species can exist in a specific habitat at a time"
      ],
      correctAnswer: "Two different species cannot occupy the same niche in the same place for very long",
      difficulty: "moderate",
      explanation: "If two species attempt to occupy the same niche, they will compete for the exact same resources. Eventually, one will be more efficient, leading to the extinction or displacement of the weaker species."
    },
    {
      question: "A species' role within its ecosystem, including how it obtains food and interacts with other species, is its:",
      options: ["Habitat", "Trophic level", "Niche", "Ecological pyramid"],
      correctAnswer: "Niche",
      difficulty: "moderate",
      explanation: "While habitat is the physical location, the niche is the 'profession' of the organism—its functional role and the specific resources it uses."
    },
    {
      question: "Which of the following is an example of an artificial ecosystem?",
      options: ["Tropical rainforest", "Lake Kivu", "Akagera National Park", "A maize cropland"],
      correctAnswer: "A maize cropland",
      difficulty: "easy",
      explanation: "Artificial ecosystems are manipulated and maintained by human intervention for specific purposes, such as agriculture (croplands) or urban areas (cities)."
    },
    {
      question: "Identify the abiotic factor among the following:",
      options: ["Predation", "Soil pH", "Parasitism", "Competition"],
      correctAnswer: "Soil pH",
      difficulty: "easy",
      explanation: "Soil pH is a chemical (non-living) property of the environment. Predation, parasitism, and competition are biotic factors because they involve interactions between living organisms."
    },
    {
      question: "Assertion (A): Producers are always located at the base of an ecological pyramid.\nReason (R): Producers convert light energy into chemical energy, which supports all other trophic levels.",
      options: [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      correctAnswer: "Both A and R are true, and R explains A",
      difficulty: "moderate",
      type: "assertionReason",
      explanation: "Energy enters the ecosystem via producers (autotrophs). Because energy is lost at each subsequent level, the base must have the most energy/production to support the levels above."
    },
    {
      question: "Which process involves the accumulation of a substance, such as a toxic chemical, in various tissues of a living organism?",
      options: ["Biomagnification", "Bioaccumulation", "Eutrophication", "Nitrogen fixation"],
      correctAnswer: "Bioaccumulation",
      difficulty: "moderate",
      explanation: "Bioaccumulation is the buildup of substances within a single organism's body over time. Biomagnification refers to the increasing concentration of these substances as they move up the food chain."
    },
    {
      question: "In a food chain where a large fish eats a small fish that ate zooplankton, which organism is the secondary consumer?",
      options: ["Phytoplankton", "Zooplankton", "Small fish", "Large fish"],
      correctAnswer: "Small fish",
      difficulty: "moderate",
      explanation: "The chain follows: Producer (Phytoplankton/Plants) -> Primary Consumer (Zooplankton) -> Secondary Consumer (Small fish) -> Tertiary Consumer (Large fish)."
    },
    {
      question: "Ecological succession that begins on a bare rock following a volcanic eruption is known as:",
      options: ["Secondary succession", "Climax succession", "Primary succession", "Pioneer succession"],
      correctAnswer: "Primary succession",
      difficulty: "easy",
      explanation: "Primary succession starts in an area with no existing soil or previous life, such as bare rock left by lava or a retreating glacier."
    },
    {
      question: "What is the primary difference between primary and secondary succession?",
      options: [
        "Primary succession is faster than secondary succession",
        "Secondary succession starts with no soil, while primary starts with soil",
        "Primary succession occurs in areas never colonized, while secondary occurs in disturbed areas with soil",
        "Pioneer species only exist in secondary succession"
      ],
      correctAnswer: "Primary succession occurs in areas never colonized, while secondary occurs in disturbed areas with soil",
      difficulty: "moderate",
      explanation: "Secondary succession is faster because the soil and some seeds/roots are already present following a disturbance like a fire or flood."
    },
    {
      question: "The formula for Net Primary Production (NPP) is:",
      options: ["NPP = GPP + R", "NPP = GPP - R", "NPP = R - GPP", "NPP = GPP / R"],
      correctAnswer: "NPP = GPP - R",
      difficulty: "moderate",
      type: "calculation",
      explanation: "Net Primary Production is the Gross Primary Production (total energy fixed) minus the energy the producers use for their own respiration (R)."
    },
    {
      question: "Which of the following organisms are typically the pioneer species in primary succession?",
      options: ["Hardwood trees", "Shrubs", "Lichens and mosses", "Grasses"],
      correctAnswer: "Lichens and mosses",
      difficulty: "easy",
      explanation: "Lichens and mosses are hardy enough to survive on bare rock. They help weather the rock and add organic matter to begin the process of soil formation."
    },
    {
      question: "Select all that apply: Which of the following are greenhouse gases?",
      options: ["Carbon dioxide", "Methane", "Nitrogen gas (N2)", "Water vapor"],
      correctAnswer: ["Carbon dioxide", "Methane", "Water vapor"],
      multiSelect: true,
      difficulty: "moderate",
      type: "multiple",
      explanation: "Carbon dioxide, methane, and water vapor are key greenhouse gases that trap heat. Nitrogen gas (N2) makes up most of the atmosphere but is not a greenhouse gas."
    },
    {
      question: "What happens to the concentration of toxins like DDT as they move up a food chain?",
      options: [
        "It decreases at each level",
        "It remains the same",
        "It increases at each level",
        "It disappears after the primary consumer"
      ],
      correctAnswer: "It increases at each level",
      difficulty: "moderate",
      explanation: "This is biomagnification. Because toxins are not easily excreted or broken down, they become more concentrated in the tissues of top predators who eat many contaminated organisms from lower levels."
    },
    {
      question: "Which process in the water cycle involves plants releasing water vapor into the atmosphere?",
      options: ["Evaporation", "Sublimation", "Transpiration", "Precipitation"],
      correctAnswer: "Transpiration",
      difficulty: "easy",
      explanation: "Transpiration is the process where water is taken up by plant roots and evaporated from the leaves through stomata."
    },
    {
      question: "In the nitrogen cycle, which organisms convert atmospheric nitrogen (N2) into forms plants can use?",
      options: ["Denitrifying bacteria", "Nitrifying bacteria", "Nitrogen-fixing bacteria", "Decomposers"],
      correctAnswer: "Nitrogen-fixing bacteria",
      difficulty: "moderate",
      explanation: "Nitrogen fixation is the conversion of unreactive N2 gas into ammonia (NH3) or other usable forms, performed by specific bacteria often found in legume root nodules."
    },
    {
      question: "What is the role of denitrifying bacteria in the nitrogen cycle?",
      options: [
        "Converting ammonia to nitrates",
        "Converting nitrates back into nitrogen gas (N2)",
        "Fixing nitrogen from the air into the soil",
        "Decomposing dead organic matter"
      ],
      correctAnswer: "Converting nitrates back into nitrogen gas (N2)",
      difficulty: "hard",
      explanation: "Denitrification occurs in anaerobic conditions where bacteria convert nitrates (NO3-) back into N2 gas, completing the cycle and returning nitrogen to the atmosphere."
    },
    {
      question: "The 'climax community' refers to:",
      options: [
        "The first species to arrive in an area",
        "The intermediate stage of succession",
        "A stable, long-lasting community that represents the end of succession",
        "A community that has just been disturbed by fire"
      ],
      correctAnswer: "A stable, long-lasting community that represents the end of succession",
      difficulty: "moderate",
      explanation: "A climax community is the final stage of succession, where the species composition remains relatively stable unless a major disturbance occurs."
    },
    {
      question: "What is an 'exchange pool' in a biogeochemical cycle?",
      options: [
        "A component that holds an element for a very long time",
        "A component that holds an element for a relatively short period",
        "The point where energy enters the cycle",
        "The process of elements changing state"
      ],
      correctAnswer: "A component that holds an element for a relatively short period",
      difficulty: "hard",
      explanation: "Exchange pools (like the atmosphere for water) hold elements briefly, whereas reservoirs (like the ocean for water) hold them for much longer periods."
    },
    {
      question: "Which of the following ecological pyramids can sometimes be inverted (upside down)?",
      options: ["Pyramid of energy", "Pyramid of numbers", "Pyramid of biomass", "Both B and C"],
      correctAnswer: "Both B and C",
      difficulty: "hard",
      explanation: "A pyramid of numbers can be inverted (e.g., many insects on one tree). A pyramid of biomass can be inverted in aquatic systems where phytoplankton are eaten as fast as they reproduce. The pyramid of energy is *always* upright."
    },
    {
      question: "Why is the pyramid of energy always upright and never inverted?",
      options: [
        "Energy is created at each trophic level",
        "Energy is lost as heat at each trophic transfer",
        "Decomposers return all energy to the producers",
        "Consumers are more efficient than producers"
      ],
      correctAnswer: "Energy is lost as heat at each trophic transfer",
      difficulty: "moderate",
      explanation: "According to the laws of thermodynamics, energy transfer is inefficient. Most energy is lost as heat or used for metabolism, leaving only about 10% for the next level."
    },
    {
      question: "In the carbon cycle, which two main processes balance the concentration of CO2 in the atmosphere?",
      options: [
        "Transpiration and Evaporation",
        "Nitrogen fixation and Denitrification",
        "Photosynthesis and Respiration",
        "Combustion and Decomposition"
      ],
      correctAnswer: "Photosynthesis and Respiration",
      difficulty: "easy",
      explanation: "Photosynthesis removes CO2 from the atmosphere to build organic matter, while respiration by plants, animals, and decomposers releases CO2 back."
    },
    {
      question: "How does 'enhanced greenhouse effect' differ from the 'natural greenhouse effect'?",
      options: [
        "The natural effect is harmful, while the enhanced effect is beneficial",
        "The enhanced effect is caused by human activities increasing gas concentrations",
        "The natural effect only involves oxygen",
        "There is no difference between them"
      ],
      correctAnswer: "The enhanced effect is caused by human activities increasing gas concentrations",
      difficulty: "moderate",
      explanation: "The natural greenhouse effect is necessary for life. The 'enhanced' effect refers to the additional warming caused by human-led increases in CO2 and other gases, leading to global warming."
    },
    {
      question: "Which of the following describes the secondary production of an ecosystem?",
      options: [
        "Energy fixed by plants",
        "Energy stored as biomass by consumers",
        "Energy lost as heat by producers",
        "Energy reflected by the Earth's surface"
      ],
      correctAnswer: "Energy stored as biomass by consumers",
      difficulty: "moderate",
      explanation: "Secondary production is the amount of chemical energy in consumers' food that is converted to their own new biomass."
    },
    {
      question: "What role do decomposers (bacteria and fungi) play in an ecosystem?",
      options: [
        "They capture energy from the sun",
        "They recycle nutrients by breaking down dead organic matter",
        "They are the primary source of oxygen",
        "They reduce the amount of CO2 in the atmosphere"
      ],
      correctAnswer: "They recycle nutrients by breaking down dead organic matter",
      difficulty: "easy",
      explanation: "Decomposers break down dead plants and animals, releasing essential nutrients (like nitrogen and phosphorus) back into the soil or water to be reused by producers."
    },
    {
      question: "Bio-fuels are considered more 'bio-friendly' than fossil fuels because:",
      options: [
        "They do not release any CO2 when burned",
        "They are non-renewable and easy to store",
        "They come from recent plant matter and can reduce air pollution",
        "They are made from toxic industrial waste"
      ],
      correctAnswer: "They come from recent plant matter and can reduce air pollution",
      difficulty: "moderate",
      explanation: "Bio-fuels are renewable and part of the current carbon cycle, potentially reducing the net increase of atmospheric CO2 compared to burning 'buried' carbon in fossil fuels."
    },
    {
      question: "Identify the error: 'In an aquatic ecosystem, the pyramid of biomass is always upright with a large base of phytoplankton.'",
      options: [
        "The error is 'aquatic ecosystem'",
        "The error is 'always upright'",
        "The error is 'phytoplankton'",
        "No error"
      ],
      correctAnswer: "The error is 'always upright'",
      difficulty: "hard",
      type: "errorIdentification",
      explanation: "In some aquatic ecosystems, the pyramid of biomass is *inverted* because phytoplankton have a very high turnover rate; they are consumed so quickly that their standing biomass at any one time is small."
    },
    {
      question: "Which human activity most directly accelerates the depletion of soil nutrients in agricultural lands?",
      options: [
        "Rainwater harvesting",
        "Large-scale crop harvesting without nutrient replacement",
        "Using solar energy for irrigation",
        "Practicing in-situ conservation"
      ],
      correctAnswer: "Large-scale crop harvesting without nutrient replacement",
      difficulty: "easy",
      explanation: "Harvesting crops removes the nutrients the plants absorbed from the soil. If these aren't replaced (via manure or fertilizer), the soil becomes depleted."
    },
    {
      question: "Assertion (A): Secondary succession is faster than primary succession.\nReason (R): In secondary succession, the soil is already present and may contain seeds and roots.",
      options: [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      correctAnswer: "Both A and R are true, and R explains A",
      difficulty: "moderate",
      type: "assertionReason",
      explanation: "Because soil and biological 'remnants' (seeds/roots) exist after disturbances like fire, the ecosystem recovers much more quickly than starting from bare rock."
    },
    {
      question: "The conversion of ammonia (NH3) to nitrites (NO2-) and then to nitrates (NO3-) is called:",
      options: ["Nitrogen fixation", "Nitrification", "Denitrification", "Ammonification"],
      correctAnswer: "Nitrification",
      difficulty: "moderate",
      explanation: "Nitrification is a two-step biological process carried out by nitrifying bacteria to turn ammonia into nitrates, which plants can easily absorb."
    },
    {
      question: "Which of the following is a characteristic of a tropical rainforest biome?",
      options: [
        "High temperature and low rainfall",
        "Low temperature and high rainfall",
        "High temperature and high rainfall",
        "High seasonal variation in temperature"
      ],
      correctAnswer: "High temperature and high rainfall",
      difficulty: "easy",
      explanation: "Biomes are defined by climate. Tropical rainforests are characterized by consistent warmth and significant precipitation throughout the year."
    },
    {
      question: "In the context of the carbon cycle, what is a 'sink'?",
      options: [
        "A process that releases CO2 into the air",
        "A reservoir that accumulates and stores carbon for a long time",
        "A type of soil that doesn't allow water to pass",
        "The bottom of an ecological pyramid"
      ],
      correctAnswer: "A reservoir that accumulates and stores carbon for a long time",
      difficulty: "moderate",
      explanation: "Carbon sinks (like forests or oceans) absorb more carbon than they release, helping to offset the CO2 in the atmosphere."
    },
    {
      question: "Which of the following would be considered a 'detritivore'?",
      options: ["A hawk", "An earthworm", "A green plant", "A cow"],
      correctAnswer: "An earthworm",
      difficulty: "moderate",
      explanation: "Detritivores are organisms that feed on detritus (dead organic matter), helping to break it down for further decomposition by fungi and bacteria."
    },
    {
      question: "The efficiency of energy transfer between trophic levels is generally about:",
      options: ["1%", "10%", "50%", "90%"],
      correctAnswer: "10%",
      difficulty: "easy",
      explanation: "The '10% rule' suggests that only about 10% of the energy at one trophic level is passed on to the next; the rest is lost as heat or used for maintenance."
    },
    {
      question: "Which of these is a biotic factor that can change the environment?",
      options: ["Wind erosion", "Volcanic ash", "Photosynthesis by plants", "Solar radiation"],
      correctAnswer: "Photosynthesis by plants",
      difficulty: "moderate",
      explanation: "Photosynthesis is a biological process (biotic factor) that changes the environment by removing CO2 and adding Oxygen."
    },
    {
      question: "A pond is an example of which type of ecosystem?",
      options: ["Terrestrial natural ecosystem", "Aquatic natural ecosystem", "Terrestrial artificial ecosystem", "Aquatic artificial ecosystem"],
      correctAnswer: "Aquatic natural ecosystem",
      difficulty: "easy",
      explanation: "A pond is a freshwater (aquatic) ecosystem that forms and maintains itself naturally."
    },
    {
      question: "True or False: In a tree ecosystem, the pyramid of numbers is typically upright.",
      options: ["True", "False"],
      correctAnswer: "False",
      difficulty: "moderate",
      type: "trueFalse",
      explanation: "In a tree ecosystem, one single producer (the tree) supports many thousands of insects, resulting in an *inverted* pyramid of numbers."
    },
    {
      question: "What is the consequence of 'eutrophication' in a lake?",
      options: [
        "Increased oxygen levels and clearer water",
        "Reduction of nutrients leading to fish death",
        "Excessive algae growth leading to oxygen depletion",
        "The lake drying up due to high temperatures"
      ],
      correctAnswer: "Excessive algae growth leading to oxygen depletion",
      difficulty: "hard",
      explanation: "Eutrophication is caused by excess nutrients (like fertilizer runoff). This triggers an 'algal bloom.' When the algae die, decomposers use up all the dissolved oxygen to break them down, causing fish to suffocate."
    },
    {
      question: "Which of the following is NOT one of the three states of water in the water cycle?",
      options: ["Water vapor", "Liquid water", "Ice", "Plasma"],
      correctAnswer: "Plasma",
      difficulty: "easy",
      type: "negative",
      explanation: "Water naturally cycles through gas (vapor), liquid, and solid (ice) states on Earth."
    },
    {
      question: "During photosynthesis, plants convert ______ energy into ______ energy.",
      options: [
        "Chemical, light",
        "Light, chemical",
        "Thermal, kinetic",
        "Electrical, chemical"
      ],
      correctAnswer: "Light, chemical",
      difficulty: "easy",
      type: "fillBlank",
      explanation: "Producers capture solar (light) energy and store it in the chemical bonds of organic molecules like glucose."
    },
    {
      question: "What is the primary source of phosphorus for the phosphorus cycle?",
      options: ["The atmosphere", "Volcanic gases", "Weathering of rocks", "Respiration"],
      correctAnswer: "Weathering of rocks",
      difficulty: "hard",
      explanation: "Unlike nitrogen or carbon, phosphorus does not have a significant atmospheric phase. It is primarily released from rocks via weathering and enters the soil and water."
    },
    {
      question: "Which term describes the amount of light energy converted to chemical energy by autotrophs in a given time?",
      options: [
        "Gross Primary Production (GPP)",
        "Net Primary Production (NPP)",
        "Secondary Production",
        "Ecological Efficiency"
      ],
      correctAnswer: "Gross Primary Production (GPP)",
      difficulty: "moderate",
      explanation: "GPP is the total rate at which producers capture solar energy. NPP is what remains after the plants use some for themselves."
    },
    {
      question: "If a pesticide like DDT is sprayed on a field, which organism will likely have the highest concentration in its body?",
      options: ["The grass", "The grasshopper that eats the grass", "The frog that eats the grasshopper", "The hawk that eats the frog"],
      correctAnswer: "The hawk that eats the frog",
      difficulty: "moderate",
      explanation: "Through biomagnification, the concentration of persistent toxins increases at each higher trophic level. The hawk, being at the top, will have the highest concentration."
    },
    {
      question: "The total amount of living material in a specific trophic level is called:",
      options: ["Biomass", "Biotic potential", "Niche", "Community"],
      correctAnswer: "Biomass",
      difficulty: "easy",
      explanation: "Biomass is the total dry mass of all organisms in a particular level or area."
    },
    {
      question: "What is the function of the greenhouse effect for Earth?",
      options: [
        "It prevents all sunlight from reaching the surface",
        "It keeps the Earth's temperature warm enough to sustain life",
        "It causes the polar ice caps to melt naturally",
        "It allows plants to breathe oxygen"
      ],
      correctAnswer: "It keeps the Earth's temperature warm enough to sustain life",
      difficulty: "easy",
      explanation: "Without the natural greenhouse effect, Earth's average temperature would be about 33°C colder, making it a frozen, lifeless planet."
    },
    {
      question: "A sequence of organisms where each feeds on the previous one is a:",
      options: ["Food web", "Food chain", "Ecological pyramid", "Niche"],
      correctAnswer: "Food chain",
      difficulty: "easy",
      explanation: "A food chain is a linear sequence showing the flow of energy from one organism to another."
    }
  ],
  "Unit 3: Effect of Human Activities on Ecosystem": [
    {
      "question": "Which of the following modern agricultural practices is primarily designed to minimize the use of synthetic pesticides while managing pests?",
      "options": ["Monoculture", "Integrated Pest Management (IPM)", "Heavy irrigation", "Extensive use of chemical fertilizers"],
      "correctAnswer": "Integrated Pest Management (IPM)",
      "difficulty": "moderate",
      "explanation": "Integrated Pest Management (IPM) is a sustainable approach that combines biological, cultural, and physical tools with precise chemical use to minimize economic, health, and environmental risks."
    },
    {
      "question": "What is the primary environmental drawback of 'monoculture' in modern agriculture?",
      "options": [
        "It increases the variety of food produced",
        "It reduces the need for machinery",
        "It increases vulnerability to specific pests and reduces biodiversity",
        "It improves soil fertility naturally over time"
      ],
      "correctAnswer": "It increases vulnerability to specific pests and reduces biodiversity",
      "difficulty": "easy",
      "explanation": "Monoculture involves growing a single crop over a large area. This reduces genetic diversity and creates an ideal environment for specific pests to thrive, often requiring more chemical intervention."
    },
    {
      "question": "The process by which water bodies receive excess nutrients (like nitrates and phosphates), leading to excessive plant growth and oxygen depletion, is called:",
      "options": ["Biomagnification", "Eutrophication", "Salinization", "Desertification"],
      "correctAnswer": "Eutrophication",
      "difficulty": "easy",
      "explanation": "Eutrophication is often caused by fertilizer runoff from farms. It leads to algal blooms; when these algae die, decomposers use up the oxygen in the water, killing fish and other aquatic life."
    },
    {
      "question": "Which human activity is the leading cause of habitat fragmentation?",
      "options": ["Organic farming", "Construction of roads and urban expansion", "Rainwater harvesting", "In-situ conservation"],
      "correctAnswer": "Construction of roads and urban expansion",
      "difficulty": "easy",
      "explanation": "Habitat fragmentation occurs when large, continuous habitats are divided into smaller, isolated patches by human structures like roads, fences, and cities, making it difficult for wildlife to move or find mates."
    },
    {
      "question": "What is the specific effect of chlorofluorocarbons (CFCs) on the atmosphere?",
      "options": [
        "They cause global cooling",
        "They increase soil acidity",
        "They deplete the stratospheric ozone layer",
        "They increase the rate of nitrogen fixation"
      ],
      "correctAnswer": "They deplete the stratospheric ozone layer",
      "difficulty": "moderate",
      "explanation": "CFCs release chlorine atoms when exposed to UV radiation in the stratosphere. These chlorine atoms act as catalysts to break down ozone molecules (O3), increasing the amount of harmful UV radiation reaching Earth."
    },
    {
      "question": "Assertion (A): Overuse of chemical fertilizers can lead to soil degradation.\nReason (R): Excessive salts in fertilizers can alter soil pH and kill beneficial soil microorganisms.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Fertilizers provide nutrients but can lead to acidification or salinization of the soil if mismanaged, which harms the natural biological community of the soil."
    },
    {
      "question": "Which of the following is considered a 'non-point source' of pollution?",
      "options": [
        "A factory discharge pipe",
        "A specific sewage outlet",
        "Agricultural runoff from many farms in a region",
        "An oil tanker spill"
      ],
      "correctAnswer": "Agricultural runoff from many farms in a region",
      "difficulty": "hard",
      "explanation": "Point source pollution comes from a single, identifiable source (like a pipe). Non-point source pollution comes from diffuse areas, such as rain washing chemicals off many different lawns or farms into a river."
    },
    {
      "question": "How does deforestation contribute to global warming?",
      "options": [
        "By increasing the amount of oxygen in the air",
        "By reducing the amount of CO2 removed from the atmosphere via photosynthesis",
        "By decreasing the Earth's albedo",
        "By preventing the nitrogen cycle from occurring"
      ],
      "correctAnswer": "By reducing the amount of CO2 removed from the atmosphere via photosynthesis",
      "difficulty": "moderate",
      "explanation": "Trees act as carbon sinks. When they are cut down, they no longer absorb CO2, and if burned or left to rot, they release stored carbon back into the atmosphere."
    },
    {
      "question": "Which of the following is a direct consequence of biological magnification?",
      "options": [
        "Algal blooms in lakes",
        "Thinning of eggshells in birds of prey due to DDT",
        "The formation of acid rain",
        "The greenhouse effect"
      ],
      "correctAnswer": "Thinning of eggshells in birds of prey due to DDT",
      "difficulty": "moderate",
      "explanation": "Biological magnification (biomagnification) causes fat-soluble toxins to increase in concentration at higher trophic levels. Top predators, like eagles, accumulate high levels that interfere with calcium metabolism, leading to fragile eggs."
    },
    {
      "question": "Which method of restoring a damaged ecosystem involves using living organisms (like plants or microbes) to detoxify polluted soil?",
      "options": ["Reforestation", "Phytoremediation", "Biological control", "Terracing"],
      "correctAnswer": "Phytoremediation",
      "difficulty": "hard",
      "explanation": "Phytoremediation is a type of bioremediation where specific plants are used to absorb, sequester, or degrade contaminants like heavy metals or oil from soil or water."
    },
    {
      "question": "What is the primary cause of 'acid rain'?",
      "options": [
        "Excessive CO2 from respiration",
        "Sulfur dioxide and nitrogen oxides from burning fossil fuels",
        "Methane from cattle ranching",
        "CFCs from refrigeration"
      ],
      "correctAnswer": "Sulfur dioxide and nitrogen oxides from burning fossil fuels",
      "difficulty": "moderate",
      "explanation": "When fossil fuels are burned, they release SO2 and NOx. These gases react with water vapor in the atmosphere to form sulfuric and nitric acids, which fall as acidic precipitation."
    },
    {
      "question": "Select all that apply: Which of the following are benefits of organic farming?",
      "options": ["Reduced chemical runoff", "Higher yields of a single crop", "Improved soil structure", "Increased biodiversity"],
      "correctAnswer": ["Reduced chemical runoff", "Improved soil structure", "Increased biodiversity"],
      "multiSelect": true,
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "Organic farming avoids synthetic chemicals, uses natural fertilizers like compost (improving soil), and typically supports more diverse insect and plant life. However, yields are often lower than intensive chemical farming."
    },
    {
      "question": "The introduction of the Nile Perch into Lake Victoria, which led to the extinction of many native cichlid fish species, is an example of:",
      "options": ["Habitat restoration", "Invasive species impact", "Sustainable fishing", "Natural selection"],
      "correctAnswer": "Invasive species impact",
      "difficulty": "easy",
      "explanation": "Invasive species are non-native organisms that spread widely and cause ecological harm by outcompeting or preying upon local species."
    },
    {
      "question": "Which of the following best describes 'Sustainable Development'?",
      "options": [
        "Rapid industrial growth regardless of environmental cost",
        "Meeting current human needs without compromising the ability of future generations to meet theirs",
        "Halting all industrial and agricultural activity to protect nature",
        "Using all available natural resources as quickly as possible to boost the economy"
      ],
      "correctAnswer": "Meeting current human needs without compromising the ability of future generations to meet theirs",
      "difficulty": "easy",
      "explanation": "Sustainability focuses on the long-term balance between economic growth, environmental health, and social equity."
    },
    {
      "question": "In the context of waste management, which 'R' involves using an item again for the same or a different purpose without changing its physical form?",
      "options": ["Reduce", "Recycle", "Reuse", "Restore"],
      "correctAnswer": "Reuse",
      "difficulty": "easy",
      "explanation": "Reuse keeps items out of the waste stream by using them multiple times (e.g., refilling a glass bottle), whereas recycling involves breaking the item down into raw materials to make something new."
    },
    {
      "question": "Thermal pollution in a river (increase in water temperature) is harmful primarily because:",
      "options": [
        "Warm water holds less dissolved oxygen",
        "Warm water makes fish grow too large",
        "Warm water speeds up the flow of the river",
        "Warm water prevents evaporation"
      ],
      "correctAnswer": "Warm water holds less dissolved oxygen",
      "difficulty": "moderate",
      "explanation": "The solubility of oxygen decreases as water temperature increases. Aquatic organisms with high oxygen demands, like many fish, can suffocate in thermally polluted water."
    },
    {
      "question": "Which agricultural technology involves transferring specific genes from one organism to another to provide traits like drought resistance?",
      "options": ["Hydroponics", "Selective breeding", "Genetic Engineering (GMOs)", "Crop rotation"],
      "correctAnswer": "Genetic Engineering (GMOs)",
      "difficulty": "moderate",
      "explanation": "Genetic Engineering allows for the direct manipulation of an organism's DNA, often inserting genes from entirely different species to achieve desired agricultural traits quickly."
    },
    {
      "question": "What is the main goal of 'Biological Control' in agriculture?",
      "options": [
        "To eliminate all insects in a field using chemicals",
        "To use natural predators or parasites to manage pest populations",
        "To increase the speed of crop growth using hormones",
        "To monitor the weather for irrigation purposes"
      ],
      "correctAnswer": "To use natural predators or parasites to manage pest populations",
      "difficulty": "easy",
      "explanation": "Biological control uses natural enemies (like ladybugs eating aphids) to keep pest populations below an economically damaging level without using toxins."
    },
    {
      "question": "True or False: Greenhouse gases are naturally occurring and are essential for maintaining life-sustaining temperatures on Earth.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "The *natural* greenhouse effect is necessary. The environmental problem is the *enhanced* greenhouse effect caused by human activities increasing these gas concentrations beyond natural levels."
    },
    {
      "question": "Which of the following describes a 'Restoration' project?",
      "options": [
        "Building a new shopping mall on a wetland",
        "Converting a degraded mining site back into a functional forest or grassland",
        "Implementing a new tax on plastic bags",
        "Exporting non-renewable resources to other countries"
      ],
      "correctAnswer": "Converting a degraded mining site back into a functional forest or grassland",
      "difficulty": "moderate",
      "explanation": "Ecological restoration is the process of assisting the recovery of an ecosystem that has been degraded, damaged, or destroyed."
    },
    {
      "question": "Identify the error in this statement: 'Eutrophication is caused by high levels of toxic mercury in the water, which makes plants grow faster.'",
      "options": [
        "The error is 'Eutrophication'",
        "The error is 'toxic mercury'",
        "The error is 'plants grow faster'",
        "No error"
      ],
      "correctAnswer": "The error is 'toxic mercury'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Eutrophication is caused by excess *nutrients* like nitrates and phosphates (usually from fertilizers), not by toxic heavy metals like mercury."
    },
    {
      "question": "Heavy metals like Lead (Pb) and Mercury (Hg) are particularly dangerous in ecosystems because:",
      "options": [
        "They are easily broken down by bacteria",
        "They are required for photosynthesis",
        "They are persistent and do not biodegrade",
        "They cause water to freeze at higher temperatures"
      ],
      "correctAnswer": "They are persistent and do not biodegrade",
      "difficulty": "moderate",
      "explanation": "Persistent pollutants remain in the environment for decades or centuries because natural processes (decomposers) cannot break them down, leading to long-term toxicity and biomagnification."
    },
    {
      "question": "Which practice helps prevent soil erosion on steep hillsides, common in Rwanda?",
      "options": ["Monoculture", "Terracing", "Deforestation", "Overgrazing"],
      "correctAnswer": "Terracing",
      "difficulty": "easy",
      "explanation": "Terracing involves cutting 'steps' into steep slopes to slow down water runoff and hold the soil in place, preventing it from being washed away during heavy rains."
    },
    {
      "question": "The 'Smog' often seen in large cities is primarily a form of:",
      "options": ["Water pollution", "Soil pollution", "Air pollution", "Noise pollution"],
      "correctAnswer": "Air pollution",
      "difficulty": "easy",
      "explanation": "Smog is a mixture of smoke and fog, or a chemical reaction of sunlight with pollutants like nitrogen oxides and volatile organic compounds from vehicles and industry."
    },
    {
      "question": "What is the consequence of 'overfishing' in marine ecosystems?",
      "options": [
        "It increases the fish population for the next year",
        "It disrupts the food web and can lead to the collapse of fish stocks",
        "It makes the water cleaner",
        "It has no impact because the ocean is so large"
      ],
      "correctAnswer": "It disrupts the food web and can lead to the collapse of fish stocks",
      "difficulty": "moderate",
      "explanation": "Overfishing removes fish faster than they can reproduce. This can lead to the local extinction of species and the loss of food sources for other marine predators."
    },
    {
      "question": "Which gas is primarily produced by anaerobic bacteria in landfills and by the digestive systems of livestock?",
      "options": ["Oxygen", "Methane", "Argon", "Helium"],
      "correctAnswer": "Methane",
      "difficulty": "moderate",
      "explanation": "Methane (CH4) is a potent greenhouse gas produced during the decomposition of organic matter in oxygen-poor environments like swamps, landfills, and the stomachs of ruminants (cows)."
    },
    {
      "question": "Bioaccumulation occurs when:",
      "options": [
        "An organism dies and its nutrients return to the soil",
        "A chemical is excreted faster than it is taken in",
        "A chemical is taken in by an organism at a faster rate than it is lost by excretion",
        "Energy is lost as heat between trophic levels"
      ],
      "correctAnswer": "A chemical is taken in by an organism at a faster rate than it is lost by excretion",
      "difficulty": "hard",
      "explanation": "Bioaccumulation is the 'internal' buildup of a substance within a single organism over its lifetime."
    },
    {
      "question": "The use of 'biological corridors' helps to mitigate the effects of:",
      "options": ["Eutrophication", "Habitat fragmentation", "Overfishing", "Acid rain"],
      "correctAnswer": "Habitat fragmentation",
      "difficulty": "moderate",
      "explanation": "Biological corridors (or wildlife corridors) are strips of natural habitat that connect isolated patches, allowing animals to travel safely between them."
    },
    {
      "question": "Which of the following is a result of increased UV radiation reaching the Earth's surface due to ozone depletion?",
      "options": [
        "Increased rates of skin cancer and cataracts",
        "Faster growth of agricultural crops",
        "Lower global temperatures",
        "Increased dissolved oxygen in oceans"
      ],
      "correctAnswer": "Increased rates of skin cancer and cataracts",
      "difficulty": "moderate",
      "explanation": "The ozone layer protects Earth from harmful UVB radiation. Without it, living tissues are damaged, leading to health issues in humans and damage to phytoplankton and plants."
    },
    {
      "question": "How does 'urbanization' typically affect the local water cycle?",
      "options": [
        "It increases groundwater recharge by allowing more rain to soak in",
        "It increases surface runoff and reduces infiltration due to paved surfaces",
        "It has no effect on water flow",
        "It eliminates the need for transpiration"
      ],
      "correctAnswer": "It increases surface runoff and reduces infiltration due to paved surfaces",
      "difficulty": "moderate",
      "explanation": "Impermeable surfaces like concrete and asphalt prevent rain from soaking into the soil (infiltration), leading to higher risks of flash flooding and lower groundwater levels."
    },
    {
      "question": "A farmer rotates maize with beans every season. This 'crop rotation' is beneficial because:",
      "options": [
        "It allows the farmer to use the same pesticide for both",
        "Legumes like beans help restore nitrogen to the soil",
        "It prevents any insects from ever entering the field",
        "It doubles the amount of water the soil can hold"
      ],
      "correctAnswer": "Legumes like beans help restore nitrogen to the soil",
      "difficulty": "moderate",
      "explanation": "Legumes have a symbiotic relationship with nitrogen-fixing bacteria. Planting them helps replenish soil nitrogen that 'heavy-feeding' crops like maize deplete."
    },
    {
      "question": "Which of the following is an example of 'Ex-situ' conservation?",
      "options": ["A National Park", "A Biosphere Reserve", "A Seed Bank", "A Community Forest"],
      "correctAnswer": "A Seed Bank",
      "difficulty": "easy",
      "explanation": "Ex-situ conservation means protecting a species 'off-site' (outside its natural habitat). Seed banks, zoos, and botanical gardens are prime examples."
    },
    {
      "question": "The practice of 'Mulching' involves covering the soil with organic matter. Its main purpose is to:",
      "options": [
        "Attract pests away from the crops",
        "Increase the speed of wind erosion",
        "Conserve soil moisture and suppress weeds",
        "Reflect all sunlight away from the plants"
      ],
      "correctAnswer": "Conserve soil moisture and suppress weeds",
      "difficulty": "easy",
      "explanation": "Mulch acts as a protective layer that reduces evaporation from the soil surface and blocks sunlight from reaching weed seeds."
    },
    {
      "question": "Why is 'Plastic Pollution' a major concern for marine life?",
      "options": [
        "Marine animals can mistake plastic for food, leading to starvation",
        "Plastic increases the saltiness of the ocean",
        "Plastic makes the water too warm",
        "Plastic is a natural fertilizer that causes algal blooms"
      ],
      "correctAnswer": "Marine animals can mistake plastic for food, leading to starvation",
      "difficulty": "easy",
      "explanation": "Animals like sea turtles often mistake plastic bags for jellyfish. Eating plastic provides no nutrition and can block the digestive tract, leading to a slow death."
    },
    {
      "question": "What is the role of 'Decomposers' in a landfill?",
      "options": [
        "They turn plastic into gold",
        "They break down organic waste, producing methane gas",
        "They prevent any odors from escaping",
        "They create the electricity directly"
      ],
      "correctAnswer": "They break down organic waste, producing methane gas",
      "difficulty": "moderate",
      "explanation": "In the anaerobic (oxygen-poor) layers of a landfill, specialized bacteria break down organic materials (food/paper), releasing methane as a byproduct."
    },
    {
      "question": "Assertion (A): Introduction of exotic species can lead to the loss of local biodiversity.\nReason (R): Exotic species may have no natural predators in the new environment, allowing them to overpopulate and outcompete native species.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "The lack of 'biological checks' (predators/diseases) in a new area often turns a non-native species into an invasive one."
    },
    {
      "question": "Which of the following describes 'Bioremediation'?",
      "options": [
        "Using mechanical shovels to move polluted soil",
        "Using bacteria or fungi to break down pollutants like oil spills",
        "Burning toxic waste at high temperatures",
        "Dumping waste in the deep ocean where it can't be seen"
      ],
      "correctAnswer": "Using bacteria or fungi to break down pollutants like oil spills",
      "difficulty": "moderate",
      "explanation": "Bioremediation uses the metabolism of living organisms to remove or neutralize pollutants from a contaminated site."
    },
    {
      "question": "A 'Carbon Footprint' measures:",
      "options": [
        "The size of a person's foot in carbon-based soil",
        "The total amount of greenhouse gases produced by human activities",
        "The number of trees a person plants in a year",
        "The depth of coal mines in a country"
      ],
      "correctAnswer": "The total amount of greenhouse gases produced by human activities",
      "difficulty": "easy",
      "explanation": "A carbon footprint is a measure of the impact human activities have on the environment in terms of the amount of greenhouse gases produced, measured in units of carbon dioxide."
    },
    {
      "question": "In a sigmoid (S-shaped) growth curve, the level at which the population stabilizes is the:",
      "options": ["Biotic potential", "Environmental resistance", "Carrying capacity", "Exponential phase"],
      "correctAnswer": "Carrying capacity",
      "difficulty": "easy",
      "explanation": "Carrying capacity (K) is the maximum population size that an environment can sustain indefinitely given the available resources."
    },
    {
      "question": "Which of the following is a 'Renewable' energy source used to reduce the effect of human activities on the ecosystem?",
      "options": ["Coal", "Natural Gas", "Wind Power", "Nuclear Fission"],
      "correctAnswer": "Wind Power",
      "difficulty": "easy",
      "explanation": "Wind power is renewable and produces no greenhouse gas emissions during operation, unlike fossil fuels like coal and natural gas."
    },
    {
      "question": "The 'Green Revolution' refers to:",
      "options": [
        "A political movement to plant more trees",
        "A period of significant increase in agricultural productivity due to new technologies",
        "The natural process of ecological succession",
        "The discovery of photosynthesis"
      ],
      "correctAnswer": "A period of significant increase in agricultural productivity due to new technologies",
      "difficulty": "moderate",
      "explanation": "The Green Revolution involved the development of high-yielding varieties of cereal grains, expansion of irrigation infrastructure, and distribution of hybridized seeds, synthetic fertilizers, and pesticides."
    },
    {
      "question": "Which of these is a social/economic benefit of biological conservation?",
      "options": [
        "Increasing the cost of wood",
        "Ecotourism providing jobs and revenue",
        "Preventing all farming activities",
        "Making the climate colder"
      ],
      "correctAnswer": "Ecotourism providing jobs and revenue",
      "difficulty": "easy",
      "explanation": "Conservation efforts often support ecotourism, which is a major source of income for many countries, including Rwanda, by attracting visitors to see unique biodiversity."
    }
  ],
  "Unit 4: Energy from Respiration": [
    {
      question: "Which of the following describes the biological role of ATP in a cell?",
      options: [
        "It is a long-term storage molecule for glucose",
        "It acts as the immediate universal energy currency of the cell",
        "It is a structural component of the cell membrane",
        "It is an enzyme that speeds up digestion"
      ],
      correctAnswer: "It acts as the immediate universal energy currency of the cell",
      difficulty: "easy",
      explanation: "ATP (Adenosine Triphosphate) provides immediate energy for cellular processes like muscle contraction and active transport. Unlike starch or glycogen, it is not used for long-term storage."
    },
    {
      question: "What are the three main components of an ATP molecule?",
      options: [
        "Glucose, phosphate, and amino acid",
        "Adenine, ribose sugar, and three phosphate groups",
        "Adenosine, deoxyribose, and two phosphate groups",
        "Glycerol, fatty acid, and phosphate"
      ],
      correctAnswer: "Adenine, ribose sugar, and three phosphate groups",
      difficulty: "easy",
      explanation: "ATP consists of a nitrogenous base (adenine), a pentose sugar (ribose), and three inorganic phosphate groups linked by high-energy bonds."
    },
    {
      question: "The conversion of ATP to ADP is a _______ reaction that _______ energy.",
      options: [
        "Hydrolysis; releases",
        "Condensation; requires",
        "Hydrolysis; requires",
        "Dehydration; releases"
      ],
      correctAnswer: "Hydrolysis; releases",
      difficulty: "moderate",
      explanation: "Hydrolysis involves the addition of water to break the terminal phosphate bond of ATP, converting it to ADP and inorganic phosphate while releasing energy (exergonic reaction)."
    },
    {
      question: "Which of the following processes requires ATP to move substances against a concentration gradient?",
      options: ["Simple diffusion", "Facilitated diffusion", "Active transport", "Osmosis"],
      correctAnswer: "Active transport",
      difficulty: "easy",
      explanation: "Active transport requires energy (ATP) to move molecules from an area of low concentration to high concentration, such as the sodium-potassium pump."
    },
    {
      question: "Which respiratory substrate provides the highest energy value per gram?",
      options: ["Carbohydrates", "Proteins", "Lipids (Fats)", "Nucleic acids"],
      correctAnswer: "Lipids (Fats)",
      difficulty: "moderate",
      explanation: "Lipids have a higher proportion of hydrogen atoms per molecule compared to carbohydrates. When oxidized, they yield significantly more energy (approx. 39 kJ/g) than carbohydrates (approx. 17 kJ/g)."
    },
    {
      question: "The Respiratory Quotient (RQ) is calculated as:",
      options: [
        "Volume of O2 consumed / Volume of CO2 produced",
        "Volume of CO2 produced / Volume of O2 consumed",
        "Mass of substrate / Time taken",
        "Volume of Glucose / Volume of ATP"
      ],
      correctAnswer: "Volume of CO2 produced / Volume of O2 consumed",
      difficulty: "moderate",
      type: "calculation",
      explanation: "RQ = (CO2 produced) / (O2 consumed). It is a dimensionless number used to identify which respiratory substrate is being oxidized by an organism."
    },
    {
      question: "What is the typical Respiratory Quotient (RQ) for the aerobic respiration of glucose?",
      options: ["0.7", "0.8", "0.9", "1.0"],
      correctAnswer: "1.0",
      difficulty: "moderate",
      explanation: "For glucose (C6H12O6), the equation is C6H12O6 + 6O2 -> 6CO2 + 6H2O. Since 6 volumes of CO2 are produced for every 6 volumes of O2 consumed, the RQ is 6/6 = 1.0."
    },
    {
      question: "An RQ value of approximately 0.7 indicates that the organism is primarily oxidizing:",
      options: ["Carbohydrates", "Proteins", "Lipids", "Organic acids"],
      correctAnswer: "Lipids",
      difficulty: "moderate",
      explanation: "Lipids require more oxygen for their oxidation relative to the amount of carbon dioxide produced, resulting in a lower RQ value (approx. 0.7)."
    },
    {
      question: "Assertion (A): ATP is synthesized by the phosphorylation of ADP.\nReason (R): This process is endergonic and requires an input of energy from the oxidation of food.",
      options: [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      correctAnswer: "Both A and R are true, and R explains A",
      difficulty: "moderate",
      type: "assertionReason",
      explanation: "Adding a phosphate group to ADP (phosphorylation) requires energy. In cells, this energy is captured from respiratory substrates like glucose during cellular respiration."
    },
    {
      question: "Which of the following is an example of 'mechanical work' powered by ATP in humans?",
      options: [
        "Synthesis of proteins",
        "Muscle contraction",
        "Conduction of nerve impulses",
        "Absorption of glucose in the gut"
      ],
      correctAnswer: "Muscle contraction",
      difficulty: "easy",
      explanation: "Muscle contraction is physical movement (mechanical work). Protein synthesis is chemical work, and nerve impulses involve electrical/ion transport work."
    },
    {
      question: "A respirometer is used to measure:",
      options: [
        "The rate of photosynthesis",
        "The rate of oxygen consumption or carbon dioxide production",
        "The concentration of ATP in a cell",
        "The temperature of a respiring tissue"
      ],
      correctAnswer: "The rate of oxygen consumption or carbon dioxide production",
      difficulty: "moderate",
      explanation: "A respirometer measures the change in gas volume or pressure in a closed system containing living organisms to determine the rate of respiration."
    },
    {
      question: "In a respirometer experiment, what is the purpose of using potassium hydroxide (KOH) or soda lime?",
      options: [
        "To provide oxygen to the organisms",
        "To absorb carbon dioxide produced by respiration",
        "To act as a respiratory substrate",
        "To maintain a constant temperature"
      ],
      correctAnswer: "To absorb carbon dioxide produced by respiration",
      difficulty: "moderate",
      explanation: "To measure oxygen uptake specifically, CO2 produced must be removed. KOH absorbs CO2, so any volume change in the respirometer is due solely to oxygen consumption."
    },
    {
      question: "Which of these factors does NOT influence the rate of respiration in an organism?",
      options: ["Temperature", "Availability of substrate", "Presence of enzymes", "The color of the organism"],
      correctAnswer: "The color of the organism",
      difficulty: "easy",
      type: "negative",
      explanation: "Respiration is an enzyme-controlled metabolic process influenced by temperature, substrate availability, and metabolic demand, but not by surface pigmentation."
    },
    {
      question: "Under anaerobic conditions in yeast, the RQ value would be:",
      options: ["1.0", "0.7", "Very high (approaching infinity)", "0.0"],
      correctAnswer: "Very high (approaching infinity)",
      difficulty: "hard",
      explanation: "In anaerobic respiration (fermentation) in yeast, CO2 is produced but no O2 is consumed. Since the denominator in the RQ formula (O2) is zero, the value becomes mathematically undefined or very high."
    },
    {
      question: "Why are proteins usually the last substrate used for respiration in a healthy organism?",
      options: [
        "They have no energy value",
        "They are too large to be oxidized",
        "They have more important structural and functional roles in the body",
        "They produce too much carbon dioxide"
      ],
      correctAnswer: "They have more important structural and functional roles in the body",
      difficulty: "moderate",
      explanation: "Proteins form enzymes, hormones, and muscles. The body only respires them during extreme starvation when carbohydrate and lipid stores are exhausted."
    },
    {
      question: "Select all that apply: Which of the following are products of ATP hydrolysis?",
      options: ["ADP", "Inorganic Phosphate (Pi)", "Energy", "Oxygen"],
      correctAnswer: ["ADP", "Inorganic Phosphate (Pi)", "Energy"],
      multiSelect: true,
      difficulty: "moderate",
      type: "multiple",
      explanation: "ATP + H2O -> ADP + Pi + Energy. Oxygen is a reactant in aerobic respiration but not a product of ATP hydrolysis."
    },
    {
      question: "The energy released during the breakdown of ATP is used to drive _______ reactions.",
      options: ["Exergonic", "Endergonic", "Spontaneous", "Physical"],
      correctAnswer: "Endergonic",
      difficulty: "hard",
      explanation: "Endergonic reactions require an input of energy to proceed. Cells 'couple' the exergonic breakdown of ATP with endergonic metabolic pathways."
    },
    {
      question: "Identify the error in this statement: 'The structure of ATP includes a deoxyribose sugar and three phosphate groups.'",
      options: [
        "The error is 'ATP'",
        "The error is 'deoxyribose'",
        "The error is 'three phosphate groups'",
        "No error"
      ],
      correctAnswer: "The error is 'deoxyribose'",
      difficulty: "moderate",
      type: "errorIdentification",
      explanation: "ATP contains ribose sugar. Deoxyribose is the sugar found in DNA."
    },
    {
      question: "If an organism has an RQ of 0.8 to 0.9, it is likely respiring a mixture of substrates or primarily:",
      options: ["Pure fats", "Pure glucose", "Proteins", "Mineral salts"],
      correctAnswer: "Proteins",
      difficulty: "moderate",
      explanation: "Proteins typically yield an RQ value of approximately 0.8 to 0.9 depending on the specific amino acids being oxidized."
    },
    {
      question: "During heavy exercise, why does the rate of ATP breakdown increase in muscle cells?",
      options: [
        "To lower the body temperature",
        "To provide energy for increased cross-bridge cycling in muscle fibers",
        "To produce more glucose for storage",
        "To decrease the heart rate"
      ],
      correctAnswer: "To provide energy for increased cross-bridge cycling in muscle fibers",
      difficulty: "moderate",
      explanation: "Mechanical work (muscle contraction) consumes ATP rapidly. To maintain activity, the rate of ATP hydrolysis and subsequent regeneration via respiration must increase."
    },
    {
      question: "What is the importance of ATP being soluble in water?",
      options: [
        "It allows ATP to be easily transported within the cytoplasm to where it is needed",
        "It prevents ATP from leaving the cell",
        "It makes ATP taste sweet",
        "It allows ATP to form the cell wall"
      ],
      correctAnswer: "It allows ATP to be easily transported within the cytoplasm to where it is needed",
      difficulty: "easy",
      explanation: "Solubility allows the 'energy currency' to diffuse through the aqueous environment of the cell to power various organelles and enzymes."
    },
    {
      question: "Which of the following describes the 'synthesis' of ATP?",
      options: [
        "ATP + H2O -> ADP + Pi",
        "ADP + Pi + energy -> ATP + H2O",
        "Glucose -> CO2 + H2O",
        "Amino acids -> Protein"
      ],
      correctAnswer: "ADP + Pi + energy -> ATP + H2O",
      difficulty: "moderate",
      explanation: "ATP synthesis (phosphorylation) is a condensation reaction where a phosphate is added to ADP, requiring an input of energy."
    },
    {
      question: "True or False: The energy value of a substrate is determined by the amount of hydrogen available for oxidation in the electron transport chain.",
      options: ["True", "False"],
      correctAnswer: "True",
      difficulty: "hard",
      type: "trueFalse",
      explanation: "Most of the energy in respiration is generated through the oxidation of hydrogen. Substrates with more hydrogen atoms per unit mass (like fats) provide more energy."
    },
    {
      question: "In a respirometer containing germinating seeds, if no CO2 absorber is present, and the volume remains constant, what can be concluded?",
      options: [
        "The seeds are dead",
        "The seeds are respiring a substrate with an RQ of 1.0",
        "The seeds are performing anaerobic respiration",
        "The seeds are performing photosynthesis"
      ],
      correctAnswer: "The seeds are respiring a substrate with an RQ of 1.0",
      difficulty: "hard",
      explanation: "If volume is constant, the O2 taken in equals the CO2 given out (Ratio 1:1). This indicates carbohydrate respiration where RQ = 1."
    },
    {
      question: "Which bond in the ATP molecule is often referred to as a 'high-energy bond'?",
      options: [
        "The bond between adenine and ribose",
        "The bond between ribose and the first phosphate",
        "The covalent bonds between phosphate groups",
        "The hydrogen bonds within adenine"
      ],
      correctAnswer: "The covalent bonds between phosphate groups",
      difficulty: "moderate",
      explanation: "Specifically, the bonds between the second and third phosphate groups are unstable and release a significant amount of energy when broken."
    },
    {
      question: "The process of using a proton gradient to synthesize ATP is called:",
      options: ["Active transport", "Chemiosmosis", "Glycolysis", "Hydrolysis"],
      correctAnswer: "Chemiosmosis",
      difficulty: "moderate",
      explanation: "Chemiosmosis is the movement of ions across a semipermeable membrane down their electrochemical gradient. In mitochondria, this drives the enzyme ATP synthase."
    },
    {
      question: "What is the energy value of carbohydrates in kJ/g?",
      options: ["17", "39", "9", "4"],
      correctAnswer: "17",
      difficulty: "easy",
      type: "calculation",
      explanation: "Carbohydrates provide approximately 17 kilojoules of energy per gram. Lipids provide about 39 kJ/g."
    },
    {
      question: "Why does ATP not act as a long-term energy store?",
      options: [
        "It is too stable",
        "It is chemically unstable and is used immediately by the cell",
        "It is too heavy to store in large quantities",
        "It is toxic in high concentrations"
      ],
      correctAnswer: "It is chemically unstable and is used immediately by the cell",
      difficulty: "moderate",
      explanation: "ATP is a 'short-term' molecule. It is continuously synthesized and broken down (high turnover). Cells store energy long-term as fats or glycogen."
    },
    {
      question: "Which of the following equations represents the aerobic respiration of a typical lipid?",
      options: [
        "C6H12O6 + 6O2 -> 6CO2 + 6H2O",
        "2C51H98O6 + 145O2 -> 102CO2 + 98H2O",
        "C3H6O3 -> Lactic acid",
        "C2H5OH + CO2"
      ],
      correctAnswer: "2C51H98O6 + 145O2 -> 102CO2 + 98H2O",
      difficulty: "hard",
      explanation: "Lipids (like tripalmitin) have very little oxygen in their structure compared to carbon and hydrogen, thus requiring much more external oxygen for oxidation."
    },
    {
      question: "If 10ml of oxygen is consumed and 7ml of carbon dioxide is produced, what is the RQ?",
      options: ["0.7", "1.4", "1.0", "7.0"],
      correctAnswer: "0.7",
      difficulty: "moderate",
      type: "calculation",
      explanation: "RQ = CO2 / O2 = 7ml / 10ml = 0.7."
    },
    {
      question: "ATP provides energy for 'Electrical work.' An example of this is:",
      options: [
        "Bioluminescence in fireflies",
        "Maintaining the resting potential of a neuron",
        "Movement of cilia",
        "Production of heat"
      ],
      correctAnswer: "Maintaining the resting potential of a neuron",
      difficulty: "moderate",
      explanation: "Maintaining ion gradients across a membrane to create an electrical potential (like in nerve cells) is a form of electrical work powered by ATP."
    },
    {
      question: "When energy is needed, which enzyme catalyzes the hydrolysis of ATP?",
      options: ["ATP synthase", "ATPase", "Amylase", "DNA polymerase"],
      correctAnswer: "ATPase",
      difficulty: "moderate",
      explanation: "ATPase is the general term for enzymes that decompose ATP into ADP and free phosphate, releasing energy."
    },
    {
      question: "True or False: Respiration occurs in every living cell.",
      options: ["True", "False"],
      correctAnswer: "True",
      difficulty: "easy",
      type: "trueFalse",
      explanation: "Respiration is a fundamental characteristic of life, providing the energy necessary to maintain cellular organization and function."
    },
    {
      question: "Which organelle is the primary site of ATP synthesis in eukaryotic cells?",
      options: ["Ribosome", "Nucleus", "Mitochondrion", "Golgi apparatus"],
      correctAnswer: "Mitochondrion",
      difficulty: "easy",
      explanation: "Mitochondria are known as the 'powerhouses' of the cell because they produce the majority of the cell's ATP through aerobic respiration."
    },
    {
      question: "How much energy (in kJ/mol) is approximately released when one mole of ATP is hydrolyzed to ADP?",
      options: ["7.3", "30.5", "100", "500"],
      correctAnswer: "30.5",
      difficulty: "hard",
      explanation: "Under standard laboratory conditions, the hydrolysis of the terminal phosphate bond of ATP releases approximately 30.5 kJ/mol of energy."
    },
    {
      question: "Which of the following is a key advantage of using ATP as an energy carrier?",
      options: [
        "It releases a huge, uncontrollable burst of energy",
        "It releases energy in small, manageable amounts suitable for cellular reactions",
        "It can only be used in the mitochondria",
        "It never needs to be recycled"
      ],
      correctAnswer: "It releases energy in small, manageable amounts suitable for cellular reactions",
      difficulty: "moderate",
      explanation: "The energy in one molecule of glucose is too much for a single reaction. ATP acts as a middleman, breaking that energy down into small 'packets' that the cell can use without wasting energy as heat."
    },
    {
      question: "In the absence of oxygen, how many molecules of ATP are typically produced from one molecule of glucose?",
      options: ["2", "36", "38", "0"],
      correctAnswer: "2",
      difficulty: "moderate",
      explanation: "Anaerobic respiration (glycolysis) is much less efficient than aerobic respiration, yielding only a net of 2 ATP per glucose molecule compared to 30+ in aerobic respiration."
    },
    {
      question: "Which of the following is NOT a requirement for the measurement of RQ using a respirometer?",
      options: [
        "A constant temperature water bath",
        "Living organisms (e.g., woodlice or seeds)",
        "A source of bright light for photosynthesis",
        "A way to measure volume or pressure change"
      ],
      correctAnswer: "A source of bright light for photosynthesis",
      difficulty: "moderate",
      type: "negative",
      explanation: "Respirometry should ideally be done in the dark or with non-photosynthetic organisms to ensure that only respiration (gas exchange) is being measured, not photosynthesis."
    },
    {
      question: "The bond that joins the ribose sugar to the adenine base is called a:",
      options: ["Phosphodiester bond", "Glycosidic bond", "Peptide bond", "Ester bond"],
      correctAnswer: "Glycosidic bond",
      difficulty: "hard",
      explanation: "A glycosidic bond connects a sugar molecule to another group, which in this case is the nitrogenous base adenine."
    },
    {
      question: "Why is an RQ value of 0.7 for fats lower than 1.0 for carbohydrates?",
      options: [
        "Fats produce more CO2 than carbohydrates",
        "Fats require more O2 for every CO2 molecule produced",
        "Fats do not produce any water",
        "Fats are only respired anaerobically"
      ],
      correctAnswer: "Fats require more O2 for every CO2 molecule produced",
      difficulty: "hard",
      explanation: "Because fats are highly reduced (lots of C-H bonds and very little O), they require extra oxygen to oxidize the hydrogen into water, lowering the ratio of CO2:O2."
    },
    {
      question: "The 'A' in ATP stands for:",
      options: ["Adrenaline", "Adenosine", "Adenine", "Acetone"],
      correctAnswer: "Adenosine",
      difficulty: "easy",
      explanation: "Adenosine is the combination of the adenine base and the ribose sugar. ATP is Adenosine Triphosphate."
    },
    {
      question: "The process by which energy is released from food to make ATP is:",
      options: ["Digestion", "Excretion", "Respiration", "Ingestion"],
      correctAnswer: "Respiration",
      difficulty: "easy",
      explanation: "While digestion breaks down food into smaller molecules, respiration is the metabolic process that actually extracts chemical energy from those molecules to charge ADP into ATP."
    }
  ],
    "Unit 5: Cellular Respiration": [
    {
      "question": "Which of the following describes the correct sequence of stages in aerobic respiration?",
      "options": [
        "Glycolysis → Krebs Cycle → Link Reaction → Oxidative Phosphorylation",
        "Glycolysis → Link Reaction → Krebs Cycle → Oxidative Phosphorylation",
        "Link Reaction → Glycolysis → Krebs Cycle → Electron Transport Chain",
        "Krebs Cycle → Glycolysis → Link Reaction → Oxidative Phosphorylation"
      ],
      "correctAnswer": "Glycolysis → Link Reaction → Krebs Cycle → Oxidative Phosphorylation",
      "difficulty": "easy",
      "explanation": "Respiration begins with glycolysis in the cytosol, followed by the link reaction and Krebs cycle in the mitochondrial matrix, and ends with oxidative phosphorylation on the inner mitochondrial membrane."
    },
    {
      "question": "Where specifically does the Link Reaction take place within a eukaryotic cell?",
      "options": ["Cytoplasm", "Mitochondrial matrix", "Cristae", "Intermembrane space"],
      "correctAnswer": "Mitochondrial matrix",
      "difficulty": "easy",
      "explanation": "Pyruvate produced in the cytoplasm is transported into the mitochondrial matrix, where the link reaction converts it into Acetyl CoA."
    },
    {
      "question": "During the Link Reaction, pyruvate is converted into which 2-carbon molecule?",
      "options": ["Oxaloacetate", "Citrate", "Acetyl CoA", "Lactate"],
      "correctAnswer": "Acetyl CoA",
      "difficulty": "easy",
      "explanation": "The link reaction involves the decarboxylation and oxidation of pyruvate, which then combines with Coenzyme A to form Acetyl CoA."
    },
    {
      "question": "Which of the following are the products of a single turn of the Krebs Cycle (per Acetyl CoA)?",
      "options": [
        "2 CO2, 3 NADH, 1 FADH2, 1 ATP",
        "1 CO2, 2 NADH, 1 FADH2, 2 ATP",
        "3 CO2, 1 NADH, 2 FADH2, 1 ATP",
        "4 CO2, 6 NADH, 2 FADH2, 2 ATP"
      ],
      "correctAnswer": "2 CO2, 3 NADH, 1 FADH2, 1 ATP",
      "difficulty": "moderate",
      "explanation": "One turn of the Krebs cycle processes one Acetyl CoA, producing two molecules of carbon dioxide, three reduced NAD, one reduced FAD, and one ATP via substrate-level phosphorylation."
    },
    {
      "question": "What is the primary role of Oxygen in the Electron Transport Chain (ETC)?",
      "options": [
        "To donate electrons to the chain",
        "To act as the final electron acceptor",
        "To catalyze the formation of Citrate",
        "To pump protons into the intermembrane space"
      ],
      "correctAnswer": "To act as the final electron acceptor",
      "difficulty": "moderate",
      "explanation": "Oxygen accepts electrons and protons at the end of the ETC to form water, allowing the flow of electrons to continue and maintaining the proton gradient."
    },
    {
      "question": "The process by which ATP is synthesized using the energy from a proton gradient is known as:",
      "options": ["Photolysis", "Substrate-level phosphorylation", "Chemiosmosis", "Decarboxylation"],
      "correctAnswer": "Chemiosmosis",
      "difficulty": "moderate",
      "explanation": "Chemiosmosis involves the movement of protons down their electrochemical gradient through ATP synthase, which provides the energy to phosphorylate ADP into ATP."
    },
    {
      "question": "In the absence of oxygen, what is the net yield of ATP from one molecule of glucose during anaerobic respiration in yeast?",
      "options": ["2 ATP", "4 ATP", "36 ATP", "38 ATP"],
      "correctAnswer": "2 ATP",
      "difficulty": "easy",
      "explanation": "Anaerobic respiration only involves glycolysis, which produces a net of 2 ATP molecules per glucose. The subsequent fermentation steps do not produce additional ATP."
    },
    {
      "question": "Which enzyme is responsible for the synthesis of ATP during oxidative phosphorylation?",
      "options": ["Pyruvate dehydrogenase", "Isocitrate dehydrogenase", "ATP synthase", "Cytochrome oxidase"],
      "correctAnswer": "ATP synthase",
      "difficulty": "easy",
      "explanation": "ATP synthase is a membrane-bound enzyme that utilizes the flow of protons to synthesize ATP from ADP and inorganic phosphate."
    },
    {
      "question": "Assertion (A): The inner mitochondrial membrane is highly folded into cristae.\nReason (R): This increases the surface area for the enzymes and carriers involved in the Electron Transport Chain.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "The folds (cristae) provide a vast surface area for oxidative phosphorylation, maximizing the cell's capacity for ATP production."
    },
    {
      "question": "During the Krebs cycle, Acetyl CoA (2C) combines with which 4-carbon molecule to form Citrate (6C)?",
      "options": ["Malate", "Succinate", "Oxaloacetate", "Pyruvate"],
      "correctAnswer": "Oxaloacetate",
      "difficulty": "moderate",
      "explanation": "The Krebs cycle begins when the 2-carbon Acetyl group from Acetyl CoA is transferred to the 4-carbon oxaloacetate to produce the 6-carbon citric acid."
    },
    {
      "question": "Which of the following best explains why anaerobic respiration is less efficient than aerobic respiration?",
      "options": [
        "Glucose is completely oxidized to CO2 and water",
        "Glucose is only partially broken down, leaving energy in products like ethanol or lactate",
        "The Electron Transport Chain works faster without oxygen",
        "Oxygen inhibits the production of ATP in the cytoplasm"
      ],
      "correctAnswer": "Glucose is only partially broken down, leaving energy in products like ethanol or lactate",
      "difficulty": "moderate",
      "explanation": "Aerobic respiration extracts most of the chemical energy in glucose, whereas anaerobic respiration leaves a significant amount of energy trapped in organic molecules like lactate or ethanol."
    },
    {
      "question": "What happens to the reduced NAD (NADH) produced during glycolysis and the Krebs cycle?",
      "options": [
        "It is excreted as waste",
        "It is used to reduce pyruvate in the link reaction",
        "It carries high-energy electrons to the Electron Transport Chain",
        "It is converted directly into ATP in the matrix"
      ],
      "correctAnswer": "It carries high-energy electrons to the Electron Transport Chain",
      "difficulty": "moderate",
      "explanation": "NADH and FADH2 act as electron carriers that deliver electrons to the ETC, which ultimately powers the production of the majority of the cell's ATP."
    },
    {
      "question": "If a cell is respiring lipids instead of carbohydrates, how does the entry point into the respiratory pathway change?",
      "options": [
        "Lipids are converted to glucose first",
        "Fatty acids are broken down into Acetyl CoA and enter the Krebs Cycle",
        "Glycerol enters at the end of the Electron Transport Chain",
        "Lipids can only be respired anaerobically"
      ],
      "correctAnswer": "Fatty acids are broken down into Acetyl CoA and enter the Krebs Cycle",
      "difficulty": "hard",
      "explanation": "Through beta-oxidation, fatty acids are chopped into 2-carbon fragments (Acetyl CoA) that enter the Krebs cycle directly, bypassing glycolysis."
    },
    {
      "question": "Which factor would cause the rate of cellular respiration to decrease?",
      "options": [
        "An increase in temperature towards the optimum",
        "An increase in the concentration of ADP",
        "A decrease in the availability of oxygen",
        "An increase in the amount of respiratory substrate"
      ],
      "correctAnswer": "A decrease in the availability of oxygen",
      "difficulty": "easy",
      "explanation": "Oxygen is the final electron acceptor; without it, the ETC stalls, preventing the regeneration of NAD+ and slowing down the Krebs cycle and Link reaction."
    },
    {
      "question": "During strenuous exercise, muscle cells produce lactate. What is the purpose of this reaction?",
      "options": [
        "To produce extra ATP",
        "To regenerate NAD+ so glycolysis can continue",
        "To increase the pH of the cell",
        "To store energy for later use"
      ],
      "correctAnswer": "To regenerate NAD+ so glycolysis can continue",
      "difficulty": "hard",
      "explanation": "Lactate fermentation reduces pyruvate using electrons from NADH. This regenerates the NAD+ needed for the triose phosphate dehydrogenase step in glycolysis, allowing a small amount of ATP to still be made."
    },
    {
      "question": "How many molecules of Carbon Dioxide are produced from the complete aerobic oxidation of ONE molecule of glucose?",
      "options": ["2", "4", "6", "12"],
      "correctAnswer": "6",
      "difficulty": "easy",
      "type": "calculation",
      "explanation": "Glucose has 6 carbons. In the link reaction, 2 CO2 are produced (one per pyruvate), and in the Krebs cycle, 4 CO2 are produced (two per Acetyl CoA), totaling 6."
    },
    {
      "question": "What is the effect of cyanide on cellular respiration?",
      "options": [
        "It mimics glucose and blocks glycolysis",
        "It inhibits cytochrome oxidase in the ETC, stopping electron flow",
        "It increases the permeability of the mitochondrial membrane to protons",
        "It prevents the transport of pyruvate into the mitochondria"
      ],
      "correctAnswer": "It inhibits cytochrome oxidase in the ETC, stopping electron flow",
      "difficulty": "hard",
      "explanation": "Cyanide binds to the iron in cytochrome c oxidase (Complex IV), preventing the transfer of electrons to oxygen. This causes the entire chain to back up and stops ATP production."
    },
    {
      "question": "Which of the following substrates has the highest energy value per unit mass?",
      "options": ["Glucose", "Starch", "Triglycerides (Fats)", "Proteins"],
      "correctAnswer": "Triglycerides (Fats)",
      "difficulty": "moderate",
      "explanation": "Fats contain more hydrogen atoms per unit mass than carbohydrates or proteins. Since most energy is derived from the oxidation of hydrogen, fats are more energy-dense."
    },
    {
      "question": "Identify the error in the following statement: 'The Krebs cycle produces the majority of ATP in aerobic respiration through substrate-level phosphorylation.'",
      "options": [
        "The error is 'Krebs cycle'",
        "The error is 'majority of ATP'",
        "The error is 'substrate-level phosphorylation'",
        "No error"
      ],
      "correctAnswer": "The error is 'majority of ATP'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "The Krebs cycle only produces 2 ATP per glucose. The majority of ATP (approx. 28-34) is produced during oxidative phosphorylation via the Electron Transport Chain."
    },
    {
      "question": "What is the net gain of ATP, NADH, and FADH2 specifically from the Krebs cycle per molecule of glucose?",
      "options": [
        "2 ATP, 6 NADH, 2 FADH2",
        "1 ATP, 3 NADH, 1 FADH2",
        "4 ATP, 10 NADH, 2 FADH2",
        "2 ATP, 2 NADH, 2 FADH2"
      ],
      "correctAnswer": "2 ATP, 6 NADH, 2 FADH2",
      "difficulty": "moderate",
      "explanation": "Since one glucose produces two pyruvates and thus two Acetyl CoA molecules, the Krebs cycle turns twice per glucose, doubling the yields of a single turn."
    },
    {
      "question": "Which of the following is a byproduct of anaerobic respiration in muscle cells?",
      "options": ["Ethanol", "Lactic acid", "Carbon dioxide", "Oxygen"],
      "correctAnswer": "Lactic acid",
      "difficulty": "easy",
      "explanation": "In animals (including humans), pyruvate is reduced to lactic acid (lactate) during anaerobic conditions. No CO2 is produced in this specific pathway."
    },
    {
      "question": "Which part of the mitochondria is responsible for maintaining the proton gradient?",
      "options": ["Outer membrane", "Inner membrane", "Matrix", "Intermembrane space"],
      "correctAnswer": "Inner membrane",
      "difficulty": "moderate",
      "explanation": "The inner membrane is impermeable to protons, forcing them to accumulate in the intermembrane space and create the electrochemical gradient used by ATP synthase."
    },
    {
      "question": "True or False: Glycolysis can occur with or without the presence of oxygen.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Glycolysis is an anaerobic process that takes place in the cytoplasm. It is the common first step for both aerobic and anaerobic respiration."
    },
    {
      "question": "What is the specific role of NAD+ in cellular respiration?",
      "options": [
        "It acts as a structural protein",
        "It acts as a coenzyme that accepts electrons and hydrogen ions",
        "It provides the phosphate for ATP synthesis",
        "It breaks down glucose into pyruvate"
      ],
      "correctAnswer": "It acts as a coenzyme that accepts electrons and hydrogen ions",
      "difficulty": "moderate",
      "explanation": "NAD+ is an oxidizing agent (electron carrier) that becomes reduced to NADH during glycolysis, the link reaction, and the Krebs cycle."
    },
    {
      "question": "Which stage of aerobic respiration produces the most reduced coenzymes (NADH and FADH2)?",
      "options": ["Glycolysis", "Link Reaction", "Krebs Cycle", "Oxidative Phosphorylation"],
      "correctAnswer": "Krebs Cycle",
      "difficulty": "moderate",
      "explanation": "Per glucose, the Krebs cycle produces 6 NADH and 2 FADH2, which is more than glycolysis (2 NADH) or the link reaction (2 NADH)."
    },
    {
      "question": "What is the final product of glycolysis?",
      "options": ["Acetyl CoA", "Citrate", "Pyruvate", "Glucose-6-phosphate"],
      "correctAnswer": "Pyruvate",
      "difficulty": "easy",
      "explanation": "One molecule of glucose (6C) is broken down into two molecules of pyruvate (3C) at the end of glycolysis."
    },
    {
      "question": "During the Krebs cycle, what happens to the carbons that were originally part of the Acetyl group?",
      "options": [
        "They are incorporated into the cell wall",
        "They are released as Carbon Dioxide",
        "They are converted into oxygen",
        "They remain part of oxaloacetate"
      ],
      "correctAnswer": "They are released as Carbon Dioxide",
      "difficulty": "moderate",
      "explanation": "The carbons enter as Acetyl CoA and are eventually oxidized and released as CO2 waste during the decarboxylation steps of the cycle."
    },
    {
      "question": "Which of the following describes the 'energy investment' phase of glycolysis?",
      "options": [
        "The production of 4 ATP molecules",
        "The reduction of NAD+ to NADH",
        "The phosphorylation of glucose using 2 ATP molecules",
        "The splitting of pyruvate into CO2"
      ],
      "correctAnswer": "The phosphorylation of glucose using 2 ATP molecules",
      "difficulty": "moderate",
      "explanation": "Glycolysis requires an initial input of 2 ATP to activate glucose and make it more reactive before energy can be harvested in the later steps."
    },
    {
      "question": "The theoretical maximum yield of ATP from one molecule of glucose in aerobic respiration is approximately:",
      "options": ["2", "12", "38", "100"],
      "correctAnswer": "38",
      "difficulty": "easy",
      "explanation": "While actual yields are often lower (around 30-32) due to 'leaky' membranes and transport costs, the theoretical maximum is cited as 38 ATP."
    },
    {
      "question": "Which enzyme catalyzes the decarboxylation of pyruvate in the Link Reaction?",
      "options": ["Pyruvate kinase", "Pyruvate dehydrogenase", "Hexokinase", "Succinate dehydrogenase"],
      "correctAnswer": "Pyruvate dehydrogenase",
      "difficulty": "hard",
      "explanation": "Pyruvate dehydrogenase is a multi-enzyme complex that facilitates the decarboxylation, oxidation, and attachment of CoA to pyruvate."
    },
    {
      "question": "What happens to the pH of the intermembrane space as the Electron Transport Chain operates?",
      "options": [
        "It increases (becomes more basic)",
        "It decreases (becomes more acidic)",
        "It remains neutral",
        "It fluctuates randomly"
      ],
      "correctAnswer": "It decreases (becomes more acidic)",
      "difficulty": "hard",
      "explanation": "The ETC pumps protons (H+ ions) into the intermembrane space. A higher concentration of H+ ions results in a lower, more acidic pH."
    },
    {
      "question": "If an organism is placed in an environment with no oxygen, which of the following processes will STOP first?",
      "options": ["Glycolysis", "The Electron Transport Chain", "Diffusion of CO2", "Hydrolysis of ATP"],
      "correctAnswer": "The Electron Transport Chain",
      "difficulty": "moderate",
      "explanation": "The ETC requires oxygen as the final electron acceptor. Without it, electrons cannot move through the chain, causing it to stop almost immediately."
    },
    {
      "question": "In the Krebs cycle, Succinate is oxidized to Fumarate. Which coenzyme is reduced in this specific step?",
      "options": ["NAD+", "FAD", "NADP+", "ADP"],
      "correctAnswer": "FAD",
      "difficulty": "hard",
      "explanation": "This specific step uses FAD (Flavin Adenine Dinucleotide) as the electron acceptor, forming FADH2."
    },
    {
      "question": "Which of the following is NOT a step in the Link Reaction?",
      "options": [
        "Decarboxylation (loss of CO2)",
        "Oxidation (loss of Hydrogen to NAD+)",
        "Phosphorylation (addition of a phosphate group)",
        "Combination with Coenzyme A"
      ],
      "correctAnswer": "Phosphorylation (addition of a phosphate group)",
      "difficulty": "moderate",
      "type": "negative",
      "explanation": "The link reaction involves decarboxylation, oxidation, and acetylation, but no ATP is used or produced, and no phosphate groups are added."
    },
    {
      "question": "What is the 'solvent' for the Krebs cycle reactions?",
      "options": ["Water in the mitochondrial matrix", "The lipid bilayer of the cristae", "The cytoplasm", "Blood plasma"],
      "correctAnswer": "Water in the mitochondrial matrix",
      "difficulty": "easy",
      "explanation": "The matrix of the mitochondria is a dense, aqueous solution containing the enzymes and substrates needed for the Krebs cycle and Link reaction."
    },
    {
      "question": "Why does FADH2 result in the production of fewer ATP molecules than NADH?",
      "options": [
        "FADH2 is a larger molecule",
        "FADH2 enters the ETC at a later point (Complex II), bypassing the first proton pump",
        "FADH2 is only produced in the cytoplasm",
        "FADH2 cannot cross the mitochondrial membrane"
      ],
      "correctAnswer": "FADH2 enters the ETC at a later point (Complex II), bypassing the first proton pump",
      "difficulty": "hard",
      "explanation": "Because FADH2 donates its electrons 'downstream' of the first complex, fewer protons are pumped into the intermembrane space, resulting in less ATP synthesized via chemiosmosis."
    },
    {
      "question": "Amino acids can be used as respiratory substrates. Before entering the respiratory pathway, they must undergo:",
      "options": ["Decarboxylation", "Deamination", "Dehydration", "Phosphorylation"],
      "correctAnswer": "Deamination",
      "difficulty": "hard",
      "explanation": "Deamination is the removal of the amino group (-NH2), which is excreted as urea. The remaining carbon skeleton is then converted into intermediates like pyruvate or Acetyl CoA."
    },
    {
      "question": "A rise in the concentration of ATP in the cell usually has what effect on the rate of glycolysis?",
      "options": [
        "It speeds it up to make more energy",
        "It has no effect",
        "It inhibits key enzymes (negative feedback), slowing down the process",
        "It causes the cell to switch to anaerobic respiration"
      ],
      "correctAnswer": "It inhibits key enzymes (negative feedback), slowing down the process",
      "difficulty": "hard",
      "explanation": "ATP acts as an allosteric inhibitor of enzymes like phosphofructokinase. When ATP is high, the cell 'signals' that it has enough energy, preventing the unnecessary breakdown of glucose."
    },
    {
      "question": "The conversion of Fructose-1,6-bisphosphate into two molecules of Triose Phosphate occurs in:",
      "options": ["The matrix", "The Link Reaction", "Glycolysis", "The Krebs Cycle"],
      "correctAnswer": "Glycolysis",
      "difficulty": "moderate",
      "explanation": "This is the 'splitting' step of glycolysis where the 6-carbon sugar is divided into two 3-carbon sugars."
    },
    {
      "question": "Which of the following describes the role of Coenzyme A?",
      "options": [
        "It carries hydrogen to the ETC",
        "It accepts the phosphate from ATP",
        "It carries the 2-carbon Acetyl group into the Krebs Cycle",
        "It is the final electron acceptor"
      ],
      "correctAnswer": "It carries the 2-carbon Acetyl group into the Krebs Cycle",
      "difficulty": "moderate",
      "explanation": "Coenzyme A acts as a 'delivery truck' that picks up the acetyl group from the link reaction and delivers it to oxaloacetate in the Krebs cycle."
    },
    {
      "question": "How many times must the Link Reaction occur for every ONE molecule of glucose?",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "2",
      "difficulty": "easy",
      "explanation": "Since glucose produces two molecules of pyruvate, and each pyruvate goes through the link reaction, the reaction occurs twice per glucose molecule."
    },
    {
      "question": "In the Electron Transport Chain, energy is released as electrons move from one carrier to the next. What is this energy used for?",
      "options": [
        "To make water",
        "To pump protons across the inner membrane",
        "To break down glucose",
        "To transport CO2 out of the cell"
      ],
      "correctAnswer": "To pump protons across the inner membrane",
      "difficulty": "moderate",
      "explanation": "The energy from electron transfer is coupled to the active transport of H+ ions into the intermembrane space, creating the gradient necessary for ATP synthesis."
    },
    {
      "question": "True or False: The inner mitochondrial membrane is permeable to protons (H+).",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "The membrane is impermeable to protons. They can only cross through specific protein channels like ATP synthase, which is essential for maintaining the electrochemical gradient."
    },
    {
      "question": "What is the net production of ATP during the 'Energy Payoff' phase of glycolysis per glucose?",
      "options": ["2", "4", "32", "38"],
      "correctAnswer": "4",
      "difficulty": "hard",
      "explanation": "In the payoff phase, 4 ATP are produced. However, because 2 ATP were used in the investment phase, the *net* yield for the whole process of glycolysis is 2 ATP."
    },
    {
      "question": "Which of the following is produced in the Krebs cycle but NOT in the Link reaction?",
      "options": ["NADH", "CO2", "FADH2", "Acetyl CoA"],
      "correctAnswer": "FADH2",
      "difficulty": "moderate",
      "explanation": "FADH2 is unique to the Krebs cycle. Both processes produce NADH and CO2, and Acetyl CoA is a *product* of the link reaction but a *reactant* for the Krebs cycle."
    },
    {
      "question": "What is the source of the electrons that enter the Electron Transport Chain?",
      "options": [
        "Water and Oxygen",
        "The breakdown of ATP",
        "Reduced coenzymes (NADH and FADH2)",
        "The decarboxylation of glucose"
      ],
      "correctAnswer": "Reduced coenzymes (NADH and FADH2)",
      "difficulty": "moderate",
      "explanation": "NADH and FADH2 release high-energy electrons (and protons) to the first complexes of the ETC."
    },
    {
      "question": "The synthesis of ATP from ADP and Pi during the Krebs Cycle is an example of:",
      "options": [
        "Oxidative phosphorylation",
        "Substrate-level phosphorylation",
        "Photophosphorylation",
        "Chemiosmosis"
      ],
      "correctAnswer": "Substrate-level phosphorylation",
      "difficulty": "moderate",
      "explanation": "Substrate-level phosphorylation occurs when a phosphate group is transferred directly from a donor molecule (substrate) to ADP."
    },
    {
      "question": "Which process converts glucose into two molecules of lactate in human muscle cells during intense exercise?",
      "options": [
        "Aerobic respiration",
        "Alcoholic fermentation",
        "Lactate fermentation",
        "The Link reaction"
      ],
      "correctAnswer": "Lactate fermentation",
      "difficulty": "easy",
      "explanation": "Lactate fermentation is the anaerobic pathway used by animals to produce energy quickly when oxygen delivery cannot keep up with demand."
    },
    {
      "question": "What is the approximate efficiency of aerobic respiration in capturing energy from glucose?",
      "options": ["2%", "10%", "40%", "98%"],
      "correctAnswer": "40%",
      "difficulty": "hard",
      "explanation": "Roughly 40% of the energy in glucose is captured in ATP; the remaining 60% is lost as heat, which helps maintain body temperature in mammals."
    },
    {
      "question": "During the Krebs cycle, how many times does decarboxylation occur per turn?",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "2",
      "difficulty": "moderate",
      "explanation": "Decarboxylation occurs twice: once during the conversion of Citrate to a 5C compound, and once from the 5C compound to a 4C compound."
    }
  ],
    "Unit 6: Excretion and Osmoregulation": [
    {
      "question": "Which of the following best defines excretion?",
      "options": ["The removal of undigested food from the gut", "The removal of metabolic waste products from the body", "The maintenance of a constant internal environment", "The release of hormones into the bloodstream"],
      "correctAnswer": "The removal of metabolic waste products from the body",
      "difficulty": "easy",
      "explanation": "Excretion is the elimination of toxic waste products of metabolism, such as CO2 and urea. This is different from egestion, which is the removal of undigested food."
    },
    {
      "question": "Which organ in mammals is primarily responsible for the excretion of urea and the regulation of water potential?",
      "options": ["Liver", "Lungs", "Kidney", "Skin"],
      "correctAnswer": "Kidney",
      "difficulty": "easy",
      "explanation": "The kidneys filter the blood to remove urea (produced in the liver) and perform osmoregulation to maintain the body's water and salt balance."
    },
    {
      "question": "Identify the correct structural sequence of the urinary system from the kidney to the outside.",
      "options": ["Kidney → Urethra → Bladder → Ureter", "Kidney → Ureter → Bladder → Urethra", "Bladder → Ureter → Kidney → Urethra", "Kidney → Bladder → Ureter → Urethra"],
      "correctAnswer": "Kidney → Ureter → Bladder → Urethra",
      "difficulty": "easy",
      "explanation": "Urine produced in the kidneys travels down the ureters to the bladder for storage, and is eventually expelled through the urethra."
    },
    {
      "question": "What is the functional unit of the kidney?",
      "options": ["Neuron", "Nephron", "Alveolus", "Hepatic lobule"],
      "correctAnswer": "Nephron",
      "difficulty": "easy",
      "explanation": "The nephron is the microscopic functional unit of the kidney responsible for filtration, reabsorption, and secretion."
    },
    {
      "question": "In which part of the nephron does ultrafiltration occur?",
      "options": ["Loop of Henle", "Proximal Convoluted Tubule", "Glomerulus and Bowman’s capsule", "Collecting duct"],
      "correctAnswer": "Glomerulus and Bowman’s capsule",
      "difficulty": "moderate",
      "explanation": "Ultrafiltration occurs in the renal corpuscle, where high blood pressure forces water and small solutes out of the glomerulus into the Bowman's capsule."
    },
    {
      "question": "The high pressure required for ultrafiltration in the glomerulus is created because:",
      "options": ["The afferent arteriole is wider than the efferent arteriole", "The efferent arteriole is wider than the afferent arteriole", "The kidney is located near the heart", "The renal vein has valves"],
      "correctAnswer": "The afferent arteriole is wider than the efferent arteriole",
      "difficulty": "moderate",
      "explanation": "The difference in diameter between the wider incoming (afferent) arteriole and the narrower outgoing (efferent) arteriole creates high hydrostatic pressure in the glomerular capillaries."
    },
    {
      "question": "Which of the following substances is NOT normally found in the glomerular filtrate of a healthy individual?",
      "options": ["Glucose", "Urea", "Plasma proteins", "Amino acids"],
      "correctAnswer": "Plasma proteins",
      "difficulty": "moderate",
      "explanation": "Large molecules like plasma proteins and blood cells are too big to pass through the basement membrane during ultrafiltration."
    },
    {
      "question": "Where does the majority of selective reabsorption (e.g., of glucose and amino acids) take place?",
      "options": ["Distal Convoluted Tubule", "Proximal Convoluted Tubule", "Descending limb of the Loop of Henle", "Collecting duct"],
      "correctAnswer": "Proximal Convoluted Tubule",
      "difficulty": "moderate",
      "explanation": "The Proximal Convoluted Tubule (PCT) is specialized with microvilli to increase surface area for the reabsorption of all glucose, amino acids, and most water and salts."
    },
    {
      "question": "The presence of glucose in urine is a common symptom of:",
      "options": ["Kidney stones", "Diabetes mellitus", "Dehydration", "High protein diet"],
      "correctAnswer": "Diabetes mellitus",
      "difficulty": "easy",
      "explanation": "In diabetes mellitus, blood glucose levels exceed the 'renal threshold,' meaning the PCT cannot reabsorb all the glucose, and it is excreted in urine."
    },
    {
      "question": "What is the primary function of the Loop of Henle?",
      "options": ["To filter blood", "To create a high salt concentration (osmotic gradient) in the medulla", "To secrete urea into the filtrate", "To store urine"],
      "correctAnswer": "To create a high salt concentration (osmotic gradient) in the medulla",
      "difficulty": "hard",
      "explanation": "The Loop of Henle acts as a counter-current multiplier to establish a high solute concentration in the medulla, which allows for the reabsorption of water from the collecting duct."
    },
    {
      "question": "The ascending limb of the Loop of Henle is unique because it is:",
      "options": ["Permeable to water but not to salts", "Permeable to salts but impermeable to water", "Permeable to both water and salts", "Impermeable to both water and salts"],
      "correctAnswer": "Permeable to salts but impermeable to water",
      "difficulty": "hard",
      "explanation": "The ascending limb actively pumps out sodium and chloride ions into the medulla but does not allow water to follow, making the filtrate dilute as it moves upward."
    },
    {
      "question": "Which hormone regulates the permeability of the collecting ducts to water?",
      "options": ["Insulin", "Adrenaline", "Antidiuretic Hormone (ADH)", "Thyroxine"],
      "correctAnswer": "Antidiuretic Hormone (ADH)",
      "difficulty": "moderate",
      "explanation": "ADH (Vasopressin) increases the number of aquaporins in the collecting duct walls, allowing more water to be reabsorbed back into the blood."
    },
    {
      "question": "Where is ADH produced and where is it released from?",
      "options": ["Produced in pituitary; released from hypothalamus", "Produced in hypothalamus; released from posterior pituitary", "Produced in kidney; released from adrenal gland", "Produced in pancreas; released from liver"],
      "correctAnswer": "Produced in hypothalamus; released from posterior pituitary",
      "difficulty": "moderate",
      "explanation": "The hypothalamus monitors blood water potential and signals the posterior pituitary gland to release stored ADH when the body is dehydrated."
    },
    {
      "question": "If a person drinks a large amount of water, what change will occur in the body?",
      "options": ["ADH levels increase; urine becomes concentrated", "ADH levels decrease; urine becomes dilute", "Insulin levels increase; urine becomes sweet", "ADH levels increase; urine becomes dilute"],
      "correctAnswer": "ADH levels decrease; urine becomes dilute",
      "difficulty": "moderate",
      "explanation": "High water potential inhibits ADH release. The collecting ducts remain impermeable, so less water is reabsorbed, resulting in large volumes of dilute urine."
    },
    {
      "question": "Aldosterone is a hormone secreted by the ______ that helps regulate ______ levels.",
      "options": ["Pituitary; Water", "Adrenal cortex; Sodium/Potassium", "Pancreas; Glucose", "Thyroid; Calcium"],
      "correctAnswer": "Adrenal cortex; Sodium/Potassium",
      "difficulty": "moderate",
      "explanation": "Aldosterone promotes the reabsorption of sodium ions and the excretion of potassium ions in the distal convoluted tubule and collecting duct."
    },
    {
      "question": "Which of the following is a symptom of kidney failure?",
      "options": ["High blood pressure", "Build-up of urea in the blood (uremia)", "Imbalance of electrolytes", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Kidney failure prevents the removal of waste and the regulation of blood volume and ions, leading to systemic toxicity and cardiovascular issues."
    },
    {
      "question": "In a dialysis machine, the 'dialysis fluid' must have which characteristic?",
      "options": ["It should contain no glucose", "It should have the same concentration of essential solutes as healthy blood", "It should contain a high concentration of urea", "It should be at a lower temperature than the body"],
      "correctAnswer": "It should have the same concentration of essential solutes as healthy blood",
      "difficulty": "moderate",
      "explanation": "By having the same concentration of glucose and salts as healthy blood, only the excess waste (like urea) diffuses out of the patient's blood into the fluid."
    },
    {
      "question": "Why is it necessary to use an immunosuppressant drug after a kidney transplant?",
      "options": ["To help the kidney produce urine", "To prevent the recipient's immune system from attacking the donor organ", "To increase the blood flow to the new kidney", "To prevent bacterial infections"],
      "correctAnswer": "To prevent the recipient's immune system from attacking the donor organ",
      "difficulty": "easy",
      "explanation": "The immune system recognizes the donor kidney as 'foreign' (non-self) and may attempt to destroy it, a process known as organ rejection."
    },
    {
      "question": "How do marine bony fish (teleosts) handle osmoregulation in their salty environment?",
      "options": ["They drink very little water and excrete dilute urine", "They drink seawater and actively excrete salts through their gills", "They absorb water through their skin and do not drink", "They store urea in their blood to match the ocean's salinity"],
      "correctAnswer": "They drink seawater and actively excrete salts through their gills",
      "difficulty": "hard",
      "explanation": "Marine fish are hypocritical to the seawater. To prevent dehydration, they drink water and use specialized chloride cells in their gills to pump out excess salt."
    },
    {
      "question": "Freshwater fish face the problem of:",
      "options": ["Losing water to the environment by osmosis", "Gaining too much water and losing salts", "Salt toxicity from the water they drink", "High urea accumulation in their tissues"],
      "correctAnswer": "Gaining too much water and losing salts",
      "difficulty": "moderate",
      "explanation": "Freshwater fish are hypertonic to their environment. Water enters their bodies constantly, so they must excrete large amounts of very dilute urine and actively take in salts through their gills."
    },
    {
      "question": "Which nitrogenous waste is most common in birds and insects because it is non-toxic and requires very little water for excretion?",
      "options": ["Ammonia", "Urea", "Uric acid", "Creatinine"],
      "correctAnswer": "Uric acid",
      "difficulty": "moderate",
      "explanation": "Uric acid is insoluble and can be excreted as a semi-solid paste, which is an excellent adaptation for water conservation in terrestrial and egg-laying organisms."
    },
    {
      "question": "Protoctista like Amoeba use which structure for osmoregulation?",
      "options": ["Kidneys", "Contractile vacuole", "Cell membrane only", "Nucleus"],
      "correctAnswer": "Contractile vacuole",
      "difficulty": "easy",
      "explanation": "Amoebae living in freshwater gain water by osmosis. They collect this excess water in a contractile vacuole and 'pump' it out to prevent the cell from bursting."
    },
    {
      "question": "Insects use a system of ______ for excretion.",
      "options": ["Flame cells", "Nephridia", "Malpighian tubules", "Gills"],
      "correctAnswer": "Malpighian tubules",
      "difficulty": "moderate",
      "explanation": "Malpighian tubules are outgrowths of the insect digestive tract that remove nitrogenous wastes from the hemolymph and empty them into the gut."
    },
    {
      "question": "Which of the following is a way plants 'excrete' waste products?",
      "options": ["Storing wastes in heartwood", "Losing leaves (abscission)", "Excreting resins and tannins", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Plants do not have a specialized excretory system; they store wastes in vacuoles, dead tissues (heartwood), or shed them along with leaves."
    },
    {
      "question": "What is 'Guttation' in plants?",
      "options": ["The loss of water vapor through stomata", "The loss of liquid water droplets from the edges of leaves through hydathodes", "The transport of sugars in phloem", "The absorption of water by roots"],
      "correctAnswer": "The loss of liquid water droplets from the edges of leaves through hydathodes",
      "difficulty": "moderate",
      "explanation": "Guttation occurs at night or in high humidity when transpiration is low and root pressure is high, forcing liquid water out of specialized pores called hydathodes."
    },
    {
      "question": "The podocytes are specialized cells found in the:",
      "options": ["Loop of Henle", "Basement membrane of the Bowman's capsule", "Walls of the bladder", "Collecting duct"],
      "correctAnswer": "Basement membrane of the Bowman's capsule",
      "difficulty": "hard",
      "explanation": "Podocytes have finger-like projections that wrap around the glomerular capillaries, creating filtration slits that facilitate ultrafiltration."
    },
    {
      "question": "Assertion (A): Desert animals like the Kangaroo Rat have very long Loops of Henle.\nReason (R): A longer Loop of Henle allows for a greater concentration gradient in the medulla and more water reabsorption.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "This is a classic adaptation for water conservation; the longer the loop, the more concentrated the urine can be."
    },
    {
      "question": "What is the primary nitrogenous waste excreted by tadpoles (aquatic) compared to adult frogs (terrestrial)?",
      "options": ["Both excrete urea", "Tadpoles excrete ammonia; Adults excrete urea", "Tadpoles excrete uric acid; Adults excrete ammonia", "Tadpoles excrete urea; Adults excrete ammonia"],
      "correctAnswer": "Tadpoles excrete ammonia; Adults excrete urea",
      "difficulty": "hard",
      "explanation": "Ammonia is highly toxic but very soluble, making it easy for aquatic tadpoles to flush away. Adult frogs switch to urea to conserve water on land."
    },
    {
      "question": "An increase in blood osmotic pressure (blood is too concentrated) is detected by:",
      "options": ["Baroreceptors in the aorta", "Osmoreceptors in the hypothalamus", "Chemoreceptors in the medulla oblongata", "Thermoreceptors in the skin"],
      "correctAnswer": "Osmoreceptors in the hypothalamus",
      "difficulty": "moderate",
      "explanation": "Osmoreceptors are sensory receptors that respond to changes in the water potential of the blood."
    },
    {
      "question": "Which of the following describes the 'Counter-Current' mechanism in the kidney?",
      "options": [
        "Blood and filtrate flowing in the same direction",
        "Fluid flowing in opposite directions in adjacent tubes to maximize exchange",
        "The pumping of blood against gravity",
        "The movement of urine from the bladder to the ureter"
      ],
      "correctAnswer": "Fluid flowing in opposite directions in adjacent tubes to maximize exchange",
      "difficulty": "hard",
      "explanation": "In the Loop of Henle and the vasa recta, fluids flow in opposite directions, which helps maintain the steep osmotic gradient in the renal medulla."
    },
    {
      "question": "What happens to most of the CO2 produced during cellular respiration in plants?",
      "options": ["It is excreted through the roots", "It is reused in photosynthesis during the day", "It is converted into starch and stored", "It is used to make cell walls"],
      "correctAnswer": "It is reused in photosynthesis during the day",
      "difficulty": "easy",
      "explanation": "In plants, the waste product of respiration (CO2) is a necessary reactant for photosynthesis, so it is often recycled within the plant."
    },
    {
      "question": "The main force driving filtration in the kidney is:",
      "options": ["Osmotic pressure", "Hydrostatic blood pressure", "Active transport", "Diffusion"],
      "correctAnswer": "Hydrostatic blood pressure",
      "difficulty": "moderate",
      "explanation": "The pressure of the blood in the glomerular capillaries is higher than the pressure in the Bowman's capsule, forcing the liquid out."
    },
    {
      "question": "Which part of the kidney contains the renal corpuscles (Bowman's capsules)?",
      "options": ["Medulla", "Cortex", "Pelvis", "Ureter"],
      "correctAnswer": "Cortex",
      "difficulty": "easy",
      "explanation": "The outer layer of the kidney (cortex) contains the Bowman's capsules and the convoluted tubules, while the medulla contains the Loops of Henle."
    },
    {
      "question": "True or False: The kidney can produce glucose from non-carbohydrate sources (gluconeogenesis) during prolonged fasting.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "hard",
      "type": "trueFalse",
      "explanation": "While the liver is the primary site, the kidneys also have the enzymes necessary for gluconeogenesis during starvation."
    },
    {
      "question": "Which substance is actively secreted from the blood into the distal convoluted tubule to regulate blood pH?",
      "options": ["Glucose", "Hydrogen ions (H+)", "Red blood cells", "Oxygen"],
      "correctAnswer": "Hydrogen ions (H+)",
      "difficulty": "moderate",
      "explanation": "To maintain acid-base balance, the kidneys secrete H+ ions into the filtrate and reabsorb bicarbonate ions."
    },
    {
      "question": "Drinking alcohol inhibits the release of ADH. What is the expected result?",
      "options": ["Decreased urine production", "Increased urine production and dehydration", "High blood pressure", "Increased reabsorption of glucose"],
      "correctAnswer": "Increased urine production and dehydration",
      "difficulty": "moderate",
      "explanation": "Without ADH, the collecting ducts are not permeable to water, so water cannot be reabsorbed, leading to excessive urination (diuresis)."
    },
    {
      "question": "The process of maintaining a constant osmotic pressure in the fluids of an organism is called:",
      "options": ["Homeostasis", "Osmoregulation", "Thermoregulation", "Excretion"],
      "correctAnswer": "Osmoregulation",
      "difficulty": "easy",
      "explanation": "Osmoregulation is the specific term for the control of water and salt balance."
    },
    {
      "question": "Which structure connects the kidney to the bladder?",
      "options": ["Urethra", "Ureter", "Renal artery", "Renal vein"],
      "correctAnswer": "Ureter",
      "difficulty": "easy",
      "explanation": "Ureters (two) carry urine from the kidneys to the bladder. The urethra (one) carries it from the bladder to the outside."
    },
    {
      "question": "Identify the error: 'In the proximal convoluted tubule, water is reabsorbed by active transport.'",
      "options": [
        "The error is 'proximal convoluted tubule'",
        "The error is 'water'",
        "The error is 'active transport'",
        "No error"
      ],
      "correctAnswer": "The error is 'active transport'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Water is always reabsorbed by osmosis (passive), following the osmotic gradient created by the active transport of salts and glucose."
    },
    {
      "question": "Marine mammals (like whales) get their fresh water primarily from:",
      "options": ["Drinking seawater", "The food they eat and metabolic water", "Absorbing it through their blowholes", "Melting icebergs"],
      "correctAnswer": "The food they eat and metabolic water",
      "difficulty": "hard",
      "explanation": "Marine mammals do not drink seawater; they obtain water from their prey and from the oxidation of fats (metabolic water) and have highly efficient kidneys to produce very concentrated urine."
    },
    {
      "question": "The 'Basement Membrane' in the glomerulus acts as a:",
      "options": ["Molecular sieve", "Pump for sodium", "Source of hormones", "Storage for glucose"],
      "correctAnswer": "Molecular sieve",
      "difficulty": "moderate",
      "explanation": "It is the main filter that prevents large proteins and cells from entering the nephron while allowing small molecules through."
    },
    {
      "question": "Which of the following would increase the GFR (Glomerular Filtration Rate)?",
      "options": ["Constriction of the afferent arteriole", "Dilation of the afferent arteriole", "A drop in systemic blood pressure", "A blockage in the ureter"],
      "correctAnswer": "Dilation of the afferent arteriole",
      "difficulty": "hard",
      "explanation": "Dilating the 'input' pipe (afferent arteriole) increases the volume and pressure of blood entering the glomerulus, thus increasing the rate of filtration."
    },
    {
      "question": "What is the role of the Renal Pelvis?",
      "options": ["Filtering blood", "Reabsorbing glucose", "Collecting urine and funneling it into the ureter", "Producing ADH"],
      "correctAnswer": "Collecting urine and funneling it into the ureter",
      "difficulty": "easy",
      "explanation": "The pelvis is a central collecting area in the kidney where all the collecting ducts empty."
    },
    {
      "question": "Nitrogenous wastes are produced from the breakdown of:",
      "options": ["Carbohydrates", "Fats", "Proteins and Nucleic Acids", "Vitamins"],
      "correctAnswer": "Proteins and Nucleic Acids",
      "difficulty": "easy",
      "explanation": "Nitrogen is a component of amino acids (in proteins) and nitrogenous bases (in DNA/RNA). When these are broken down, the nitrogen must be removed as ammonia, urea, or uric acid."
    },
    {
      "question": "A person in a hot environment will likely have:",
      "options": ["High ADH levels and concentrated urine", "Low ADH levels and dilute urine", "Low ADH levels and concentrated urine", "No ADH production"],
      "correctAnswer": "High ADH levels and concentrated urine",
      "difficulty": "moderate",
      "explanation": "Sweating causes water loss. The hypothalamus detects the drop in water potential and triggers ADH release to conserve as much water as possible at the kidneys."
    },
    {
      "question": "Which of the following describes the cells of the PCT?",
      "options": ["Flattened squamous cells", "Ciliated columnar cells", "Cuboidal cells with many mitochondria and microvilli", "Dead cells filled with keratin"],
      "correctAnswer": "Cuboidal cells with many mitochondria and microvilli",
      "difficulty": "moderate",
      "explanation": "Microvilli increase surface area for reabsorption, and mitochondria provide the ATP needed for active transport of ions and glucose."
    },
        {
      "question": "Which of the following describes the correct function of the 'Vasa Recta'?",
      "options": [
        "It filters blood in the renal cortex",
        "It acts as a counter-current exchanger to maintain the medullary osmotic gradient",
        "It transports urine from the pelvis to the ureter",
        "It secretes ADH into the bloodstream"
      ],
      "correctAnswer": "It acts as a counter-current exchanger to maintain the medullary osmotic gradient",
      "difficulty": "hard",
      "explanation": "The vasa recta are capillary loops that run parallel to the Loops of Henle. They maintain the gradient by slowly removing reabsorbed water and solutes without washing out the high salt concentration in the medulla."
    },
    {
      "question": "In the process of hemodialysis, why is the blood passed through a semi-permeable membrane?",
      "options": [
        "To allow all blood cells to enter the dialysis fluid",
        "To prevent the loss of urea while keeping glucose",
        "To allow waste products like urea to diffuse out while retaining blood cells and proteins",
        "To speed up the flow of blood back to the heart"
      ],
      "correctAnswer": "To allow waste products like urea to diffuse out while retaining blood cells and proteins",
      "difficulty": "moderate",
      "explanation": "The membrane mimics the basement membrane of the kidney, allowing small waste molecules to pass through while keeping essential large components in the blood."
    },
    {
      "question": "What is the specific response of the kidney to a decrease in blood pressure (via the Renin-Angiotensin-Aldosterone System)?",
      "options": [
        "The kidney stops all filtration",
        "The kidney releases Renin, eventually leading to salt and water reabsorption",
        "The kidney excretes more sodium to lower pressure",
        "The kidney converts urea into glucose"
      ],
      "correctAnswer": "The kidney releases Renin, eventually leading to salt and water reabsorption",
      "difficulty": "hard",
      "explanation": "Low blood pressure triggers the juxtaglomerular apparatus to release Renin, which starts a cascade resulting in Aldosterone release, increasing blood volume and pressure."
    },
    {
      "question": "Which of the following is an example of an 'Osmoconformer'?",
      "options": ["A human", "A freshwater trout", "A marine invertebrate (like a jellyfish)", "A desert camel"],
      "correctAnswer": "A marine invertebrate (like a jellyfish)",
      "difficulty": "moderate",
      "explanation": "Osmoconformers do not actively regulate their internal osmolarity; instead, their body fluids remain isotonic to the surrounding seawater."
    },
    {
      "question": "The 'Renal Threshold' refers to:",
      "options": [
        "The maximum pressure the bladder can hold",
        "The plasma concentration of a substance at which it begins to appear in the urine",
        "The speed at which blood enters the renal artery",
        "The number of nephrons in a single kidney"
      ],
      "correctAnswer": "The plasma concentration of a substance at which it begins to appear in the urine",
      "difficulty": "moderate",
      "explanation": "For substances like glucose, if the blood concentration is too high, the carrier proteins in the PCT become saturated, and the excess 'spills' into the urine."
    },
    {
      "question": "What is the primary advantage of excreting nitrogenous waste as Ammonia in aquatic animals?",
      "options": [
        "It is very energy-efficient to produce",
        "It can be stored for long periods in the body",
        "It is non-toxic",
        "It helps the animal float"
      ],
      "correctAnswer": "It is very energy-efficient to produce",
      "difficulty": "moderate",
      "explanation": "Ammonia is a direct byproduct of protein metabolism. While toxic, aquatic animals can flush it out immediately into the surrounding water without spending energy converting it to urea or uric acid."
    },
    {
      "question": "Which part of the nephron is most sensitive to the action of Aldosterone?",
      "options": ["Glomerulus", "Proximal Convoluted Tubule", "Distal Convoluted Tubule and Collecting Duct", "Descending Loop of Henle"],
      "correctAnswer": "Distal Convoluted Tubule and Collecting Duct",
      "difficulty": "moderate",
      "explanation": "Aldosterone acts on the final segments of the nephron to fine-tune the reabsorption of sodium and secretion of potassium."
    },
    {
      "question": "The yellow color of normal urine is primarily due to the presence of:",
      "options": ["Urea", "Urochrome (from hemoglobin breakdown)", "Ammonia", "Excess glucose"],
      "correctAnswer": "Urochrome (from hemoglobin breakdown)",
      "difficulty": "moderate",
      "explanation": "Urochrome (or urobilin) is a pigment resulting from the destruction of old red blood cells in the liver and spleen, eventually excreted by the kidneys."
    },
    {
      "question": "Which of the following would be an expected adaptation in a freshwater organism to prevent 'waterlogging'?",
      "options": [
        "Drinking large amounts of water",
        "Active uptake of salts by specialized cells",
        "Production of very concentrated urine",
        "Reducing the number of contractile vacuoles"
      ],
      "correctAnswer": "Active uptake of salts by specialized cells",
      "difficulty": "hard",
      "explanation": "Because they constantly gain water, freshwater organisms must actively pump salts *into* their bodies to replace what is lost in their very dilute urine."
    },
    {
      "question": "Which structural feature of the PCT cells supports the high energy demand for active transport?",
      "options": ["Large vacuoles", "Abundant mitochondria", "Thick cell walls", "Cilia"],
      "correctAnswer": "Abundant mitochondria",
      "difficulty": "easy",
      "explanation": "Active transport requires ATP. PCT cells are packed with mitochondria to provide the energy needed to pump glucose and ions against concentration gradients."
    },
    {
      "question": "The 'Bowman's Space' contains:",
      "options": ["Blood cells", "Glomerular filtrate", "Pure water", "Deoxygenated blood"],
      "correctAnswer": "Glomerular filtrate",
      "difficulty": "easy",
      "explanation": "The Bowman's space is the gap between the glomerulus and the capsule wall where the filtrate first collects after passing through the filtration slits."
    },
    {
      "question": "In birds, the waste from the kidneys is emptied into a common chamber also used by the digestive system called the:",
      "options": ["Urethra", "Pelvis", "Cloaca", "Vasa Recta"],
      "correctAnswer": "Cloaca",
      "difficulty": "easy",
      "explanation": "The cloaca is the common exit for the digestive, urinary, and reproductive tracts in birds, reptiles, and amphibians."
    },
    {
      "question": "Which of these is a 'Metabolic Waste' product specifically from the breakdown of Nucleic Acids?",
      "options": ["Carbon dioxide", "Uric acid", "Lactic acid", "Water"],
      "correctAnswer": "Uric acid",
      "difficulty": "hard",
      "explanation": "In humans, uric acid is specifically the end product of purine (nucleic acid) metabolism, while urea is the main product of general amino acid metabolism."
    },
    {
      "question": "What happens to the volume of the filtrate as it passes through the Proximal Convoluted Tubule?",
      "options": [
        "It increases significantly",
        "It stays the same",
        "It decreases by about 65-80%",
        "It turns into pure urea"
      ],
      "correctAnswer": "It decreases by about 65-80%",
      "difficulty": "hard",
      "explanation": "The PCT is the site of massive reabsorption. As solutes are pumped out, water follows by osmosis, greatly reducing the total volume of fluid remaining in the tubule."
    },
    {
      "question": "The hormone 'Atrial Natriuretic Peptide' (ANP) has the opposite effect of Aldosterone. What does ANP do?",
      "options": [
        "Increases sodium reabsorption",
        "Promotes the excretion of sodium and water to lower blood pressure",
        "Increases the thirst reflex",
        "Stimulates the release of ADH"
      ],
      "correctAnswer": "Promotes the excretion of sodium and water to lower blood pressure",
      "difficulty": "hard",
      "explanation": "ANP is released by the heart when blood pressure is too high. it inhibits sodium reabsorption, leading to more water loss in urine, which lowers blood volume and pressure."
    }
  ],
  "Unit 7: General Principles of Reception and Response in Animals": [
    {
      "question": "Which type of sensory receptor is responsible for detecting changes in blood pressure?",
      "options": ["Chemoreceptor", "Baroreceptor", "Photoreceptor", "Thermoreceptor"],
      "correctAnswer": "Baroreceptor",
      "difficulty": "moderate",
      "explanation": "Baroreceptors are a specialized type of mechanoreceptor that detect the stretching of blood vessel walls, signaling changes in blood pressure to the brain."
    },
    {
      "question": "The process of converting a physical or chemical stimulus into an electrical signal (nerve impulse) is called:",
      "options": ["Transmission", "Transduction", "Processing", "Perception"],
      "correctAnswer": "Transduction",
      "difficulty": "easy",
      "explanation": "Sensory transduction is the fundamental process where receptors convert energy from a stimulus (like light or sound) into a generator potential that may trigger an action potential."
    },
    {
      "question": "Which part of the eye is primarily responsible for the most refraction (bending) of light as it enters?",
      "options": ["Lens", "Retina", "Cornea", "Iris"],
      "correctAnswer": "Cornea",
      "difficulty": "moderate",
      "explanation": "While the lens provides fine adjustment (accommodation), the cornea has the greatest refractive power because of the large difference in refractive index between air and the corneal tissue."
    },
    {
      "question": "In the human eye, the 'blind spot' exists because:",
      "options": [
        "There are too many cones in that area",
        "It is where the optic nerve exits the eye and lacks photoreceptors",
        "The vitreous humor is too thick there",
        "It is the area of highest visual acuity"
      ],
      "correctAnswer": "It is where the optic nerve exits the eye and lacks photoreceptors",
      "difficulty": "easy",
      "explanation": "The optic disc is the point where the axons of ganglion cells converge to form the optic nerve. Since no rods or cones are present here, light falling on this spot cannot be detected."
    },
    {
      "question": "What is the function of the 'Ciliary Muscles' in the eye?",
      "options": [
        "To change the size of the pupil",
        "To move the eyeball within the socket",
        "To alter the shape of the lens for accommodation",
        "To produce tears"
      ],
      "correctAnswer": "To alter the shape of the lens for accommodation",
      "difficulty": "moderate",
      "explanation": "Ciliary muscles contract or relax to change the tension on the suspensory ligaments, thereby changing the curvature of the lens to focus on near or distant objects."
    },
    {
      "question": "Which photoreceptor cells are more sensitive to low light levels but do not distinguish colors?",
      "options": ["Cones", "Rods", "Bipolar cells", "Amacrine cells"],
      "correctAnswer": "Rods",
      "difficulty": "easy",
      "explanation": "Rods contain the pigment rhodopsin and are highly sensitive, allowing for vision in dim light (scotopic vision), though they provide low resolution and no color information."
    },
    {
      "question": "The 'Fovea Centralis' is the region of the retina where:",
      "options": [
        "Rods are most densely packed",
        "Visual acuity is highest because of a high density of cones",
        "The optic nerve attaches",
        "Light is reflected by the tapetum"
      ],
      "correctAnswer": "Visual acuity is highest because of a high density of cones",
      "difficulty": "moderate",
      "explanation": "The fovea contains only cones and has a one-to-one ratio with bipolar cells, providing the sharpest detailed vision and color perception."
    },
    {
      "question": "Which structure in the ear is responsible for equalizing pressure between the middle ear and the atmosphere?",
      "options": ["Cochlea", "Eustachian tube", "Semicircular canals", "Pinna"],
      "correctAnswer": "Eustachian tube",
      "difficulty": "easy",
      "explanation": "The Eustachian tube connects the middle ear to the pharynx. Opening it (by swallowing or yawning) allows air to enter or leave the middle ear to match external pressure."
    },
    {
      "question": "The 'Organ of Corti' is located within which part of the ear?",
      "options": ["Auditory canal", "Semicircular canals", "Cochlea", "Tympanic membrane"],
      "correctAnswer": "Cochlea",
      "difficulty": "moderate",
      "explanation": "The Organ of Corti is the actual organ of hearing; it contains hair cells that convert mechanical vibrations of the fluid in the cochlea into nerve impulses."
    },
    {
      "question": "Which part of the ear is primarily involved in maintaining 'Dynamic Equilibrium' (balance during movement)?",
      "options": ["Ossicles", "Semicircular canals", "Cochlea", "Eardrum"],
      "correctAnswer": "Semicircular canals",
      "difficulty": "moderate",
      "explanation": "The three semicircular canals are oriented in different planes and contain fluid that moves when the head rotates, stimulating hair cells to signal movement to the brain."
    },
    {
      "question": "The sequence of the three middle ear bones (ossicles) from the eardrum to the inner ear is:",
      "options": [
        "Incus → Malleus → Stapes",
        "Stapes → Incus → Malleus",
        "Malleus → Incus → Stapes",
        "Malleus → Stapes → Incus"
      ],
      "correctAnswer": "Malleus → Incus → Stapes",
      "difficulty": "moderate",
      "explanation": "The Malleus (hammer) is attached to the eardrum, the Incus (anvil) is in the middle, and the Stapes (stirrup) pushes against the oval window of the inner ear."
    },
    {
      "question": "Which of the following tastes is triggered by hydrogen ions (H+) in acidic foods?",
      "options": ["Sweet", "Salty", "Sour", "Bitter"],
      "correctAnswer": "Sour",
      "difficulty": "easy",
      "explanation": "Sour taste receptors are stimulated primarily by the acidity of a substance, which is determined by the concentration of free hydrogen ions."
    },
    {
      "question": "Taste buds are located within small projections on the tongue called:",
      "options": ["Villi", "Papillae", "Alveoli", "Cilia"],
      "correctAnswer": "Papillae",
      "difficulty": "easy",
      "explanation": "Papillae are the visible bumps on the tongue surface. There are several types (fungiform, vallate, foliate) that house the microscopic taste buds."
    },
    {
      "question": "In the skin, 'Pacinian corpuscles' are specialized for detecting:",
      "options": ["Light touch", "Cold temperatures", "Deep pressure and vibration", "Pain"],
      "correctAnswer": "Deep pressure and vibration",
      "difficulty": "moderate",
      "explanation": "Pacinian corpuscles are encapsulated nerve endings located deep in the dermis that respond to rapid changes in pressure and high-frequency vibrations."
    },
    {
      "question": "Free nerve endings in the skin are primarily responsible for the sensation of:",
      "options": ["Vibration", "Pain and temperature", "Deep pressure", "Texture"],
      "correctAnswer": "Pain and temperature",
      "difficulty": "easy",
      "explanation": "Unlike specialized corpuscles, free nerve endings lack complex capsules and are the most common receptors for nociception (pain) and thermoreception."
    },
    {
      "question": "What is 'Accommodation' in the context of the human eye?",
      "options": [
        "The ability to see in the dark",
        "The adjustment of the lens shape to focus on objects at different distances",
        "The movement of both eyes to look at a single object",
        "The process of the pupil constricting in bright light"
      ],
      "correctAnswer": "The adjustment of the lens shape to focus on objects at different distances",
      "difficulty": "moderate",
      "explanation": "Accommodation allows the eye to maintain a clear image on the retina by increasing the curvature of the lens for near objects and flattening it for far objects."
    },
    {
      "question": "When focusing on a NEAR object, the ciliary muscles _______ and the suspensory ligaments _______.",
      "options": ["Contract; slacken", "Relax; tighten", "Contract; tighten", "Relax; slacken"],
      "correctAnswer": "Contract; slacken",
      "difficulty": "hard",
      "explanation": "Contraction of the ciliary muscle reduces the diameter of the ciliary ring, causing the suspensory ligaments to go slack. This allows the elastic lens to become more spherical/rounded."
    },
    {
      "question": "Rhodopsin, the pigment in rods, is broken down by light into which two components?",
      "options": ["Melanin and Keratin", "Opsin and Retinal", "Glucose and Oxygen", "Hemoglobin and Iron"],
      "correctAnswer": "Opsin and Retinal",
      "difficulty": "hard",
      "explanation": "This process is called 'bleaching.' Light changes the shape of retinal, causing it to dissociate from the protein opsin, which triggers the electrical response."
    },
    {
      "question": "Identify the error in this statement: 'The semicircular canals in the inner ear are filled with air to help with balance.'",
      "options": [
        "The error is 'semicircular canals'",
        "The error is 'inner ear'",
        "The error is 'filled with air'",
        "No error"
      ],
      "correctAnswer": "The error is 'filled with air'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "The inner ear (cochlea and semicircular canals) is filled with fluid (endolymph and perilymph), not air. Only the middle ear is air-filled."
    },
    {
      "question": "The 'Umami' taste sensation is a response to which substance?",
      "options": ["Sodium chloride", "Sucrose", "Glutamate (amino acids)", "Quinine"],
      "correctAnswer": "Glutamate (amino acids)",
      "difficulty": "moderate",
      "explanation": "Umami is the 'savory' taste typically found in meats, cheeses, and MSG, triggered by the amino acid glutamate."
    },
    {
      "question": "Which part of the brain is the primary processing center for visual information?",
      "options": ["Cerebellum", "Occipital lobe", "Temporal lobe", "Medulla oblongata"],
      "correctAnswer": "Occipital lobe",
      "difficulty": "easy",
      "explanation": "The visual cortex is located in the occipital lobe at the back of the brain, where signals from the optic nerves are interpreted into images."
    },
    {
      "question": "What happens to the pupil in bright light?",
      "options": [
        "Radial muscles contract, causing dilation",
        "Circular muscles contract, causing constriction",
        "The lens becomes thicker",
        "The cornea flattens"
      ],
      "correctAnswer": "Circular muscles contract, causing constriction",
      "difficulty": "moderate",
      "explanation": "The iris contains two sets of muscles. In bright light, the parasympathetic nervous system causes circular muscles to contract, narrowing the pupil to protect the retina."
    },
    {
      "question": "Which of the following is NOT a component of the sensory system?",
      "options": ["Reception", "Transduction", "Digestion", "Transmission"],
      "correctAnswer": "Digestion",
      "difficulty": "easy",
      "type": "negative",
      "explanation": "The sensory system involves reception (detecting), transduction (converting), transmission (sending), and processing (interpreting) stimuli."
    },
    {
      "question": "High-frequency sounds are primarily detected at which part of the cochlea?",
      "options": [
        "The apex (tip)",
        "The base (near the oval window)",
        "The middle turn",
        "The auditory nerve"
      ],
      "correctAnswer": "The base (near the oval window)",
      "difficulty": "hard",
      "explanation": "The basilar membrane is stiffer and narrower at the base, making it resonate with high-frequency vibrations. Lower frequencies travel further toward the wider, more flexible apex."
    },
    {
      "question": "Olfactory receptors (smell) are unique because:",
      "options": [
        "They are the only receptors that do not use nerves",
        "They are neurons that directly contact the external environment",
        "They only detect light",
        "They are located in the ears"
      ],
      "correctAnswer": "They are neurons that directly contact the external environment",
      "difficulty": "moderate",
      "explanation": "Olfactory sensory neurons have dendrites that extend into the nasal cavity, allowing them to bind directly with odorant molecules dissolved in mucus."
    },
    {
      "question": "A person suffering from 'Myopia' (nearsightedness) has which eye characteristic?",
      "options": [
        "The eyeball is too short",
        "The lens is too weak",
        "The image is focused in front of the retina",
        "The cornea is perfectly flat"
      ],
      "correctAnswer": "The image is focused in front of the retina",
      "difficulty": "moderate",
      "explanation": "In myopia, the eye is usually too long or the lens is too curved, causing distant objects to focus before they reach the retina. This is corrected with concave lenses."
    },
    {
      "question": "True or False: Sensory adaptation occurs when a receptor becomes less responsive to a constant, unchanging stimulus.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Adaptation allows the brain to ignore 'background noise' (like the feel of clothes on skin) to focus on new or changing information."
    },
    {
      "question": "Which part of the skin is composed of dead, keratinized cells that provide a physical barrier?",
      "options": ["Dermis", "Hypodermis", "Stratum corneum", "Sebaceous gland"],
      "correctAnswer": "Stratum corneum",
      "difficulty": "moderate",
      "explanation": "The stratum corneum is the outermost layer of the epidermis, consisting of flattened, dead cells that prevent water loss and pathogen entry."
    },
    {
      "question": "The 'Oval Window' is the interface between:",
      "options": [
        "The outer ear and middle ear",
        "The middle ear and inner ear",
        "The cochlea and the auditory nerve",
        "The throat and the ear"
      ],
      "correctAnswer": "The middle ear and inner ear",
      "difficulty": "easy",
      "explanation": "The stapes vibrates against the oval window, transmitting pressure waves from the air-filled middle ear to the fluid-filled cochlea."
    },
    {
      "question": "Which pigment is found in the 'Choroid' layer of the eye to prevent internal reflection of light?",
      "options": ["Rhodopsin", "Melanin", "Iodopsin", "Hemoglobin"],
      "correctAnswer": "Melanin",
      "difficulty": "moderate",
      "explanation": "The choroid is a dark, pigmented layer between the sclera and retina. The melanin absorbs stray light so it doesn't bounce around and blur the image."
    },
    {
      "question": "Meissner's corpuscles are most abundant in which part of the body?",
      "options": ["Elbows", "Fingertips and lips", "Back of the thighs", "Scalp"],
      "correctAnswer": "Fingertips and lips",
      "difficulty": "easy",
      "explanation": "Meissner's corpuscles are specialized for light touch and texture discrimination, hence their high density in sensitive areas used for tactile exploration."
    },
    {
      "question": "The 'Vestibule' of the inner ear contains the saccule and utricle, which are responsible for detecting:",
      "options": [
        "Sound pitch",
        "Linear acceleration and head tilt (static equilibrium)",
        "Rotational movement",
        "Blood oxygen levels"
      ],
      "correctAnswer": "Linear acceleration and head tilt (static equilibrium)",
      "difficulty": "hard",
      "explanation": "These organs contain otoliths (small crystals) that shift with gravity or forward/backward motion, bending hair cells to signal the head's position relative to the ground."
    },
    {
      "question": "Assertion (A): Cones provide better visual acuity than rods.\nReason (R): Several rods usually converge onto a single bipolar cell, whereas one cone often connects to only one bipolar cell.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "The lack of convergence in cone pathways ensures that the brain receives a distinct signal for every point of light, increasing detail (resolution)."
    },
    {
      "question": "What is the function of the 'Pinna' (auricle)?",
      "options": [
        "To amplify sound 20 times",
        "To collect and funnel sound waves into the auditory canal",
        "To maintain balance",
        "To protect the eardrum from loud noises"
      ],
      "correctAnswer": "To collect and funnel sound waves into the auditory canal",
      "difficulty": "easy",
      "explanation": "The pinna is the visible outer part of the ear. Its shape helps capture sound vibrations from the environment and direct them inward."
    },
    {
      "question": "Hypermetropia (farsightedness) can be corrected using a:",
      "options": ["Concave lens", "Convex lens", "Cylindrical lens", "Prism"],
      "correctAnswer": "Convex lens",
      "difficulty": "moderate",
      "explanation": "Farsightedness occurs when light focuses behind the retina. A convex (converging) lens helps bend the light rays earlier so they focus correctly on the retina."
    },
    {
      "question": "Which cranial nerve carries taste information from the tongue to the brain?",
      "options": ["Optic nerve", "Vagus nerve", "Facial and Glossopharyngeal nerves", "Auditory nerve"],
      "correctAnswer": "Facial and Glossopharyngeal nerves",
      "difficulty": "hard",
      "explanation": "Taste from the front two-thirds of the tongue is carried by the facial nerve (VII), and the back one-third by the glossopharyngeal nerve (IX)."
    },
    {
      "question": "What is the role of 'Endolymph' in the inner ear?",
      "options": [
        "To lubricate the ossicles",
        "To transmit vibrations and stimulate hair cells",
        "To keep the ear canal moist",
        "To drain excess wax"
      ],
      "correctAnswer": "To transmit vibrations and stimulate hair cells",
      "difficulty": "moderate",
      "explanation": "Endolymph is the fluid within the membranous labyrinth. Movement of this fluid (caused by sound or head motion) bends the stereocilia of hair cells, leading to nerve impulses."
    },
    {
      "question": "The 'Round Window' serves what purpose in the ear?",
      "options": [
        "It is where sound enters the ear",
        "It allows pressure to dissipate from the cochlea back into the middle ear",
        "It supports the eardrum",
        "It connects to the throat"
      ],
      "correctAnswer": "It allows pressure to dissipate from the cochlea back into the middle ear",
      "difficulty": "hard",
      "explanation": "Because fluid is incompressible, when the oval window is pushed in, the round window bulges out. This allows the fluid in the cochlea to move and vibrate the membranes."
    },
    {
      "question": "Which of the following is a 'Chemoreceptor'?",
      "options": [
        "A hair cell in the ear",
        "An olfactory cell in the nose",
        "A Pacinian corpuscle in the skin",
        "A rod cell in the eye"
      ],
      "correctAnswer": "An olfactory cell in the nose",
      "difficulty": "easy",
      "explanation": "Chemoreceptors respond to chemical stimuli. Olfactory cells (smell) and taste buds are the primary examples."
    },
    {
      "question": "The 'Conjunctiva' is:",
      "options": [
        "A muscle that moves the eye",
        "A thin, transparent membrane covering the front of the eye and lining the eyelids",
        "The part of the eye that contains the rods",
        "The hole through which light enters"
      ],
      "correctAnswer": "A thin, transparent membrane covering the front of the eye and lining the eyelids",
      "difficulty": "easy",
      "explanation": "The conjunctiva protects the eye and keeps it moist. Inflammation of this membrane is known as 'pink eye' or conjunctivitis."
    },
    {
      "question": "Select all that apply: Which of the following are parts of the 'Middle Ear'?",
      "options": ["Malleus", "Stapes", "Cochlea", "Tympanic membrane"],
      "correctAnswer": ["Malleus", "Stapes", "Tympanic membrane"],
      "multiSelect": true,
      "difficulty": "moderate",
      "type": "multiple",
      "explanation": "The middle ear consists of the tympanic membrane (eardrum) and the three ossicles. The cochlea is part of the inner ear."
    },
    {
      "question": "What is the function of 'Aqueous Humor'?",
      "options": [
        "To maintain the shape of the back of the eye",
        "To provide nutrients to the lens and cornea and maintain pressure in the front of the eye",
        "To capture light",
        "To produce nerve impulses"
      ],
      "correctAnswer": "To provide nutrients to the lens and cornea and maintain pressure in the front of the eye",
      "difficulty": "moderate",
      "explanation": "The aqueous humor is a watery fluid in the anterior chamber. Since the cornea and lens have no blood vessels (to stay transparent), they rely on this fluid for nutrients."
    },
    {
      "question": "Color blindness is usually caused by a defect in or absence of:",
      "options": ["Rods", "Specific types of cones", "The optic nerve", "Vitamin A"],
      "correctAnswer": "Specific types of cones",
      "difficulty": "easy",
      "explanation": "Humans typically have three types of cones (Red, Green, Blue). If one type is missing or dysfunctional, the person cannot distinguish certain colors."
    },
    {
      "question": "Which of the following describes 'Sensory Transmission'?",
      "options": [
        "Detecting a change in the environment",
        "Movement of action potentials along a nerve fiber to the CNS",
        "The brain making sense of a signal",
        "The conversion of light into chemicals"
      ],
      "correctAnswer": "Movement of action potentials along a nerve fiber to the CNS",
      "difficulty": "easy",
      "explanation": "Transmission is the 'postal' part of the system—carrying the encoded electrical message from the receptor to the brain or spinal cord."
    },
    {
      "question": "Night blindness (Nyctalopia) is often linked to a deficiency in:",
      "options": ["Vitamin C", "Vitamin D", "Vitamin A", "Iron"],
      "correctAnswer": "Vitamin A",
      "difficulty": "moderate",
      "explanation": "Vitamin A is needed to synthesize retinal, a component of rhodopsin. Without enough Vitamin A, rod function is impaired, making it hard to see in low light."
    },
    {
      "question": "The 'Vitreous Humor' is located in which part of the eye?",
      "options": [
        "Between the cornea and the lens",
        "The main chamber behind the lens",
        "Inside the optic nerve",
        "Between the retina and choroid"
      ],
      "correctAnswer": "The main chamber behind the lens",
      "difficulty": "easy",
      "explanation": "Vitreous humor is a clear, jelly-like substance that fills the posterior cavity, helping to maintain the eyeball's spherical shape and holding the retina in place."
    },
    {
      "question": "Which receptors in the skin are sensitive to cold and which to heat?",
      "options": [
        "Krause end bulbs (cold); Ruffini endings (heat)",
        "Ruffini endings (cold); Krause end bulbs (heat)",
        "Pacinian corpuscles (cold); Meissner's (heat)",
        "Both are detected by the same receptors"
      ],
      "correctAnswer": "Krause end bulbs (cold); Ruffini endings (heat)",
      "difficulty": "hard",
      "explanation": "Thermoreception is divided between specific receptors: Krause end bulbs are generally thought to detect cold, while Ruffini endings detect warmth/heat."
    },
    {
      "question": "What is the primary function of the 'Iris'?",
      "options": [
        "To focus light onto the retina",
        "To control the amount of light entering the eye by adjusting pupil size",
        "To protect the optic nerve",
        "To produce the vitreous humor"
      ],
      "correctAnswer": "To control the amount of light entering the eye by adjusting pupil size",
      "difficulty": "easy",
      "explanation": "The iris acts like the aperture of a camera, widening or narrowing to ensure the retina receives the optimal amount of light."
    },
    {
      "question": "The 'Basilar Membrane' is found in the:",
      "options": ["Eye", "Ear", "Tongue", "Skin"],
      "correctAnswer": "Ear",
      "difficulty": "easy",
      "explanation": "The basilar membrane is a vital part of the cochlea; it supports the Organ of Corti and vibrates in response to sound waves."
    },
    {
      "question": "In the dark, the pupils become 'dilated.' This is caused by the contraction of the:",
      "options": ["Circular muscles", "Radial muscles", "Ciliary muscles", "Extrinsic muscles"],
      "correctAnswer": "Radial muscles",
      "difficulty": "moderate",
      "explanation": "In dim light, the sympathetic nervous system triggers the radial (longitudinal) muscles of the iris to contract, pulling the iris back and enlarging the pupil."
    },
    {
      "question": "Which of the following is an example of 'Proprioception'?",
      "options": [
        "Feeling the heat from a fire",
        "Sensing the position of your limbs without looking at them",
        "Tasting a sour lemon",
        "Hearing a loud bang"
      ],
      "correctAnswer": "Sensing the position of your limbs without looking at them",
      "difficulty": "moderate",
      "explanation": "Proprioception is the 'sixth sense' that uses receptors in muscles, tendons, and joints to tell the brain where the body parts are in space."
    },
        {
      "question": "Which specific structure in the ear is responsible for amplifying sound vibrations before they reach the inner ear?",
      "options": ["The Pinna", "The Ear Ossicles", "The Cochlea", "The Semicircular Canals"],
      "correctAnswer": "The Ear Ossicles",
      "difficulty": "moderate",
      "explanation": "The three small bones (malleus, incus, and stapes) act as a lever system to amplify the force of sound vibrations from the large eardrum to the much smaller oval window."
    },
    {
      "question": "The 'Statocysts' found in many invertebrates are primarily used for:",
      "options": ["Detecting light", "Sensing gravity and maintaining equilibrium", "Detecting chemical changes in water", "Measuring atmospheric pressure"],
      "correctAnswer": "Sensing gravity and maintaining equilibrium",
      "difficulty": "hard",
      "explanation": "Statocysts are simple sensory organs containing a heavy grain (statolith) that settles against hair cells, allowing the animal to sense its orientation relative to gravity."
    },
    {
      "question": "Which of the following describes the function of the 'Tapetum Lucidum' found in the eyes of many nocturnal animals?",
      "options": [
        "It focuses light onto the fovea",
        "It reflects light back through the retina to increase light availability in the dark",
        "It produces the vitreous humor",
        "It protects the eye from UV radiation"
      ],
      "correctAnswer": "It reflects light back through the retina to increase light availability in the dark",
      "difficulty": "moderate",
      "explanation": "The tapetum lucidum is a reflective layer behind the retina. It gives animals 'eye shine' and allows them to see much better in low-light conditions by giving photoreceptors a second chance to detect light."
    },
    {
      "question": "In the human eye, 'Presbyopia' is a condition typically associated with aging caused by:",
      "options": [
        "The eyeball becoming too long",
        "Loss of elasticity in the lens",
        "Increased pressure in the eye",
        "Clouding of the cornea"
      ],
      "correctAnswer": "Loss of elasticity in the lens",
      "difficulty": "moderate",
      "explanation": "As people age, the lens loses its flexibility, making it difficult for the ciliary muscles to make the lens round enough to focus on near objects."
    },
    {
      "question": "Which of the following best describes 'Phasic Receptors'?",
      "options": [
        "Receptors that never adapt to a stimulus",
        "Receptors that adapt rapidly and signal the beginning or end of a stimulus",
        "Receptors found only in the eyes",
        "Receptors that only respond to pain"
      ],
      "correctAnswer": "Receptors that adapt rapidly and signal the beginning or end of a stimulus",
      "difficulty": "hard",
      "explanation": "Phasic receptors (like those for touch or smell) provide information about changes in the environment rather than maintained states."
    },
    {
      "question": "The 'End-bulb of Krause' is a cutaneous receptor primarily sensitive to:",
      "options": ["Heat", "Cold", "Vibration", "Itch"],
      "correctAnswer": "Cold",
      "difficulty": "hard",
      "explanation": "Krause end-bulbs are thermoreceptors located in the skin and mucous membranes that are specifically tuned to detect cold temperatures."
    },
    {
      "question": "What is the purpose of the 'Lacrimal Gland' in the eye?",
      "options": ["To produce oil for the eyelashes", "To secrete tears that moisten and protect the eye", "To drain excess fluid from the eye", "To produce the pigment of the iris"],
      "correctAnswer": "To secrete tears that moisten and protect the eye",
      "difficulty": "easy",
      "explanation": "The lacrimal gland produces tears which contain lysozymes to kill bacteria and keep the surface of the cornea lubricated."
    },
    {
      "question": "Which part of the ear contains the 'Crista Ampullaris'?",
      "options": ["The Cochlea", "The Utricle", "The Ampulla of the Semicircular Canals", "The Auditory Canal"],
      "correctAnswer": "The Ampulla of the Semicircular Canals",
      "difficulty": "hard",
      "explanation": "The crista ampullaris is the sensory organ of rotation found in the dilated ends (ampullae) of the semicircular canals."
    },
    {
      "question": "During dark adaptation, the concentration of which molecule increases in the rod cells?",
      "options": ["Iodopsin", "Rhodopsin", "Melanin", "Chlorophyll"],
      "correctAnswer": "Rhodopsin",
      "difficulty": "moderate",
      "explanation": "In the dark, rhodopsin (visual purple) is resynthesized from opsin and retinal. As its concentration increases, the eye's sensitivity to dim light improves."
    },
    {
      "question": "What is the 'Generator Potential'?",
      "options": [
        "A constant electrical signal from the brain",
        "A graded change in membrane potential of a receptor in response to a stimulus",
        "The muscle contraction following a signal",
        "The sound wave entering the ear"
      ],
      "correctAnswer": "A graded change in membrane potential of a receptor in response to a stimulus",
      "difficulty": "hard",
      "explanation": "A generator potential is a local depolarization. If it reaches a certain threshold, it triggers an action potential in the sensory neuron."
    },
    {
      "question": "The sense of 'Taste' is technically referred to as:",
      "options": ["Olfaction", "Gustation", "Taction", "Audition"],
      "correctAnswer": "Gustation",
      "difficulty": "easy",
      "explanation": "Gustation refers to the sense of taste, while olfaction refers to smell."
    },
    {
      "question": "Which fluid fills the 'Scala Media' (Cochlear Duct) of the ear?",
      "options": ["Perilymph", "Endolymph", "Blood", "Cerebrospinal fluid"],
      "correctAnswer": "Endolymph",
      "difficulty": "hard",
      "explanation": "The cochlear duct is filled with endolymph, which is high in potassium ions, whereas the surrounding canals (scala vestibuli/tympani) are filled with perilymph."
    },
    {
      "question": "The 'Suspensory Ligaments' connect the lens to the:",
      "options": ["Iris", "Sclera", "Ciliary Body", "Retina"],
      "correctAnswer": "Ciliary Body",
      "difficulty": "moderate",
      "explanation": "The suspensory ligaments (zonules of Zinn) hold the lens in place and transmit the tension of the ciliary muscles to the lens."
    },
    {
      "question": "Which layer of the skin contains the majority of sensory receptors, blood vessels, and sweat glands?",
      "options": ["Epidermis", "Dermis", "Stratum Corneum", "Cuticle"],
      "correctAnswer": "Dermis",
      "difficulty": "easy",
      "explanation": "The dermis is the 'living' layer of the skin beneath the epidermis, housing complex structures like nerves and glands."
    },
    {
      "question": "A loud sound causes the 'Stapedius' muscle in the middle ear to contract. This is known as the:",
      "options": ["Hearing reflex", "Acoustic (Tympanic) reflex", "Balance reflex", "Startle reflex"],
      "correctAnswer": "Acoustic (Tympanic) reflex",
      "difficulty": "hard",
      "explanation": "This reflex pulls the stapes away from the oval window, reducing the transmission of vibrations to protect the inner ear from damage by loud noises."
    }
  ],
  "Unit 8: Nervous Coordination": [
    {
      "question": "Which of the following are the two main divisions of the mammalian nervous system?",
      "options": ["Sensory and Motor", "Central and Peripheral", "Somatic and Autonomic", "Sympathetic and Parasympathetic"],
      "correctAnswer": "Central and Peripheral",
      "difficulty": "easy",
      "explanation": "The nervous system is structurally divided into the Central Nervous System (brain and spinal cord) and the Peripheral Nervous System (nerves outside the CNS)."
    },
    {
      "question": "What is the primary function of the myelin sheath in a neuron?",
      "options": ["To produce neurotransmitters", "To provide nutrients to the cell body", "To insulate the axon and increase the speed of impulse conduction", "To detect external stimuli"],
      "correctAnswer": "To insulate the axon and increase the speed of impulse conduction",
      "difficulty": "easy",
      "explanation": "The myelin sheath, formed by Schwann cells, acts as an electrical insulator, allowing impulses to 'jump' between Nodes of Ranvier via saltatory conduction."
    },
    {
      "question": "Which type of neuron transmits impulses from sensory receptors toward the Central Nervous System?",
      "options": ["Motor neuron", "Relay neuron", "Sensory neuron", "Effector neuron"],
      "correctAnswer": "Sensory neuron",
      "difficulty": "easy",
      "explanation": "Sensory (afferent) neurons carry information from receptors (like skin or eyes) to the brain or spinal cord."
    },
    {
      "question": "The 'Resting Potential' of a typical neuron is approximately:",
      "options": ["+40 mV", "0 mV", "-70 mV", "-90 mV"],
      "correctAnswer": "-70 mV",
      "difficulty": "moderate",
      "explanation": "At rest, the inside of the neuron is negatively charged compared to the outside, usually maintained at around -70 millivolts."
    },
    {
      "question": "Which ion pump is primarily responsible for maintaining the resting membrane potential?",
      "options": ["Calcium pump", "Sodium-Potassium (Na+/K+) pump", "Chloride pump", "Proton pump"],
      "correctAnswer": "Sodium-Potassium (Na+/K+) pump",
      "difficulty": "moderate",
      "explanation": "The Na+/K+ pump actively transports 3 Na+ ions out and 2 K+ ions in, using ATP to maintain the electrochemical gradient."
    },
    {
      "question": "What happens during the 'Depolarization' phase of an action potential?",
      "options": ["Voltage-gated K+ channels open", "The Na+/K+ pump stops working", "Voltage-gated Na+ channels open, and Na+ rushes into the cell", "The membrane becomes more negative"],
      "correctAnswer": "Voltage-gated Na+ channels open, and Na+ rushes into the cell",
      "difficulty": "moderate",
      "explanation": "When a stimulus reaches the threshold, Na+ channels open, allowing positive ions to flood in and reverse the membrane polarity."
    },
    {
      "question": "The 'All-or-Nothing' law of nerve impulses states that:",
      "options": [
        "All neurons in a nerve fire at the same time",
        "The intensity of a stimulus determines the size of the action potential",
        "An action potential occurs fully or not at all, provided the threshold is reached",
        "Neurotransmitters are either all released or all reabsorbed"
      ],
      "correctAnswer": "An action potential occurs fully or not at all, provided the threshold is reached",
      "difficulty": "moderate",
      "explanation": "Action potentials are always the same size; a stronger stimulus increases the frequency of impulses, not their amplitude."
    },
    {
      "question": "Which structure represents the gap between two neurons where chemical transmission occurs?",
      "options": ["Node of Ranvier", "Synaptic cleft", "Axon hillock", "Dendrite"],
      "correctAnswer": "Synaptic cleft",
      "difficulty": "easy",
      "explanation": "The synaptic cleft is the microscopic space between the presynaptic knob and the postsynaptic membrane."
    },
    {
      "question": "In a cholinergic synapse, which neurotransmitter is released into the synaptic cleft?",
      "options": ["Dopamine", "Serotonin", "Acetylcholine", "Adrenaline"],
      "correctAnswer": "Acetylcholine",
      "difficulty": "easy",
      "explanation": "Cholinergic synapses specifically use acetylcholine (ACh) as the chemical messenger."
    },
    {
      "question": "What is the role of Calcium ions (Ca2+) in synaptic transmission?",
      "options": [
        "To depolarize the postsynaptic membrane",
        "To cause synaptic vesicles to fuse with the presynaptic membrane",
        "To break down acetylcholine",
        "To block the reuptake of neurotransmitters"
      ],
      "correctAnswer": "To cause synaptic vesicles to fuse with the presynaptic membrane",
      "difficulty": "hard",
      "explanation": "When an action potential reaches the synaptic knob, voltage-gated Ca2+ channels open; the influx of Ca2+ triggers exocytosis of neurotransmitters."
    },
    {
      "question": "Which enzyme is responsible for breaking down acetylcholine in the synaptic cleft?",
      "options": ["Amylase", "Cholinesterase (Acetylcholinesterase)", "Lipase", "ATP synthase"],
      "correctAnswer": "Cholinesterase (Acetylcholinesterase)",
      "difficulty": "moderate",
      "explanation": "Acetylcholinesterase breaks ACh into choline and ethanoic acid, preventing continuous stimulation of the postsynaptic neuron."
    },
    {
      "question": "Saltatory conduction refers to:",
      "options": [
        "The movement of ions across a synapse",
        "The 'jumping' of an action potential from one Node of Ranvier to the next",
        "The conduction of impulses in unmyelinated fibers",
        "The recycling of neurotransmitters"
      ],
      "correctAnswer": "The 'jumping' of an action potential from one Node of Ranvier to the next",
      "difficulty": "moderate",
      "explanation": "In myelinated axons, depolarization only occurs at the nodes, making the impulse travel much faster than in unmyelinated axons."
    },
    {
      "question": "Identify the correct order of components in a reflex arc.",
      "options": [
        "Receptor → Motor neuron → Relay neuron → Sensory neuron → Effector",
        "Effector → Motor neuron → Relay neuron → Sensory neuron → Receptor",
        "Receptor → Sensory neuron → Relay neuron → Motor neuron → Effector",
        "Relay neuron → Sensory neuron → Receptor → Motor neuron → Effector"
      ],
      "correctAnswer": "Receptor → Sensory neuron → Relay neuron → Motor neuron → Effector",
      "difficulty": "easy",
      "explanation": "A reflex arc follows a specific pathway to ensure a rapid, automatic response to a stimulus."
    },
    {
      "question": "Which of the following is an example of an effector?",
      "options": ["The eye", "A spinal nerve", "A muscle or gland", "The brain"],
      "correctAnswer": "A muscle or gland",
      "difficulty": "easy",
      "explanation": "Effectors are the organs (muscles or glands) that carry out the response instructed by the nervous system."
    },
    {
      "question": "During the 'Refractory Period', a neuron:",
      "options": [
        "Is transmitting impulses at maximum speed",
        "Is releasing large amounts of calcium",
        "Cannot be stimulated to fire another action potential",
        "Is undergoing cell division"
      ],
      "correctAnswer": "Cannot be stimulated to fire another action potential",
      "difficulty": "moderate",
      "explanation": "The refractory period ensures impulses are discrete and travel in only one direction by briefly making the membrane unresponsive."
    },
    {
      "question": "What causes the 'hyperpolarization' (undershoot) phase of an action potential?",
      "options": [
        "Sodium channels staying open too long",
        "Potassium channels closing slowly, allowing too much K+ to leave",
        "The failure of the Na+/K+ pump",
        "An influx of chloride ions"
      ],
      "correctAnswer": "Potassium channels closing slowly, allowing too much K+ to leave",
      "difficulty": "hard",
      "explanation": "Because K+ channels are slow to close, the membrane potential briefly becomes more negative than the resting potential."
    },
    {
      "question": "Where are relay neurons (interneurons) typically located?",
      "options": ["In the sense organs", "Attached to muscles", "Within the Central Nervous System (brain/spinal cord)", "In the skin"],
      "correctAnswer": "Within the Central Nervous System (brain/spinal cord)",
      "difficulty": "moderate",
      "explanation": "Relay neurons act as connectors between sensory and motor neurons within the CNS."
    },
    {
      "question": "Which of the following describes a 'Summation' at a synapse?",
      "options": [
        "The breakdown of neurotransmitters",
        "The additive effect of several electrical impulses to reach a threshold",
        "The loss of signal strength over distance",
        "The insulation of the axon"
      ],
      "correctAnswer": "The additive effect of several electrical impulses to reach a threshold",
      "difficulty": "hard",
      "explanation": "Summation can be temporal (repeated impulses from one neuron) or spatial (impulses from multiple neurons) to trigger an action potential in the postsynaptic cell."
    },
    {
      "question": "Which part of a neuron contains the nucleus and organelles?",
      "options": ["Axon", "Dendrite", "Cell body (Soma)", "Synaptic knob"],
      "correctAnswer": "Cell body (Soma)",
      "difficulty": "easy",
      "explanation": "The cell body is the metabolic center of the neuron containing the nucleus and most cytoplasm."
    },
    {
      "question": "What is the function of 'Dendrites'?",
      "options": [
        "To carry impulses away from the cell body",
        "To receive incoming signals from other neurons or receptors",
        "To secrete myelin",
        "To store waste products"
      ],
      "correctAnswer": "To receive incoming signals from other neurons or receptors",
      "difficulty": "easy",
      "explanation": "Dendrites are highly branched extensions that increase the surface area for receiving signals."
    },
    {
      "question": "True or False: Nerve impulses travel faster in unmyelinated neurons than in myelinated ones.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Myelination significantly increases conduction speed due to saltatory conduction."
    },
    {
      "question": "The resting membrane is more permeable to which ion?",
      "options": ["Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Chloride (Cl-)"],
      "correctAnswer": "Potassium (K+)",
      "difficulty": "hard",
      "explanation": "At rest, there are more open K+ leak channels than Na+ leak channels, allowing K+ to diffuse out more easily, contributing to the negative resting potential."
    },
    {
      "question": "Which of the following is a characteristic of a reflex action?",
      "options": ["Voluntary", "Slow", "Involuntary and rapid", "Learned"],
      "correctAnswer": "Involuntary and rapid",
      "difficulty": "easy",
      "explanation": "Reflexes are automatic, protective responses that occur without conscious thought."
    },
    {
      "question": "What happens to the choline produced after the breakdown of acetylcholine?",
      "options": ["It is excreted in urine", "It is reabsorbed into the presynaptic knob to resynthesize ACh", "It is used as an energy source", "It is converted into urea"],
      "correctAnswer": "It is reabsorbed into the presynaptic knob to resynthesize ACh",
      "difficulty": "moderate",
      "explanation": "Recycling choline is an efficient way for the neuron to maintain its supply of neurotransmitters."
    },
    {
      "question": "Assertion (A): Synapses ensure that nerve impulses travel in only one direction.\nReason (R): Neurotransmitter receptors are only present on the postsynaptic membrane.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Because vesicles are in the presynaptic knob and receptors are on the postsynaptic side, the chemical signal can only cross the gap in one direction."
    },
    {
      "question": "Which of the following is a symptom of damage to the myelin sheath (as seen in Multiple Sclerosis)?",
      "options": [
        "Faster reflex actions",
        "Disrupted or slowed nerve signaling",
        "Increased muscle strength",
        "Improved memory"
      ],
      "correctAnswer": "Disrupted or slowed nerve signaling",
      "difficulty": "moderate",
      "explanation": "Without insulation, the electrical signal leaks and cannot travel efficiently, leading to loss of motor control and sensation."
    },
    {
      "question": "What is 'Threshold Potential'?",
      "options": [
        "The maximum voltage of an action potential",
        "The minimum level of stimulus required to trigger an action potential",
        "The voltage during hyperpolarization",
        "The speed of the impulse"
      ],
      "correctAnswer": "The minimum level of stimulus required to trigger an action potential",
      "difficulty": "moderate",
      "explanation": "If a stimulus does not depolarize the membrane to the threshold (usually -55mV), no action potential is generated."
    },
    {
      "question": "The Autonomic Nervous System (ANS) controls:",
      "options": ["Skeletal muscle movement", "Conscious thought", "Involuntary actions like heart rate and digestion", "The Five Senses"],
      "correctAnswer": "Involuntary actions like heart rate and digestion",
      "difficulty": "easy",
      "explanation": "The ANS regulates the 'automatic' functions of the body without conscious control."
    },
    {
      "question": "Which branch of the Autonomic Nervous System is responsible for the 'Fight or Flight' response?",
      "options": ["Sympathetic", "Parasympathetic", "Somatic", "Central"],
      "correctAnswer": "Sympathetic",
      "difficulty": "easy",
      "explanation": "The sympathetic nervous system prepares the body for stress or emergency by increasing heart rate and redirecting blood flow."
    },
    {
      "question": "Which structure in the spinal cord contains the cell bodies of motor neurons?",
      "options": ["White matter", "Dorsal root ganglion", "Grey matter (Ventral horn)", "Central canal"],
      "correctAnswer": "Grey matter (Ventral horn)",
      "difficulty": "hard",
      "explanation": "Motor neuron cell bodies are located in the ventral (front) part of the spinal cord's grey matter."
    },
    {
      "question": "The 'Ventral Root' of a spinal nerve carries:",
      "options": ["Only sensory fibers", "Only motor fibers", "Both sensory and motor fibers", "Only relay neurons"],
      "correctAnswer": "Only motor fibers",
      "difficulty": "moderate",
      "explanation": "In the spinal cord, sensory fibers enter through the dorsal root, and motor fibers exit through the ventral root."
    },
    {
      "question": "What is the function of the 'Nodes of Ranvier'?",
      "options": [
        "To store neurotransmitters",
        "To provide sites where the axon membrane is exposed for ion exchange",
        "To protect the cell body",
        "To act as a receptor"
      ],
      "correctAnswer": "To provide sites where the axon membrane is exposed for ion exchange",
      "difficulty": "moderate",
      "explanation": "These gaps in the myelin sheath are the only places where depolarization can occur, facilitating saltatory conduction."
    },
    {
      "question": "Identify the error: 'During repolarization, sodium ions are actively pumped back into the cell.'",
      "options": [
        "The error is 'repolarization'",
        "The error is 'sodium ions'",
        "The error is 'pumped back into'",
        "No error"
      ],
      "correctAnswer": "The error is 'pumped back into'",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "During repolarization, Potassium (K+) ions move *out* of the cell via facilitated diffusion through voltage-gated channels to restore the negative charge."
    },
    {
      "question": "Which of the following describes an 'Inhibitory' synapse?",
      "options": [
        "It makes an action potential more likely",
        "It causes the postsynaptic membrane to become hyperpolarized",
        "It increases the release of Calcium",
        "It speeds up the Na+/K+ pump"
      ],
      "correctAnswer": "It causes the postsynaptic membrane to become hyperpolarized",
      "difficulty": "hard",
      "explanation": "Inhibitory neurotransmitters (like GABA) make the inside of the cell even more negative, moving it further from the threshold and making it harder to fire."
    },
    {
      "question": "The 'Parasympathetic' nervous system is often referred to as the system for:",
      "options": ["Fight or Flight", "Rest and Digest", "Memory and Logic", "Pain and Temperature"],
      "correctAnswer": "Rest and Digest",
      "difficulty": "easy",
      "explanation": "The parasympathetic system promotes energy conservation, slowing the heart and stimulating digestion."
    },
    {
      "question": "Schwann cells are responsible for the production of:",
      "options": ["Neurotransmitters", "The Myelin Sheath in the PNS", "Action potentials", "Synaptic vesicles"],
      "correctAnswer": "The Myelin Sheath in the PNS",
      "difficulty": "easy",
      "explanation": "In the peripheral nervous system, Schwann cells wrap around axons to form the insulating myelin layer."
    },
    {
      "question": "Which of the following factors does NOT affect the speed of nerve impulse conduction?",
      "options": ["Axon diameter", "Presence of myelin", "Temperature", "The length of the axon"],
      "correctAnswer": "The length of the axon",
      "difficulty": "moderate",
      "type": "negative",
      "explanation": "While length affects how long it takes to reach the destination, it doesn't change the *speed* (meters per second) at which the signal travels along the fiber."
    },
    {
      "question": "What is the 'Synaptic Delay'?",
      "options": [
        "The time it takes for an axon to regrow",
        "The time required for neurotransmitters to diffuse across the cleft",
        "The period when a neuron is dead",
        "The time between heartbeats"
      ],
      "correctAnswer": "The time required for neurotransmitters to diffuse across the cleft",
      "difficulty": "moderate",
      "explanation": "Chemical transmission is slower than electrical conduction, creating a brief lag (approx 0.5ms) at every synapse."
    },
    {
      "question": "How does the brain distinguish between a light touch and a heavy pressure?",
      "options": [
        "The action potentials for heavy pressure are larger",
        "The action potentials for heavy pressure have a higher frequency",
        "Heavy pressure uses different neurotransmitters",
        "Light touch does not reach the brain"
      ],
      "correctAnswer": "The action potentials for heavy pressure have a higher frequency",
      "difficulty": "moderate",
      "explanation": "Intensity is encoded by the frequency of firing, not the size of the impulse (All-or-Nothing Law)."
    },
    {
      "question": "What is the 'Axon Hillock'?",
      "options": [
        "The end of the axon",
        "The region where the axon joins the cell body and impulses are generated",
        "A type of relay neuron",
        "The space between two Schwann cells"
      ],
      "correctAnswer": "The region where the axon joins the cell body and impulses are generated",
      "difficulty": "hard",
      "explanation": "The axon hillock acts as the 'integrator' that sums up incoming signals to decide if an action potential should be sent down the axon."
    },
    {
      "question": "Which of the following describes a 'Bipolar' neuron?",
      "options": [
        "It has many dendrites and one axon",
        "It has one dendrite and one axon",
        "It has no axon",
        "It has a single process that splits into two"
      ],
      "correctAnswer": "It has one dendrite and one axon",
      "difficulty": "moderate",
      "explanation": "Bipolar neurons have two processes extending from the cell body and are commonly found in specialized sensory organs like the retina."
    },
    {
      "question": "During the resting state, why is the outside of the cell more positive?",
      "options": [
        "There are more K+ ions outside",
        "There is a higher concentration of Na+ ions outside",
        "Negative proteins are outside the cell",
        "Oxygen is positively charged"
      ],
      "correctAnswer": "There is a higher concentration of Na+ ions outside",
      "difficulty": "moderate",
      "explanation": "The Na+/K+ pump and the relative impermeability of the membrane to Na+ keep most sodium ions on the outside."
    },
    {
      "question": "What is 'Exocytosis' in the context of a synapse?",
      "options": [
        "The entry of ions into the cell",
        "The release of neurotransmitters from vesicles into the synaptic cleft",
        "The breakdown of the myelin sheath",
        "The movement of the cell body"
      ],
      "correctAnswer": "The release of neurotransmitters from vesicles into the synaptic cleft",
      "difficulty": "moderate",
      "explanation": "Exocytosis is the process where the vesicle membrane fuses with the cell membrane to dump its contents outside."
    },
    {
      "question": "The 'Knee-jerk' reflex is an example of a:",
      "options": ["Monosynaptic reflex", "Polysynaptic reflex", "Learned behavior", "Cerebral reflex"],
      "correctAnswer": "Monosynaptic reflex",
      "difficulty": "hard",
      "explanation": "The knee-jerk involves only two neurons (sensory and motor) with one synapse between them, making it incredibly fast."
    },
    {
      "question": "What happens if Acetylcholinesterase is inhibited (e.g., by certain nerve gases)?",
      "options": [
        "The muscle cannot contract",
        "Acetylcholine stays in the cleft, causing continuous muscle contraction/spasms",
        "The neuron dies instantly",
        "Sodium channels are permanently blocked"
      ],
      "correctAnswer": "Acetylcholine stays in the cleft, causing continuous muscle contraction/spasms",
      "difficulty": "moderate",
      "explanation": "Without the enzyme to clear the neurotransmitter, the postsynaptic receptors are constantly stimulated."
    },
    {
      "question": "Which part of the brain is the main control center for homeostasis and links the nervous system to the endocrine system?",
      "options": ["Cerebrum", "Cerebellum", "Hypothalamus", "Medulla oblongata"],
      "correctAnswer": "Hypothalamus",
      "difficulty": "easy",
      "explanation": "The hypothalamus regulates body temperature, hunger, and thirst, and controls the pituitary gland."
    },
    {
      "question": "True or False: Sensory neurons always have their cell bodies located in the dorsal root ganglion of the spinal cord.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "hard",
      "type": "trueFalse",
      "explanation": "Structural characteristic of spinal sensory neurons: they are unipolar/pseudounipolar with the cell body 'off to the side' in the ganglion."
    },
    {
      "question": "What is the electrical state of a neuron during the 'Absolute Refractory Period'?",
      "options": [
        "It is at resting potential",
        "Sodium channels are inactivated and cannot reopen",
        "Potassium is rushing into the cell",
        "It is at +100 mV"
      ],
      "correctAnswer": "Sodium channels are inactivated and cannot reopen",
      "difficulty": "hard",
      "explanation": "During this time, it is physically impossible to generate another impulse, no matter how strong the stimulus."
    },
    {
      "question": "Which of the following is NOT a characteristic of a synapse?",
      "options": [
        "Unidirectionality",
        "Summation",
        "Fatigue (depletion of neurotransmitters)",
        "Saltatory conduction"
      ],
      "correctAnswer": "Saltatory conduction",
      "difficulty": "moderate",
      "type": "negative",
      "explanation": "Saltatory conduction is a feature of the *axon*, not the synapse."
    },
    {
      "question": "The gap between the myelin sheaths is known as the:",
      "options": ["Synaptic gap", "Node of Ranvier", "Axon terminal", "Dendritic spine"],
      "correctAnswer": "Node of Ranvier",
      "difficulty": "easy",
      "explanation": "Nodes of Ranvier are the unmyelinated sections of an axon where ion exchange occurs."
    },
    {
      "question": "Organize the steps of synaptic transmission in the correct order:\n1. Neurotransmitter binds to receptors\n2. Ca2+ enters synaptic knob\n3. Action potential reaches knob\n4. Na+ channels open on postsynaptic membrane\n5. Vesicles fuse and release neurotransmitter",
      "options": [
        "3, 2, 5, 1, 4",
        "2, 3, 5, 4, 1",
        "3, 5, 2, 1, 4",
        "1, 2, 3, 4, 5"
      ],
      "correctAnswer": "3, 2, 5, 1, 4",
      "difficulty": "hard",
      "type": "ordering",
      "explanation": "Impulse (3) -> Ca2+ entry (2) -> Vesicle release (5) -> Binding (1) -> Postsynaptic response (4)."
    },
    {
      "question": "Which of the following is a characteristic of the 'Absolute Refractory Period'?",
      "options": [
        "A second action potential can be generated by a very strong stimulus",
        "The membrane is undergoing hyperpolarization",
        "It is impossible for a second action potential to be generated regardless of stimulus strength",
        "The sodium-potassium pump is inactive"
      ],
      "correctAnswer": "It is impossible for a second action potential to be generated regardless of stimulus strength",
      "difficulty": "hard",
      "explanation": "During the absolute refractory period, voltage-gated sodium channels are either already open or in an inactivated state, meaning they cannot respond to further depolarization."
    },
    {
      "question": "The 'Spatial Summation' in a neuron occurs when:",
      "options": [
        "A single presynaptic neuron fires many times in rapid succession",
        "Multiple presynaptic neurons fire simultaneously at different locations on the postsynaptic neuron",
        "The neurotransmitter is recycled into the axon bulb",
        "The myelin sheath is repaired by Schwann cells"
      ],
      "correctAnswer": "Multiple presynaptic neurons fire simultaneously at different locations on the postsynaptic neuron",
      "difficulty": "moderate",
      "explanation": "Spatial summation involves the collective effect of impulses from several different presynaptic neurons arriving at the same postsynaptic neuron at once."
    },
    {
      "question": "What is the primary function of the 'Gray Matter' in the spinal cord?",
      "options": [
        "To provide a pathway for rapid long-distance conduction",
        "To serve as a center for integration and reflex processing",
        "To produce cerebrospinal fluid",
        "To insulate the spinal nerves"
      ],
      "correctAnswer": "To serve as a center for integration and reflex processing",
      "difficulty": "moderate",
      "explanation": "Gray matter contains cell bodies, dendrites, and unmyelinated axons, making it the site for synapse formation and signal integration in the CNS."
    },
    {
      "question": "Which ion is responsible for the 'Repolarization' phase of an action potential?",
      "options": ["Influx of Sodium (Na+)", "Efflux of Potassium (K+)", "Influx of Calcium (Ca2+)", "Efflux of Chloride (Cl-)"],
      "correctAnswer": "Efflux of Potassium (K+)",
      "difficulty": "moderate",
      "explanation": "Repolarization occurs when K+ channels open and K+ ions diffuse out of the cell, restoring the negative internal charge."
    },
    {
      "question": "In a reflex arc, which neuron is usually found entirely within the Central Nervous System?",
      "options": ["Sensory neuron", "Motor neuron", "Relay neuron (Interneuron)", "Effector neuron"],
      "correctAnswer": "Relay neuron (Interneuron)",
      "difficulty": "easy",
      "explanation": "Relay neurons are located within the brain or spinal cord and act as the link between sensory input and motor output."
    },
    {
      "question": "What happens to the postsynaptic membrane during an 'Inhibitory Postsynaptic Potential' (IPSP)?",
      "options": [
        "It becomes depolarized",
        "It becomes hyperpolarized",
        "It reaches the threshold immediately",
        "The membrane potential does not change"
      ],
      "correctAnswer": "It becomes hyperpolarized",
      "difficulty": "hard",
      "explanation": "Inhibitory neurotransmitters cause the opening of K+ or Cl- channels, making the inside of the cell more negative and harder to excite."
    },
    {
      "question": "The speed of a nerve impulse is significantly increased by which of the following?",
      "options": ["Decreasing the temperature", "Increasing the length of the axon", "Increasing the diameter of the axon", "Decreasing the number of Nodes of Ranvier"],
      "correctAnswer": "Increasing the diameter of the axon",
      "difficulty": "moderate",
      "explanation": "A larger diameter reduces the internal resistance to ion flow, allowing the impulse to travel faster along the fiber."
    },
    {
      "question": "Which structure in the presynaptic knob stores neurotransmitters?",
      "options": ["Mitochondria", "Synaptic vesicles", "Endoplasmic reticulum", "Ribosomes"],
      "correctAnswer": "Synaptic vesicles",
      "difficulty": "easy",
      "explanation": "Neurotransmitters are synthesized and then packaged into small membrane-bound sacs called synaptic vesicles."
    },
    {
      "question": "What is the role of 'Choline Acetyltransferase'?",
      "options": [
        "To break down acetylcholine in the cleft",
        "To synthesize acetylcholine from choline and acetyl-CoA in the presynaptic knob",
        "To transport sodium ions",
        "To act as a receptor on the postsynaptic membrane"
      ],
      "correctAnswer": "To synthesize acetylcholine from choline and acetyl-CoA in the presynaptic knob",
      "difficulty": "hard",
      "explanation": "This enzyme is responsible for the recycling/resynthesis of the neurotransmitter after its components are reabsorbed."
    },
    {
      "question": "The 'Dorsal Root' of the spinal cord is characterized by having:",
      "options": [
        "A ganglion containing sensory cell bodies",
        "A direct connection to skeletal muscles",
        "Only motor axons",
        "Myelin produced by the brain"
      ],
      "correctAnswer": "A ganglion containing sensory cell bodies",
      "difficulty": "moderate",
      "explanation": "The dorsal root ganglion houses the cell bodies of sensory neurons entering the spinal cord."
    },
    {
      "question": "What is the result of 'Temporal Summation'?",
      "options": [
        "Many neurons stimulate one neuron simultaneously",
        "One neuron stimulates another repeatedly in a short period to reach the threshold",
        "A reflex arc is bypassed",
        "The resting potential becomes more positive"
      ],
      "correctAnswer": "One neuron stimulates another repeatedly in a short period to reach the threshold",
      "difficulty": "moderate",
      "explanation": "Temporal summation refers to the 'timing' of signals; high-frequency stimulation from a single source adds up to trigger a response."
    },
    {
      "question": "Which of the following is NOT a characteristic of a chemical synapse?",
      "options": [
        "Signals can travel in both directions",
        "There is a synaptic delay",
        "Neurotransmitters are used for transmission",
        "They can be excitatory or inhibitory"
      ],
      "correctAnswer": "Signals can travel in both directions",
      "difficulty": "moderate",
      "type": "negative",
      "explanation": "Chemical synapses are unidirectional because vesicles are only in the presynaptic bulb and receptors are only on the postsynaptic side."
    },
    {
      "question": "The resting membrane is most permeable to ______ and least permeable to ______.",
      "options": ["Na+; K+", "K+; Na+", "Ca2+; K+", "Cl-; K+"],
      "correctAnswer": "K+; Na+",
      "difficulty": "hard",
      "explanation": "Leak channels for Potassium are much more numerous than those for Sodium at rest, which is why the resting potential is close to the equilibrium potential of K+."
    },
    {
      "question": "What is the function of the 'Effector' in a coordination system?",
      "options": [
        "To detect the stimulus",
        "To interpret the message from the brain",
        "To carry out the physical response (e.g., muscle contraction)",
        "To transmit the impulse to the spinal cord"
      ],
      "correctAnswer": "To carry out the physical response (e.g., muscle contraction)",
      "difficulty": "easy",
      "explanation": "Effectors are muscles or glands that perform the action required to respond to a stimulus."
    },
    {
      "question": "Which part of the brain coordinates subconscious skeletal muscle contractions for balance and posture?",
      "options": ["Cerebrum", "Hypothalamus", "Cerebellum", "Medulla oblongata"],
      "correctAnswer": "Cerebellum",
      "difficulty": "moderate",
      "explanation": "The cerebellum is essential for 'motor coordination' and maintaining equilibrium/balance."
    },
    {
      "question": "A 'Neuromuscular Junction' is a specialized synapse between:",
      "options": ["Two neurons", "A neuron and a gland", "A motor neuron and a muscle fiber", "A sensory receptor and a neuron"],
      "correctAnswer": "A motor neuron and a muscle fiber",
      "difficulty": "easy",
      "explanation": "This is the specific site where a motor neuron signals a muscle to contract using acetylcholine."
    },
    {
      "question": "The voltage-gated sodium channels close and become inactivated at approximately what voltage?",
      "options": ["-70 mV", "-55 mV", "+30 to +40 mV", "-90 mV"],
      "correctAnswer": "+30 to +40 mV",
      "difficulty": "hard",
      "explanation": "At the peak of the action potential, Na+ channels snap shut and the K+ channels open to begin repolarization."
    },
    {
      "question": "In the peripheral nervous system, what forms the myelin sheath?",
      "options": ["Oligodendrocytes", "Astrocytes", "Schwann cells", "Microglia"],
      "correctAnswer": "Schwann cells",
      "difficulty": "moderate",
      "explanation": "In the PNS, Schwann cells wrap around axons. (Note: Oligodendrocytes perform this function in the Central Nervous System)."
    },
    {
      "question": "What is the effect of the Parasympathetic Nervous System on the heart rate?",
      "options": ["It increases heart rate", "It decreases heart rate", "It has no effect", "It stops the heart temporarily"],
      "correctAnswer": "It decreases heart rate",
      "difficulty": "easy",
      "explanation": "The parasympathetic system (via the Vagus nerve) slows down the heart rate to conserve energy during 'rest and digest' periods."
    },
    {
      "question": "The 'Threshold' value is usually around ______ mV.",
      "options": ["-70", "-55", "0", "+40"],
      "correctAnswer": "-55",
      "difficulty": "moderate",
      "explanation": "If the depolarization reaches roughly -55mV, enough voltage-gated Na+ channels open to create a self-sustaining action potential."
    }
  ],
  "Unit 9: Hormonal Coordination in Animals": [
    {
      "question": "Which of the following best describes an endocrine gland?",
      "options": ["A gland that secretes products into ducts", "A gland that secretes hormones directly into the bloodstream", "A gland that only produces digestive enzymes", "A gland that is part of the nervous system"],
      "correctAnswer": "A gland that secretes hormones directly into the bloodstream",
      "difficulty": "easy",
      "explanation": "Endocrine glands are ductless glands that release their chemical messengers (hormones) directly into the blood for transport to target organs."
    },
    {
      "question": "Which organ is often referred to as the 'Master Gland' of the endocrine system?",
      "options": ["Thyroid gland", "Adrenal gland", "Pituitary gland", "Pancreas"],
      "correctAnswer": "Pituitary gland",
      "difficulty": "easy",
      "explanation": "The pituitary gland is called the master gland because it produces many trophic hormones that control the activity of other endocrine glands."
    },
    {
      "question": "Hormones act only on specific 'target cells' because these cells possess:",
      "options": ["Specific DNA sequences", "Specific protein receptors", "Larger nuclei", "More mitochondria"],
      "correctAnswer": "Specific protein receptors",
      "difficulty": "moderate",
      "explanation": "Target cells have specific receptors (on the surface or inside) that recognize and bind to a specific hormone molecule, triggering a response."
    },
    {
      "question": "Which of the following is a key difference between the nervous and hormonal systems?",
      "options": [
        "The nervous system uses chemicals, the hormonal system does not",
        "Nervous responses are slow, while hormonal responses are rapid",
        "Nervous signals are electrical/chemical, while hormonal signals are purely chemical",
        "Hormones only affect the brain, while nerves affect the whole body"
      ],
      "correctAnswer": "Nervous signals are electrical/chemical, while hormonal signals are purely chemical",
      "difficulty": "moderate",
      "explanation": "Nervous coordination involves electrical impulses along neurons and chemicals at synapses, whereas hormonal coordination relies entirely on chemicals transported in blood."
    },
    {
      "question": "Which hormone is responsible for the 'Fight or Flight' response?",
      "options": ["Insulin", "Thyroxine", "Adrenaline", "Estrogen"],
      "correctAnswer": "Adrenaline",
      "difficulty": "easy",
      "explanation": "Adrenaline (epinephrine), secreted by the adrenal medulla, prepares the body for emergency action by increasing heart rate and blood glucose levels."
    },
    {
      "question": "The islets of Langerhans are found in which organ?",
      "options": ["Liver", "Pancreas", "Kidney", "Spleen"],
      "correctAnswer": "Pancreas",
      "difficulty": "easy",
      "explanation": "The islets of Langerhans are the endocrine part of the pancreas, containing alpha cells (glucagon) and beta cells (insulin)."
    },
    {
      "question": "Which hormone is secreted by the beta cells of the pancreas to lower blood glucose levels?",
      "options": ["Glucagon", "Somatostatin", "Insulin", "Aldosterone"],
      "correctAnswer": "Insulin",
      "difficulty": "easy",
      "explanation": "Insulin promotes the uptake of glucose by cells and the conversion of glucose to glycogen in the liver, thereby lowering blood sugar."
    },
    {
      "question": "What is the primary function of Glucagon?",
      "options": [
        "To convert glycogen into glucose in the liver",
        "To promote glucose storage in muscles",
        "To decrease the metabolic rate",
        "To stimulate the release of ADH"
      ],
      "correctAnswer": "To convert glycogen into glucose in the liver",
      "difficulty": "moderate",
      "explanation": "Glucagon is released when blood glucose is low, stimulating glycogenolysis (breakdown of glycogen) to raise blood sugar levels."
    },
    {
      "question": "Negative feedback in hormonal coordination serves to:",
      "options": [
        "Increase the production of a hormone indefinitely",
        "Maintain a stable internal environment (homeostasis)",
        "Stop the nervous system from working",
        "Ensure that only one hormone is produced at a time"
      ],
      "correctAnswer": "Maintain a stable internal environment (homeostasis)",
      "difficulty": "moderate",
      "explanation": "Negative feedback occurs when a change in a variable (like blood sugar) triggers a response that counteracts the initial change, bringing the system back to a set point."
    },
    {
      "question": "Which hormone regulates the basal metabolic rate (BMR)?",
      "options": ["Oxytocin", "Thyroxine", "Prolactin", "Progesterone"],
      "correctAnswer": "Thyroxine",
      "difficulty": "moderate",
      "explanation": "Thyroxine, produced by the thyroid gland, controls the rate at which cells use oxygen and nutrients to produce energy."
    },
    {
      "question": "A deficiency of iodine in the diet can lead to which condition?",
      "options": ["Diabetes", "Goitre", "Gigantism", "Anemia"],
      "correctAnswer": "Goitre",
      "difficulty": "moderate",
      "explanation": "Iodine is essential for thyroxine synthesis. Lack of iodine leads to low thyroxine, which causes the pituitary to over-stimulate the thyroid, resulting in its enlargement (goitre)."
    },
    {
      "question": "Diabetes insipidus is caused by a lack of which hormone?",
      "options": ["Insulin", "ADH (Antidiuretic Hormone)", "Oxytocin", "Glucagon"],
      "correctAnswer": "ADH (Antidiuretic Hormone)",
      "difficulty": "hard",
      "explanation": "A lack of ADH prevents water reabsorption in the kidneys, leading to the production of large volumes of dilute urine, a condition called diabetes insipidus."
    },
    {
      "question": "Acromegaly is caused by the oversecretion of Growth Hormone (GH) in:",
      "options": ["Children", "Infants", "Adults", "The fetus"],
      "correctAnswer": "Adults",
      "difficulty": "hard",
      "explanation": "Oversecretion of GH in children causes gigantism, but in adults (where bone length is fixed), it causes acromegaly, characterized by thickening of bones in the face, hands, and feet."
    },
    {
      "question": "Which hormone is produced by the hypothalamus but stored and released by the posterior pituitary?",
      "options": ["Growth Hormone", "TSH", "ADH", "ACTH"],
      "correctAnswer": "ADH",
      "difficulty": "hard",
      "explanation": "The posterior pituitary does not synthesize hormones; it stores and releases ADH and Oxytocin, which are produced in the hypothalamus."
    },
    {
      "question": "Cushing’s syndrome is typically caused by the hypersecretion of:",
      "options": ["Cortisol", "Thyroxine", "Insulin", "Testosterone"],
      "correctAnswer": "Cortisol",
      "difficulty": "hard",
      "explanation": "Excessive cortisol, often from an adrenal tumor or over-stimulation by ACTH, leads to Cushing's syndrome, marked by a 'moon face' and high blood pressure."
    },
    {
      "question": "Compare the duration of effect between the nervous and hormonal systems.",
      "options": [
        "Nervous effects last longer",
        "Hormonal effects are generally longer-lasting",
        "Both are identical in duration",
        "Neither system has long-lasting effects"
      ],
      "correctAnswer": "Hormonal effects are generally longer-lasting",
      "difficulty": "moderate",
      "explanation": "While nervous signals are near-instantaneous, their effects end quickly. Hormones take time to travel but their effects can last for minutes, hours, or even days."
    },
    {
      "question": "Which gland produces the hormone Melatonin, which regulates sleep-wake cycles?",
      "options": ["Thymus", "Pineal gland", "Adrenal gland", "Thyroid"],
      "correctAnswer": "Pineal gland",
      "difficulty": "moderate",
      "explanation": "The pineal gland in the brain secretes melatonin in response to darkness, helping to regulate circadian rhythms."
    },
    {
      "question": "In the control of blood glucose, what is the 'sensor' that detects high sugar levels?",
      "options": ["The Liver", "The Brain", "The Beta cells of the Pancreas", "The Muscles"],
      "correctAnswer": "The Beta cells of the Pancreas",
      "difficulty": "hard",
      "explanation": "Beta cells in the islets of Langerhans act as both the sensor (detecting glucose levels) and the effector (releasing insulin)."
    },
    {
      "question": "Which hormone stimulates the 'let-down' reflex for milk ejection during breastfeeding?",
      "options": ["Prolactin", "Oxytocin", "Estrogen", "Progesterone"],
      "correctAnswer": "Oxytocin",
      "difficulty": "moderate",
      "explanation": "Prolactin stimulates milk *production*, while Oxytocin stimulates the contraction of cells around the mammary glands for milk *release*."
    },
    {
      "question": "Which of the following is a symptom of hyperthyroidism (Graves' disease)?",
      "options": ["Weight gain", "Sluggishness", "Increased heart rate and protruding eyes", "Always feeling cold"],
      "correctAnswer": "Increased heart rate and protruding eyes",
      "difficulty": "moderate",
      "explanation": "Hyperthyroidism speeds up metabolism, leading to weight loss, rapid heart rate, heat intolerance, and sometimes exophthalmos (protruding eyes)."
    },
    {
      "question": "Steroid hormones, such as Testosterone, differ from protein hormones because they:",
      "options": [
        "Are water-soluble",
        "Bind to receptors on the cell surface",
        "Can cross the cell membrane and bind to intracellular receptors",
        "Are produced by the pituitary"
      ],
      "correctAnswer": "Can cross the cell membrane and bind to intracellular receptors",
      "difficulty": "hard",
      "explanation": "Steroid hormones are lipid-soluble, allowing them to diffuse through the phospholipid bilayer of the target cell membrane."
    },
    {
      "question": "The 'Trophic' hormones released by the anterior pituitary are those that:",
      "options": [
        "Directly cause a metabolic change",
        "Stimulate other endocrine glands to secrete hormones",
        "Are only found in males",
        "Are used for digestion"
      ],
      "correctAnswer": "Stimulate other endocrine glands to secrete hormones",
      "difficulty": "moderate",
      "explanation": "Examples of trophic hormones include TSH (stimulates thyroid) and ACTH (stimulates adrenal cortex)."
    },
    {
      "question": "Which hormone is essential for the development of secondary sexual characteristics in females?",
      "options": ["Testosterone", "Estrogen", "LH", "FSH"],
      "correctAnswer": "Estrogen",
      "difficulty": "easy",
      "explanation": "Estrogen, produced by the ovaries, is responsible for the development of breasts, widening of hips, and the menstrual cycle."
    },
    {
      "question": "What happens when the blood calcium level drops below the set point?",
      "options": [
        "Calcitonin is released to store more calcium in bones",
        "Parathyroid Hormone (PTH) is released to pull calcium from bones",
        "Insulin is released",
        "The thyroid gland stops working"
      ],
      "correctAnswer": "Parathyroid Hormone (PTH) is released to pull calcium from bones",
      "difficulty": "hard",
      "explanation": "PTH increases blood calcium by stimulating osteoclasts to break down bone matrix, increasing calcium absorption in the gut and reabsorption in kidneys."
    },
    {
      "question": "The hormone Gastrin is produced by the ______ to stimulate the release of ______.",
      "options": ["Stomach; Gastric juice", "Pancreas; Insulin", "Liver; Bile", "Pituitary; GH"],
      "correctAnswer": "Stomach; Gastric juice",
      "difficulty": "moderate",
      "explanation": "Gastrin is a local hormone produced by the stomach lining that triggers the secretion of hydrochloric acid for digestion."
    },
    {
      "question": "Assertion (A): The pancreas is both an exocrine and an endocrine gland.\nReason (R): It secretes digestive enzymes through ducts and hormones directly into the blood.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "The pancreas is a 'heterocrine' gland; the acini are exocrine, and the islets are endocrine."
    },
    {
      "question": "Hypoglycemia is a condition characterized by:",
      "options": ["High blood sugar", "Low blood sugar", "High blood pressure", "Low body temperature"],
      "correctAnswer": "Low blood sugar",
      "difficulty": "easy",
      "explanation": "Hypo- means low, and -glycemia refers to blood glucose. It can be caused by too much insulin or lack of food."
    },
    {
      "question": "Which gland shrinks as a person ages and is involved in the development of the immune system?",
      "options": ["Thyroid", "Thymus", "Adrenal", "Pituitary"],
      "correctAnswer": "Thymus",
      "difficulty": "moderate",
      "explanation": "The thymus gland is large in children and produces thymosin, which helps in the maturation of T-lymphocytes. It progressively atrophies after puberty."
    },
    {
      "question": "True or False: The nervous system uses 'all-or-nothing' electrical signals, whereas the hormonal system uses 'graded' chemical concentrations.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "hard",
      "type": "trueFalse",
      "explanation": "Action potentials are fixed in size, but hormonal effects are usually proportional to the concentration of the hormone in the blood."
    },
    {
      "question": "Addison's disease is caused by the hyposecretion (deficiency) of hormones from the:",
      "options": ["Adrenal cortex", "Thyroid", "Pancreas", "Pituitary"],
      "correctAnswer": "Adrenal cortex",
      "difficulty": "hard",
      "explanation": "Addison's disease results from insufficient cortisol and aldosterone, leading to fatigue, low blood pressure, and skin darkening."
    },
    {
      "question": "Which hormone promotes the reabsorption of sodium ions in the kidney tubules?",
      "options": ["ADH", "Aldosterone", "Glucagon", "Thyroxine"],
      "correctAnswer": "Aldosterone",
      "difficulty": "moderate",
      "explanation": "Aldosterone, a mineralocorticoid from the adrenal cortex, helps regulate salt and water balance."
    },
    {
      "question": "The second messenger mechanism (e.g., using cAMP) is typical for which type of hormone?",
      "options": ["Steroid hormones", "Water-soluble protein hormones", "Lipid-soluble hormones", "All hormones"],
      "correctAnswer": "Water-soluble protein hormones",
      "difficulty": "hard",
      "explanation": "Since protein hormones cannot enter the cell, they bind to surface receptors and use a 'second messenger' inside the cell to carry out the response."
    },
    {
      "question": "What is the effect of Prolactin?",
      "options": ["Regulates blood sugar", "Stimulates milk production in mammary glands", "Causes uterine contractions", "Increases metabolic rate"],
      "correctAnswer": "Stimulates milk production in mammary glands",
      "difficulty": "easy",
      "explanation": "Prolactin is released from the anterior pituitary and prepares the breasts for lactation."
    },
    {
      "question": "In the comparison of speed, the nervous system is ______ while the hormonal system is ______.",
      "options": ["Fast; Slow", "Slow; Fast", "Both fast", "Both slow"],
      "correctAnswer": "Fast; Slow",
      "difficulty": "easy",
      "explanation": "Nerve impulses travel at meters per second, while hormones must be secreted and circulate in the blood, which is much slower."
    },
    {
      "question": "Type 1 Diabetes Mellitus is typically caused by:",
      "options": [
        "An autoimmune destruction of beta cells",
        "Eating too much sugar in one sitting",
        "Cells becoming resistant to insulin",
        "A lack of iodine"
      ],
      "correctAnswer": "An autoimmune destruction of beta cells",
      "difficulty": "moderate",
      "explanation": "Type 1 is an insulin-dependent condition where the body does not produce insulin. Type 2 usually involves insulin resistance."
    },
    {
      "question": "Which of the following is NOT an endocrine gland?",
      "options": ["Ovary", "Testis", "Salivary gland", "Thyroid"],
      "correctAnswer": "Salivary gland",
      "difficulty": "easy",
      "type": "negative",
      "explanation": "Salivary glands are exocrine because they secrete saliva through a duct into the mouth."
    },
    {
      "question": "Cretinism is a condition resulting from severe ______ in infants.",
      "options": ["Hyperthyroidism", "Hypothyroidism", "Hypoglycemia", "Hyperpituitarism"],
      "correctAnswer": "Hypothyroidism",
      "difficulty": "hard",
      "explanation": "Congenital hypothyroidism (lack of thyroxine from birth) leads to cretinism, characterized by stunted physical and mental growth."
    },
    {
      "question": "Which of these hormones is a catecholamine?",
      "options": ["Insulin", "Adrenaline", "Estrogen", "Cortisol"],
      "correctAnswer": "Adrenaline",
      "difficulty": "hard",
      "explanation": "Adrenaline and noradrenaline are catecholamines, which are derived from the amino acid tyrosine and produced by the adrenal medulla."
    },
    {
      "question": "What is the 'Negative Feedback' response to a rise in body temperature?",
      "options": [
        "Shivering to generate more heat",
        "Sweating and vasodilation to lose heat",
        "Releasing more thyroxine to increase metabolism",
        "Eating more food"
      ],
      "correctAnswer": "Sweating and vasodilation to lose heat",
      "difficulty": "easy",
      "explanation": "The body acts to reverse the rise in temperature to return it to the normal range."
    },
    {
      "question": "LH (Luteinizing Hormone) in males stimulates the production of:",
      "options": ["Sperm", "Testosterone", "Urine", "Thyroxine"],
      "correctAnswer": "Testosterone",
      "difficulty": "moderate",
      "explanation": "In males, LH acts on the Leydig cells (interstitial cells) of the testes to produce testosterone."
    },
    {
      "question": "Which hormone is the primary antagonist to Parathyroid Hormone (PTH)?",
      "options": ["Thyroxine", "Calcitonin", "Insulin", "Aldosterone"],
      "correctAnswer": "Calcitonin",
      "difficulty": "moderate",
      "explanation": "PTH raises blood calcium, while Calcitonin (from the thyroid) lowers it by promoting calcium deposition in bones."
    },
    {
      "question": "The hormonal system communicates via ______ messages, whereas the nervous system uses ______ messages.",
      "options": ["Digital; Analog", "Chemical; Electrical", "Fast; Permanent", "Localized; Systemic"],
      "correctAnswer": "Chemical; Electrical",
      "difficulty": "easy",
      "explanation": "This highlights the fundamental difference in the signal carrier between the two systems."
    },
    {
      "question": "During pregnancy, which hormone maintains the lining of the uterus?",
      "options": ["FSH", "Progesterone", "Adrenaline", "Glucagon"],
      "correctAnswer": "Progesterone",
      "difficulty": "easy",
      "explanation": "Progesterone is often called the 'hormone of pregnancy' because it keeps the endometrium thick and prevents uterine contractions."
    },
    {
      "question": "Identify the error: 'The anterior pituitary is directly controlled by nerve impulses from the hypothalamus.'",
      "options": [
        "The error is 'anterior pituitary'",
        "The error is 'directly controlled'",
        "The error is 'nerve impulses'",
        "No error"
      ],
      "correctAnswer": "The error is 'nerve impulses'",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "The anterior pituitary is controlled by *releasing hormones* (chemicals) from the hypothalamus via a portal blood system, not by direct nerve impulses."
    }
  ],
  "Unit 10: Growth and Development in Plants and Animals": [
    {
      "question": "What is the primary biological advantage of seed dormancy?",
      "options": [
        "To allow the seed to grow as quickly as possible",
        "To ensure germination occurs only under favorable environmental conditions",
        "To prevent the plant from ever flowering",
        "To reduce the nutritional value of the seed"
      ],
      "correctAnswer": "To ensure germination occurs only under favorable environmental conditions",
      "difficulty": "easy",
      "explanation": "Dormancy prevents seeds from germinating during unsuitable seasons (like mid-winter), ensuring the seedling has the best chance of survival."
    },
    {
      "question": "Which plant hormone is primarily responsible for maintaining seed and bud dormancy?",
      "options": ["Auxin", "Gibberellin", "Abscisic Acid (ABA)", "Ethylene"],
      "correctAnswer": "Abscisic Acid (ABA)",
      "difficulty": "moderate",
      "explanation": "Abscisic acid inhibits growth and maintains dormancy. Germination often requires the breakdown of ABA or an increase in Gibberellins to counteract it."
    },
    {
      "question": "In 'Epigeal' germination, which part of the seedling elongates to push the cotyledons above the soil surface?",
      "options": ["Hypocotyl", "Epicotyl", "Radicle", "Plumule"],
      "correctAnswer": "Hypocotyl",
      "difficulty": "moderate",
      "explanation": "In epigeal germination (e.g., beans), the hypocotyl grows rapidly and curves into a hook, pulling the cotyledons out of the ground."
    },
    {
      "question": "Which of the following is characteristic of 'Hypogeal' germination?",
      "options": [
        "The cotyledons stay below the ground",
        "The cotyledons turn green and photosynthesize",
        "The hypocotyl elongates significantly",
        "It only occurs in dicotyledonous plants"
      ],
      "correctAnswer": "The cotyledons stay below the ground",
      "difficulty": "moderate",
      "explanation": "In hypogeal germination (e.g., maize or peas), the epicotyl elongates, leaving the cotyledons buried in the soil."
    },
    {
      "question": "Primary growth in plants is responsible for ______ and occurs at the ______.",
      "options": [
        "Increase in thickness; Vascular cambium",
        "Increase in length; Apical meristems",
        "Production of bark; Cork cambium",
        "Development of fruit; Ovary"
      ],
      "correctAnswer": "Increase in length; Apical meristems",
      "difficulty": "easy",
      "explanation": "Primary growth occurs at the tips of roots and shoots (apical meristems), allowing the plant to grow taller and deeper."
    },
    {
      "question": "Secondary growth is mainly found in which group of plants?",
      "options": ["Monocots", "Dicots and Gymnosperms", "Mosses", "Ferns"],
      "correctAnswer": "Dicots and Gymnosperms",
      "difficulty": "moderate",
      "explanation": "Secondary growth (widening) requires lateral meristems (vascular cambium), which are generally absent in monocots."
    },
    {
      "question": "Which tissue is responsible for the production of secondary xylem and secondary phloem?",
      "options": ["Apical meristem", "Vascular cambium", "Cork cambium", "Endodermis"],
      "correctAnswer": "Vascular cambium",
      "difficulty": "moderate",
      "explanation": "The vascular cambium is a lateral meristem that produces wood (secondary xylem) to the inside and inner bark (secondary phloem) to the outside."
    },
    {
      "question": "What does a sigmoid growth curve represent in biological organisms?",
      "options": [
        "Constant linear growth over time",
        "A decrease in size followed by an increase",
        "An S-shaped pattern consisting of lag, log, and stationary phases",
        "Random growth bursts"
      ],
      "correctAnswer": "An S-shaped pattern consisting of lag, log, and stationary phases",
      "difficulty": "moderate",
      "explanation": "Most organisms show a slow start (lag), rapid exponential growth (log/leveled), and a final leveling off (stationary) as they reach maturity."
    },
    {
      "question": "Auxins promote stem elongation by:",
      "options": [
        "Hardening the cell walls",
        "Increasing the plasticity of cell walls (Acid Growth Hypothesis)",
        "Stopping water uptake",
        "Destroying the nucleus"
      ],
      "correctAnswer": "Increasing the plasticity of cell walls (Acid Growth Hypothesis)",
      "difficulty": "hard",
      "explanation": "Auxins stimulate proton pumps that lower the pH in the cell wall, activating enzymes (expansins) that loosen wall fibers, allowing the cell to expand via turgor pressure."
    },
    {
      "question": "Which phytohormone is a gas and is primarily responsible for fruit ripening?",
      "options": ["Cytokinin", "Gibberellin", "Ethylene", "Auxin"],
      "correctAnswer": "Ethylene",
      "difficulty": "easy",
      "explanation": "Ethylene is a gaseous hormone that triggers ripening in fruits and the abscission (shedding) of leaves."
    },
    {
      "question": "Phototropism in shoots is a growth response where the shoot bends ______ light due to the accumulation of auxin on the ______ side.",
      "options": [
        "Away from; Lit",
        "Toward; Shaded",
        "Away from; Shaded",
        "Toward; Lit"
      ],
      "correctAnswer": "Toward; Shaded",
      "difficulty": "hard",
      "explanation": "Auxin moves to the shaded side of the shoot, causing cells there to elongate more than cells on the lit side, which results in the shoot bending toward the light."
    },
    {
      "question": "What is 'Photoperiodism'?",
      "options": [
        "The direction in which a plant grows",
        "The physiological response of plants to the relative lengths of light and dark periods",
        "The speed of photosynthesis",
        "The movement of water through the xylem"
      ],
      "correctAnswer": "The physiological response of plants to the relative lengths of light and dark periods",
      "difficulty": "moderate",
      "explanation": "Photoperiodism determines when plants flower based on the duration of the night (dark period)."
    },
    {
      "question": "A 'Short-day' plant will flower only if:",
      "options": [
        "The day is longer than a critical length",
        "The night is longer than a critical dark period",
        "There is no darkness at all",
        "The temperature is below freezing"
      ],
      "correctAnswer": "The night is longer than a critical dark period",
      "difficulty": "hard",
      "explanation": "Short-day plants are actually 'long-night' plants; they require a continuous period of darkness exceeding a specific threshold to trigger flowering."
    },
    {
      "question": "Which pigment is responsible for detecting the photoperiod in plants?",
      "options": ["Chlorophyll", "Carotenoid", "Phytochrome", "Anthocyanin"],
      "correctAnswer": "Phytochrome",
      "difficulty": "moderate",
      "explanation": "Phytochrome exists in two interconvertible forms (Pr and Pfr). The ratio of these forms tells the plant whether it is day or night."
    },
    {
      "question": "Complete metamorphosis (Holometabolous) in insects follows which sequence?",
      "options": [
        "Egg → Nymph → Adult",
        "Egg → Larva → Pupa → Adult",
        "Larva → Egg → Adult",
        "Nymph → Pupa → Egg"
      ],
      "correctAnswer": "Egg → Larva → Pupa → Adult",
      "difficulty": "easy",
      "explanation": "Complete metamorphosis involves a pupal stage where the body is completely reorganized (e.g., butterflies, beetles)."
    },
    {
      "question": "Incomplete metamorphosis (Hemimetabolous) is distinguished by the absence of which stage?",
      "options": ["Egg", "Nymph", "Pupa", "Adult"],
      "correctAnswer": "Pupa",
      "difficulty": "easy",
      "explanation": "Insects like grasshoppers undergo incomplete metamorphosis, where the young (nymphs) look like miniature versions of the adults and there is no pupal stage."
    },
    {
      "question": "The shedding of the exoskeleton in insects to allow for growth is called:",
      "options": ["Metamorphosis", "Ecdysis (Moulting)", "Germination", "Senescence"],
      "correctAnswer": "Ecdysis (Moulting)",
      "difficulty": "easy",
      "explanation": "Because the chitinous exoskeleton is rigid, insects must periodically shed it and grow a new, larger one."
    },
    {
      "question": "Which hormone in insects triggers moulting and metamorphosis?",
      "options": ["Insulin", "Ecdysone", "Thyroxine", "Adrenaline"],
      "correctAnswer": "Ecdysone",
      "difficulty": "moderate",
      "explanation": "Ecdysone is released from the prothoracic glands and stimulates the epidermal cells to begin the process of moulting."
    },
    {
      "question": "Which hormone maintains the 'larval' characteristics and prevents an insect from pupating too early?",
      "options": ["Juvenile Hormone", "Ecdysone", "Brain Hormone", "Gibberellin"],
      "correctAnswer": "Juvenile Hormone",
      "difficulty": "hard",
      "explanation": "As long as Juvenile Hormone levels are high, ecdysone promotes larval-to-larval moults. When JH levels drop, the insect undergoes metamorphosis into a pupa or adult."
    },
    {
      "question": "In amphibians (like frogs), which hormone is essential for the transformation of a tadpole into an adult?",
      "options": ["Estrogen", "Thyroxine", "Growth Hormone", "Prolactin"],
      "correctAnswer": "Thyroxine",
      "difficulty": "moderate",
      "explanation": "Thyroxine from the thyroid gland triggers the physiological changes in tadpoles, such as lung development and tail resorption."
    },
    {
      "question": "What is 'Apical Dominance'?",
      "options": [
        "The roots growing faster than the stem",
        "The inhibition of lateral bud growth by the terminal (apical) bud",
        "The plant growing toward the sun",
        "The death of the plant from the top down"
      ],
      "correctAnswer": "The inhibition of lateral bud growth by the terminal (apical) bud",
      "difficulty": "moderate",
      "explanation": "Auxins produced in the apical meristem travel down the stem and prevent axillary buds from growing, focusing energy on vertical growth."
    },
    {
      "question": "Which hormone can be applied to 'bolting' plants to induce rapid stem elongation and flowering?",
      "options": ["Abscisic Acid", "Gibberellins", "Cytokinins", "Ethylene"],
      "correctAnswer": "Gibberellins",
      "difficulty": "moderate",
      "explanation": "Gibberellins are known for stimulating cell elongation in stems, particularly in dwarf plants or plants that 'bolt' (grow a tall flower stalk)."
    },
    {
      "question": "The movement of a plant part in response to touch (like a climbing vine) is known as:",
      "options": ["Phototropism", "Geotropism", "Thigmotropism", "Hydrotropism"],
      "correctAnswer": "Thigmotropism",
      "difficulty": "easy",
      "explanation": "Thigmo- refers to touch. Thigmotropism allows climbing plants to wrap around supports."
    },
    {
      "question": "Roots show ______ geotropism (gravitropism) and ______ phototropism.",
      "options": [
        "Positive; Positive",
        "Negative; Positive",
        "Positive; Negative",
        "Negative; Negative"
      ],
      "correctAnswer": "Positive; Negative",
      "difficulty": "moderate",
      "explanation": "Roots grow toward gravity (Positive Geotropism) and away from light (Negative Phototropism)."
    },
    {
      "question": "What is 'Vernalization'?",
      "options": [
        "The process of seeds rotting in the ground",
        "The induction of flowering by a period of cold temperature",
        "The movement of pollen by wind",
        "The growth of leaves in spring"
      ],
      "correctAnswer": "The induction of flowering by a period of cold temperature",
      "difficulty": "moderate",
      "explanation": "Many plants in temperate climates require a 'chilling' period during winter to be able to flower in the following spring."
    },
    {
      "question": "Cytokinins are primarily involved in:",
      "options": [
        "Cell division (cytokinesis) and delaying senescence",
        "Stem elongation only",
        "Promoting leaf fall",
        "Drought tolerance"
      ],
      "correctAnswer": "Cell division (cytokinesis) and delaying senescence",
      "difficulty": "moderate",
      "explanation": "Cytokinins work with auxins to stimulate cell division and are used to keep cut flowers and vegetables fresh longer."
    },
    {
      "question": "A 'Long-day' plant will flower when:",
      "options": [
        "The darkness is shorter than a critical maximum",
        "The day is exactly 12 hours",
        "The night is longer than 14 hours",
        "The plant is kept in a refrigerator"
      ],
      "correctAnswer": "The darkness is shorter than a critical maximum",
      "difficulty": "hard",
      "explanation": "Long-day plants flower during the late spring or summer when the nights are short."
    },
    {
      "question": "Which part of the germinating seed develops into the root system?",
      "options": ["Plumule", "Radicle", "Testa", "Micropyle"],
      "correctAnswer": "Radicle",
      "difficulty": "easy",
      "explanation": "The radicle is the embryonic root and is usually the first part of the seed to emerge."
    },
    {
      "question": "What is 'Scarification' in botany?",
      "options": [
        "The death of a plant",
        "Mechanically or chemically weakening the seed coat to break dormancy",
        "The process of fruit turning red",
        "Removing the roots of a plant"
      ],
      "correctAnswer": "Mechanically or chemically weakening the seed coat to break dormancy",
      "difficulty": "moderate",
      "explanation": "Some seeds have coats so hard that water cannot enter. Scarification (nicking or acid treatment) allows water to enter so germination can begin."
    },
    {
      "question": "Nastic movements (like the closing of a Venus Flytrap) differ from Tropisms because:",
      "options": [
        "Nastic movements are directional",
        "Nastic movements are non-directional and usually reversible",
        "Tropisms are much faster",
        "Nastic movements only happen in animals"
      ],
      "correctAnswer": "Nastic movements are non-directional and usually reversible",
      "difficulty": "hard",
      "explanation": "While tropisms are growth responses toward or away from a stimulus, nastic movements (like the Mimosa pudica folding) are rapid turgor-driven responses independent of the stimulus direction."
    },
    {
      "question": "Secondary xylem in a tree trunk is more commonly known as:",
      "options": ["Bark", "Pith", "Wood", "Cortex"],
      "correctAnswer": "Wood",
      "difficulty": "easy",
      "explanation": "The accumulation of secondary xylem over the years forms the wood of the tree."
    },
    {
      "question": "In the 'Lag phase' of a growth curve:",
      "options": [
        "Growth is at its maximum speed",
        "The organism is preparing for growth but change in size is small",
        "The organism is dying",
        "The population has reached its carrying capacity"
      ],
      "correctAnswer": "The organism is preparing for growth but change in size is small",
      "difficulty": "moderate",
      "explanation": "During the lag phase, cells may be increasing in size or synthesizing enzymes, but the total number of cells or overall mass increases slowly."
    },
    {
      "question": "Growth in most animals is 'Determinate', meaning:",
      "options": [
        "They never stop growing until they die",
        "Growth stops once a certain size or adult stage is reached",
        "They can regrow any lost limb",
        "Growth only happens in the summer"
      ],
      "correctAnswer": "Growth stops once a certain size or adult stage is reached",
      "difficulty": "moderate",
      "explanation": "Unlike plants (indeterminate growth), most animals have a genetic 'set point' where growth ceases after reaching maturity."
    },
    {
      "question": "What is the function of the 'Coleoptile' in monocot germination?",
      "options": [
        "To provide food",
        "To protect the emerging plumule (shoot tip) as it pushes through the soil",
        "To absorb water",
        "To anchor the plant"
      ],
      "correctAnswer": "To protect the emerging plumule (shoot tip) as it pushes through the soil",
      "difficulty": "moderate",
      "explanation": "In grasses and cereals, the coleoptile acts as a protective sheath for the delicate first leaf."
    },
    {
      "question": "Which of the following environmental factors is NOT essential for the germination of all seeds?",
      "options": ["Water", "Oxygen", "Suitable temperature", "Light"],
      "correctAnswer": "Light",
      "difficulty": "moderate",
      "explanation": "While some seeds require light (photoblastic), most seeds can germinate in the dark as long as they have water, oxygen, and warmth."
    },
    {
      "question": "Annual rings in a tree are formed due to the different growth rates of:",
      "options": ["Phloem", "Spring wood and Summer wood", "Apical meristems", "Bark"],
      "correctAnswer": "Spring wood and Summer wood",
      "difficulty": "moderate",
      "explanation": "Spring wood has large, thin-walled xylem vessels (rapid growth), while summer wood has smaller, thick-walled vessels. The contrast creates the visible ring."
    },
    {
      "question": "The 'triple response' in seedlings (slowing of stem elongation, thickening of stem, and horizontal growth) is caused by which hormone?",
      "options": ["Auxin", "Ethylene", "Gibberellin", "Cytokinin"],
      "correctAnswer": "Ethylene",
      "difficulty": "hard",
      "explanation": "Seedlings produce ethylene when they encounter an obstacle (like a stone) in the soil, allowing them to maneuver around it."
    },
    {
      "question": "In an experiment, if the tip of a coleoptile is removed and placed on an agar block, and then the block is placed on the side of a decapitated stem, the stem will:",
      "options": [
        "Stop growing",
        "Bend away from the side with the block",
        "Bend toward the side with the block",
        "Grow straight up"
      ],
      "correctAnswer": "Bend away from the side with the block",
      "difficulty": "hard",
      "explanation": "The agar block contains the auxin from the tip. Placing it on one side causes that side to elongate faster, resulting in a bend away from that side."
    },
    {
      "question": "The conversion of Pr to Pfr occurs during:",
      "options": ["Darkness", "Exposure to red light (daylight)", "Exposure to far-red light", "Freezing temperatures"],
      "correctAnswer": "Exposure to red light (daylight)",
      "difficulty": "hard",
      "explanation": "Sunlight contains more red light than far-red light, so during the day, Phytochrome red (Pr) is converted into the active form, Phytochrome far-red (Pfr)."
    },
    {
      "question": "Which part of a woody stem is 'living'?",
      "options": ["Heartwood", "Sapwood and Cambium", "Outer bark", "Pith"],
      "correctAnswer": "Sapwood and Cambium",
      "difficulty": "moderate",
      "explanation": "Heartwood is composed of old, dead xylem filled with resins. Sapwood (active xylem) and the cambium layers are the living, functional parts of the wood."
    }
  ],
  "Unit 11: Asexual Reproduction in Plants": [
    {
      "question": "Which of the following is the defining characteristic of asexual reproduction?",
      "options": ["Involves the fusion of gametes", "Produces offspring that are genetically identical to the parent", "Requires two parents", "Increases genetic variation in a population"],
      "correctAnswer": "Produces offspring that are genetically identical to the parent",
      "difficulty": "easy",
      "explanation": "Asexual reproduction involves a single parent and results in offspring that are clones, having the exact same genetic makeup as the parent."
    },
    {
      "question": "What is the primary method of asexual reproduction in unicellular organisms like bacteria?",
      "options": ["Fragmentation", "Budding", "Binary fission", "Spore formation"],
      "correctAnswer": "Binary fission",
      "difficulty": "easy",
      "explanation": "Binary fission is a process where a single cell divides into two identical daughter cells after replicating its DNA."
    },
    {
      "question": "In which type of asexual reproduction does a new organism develop from an outgrowth or 'bud' due to cell division at one particular site?",
      "options": ["Fragmentation", "Budding", "Binary fission", "Vegetative propagation"],
      "correctAnswer": "Budding",
      "difficulty": "easy",
      "explanation": "Budding is common in organisms like yeast and hydra, where the bud stays attached until it matures and then detaches."
    },
    {
      "question": "Which of the following is an advantage of asexual reproduction?",
      "options": [
        "It promotes genetic diversity",
        "It allows for rapid population growth in stable environments",
        "It helps species adapt to changing environments",
        "It requires a lot of energy to find a mate"
      ],
      "correctAnswer": "It allows for rapid population growth in stable environments",
      "difficulty": "moderate",
      "explanation": "Because it doesn't require a mate or the energy-intensive process of gamete formation, asexual reproduction allows a single individual to quickly colonize an area."
    },
    {
      "question": "What is a major disadvantage of asexual reproduction?",
      "options": [
        "It is too slow",
        "It produces too many offspring",
        "Lack of genetic variation makes the population susceptible to disease or environmental change",
        "It requires high amounts of energy"
      ],
      "correctAnswer": "Lack of genetic variation makes the population susceptible to disease or environmental change",
      "difficulty": "moderate",
      "explanation": "Since all offspring are genetically identical (clones), a single disease or environmental shift that kills one individual could potentially wipe out the entire population."
    },
    {
      "question": "A 'Rhizome' is an example of natural vegetative propagation. Which plant is famous for reproducing via rhizomes?",
      "options": ["Potato", "Ginger", "Onion", "Strawberry"],
      "correctAnswer": "Ginger",
      "difficulty": "moderate",
      "explanation": "Rhizomes are horizontal underground stems that grow indefinitely and send up shoots at intervals. Ginger and turmeric are classic examples."
    },
    {
      "question": "Which plant structure is a 'Stem Tuber' used for vegetative propagation?",
      "options": ["Carrot", "Sweet Potato", "Irish Potato", "Cassava"],
      "correctAnswer": "Irish Potato",
      "difficulty": "moderate",
      "explanation": "An Irish potato is a swollen underground stem (tuber) that contains 'eyes' which are actually axillary buds capable of growing into new plants."
    },
    {
      "question": "What is the specific name for the horizontal above-ground stems used by strawberries for reproduction?",
      "options": ["Runners (Stolons)", "Rhizomes", "Corms", "Bulbs"],
      "correctAnswer": "Runners (Stolons)",
      "difficulty": "easy",
      "explanation": "Runners are stems that creep along the soil surface; where their nodes touch the ground, they sprout roots and new plantlets."
    },
    {
      "question": "An 'Onion' represents which type of vegetative organ?",
      "options": ["Corm", "Bulb", "Tuber", "Rhizome"],
      "correctAnswer": "Bulb",
      "difficulty": "easy",
      "explanation": "A bulb is a short underground stem surrounded by fleshy, overlapping leaf bases that store food (e.g., onions, garlic, lilies)."
    },
    {
      "question": "Which of these is an example of a 'Corm'?",
      "options": ["Ginger", "Potato", "Cocoyam (Yam)", "Strawberry"],
      "correctAnswer": "Cocoyam (Yam)",
      "difficulty": "moderate",
      "explanation": "Corms are short, vertical, swollen underground stems. Unlike bulbs, they are solid tissue rather than layers of leaves."
    },
    {
      "question": "Artificial propagation where a part of a plant is cut off and placed in soil or water to grow roots is called:",
      "options": ["Grafting", "Layering", "Cutting", "Tissue Culture"],
      "correctAnswer": "Cutting",
      "difficulty": "easy",
      "explanation": "Cuttings are pieces of stems, leaves, or roots used to grow new plants. It is widely used for sugarcane, hibiscus, and cassava."
    },
    {
      "question": "In 'Grafting', the part of the plant that provides the root system is called the ______.",
      "options": ["Scion", "Stock", "Bud", "Clone"],
      "correctAnswer": "Stock",
      "difficulty": "moderate",
      "explanation": "The stock (or rootstock) is the lower part of the graft. The scion is the upper part that provides the desired fruit or flower characteristics."
    },
    {
      "question": "What is the primary goal of 'Grafting' in agriculture?",
      "options": [
        "To create a brand new species of plant",
        "To combine the desirable qualities of two different plants (e.g., disease resistance and high fruit yield)",
        "To increase genetic diversity through meiosis",
        "To make the plant grow taller"
      ],
      "correctAnswer": "To combine the desirable qualities of two different plants (e.g., disease resistance and high fruit yield)",
      "difficulty": "moderate",
      "explanation": "Grafting allows farmers to use a hardy, disease-resistant root system (stock) with a high-quality fruit-producing stem (scion)."
    },
    {
      "question": "Which method involves bending a branch to the ground and covering it with soil while it is still attached to the parent plant?",
      "options": ["Cuttings", "Grafting", "Layering", "Binary Fission"],
      "correctAnswer": "Layering",
      "difficulty": "moderate",
      "explanation": "Layering encourages the stem to develop roots while still receiving nutrients from the parent plant. Once roots are established, it can be detached."
    },
    {
      "question": "The technique of growing large numbers of plants from small pieces of plant tissue in a sterile laboratory environment is called:",
      "options": ["Micropropagation (Tissue Culture)", "Macropropagation", "Maricotting", "Fragmentation"],
      "correctAnswer": "Micropropagation (Tissue Culture)",
      "difficulty": "hard",
      "explanation": "Tissue culture uses an agar medium with nutrients and hormones to grow entire plants from 'explants' (small tissue samples)."
    },
    {
      "question": "Which of the following is a requirement for successful Tissue Culture?",
      "options": ["Abundant sunlight only", "Sterile (Aseptic) conditions", "Soil from the original habitat", "Presence of insects for pollination"],
      "correctAnswer": "Sterile (Aseptic) conditions",
      "difficulty": "moderate",
      "explanation": "Because the nutrient medium is ideal for bacteria and fungi, the laboratory environment must be perfectly sterile to prevent contamination."
    },
    {
      "question": "What is an 'Explant' in the context of tissue culture?",
      "options": [
        "A plant that has been exported",
        "The small piece of plant tissue used to start the culture",
        "The waste product of the plant",
        "The fully grown plant ready for field planting"
      ],
      "correctAnswer": "The small piece of plant tissue used to start the culture",
      "difficulty": "moderate",
      "explanation": "Explants are usually taken from meristematic regions like shoot tips, as these cells divide rapidly and are often virus-free."
    },
    {
      "question": "In asexual reproduction, the offspring are referred to as:",
      "options": ["Gametes", "Zygotes", "Clones", "Hybrids"],
      "correctAnswer": "Clones",
      "difficulty": "easy",
      "explanation": "A clone is an organism that is genetically identical to its parent."
    },
    {
      "question": "Which hormone is usually added to a tissue culture medium to stimulate the growth of roots?",
      "options": ["Ethylene", "Abscisic Acid", "Auxin", "Gibberellin"],
      "correctAnswer": "Auxin",
      "difficulty": "hard",
      "explanation": "High concentrations of auxin relative to cytokinin promote the development of roots in the cultured callus tissue."
    },
    {
      "question": "Which hormone is used in tissue culture to promote the development of shoots?",
      "options": ["Cytokinin", "Auxin", "Ethylene", "Insulin"],
      "correctAnswer": "Cytokinin",
      "difficulty": "hard",
      "explanation": "A high cytokinin-to-auxin ratio encourages the formation of buds and shoots from the undifferentiated callus."
    },
    {
      "question": "What is a 'Callus' in tissue culture?",
      "options": [
        "A type of root",
        "A mass of undifferentiated, dividing cells",
        "The seed coat",
        "The flower of the plant"
      ],
      "correctAnswer": "A mass of undifferentiated, dividing cells",
      "difficulty": "moderate",
      "explanation": "In the initial stages of tissue culture, the explant grows into an unorganized mass of cells called a callus before it is stimulated to form specific organs."
    },
    {
      "question": "Which of the following plants can naturally reproduce using leaves?",
      "options": ["Mango", "Bryophyllum", "Maize", "Beans"],
      "correctAnswer": "Bryophyllum",
      "difficulty": "easy",
      "explanation": "Bryophyllum (kalanchoe) produces small plantlets along the margins of its leaves. When these fall to the ground, they grow into new plants."
    },
    {
      "question": "Vegetative propagation is 'Natural' when it occurs through:",
      "options": ["Grafting", "Bulbs, Rhizomes, and Tubers", "Tissue culture", "Layering"],
      "correctAnswer": "Bulbs, Rhizomes, and Tubers",
      "difficulty": "easy",
      "explanation": "Natural vegetative propagation happens through modified stems, roots, or leaves without human intervention."
    },
    {
      "question": "Why is 'Micropropagation' useful for the production of improved varieties?",
      "options": [
        "It takes a very long time, allowing for more observation",
        "It can produce thousands of identical, disease-free plants from a single parent quickly",
        "It always produces new colors of flowers",
        "It does not require any specialized equipment"
      ],
      "correctAnswer": "It can produce thousands of identical, disease-free plants from a single parent quickly",
      "difficulty": "moderate",
      "explanation": "This method is used commercially to mass-produce orchids, bananas, and ornamental plants that are difficult to grow from seeds."
    },
    {
      "question": "Assertion (A): Vegetative propagation allows for the preservation of desirable traits in a crop.\nReason (R): It does not involve meiosis or the fusion of gametes, so no genetic reshuffling occurs.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Because offspring are clones, every single trait of the high-quality parent is perfectly preserved in the offspring."
    },
    {
      "question": "In 'Air Layering' (Maricotting), the bark is removed and the area is wrapped with:",
      "options": ["Plastic only", "Moist moss or soil and then plastic", "Dry sand", "Cloth soaked in alcohol"],
      "correctAnswer": "Moist moss or soil and then plastic",
      "difficulty": "moderate",
      "explanation": "The moist medium provides water for root growth, and the plastic prevents it from drying out while roots develop on the aerial branch."
    },
    {
      "question": "Which of the following is NOT a type of asexual reproduction?",
      "options": ["Fragmentation", "Self-pollination", "Spore formation", "Vegetative propagation"],
      "correctAnswer": "Self-pollination",
      "difficulty": "moderate",
      "type": "negative",
      "explanation": "Pollination (even self-pollination) is a step in sexual reproduction because it eventually involves gamete fusion and seed production."
    },
    {
      "question": "Some fungi and ferns reproduce asexually using tough, resistant structures called:",
      "options": ["Seeds", "Spores", "Gametes", "Cuttings"],
      "correctAnswer": "Spores",
      "difficulty": "easy",
      "explanation": "Spores are single-celled reproductive units that can survive harsh conditions and grow into new organisms when conditions improve."
    },
    {
      "question": "Fragmentation is an asexual method where:",
      "options": [
        "The parent breaks into pieces, and each piece grows into a new individual",
        "The parent produces a small seed",
        "Two organisms fuse together",
        "The organism dies to give birth to its young"
      ],
      "correctAnswer": "The parent breaks into pieces, and each piece grows into a new individual",
      "difficulty": "easy",
      "explanation": "Common in algae like Spirogyra, where the filament breaks and each fragment continues to grow by cell division."
    },
    {
      "question": "Which part of the cassava plant is typically used for artificial propagation?",
      "options": ["The seeds", "Stem cuttings", "The leaves", "The flowers"],
      "correctAnswer": "Stem cuttings",
      "difficulty": "easy",
      "explanation": "Cassava is commercially propagated by planting stem segments (cuttings) containing nodes."
    },
    {
      "question": "What happens to the 'vascular cambium' during grafting?",
      "options": [
        "It is removed to prevent growth",
        "The cambium of the scion and stock must be in close contact",
        "It is replaced by agar",
        "It turns into bark instantly"
      ],
      "correctAnswer": "The cambium of the scion and stock must be in close contact",
      "difficulty": "hard",
      "explanation": "The cambium is the tissue responsible for growth. If they are in contact, they will fuse together, allowing the transport of water and nutrients between the two parts."
    },
    {
      "question": "Which of the following is a disadvantage of artificial propagation?",
      "options": [
        "It ensures the survival of weak plants",
        "It is faster than growing from seeds",
        "The plants are more prone to overcrowding and competition if not spaced out",
        "It allows for the growth of seedless fruits"
      ],
      "correctAnswer": "The plants are more prone to overcrowding and competition if not spaced out",
      "difficulty": "moderate",
      "explanation": "Since asexually produced plants often grow near the parent, they may compete for the same resources unless managed by humans."
    },
    {
      "question": "Sweet potatoes propagate using:",
      "options": ["Stem tubers", "Root tubers", "Bulbs", "Rhizomes"],
      "correctAnswer": "Root tubers",
      "difficulty": "moderate",
      "explanation": "Unlike Irish potatoes (stems), sweet potatoes are modified roots that store food and can produce adventitious buds."
    },
    {
      "question": "In 'Budding' (as an artificial method), what is grafted onto the stock?",
      "options": ["A large branch", "A single bud along with a small piece of bark", "A root", "The entire flower"],
      "correctAnswer": "A single bud along with a small piece of bark",
      "difficulty": "moderate",
      "explanation": "Budding is a variation of grafting where only one bud is inserted into the stock. It is common in citrus and rose propagation."
    },
    {
      "question": "Which of the following can be used to propagate 'seedless' varieties of grapes or oranges?",
      "options": ["Planting seeds", "Vegetative propagation", "Cross-pollination", "Spore formation"],
      "correctAnswer": "Vegetative propagation",
      "difficulty": "easy",
      "explanation": "Since seedless plants cannot reproduce sexually, they must be maintained through asexual methods like cuttings or grafting."
    },
    {
      "question": "Asexual reproduction is also known as ______ reproduction.",
      "options": ["Meiotic", "Somatogenic", "Gametogenic", "Syngamic"],
      "correctAnswer": "Somatogenic",
      "difficulty": "hard",
      "explanation": "It is called somatogenic because it involves somatic (body) cells rather than germ cells (gametes)."
    },
    {
      "question": "Identify the error in this statement: 'In layering, the branch is cut off from the parent plant before it is buried in the soil.'",
      "options": [
        "The error is 'branch'",
        "The error is 'cut off from'",
        "The error is 'buried'",
        "No error"
      ],
      "correctAnswer": "The error is 'cut off from'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "In layering, the branch remains attached to the parent plant until it has developed its own roots."
    },
    {
      "question": "What is the primary role of the 'Micropyle' in vegetative propagation?",
      "options": [
        "It provides nutrients",
        "It is used for budding",
        "It is NOT used; it is a structure for seed reproduction",
        "It acts as the root"
      ],
      "correctAnswer": "It is NOT used; it is a structure for seed reproduction",
      "difficulty": "moderate",
      "explanation": "The micropyle is the small opening in a seed coat for water and air; vegetative propagation does not involve seeds."
    },
    {
      "question": "True or False: Asexual reproduction is more common in stable environments than in rapidly changing ones.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "In stable environments, a successful genetic combination is already 'proven.' Sexual reproduction is better for changing environments where new variations are needed."
    },
    {
      "question": "Which of the following is a result of 'Suckers' in plants like bananas?",
      "options": [
        "The plant produces more seeds",
        "New shoots grow from the base of the plant or underground stem",
        "The leaves turn into roots",
        "The fruit grows larger"
      ],
      "correctAnswer": "New shoots grow from the base of the plant or underground stem",
      "difficulty": "moderate",
      "explanation": "Suckers are lateral shoots that emerge from the base of the mother plant. These are used to propagate bananas and pineapples."
    },
    {
      "question": "The term 'Totipotency' refers to:",
      "options": [
        "The ability of a plant to grow very tall",
        "The ability of a single plant cell to divide and differentiate into an entire new plant",
        "The ability of a plant to produce seeds",
        "The speed of transpiration"
      ],
      "correctAnswer": "The ability of a single plant cell to divide and differentiate into an entire new plant",
      "difficulty": "hard",
      "explanation": "Totipotency is the biological principle that makes tissue culture (micropropagation) possible."
    }
  ],
  "Unit 12: Sexual Reproduction in Plants": [
    {
      "question": "In the 'Alternation of Generations', the gametophyte generation is ______ and produces ______.",
      "options": ["Haploid; Spores", "Diploid; Gametes", "Haploid; Gametes", "Diploid; Spores"],
      "correctAnswer": "Haploid; Gametes",
      "difficulty": "moderate",
      "explanation": "The gametophyte is the haploid (n) phase of the plant life cycle that produces gametes (sperm and eggs) by mitosis."
    },
    {
      "question": "Which generation is dominant in Bryophytes (mosses)?",
      "options": ["Sporophyte", "Gametophyte", "Zygote", "Sorus"],
      "correctAnswer": "Gametophyte",
      "difficulty": "easy",
      "explanation": "In mosses, the green, leafy part we see is the gametophyte; the sporophyte is physically dependent on it for nutrition."
    },
    {
      "question": "In Pteridophytes (ferns), what is the heart-shaped gametophyte called?",
      "options": ["Prothallus", "Rhizome", "Frond", "Sporangium"],
      "correctAnswer": "Prothallus",
      "difficulty": "moderate",
      "explanation": "The prothallus is a small, green, heart-shaped structure that carries the archegonia and antheridia in ferns."
    },
    {
      "question": "Which structure in a flower is responsible for producing pollen grains?",
      "options": ["Stigma", "Style", "Anther", "Filament"],
      "correctAnswer": "Anther",
      "difficulty": "easy",
      "explanation": "The anther is the part of the stamen (male reproductive organ) where pollen is produced via meiosis."
    },
    {
      "question": "A 'Complete' flower must contain which of the following sets of structures?",
      "options": ["Petals and Sepals only", "Stamens and Carpels only", "Sepals, Petals, Stamens, and Carpels", "Stamens and Sepals only"],
      "correctAnswer": "Sepals, Petals, Stamens, and Carpels",
      "difficulty": "easy",
      "explanation": "A complete flower has all four whorls: calyx (sepals), corolla (petals), androecium (stamens), and gynoecium (carpels)."
    },
    {
      "question": "Flowers that possess either stamens or carpels, but not both, are described as:",
      "options": ["Bisexual", "Hermaphrodite", "Unisexual", "Monoecious"],
      "correctAnswer": "Unisexual",
      "difficulty": "easy",
      "explanation": "Unisexual flowers are either staminate (male) or pistillate (female). Bisexual flowers have both."
    },
    {
      "question": "Which part of the flower develops into a fruit after fertilization?",
      "options": ["Ovule", "Ovary", "Receptacle", "Style"],
      "correctAnswer": "Ovary",
      "difficulty": "easy",
      "explanation": "The ovary wall thickens and ripens to become the fruit, while the ovules inside become the seeds."
    },
    {
      "question": "What is the transfer of pollen from the anther of one flower to the stigma of a different flower on the same plant called?",
      "options": ["Autogamy", "Geitonogamy", "Xenogamy", "Cleistogamy"],
      "correctAnswer": "Geitonogamy",
      "difficulty": "hard",
      "explanation": "Geitonogamy is functionally cross-pollination but genetically similar to self-pollination since it occurs on the same plant."
    },
    {
      "question": "Which of the following is a characteristic of wind-pollinated (anemophilous) flowers?",
      "options": [
        "Brightly colored petals",
        "Presence of nectar and scent",
        "Large, feathery stigmas and long filaments",
        "Heavy, sticky pollen grains"
      ],
      "correctAnswer": "Large, feathery stigmas and long filaments",
      "difficulty": "moderate",
      "explanation": "Feathery stigmas increase the surface area to catch wind-borne pollen, and long filaments expose anthers to the wind."
    },
    {
      "question": "In flowering plants, 'Double Fertilization' involves the fusion of two sperm cells with:",
      "options": [
        "The egg cell only",
        "The egg cell and the two polar nuclei",
        "The synergids and antipodal cells",
        "The ovary wall and the ovule"
      ],
      "correctAnswer": "The egg cell and the two polar nuclei",
      "difficulty": "moderate",
      "explanation": "One sperm fuses with the egg (forming the zygote), and the other sperm fuses with the two polar nuclei (forming the triploid endosperm)."
    },
    {
      "question": "What is the primary function of the 'Endosperm' in a seed?",
      "options": [
        "To protect the embryo",
        "To provide nourishment to the developing embryo",
        "To help in seed dispersal",
        "To absorb water during germination"
      ],
      "correctAnswer": "To provide nourishment to the developing embryo",
      "difficulty": "easy",
      "explanation": "The endosperm is a nutrient-rich tissue that supports the embryo until the plant can photosynthesize."
    },
    {
      "question": "Which of the following describes a 'True Fruit'?",
      "options": [
        "Developed from the receptacle",
        "Developed only from the ripened ovary",
        "Formed without fertilization",
        "A fruit that lacks seeds"
      ],
      "correctAnswer": "Developed only from the ripened ovary",
      "difficulty": "moderate",
      "explanation": "True fruits (like mangoes) develop from the ovary. False fruits (like apples) involve other floral parts like the receptacle."
    },
    {
      "question": "The 'Testa' of a seed develops from which part of the ovule?",
      "options": ["Nucellus", "Integuments", "Micropyle", "Funicle"],
      "correctAnswer": "Integuments",
      "difficulty": "hard",
      "explanation": "The outer layers of the ovule, called integuments, harden to form the seed coat or testa."
    },
    {
      "question": "Which type of fruit develops from several ovaries of a single flower (e.g., strawberry or raspberry)?",
      "options": ["Simple fruit", "Aggregate fruit", "Multiple fruit", "Drupa"],
      "correctAnswer": "Aggregate fruit",
      "difficulty": "moderate",
      "explanation": "Aggregate fruits come from a single flower with many separate carpels."
    },
    {
      "question": "A 'Pineapple' is an example of a ______ fruit because it develops from a whole inflorescence (cluster of flowers).",
      "options": ["Multiple (Composite)", "Aggregate", "Simple", "Succulent"],
      "correctAnswer": "Multiple (Composite)",
      "difficulty": "moderate",
      "explanation": "Multiple fruits form from the fusion of ovaries from many different flowers in an inflorescence."
    },
    {
      "question": "Which of the following is an adaptation for seed dispersal by water?",
      "options": [
        "Hooks and barbs",
        "Wings or plumes",
        "Fibrous, air-filled husks for buoyancy",
        "Fleshy and brightly colored pericarp"
      ],
      "correctAnswer": "Fibrous, air-filled husks for buoyancy",
      "difficulty": "easy",
      "explanation": "Coconuts, for example, have a fibrous mesocarp that allows them to float across oceans."
    },
    {
      "question": "Seeds that are dispersed by the 'Explosive Mechanism' (dehiscence) usually have:",
      "options": [
        "Sticky hairs",
        "Wings",
        "Pod-like structures that dry and burst open",
        "Sweet pulp"
      ],
      "correctAnswer": "Pod-like structures that dry and burst open",
      "difficulty": "easy",
      "explanation": "Plants like peas or balsam use mechanical tension to fling seeds away when the fruit dries."
    },
    {
      "question": "The movement of a pollen tube toward the ovule is an example of:",
      "options": ["Phototropism", "Chemotropism", "Hydrotropism", "Geotropism"],
      "correctAnswer": "Chemotropism",
      "difficulty": "moderate",
      "explanation": "The pollen tube grows in response to chemical signals (sugars and proteins) released by the synergids in the ovule."
    },
    {
      "question": "What is the 'Micropyle' in a mature seed?",
      "options": [
        "The site where the seed was attached to the fruit",
        "A small pore that allows water and oxygen entry during germination",
        "The part that becomes the first leaf",
        "The food storage area"
      ],
      "correctAnswer": "A small pore that allows water and oxygen entry during germination",
      "difficulty": "moderate",
      "explanation": "The micropyle persists from the ovule stage and serves as the entry point for water during imbibition."
    },
    {
      "question": "In a 'Dicot' seed, the food is usually stored in the:",
      "options": ["Endosperm", "Cotyledons", "Radicle", "Plumule"],
      "correctAnswer": "Cotyledons",
      "difficulty": "easy",
      "explanation": "In many dicots (like beans), the endosperm is absorbed by the two cotyledons before the seed matures."
    },
    {
      "question": "Which of the following is NOT a part of the 'Carpel' (Pistil)?",
      "options": ["Stigma", "Style", "Ovary", "Filament"],
      "correctAnswer": "Filament",
      "difficulty": "easy",
      "type": "negative",
      "explanation": "The filament is part of the stamen (male organ). The carpel consists of the stigma, style, and ovary."
    },
    {
      "question": "The formation of fruit without fertilization is called:",
      "options": ["Parthenogenesis", "Parthenocarpy", "Apomixis", "Polyembryony"],
      "correctAnswer": "Parthenocarpy",
      "difficulty": "moderate",
      "explanation": "Parthenocarpy results in seedless fruits, such as bananas and some varieties of grapes."
    },
    {
      "question": "Which floral part often becomes modified into 'wings' for wind dispersal in fruits like Acer (Maple)?",
      "options": ["Sepals", "Petals", "Ovary wall (Pericarp)", "Bracts"],
      "correctAnswer": "Ovary wall (Pericarp)",
      "difficulty": "hard",
      "explanation": "In samaras (winged fruits), the pericarp extends into a wing-like structure to help the fruit catch the wind."
    },
    {
      "question": "What is the ploidy level of the 'Endosperm' in angiosperms?",
      "options": ["Haploid (n)", "Diploid (2n)", "Triploid (3n)", "Tetraploid (4n)"],
      "correctAnswer": "Triploid (3n)",
      "difficulty": "moderate",
      "explanation": "It results from the fusion of one haploid sperm (n) and two haploid polar nuclei (n+n)."
    },
    {
      "question": "Plants like 'Blackberries' that have seeds with hooks are adapted for dispersal by:",
      "options": ["Wind", "Water", "Animals (External)", "Animals (Internal)"],
      "correctAnswer": "Animals (External)",
      "difficulty": "easy",
      "explanation": "Hooks allow the fruits or seeds to stick to the fur of animals or clothing of humans."
    },
    {
      "question": "The 'Coleorhiza' in a monocot seed protects the:",
      "options": ["Plumule", "Radicle", "Endosperm", "Scutellum"],
      "correctAnswer": "Radicle",
      "difficulty": "hard",
      "explanation": "In monocots like maize, the radicle is enclosed in a protective sheath called the coleorhiza."
    },
    {
      "question": "Assertion (A): Insect-pollinated flowers produce large amounts of smooth, light pollen.\nReason (R): This allows the pollen to float easily through the air to reach other flowers.",
      "options": [
        "Both A and R are true",
        "A is true but R is false",
        "A is false but R is true",
        "Both A and R are false"
      ],
      "correctAnswer": "Both A and R are false",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Insect-pollinated flowers produce sticky, heavy, spiked pollen. Wind-pollinated flowers produce large amounts of smooth, light pollen."
    },
    {
      "question": "The male gametophyte of a flowering plant is the:",
      "options": ["Anther", "Pollen grain", "Sperm cell", "Microspore mother cell"],
      "correctAnswer": "Pollen grain",
      "difficulty": "hard",
      "explanation": "The germinated pollen grain (with its tube cell and two sperm cells) is the highly reduced male gametophyte."
    },
    {
      "question": "Which structure connects the ovary to the stigma?",
      "options": ["Filament", "Style", "Funicle", "Receptacle"],
      "correctAnswer": "Style",
      "difficulty": "easy",
      "explanation": "The style is the stalk-like structure through which the pollen tube grows."
    },
    {
      "question": "What is 'Self-incompatibility' in plants?",
      "options": [
        "The plant cannot produce pollen",
        "A biochemical mechanism that prevents a plant's own pollen from fertilizing its own ovules",
        "The flowers never open",
        "The plant dies after producing seeds"
      ],
      "correctAnswer": "A biochemical mechanism that prevents a plant's own pollen from fertilizing its own ovules",
      "difficulty": "hard",
      "explanation": "This promotes outbreeding and genetic variation by ensuring only pollen from a different plant of the same species can fertilize the ovules."
    },
    {
      "question": "The female gametophyte of an angiosperm is also known as the:",
      "options": ["Ovule", "Embryo sac", "Nucellus", "Ovary"],
      "correctAnswer": "Embryo sac",
      "difficulty": "moderate",
      "explanation": "The embryo sac (typically containing 7 cells and 8 nuclei) is the female gametophyte."
    },
    {
      "question": "Which of the following is a 'Dry Indehiscent' fruit?",
      "options": ["Pea pod", "Maize grain (Caryopsis)", "Orange", "Tomato"],
      "correctAnswer": "Maize grain (Caryopsis)",
      "difficulty": "hard",
      "explanation": "Indehiscent fruits do not split open at maturity. In maize, the seed coat is fused with the fruit wall (pericarp)."
    },
    {
      "question": "What is the 'Hilum' on a seed?",
      "options": [
        "The opening for water",
        "The scar where the seed was attached to the funicle (stalk) of the ovary",
        "The embryonic root",
        "The food storage tissue"
      ],
      "correctAnswer": "The scar where the seed was attached to the funicle (stalk) of the ovary",
      "difficulty": "moderate",
      "explanation": "The hilum marks the point of attachment between the seed and the mother plant."
    },
    {
      "question": "Dioecious plants are those that:",
      "options": [
        "Have both male and female flowers on the same individual",
        "Have male and female flowers on separate individual plants",
        "Only produce seeds through asexual means",
        "Flower twice a year"
      ],
      "correctAnswer": "Have male and female flowers on separate individual plants",
      "difficulty": "moderate",
      "explanation": "Examples include papaya and dates, where you have 'male' trees and 'female' trees."
    },
    {
      "question": "The process by which a diploid cell in the anther divides to form four haploid microspores is called:",
      "options": ["Microsporogenesis", "Megasporogenesis", "Pollination", "Syngamy"],
      "correctAnswer": "Microsporogenesis",
      "difficulty": "hard",
      "explanation": "Microsporogenesis is the production of microspores (pollen) in the male organs."
    },
    {
      "question": "Which of the following fruits is a 'Drupe'?",
      "options": ["Tomato", "Mango", "Bean", "Cucumber"],
      "correctAnswer": "Mango",
      "difficulty": "moderate",
      "explanation": "A drupe (stone fruit) has a fleshy exterior and a hard, stony endocarp surrounding the seed."
    },
    {
      "question": "Identify the error: 'In double fertilization, one sperm fuses with the egg to form a triploid zygote.'",
      "options": [
        "The error is 'one sperm'",
        "The error is 'egg'",
        "The error is 'triploid zygote'",
        "No error"
      ],
      "correctAnswer": "The error is 'triploid zygote'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "The zygote is always diploid (2n). It is the endosperm that is triploid (3n)."
    },
    {
      "question": "Ornithophily refers to pollination by:",
      "options": ["Insects", "Birds", "Bats", "Wind"],
      "correctAnswer": "Birds",
      "difficulty": "moderate",
      "explanation": "Bird-pollinated flowers are often tubular, red or orange, and produce large amounts of nectar but have no scent."
    },
    {
      "question": "The 'Scutellum' in a cereal grain is a modified:",
      "options": ["Radicle", "Cotyledon", "Endosperm", "Testa"],
      "correctAnswer": "Cotyledon",
      "difficulty": "hard",
      "explanation": "In monocots like maize/wheat, the single cotyledon is called a scutellum and specializes in absorbing nutrients from the endosperm."
    },
    {
      "question": "Which of the following describes 'Protandry'?",
      "options": [
        "The carpels mature before the stamens",
        "The stamens mature before the carpels",
        "The flower never opens",
        "The plant produces only male flowers"
      ],
      "correctAnswer": "The stamens mature before the carpels",
      "difficulty": "hard",
      "explanation": "Protandry is a mechanism to prevent self-pollination by ensuring the male and female parts are active at different times."
    },
    {
      "question": "Succulent fruits (like berries and drupes) are primarily adapted for dispersal by:",
      "options": ["Wind", "Water", "Animals (Ingestion)", "Gravity"],
      "correctAnswer": "Animals (Ingestion)",
      "difficulty": "easy",
      "explanation": "Animals eat the fleshy fruit and the seeds pass through their digestive tract unharmed, being deposited elsewhere in feces."
    }
  ],
  "Unit 13: Principles of Gene Technology": [
    {
      "question": "Which enzyme is known as 'biological scissors' in genetic engineering because it cuts DNA at specific base sequences?",
      "options": ["DNA Ligase", "Restriction Endonuclease", "Reverse Transcriptase", "DNA Polymerase"],
      "correctAnswer": "Restriction Endonuclease",
      "difficulty": "easy",
      "explanation": "Restriction enzymes recognize specific palindromic sequences of DNA and cut the sugar-phosphate backbone at those points."
    },
    {
      "question": "The staggered cuts made by certain restriction enzymes produce overhanging single-stranded ends known as:",
      "options": ["Blunt ends", "Sticky ends", "Primer ends", "Stop codons"],
      "correctAnswer": "Sticky ends",
      "difficulty": "easy",
      "explanation": "Sticky ends are useful because they can easily form hydrogen bonds with complementary sequences on another DNA fragment cut by the same enzyme."
    },
    {
      "question": "Which enzyme is responsible for joining two DNA fragments together by forming phosphodiester bonds?",
      "options": ["DNA Helicase", "RNA Polymerase", "DNA Ligase", "Exonuclease"],
      "correctAnswer": "DNA Ligase",
      "difficulty": "easy",
      "explanation": "DNA Ligase acts as a 'glue' that permanently seals the gaps between DNA fragments, creating a continuous recombinant DNA molecule."
    },
    {
      "question": "What is the role of 'Reverse Transcriptase' in gene technology?",
      "options": [
        "To cut DNA into smaller pieces",
        "To synthesize DNA from an mRNA template",
        "To replicate DNA in a PCR machine",
        "To transfer genes into bacteria"
      ],
      "correctAnswer": "To synthesize DNA from an mRNA template",
      "difficulty": "moderate",
      "explanation": "Reverse transcriptase is used to create complementary DNA (cDNA) from mRNA, which is useful because cDNA lacks the non-coding introns found in eukaryotic genomic DNA."
    },
    {
      "question": "A plasmid is best defined as:",
      "options": [
        "The main bacterial chromosome",
        "A small, circular, extra-chromosomal DNA molecule in bacteria",
        "A protein coat of a virus",
        "A type of RNA used in protein synthesis"
      ],
      "correctAnswer": "A small, circular, extra-chromosomal DNA molecule in bacteria",
      "difficulty": "easy",
      "explanation": "Plasmids are independent of the main chromosome and are frequently used as vectors to carry foreign DNA into host cells."
    },
    {
      "question": "Which property makes plasmids ideal vectors for gene manipulation?",
      "options": [
        "They contain an origin of replication (ori)",
        "They often carry selectable markers like antibiotic resistance genes",
        "They have unique restriction sites",
        "All of the above"
      ],
      "correctAnswer": "All of the above",
      "difficulty": "moderate",
      "explanation": "An 'ori' allows independent replication, selectable markers allow identification of transformed cells, and restriction sites allow the insertion of foreign genes."
    },
    {
      "question": "In gene technology, a 'Vector' is:",
      "options": [
        "The organism that receives the new gene",
        "A DNA molecule used to carry foreign genetic material into another cell",
        "The enzyme that cuts DNA",
        "The final protein product"
      ],
      "correctAnswer": "A DNA molecule used to carry foreign genetic material into another cell",
      "difficulty": "easy",
      "explanation": "Common vectors include plasmids, viruses (bacteriophages), and liposomes."
    },
    {
      "question": "The process by which bacteria take up naked DNA from their surroundings is called:",
      "options": ["Transduction", "Transformation", "Conjugation", "Translation"],
      "correctAnswer": "Transformation",
      "difficulty": "moderate",
      "explanation": "Transformation is a key step in cloning where the recombinant plasmid is introduced into a bacterial host, often aided by heat shock or calcium chloride."
    },
    {
      "question": "What is the purpose of including an antibiotic resistance gene in a recombinant plasmid?",
      "options": [
        "To make the bacteria stronger",
        "To allow only the bacteria that have taken up the plasmid to grow on a specific medium",
        "To prevent the bacteria from reproducing",
        "To trigger the production of human insulin"
      ],
      "correctAnswer": "To allow only the bacteria that have taken up the plasmid to grow on a specific medium",
      "difficulty": "moderate",
      "explanation": "This acts as a 'selectable marker.' Bacteria without the plasmid will die on antibiotic-enriched agar, while those with the plasmid (transformed) will survive."
    },
    {
      "question": "An organism that contains DNA from a different species is known as a:",
      "options": ["Mutant organism", "Clone", "Transgenic organism", "Hybrid"],
      "correctAnswer": "Transgenic organism",
      "difficulty": "easy",
      "explanation": "Transgenic organisms (or GMOs) have been genetically engineered to express a foreign gene for beneficial traits."
    },
    {
      "question": "Which of the following is a non-biological method of gene transfer involving a high-voltage pulse?",
      "options": ["Microinjection", "Electroporation", "Gene gun (Biolistics)", "Liposome-mediated transfer"],
      "correctAnswer": "Electroporation",
      "difficulty": "moderate",
      "explanation": "Electroporation uses electricity to create temporary pores in the cell membrane, allowing DNA to enter the cell."
    },
    {
      "question": "In the 'Gene Gun' method, DNA is coated onto 'bullets' made of which material?",
      "options": ["Iron or Copper", "Gold or Tungsten", "Silver or Platinum", "Plastic"],
      "correctAnswer": "Gold or Tungsten",
      "difficulty": "moderate",
      "explanation": "These heavy metals are inert and can be accelerated at high speeds to penetrate tough plant cell walls."
    },
    {
      "question": "What is the primary function of the Polymerase Chain Reaction (PCR)?",
      "options": [
        "To sequence a whole genome",
        "To cut DNA into small fragments",
        "To amplify (copy) a specific DNA sequence millions of times",
        "To visualize DNA on a gel"
      ],
      "correctAnswer": "To amplify (copy) a specific DNA sequence millions of times",
      "difficulty": "easy",
      "explanation": "PCR is an in-vitro method for rapid DNA cloning without the need for living host cells."
    },
    {
      "question": "During the 'Denaturation' step of PCR, the DNA is heated to approximately 95°C to:",
      "options": [
        "Activate the DNA polymerase",
        "Allow primers to bind",
        "Separate the double-stranded DNA into single strands",
        "Destroy any contaminating bacteria"
      ],
      "correctAnswer": "Separate the double-stranded DNA into single strands",
      "difficulty": "moderate",
      "explanation": "High heat breaks the hydrogen bonds between complementary bases, creating single-stranded templates."
    },
    {
      "question": "Why is 'Taq Polymerase' used in PCR instead of human DNA polymerase?",
      "options": [
        "It is cheaper to produce",
        "It is heat-stable and does not denature at high temperatures",
        "It works much faster",
        "It can correct its own mistakes"
      ],
      "correctAnswer": "It is heat-stable and does not denature at high temperatures",
      "difficulty": "moderate",
      "explanation": "Taq polymerase comes from the bacterium Thermus aquaticus, which lives in hot springs; it can survive the repeated heating cycles of PCR."
    },
    {
      "question": "What is the role of 'Primers' in a PCR reaction?",
      "options": [
        "To provide a starting point for DNA polymerase to begin synthesis",
        "To cut the DNA at specific sites",
        "To act as a selectable marker",
        "To join DNA fragments together"
      ],
      "correctAnswer": "To provide a starting point for DNA polymerase to begin synthesis",
      "difficulty": "moderate",
      "explanation": "Primers are short, single-stranded DNA sequences that are complementary to the target DNA region."
    },
    {
      "question": "Gel Electrophoresis separates DNA fragments based on their:",
      "options": ["Color", "Chemical composition", "Size (Length) and Charge", "Age"],
      "correctAnswer": "Size (Length) and Charge",
      "difficulty": "moderate",
      "explanation": "DNA is negatively charged and moves toward the positive electrode; smaller fragments move faster through the agarose gel pores than larger ones."
    },
    {
      "question": "In Gel Electrophoresis, DNA moves toward the ______ electrode because DNA has a ______ charge.",
      "options": ["Negative; Positive", "Positive; Negative", "Positive; Neutral", "Negative; Negative"],
      "correctAnswer": "Positive; Negative",
      "difficulty": "easy",
      "explanation": "The phosphate groups in the DNA backbone give it a net negative charge, attracting it to the anode (positive terminal)."
    },
    {
      "question": "What is a 'DNA Probe'?",
      "options": [
        "A type of restriction enzyme",
        "A short, labeled, single-stranded DNA fragment used to detect a complementary sequence",
        "A needle used for microinjection",
        "The dye used to stain a gel"
      ],
      "correctAnswer": "A short, labeled, single-stranded DNA fragment used to detect a complementary sequence",
      "difficulty": "moderate",
      "explanation": "Probes are often labeled with radioactive isotopes or fluorescent dyes so their binding can be visualized."
    },
    {
      "question": "A 'Microarray' consists of thousands of different ______ fixed to a solid surface like a glass slide.",
      "options": ["Proteins", "DNA probes", "Restriction enzymes", "Bacterial colonies"],
      "correctAnswer": "DNA probes",
      "difficulty": "hard",
      "explanation": "Microarrays allow scientists to monitor the expression of thousands of genes simultaneously or to detect specific mutations."
    },
    {
      "question": "In microarray analysis, if a spot fluoresces, it indicates that:",
      "options": [
        "The gene is not present",
        "The DNA polymerase has failed",
        "Hybridization has occurred between the target DNA/mRNA and the probe",
        "The cell is dead"
      ],
      "correctAnswer": "Hybridization has occurred between the target DNA/mRNA and the probe",
      "difficulty": "hard",
      "explanation": "Fluorescence confirms that the sample DNA/cDNA matches the specific probe at that location on the grid."
    },
    {
      "question": "Which of the following is an application of microarrays in medicine?",
      "options": [
        "Producing large amounts of insulin",
        "Identifying specific gene expression patterns in cancer cells",
        "Cutting DNA for gel electrophoresis",
        "Storing bacterial plasmids"
      ],
      "correctAnswer": "Identifying specific gene expression patterns in cancer cells",
      "difficulty": "moderate",
      "explanation": "Microarrays help doctors determine which genes are 'turned on' or 'off' in a tumor, aiding in diagnosis and treatment choice."
    },
    {
      "question": "What is the 'Annealing' temperature range typically used in PCR?",
      "options": ["90°C - 95°C", "50°C - 65°C", "70°C - 75°C", "35°C - 40°C"],
      "correctAnswer": "50°C - 65°C",
      "difficulty": "hard",
      "explanation": "This temperature is low enough to allow primers to form hydrogen bonds with the template DNA, but high enough to prevent non-specific binding."
    },
    {
      "question": "The collection of all DNA sequences in an organism is called its:",
      "options": ["Proteome", "Genome", "Transcriptome", "Plasmidome"],
      "correctAnswer": "Genome",
      "difficulty": "easy",
      "explanation": "The genome encompasses all the genetic material, including coding and non-coding sequences."
    },
    {
      "question": "Which method of gene transfer involves using a fine glass needle to inject DNA directly into the nucleus of an egg cell?",
      "options": ["Transformation", "Microinjection", "Electroporation", "Liposome transfer"],
      "correctAnswer": "Microinjection",
      "difficulty": "easy",
      "explanation": "Microinjection is a common physical method used to create transgenic animals by injecting DNA into a fertilized egg (zygote)."
    },
    {
      "question": "In genetic engineering, 'cDNA' stands for:",
      "options": ["Circular DNA", "Complementary DNA", "Complex DNA", "Cellular DNA"],
      "correctAnswer": "Complementary DNA",
      "difficulty": "moderate",
      "explanation": "It is called 'complementary' because it is synthesized to be the exact match of an mRNA strand using reverse transcriptase."
    },
    {
      "question": "Select the correct order of steps in a single cycle of PCR.",
      "options": [
        "Annealing → Denaturation → Extension",
        "Extension → Annealing → Denaturation",
        "Denaturation → Annealing → Extension",
        "Denaturation → Extension → Annealing"
      ],
      "correctAnswer": "Denaturation → Annealing → Extension",
      "difficulty": "moderate",
      "explanation": "DNA is first separated (Denaturation), then primers bind (Annealing), and finally DNA polymerase builds the new strands (Extension)."
    },
    {
      "question": "What is a 'Palindromic' sequence in the context of restriction enzymes?",
      "options": [
        "A sequence that codes for a protein",
        "A sequence that reads the same 5' to 3' on both strands",
        "A sequence that repeats many times",
        "A sequence that marks the end of a gene"
      ],
      "correctAnswer": "A sequence that reads the same 5' to 3' on both strands",
      "difficulty": "hard",
      "explanation": "Example: 5'-GAATTC-3' on one strand and 3'-CTTAAG-5' on the other. Most restriction enzymes recognize these symmetrical sequences."
    },
    {
      "question": "Which of the following is a potential risk associated with the release of GMOs?",
      "options": [
        "Increased crop yields",
        "Reduced use of pesticides",
        "Transfer of herbicide resistance to weeds ('superweeds')",
        "Improved nutritional content of food"
      ],
      "correctAnswer": "Transfer of herbicide resistance to weeds ('superweeds')",
      "difficulty": "moderate",
      "explanation": "Horizontal gene transfer or cross-pollination between GMO crops and wild relatives is a significant ecological concern."
    },
    {
      "question": "Liposomes are used in gene therapy because they:",
      "options": [
        "Are small viruses that infect cells",
        "Are lipid vesicles that can fuse with the cell membrane to deliver DNA",
        "Are enzymes that join DNA fragments",
        "Can be seen under a light microscope"
      ],
      "correctAnswer": "Are lipid vesicles that can fuse with the cell membrane to deliver DNA",
      "difficulty": "hard",
      "explanation": "Liposomes are non-viral vectors made of a phospholipid bilayer, making them useful for carrying DNA into human cells for gene therapy."
    },
    {
      "question": "How many double-stranded DNA molecules will be produced after 4 cycles of PCR, starting with one template?",
      "options": ["4", "8", "16", "32"],
      "correctAnswer": "16",
      "difficulty": "hard",
      "explanation": "The amount of DNA doubles with each cycle (2^n). For 4 cycles, it is 2 to the power of 4 = 16."
    },
    {
      "question": "Which chemical is often used to visualize DNA in an agarose gel by making it fluoresce under UV light?",
      "options": ["Methylene blue", "Ethidium bromide", "Iodine", "Crystal violet"],
      "correctAnswer": "Ethidium bromide",
      "difficulty": "hard",
      "explanation": "Ethidium bromide intercalates between the DNA bases and glows orange under ultraviolet light."
    },
    {
      "question": "In gel electrophoresis, the 'ladder' or 'marker' is used to:",
      "options": [
        "Provide power to the gel box",
        "Estimate the size of the unknown DNA fragments",
        "Cut the DNA into pieces",
        "Stain the DNA"
      ],
      "correctAnswer": "Estimate the size of the unknown DNA fragments",
      "difficulty": "moderate",
      "explanation": "A DNA ladder contains fragments of known lengths that act as a reference for measuring the sample fragments."
    },
    {
      "question": "Assertion (A): PCR is highly sensitive.\nReason (R): It can amplify a target DNA sequence from a single cell or even a degraded sample.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "The exponential nature of PCR allows it to produce usable amounts of DNA from extremely tiny starting amounts."
    },
    {
      "question": "What happens at the 'Extension' stage of PCR (usually around 72°C)?",
      "options": [
        "Primers are removed",
        "Taq polymerase adds nucleotides to the 3' end of the primers",
        "The DNA is cut into smaller pieces",
        "The reaction is stopped"
      ],
      "correctAnswer": "Taq polymerase adds nucleotides to the 3' end of the primers",
      "difficulty": "moderate",
      "explanation": "72°C is the optimal temperature for Taq polymerase to synthesize new DNA strands."
    },
    {
      "question": "A Ti-plasmid (Tumor-inducing) is naturally found in which organism used for plant genetic engineering?",
      "options": ["E. coli", "Agrobacterium tumefaciens", "Saccharomyces cerevisiae", "Bacteriophage Lambda"],
      "correctAnswer": "Agrobacterium tumefaciens",
      "difficulty": "hard",
      "explanation": "Agrobacterium is a 'natural genetic engineer' that transfers a part of its Ti-plasmid (T-DNA) into the plant genome."
    },
    {
      "question": "Which of the following is an example of 'Biofarming'?",
      "options": [
        "Using tractors to plant crops",
        "Producing pharmaceutical proteins like antithrombin in the milk of transgenic goats",
        "Growing organic vegetables",
        "Using bacteria to clean up oil spills"
      ],
      "correctAnswer": "Producing pharmaceutical proteins like antithrombin in the milk of transgenic goats",
      "difficulty": "moderate",
      "explanation": "Biofarming (Pharming) uses genetically modified animals or plants as 'bioreactors' to produce drugs or vaccines."
    },
    {
      "question": "In microarray technology, mRNA is converted to ______ before being applied to the slide.",
      "options": ["tRNA", "cDNA", "Amino acids", "rRNA"],
      "correctAnswer": "cDNA",
      "difficulty": "moderate",
      "explanation": "DNA is much more stable than RNA and is required for hybridization with the DNA probes on the microarray chip."
    },
    {
      "question": "Identify the error in this statement: 'During gel electrophoresis, DNA fragments move through the gel based on their density, with denser pieces moving faster.'",
      "options": [
        "The error is 'gel electrophoresis'",
        "The error is 'density'",
        "The error is 'moving faster'",
        "The error is both 'density' and 'moving faster'"
      ],
      "correctAnswer": "The error is both 'density' and 'moving faster'",
      "difficulty": "hard",
      "type": "errorIdentification",
      "explanation": "Separation is based on *size/length*, not density. Smaller (shorter) pieces move faster, while larger pieces move slower."
    },
    {
      "question": "Which term describes the process of binding a single-stranded probe to a single-stranded target DNA?",
      "options": ["Ligation", "Hybridization", "Transformation", "Amplification"],
      "correctAnswer": "Hybridization",
      "difficulty": "moderate",
      "explanation": "Hybridization is the specific base-pairing between two complementary nucleic acid strands from different sources."
    },
    {
      "question": "The use of living organisms or their products for human benefit is the broad definition of:",
      "options": ["Genetics", "Ecology", "Biotechnology", "Microbiology"],
      "correctAnswer": "Biotechnology",
      "difficulty": "easy",
      "explanation": "Biotechnology covers everything from ancient bread-making with yeast to modern CRISPR gene editing."
    },
    {
      "question": "What is the function of the 'loading dye' in gel electrophoresis?",
      "options": [
        "To stain the DNA bands orange",
        "To make the DNA sample heavy so it sinks into the well and to track its progress",
        "To cut the DNA into smaller fragments",
        "To provide the electrical charge"
      ],
      "correctAnswer": "To make the DNA sample heavy so it sinks into the well and to track its progress",
      "difficulty": "moderate",
      "explanation": "Loading dye usually contains glycerol (for weight) and visible dyes that migrate ahead of or with the DNA to show when to turn off the power."
    },
    {
      "question": "Which enzyme would you use to produce 'blunt ends'?",
      "options": [
        "One that cuts at the same position on both strands (symmetrically)",
        "One that cuts in a staggered fashion",
        "DNA Ligase",
        "Reverse Transcriptase"
      ],
      "correctAnswer": "One that cuts at the same position on both strands (symmetrically)",
      "difficulty": "hard",
      "explanation": "Restriction enzymes like SmaI cut straight across the double helix, leaving no single-stranded overhangs."
    },
    {
      "question": "True or False: In PCR, the primers are designed to be complementary to the ends of the target sequence.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Primers must 'bracket' the region of interest so that the DNA between them is the part being amplified."
    },
    {
      "question": "The total number of mRNA molecules present in a cell at a specific time is called the:",
      "options": ["Genome", "Proteome", "Transcriptome", "Metabolome"],
      "correctAnswer": "Transcriptome",
      "difficulty": "hard",
      "explanation": "Transcriptomics focuses on gene expression by analyzing which genes are being transcribed into mRNA."
    },
    {
      "question": "What is 'Replica Plating'?",
      "options": [
        "A way to make an exact copy of a bacterial colony pattern on another plate",
        "The process of cleaning a Petri dish",
        "A method of PCR",
        "The same as DNA sequencing"
      ],
      "correctAnswer": "A way to make an exact copy of a bacterial colony pattern on another plate",
      "difficulty": "hard",
      "explanation": "This technique is used to identify colonies that can grow on one medium (e.g., with antibiotic) but not another, helping to identify recombinant organisms."
    }
  ],
    "Unit 14: Application of Gene Technology": [
    {
      "question": "Which field combines biology, computer science, and statistics to analyze and interpret large biological datasets?",
      "options": ["Biotechnology", "Bioinformatics", "Genomics", "Proteomics"],
      "correctAnswer": "Bioinformatics",
      "difficulty": "easy",
      "explanation": "Bioinformatics is essential for managing the vast amounts of data generated by genome sequencing and proteomics."
    },
    {
      "question": "In recombinant DNA technology, what was the first human protein to be commercially produced using bacteria?",
      "options": ["Growth Hormone", "Insulin", "Interferon", "Factor VIII"],
      "correctAnswer": "Insulin",
      "difficulty": "easy",
      "explanation": "Humulin, produced by E. coli, was the first licensed drug made via recombinant DNA technology (1982)."
    },
    {
      "question": "What is the primary advantage of using recombinant human insulin over insulin extracted from animal pancreases?",
      "options": ["It is cheaper to package", "It does not trigger allergic reactions in patients", "It lasts for years without refrigeration", "It can be taken orally as a pill"],
      "correctAnswer": "It does not trigger allergic reactions in patients",
      "difficulty": "moderate",
      "explanation": "Recombinant insulin is identical to human insulin, avoiding the immune responses sometimes caused by cow or pig insulin."
    },
    {
      "question": "Which human protein produced by gene technology is used to treat patients with hemophilia A?",
      "options": ["Antithrombin", "Factor VIII", "Insulin", "Glucagon"],
      "correctAnswer": "Factor VIII",
      "difficulty": "moderate",
      "explanation": "Factor VIII is a blood-clotting protein that hemophiliacs lack; producing it via biotechnology prevents risks associated with human blood donations."
    },
    {
      "question": "What is 'Gene Therapy'?",
      "options": [
        "Giving a patient drugs made by bacteria",
        "The insertion of a normal, functional gene into cells to correct a genetic disorder",
        "The study of how genes are inherited",
        "Counseling parents about genetic risks"
      ],
      "correctAnswer": "The insertion of a normal, functional gene into cells to correct a genetic disorder",
      "difficulty": "moderate",
      "explanation": "Gene therapy aims to treat the underlying cause of a disease by replacing or supplementing a defective gene."
    },
    {
      "question": "In forensic science, the process of identifying individuals based on unique patterns in their DNA is called:",
      "options": ["DNA Sequencing", "DNA Profiling (Fingerprinting)", "DNA Transcription", "DNA Translation"],
      "correctAnswer": "DNA Profiling (Fingerprinting)",
      "difficulty": "easy",
      "explanation": "DNA profiling looks at specific regions (like STRs or VNTRs) that vary significantly between individuals."
    },
    {
      "question": "What are 'VNTRs' or 'STRs' used for in DNA profiling?",
      "options": [
        "They code for eye color",
        "They are non-coding sequences that vary in length between individuals",
        "They are enzymes used to cut DNA",
        "They are the primers used in PCR"
      ],
      "correctAnswer": "They are non-coding sequences that vary in length between individuals",
      "difficulty": "hard",
      "explanation": "Variable Number Tandem Repeats (VNTRs) and Short Tandem Repeats (STRs) provide the high variability needed to distinguish people."
    },
    {
      "question": "Which method is commonly used to amplify tiny amounts of DNA found at a crime scene before analysis?",
      "options": ["Gel Electrophoresis", "PCR (Polymerase Chain Reaction)", "Grafting", "Microarray"],
      "correctAnswer": "PCR (Polymerase Chain Reaction)",
      "difficulty": "easy",
      "explanation": "PCR can take a single hair follicle or a tiny drop of blood and create millions of copies of the DNA for testing."
    },
    {
      "question": "Genetic screening is defined as:",
      "options": [
        "Treating a genetic disease",
        "Testing a population or individual to detect the presence of alleles for a specific genetic disorder",
        "Changing the DNA of a fetus",
        "Cleaning DNA samples"
      ],
      "correctAnswer": "Testing a population or individual to detect the presence of alleles for a specific genetic disorder",
      "difficulty": "moderate",
      "explanation": "Screening helps in identifying carriers of conditions like cystic fibrosis or Huntington's disease."
    },
    {
      "question": "What is the specific goal of 'Golden Rice'?",
      "options": [
        "To make rice grow in salt water",
        "To increase the protein content of rice",
        "To provide a source of Vitamin A (Beta-carotene) to prevent blindness",
        "To make rice resistant to pests"
      ],
      "correctAnswer": "To provide a source of Vitamin A (Beta-carotene) to prevent blindness",
      "difficulty": "moderate",
      "explanation": "Golden rice was engineered with genes from daffodils and bacteria to synthesize beta-carotene, a precursor to Vitamin A."
    },
    {
      "question": "Bt crops (like Bt cotton or Bt corn) are genetically engineered to be:",
      "options": ["Resistant to drought", "Resistant to specific insect pests", "Resistant to herbicides", "Larger in size"],
      "correctAnswer": "Resistant to specific insect pests",
      "difficulty": "moderate",
      "explanation": "Bt crops contain a gene from the bacterium Bacillus thuringiensis that produces a toxin lethal to certain insects but safe for humans."
    },
    {
      "question": "What is an 'HT' crop (Herbicide Tolerant)?",
      "options": [
        "A crop that produces its own weed killer",
        "A crop engineered to survive being sprayed with broad-spectrum herbicides like glyphosate",
        "A crop that grows without water",
        "A crop that kills all insects"
      ],
      "correctAnswer": "A crop engineered to survive being sprayed with broad-spectrum herbicides like glyphosate",
      "difficulty": "moderate",
      "explanation": "HT crops allow farmers to spray entire fields with herbicide to kill weeds without damaging the crop itself."
    },
    {
      "question": "Which of the following is an example of genetic engineering in livestock?",
      "options": [
        "Selective breeding of cows for more milk",
        "Production of human antithrombin in the milk of transgenic goats",
        "Giving chickens better feed",
        "Vaccinating sheep against flu"
      ],
      "correctAnswer": "Production of human antithrombin in the milk of transgenic goats",
      "difficulty": "moderate",
      "explanation": "This is called 'pharming'—using transgenic animals as living factories for pharmaceutical products."
    },
    {
      "question": "What is a major social/ethical concern regarding the use of GMOs in agriculture?",
      "options": [
        "They might taste better",
        "Potential for cross-pollination with wild relatives leading to 'superweeds'",
        "Increased crop yields",
        "Lower food prices"
      ],
      "correctAnswer": "Potential for cross-pollination with wild relatives leading to 'superweeds'",
      "difficulty": "moderate",
      "explanation": "The environmental risk of genes escaping into the wild population is a significant point of debate."
    },
    {
      "question": "In the context of bioinformatics, what is 'Sequence Alignment'?",
      "options": [
        "Arranging DNA samples in a box",
        "Comparing two or more DNA or protein sequences to find similarities and evolutionary relationships",
        "Cutting DNA at the same spot",
        "The way DNA coils in the nucleus"
      ],
      "correctAnswer": "Comparing two or more DNA or protein sequences to find similarities and evolutionary relationships",
      "difficulty": "hard",
      "explanation": "Alignment algorithms help identify conserved regions that may indicate important functional domains."
    },
    {
      "question": "The 'Human Genome Project' was significant because it:",
      "options": [
        "Created the first human clone",
        "Mapped the entire sequence of base pairs in human DNA",
        "Eliminated all genetic diseases",
        "Discovered that humans have 1 million genes"
      ],
      "correctAnswer": "Mapped the entire sequence of base pairs in human DNA",
      "difficulty": "easy",
      "explanation": "The HGP provided a reference map that allows researchers to locate genes and understand their functions."
    },
    {
      "question": "SCID (Severe Combined Immunodeficiency) was one of the first diseases treated with gene therapy. What was the goal?",
      "options": [
        "To give the patient a new heart",
        "To introduce a functional ADA gene into the patient's T-cells",
        "To kill the patient's bacteria",
        "To change the patient's blood type"
      ],
      "correctAnswer": "To introduce a functional ADA gene into the patient's T-cells",
      "difficulty": "hard",
      "explanation": "Patients with SCID lack the enzyme adenosine deaminase (ADA), which is crucial for immune function."
    },
    {
      "question": "Which of the following is a potential risk of gene therapy using viral vectors?",
      "options": [
        "The virus might cause an immune response or insert the gene into the wrong place",
        "The patient might turn into a virus",
        "The DNA will disappear after one day",
        "The treatment is too cheap"
      ],
      "correctAnswer": "The virus might cause an immune response or insert the gene into the wrong place",
      "difficulty": "hard",
      "explanation": "Inserting a gene into the wrong location (insertional mutagenesis) can potentially trigger cancer by activating oncogenes."
    },
    {
      "question": "The use of DNA technology to determine the biological father of a child is known as:",
      "options": ["Forensic pathology", "Paternity testing", "Genetic counseling", "Pedigree analysis"],
      "correctAnswer": "Paternity testing",
      "difficulty": "easy",
      "explanation": "Because a child inherits half their DNA from each parent, their DNA profile must contain bands that match both the mother and the father."
    },
    {
      "question": "What is 'Biopiracy'?",
      "options": [
        "Stealing a boat with plants on it",
        "The commercial exploitation of biological materials or knowledge from indigenous communities without permission or compensation",
        "Using computers to hack biological databases",
        "Illegal fishing"
      ],
      "correctAnswer": "The commercial exploitation of biological materials or knowledge from indigenous communities without permission or compensation",
      "difficulty": "moderate",
      "explanation": "This is a major ethical issue in gene technology involving patents on natural resources from developing nations."
    },
    {
      "question": "Which of these is a benefit of GM crops for the environment?",
      "options": [
        "Increased reliance on chemical pesticides",
        "Reduced need for tilling (plowing), which reduces soil erosion",
        "Lowering the number of insects in the world",
        "Making plants grow in the dark"
      ],
      "correctAnswer": "Reduced need for tilling (plowing), which reduces soil erosion",
      "difficulty": "moderate",
      "explanation": "Herbicide-tolerant crops allow 'no-till' farming, as weeds can be controlled with sprays rather than mechanical plowing."
    },
    {
      "question": "What is 'Somatic' gene therapy?",
      "options": [
        "Changing genes in the egg or sperm cells",
        "Changing genes in body cells (e.g., lungs, liver) so the change is NOT passed to offspring",
        "Treating a whole population at once",
        "Using robotic surgery"
      ],
      "correctAnswer": "Changing genes in body cells (e.g., lungs, liver) so the change is NOT passed to offspring",
      "difficulty": "moderate",
      "explanation": "Somatic therapy affects only the individual treated, whereas germ-line therapy affects future generations."
    },
    {
      "question": "Germ-line gene therapy is widely considered ethically controversial because:",
      "options": [
        "It is too expensive",
        "It involves permanent changes that are passed on to future generations without their consent",
        "It only works on adults",
        "It uses too many bacteria"
      ],
      "correctAnswer": "It involves permanent changes that are passed on to future generations without their consent",
      "difficulty": "hard",
      "explanation": "The long-term effects on the human gene pool are unknown, leading to bans on this practice in many countries."
    },
    {
      "question": "Which enzyme is used in the laboratory to create cDNA from mature mRNA?",
      "options": ["DNA Polymerase", "Restriction Enzyme", "Reverse Transcriptase", "RNA Primase"],
      "correctAnswer": "Reverse Transcriptase",
      "difficulty": "moderate",
      "explanation": "This enzyme is vital for producing genes without introns, which bacteria can then express."
    },
    {
      "question": "In DNA profiling, if 10 different STR markers are used, the probability of two unrelated people having the exact same profile is:",
      "options": ["1 in 10", "1 in 100", "Extremely low (often 1 in billions)", "50%"],
      "correctAnswer": "Extremely low (often 1 in billions)",
      "difficulty": "moderate",
      "explanation": "The more markers used, the higher the statistical power of the DNA evidence."
    },
    {
      "question": "What is the role of a 'Database' in bioinformatics?",
      "options": [
        "To store and organize biological sequences for easy retrieval and analysis",
        "To mix chemicals",
        "To grow bacteria",
        "To capture forensic evidence"
      ],
      "correctAnswer": "To store and organize biological sequences for easy retrieval and analysis",
      "difficulty": "easy",
      "explanation": "Examples include GenBank (DNA) and UniProt (Proteins)."
    },
    {
      "question": "Assertion (A): Recombinant human growth hormone (HGH) is safer than HGH extracted from human cadavers.\nReason (R): Cadaver-derived HGH carried the risk of transmitting Creutzfeldt-Jakob disease.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "Synthetic production eliminates the risk of biological contamination from donor tissue."
    },
    {
      "question": "Which of the following is a concern regarding 'Genetic Discrimination'?",
      "options": [
        "Insurance companies refusing coverage based on a person's genetic predisposition to a disease",
        "Using DNA to solve crimes",
        "Producing more food",
        "Studying evolution"
      ],
      "correctAnswer": "Insurance companies refusing coverage based on a person's genetic predisposition to a disease",
      "difficulty": "moderate",
      "explanation": "Privacy of genetic information is a major social concern as sequencing becomes cheaper."
    },
    {
      "question": "A 'Pro-drug' approach in gene therapy involves:",
      "options": [
        "Giving drugs to professional athletes",
        "Inserting a gene that converts a harmless substance into a toxic one only inside cancer cells",
        "Taking medicine before you get sick",
        "Using bacteria to eat waste"
      ],
      "correctAnswer": "Inserting a gene that converts a harmless substance into a toxic one only inside cancer cells",
      "difficulty": "hard",
      "explanation": "This is a targeted approach to chemotherapy, reducing damage to healthy cells."
    },
    {
      "question": "True or False: Most GMOs currently on the market are designed to improve nutritional value for consumers.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Most current GMOs (like Bt or HT crops) are designed to benefit producers (farmers) by lowering costs or increasing yield, rather than consumers."
    },
    {
      "question": "Which of the following is an example of an 'In Vivo' gene therapy method?",
      "options": [
        "Removing cells, modifying them in a lab, and then returning them to the body",
        "Injecting a viral vector directly into the patient's target organ",
        "Producing insulin in a fermenter",
        "DNA profiling from a crime scene"
      ],
      "correctAnswer": "Injecting a viral vector directly into the patient's target organ",
      "difficulty": "hard",
      "explanation": "In vivo means 'within the living'; the gene transfer happens directly inside the patient."
    },
    {
      "question": "What is 'Ex Vivo' gene therapy?",
      "options": [
        "Treating a patient in a hospital",
        "Modifying cells outside the patient's body and then reintroducing them",
        "Using dead viruses",
        "Treating plants"
      ],
      "correctAnswer": "Modifying cells outside the patient's body and then reintroducing them",
      "difficulty": "moderate",
      "explanation": "This is often done with blood or bone marrow cells."
    },
    {
      "question": "The development of 'AquaAdvantage' Salmon (which grows much faster) is an application of gene technology in:",
      "options": ["Medicine", "Forensics", "Livestock/Aquaculture", "Bioinformatics"],
      "correctAnswer": "Livestock/Aquaculture",
      "difficulty": "easy",
      "explanation": "These salmon contain a growth hormone gene from a different salmon species that is active year-round."
    },
    {
      "question": "In DNA profiling, the fragments of DNA are separated by size using:",
      "options": ["Microarrays", "Gel Electrophoresis", "PCR", "Centrifugation"],
      "correctAnswer": "Gel Electrophoresis",
      "difficulty": "easy",
      "explanation": "The unique pattern of bands produced is the 'fingerprint'."
    },
    {
      "question": "Which of the following describes 'Molecular Pharming'?",
      "options": [
        "Using chemicals to grow plants",
        "Using plants and animals to produce pharmaceutical proteins",
        "Selling medicines in a farm shop",
        "Using DNA to identify plant species"
      ],
      "correctAnswer": "Using plants and animals to produce pharmaceutical proteins",
      "difficulty": "moderate",
      "explanation": "Examples include producing vaccines in tobacco leaves or proteins in goat milk."
    },
    {
      "question": "Identify the error: 'Bioinformatics is used solely for the purpose of creating new GMO crops.'",
      "options": [
        "The error is 'Bioinformatics'",
        "The error is 'solely'",
        "The error is 'GMO crops'",
        "No error"
      ],
      "correctAnswer": "The error is 'solely'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Bioinformatics has a vast range of uses, including evolutionary biology, drug discovery, and medical diagnostics."
    },
    {
      "question": "What is the function of 'Factor IX' produced by recombinant DNA?",
      "options": [
        "Treating Diabetes",
        "Treating Hemophilia B",
        "Treating Cystic Fibrosis",
        "Treating Anemia"
      ],
      "correctAnswer": "Treating Hemophilia B",
      "difficulty": "moderate",
      "explanation": "Factor IX is another clotting factor produced via biotechnology to help patients with specific bleeding disorders."
    },
    {
      "question": "Which of the following is a potential risk to human health from GMOs?",
      "options": [
        "The introduction of new allergens into food",
        "Increased vitamin content",
        "Plants growing too fast",
        "The DNA being too heavy"
      ],
      "correctAnswer": "The introduction of new allergens into food",
      "difficulty": "moderate",
      "explanation": "Scientists must test GM foods to ensure that genes from an allergenic source (like Brazil nuts) don't transfer that allergy to the new crop."
    },
    {
      "question": "In 'Forensic Entomology', DNA technology might be used to:",
      "options": [
        "Identify the species of larvae found on a body to estimate time of death",
        "Make insects larger",
        "Kill the insects",
        "Change the color of the insects"
      ],
      "correctAnswer": "Identify the species of larvae found on a body to estimate time of death",
      "difficulty": "hard",
      "explanation": "Molecular identification of insects can be more accurate than visual identification, especially in early larval stages."
    },
    {
      "question": "Which of the following characterizes 'Phylogenetics' in bioinformatics?",
      "options": [
        "Building evolutionary trees based on DNA/protein sequence comparisons",
        "Changing the DNA of a cell",
        "Measuring the weight of an animal",
        "Counting the number of leaves on a plant"
      ],
      "correctAnswer": "Building evolutionary trees based on DNA/protein sequence comparisons",
      "difficulty": "moderate",
      "explanation": "The degree of similarity in DNA sequences reflects how recently two species shared a common ancestor."
    },
    {
      "question": "What is the 'Liposome' method in gene therapy?",
      "options": [
        "Using a virus to carry a gene",
        "Using a fatty vesicle to carry a gene through the cell membrane",
        "Using a needle to poke the cell",
        "Using electricity"
      ],
      "correctAnswer": "Using a fatty vesicle to carry a gene through the cell membrane",
      "difficulty": "moderate",
      "explanation": "Liposomes are a non-viral delivery system."
    },
    {
      "question": "Cystic Fibrosis gene therapy targets which organ most frequently?",
      "options": ["Liver", "Lungs", "Brain", "Heart"],
      "correctAnswer": "Lungs",
      "difficulty": "easy",
      "explanation": "The CFTR gene is often delivered via an aerosol spray into the lungs to combat the build-up of thick mucus."
    },
    {
      "question": "The use of the 'Ti Plasmid' from Agrobacterium is common for engineering which type of organisms?",
      "options": ["Animals", "Bacteria", "Plants", "Viruses"],
      "correctAnswer": "Plants",
      "difficulty": "easy",
      "explanation": "The Ti plasmid naturally transfers genes into plant genomes, making it an excellent vector for plant biotechnology."
    },
    {
      "question": "What is 'Marker-Assisted Selection' (MAS)?",
      "options": [
        "A way to paint plants",
        "Using genetic markers to speed up traditional breeding of crops or livestock",
        "Inserting genes from fish into tomatoes",
        "Using a highlighter on DNA"
      ],
      "correctAnswer": "Using genetic markers to speed up traditional breeding of crops or livestock",
      "difficulty": "hard",
      "explanation": "MAS identifies individuals with desired traits at the seedling or juvenile stage based on their DNA, rather than waiting for them to grow and show the trait."
    },
    {
      "question": "A person who carries one copy of a recessive disease allele but does not show symptoms is called a:",
      "options": ["Mutant", "Carrier", "Patient", "Transgenic"],
      "correctAnswer": "Carrier",
      "difficulty": "easy",
      "explanation": "Genetic screening is vital for identifying carriers who might pass a disorder to their children."
    },
    {
      "question": "Which of the following is an example of an 'Ethical' dilemma in gene technology?",
      "options": [
        "Should parents be allowed to select the traits of their children ('Designer Babies')?",
        "Should we produce more insulin?",
        "Should we use computers to study DNA?",
        "Should plants grow in soil?"
      ],
      "correctAnswer": "Should parents be allowed to select the traits of their children ('Designer Babies')?",
      "difficulty": "moderate",
      "explanation": "This question touches on the moral limits of human intervention in genetics."
    },
    {
      "question": "The use of DNA to identify victims of a natural disaster is an application in:",
      "options": ["Gene Therapy", "Forensic Science", "Bioinformatics", "Agricultural Science"],
      "correctAnswer": "Forensic Science",
      "difficulty": "easy",
      "explanation": "DNA profiling is a powerful tool for victim identification when other methods (like fingerprints or dental records) are not available."
    },
    {
      "question": "Which human protein is used to treat emphysema caused by a specific genetic deficiency?",
      "options": ["Insulin", "Alpha-1 antitrypsin", "Growth Hormone", "Prolactin"],
      "correctAnswer": "Alpha-1 antitrypsin",
      "difficulty": "hard",
      "explanation": "Alpha-1 antitrypsin (AAT) protects the lungs from damage; it can be produced in the milk of transgenic sheep."
    },
    {
      "question": "A 'Genomic Library' is:",
      "options": [
        "A building full of books about genes",
        "A collection of the total genomic DNA from a single organism, stored in a population of cloning vectors",
        "A list of all scientists",
        "The nucleus of a cell"
      ],
      "correctAnswer": "A collection of the total genomic DNA from a single organism, stored in a population of cloning vectors",
      "difficulty": "hard",
      "explanation": "This library allows researchers to 'browse' for and isolate specific genes of interest."
    },
    {
      "question": "What does 'Functional Genomics' study?",
      "options": [
        "How much a gene weighs",
        "The function and interactions of genes and proteins",
        "How to destroy genes",
        "The color of DNA"
      ],
      "correctAnswer": "The function and interactions of genes and proteins",
      "difficulty": "moderate",
      "explanation": "It goes beyond just sequencing to understand what the genes actually *do* in the organism."
    },
    {
      "question": "Which of the following describes 'Xenotransplantation'?",
      "options": [
        "Transplanting organs from one human to another",
        "Transplanting organs or tissues from one species to another (e.g., pig to human)",
        "Using artificial hearts",
        "Studying aliens"
      ],
      "correctAnswer": "Transplanting organs or tissues from one species to another (e.g., pig to human)",
      "difficulty": "moderate",
      "explanation": "Genetic engineering is used to modify animal organs so they are not rejected by the human immune system."
    },
     {
      "question": "Which of the following is a primary goal of the 'One-Thousand Genomes Project'?",
      "options": [
        "To clone one thousand different species",
        "To find all genetic variations that happen in at least 1% of the human population",
        "To create one thousand new GM crops",
        "To sequence the DNA of one thousand extinct animals"
      ],
      "correctAnswer": "To find all genetic variations that happen in at least 1% of the human population",
      "difficulty": "hard",
      "explanation": "This project aimed to create a detailed catalogue of human genetic variation to help researchers study the link between genetics and disease."
    },
    {
      "question": "In forensic science, what is the significance of the 'CODIS' database?",
      "options": [
        "It stores the genetic codes of all known plants",
        "It is a national DNA database used to match crime scene evidence with known offenders",
        "It is used to track the weather",
        "It stores records of all medical prescriptions"
      ],
      "correctAnswer": "It is a national DNA database used to match crime scene evidence with known offenders",
      "difficulty": "moderate",
      "explanation": "CODIS (Combined DNA Index System) allows forensic laboratories to share and compare DNA profiles electronically."
    },
    {
      "question": "What is 'Proteomics'?",
      "options": [
        "The study of the structure and function of the complete set of proteins produced by a cell or organism",
        "The study of how to eat more protein",
        "The process of making DNA from proteins",
        "The study of ancient bone structures"
      ],
      "correctAnswer": "The study of the structure and function of the complete set of proteins produced by a cell or organism",
      "difficulty": "moderate",
      "explanation": "Proteomics is more complex than genomics because an organism's proteome changes constantly in response to internal and external signals."
    },
    {
      "question": "Why are 'Knockout Mice' useful in genetic research?",
      "options": [
        "They are stronger than normal mice",
        "They have a specific gene disabled, allowing researchers to observe what that gene normally does",
        "They are used to test physical reflexes",
        "They can glow in the dark"
      ],
      "correctAnswer": "They have a specific gene disabled, allowing researchers to observe what that gene normally does",
      "difficulty": "hard",
      "explanation": "By 'knocking out' a gene and seeing what health or physical problems occur, scientists can determine the gene's function."
    },
    {
      "question": "Which of the following describes 'Bioinformatics' in the context of personalized medicine?",
      "options": [
        "Building faster computers for hospitals",
        "Using a patient's genetic profile to tailor medical treatments to their specific needs",
        "Printing medical books faster",
        "Creating a website for a doctor's office"
      ],
      "correctAnswer": "Using a patient's genetic profile to tailor medical treatments to their specific needs",
      "difficulty": "moderate",
      "explanation": "Pharmacogenomics uses bioinformatics to predict how a patient will respond to a drug based on their DNA, reducing trial-and-error in prescribing."
    },
    {
      "question": "What is the function of 'Interferon' produced via recombinant DNA technology?",
      "options": [
        "To help the body fight viral infections and certain cancers",
        "To lower blood sugar",
        "To help the blood clot",
        "To increase height in children"
      ],
      "correctAnswer": "To help the body fight viral infections and certain cancers",
      "difficulty": "moderate",
      "explanation": "Interferons are signaling proteins that 'interfere' with viral replication."
    },
    {
      "question": "In DNA profiling, why is 'Capillary Electrophoresis' often preferred over traditional gel electrophoresis?",
      "options": [
        "It uses more electricity",
        "It is faster, automated, and provides higher resolution for separating STR fragments",
        "It requires much larger DNA samples",
        "It makes the DNA change color"
      ],
      "correctAnswer": "It is faster, automated, and provides higher resolution for separating STR fragments",
      "difficulty": "hard",
      "explanation": "Modern forensic labs use capillary tubes and laser detection to analyze DNA samples with extreme precision."
    },
    {
      "question": "The ethical concept of 'Informed Consent' in genetic testing means:",
      "options": [
        "The doctor makes all the decisions",
        "The patient understands the risks, benefits, and limitations of a test before agreeing to it",
        "The test is done in secret",
        "The patient must pay for the test in advance"
      ],
      "correctAnswer": "The patient understands the risks, benefits, and limitations of a test before agreeing to it",
      "difficulty": "easy",
      "explanation": "Patients must be fully aware of how their genetic data will be used and what the results might imply for them and their families."
    },
    {
      "question": "Which term refers to the insertion of genes into a plant to make it produce a vaccine that can be eaten (e.g., in a banana or potato)?",
      "options": [
        "Edible vaccines",
        "DNA profiling",
        "Gene therapy",
        "Xenotransplantation"
      ],
      "correctAnswer": "Edible vaccines",
      "difficulty": "moderate",
      "explanation": "This technology aims to provide a low-cost, needle-free way to distribute vaccines in developing countries."
    },
    {
      "question": "What is a 'SNP' (Single Nucleotide Polymorphism)?",
      "options": [
        "A type of restriction enzyme",
        "A variation in a single base pair in a DNA sequence among individuals",
        "A large mutation that deletes a whole chromosome",
        "The name of a DNA sequencing machine"
      ],
      "correctAnswer": "A variation in a single base pair in a DNA sequence among individuals",
      "difficulty": "hard",
      "explanation": "SNPs are the most common type of genetic variation and are used as markers to find genes associated with complex diseases."
    }
  ],
  "Unit 15: Variation": [
    {
      "question": "Which of the following best defines biological variation?",
      "options": [
        "The process by which organisms produce offspring",
        "The differences that exist between individuals of the same species",
        "The movement of organisms from one habitat to another",
        "The ability of an organism to survive in its environment"
      ],
      "correctAnswer": "The differences that exist between individuals of the same species",
      "difficulty": "easy",
      "explanation": "Variation refers to the morphological, physiological, and cytological differences between individuals belonging to the same species."
    },
    {
      "question": "Differences between individuals of different species are known as:",
      "options": ["Intraspecific variation", "Interspecific variation", "Continuous variation", "Discontinuous variation"],
      "correctAnswer": "Interspecific variation",
      "difficulty": "moderate",
      "explanation": "Interspecific variation occurs between different species (e.g., a cat vs. a dog), while intraspecific variation occurs within the same species (e.g., two different cats)."
    },
    {
      "question": "Which type of variation is characterized by distinct categories with no intermediate forms?",
      "options": ["Continuous variation", "Discontinuous variation", "Environmental variation", "Gradual variation"],
      "correctAnswer": "Discontinuous variation",
      "difficulty": "easy",
      "explanation": "Discontinuous variation involves clear-cut differences, such as blood groups or the ability to roll the tongue, usually controlled by one or a few genes."
    },
    {
      "question": "Human height and skin color are examples of:",
      "options": ["Discontinuous variation", "Continuous variation", "Interspecific variation", "Mutation-only variation"],
      "correctAnswer": "Continuous variation",
      "difficulty": "easy",
      "explanation": "Continuous variation shows a range of phenotypes from one extreme to another with many intermediates, often forming a bell-shaped curve."
    },
    {
      "question": "Which of the following is a characteristic of continuous variation?",
      "options": [
        "Controlled by a single gene (monogenic)",
        "Environment has little to no effect on the phenotype",
        "Controlled by many genes (polygenic)",
        "Produces distinct classes like 'Yes' or 'No'"
      ],
      "correctAnswer": "Controlled by many genes (polygenic)",
      "difficulty": "moderate",
      "explanation": "Continuous traits are polygenic and are significantly influenced by environmental factors like nutrition or sunlight."
    },
    {
      "question": "ABO blood groups in humans are an example of:",
      "options": ["Continuous variation", "Discontinuous variation", "Environmental variation", "Acquired variation"],
      "correctAnswer": "Discontinuous variation",
      "difficulty": "easy",
      "explanation": "You are either Type A, B, AB, or O; there is no 'in-between' blood type, making it discontinuous."
    },
    {
      "question": "The 'Normal Distribution Curve' (bell-shaped curve) is associated with which type of variation?",
      "options": ["Discontinuous", "Continuous", "Interspecific", "None of the above"],
      "correctAnswer": "Continuous",
      "difficulty": "moderate",
      "explanation": "For continuous traits, most individuals fall near the average, with fewer individuals at the extremes, creating a bell curve."
    },
    {
      "question": "Which of these is a purely genetic cause of variation?",
      "options": ["Scars on the skin", "Muscle mass from exercise", "Crossing over during meiosis", "Tanning from the sun"],
      "correctAnswer": "Crossing over during meiosis",
      "difficulty": "moderate",
      "explanation": "Crossing over swaps genetic material between homologous chromosomes, creating new combinations of alleles."
    },
    {
      "question": "What happens during 'Independent Assortment' that leads to variation?",
      "options": [
        "Chromosomes break and repair themselves",
        "Random orientation of homologous pairs during Metaphase I",
        "Sperm and egg fuse together",
        "DNA replicates itself"
      ],
      "correctAnswer": "Random orientation of homologous pairs during Metaphase I",
      "difficulty": "hard",
      "explanation": "The way paternal and maternal chromosomes line up is random, meaning a gamete can have any combination of them."
    },
    {
      "question": "A sudden, permanent change in the DNA sequence or chromosome structure is called a:",
      "options": ["Variation", "Selection", "Mutation", "Adaptation"],
      "correctAnswer": "Mutation",
      "difficulty": "easy",
      "explanation": "Mutations are the ultimate source of new alleles in a population."
    },
    {
      "question": "Variation caused by the environment is ______ and cannot be passed to the next generation.",
      "options": ["Heritable", "Non-heritable", "Genetic", "Continuous"],
      "correctAnswer": "Non-heritable",
      "difficulty": "easy",
      "explanation": "Acquired characteristics, like a tan or a scar, do not change the DNA of gametes and therefore are not inherited."
    },
    {
      "question": "Which of the following environmental factors can cause variation in plants?",
      "options": ["Light intensity", "Soil pH", "Availability of water", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Plants of the same genotype can look very different depending on the nutrients and light they receive."
    },
    {
      "question": "The random fusion of gametes during fertilization contributes to variation because:",
      "options": [
        "It increases the number of chromosomes",
        "It ensures that every zygote has a unique combination of alleles from two parents",
        "It prevents mutations",
        "It makes all offspring identical"
      ],
      "correctAnswer": "It ensures that every zygote has a unique combination of alleles from two parents",
      "difficulty": "moderate",
      "explanation": "Which specific sperm fertilizes which specific egg is a matter of chance, adding to genetic diversity."
    },
    {
      "question": "Which of the following traits is NOT influenced by the environment?",
      "options": ["Body mass", "Intelligence", "Fingerprint patterns", "Skin color"],
      "correctAnswer": "Fingerprint patterns",
      "difficulty": "hard",
      "explanation": "While most traits have some environmental component, basic fingerprint patterns are determined genetically and remain constant regardless of the environment."
    },
    {
      "question": "Gene mutations involve a change in:",
      "options": [
        "The number of chromosomes",
        "The nucleotide sequence of a single gene",
        "The entire genome",
        "The shape of the cell"
      ],
      "correctAnswer": "The nucleotide sequence of a single gene",
      "difficulty": "moderate",
      "explanation": "Gene mutations are small-scale changes (like substitutions or deletions) within a specific DNA segment."
    },
    {
      "question": "Down Syndrome is an example of a chromosomal mutation called 'Trisomy 21'. This is an example of:",
      "options": ["Continuous variation", "Discontinuous variation", "Environmental variation", "Interspecific variation"],
      "correctAnswer": "Discontinuous variation",
      "difficulty": "moderate",
      "explanation": "Chromosomal abnormalities result in distinct, non-overlapping phenotypes."
    },
    {
      "question": "In a histogram representing discontinuous variation, the bars should be:",
      "options": ["Touching each other", "Separated by gaps", "Circular", "Connected by a line"],
      "correctAnswer": "Separated by gaps",
      "difficulty": "moderate",
      "explanation": "Because the categories are distinct and there are no intermediates, the bars in a bar chart for discontinuous data are separate."
    },
    {
      "question": "Variation is the raw material for which biological process?",
      "options": ["Respiration", "Evolution by Natural Selection", "Photosynthesis", "Digestion"],
      "correctAnswer": "Evolution by Natural Selection",
      "difficulty": "easy",
      "explanation": "Without variation, there would be no differences for nature to 'select,' and evolution could not occur."
    },
    {
      "question": "Which type of mutation occurs when a piece of one chromosome breaks off and attaches to another non-homologous chromosome?",
      "options": ["Inversion", "Deletion", "Translocation", "Duplication"],
      "correctAnswer": "Translocation",
      "difficulty": "hard",
      "explanation": "Translocation involves the movement of a chromosome segment to a different, non-matching chromosome."
    },
    {
      "question": "Height is a polygenic trait. This means it is controlled by:",
      "options": ["A single allele", "One pair of genes", "Multiple independent genes", "Environmental factors only"],
      "correctAnswer": "Multiple independent genes",
      "difficulty": "moderate",
      "explanation": "Polygenic traits result from the additive effect of two or more genes on a single phenotypic character."
    },
    {
      "question": "Assertion (A): Identical twins may have different body weights.\nReason (R): Continuous variation is influenced by environmental factors like diet and exercise.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "moderate",
      "type": "assertionReason",
      "explanation": "Even though identical twins have the same genotype, their environment (diet/exercise) can lead to phenotypic differences in continuous traits."
    },
    {
      "question": "Which of the following increases the rate of mutations?",
      "options": ["Drinking water", "Mutagens (e.g., X-rays, UV light, certain chemicals)", "Normal cell division", "Sleeping"],
      "correctAnswer": "Mutagens (e.g., X-rays, UV light, certain chemicals)",
      "difficulty": "easy",
      "explanation": "Mutagens are physical or chemical agents that damage DNA and increase the frequency of mutations."
    },
    {
      "question": "The differences in the shape of beaks among Finches on the Galapagos Islands is an example of:",
      "options": ["Intraspecific variation", "Interspecific variation", "No variation", "Environmental variation only"],
      "correctAnswer": "Interspecific variation",
      "difficulty": "moderate",
      "explanation": "Darwin's finches are different species with specialized beaks adapted to different food sources."
    },
    {
      "question": "Which process during meiosis results in 'recombinant' chromosomes?",
      "options": ["DNA replication", "Crossing over", "Cytokinesis", "Spindle formation"],
      "correctAnswer": "Crossing over",
      "difficulty": "moderate",
      "explanation": "Crossing over results in new combinations of paternal and maternal genes on the same chromosome."
    },
    {
      "question": "Sickle cell anemia is caused by a ______ mutation.",
      "options": ["Gene (Point)", "Chromosomal", "Environmental", "Somatic"],
      "correctAnswer": "Gene (Point)",
      "difficulty": "hard",
      "explanation": "A single base change (substitution) in the hemoglobin gene leads to the production of abnormal hemoglobin S."
    },
    {
      "question": "True or False: Discontinuous variation is mostly qualitative, while continuous variation is mostly quantitative.",
      "options": ["True", "False"],
      "correctAnswer": "True",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Discontinuous traits describe 'what type' (qualitative), while continuous traits describe 'how much' (quantitative/measurable)."
    },
    {
      "question": "A person with the 'ability' to roll their tongue marries a 'non-roller'. This trait is an example of:",
      "options": ["Continuous variation", "Discontinuous variation", "Polygenic inheritance", "Environmental adaptation"],
      "correctAnswer": "Discontinuous variation",
      "difficulty": "easy",
      "explanation": "Tongue rolling is a classic example of a trait governed by simple Mendelian genetics with two distinct phenotypes."
    },
    {
      "question": "Which of the following is NOT a source of genetic variation?",
      "options": ["Mitosis", "Meiosis", "Mutation", "Fertilization"],
      "correctAnswer": "Mitosis",
      "difficulty": "moderate",
      "explanation": "Mitosis produces genetically identical cells. Variation is introduced through meiosis, mutation, and fertilization."
    },
    {
      "question": "In plants, 'Etiolation' (being pale and weak due to lack of light) is an example of ______ variation.",
      "options": ["Genetic", "Environmental", "Heritable", "Discontinuous"],
      "correctAnswer": "Environmental",
      "difficulty": "moderate",
      "explanation": "Etiolation is a physiological response to the lack of light and is not an inherited genetic trait."
    },
    {
      "question": "What is the primary difference between a 'Germ-line' mutation and a 'Somatic' mutation?",
      "options": [
        "Somatic mutations are inherited; Germ-line are not",
        "Germ-line mutations occur in gametes and can be passed to offspring; Somatic occur in body cells and cannot",
        "Somatic mutations are always helpful",
        "There is no difference"
      ],
      "correctAnswer": "Germ-line mutations occur in gametes and can be passed to offspring; Somatic occur in body cells and cannot",
      "difficulty": "hard",
      "explanation": "Only mutations in the cells that produce eggs or sperm contribute to the genetic variation of the next generation."
    },
    {
      "question": "Which of these traits would show a wide range of measurements in a population of 100 students?",
      "options": ["Blood group", "Sex", "Hand span", "Presence of dimples"],
      "correctAnswer": "Hand span",
      "difficulty": "easy",
      "explanation": "Hand span is a continuous trait that can be measured on a scale, showing many intermediate values."
    },
    {
      "question": "An organism with an extra set of chromosomes (e.g., 3n or 4n) is called:",
      "options": ["Aneuploid", "Polyploid", "Haploid", "Diploid"],
      "correctAnswer": "Polyploid",
      "difficulty": "hard",
      "explanation": "Polyploidy is common in plants and results in larger flowers or fruits; it is a type of chromosomal variation."
    },
    {
      "question": "Identify the error: 'Continuous variation is represented by a bar chart where the bars do not touch.'",
      "options": [
        "The error is 'Continuous variation'",
        "The error is 'bar chart'",
        "The error is 'do not touch'",
        "There is no error"
      ],
      "correctAnswer": "The error is 'do not touch'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Continuous variation is represented by a histogram where bars *do* touch, or by a line graph/frequency polygon, because the data is on a continuous scale."
    },
    {
      "question": "Variation within a population helps a species survive because:",
      "options": [
        "It makes everyone look the same",
        "It ensures that some individuals may have traits that allow them to survive environmental changes",
        "It prevents predators from seeing them",
        "It stops evolution"
      ],
      "correctAnswer": "It ensures that some individuals may have traits that allow them to survive environmental changes",
      "difficulty": "easy",
      "explanation": "Genetic diversity is a 'safety net' for a species in a changing world."
    },
    {
      "question": "Which of the following is an example of 'Morphological' variation?",
      "options": ["Differences in heart rate", "Differences in the shape of leaves", "Differences in enzyme activity", "Differences in DNA sequence"],
      "correctAnswer": "Differences in the shape of leaves",
      "difficulty": "moderate",
      "explanation": "Morphological variation refers to physical form and structure."
    },
    {
      "question": "Variation in the 'amount of melanin' in human skin is primarily:",
      "options": ["Discontinuous", "Continuous", "Environmental only", "Genetic only"],
      "correctAnswer": "Continuous",
      "difficulty": "moderate",
      "explanation": "Skin color is polygenic and shows a continuous spectrum from very light to very dark."
    },
    {
      "question": "A 'Point Mutation' involves:",
      "options": [
        "Loss of a whole chromosome",
        "A change in a single base pair of DNA",
        "The movement of a gene to a different chromosome",
        "The doubling of the genome"
      ],
      "correctAnswer": "A change in a single base pair of DNA",
      "difficulty": "moderate",
      "explanation": "Point mutations (substitutions, insertions, or deletions of one nucleotide) affect only one 'point' in the DNA."
    },
    {
      "question": "Which of the following is a 'Physiological' variation?",
      "options": ["Eye color", "Height", "Ability to digest lactose", "Hair texture"],
      "correctAnswer": "Ability to digest lactose",
      "difficulty": "hard",
      "explanation": "Physiological variation refers to differences in internal chemical processes or functions."
    },
    {
      "question": "The total of all the alleles of all the genes in a population is called the:",
      "options": ["Genotype", "Phenotype", "Gene pool", "Genome"],
      "correctAnswer": "Gene pool",
      "difficulty": "moderate",
      "explanation": "The gene pool represents the genetic diversity available within a breeding population."
    },
    {
      "question": "In 'Natural Selection', which individuals are most likely to survive and reproduce?",
      "options": [
        "Those with the most mutations",
        "Those whose variations are best suited to the current environment",
        "Those that are the largest",
        "Those that are the fastest"
      ],
      "correctAnswer": "Those whose variations are best suited to the current environment",
      "difficulty": "easy",
      "explanation": "Fitness is defined by how well an organism's traits match its environment's demands."
    },
    {
      "question": "Crossing over occurs during which phase of meiosis?",
      "options": ["Prophase I", "Metaphase II", "Anaphase I", "Telophase II"],
      "correctAnswer": "Prophase I",
      "difficulty": "moderate",
      "explanation": "Homologous chromosomes pair up and exchange segments during the first prophase of meiosis."
    }
  ],
  "Unit 16: Natural and Artificial Selection": [
    {
      "question": "Which of the following best describes 'Natural Selection'?",
      "options": [
        "The process by which humans breed animals for specific traits",
        "The differential survival and reproduction of individuals due to phenotype differences",
        "A random change in the DNA sequence of an organism",
        "The movement of genes from one population to another"
      ],
      "correctAnswer": "The differential survival and reproduction of individuals due to phenotype differences",
      "difficulty": "easy",
      "explanation": "Natural selection is the mechanism proposed by Charles Darwin where organisms better adapted to their environment tend to survive and produce more offspring."
    },
    {
      "question": "In natural selection, the term 'Fitness' refers to:",
      "options": [
        "The physical strength of an individual",
        "The speed at which an animal can run",
        "The ability of an individual to survive and contribute its genes to the next generation",
        "The lifespan of an organism"
      ],
      "correctAnswer": "The ability of an individual to survive and contribute its genes to the next generation",
      "difficulty": "moderate",
      "explanation": "Biological fitness is measured by reproductive success; if an organism survives but fails to reproduce, its fitness is effectively zero."
    },
    {
      "question": "Which type of natural selection favors individuals at one extreme of the phenotypic range?",
      "options": ["Stabilizing selection", "Directional selection", "Disruptive selection", "Artificial selection"],
      "correctAnswer": "Directional selection",
      "difficulty": "moderate",
      "explanation": "Directional selection occurs when environmental changes favor a particular extreme phenotype, causing the population mean to shift in that direction."
    },
    {
      "question": "Stabilizing selection acts against ______ and favors ______.",
      "options": [
        "Both extremes; Intermediate phenotypes",
        "Intermediate phenotypes; Both extremes",
        "One extreme; The opposite extreme",
        "New mutations; Old alleles"
      ],
      "correctAnswer": "Both extremes; Intermediate phenotypes",
      "difficulty": "moderate",
      "explanation": "Stabilizing selection reduces variation by favoring the average or intermediate individuals, such as human birth weight."
    },
    {
      "question": "Disruptive selection (diversifying selection) is most likely to lead to:",
      "options": [
        "A uniform population",
        "The extinction of the species",
        "Speciation, by favoring both phenotypic extremes",
        "The loss of all dominant alleles"
      ],
      "correctAnswer": "Speciation, by favoring both phenotypic extremes",
      "difficulty": "hard",
      "explanation": "By favoring the extremes over the intermediates, disruptive selection can eventually split a population into two distinct groups."
    },
    {
      "question": "The primary difference between Natural Selection and Artificial Selection is:",
      "options": [
        "Natural selection is faster",
        "Artificial selection is directed by human choice rather than environmental pressure",
        "Natural selection only occurs in plants",
        "Artificial selection does not involve genetics"
      ],
      "correctAnswer": "Artificial selection is directed by human choice rather than environmental pressure",
      "difficulty": "easy",
      "explanation": "In artificial selection (selective breeding), humans select individuals with desirable traits to breed."
    },
    {
      "question": "Which of the following is an example of artificial selection?",
      "options": [
        "Development of antibiotic resistance in bacteria",
        "Development of different breeds of dogs from wolves",
        "The camouflaged wings of a peppered moth",
        "Long necks of giraffes"
      ],
      "correctAnswer": "Development of different breeds of dogs from wolves",
      "difficulty": "easy",
      "explanation": "Humans selectively bred wolves/dogs over thousands of years to produce varieties like Chihuahuas and Great Danes."
    },
    {
      "question": "A disadvantage of intensive artificial selection is:",
      "options": [
        "Increased genetic diversity",
        "Higher resistance to disease",
        "Inbreeding depression and loss of genetic variation",
        "Faster adaptation to wild environments"
      ],
      "correctAnswer": "Inbreeding depression and loss of genetic variation",
      "difficulty": "moderate",
      "explanation": "Selective breeding often reduces the gene pool, making populations more susceptible to genetic disorders and environmental changes."
    },
    {
      "question": "The total number of alleles for a specific gene in a population is called the:",
      "options": ["Gene frequency", "Gene pool", "Genotype", "Genome"],
      "correctAnswer": "Gene pool",
      "difficulty": "easy",
      "explanation": "The gene pool represents all the genetic information within a breeding population."
    },
    {
      "question": "What is 'Allele Frequency'?",
      "options": [
        "The total number of mutations in a cell",
        "The proportion of a specific allele relative to all alleles for that gene in a population",
        "How often a gene expresses itself in an individual",
        "The rate at which DNA replicates"
      ],
      "correctAnswer": "The proportion of a specific allele relative to all alleles for that gene in a population",
      "difficulty": "moderate",
      "explanation": "Allele frequency is expressed as a fraction or percentage (e.g., the frequency of allele 'A' is 0.6)."
    },
    {
      "question": "Which of the following can cause a change in allele frequencies over time?",
      "options": ["Genetic Drift", "Gene Flow", "Mutation", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "easy",
      "explanation": "Allele frequencies change due to natural selection, mutation, gene flow (migration), and genetic drift."
    },
    {
      "question": "Genetic drift has the most significant impact on which type of population?",
      "options": ["Large populations", "Small populations", "Populations with high gene flow", "Marine populations"],
      "correctAnswer": "Small populations",
      "difficulty": "moderate",
      "explanation": "In small populations, random chance events can cause large fluctuations in allele frequencies, potentially leading to the loss of alleles."
    },
    {
      "question": "The 'Founder Effect' is a type of genetic drift that occurs when:",
      "options": [
        "A large population migrates to a new continent",
        "A small group of individuals starts a new population in a new area",
        "A population is almost wiped out by a disaster",
        "Two species interbreed"
      ],
      "correctAnswer": "A small group of individuals starts a new population in a new area",
      "difficulty": "moderate",
      "explanation": "The new population's gene pool is limited to the alleles present in the few founding individuals."
    },
    {
      "question": "What is the 'Bottleneck Effect'?",
      "options": [
        "A sharp reduction in population size due to environmental events",
        "The process of pouring DNA into a test tube",
        "Selection for larger body size",
        "The movement of genes between species"
      ],
      "correctAnswer": "A sharp reduction in population size due to environmental events",
      "difficulty": "moderate",
      "explanation": "A disaster reduces the population size, and the surviving gene pool may not represent the original population's diversity."
    },
    {
      "question": "The Hardy-Weinberg principle states that allele frequencies in a population will remain constant provided that:",
      "options": [
        "There is no mutation or migration",
        "Mating is random",
        "The population is very large",
        "All of the above"
      ],
      "correctAnswer": "All of the above",
      "difficulty": "moderate",
      "explanation": "The principle describes an idealized state of 'genetic equilibrium' where evolution is not occurring."
    },
    {
      "question": "In the Hardy-Weinberg equation (p² + 2pq + q² = 1), what does 'q²' represent?",
      "options": [
        "Frequency of the dominant allele",
        "Frequency of the heterozygous genotype",
        "Frequency of the homozygous recessive genotype",
        "Frequency of the homozygous dominant genotype"
      ],
      "correctAnswer": "Frequency of the homozygous recessive genotype",
      "difficulty": "moderate",
      "explanation": "q is the frequency of the recessive allele; q² is the frequency of individuals showing the recessive phenotype/genotype."
    },
    {
      "question": "If the frequency of a recessive allele (q) is 0.3, what is the frequency of the dominant allele (p)?",
      "options": ["0.3", "0.7", "0.09", "0.49"],
      "correctAnswer": "0.7",
      "difficulty": "easy",
      "explanation": "p + q = 1. Therefore, 1 - 0.3 = 0.7."
    },
    {
      "question": "In a population of 100 individuals, if 16 show the recessive phenotype (aa), what is the frequency of the recessive allele (q)?",
      "options": ["0.16", "0.4", "0.84", "0.6"],
      "correctAnswer": "0.4",
      "difficulty": "hard",
      "explanation": "q² = 16/100 = 0.16. Taking the square root gives q = 0.4."
    },
    {
      "question": "Using the data from the previous question (q=0.4), what is the frequency of heterozygotes (2pq) in the population?",
      "options": ["0.16", "0.36", "0.48", "0.24"],
      "correctAnswer": "0.48",
      "difficulty": "hard",
      "explanation": "p = 1 - 0.4 = 0.6. 2pq = 2 * (0.6) * (0.4) = 0.48."
    },
    {
      "question": "Non-random mating (sexual selection) leads to a change in:",
      "options": [
        "Only the mutation rate",
        "Genotype frequencies, as individuals choose mates with specific traits",
        "The size of the Earth",
        "Nothing; it has no effect"
      ],
      "correctAnswer": "Genotype frequencies, as individuals choose mates with specific traits",
      "difficulty": "moderate",
      "explanation": "When mates are chosen based on phenotypes (like peacock tails), certain alleles are passed on more frequently than others."
    },
    {
      "question": "Which of the following is NOT an assumption of the Hardy-Weinberg principle?",
      "options": [
        "No natural selection",
        "Random mating",
        "Small population size",
        "No gene flow (migration)"
      ],
      "correctAnswer": "Small population size",
      "difficulty": "moderate",
      "explanation": "Hardy-Weinberg assumes an infinitely large population to prevent genetic drift."
    },
    {
      "question": "The evolution of the Peppered Moth (Biston betularia) from light to dark during the Industrial Revolution is a classic example of:",
      "options": ["Stabilizing selection", "Directional selection", "Disruptive selection", "Artificial selection"],
      "correctAnswer": "Directional selection",
      "difficulty": "moderate",
      "explanation": "The soot-covered trees favored dark moths over light ones, shifting the population towards the dark phenotype."
    },
    {
      "question": "Sickle cell trait (heterozygote advantage) in malaria-prone regions is an example of:",
      "options": ["Directional selection", "Stabilizing selection", "Disruptive selection", "Artificial selection"],
      "correctAnswer": "Stabilizing selection",
      "difficulty": "hard",
      "explanation": "Selection favors the heterozygote (intermediate) because it provides resistance to malaria while avoiding severe sickle cell anemia, keeping both alleles in the population."
    },
    {
      "question": "What is 'Gene Flow'?",
      "options": [
        "The movement of DNA during mitosis",
        "The transfer of alleles from one population to another via migration",
        "The creation of new genes by mutation",
        "The flow of water in a plant"
      ],
      "correctAnswer": "The transfer of alleles from one population to another via migration",
      "difficulty": "easy",
      "explanation": "Gene flow tends to reduce differences between populations and can introduce new alleles into a gene pool."
    },
    {
      "question": "In artificial selection, what determines which individuals will reproduce?",
      "options": ["Predators", "Disease", "Environmental temperature", "Human breeders"],
      "correctAnswer": "Human breeders",
      "difficulty": "easy",
      "explanation": "Humans determine the 'selection pressure' based on utility or aesthetics."
    },
    {
      "question": "Why is genetic variation within a population important for natural selection?",
      "options": [
        "It prevents all individuals from being eaten",
        "It provides the different phenotypes upon which selection can act",
        "It makes the DNA stronger",
        "It allows for faster cloning"
      ],
      "correctAnswer": "It provides the different phenotypes upon which selection can act",
      "difficulty": "moderate",
      "explanation": "Without variation, all individuals would be identical, and no selective advantage could exist."
    },
    {
      "question": "Which of the following describes 'Heterozygous Advantage'?",
      "options": [
        "The dominant phenotype is always better",
        "The recessive phenotype is always better",
        "Individuals with two different alleles have higher fitness than either homozygote",
        "Heterozygotes cannot reproduce"
      ],
      "correctAnswer": "Individuals with two different alleles have higher fitness than either homozygote",
      "difficulty": "moderate",
      "explanation": "This maintains genetic polymorphism in a population."
    },
    {
      "question": "Assertion (A): Antibiotic resistance in bacteria is an example of natural selection.\nReason (R): Bacteria choose to mutate their DNA to survive the antibiotic.",
      "options": [
        "Both A and R are true",
        "A is true but R is false",
        "A is false but R is true",
        "Both A and R are false"
      ],
      "correctAnswer": "A is true but R is false",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "Mutations are random; they do not occur because an organism 'needs' them. The antibiotic kills sensitive bacteria, allowing naturally resistant ones to survive and multiply."
    },
    {
      "question": "What happens to the allele frequency of a lethal recessive allele in a large population?",
      "options": [
        "It is eliminated instantly",
        "It persists at low frequencies in heterozygotes (carriers)",
        "It becomes the most common allele",
        "It turns into a dominant allele"
      ],
      "correctAnswer": "It persists at low frequencies in heterozygotes (carriers)",
      "difficulty": "hard",
      "explanation": "Natural selection cannot easily remove a recessive allele from a population because it is 'hidden' in the heterozygous individuals."
    },
    {
      "question": "The selection of high-milk-yielding cows is an example of:",
      "options": ["Natural selection", "Artificial selection", "Genetic drift", "Mutation"],
      "correctAnswer": "Artificial selection",
      "difficulty": "easy",
      "explanation": "Farmers choose specific cows for breeding to improve the productivity of their herd."
    },
    {
      "question": "Identify the error: 'The Hardy-Weinberg principle applies to small populations undergoing rapid evolution.'",
      "options": [
        "The error is 'Hardy-Weinberg'",
        "The error is 'small populations'",
        "The error is 'rapid evolution'",
        "The error is both 'small populations' and 'rapid evolution'"
      ],
      "correctAnswer": "The error is both 'small populations' and 'rapid evolution'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Hardy-Weinberg only applies to large populations that are NOT evolving (equilibrium)."
    },
    {
      "question": "In a population in Hardy-Weinberg equilibrium, p = 0.8. What is the frequency of the homozygous dominant genotype?",
      "options": ["0.8", "0.64", "0.16", "0.2"],
      "correctAnswer": "0.64",
      "difficulty": "moderate",
      "explanation": "Homozygous dominant frequency = p². (0.8)² = 0.64."
    },
    {
      "question": "What is the result of 'Inbreeding' within a small population?",
      "options": [
        "Increased genetic diversity",
        "Increased frequency of homozygous recessive genetic disorders",
        "Better adaptation to new environments",
        "More mutations"
      ],
      "correctAnswer": "Increased frequency of homozygous recessive genetic disorders",
      "difficulty": "moderate",
      "explanation": "Inbreeding increases homozygosity, which often reveals harmful recessive alleles."
    },
    {
      "question": "Which scientist is most associated with the theory of evolution by natural selection?",
      "options": ["Gregor Mendel", "Charles Darwin", "Robert Hooke", "Louis Pasteur"],
      "correctAnswer": "Charles Darwin",
      "difficulty": "easy",
      "explanation": "Darwin published 'On the Origin of Species' in 1859, detailing the evidence for natural selection."
    },
    {
      "question": "Variation in beak size of finches on different islands is driven by:",
      "options": ["The color of the sky", "The type of food available on each island", "The speed of the wind", "The age of the island"],
      "correctAnswer": "The type of food available on each island",
      "difficulty": "moderate",
      "explanation": "Selection pressure from different diets (seeds vs insects vs nectar) led to the evolution of different beak shapes."
    },
    {
      "question": "True or False: Natural selection acts on the genotype of an individual, not the phenotype.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "moderate",
      "type": "trueFalse",
      "explanation": "Natural selection acts on the *phenotype* (physical traits) of the individual, which determines its survival."
    },
    {
      "question": "If a population is NOT in Hardy-Weinberg equilibrium, what can we conclude?",
      "options": [
        "The population is extinct",
        "The population is evolving",
        "The population is too large",
        "The population is asexual"
      ],
      "correctAnswer": "The population is evolving",
      "difficulty": "moderate",
      "explanation": "Departure from H-W equilibrium means one or more of the evolutionary forces (selection, drift, mutation, etc.) is active."
    },
    {
      "question": "Resistance of pests to pesticides is an example of:",
      "options": ["Stabilizing selection", "Directional selection", "Artificial selection", "Genetic drift"],
      "correctAnswer": "Directional selection",
      "difficulty": "moderate",
      "explanation": "Pesticides act as a selective pressure, favoring individuals with resistance alleles and shifting the population frequency."
    },
    {
      "question": "Which of the following is a result of 'Disruptive Selection'?",
      "options": [
        "A decrease in the average size of seeds",
        "The formation of two distinct sub-populations with different traits",
        "A population where everyone is exactly the same",
        "The removal of all recessive alleles"
      ],
      "correctAnswer": "The formation of two distinct sub-populations with different traits",
      "difficulty": "moderate",
      "explanation": "By selecting for the extremes, the population bifurcates."
    },
    {
      "question": "In the H-W equation, p + q = ?",
      "options": ["0", "1", "0.5", "2"],
      "correctAnswer": "1",
      "difficulty": "easy",
      "explanation": "The sum of the frequencies of all alleles for a single gene must equal 100% (1)."
    },
    {
      "question": "What is 'Mutation Pressure'?",
      "options": [
        "The physical pressure of DNA in the nucleus",
        "The change in allele frequency due to repeated mutations",
        "The weight of a mutated gene",
        "A type of natural selection"
      ],
      "correctAnswer": "The change in allele frequency due to repeated mutations",
      "difficulty": "hard",
      "explanation": "While mutations are the source of variation, the rate is usually too low to significantly change allele frequencies on its own without selection or drift."
    },
    {
      "question": "A population of flowers has 64% red flowers (RR or Rr) and 36% white flowers (rr). What is 'q'?",
      "options": ["0.36", "0.6", "0.4", "0.64"],
      "correctAnswer": "0.6",
      "difficulty": "hard",
      "explanation": "q² = 0.36. Square root of 0.36 is 0.6."
    },
    {
      "question": "In the previous flower population (q=0.6, p=0.4), what percentage are heterozygous (Rr)?",
      "options": ["48%", "24%", "16%", "40%"],
      "correctAnswer": "48%",
      "difficulty": "hard",
      "explanation": "2pq = 2 * (0.4) * (0.6) = 0.48, which is 48%."
    },
    {
      "question": "Which of these is most likely to lead to an 'Evolutionary Dead End'?",
      "options": ["High genetic variation", "Intense artificial selection and inbreeding", "Migration between populations", "Large population size"],
      "correctAnswer": "Intense artificial selection and inbreeding",
      "difficulty": "moderate",
      "explanation": "Reduced variation limits the ability of the population to adapt to future environmental changes."
    },
    {
      "question": "The 'Survival of the Fittest' refers to:",
      "options": [
        "The biggest and strongest winning fights",
        "Those best adapted to their environment surviving and reproducing",
        "Those that live the longest",
        "The smartest individuals"
      ],
      "correctAnswer": "Those best adapted to their environment surviving and reproducing",
      "difficulty": "easy",
      "explanation": "It's about reproductive success in a specific context."
    },
    {
      "question": "Artificial selection for a single trait often results in:",
      "options": [
        "Improvement of all other traits",
        "Unintended correlated changes in other traits",
        "No change at all",
        "A decrease in the mutation rate"
      ],
      "correctAnswer": "Unintended correlated changes in other traits",
      "difficulty": "hard",
      "explanation": "Because genes are often linked or affect multiple traits (pleiotropy), selecting for one trait (like large fruit) might accidentally select for another (like low disease resistance)."
    }
  ],
    "Unit 17: Evolution and Speciation": [
    {
      "question": "Which theory of evolution suggests that acquired characteristics, such as stretched necks in giraffes, can be passed to offspring?",
      "options": ["Darwinism", "Lamarckism", "Mendelian Genetics", "The Modern Synthesis"],
      "correctAnswer": "Lamarckism",
      "difficulty": "easy",
      "explanation": "Jean-Baptiste Lamarck proposed the theory of 'Inheritance of Acquired Characteristics,' which was later largely discredited by Darwin's theory of natural selection."
    },
    {
      "question": "What is the primary mechanism of evolution proposed by Charles Darwin?",
      "options": ["Genetic engineering", "Natural selection", "Use and disuse", "Catastrophism"],
      "correctAnswer": "Natural selection",
      "difficulty": "easy",
      "explanation": "Darwin's theory centers on the idea that individuals with traits better suited to their environment are more likely to survive and reproduce."
    },
    {
      "question": "Homologous structures, such as the pentadactyl limb in humans and whales, provide evidence for:",
      "options": ["Convergent evolution", "Common ancestry", "Analogous development", "Spontaneous generation"],
      "correctAnswer": "Common ancestry",
      "difficulty": "moderate",
      "explanation": "Homologous structures have the same basic anatomical plan but may serve different functions, indicating they evolved from a common ancestor."
    },
    {
      "question": "Which of the following is an example of an 'analogous structure'?",
      "options": [
        "The wing of a bat and the flipper of a whale",
        "The wing of a bird and the wing of a butterfly",
        "The leg of a horse and the arm of a human",
        "The scales of a fish and the hair of a mammal"
      ],
      "correctAnswer": "The wing of a bird and the wing of a butterfly",
      "difficulty": "moderate",
      "explanation": "Analogous structures perform similar functions but have different evolutionary origins and internal structures."
    },
    {
      "question": "The study of the geographical distribution of organisms is known as:",
      "options": ["Biogeography", "Paleontology", "Comparative anatomy", "Molecular biology"],
      "correctAnswer": "Biogeography",
      "difficulty": "easy",
      "explanation": "Biogeography examines why certain species are found in specific locations, often reflecting evolutionary history and continental drift."
    },
    {
      "question": "Vestigial structures are best described as:",
      "options": [
        "New structures evolving for future use",
        "Structures that have lost their original function over evolutionary time",
        "The most complex organs in the body",
        "Structures found only in embryos"
      ],
      "correctAnswer": "Structures that have lost their original function over evolutionary time",
      "difficulty": "moderate",
      "explanation": "Examples include the human appendix or the pelvic bones in whales, which are remnants of ancestors."
    },
    {
      "question": "Which molecular evidence is most commonly used to determine the evolutionary distance between two species?",
      "options": ["Blood type", "DNA and amino acid sequence similarity", "Bone density", "The number of cells"],
      "correctAnswer": "DNA and amino acid sequence similarity",
      "difficulty": "moderate",
      "explanation": "The more similar the DNA or protein sequences, the more recently the two species shared a common ancestor."
    },
    {
      "question": "What defines a 'species' according to the biological species concept?",
      "options": [
        "Organisms that look exactly alike",
        "Organisms that live in the same habitat",
        "A group of organisms that can interbreed and produce fertile offspring",
        "A group of organisms with identical DNA"
      ],
      "correctAnswer": "A group of organisms that can interbreed and produce fertile offspring",
      "difficulty": "easy",
      "explanation": "The ability to produce fertile offspring ensures gene flow within the species and genetic isolation from others."
    },
    {
      "question": "Speciation that occurs when a population is divided by a physical barrier like a mountain range or ocean is called:",
      "options": ["Sympatric speciation", "Allopatric speciation", "Directional speciation", "Artificial speciation"],
      "correctAnswer": "Allopatric speciation",
      "difficulty": "moderate",
      "explanation": "Geographic isolation prevents gene flow, allowing the two populations to evolve independently until they can no longer interbreed."
    },
    {
      "question": "Sympatric speciation occurs ______ geographic isolation.",
      "options": ["With", "Without", "After", "Only during"],
      "correctAnswer": "Without",
      "difficulty": "moderate",
      "explanation": "Sympatric speciation happens in the same geographic area, often due to polyploidy (especially in plants) or behavioral changes."
    },
    {
      "question": "Which of the following is a pre-zygotic isolating mechanism?",
      "options": ["Hybrid sterility", "Temporal isolation (different breeding seasons)", "Hybrid inviability", "Hybrid breakdown"],
      "correctAnswer": "Temporal isolation (different breeding seasons)",
      "difficulty": "hard",
      "explanation": "Pre-zygotic mechanisms prevent fertilization from occurring in the first place."
    },
    {
      "question": "Mules are the offspring of a horse and a donkey but are sterile. This is an example of:",
      "options": ["Pre-zygotic isolation", "Behavioral isolation", "Post-zygotic isolation", "Geographic isolation"],
      "correctAnswer": "Post-zygotic isolation",
      "difficulty": "moderate",
      "explanation": "Hybrid sterility is a post-zygotic barrier because it occurs after a zygote has successfully formed."
    },
    {
      "question": "Divergent evolution leads to the formation of ______ structures.",
      "options": ["Analogous", "Homologous", "Vestigial", "Synthetic"],
      "correctAnswer": "Homologous",
      "difficulty": "moderate",
      "explanation": "Divergent evolution occurs when related species adapt to different environments, resulting in homologous structures."
    },
    {
      "question": "Convergent evolution is responsible for the similarity between:",
      "options": [
        "Sharks (fish) and Dolphins (mammals)",
        "Humans and Chimpanzees",
        "Cats and Lions",
        "Horses and Zebras"
      ],
      "correctAnswer": "Sharks (fish) and Dolphins (mammals)",
      "difficulty": "moderate",
      "explanation": "Unrelated organisms evolve similar traits because they occupy similar niches and face similar selective pressures."
    },
    {
      "question": "What is 'Adaptive Radiation'?",
      "options": [
        "The process of DNA becoming radioactive",
        "The rapid evolution of many diverse species from a single common ancestor",
        "The extinction of a species due to heat",
        "The movement of a population to a desert"
      ],
      "correctAnswer": "The rapid evolution of many diverse species from a single common ancestor",
      "difficulty": "hard",
      "explanation": "A classic example is Darwin's finches, which radiated into many species to fill different niches on the Galapagos Islands."
    },
    {
      "question": "The permanent loss of an entire species from Earth is known as:",
      "options": ["Speciation", "Extinction", "Genetic Drift", "Bottleneck"],
      "correctAnswer": "Extinction",
      "difficulty": "easy",
      "explanation": "Extinction occurs when the death rate of a species exceeds the birth rate over a significant period."
    },
    {
      "question": "Which of the following is a 'Mass Extinction'?",
      "options": [
        "The death of a single colony of bees",
        "A sharp decrease in the diversity and abundance of life forms globally in a short geological time",
        "The seasonal migration of birds",
        "The hunting of a specific species by humans"
      ],
      "correctAnswer": "A sharp decrease in the diversity and abundance of life forms globally in a short geological time",
      "difficulty": "moderate",
      "explanation": "Earth has experienced five major mass extinctions, such as the one that wiped out the dinosaurs."
    },
    {
      "question": "Which type of evolution is also known as 'parallel evolution' when it occurs in unrelated lineages in similar environments?",
      "options": ["Divergent", "Convergent", "Coevolution", "Microevolution"],
      "correctAnswer": "Convergent",
      "difficulty": "moderate",
      "explanation": "Both convergent and parallel evolution result in similar phenotypes in different lineages."
    },
    {
      "question": "The theory of Punctuated Equilibrium suggests that evolution occurs:",
      "options": [
        "Slowly and steadily over millions of years",
        "In rapid bursts of change followed by long periods of stability",
        "Only when humans intervene",
        "Only in the ocean"
      ],
      "correctAnswer": "In rapid bursts of change followed by long periods of stability",
      "difficulty": "hard",
      "explanation": "This contrasts with 'phyletic gradualism' and suggests that the fossil record's gaps are real reflections of evolutionary history."
    },
    {
      "question": "Selection that favors the 'status quo' and keeps a population stable is:",
      "options": ["Directional selection", "Stabilizing selection", "Disruptive selection", "Artificial selection"],
      "correctAnswer": "Stabilizing selection",
      "difficulty": "moderate",
      "explanation": "Stabilizing selection eliminates extremes and reduces variation, often occurring in stable environments."
    },
    {
      "question": "Which of the following is a biotic cause of extinction?",
      "options": ["Volcanic eruptions", "Meteorite impact", "Competition with a more successful species", "Climate change"],
      "correctAnswer": "Competition with a more successful species",
      "difficulty": "moderate",
      "explanation": "Biotic causes involve interactions between living organisms, such as predation, disease, or competition."
    },
    {
      "question": "Polyploidy is a common mechanism of sympatric speciation in which group of organisms?",
      "options": ["Mammals", "Birds", "Plants", "Reptiles"],
      "correctAnswer": "Plants",
      "difficulty": "hard",
      "explanation": "Plants can often survive having extra sets of chromosomes, which instantly reproductively isolates them from their parents."
    },
    {
      "question": "Fossil evidence allows scientists to determine:",
      "options": [
        "The exact date an organism was born",
        "The sequence in which different groups of organisms evolved",
        "The color of a dinosaur's eyes",
        "How a plant felt about its environment"
      ],
      "correctAnswer": "The sequence in which different groups of organisms evolved",
      "difficulty": "easy",
      "explanation": "Fossils show a progression from simple to more complex life forms over geological time."
    },
    {
      "question": "The 'Modern Synthesis' of evolutionary theory combines Darwin's natural selection with:",
      "options": ["Ecology", "Mendelian genetics", "Astronomy", "Chemistry"],
      "correctAnswer": "Mendelian genetics",
      "difficulty": "moderate",
      "explanation": "It explains how mutations and genetic recombination provide the variation that natural selection acts upon."
    },
    {
      "question": "Sexual selection is a form of natural selection where:",
      "options": [
        "Survival is the only factor",
        "Individuals with certain inherited characteristics are more likely than others to obtain mates",
        "Asexual reproduction is preferred",
        "Genes are chosen in a lab"
      ],
      "correctAnswer": "Individuals with certain inherited characteristics are more likely than others to obtain mates",
      "difficulty": "moderate",
      "explanation": "This can lead to exaggerated traits like the peacock's tail."
    },
    {
      "question": "What is 'Genetic Drift'?",
      "options": [
        "The flow of genes between populations",
        "Random changes in allele frequencies, especially in small populations",
        "The movement of DNA through the air",
        "A purposeful change in genes"
      ],
      "correctAnswer": "Random changes in allele frequencies, especially in small populations",
      "difficulty": "moderate",
      "explanation": "Genetic drift is a stochastic (random) process, unlike natural selection which is non-random."
    },
    {
      "question": "Which of the following is an example of 'Mechanical Isolation'?",
      "options": [
        "Species live in different mountains",
        "Species mate at different times of day",
        "Structural differences in reproductive organs prevent successful mating",
        "Hybrids are born weak"
      ],
      "correctAnswer": "Structural differences in reproductive organs prevent successful mating",
      "difficulty": "hard",
      "explanation": "This is a 'lock and key' problem where the anatomy of different species simply doesn't fit."
    },
    {
      "question": "The total collection of all alleles in a population is the:",
      "options": ["Gene pool", "Genotype", "Phenotype", "Hardy-Weinberg equilibrium"],
      "correctAnswer": "Gene pool",
      "difficulty": "easy",
      "explanation": "Evolution is essentially a change in the composition of the gene pool over time."
    },
    {
      "question": "Which of these contributes to 'Industrial Melanism'?",
      "options": ["Air pollution", "Natural selection", "The peppered moth", "All of the above"],
      "correctAnswer": "All of the above",
      "difficulty": "moderate",
      "explanation": "The peppered moth is the classic study of natural selection where industrial soot favored dark-colored moths."
    },
    {
      "question": "Two species of frogs live in the same pond but one breeds in March and the other in May. This is:",
      "options": ["Ecological isolation", "Temporal isolation", "Behavioral isolation", "Gametic isolation"],
      "correctAnswer": "Temporal isolation",
      "difficulty": "moderate",
      "explanation": "Temporal refers to time; different breeding schedules prevent interbreeding."
    },
    {
      "question": "True or False: Individuals evolve during their lifetime.",
      "options": ["True", "False"],
      "correctAnswer": "False",
      "difficulty": "easy",
      "type": "trueFalse",
      "explanation": "Populations evolve over generations; individuals only develop or age."
    },
    {
      "question": "What is 'Coevolution'?",
      "options": [
        "Two species evolving independently",
        "The reciprocal evolutionary influence between two interacting species (e.g., predator and prey)",
        "The same as convergent evolution",
        "Evolution that happened a long time ago"
      ],
      "correctAnswer": "The reciprocal evolutionary influence between two interacting species (e.g., predator and prey)",
      "difficulty": "hard",
      "explanation": "Classic examples include flowering plants and their specific pollinators."
    },
    {
      "question": "In the context of evolution, 'Fitness' is measured by:",
      "options": ["Muscle mass", "Lifespan", "Reproductive success", "Intelligence"],
      "correctAnswer": "Reproductive success",
      "difficulty": "moderate",
      "explanation": "An organism is 'fit' if it passes its genes to the next generation."
    },
    {
      "question": "Which of the following is a post-zygotic barrier where the first generation of hybrids is fertile, but the second generation is sterile or weak?",
      "options": ["Hybrid inviability", "Hybrid sterility", "Hybrid breakdown", "Gametic isolation"],
      "correctAnswer": "Hybrid breakdown",
      "difficulty": "hard",
      "explanation": "Hybrid breakdown affects the F2 generation rather than the F1."
    },
    {
      "question": "Identify the error: 'Analogous structures are evidence for divergent evolution.'",
      "options": [
        "The error is 'Analogous structures'",
        "The error is 'divergent evolution'",
        "The error is 'evidence'",
        "No error"
      ],
      "correctAnswer": "The error is 'divergent evolution'",
      "difficulty": "moderate",
      "type": "errorIdentification",
      "explanation": "Analogous structures are evidence for *convergent* evolution; homologous structures are evidence for divergent evolution."
    },
    {
      "question": "The 'Founder Effect' occurs when:",
      "options": [
        "A large population dies out",
        "A small number of individuals colonize a new area",
        "A species is created by a scientist",
        "Two species merge into one"
      ],
      "correctAnswer": "A small number of individuals colonize a new area",
      "difficulty": "moderate",
      "explanation": "The new population has a different (usually smaller) gene pool than the source population."
    },
    {
      "question": "A mutation that provides a survival advantage is called a:",
      "options": ["Lethal mutation", "Neutral mutation", "Beneficial mutation", "Harmful mutation"],
      "correctAnswer": "Beneficial mutation",
      "difficulty": "easy",
      "explanation": "Beneficial mutations are the primary source of new adaptive traits for natural selection."
    },
    {
      "question": "Comparative embryology reveals that vertebrate embryos:",
      "options": [
        "Are identical to adults",
        "Look very different from the start",
        "Share common features like gill slits and tails in early stages",
        "Do not have DNA"
      ],
      "correctAnswer": "Share common features like gill slits and tails in early stages",
      "difficulty": "moderate",
      "explanation": "These similarities suggest a common vertebrate ancestor."
    },
    {
      "question": "The extinction of the dinosaurs at the end of the Cretaceous period is attributed to:",
      "options": ["A meteorite impact and volcanic activity", "Overhunting by humans", "A lack of water", "The evolution of grass"],
      "correctAnswer": "A meteorite impact and volcanic activity",
      "difficulty": "easy",
      "explanation": "Environmental catastrophes led to the K-Pg mass extinction."
    },
    {
      "question": "What prevents different species from mating even if they live in the same forest?",
      "options": ["Reproductive isolation", "Global warming", "The sun", "Gravity"],
      "correctAnswer": "Reproductive isolation",
      "difficulty": "easy",
      "explanation": "Biological barriers prevent the production of fertile offspring between different species."
    },
    {
      "question": "Assertion (A): Lamarck's theory was revolutionary for its time.\nReason (R): It was the first to suggest that species change over time rather than being fixed.",
      "options": [
        "Both A and R are true, and R explains A",
        "Both A and R are true, but R does not explain A",
        "A is true, but R is false",
        "A is false, but R is true"
      ],
      "correctAnswer": "Both A and R are true, and R explains A",
      "difficulty": "hard",
      "type": "assertionReason",
      "explanation": "Even though his mechanism was wrong, Lamarck helped pave the way for evolutionary thought by challenging the idea of static species."
    },
    {
      "question": "An example of behavioral isolation would be:",
      "options": [
        "Two species of birds having different mating songs",
        "Two species of flowers blooming at different times",
        "A river separating two populations of squirrels",
        "Sperm not being able to fertilize an egg"
      ],
      "correctAnswer": "Two species of birds having different mating songs",
      "difficulty": "moderate",
      "explanation": "Mating rituals are species-specific; if the 'song' isn't right, the female will not mate."
    },
    {
      "question": "The 'Bottleneck Effect' results in:",
      "options": [
        "Increased genetic diversity",
        "Reduced genetic diversity due to a drastic reduction in population size",
        "Faster speciation",
        "Infinite growth"
      ],
      "correctAnswer": "Reduced genetic diversity due to a drastic reduction in population size",
      "difficulty": "moderate",
      "explanation": "The surviving population may lack many of the alleles that were present in the original larger population."
    },
    {
      "question": "Phylogeny is the study of:",
      "options": [
        "How fossils are formed",
        "The evolutionary history and relationships of a group of organisms",
        "How cells divide",
        "The chemical composition of soil"
      ],
      "correctAnswer": "The evolutionary history and relationships of a group of organisms",
      "difficulty": "moderate",
      "explanation": "Phylogenetic trees represent these relationships visually."
    },
        {
      "question": "Which of the following is an example of 'Ecological Isolation'?",
      "options": [
        "Two species of birds that sing different songs",
        "Two species of plants that live in the same area but one prefers acidic soil and the other prefers alkaline soil",
        "Two species of insects that mate at different times of the year",
        "Two species of mammals whose reproductive organs do not fit together"
      ],
      "correctAnswer": "Two species of plants that live in the same area but one prefers acidic soil and the other prefers alkaline soil",
      "difficulty": "moderate",
      "explanation": "Ecological (or habitat) isolation occurs when two species occupy different habitats within the same area, so they rarely encounter each other to mate."
    },
    {
      "question": "The concept that 'nature abhors a vacuum' in evolution refers to:",
      "options": [
        "Species moving into space",
        "Adaptive radiation to fill vacant ecological niches",
        "The extinction of all life forms",
        "The lack of air in the atmosphere"
      ],
      "correctAnswer": "Adaptive radiation to fill vacant ecological niches",
      "difficulty": "moderate",
      "explanation": "When an environment has unoccupied niches (like the Galapagos after the first finch arrived), species evolve rapidly to exploit those available resources."
    },
    {
      "question": "Which of the following describes 'Gametic Isolation'?",
      "options": [
        "The offspring die before birth",
        "The offspring are sterile",
        "Sperm of one species may not be able to fertilize the eggs of another species",
        "The parents live on different continents"
      ],
      "correctAnswer": "Sperm of one species may not be able to fertilize the eggs of another species",
      "difficulty": "hard",
      "explanation": "This is a pre-zygotic barrier where biochemical incompatibilities prevent the sperm from penetrating the egg."
    },
    {
      "question": "The evolution of the marsupial mole in Australia and the placental mole in North America is a classic example of:",
      "options": ["Divergent evolution", "Convergent evolution", "Coevolution", "Artificial selection"],
      "correctAnswer": "Convergent evolution",
      "difficulty": "moderate",
      "explanation": "Despite being distantly related, they evolved nearly identical body shapes and claws because they both adapted to a burrowing lifestyle."
    },
    {
      "question": "Which factor is most likely to lead to 'clinal variation' along a geographic gradient?",
      "options": [
        "A sudden volcanic eruption",
        "Gradual change in environmental temperature from North to South",
        "Random mutations in a laboratory",
        "The use of pesticides"
      ],
      "correctAnswer": "Gradual change in environmental temperature from North to South",
      "difficulty": "hard",
      "explanation": "A cline is a gradual change in a trait (like body size) across a geographic axis, often following environmental gradients."
    },
    {
      "question": "How does the 'Molecular Clock' help evolutionary biologists?",
      "options": [
        "It tells them the time of day a fossil was formed",
        "It uses constant rates of mutation in certain genes to estimate the time since two species diverged",
        "It measures the speed of an animal",
        "It predicts when a species will go extinct"
      ],
      "correctAnswer": "It uses constant rates of mutation in certain genes to estimate the time since two species diverged",
      "difficulty": "hard",
      "explanation": "By counting the number of differences in DNA sequences, scientists can back-calculate when the common ancestor existed."
    },
    {
      "question": "A 'Hybrid Zone' is a region where:",
      "options": [
        "No life can exist",
        "Members of different species meet and mate, producing at least some offspring of mixed ancestry",
        "Only purebred species are allowed",
        "New mutations are forbidden"
      ],
      "correctAnswer": "Members of different species meet and mate, producing at least some offspring of mixed ancestry",
      "difficulty": "moderate",
      "explanation": "Hybrid zones provide a 'natural laboratory' to study the factors that lead to reproductive isolation."
    },
    {
      "question": "Which of these is a major driver of 'Divergent Evolution'?",
      "options": [
        "Shared environments",
        "Geographic isolation and different selective pressures",
        "Strict inbreeding",
        "Lack of mutations"
      ],
      "correctAnswer": "Geographic isolation and different selective pressures",
      "difficulty": "easy",
      "explanation": "When populations are separated and face different challenges, they accumulate different traits, leading to divergence."
    },
    {
      "question": "The wings of a penguin (used for swimming) and the wings of an eagle (used for flying) are:",
      "options": ["Analogous", "Homologous", "Vestigial", "Artificial"],
      "correctAnswer": "Homologous",
      "difficulty": "moderate",
      "explanation": "They are both modified forelimbs inherited from a common ancestor, regardless of their different modern functions."
    },
    {
      "question": "What happens during 'Hybrid Inviability'?",
      "options": [
        "The hybrid cannot find a mate",
        "The hybrid embryo fails to develop or dies before reaching reproductive age",
        "The hybrid is stronger than the parents",
        "The hybrid looks like a different species"
      ],
      "correctAnswer": "The hybrid embryo fails to develop or dies before reaching reproductive age",
      "difficulty": "moderate",
      "explanation": "This is a post-zygotic barrier where genetic incompatibility prevents the hybrid from becoming a healthy, functioning adult."
    }
  ],
  "Biology S6 ANP Comprehensive Review (Units 1-17)": [
    {
      "question": "Which organelle is responsible for the synthesis of lipids and the detoxification of drugs?",
      "options": ["Rough Endoplasmic Reticulum", "Smooth Endoplasmic Reticulum", "Golgi Apparatus", "Lysosome"],
      "correctAnswer": "Smooth Endoplasmic Reticulum",
      "difficulty": "easy",
      "explanation": "The SER lacks ribosomes and is the primary site for lipid metabolism and chemical detoxification."
    },
    {
      "question": "During which phase of the cell cycle does DNA replication occur?",
      "options": ["G1 phase", "S phase", "G2 phase", "M phase"],
      "correctAnswer": "S phase",
      "difficulty": "easy",
      "explanation": "The S (Synthesis) phase is dedicated to replicating the genome before cell division."
    },
    {
      "question": "In the context of enzyme kinetics, what does the Michaelis constant (Km) represent?",
      "options": ["The maximum velocity of the reaction", "The substrate concentration at which the reaction rate is half of Vmax", "The energy of activation", "The total concentration of the enzyme"],
      "correctAnswer": "The substrate concentration at which the reaction rate is half of Vmax",
      "difficulty": "moderate",
      "explanation": "Km is an inverse measure of the enzyme's affinity for its substrate."
    },
    {
      "question": "What is the primary function of the Casparian strip in plant roots?",
      "options": ["To increase water absorption", "To force water and minerals to pass through the cytoplasm of endodermal cells", "To provide structural support to the xylem", "To store starch"],
      "correctAnswer": "To force water and minerals to pass through the cytoplasm of endodermal cells",
      "difficulty": "moderate",
      "explanation": "The suberin-rich Casparian strip blocks the apoplastic pathway, ensuring selective uptake of minerals."
    },
    {
      "question": "Which of the following describes the 'Fluid Mosaic Model' of the cell membrane?",
      "options": ["A solid protein layer with fat droplets", "A double layer of phospholipids with embedded proteins that can move laterally", "A rigid wall of cellulose", "A static lipid bilayer"],
      "correctAnswer": "A double layer of phospholipids with embedded proteins that can move laterally",
      "difficulty": "easy",
      "explanation": "Proposed by Singer and Nicolson, it describes the membrane as a dynamic, fluid structure."
    },
    {
      "question": "What is the final electron acceptor in the electron transport chain of aerobic respiration?",
      "options": ["NAD+", "FAD", "Oxygen", "Water"],
      "correctAnswer": "Oxygen",
      "difficulty": "easy",
      "explanation": "Oxygen combines with electrons and protons to form water, allowing the chain to continue."
    },
    {
      "question": "In DNA replication, which enzyme is responsible for unwinding the double helix?",
      "options": ["DNA Polymerase", "Ligase", "Helicase", "Primase"],
      "correctAnswer": "Helicase",
      "difficulty": "easy",
      "explanation": "Helicase breaks the hydrogen bonds between the nitrogenous bases to separate the strands."
    },
    {
      "question": "Which of the following is a symptom of a deficiency in Vitamin C?",
      "options": ["Rickets", "Scurvy", "Night blindness", "Beriberi"],
      "correctAnswer": "Scurvy",
      "difficulty": "easy",
      "explanation": "Vitamin C is essential for collagen synthesis; its lack leads to bleeding gums and poor wound healing."
    },
    {
      "question": "What is the role of tRNA during translation?",
      "options": ["To carry the genetic code from the nucleus to the ribosome", "To provide the structural framework for the ribosome", "To transport specific amino acids to the ribosome", "To catalyze the formation of peptide bonds"],
      "correctAnswer": "To transport specific amino acids to the ribosome",
      "difficulty": "moderate",
      "explanation": "Each tRNA has an anticodon that matches an mRNA codon, bringing the correct amino acid into sequence."
    },
    {
      "question": "Which hormone is released by the posterior pituitary to regulate water reabsorption in the kidneys?",
      "options": ["Insulin", "Aldosterone", "Antidiuretic Hormone (ADH)", "Thyroxine"],
      "correctAnswer": "Antidiuretic Hormone (ADH)",
      "difficulty": "moderate",
      "explanation": "ADH increases the permeability of the collecting ducts to water, concentrating the urine."
    },
    {
      "question": "In a cross between two individuals heterozygous for a single trait (Aa x Aa), what is the expected phenotypic ratio?",
      "options": ["1:2:1", "3:1", "9:3:3:1", "1:1"],
      "correctAnswer": "3:1",
      "difficulty": "easy",
      "explanation": "Three-quarters will show the dominant phenotype, and one-quarter will show the recessive phenotype."
    },
    {
      "question": "What is the term for the movement of individuals into a population, which can introduce new alleles?",
      "options": ["Emigration", "Genetic Drift", "Immigration", "Natural Selection"],
      "correctAnswer": "Immigration",
      "difficulty": "easy",
      "explanation": "Immigration is a component of gene flow that increases genetic variation within a population."
    },
    {
      "question": "Which of the following is a characteristic of C4 plants compared to C3 plants?",
      "options": ["They perform the Calvin cycle at night", "They have Kranz anatomy to minimize photorespiration", "They do not use Rubisco", "They only grow in cold climates"],
      "correctAnswer": "They have Kranz anatomy to minimize photorespiration",
      "difficulty": "hard",
      "explanation": "C4 plants spatially separate carbon fixation and the Calvin cycle to increase efficiency in hot environments."
    },
    {
      "question": "In bioinformatics, what does 'BLAST' stand for?",
      "options": ["Basic Local Alignment Search Tool", "Biological Library of Allele Sequence Tracks", "Binary Linear Analysis System Technology", "Base Level Amino acid Study Technique"],
      "correctAnswer": "Basic Local Alignment Search Tool",
      "difficulty": "moderate",
      "explanation": "BLAST is a widely used algorithm for comparing primary biological sequence information."
    },
    {
      "question": "Which of the following is an example of a 'bottle-neck effect'?",
      "options": [
        "A few birds flying to a new island",
        "A large population size remaining stable",
        "A wildfire killing 90% of a population, leaving only a few survivors",
        "Mutations occurring at a high rate"
      ],
      "correctAnswer": "A wildfire killing 90% of a population, leaving only a few survivors",
      "difficulty": "moderate",
      "explanation": "A bottleneck drastically reduces genetic diversity due to a sudden decrease in population size."
    },
    {
      "question": "What is the function of Restriction Endonucleases in gene technology?",
      "options": ["To join DNA fragments", "To cut DNA at specific recognition sequences", "To copy mRNA into DNA", "To sequence proteins"],
      "correctAnswer": "To cut DNA at specific recognition sequences",
      "difficulty": "easy",
      "explanation": "These enzymes are 'molecular scissors' used to isolate genes or create recombinant DNA."
    },
    {
      "question": "Which heart chamber pumps oxygenated blood into the systemic circulation (aorta)?",
      "options": ["Right Atrium", "Right Ventricle", "Left Atrium", "Left Ventricle"],
      "correctAnswer": "Left Ventricle",
      "difficulty": "easy",
      "explanation": "The left ventricle has the thickest muscular wall to generate high pressure for the whole body."
    },
    {
      "question": "Which neurotransmitter is primarily involved in the transmission of signals across the neuromuscular junction?",
      "options": ["Dopamine", "Serotonin", "Acetylcholine", "GABA"],
      "correctAnswer": "Acetylcholine",
      "difficulty": "moderate",
      "explanation": "ACh binds to receptors on the muscle fiber, triggering contraction."
    },
    {
      "question": "What is the definition of 'Allopatric Speciation'?",
      "options": [
        "Speciation due to different mating seasons",
        "Speciation due to polyploidy",
        "Speciation resulting from geographic isolation",
        "Speciation occurring within the same area"
      ],
      "correctAnswer": "Speciation resulting from geographic isolation",
      "difficulty": "moderate",
      "explanation": "Physical barriers prevent gene flow, leading to the divergence of populations into separate species."
    },
    {
      "question": "Which of the following is the standard Hardy-Weinberg equation for genotype frequencies?",
      "options": ["p + q = 1", "p² + 2pq + q² = 1", "a² + b² = c²", "V = IR"],
      "correctAnswer": "p² + 2pq + q² = 1",
      "difficulty": "easy",
      "explanation": "p² is homozygous dominant, 2pq is heterozygous, and q² is homozygous recessive."
    },
    {
      "question": "During anaerobic respiration in yeast, what are the end products?",
      "options": ["Lactic acid and ATP", "Ethanol, CO2, and ATP", "Glucose and Oxygen", "Pyruvate and Water"],
      "correctAnswer": "Ethanol, CO2, and ATP",
      "difficulty": "easy",
      "explanation": "Yeast performs alcoholic fermentation in the absence of oxygen."
    },
    {
      "question": "Which structure in the chloroplast contains the pigments necessary for the light-dependent reactions?",
      "options": ["Stroma", "Thylakoid membrane", "Outer membrane", "Matrix"],
      "correctAnswer": "Thylakoid membrane",
      "difficulty": "moderate",
      "explanation": "Chlorophyll and other pigments are embedded in the thylakoid membranes within photosystems."
    },
    {
      "question": "A gene mutation where one nucleotide is replaced by another is called a:",
      "options": ["Deletion", "Insertion", "Substitution", "Inversion"],
      "correctAnswer": "Substitution",
      "difficulty": "easy",
      "explanation": "Substitution changes one base, which might change one amino acid in the resulting protein."
    },
    {
      "question": "What is the primary significance of 'Golden Rice'?",
      "options": ["It grows faster", "It is resistant to all pests", "It is enriched with Beta-carotene to combat Vitamin A deficiency", "It can grow in salt water"],
      "correctAnswer": "It is enriched with Beta-carotene to combat Vitamin A deficiency",
      "difficulty": "moderate",
      "explanation": "Golden rice is a GMO designed as a biofortified food for developing nations."
    },
    {
      "question": "Which of the following are the components of a nucleotide?",
      "options": [
        "Sugar, Protein, Lipid",
        "Phosphate group, Pentose sugar, Nitrogenous base",
        "Amino acid, Glycerol, Base",
        "Glucose, Phosphate, Enzyme"
      ],
      "correctAnswer": "Phosphate group, Pentose sugar, Nitrogenous base",
      "difficulty": "easy",
      "explanation": "These three units covalently bond to form the monomers of DNA and RNA."
    },
    {
      "question": "What is 'Epistasis'?",
      "options": [
        "A mutation in a sex chromosome",
        "When one gene masks or interferes with the expression of another gene",
        "The movement of genes between species",
        "The process of cell death"
      ],
      "correctAnswer": "When one gene masks or interferes with the expression of another gene",
      "difficulty": "hard",
      "explanation": "Epistasis involves gene interaction where the effect of one locus depends on the presence of alleles at another locus."
    },
    {
      "question": "Which type of selection favors both phenotypic extremes at the expense of the intermediate?",
      "options": ["Stabilizing Selection", "Directional Selection", "Disruptive Selection", "Artificial Selection"],
      "correctAnswer": "Disruptive Selection",
      "difficulty": "moderate",
      "explanation": "Disruptive selection increases variation and can lead to speciation."
    },
    {
      "question": "In the human kidney, where does ultrafiltration take place?",
      "options": ["Loop of Henle", "Bowman's capsule", "Collecting duct", "Proximal convoluted tubule"],
      "correctAnswer": "Bowman's capsule",
      "difficulty": "moderate",
      "explanation": "High pressure in the glomerulus forces water and small solutes into the Bowman's capsule."
    },
    {
      "question": "Which of the following is a vestigial structure in humans?",
      "options": ["Heart", "Lungs", "Appendix", "Liver"],
      "correctAnswer": "Appendix",
      "difficulty": "easy",
      "explanation": "Vestigial structures are remnants of organs that were functional in ancestors but are now reduced or non-functional."
    },
    {
      "question": "Which enzyme 'zips' or joins DNA fragments together, such as those between Okazaki fragments?",
      "options": ["DNA Polymerase", "RNA Polymerase", "DNA Ligase", "Amylase"],
      "correctAnswer": "DNA Ligase",
      "difficulty": "moderate",
      "explanation": "Ligase creates the phosphodiester bonds needed to seal nicks in the DNA backbone."
    },
    {
      "question": "What is the function of the myelin sheath in neurons?",
      "options": ["To generate the action potential", "To provide nutrition to the axon", "To increase the speed of nerve impulse conduction", "To receive signals from other neurons"],
      "correctAnswer": "To increase the speed of nerve impulse conduction",
      "difficulty": "moderate",
      "explanation": "The sheath acts as an insulator, allowing for saltatory conduction across Nodes of Ranvier."
    },
    {
      "question": "In protein structure, what defines the 'Secondary Structure'?",
      "options": [
        "The sequence of amino acids",
        "The folding of the polypeptide chain into alpha-helices or beta-pleated sheets",
        "The interaction between multiple polypeptide chains",
        "The overall 3D shape of a single protein"
      ],
      "correctAnswer": "The folding of the polypeptide chain into alpha-helices or beta-pleated sheets",
      "difficulty": "moderate",
      "explanation": "Secondary structure is maintained by hydrogen bonds between the peptide backbone."
    },
    {
      "question": "What is 'Xenotransplantation'?",
      "options": [
        "Transplanting an organ between identical twins",
        "Transplanting an organ from an animal into a human",
        "Using a robotic heart",
        "A blood transfusion"
      ],
      "correctAnswer": "Transplanting an organ from an animal into a human",
      "difficulty": "moderate",
      "explanation": "This involves using genetically modified animals (like pigs) as organ donors for humans."
    },
    {
      "question": "Which process results in the production of four haploid daughter cells?",
      "options": ["Mitosis", "Meiosis", "Binary Fission", "Budding"],
      "correctAnswer": "Meiosis",
      "difficulty": "easy",
      "explanation": "Meiosis reduces the chromosome number by half to produce gametes."
    },
    {
      "question": "The 'induced fit' hypothesis of enzyme action suggests that:",
      "options": [
        "The substrate is an exact fit for the active site",
        "The active site is rigid",
        "The active site changes shape slightly to fit the substrate more closely upon binding",
        "Enzymes are consumed in the reaction"
      ],
      "correctAnswer": "The active site changes shape slightly to fit the substrate more closely upon binding",
      "difficulty": "moderate",
      "explanation": "This model improves upon the 'Lock and Key' theory by accounting for the flexibility of enzymes."
    },
    {
      "question": "Which of the following is an example of continuous variation?",
      "options": ["Blood group", "Gender", "Human height", "Attached earlobes"],
      "correctAnswer": "Human height",
      "difficulty": "easy",
      "explanation": "Continuous variation shows a range of values with many intermediates, often controlled by polygenes."
    },
    {
      "question": "Which part of the brain is primarily responsible for maintaining balance and coordination?",
      "options": ["Cerebrum", "Cerebellum", "Medulla oblongata", "Hypothalamus"],
      "correctAnswer": "Cerebellum",
      "difficulty": "moderate",
      "explanation": "The cerebellum processes sensory input and coordinates voluntary movement and balance."
    },
    {
      "question": "In the Krebs cycle, which molecule combines with Acetyl-CoA to form Citrate?",
      "options": ["Pyruvate", "Oxaloacetate", "Malate", "Succinate"],
      "correctAnswer": "Oxaloacetate",
      "difficulty": "hard",
      "explanation": "The cycle begins when the 2-carbon Acetyl-CoA reacts with the 4-carbon Oxaloacetate."
    },
    {
      "question": "What is the primary role of 'Reverse Transcriptase'?",
      "options": [
        "To make mRNA from DNA",
        "To make DNA from an RNA template",
        "To break down proteins",
        "To join two RNA strands"
      ],
      "correctAnswer": "To make DNA from an RNA template",
      "difficulty": "moderate",
      "explanation": "Used by retroviruses and in biotechnology to create cDNA from mRNA."
    },
    {
      "question": "A test cross is used to determine:",
      "options": [
        "The phenotype of an individual",
        "The genotype of an individual with a dominant phenotype",
        "The gender of an individual",
        "The rate of mutation"
      ],
      "correctAnswer": "The genotype of an individual with a dominant phenotype",
      "difficulty": "moderate",
      "explanation": "By crossing the unknown with a homozygous recessive individual, the offspring will reveal if the parent was homozygous or heterozygous."
    },
    {
      "question": "Which of the following describes 'Convergent Evolution'?",
      "options": [
        "Two related species becoming more different",
        "Two unrelated species evolving similar traits due to similar environmental pressures",
        "A single species splitting into two",
        "The breeding of dogs by humans"
      ],
      "correctAnswer": "Two unrelated species evolving similar traits due to similar environmental pressures",
      "difficulty": "moderate",
      "explanation": "An example is the streamlined bodies of sharks (fish) and dolphins (mammals)."
    },
    {
      "question": "What is the purpose of 'Gel Electrophoresis'?",
      "options": [
        "To amplify DNA",
        "To sequence DNA",
        "To separate DNA fragments based on their size and charge",
        "To kill bacteria"
      ],
      "correctAnswer": "To separate DNA fragments based on their size and charge",
      "difficulty": "easy",
      "explanation": "Smaller fragments move faster through the gel toward the positive electrode."
    },
    {
      "question": "Which hormone triggers ovulation in human females?",
      "options": ["Estrogen", "Progesterone", "Luteinizing Hormone (LH)", "Follicle-Stimulating Hormone (FSH)"],
      "correctAnswer": "Luteinizing Hormone (LH)",
      "difficulty": "moderate",
      "explanation": "A surge in LH mid-cycle causes the mature follicle to release the egg."
    },
    {
      "question": "In competitive inhibition, where does the inhibitor bind?",
      "options": ["The active site", "The allosteric site", "The substrate", "The product"],
      "correctAnswer": "The active site",
      "difficulty": "moderate",
      "explanation": "Competitive inhibitors mimic the substrate and compete for the same active site."
    },
    {
      "question": "What is the function of 'Plasmids' in recombinant DNA technology?",
      "options": [
        "To provide energy to the cell",
        "To act as vectors for carrying foreign DNA into a host cell",
        "To store genetic information for the whole organism",
        "To catalyze protein synthesis"
      ],
      "correctAnswer": "To act as vectors for carrying foreign DNA into a host cell",
      "difficulty": "easy",
      "explanation": "Plasmids are small, circular DNA molecules that can easily be manipulated and inserted into bacteria."
    },
    {
      "question": "Which of the following is a symptom of Diabetes Mellitus?",
      "options": [
        "Low blood sugar",
        "High concentration of glucose in urine",
        "Reduced thirst",
        "Weight gain"
      ],
      "correctAnswer": "High concentration of glucose in urine",
      "difficulty": "easy",
      "explanation": "When blood glucose exceeds the renal threshold, it is excreted in the urine (glycosuria)."
    },
    {
      "question": "What is the primary function of the 'Loop of Henle'?",
      "options": [
        "To filter blood",
        "To create a concentration gradient in the medulla to allow for water reabsorption",
        "To secrete urea into the urine",
        "To move urine to the bladder"
      ],
      "correctAnswer": "To create a concentration gradient in the medulla to allow for water reabsorption",
      "difficulty": "hard",
      "explanation": "The counter-current multiplier system in the loop allows for the production of hypertonic urine."
    },
    {
      "question": "In plants, which tissue is responsible for the transport of sucrose and amino acids?",
      "options": ["Xylem", "Phloem", "Parenchyma", "Sclerenchyma"],
      "correctAnswer": "Phloem",
      "difficulty": "easy",
      "explanation": "Phloem moves organic solutes from 'sources' to 'sinks' via translocation."
    },
    {
      "question": "What characterizes 'Stabilizing Selection'?",
      "options": [
        "Favoring of one extreme phenotype",
        "Favoring of both extreme phenotypes",
        "Favoring of the intermediate phenotype and acting against extremes",
        "Introduction of new alleles"
      ],
      "correctAnswer": "Favoring of the intermediate phenotype and acting against extremes",
      "difficulty": "moderate",
      "explanation": "This type of selection keeps a population stable and reduces variation."
    },
    {
      "question": "Which of the following is a post-transcriptional modification in eukaryotes?",
      "options": ["DNA replication", "RNA splicing (removing introns)", "Protein folding", "Translation"],
      "correctAnswer": "RNA splicing (removing introns)",
      "difficulty": "moderate",
      "explanation": "Non-coding regions (introns) are removed and exons are joined to form the mature mRNA."
    },
    {
      "question": "What is 'Polyploidy'?",
      "options": [
        "Having one missing chromosome",
        "Having one extra chromosome",
        "Having three or more complete sets of chromosomes",
        "A type of gene mutation"
      ],
      "correctAnswer": "Having three or more complete sets of chromosomes",
      "difficulty": "moderate",
      "explanation": "Common in plants, polyploidy can lead to instant speciation."
    },
    {
      "question": "The conversion of light energy into chemical energy occurs during which process?",
      "options": ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"],
      "correctAnswer": "Photosynthesis",
      "difficulty": "easy",
      "explanation": "Photosynthesis captures solar energy to produce glucose."
    },
    {
      "question": "Which organism is commonly used as a host in recombinant DNA technology to produce human insulin?",
      "options": ["Yeast", "Escherichia coli", "Amoeba", "Mice"],
      "correctAnswer": "Escherichia coli",
      "difficulty": "easy",
      "explanation": "E. coli is used because it grows rapidly and its genetics are well understood."
    },
    {
      "question": "What is the role of 'Phagocytes' in the immune system?",
      "options": [
        "To produce antibodies",
        "To engulf and digest pathogens",
        "To remember previous infections",
        "To transport oxygen"
      ],
      "correctAnswer": "To engulf and digest pathogens",
      "difficulty": "easy",
      "explanation": "Phagocytosis is a non-specific immune response where cells 'eat' invading microbes."
    },
    {
      "question": "In an ecosystem, what is 'Gross Primary Productivity' (GPP)?",
      "options": [
        "The energy lost as heat",
        "The total amount of energy captured by producers via photosynthesis",
        "The energy available to the next trophic level",
        "The energy consumed by decomposers"
      ],
      "correctAnswer": "The total amount of energy captured by producers via photosynthesis",
      "difficulty": "moderate",
      "explanation": "GPP minus respiration equals Net Primary Productivity (NPP)."
    },
    {
      "question": "Which of the following describes 'Biopiracy'?",
      "options": [
        "The illegal trade of animal parts",
        "The commercial exploitation of biological resources or traditional knowledge without permission",
        "Using computers to analyze DNA",
        "Polluting the ocean"
      ],
      "correctAnswer": "The commercial exploitation of biological resources or traditional knowledge without permission",
      "difficulty": "moderate",
      "explanation": "This is a significant ethical issue in international biotechnology."
    },
    {
      "question": "What is the function of 'B-lymphocytes'?",
      "options": [
        "Directly killing infected cells",
        "Producing antibodies",
        "Engulfing bacteria",
        "Releasing histamine"
      ],
      "correctAnswer": "Producing antibodies",
      "difficulty": "moderate",
      "explanation": "B-cells are responsible for humoral immunity."
    },
    {
      "question": "In the lung, where does gaseous exchange occur?",
      "options": ["Bronchi", "Trachea", "Alveoli", "Bronchioles"],
      "correctAnswer": "Alveoli",
      "difficulty": "easy",
      "explanation": "The alveoli provide a large, thin surface area for the diffusion of O2 and CO2."
    },
    {
      "question": "Which hormone is responsible for the 'fight or flight' response?",
      "options": ["Insulin", "Adrenaline", "Estrogen", "Growth Hormone"],
      "correctAnswer": "Adrenaline",
      "difficulty": "easy",
      "explanation": "Adrenaline increases heart rate and blood glucose levels to prepare the body for action."
    },
    {
      "question": "What is the definition of 'Locus'?",
      "options": [
        "A type of insect",
        "The specific physical location of a gene on a chromosome",
        "The version of a gene",
        "The center of a cell"
      ],
      "correctAnswer": "The specific physical location of a gene on a chromosome",
      "difficulty": "easy",
      "explanation": "Each gene has a fixed position (locus) on a particular chromosome."
    },
    {
      "question": "Which of the following is a characteristic of 'Artificial Selection'?",
      "options": [
        "Driven by environmental changes",
        "Slow process over millions of years",
        "Human-driven breeding for specific traits",
        "Always improves the fitness of the species in the wild"
      ],
      "correctAnswer": "Human-driven breeding for specific traits",
      "difficulty": "easy",
      "explanation": "Artificial selection focuses on utility to humans rather than survival in nature."
    },
    {
      "question": "What is 'Genetic Fingerprinting' primarily based on?",
      "options": [
        "Comparing the shapes of fingers",
        "Analyzing the sequences of Variable Number Tandem Repeats (VNTRs)",
        "Sequencing the entire genome",
        "Counting the number of genes"
      ],
      "correctAnswer": "Analyzing the sequences of Variable Number Tandem Repeats (VNTRs)",
      "difficulty": "moderate",
      "explanation": "VNTRs/STRs vary significantly between individuals, creating a unique profile."
    },
    {
      "question": "During muscle contraction, what happens to the H-zone of the sarcomere?",
      "options": ["It widens", "It stays the same", "It narrows or disappears", "It becomes more dense"],
      "correctAnswer": "It narrows or disappears",
      "difficulty": "hard",
      "explanation": "According to the sliding filament theory, actin filaments slide over myosin, reducing the H-zone."
    },
    {
      "question": "Which of the following is an example of an 'abiotoc' factor in an ecosystem?",
      "options": ["Predation", "Disease", "Temperature", "Competition"],
      "correctAnswer": "Temperature",
      "difficulty": "easy",
      "explanation": "Abiotic factors are non-living physical and chemical elements."
    },
    {
      "question": "What is the purpose of 'PCR' (Polymerase Chain Reaction)?",
      "options": [
        "To sequence a protein",
        "To amplify a specific segment of DNA into millions of copies",
        "To cut DNA into fragments",
        "To view cells under a microscope"
      ],
      "correctAnswer": "To amplify a specific segment of DNA into millions of copies",
      "difficulty": "easy",
      "explanation": "PCR allows for the study of tiny DNA samples by creating many copies."
    },
    {
      "question": "Which base is found in RNA but not in DNA?",
      "options": ["Adenine", "Thymine", "Uracil", "Guanine"],
      "correctAnswer": "Uracil",
      "difficulty": "easy",
      "explanation": "Uracil replaces thymine in RNA and pairs with adenine."
    },
    {
      "question": "What is the primary role of the 'Hypothalamus' in homeostasis?",
      "options": [
        "Thinking and reasoning",
        "Acting as the control center for body temperature and water balance",
        "Digesting food",
        "Pumping blood"
      ],
      "correctAnswer": "Acting as the control center for body temperature and water balance",
      "difficulty": "moderate",
      "explanation": "The hypothalamus monitors blood parameters and signals effectors to maintain internal balance."
    },
    {
      "question": "In the 'Endosymbiotic Theory', mitochondria are believed to have evolved from:",
      "options": ["Viruses", "Free-living aerobic bacteria", "Plant cells", "Fungi"],
      "correctAnswer": "Free-living aerobic bacteria",
      "difficulty": "moderate",
      "explanation": "Evidence includes the fact that mitochondria have their own circular DNA and double membranes."
    },
    {
      "question": "Which of the following is a 'Stop Codon'?",
      "options": ["AUG", "UAA", "GGC", "CCC"],
      "correctAnswer": "UAA",
      "difficulty": "hard",
      "explanation": "UAA, UAG, and UGA are codons that signal the end of translation."
    },
    {
      "question": "What is 'Ecological Succession'?",
      "options": [
        "The birth of a new organism",
        "The gradual process by which ecosystems change and develop over time",
        "The movement of animals to find food",
        "The way energy flows through a food chain"
      ],
      "correctAnswer": "The gradual process by which ecosystems change and develop over time",
      "difficulty": "moderate",
      "explanation": "Succession can be primary (starting from bare rock) or secondary (after a disturbance)."
    },
    {
      "question": "Which of the following is an ethical concern regarding GMOs?",
      "options": [
        "Increased crop yields",
        "Potential for the gene to escape into wild relatives (gene flow)",
        "Reduced use of pesticides",
        "Higher nutritional value"
      ],
      "correctAnswer": "Potential for the gene to escape into wild relatives (gene flow)",
      "difficulty": "moderate",
      "explanation": "The creation of 'superweeds' through cross-pollination is a significant environmental and ethical debate."
    },
    {
      "question": "What is the function of 'Rubisco'?",
      "options": [
        "To break down glucose",
        "To fix carbon dioxide into an organic molecule during the Calvin cycle",
        "To transport oxygen in the blood",
        "To catalyze the light-dependent reactions"
      ],
      "correctAnswer": "To fix carbon dioxide into an organic molecule during the Calvin cycle",
      "difficulty": "moderate",
      "explanation": "Rubisco is arguably the most abundant enzyme on Earth, essential for life."
    },
    {
      "question": "Which type of mutation is most likely to be 'neutral'?",
      "options": ["Frameshift mutation", "Nonsense mutation", "Silent mutation", "Large deletion"],
      "correctAnswer": "Silent mutation",
      "difficulty": "moderate",
      "explanation": "A silent mutation changes the DNA but results in the same amino acid due to the degeneracy of the genetic code."
    },
    {
      "question": "What is 'Inbreeding Depression'?",
      "options": [
        "When an animal feels sad",
        "The reduced biological fitness in a given population as a result of inbreeding",
        "The death of all males in a population",
        "The process of selecting the best mates"
      ],
      "correctAnswer": "The reduced biological fitness in a given population as a result of inbreeding",
      "difficulty": "moderate",
      "explanation": "Inbreeding increases the likelihood of deleterious recessive alleles being expressed."
    },
    {
      "question": "Which of the following describes 'Active Transport'?",
      "options": [
        "Movement of molecules from high to low concentration without energy",
        "Movement of molecules against a concentration gradient using ATP",
        "Movement of water across a membrane",
        "The flow of air into the lungs"
      ],
      "correctAnswer": "Movement of molecules against a concentration gradient using ATP",
      "difficulty": "easy",
      "explanation": "Active transport requires cellular energy and specific carrier proteins."
    },
    {
      "question": "What is the 'Species richness' of a community?",
      "options": [
        "The total number of individuals",
        "The number of different species present in the community",
        "The amount of money the community has",
        "The rate of evolution"
      ],
      "correctAnswer": "The number of different species present in the community",
      "difficulty": "easy",
      "explanation": "Species richness is a simple count of species, whereas diversity also considers 'evenness'."
    },
    {
      "question": "Which cell organelle is known as the 'Powerhouse of the cell'?",
      "options": ["Nucleus", "Ribosome", "Mitochondrion", "Vacuole"],
      "correctAnswer": "Mitochondrion",
      "difficulty": "easy",
      "explanation": "Mitochondria are the sites of aerobic respiration where most ATP is generated."
    },
    {
      "question": "Which plant hormone is responsible for 'Phototropism' (growing toward light)?",
      "options": ["Gibberellin", "Abscisic acid", "Auxin", "Ethylene"],
      "correctAnswer": "Auxin",
      "difficulty": "moderate",
      "explanation": "Auxin accumulates on the shaded side of the stem, causing cells to elongate and the plant to bend toward light."
    },
    {
      "question": "In the nitrogen cycle, which bacteria convert ammonium ions into nitrites?",
      "options": ["Nitrobacter", "Nitrosomonas", "Rhizobium", "Azotobacter"],
      "correctAnswer": "Nitrosomonas",
      "difficulty": "hard",
      "explanation": "Nitrification is a two-step process; Nitrosomonas converts ammonia to nitrite, then Nitrobacter converts nitrite to nitrate."
    },
    {
      "question": "What is 'Sympatric Speciation'?",
      "options": [
        "Speciation due to a physical barrier",
        "Speciation occurring within the same geographic area",
        "Speciation driven by humans",
        "Extinction of a species"
      ],
      "correctAnswer": "Speciation occurring within the same geographic area",
      "difficulty": "moderate",
      "explanation": "Occurs via polyploidy or strong disruptive selection in the same habitat."
    },
    {
      "question": "Which of the following is an example of an 'Ex Vivo' gene therapy?",
      "options": [
        "Injecting a virus directly into the brain",
        "Removing bone marrow cells, genetically modifying them, and returning them to the patient",
        "Taking an aspirin",
        "DNA profiling"
      ],
      "correctAnswer": "Removing bone marrow cells, genetically modifying them, and returning them to the patient",
      "difficulty": "moderate",
      "explanation": "Ex vivo means 'outside the living' body."
    },
    {
      "question": "What is the function of 'Stomata' in leaves?",
      "options": [
        "To absorb sunlight",
        "To allow for gas exchange and transpiration",
        "To store sugar",
        "To protect the leaf from insects"
      ],
      "correctAnswer": "To allow for gas exchange and transpiration",
      "difficulty": "easy",
      "explanation": "Pores on the leaf surface that open and close to regulate the entry of CO2 and the exit of water vapor."
    },
    {
      "question": "Which scientist discovered the rules of inheritance (Dominant/Recessive)?",
      "options": ["Charles Darwin", "Gregor Mendel", "James Watson", "Louis Pasteur"],
      "correctAnswer": "Gregor Mendel",
      "difficulty": "easy",
      "explanation": "Mendel worked with pea plants to establish the laws of segregation and independent assortment."
    },
    {
      "question": "Which part of the nephron is most affected by ADH?",
      "options": ["Glomerulus", "Proximal Tubule", "Collecting Duct", "Descending Loop of Henle"],
      "correctAnswer": "Collecting Duct",
      "difficulty": "moderate",
      "explanation": "ADH inserts aquaporins into the walls of the collecting ducts to increase water reabsorption."
    },
    {
      "question": "What is the definition of a 'Gene'?",
      "options": [
        "A whole chromosome",
        "A sequence of DNA that codes for a specific polypeptide or functional RNA",
        "A protein molecule",
        "A type of carbohydrate"
      ],
      "correctAnswer": "A sequence of DNA that codes for a specific polypeptide or functional RNA",
      "difficulty": "easy",
      "explanation": "Genes are the basic units of heredity."
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