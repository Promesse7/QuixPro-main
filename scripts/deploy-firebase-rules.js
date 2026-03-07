const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the Firebase rules file
const rulesPath = path.join(__dirname, '../firebase-rules.json');
const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

// Write rules to a temporary file for deployment
const tempRulesPath = path.join(__dirname, '../firebase-rules.temp.json');
fs.writeFileSync(tempRulesPath, JSON.stringify(rules, null, 2));

// Deploy Firebase Realtime Database rules
console.log('Deploying Firebase Realtime Database rules...');

exec(`firebase deploy --only database:rules`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error deploying Firebase rules:', error);
    return;
  }

  console.log('Firebase rules deployed successfully!');
  console.log(stdout);

  if (stderr) {
    console.log('Warnings:', stderr);
  }

  // Clean up temporary file
  fs.unlinkSync(tempRulesPath);
});
