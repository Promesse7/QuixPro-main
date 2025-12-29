const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI ||
  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

const client = new MongoClient(uri);

async function seedGSandCS_S4_Unit1() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("QuixDB");
    const quizzesCol = db.collection("quizzes");
    const coursesCol = db.collection("courses");
    const levelsCol = db.collection("levels");
    const schoolsCol = db.collection("schools");
    const unitsCol = db.collection("units");

    const secondarySchool = await schoolsCol.findOne({ type: "SECONDARY" });
    if (!secondarySchool) throw new Error("Secondary school not found!");
    const secondarySchoolId = secondarySchool._id;

    const createOrGetLevel = async (levelName) => {
      let level = await levelsCol.findOne({ name: levelName });
      if (!level) {
        const result = await levelsCol.insertOne({
          name: levelName,
          schoolId: secondarySchoolId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        level = { _id: result.insertedId };
      }
      return level._id;
    };

    const s4LevelId = await createOrGetLevel("S4");

    const createOrGetCourse = async (courseName, levelId) => {
      let course = await coursesCol.findOne({ name: courseName, levelId: levelId });
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

    const gsCsCourseId = await createOrGetCourse("GS & CS", s4LevelId);

    const createOrGetUnit = async (unitName, courseId) => {
      let unit = await unitsCol.findOne({ name: unitName, courseId: courseId });
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

    const unit1Id = await createOrGetUnit("Unit 1: Social Cohesion", gsCsCourseId);

    const buildQuestions = (items) => {
      return items.map((q) => {
        let correctIndex;
        if (Array.isArray(q.correctAnswer)) {
          correctIndex = q.correctAnswer.map(i => q.options.findIndex(o => o === i));
        } else {
          correctIndex = typeof q.correctAnswer === "number"
            ? q.correctAnswer
            : q.options.findIndex(o => String(o) === String(q.correctAnswer));
        }
        return {
          _id: new ObjectId(),
          question: q.question,
          options: q.options,
          correctAnswer: correctIndex,
          explanation: q.explanation || undefined
        };
      });
    };

    const quizzesData = [
      {
        title: "GS & CS S4 - Unit 1: Social Cohesion (Easy)",
        description: "Basic concepts and definitions related to social cohesion.",
        subject: "GS & CS",
        level: "S4",
        difficulty: "easy",
        duration: 15,
        levelId: s4LevelId,
        courseId: gsCsCourseId,
        unitId: unit1Id,
        questions: buildQuestions([
          { question: "What is the primary definition of social cohesion within a community?", options: ["The enforcement of strict laws to maintain order","The overall good relationship that makes people work together and relate well","A system where individuals prioritize their own goals over others","The physical grouping of people in the same geographic area"], correctAnswer: 1, explanation: "Social cohesion is defined as the bond or good relationship among members of a society that enables them to work harmoniously and relate well with one another. While laws or proximity might exist, it is the quality of the relationship that defines cohesion." },
          { question: "Which of the following is considered a 'negative' challenge that directly hinders social cohesion?", options: ["Inclusiveness","Empathy","Individualism","Active listening"], correctAnswer: 2, explanation: "Individualism is the habit of being independent and self-reliant to the point of avoiding others. It limits cooperation and promotes self-centeredness, which acts as a barrier to social cohesion." },
          { question: "Fill in the blank: _________ refers to the ability to understand and share the feelings of others, especially during difficult times.", options: ["Sympathy","Empathy","Apathy","Tolerance"], correctAnswer: 1, explanation: "Empathy is specifically the capacity to step into another's shoes and share their feelings, which fosters close, friendly relations and social cohesion." },
          { question: "Which of the following is NOT a recommended guideline when intervening as an active bystander?", options: ["Approach everyone as a friend","Avoid using violence","Be as controversial as possible to get attention","Keep yourself safe"], correctAnswer: 2, explanation: "Active bystandership intervention should avoid being controversial or antagonistic. The goal is to solve the problem peacefully, and being controversial can escalate the conflict." },
          { question: "A student sees a classmate being bullied. The student decides to involve a teacher. This is an example of:", options: ["Individualism","Passive bystandership","Active bystandership","Discrimination"], correctAnswer: 2, explanation: "Intervening to help a victim—whether directly or by involving an authority—is the core definition of active bystandership." },
          { question: "Social cohesion is most similar to which concept studied in History and Citizenship?", options: ["Sovereignty","Unity","Colonialism","Globalization"], correctAnswer: 1, explanation: "Social cohesion is essentially about the unity and bonds within a society that hold it together." },
          { question: "How does discrimination affect an individual's motivation to relate with others?", options: ["It makes them more eager to prove their worth","It has no effect on their social interactions","It reduces their ability and motivation to relate well with those discriminating against them","It encourages them to be more inclusive of others"], correctAnswer: 2, explanation: "Discrimination makes people feel unwanted and excluded, which naturally leads them to withdraw from the group and stop trying to build positive relationships." },
          { question: "True or False: Social cohesion works toward the well-being of all members by fighting exclusion and marginalization.", options: ["True","False"], correctAnswer: 0, explanation: "Social cohesion is specifically aimed at creating a sense of belonging and ensuring that no member of the society is left behind or marginalized." },
          { question: "Which of these is NOT a step toward social cohesion?", options: ["Empathy","Active listening","Marginalization","Inclusiveness"], correctAnswer: 2, explanation: "Marginalization is the act of pushing a group to the edge of society where they have little power. This destroys social cohesion; it doesn't build it." },
          { question: "A bystander notices a child being bullied but decides to walk away because 'it is not my business.' This behavior is described as:", options: ["Active bystandership","Passive bystandership","Inclusiveness","Human Rights advocacy"], correctAnswer: 1, explanation: "Passive bystandership is specifically the act of witnessing a bad situation and choosing not to intervene or help." },
          { question: "What is the core principle behind 'Inclusiveness'?", options: ["Survival of the fittest","Everyone's opinion matters and every person should feel appreciated","The majority always rules without question","Only those with high social status should make decisions"], correctAnswer: 1, explanation: "Inclusiveness is based on the idea that involving everyone, regardless of status, builds trust and mutual respect." },
          { question: "Which of these best describes 'Empathy'?", options: ["Feeling sorry for someone from a distance","Understanding and sharing the feelings of others","Giving money to a charity without knowing what they do","Telling someone their problems are not important"], correctAnswer: 1, explanation: "Empathy is an active emotional connection where you truly understand and feel what another person is going through." },
          { question: "Which of the following is a result of effective social cohesion?", options: ["Increased crime rates","A peaceful and united nation","Frequent civil unrest","Strict segregation of ethnic groups"], correctAnswer: 1, explanation: "The ultimate goal and result of social cohesion is a society that lives in harmony, peace, and unity." },
          { question: "Fill in the blank: In _________, one must show interest in the subject matter and respond only when necessary without interrupting.", options: ["Public speaking","Active listening","Individualism","Bystandership"], correctAnswer: 1, explanation: "These are the key behaviors of an active listener: showing interest, understanding, and respectful response." },
          { question: "Which challenge to social cohesion involves 'treating someone differently in an unjustified way'?", options: ["Individualism","Discrimination","Empathy","Inclusiveness"], correctAnswer: 1, explanation: "This is the core definition of discrimination, which can be based on age, sex, status, or other factors." },
          { question: "True or False: Social cohesion is similar to the concept of 'unity in diversity' found in some religious studies.", options: ["True","False"], correctAnswer: 0, explanation: "Both concepts emphasize finding common ground and bonds among people who may have different backgrounds or beliefs." },
          { question: "Which of these is a key unit competence regarding social cohesion?", options: ["To be able to win arguments in social settings","To be able to make decisions that promote social cohesion in practical situations","To know the names of all world leaders","To be able to live completely independently of others"], correctAnswer: 1, explanation: "The primary goal of learning about social cohesion is to be able to apply that knowledge to real-life decisions that keep society united." }
        ])
      },
      {
        title: "GS & CS S4 - Unit 1: Social Cohesion (Medium)",
        description: "Intermediate understanding of factors promoting and hindering social cohesion.",
        subject: "GS & CS",
        level: "S4",
        difficulty: "medium",
        duration: 20,
        levelId: s4LevelId,
        courseId: gsCsCourseId,
        unitId: unit1Id,
        questions: buildQuestions([
          { question: "In the context of active bystandership, which step should be taken after noticing a situation and interpreting it as an emergency?", options: ["Immediately call the media","Imagine yourself in the situation of the person in need (empathize)","Wait for someone else to intervene first","Physically confront the perpetrator with violence"], correctAnswer: 1, explanation: "According to the steps of active bystandership, after noticing and interpreting an emergency, one should empathize with the victim before intervening. This helps in understanding the urgency and the type of help required." },
          { question: "How can the right to 'self-expression' potentially hinder social cohesion?", options: ["By allowing everyone to share their constructive ideas","By being used by some to spread hatred between different groups","By encouraging people to write books and poetry","By promoting transparency in government actions"], correctAnswer: 1, explanation: "While self-expression is a human right, if it is misused to spread hate speech or incite conflict between groups, it leads to a breakdown in the social bond and harmony required for cohesion." },
          { question: "Inclusiveness is not just physical presence. What else does it essentially involve?", options: ["Ensuring everyone is wearing the same uniform","Intentionally planning for the success of everyone","Having a large number of people in a room","Forcing everyone to agree with the majority"], correctAnswer: 1, explanation: "Inclusiveness goes beyond just being present; it is the active and intentional act of involving all parties and ensuring the environment allows everyone to succeed and feel valued." },
          { question: "Assertion (A): Religious values generally promote social cohesion.\nReason (R): Most religions advocate for values like love, honesty, and care for the needy.", options: ["Both A and R are true, and R explains A","Both A and R are true, but R does not explain A","A is true, but R is false","A is false, but R is true"], correctAnswer: 0, explanation: "Religious values such as love and honesty naturally draw people together and encourage harmonious living, which directly supports and explains how they promote social cohesion." },
          { question: "Identify the error in the following statement: 'Discrimination is the act of treating everyone equally regardless of their social status or skin color.'", options: ["The word 'Discrimination' should be 'Inclusiveness'","The word 'equally' should be 'differently and unjustly'","The phrase 'social status' should be 'financial status'","There is no error in the statement"], correctAnswer: 1, explanation: "Discrimination is defined by treating someone *differently* and in an *unjustified* way based on specific characteristics, which is the opposite of equal treatment." },
          { question: "In the context of the Rwandan concept 'Abarinzi b’igihango,' what value was most prominently demonstrated during the 1994 Genocide against the Tutsi?", options: ["Individualism","Empathy","Bystandership","Competition"], correctAnswer: 1, explanation: "The 'Abarinzi b’igihango' (Protectors of the Covenant) demonstrated deep empathy by risking their lives to save others because they understood and shared the suffering of those being targeted." },
          { question: "What is the likely outcome in a society where members primarily practice 'passive' bystandership?", options: ["High levels of trust and mutual support","Increased social cohesion and national unity","A breakdown in social bonds because no one cares for the other","Improved communication between different social groups"], correctAnswer: 2, explanation: "Passive bystandership involves watching someone suffer without helping. This creates an environment of indifference and fear, which is a major hindrance to social cohesion." },
          { question: "Which scenario best illustrates 'Active Listening'?", options: ["Ntwari hears his friend talking while he checks his phone for messages","Keza waits for her turn to speak while mentally planning her counter-argument","Musa focuses on his friend's words, asks clarifying questions, and does not interrupt","Alice nods frequently but is actually thinking about what to cook for dinner"], correctAnswer: 2, explanation: "Active listening requires full attention, avoiding interruptions, and showing genuine interest to understand the speaker's message." },
          { question: "If an Executive Secretary plans a community feast and only serves one type of food that a minority group cannot eat for religious reasons, which principle is being violated?", options: ["Individualism","Inclusiveness","Human Rights","Active Bystandership"], correctAnswer: 1, explanation: "Inclusiveness involves considering the needs and views of all members. Neglecting the dietary restrictions of a specific religious group fails to make them feel included and appreciated." },
          { question: "Arrange the following steps of active bystandership in the correct order:", options: ["1. Intervene in the situation, 2. Interpret if it is an emergency, 3. Notice what is happening, 4. Empathize with the victim","1. Notice what is happening, 2. Interpret if it is an emergency, 3. Empathize with the victim, 4. Intervene in the situation","1. Empathize with the victim, 2. Notice what is happening, 3. Intervene, 4. Interpret the emergency","1. Interpret the emergency, 2. Intervene, 3. Notice what is happening, 4. Empathize"], correctAnswer: 1, explanation: "The logical sequence begins with awareness (noticing), followed by assessment (interpreting), emotional connection (empathy), and finally taking action (intervention)." },
          { question: "Why is 'Upward Mobility' mentioned as a benefit of social cohesion?", options: ["It allows people to move to higher altitudes for better health","It provides members the opportunity to improve their social or economic status","It means people can travel more easily between countries","It forces everyone to have the same income level"], correctAnswer: 1, explanation: "Social cohesion ensures that the system is fair and supportive enough that individuals have the opportunity to improve their lives and move 'upward' in society." },
          { question: "Which of these is a situational judgment: You are in a group where one member is constantly ignored during discussions. What is the BEST action to promote social cohesion?", options: ["Stay quiet to avoid conflict with the dominant members","Join the others in ignoring the person so the work finishes faster","Actively invite the ignored member to share their opinion and listen to them","Tell the ignored member to speak louder next time"], correctAnswer: 2, explanation: "Inviting the ignored member promotes inclusiveness and active listening, which are core factors of social cohesion. It makes everyone feel valued." },
          { question: "When religious groups 'opt to keep to themselves' and view others as 'infidels,' this is an example of:", options: ["Religious values promoting cohesion","Religious intolerance acting as a challenge to cohesion","Inclusiveness in a religious context","Active listening between faiths"], correctAnswer: 1, explanation: "Intolerance occurs when groups refuse to accept others' beliefs, leading to isolation and bad feelings, which actively breaks down social cohesion." },
          { question: "Case Study: In a school, students from different backgrounds are encouraged to participate in 'Itorero' programs. These programs teach patriotism and social relations.\nQuestion: Which factor of social cohesion is primarily being utilized here?", options: ["Individualism","Societal norms and cultural values","Discrimination","Passive bystandership"], correctAnswer: 1, explanation: "The 'Itorero' is a cultural program that uses shared values and traditions to instill patriotism and improve how people relate to one another." },
          { question: "From the same scenario, what is the intended outcome of such cultural programs?", options: ["To make students competitive against each other","To promote social cohesion and strengthen the social fabric","To encourage students to focus only on their own studies","To replace academic learning with dancing"], correctAnswer: 1, explanation: "By teaching shared values and social relations, the program aims to unite students and build a stronger, more cohesive community." },
          { question: "What is the primary danger of 'Individualism' in a national context?", options: ["It leads to too much innovation","It hinders national unity because people only care for themselves","It makes the government too powerful","It reduces the number of people available for work"], correctAnswer: 1, explanation: "Individualism promotes a 'self-centered' approach where empathy for others is lost. In a nation, if no one cares for their neighbor, social cohesion and unity become impossible." },
          { question: "Assertion (A): Active listening assists in finding a solution to a problem.\nReason (R): It allows others to express their opinions freely and helps in identifying the root cause of issues.", options: ["Both A and R are true, and R explains A","Both A and R are true, but R does not explain A","A is true, but R is false","A is false, but R is true"], correctAnswer: 0, explanation: "Effective problem-solving requires a clear understanding of the issue and others' perspectives. Active listening provides both, thereby explaining why it helps in finding solutions." },
          { question: "Which factor can act as *both* a promoter and a hinderer of social cohesion?", options: ["Discrimination","Religious values","Individualism","Marginalization"], correctAnswer: 1, explanation: "Religious values promote cohesion through shared morals (love, care), but can hinder it if they lead to intolerance toward those of different faiths." },
          { question: "In the context of Human Rights, social problems arise when:", options: ["Everyone fulfills their responsibilities","Rights are respected by those in power","People fail to fulfill their responsibilities or rights are violated","The culture agrees with the rights being pursued"], correctAnswer: 2, explanation: "Social cohesion breaks down when rights are ignored or when individuals demand rights without fulfilling the duties that come with living in a society." },
          { question: "When intervening as an active bystander, why is it important to 'approach everyone as a friend'?", options: ["To make them buy you something","To avoid escalating the situation into further violence or conflict","Because you should only help people you know","To trick the perpetrator into leaving"], correctAnswer: 1, explanation: "A friendly approach reduces defensiveness and helps in resolving the situation calmly, whereas an antagonistic approach can make things worse." },
          { question: "Why does 'Active Bystandership' foster social cohesion even if the solution offered isn't 'workable'?", options: ["It proves the bystander is better than the victim","It shows the victim that someone is concerned about them","It provides a distraction so the victim can run away","It allows the bystander to gain fame"], correctAnswer: 1, explanation: "The act of intervening itself builds a bond. It tells the victim they are not alone and that they are valued members of the community, which strengthens social ties." },
          { question: "What is 'social fabric' in the context of a nation?", options: ["The type of cloth used for national costumes","The values and ways people relate to one another","The physical infrastructure like roads and bridges","The total population count of the country"], correctAnswer: 1, explanation: "Social fabric is a metaphor for the complex web of relationships and shared values that hold a society together." },
          { question: "In a school setting, 'Inclusion' means:", options: ["Children with special needs should always be kept in separate buildings","Only the smartest students should be involved in decision making","Planning for the success of every student regardless of their abilities","Making everyone follow the exact same learning pace"], correctAnswer: 2, explanation: "Inclusion in education means creating an environment where every student's needs are met so they can succeed alongside their peers." },
          { question: "Assertion (A): Discrimination reduces a person's ability to relate well with others.\nReason (R): Being discriminated against makes a person feel unwanted and excluded.", options: ["Both A and R are true, and R explains A","Both A and R are true, but R does not explain A","A is true, but R is false","A is false, but R is true"], correctAnswer: 0, explanation: "The feeling of being unwanted is the psychological result of discrimination, and this feeling is exactly why the person withdraws from social interaction." }
        ])
      },
      {
        title: "GS & CS S4 - Unit 1: Social Cohesion (Hard)",
        description: "Advanced and application-level questions on social cohesion.",
        subject: "GS & CS",
        level: "S4",
        difficulty: "hard",
        duration: 25,
        levelId: s4LevelId,
        courseId: gsCsCourseId,
        unitId: unit1Id,
        questions: buildQuestions([
          { question: "In African cultures, greetings often involve shaking hands to show warmth. Why might this hinder cohesion if applied in some Western contexts?", options: ["It is seen as a sign of weakness","It might be mistaken as being intrusive or a violation of personal space","It is considered too formal for daily use","It is only reserved for religious ceremonies"], correctAnswer: 1, explanation: "Cultural norms vary; while handshaking is a sign of closeness in many African cultures, in some Western countries, physical contact during greetings might be viewed as an intrusion into personal space, potentially causing discomfort or social friction." },
          { question: "Assertion (A): Some societal norms can be a cause of disunity if applied in a different society.\nReason (R): Cultural practices like hugging or handshaking have universal meanings that are never misinterpreted.", options: ["Both A and R are true, and R explains A","Both A and R are true, but R does not explain A","A is true, but R is false","A is false, but R is true"], correctAnswer: 2, explanation: "While A is true (norms can cause disunity elsewhere), R is false because cultural practices do NOT have universal meanings; a hug might be friendly in one place but offensive or intrusive in another." },
          { question: "Which of the following describes a 'Best Answer' scenario for practicing inclusiveness at a workplace?", options: ["Hiring only people from the same neighborhood","Allowing everyone to attend meetings but only the manager speaks","Creating a plan where every employee's unique needs are considered for their success","Ignoring employee differences to treat everyone exactly the same"], correctAnswer: 2, explanation: "Inclusiveness is about intentional planning for the success of *everyone*, which means recognizing and accommodating individual needs rather than just ignoring differences." },
          { question: "How does social cohesion 'balance individual rights against those of society'?", options: ["By taking away all individual rights","By ensuring individual freedom does not harm the common good","By letting individuals do whatever they want","By making society's needs the only priority"], correctAnswer: 1, explanation: "Cohesion requires that while individuals have rights, they must respect the values and rights of others to maintain a harmonious relationship within the society." }
        ])
      },
      {
        title: "GS & CS S4 - Unit 1: Social Cohesion (Application)",
        description: "Real-world application and scenario-based questions on social cohesion.",
        subject: "GS & CS",
        level: "S4",
        difficulty: "application",
        duration: 30,
        levelId: s4LevelId,
        courseId: gsCsCourseId,
        unitId: unit1Id,
        questions: buildQuestions([
          { question: "Select ALL the factors that typically promote social cohesion:", options: ["Active listening","Individualism","Inclusiveness","Discrimination"], correctAnswer: ["Active listening","Inclusiveness"], explanation: "Active listening and inclusiveness are positive traits that build trust and bonds, whereas individualism and discrimination are challenges that destroy social cohesion." },
          { question: "Select ALL that apply: What are the negative effects of Individualism on a society?", options: ["It limits cooperation","It encourages empathy","It makes people self-centered","It promotes national unity"], correctAnswer: ["It limits cooperation","It makes people self-centered"], explanation: "Individualism moves people away from the group, reducing their willingness to cooperate and making them focus only on their own needs." }
        ])
      }
    ];

    console.log("🌱 Seeding GS & CS S4 Unit 1 quizzes...");
    for (const q of quizzesData) {
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
      console.log(`✅ Inserted quiz: ${q.title} with ${q.questions.length} questions.`);
    }

    console.log(`✅ Seeded ${quizzesData.length} quizzes for GS & CS S4 Unit 1: Social Cohesion.`);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

seedGSandCS_S4_Unit1();