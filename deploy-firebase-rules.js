const { exec } = require('child_process');
const fs = require('fs');

// Read the database rules
const rules = JSON.parse(fs.readFileSync('database.rules.json', 'utf8'));

// Deploy using Firebase CLI
exec(`echo '${JSON.stringify(rules)}' | firebase deploy --only database.rules`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error deploying Firebase rules:', error);
    return;
  }
  console.log('Firebase rules deployed successfully!');
  console.log(stdout);
});
