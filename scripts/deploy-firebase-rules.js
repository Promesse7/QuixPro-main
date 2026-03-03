const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the Firebase rules file
const rulesPath = path.join(__dirname, '../firebase-rules.json');
const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

// Deploy Firebase rules
console.log('Deploying Firebase security rules...');

exec(`firebase deploy --only firestore:rules`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error deploying Firebase rules:', error);
    return;
  }
  
  console.log('Firebase rules deployed successfully!');
  console.log(stdout);
  
  if (stderr) {
    console.log('Warnings:', stderr);
  }
});
