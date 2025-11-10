const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined");
  process.exit(1);
}

async function awardAccountCreationBadge() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const usersCol = db.collection("users");
    const badgesCol = db.collection("badges");

    const accountBadge = await badgesCol.findOne({ name: "Account Creator" });
    if (!accountBadge) {
      console.error("❌ Account Creator badge not found. Run scripts/seed-account-creation-badge.js first.");
      process.exit(1);
    }

    const users = await usersCol.find({}).toArray();
    let awarded = 0;

    for (const user of users) {
      const hasBadge = (user.gamification?.badges || []).some(
        (b) => String(b.badgeId) === String(accountBadge._id) || b.name === "Account Creator"
      );
      if (hasBadge) continue;

      await usersCol.updateOne(
        { _id: user._id },
        {
          $push: {
            "gamification.badges": {
              badgeId: String(accountBadge._id),
              name: "Account Creator",
              earnedAt: new Date(),
              tier: accountBadge.tier || "silver",
            },
          },
          $inc: { "gamification.totalXP": accountBadge.xpReward || 50 },
          $setOnInsert: {
            gamification: {
              totalXP: (accountBadge.xpReward || 50),
              currentLevel: 1,
              streak: 0,
              lastActivityDate: new Date(),
              badges: [],
            },
          },
        }
      );
      awarded++;
    }

    console.log(`✅ Awarded 'Account Creator' badge to ${awarded} users`);
  } catch (e) {
    console.error("❌ Error awarding badge:", e);
  } finally {
    await client.close();
  }
}

awardAccountCreationBadge();



