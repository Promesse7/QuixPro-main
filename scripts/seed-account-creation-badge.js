const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGODB_URI =  "mongodb+srv://promesserukundo:prom123mongodb@hb-cluster.t9u7h.mongodb.net/QuixDB?retryWrites=true&w=majority&appName=hb-cluster";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined");
  process.exit(1);
}

async function seedAccountCreationBadge() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();
    const badgesCollection = db.collection("badges");

    // Check if badge already exists
    const existingBadge = await badgesCollection.findOne({
      name: "Account Creator",
    });

    if (existingBadge) {
      console.log("✅ Account Creator badge already exists");
      return;
    }

    // Create the Account Creation badge
    const accountCreationBadge = {
      name: "Account Creator",
      category: "Community",
      tier: "Silver",
      description: "Welcome to Qouta! You've created your account and started your learning journey.",
      icon: "🎉",
      color: "from-blue-500 to-cyan-500",
      unlockCriteria: {
        type: "account_created",
        threshold: 1,
      },
      xpReward: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
      shareableDescription: "Just joined Qouta and started learning! 🎓",
    };

    const result = await badgesCollection.insertOne(accountCreationBadge);
    console.log("✅ Account Creator badge created successfully!");
    console.log(`   Badge ID: ${result.insertedId}`);
  } catch (error) {
    console.error("❌ Error seeding badge:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedAccountCreationBadge();
