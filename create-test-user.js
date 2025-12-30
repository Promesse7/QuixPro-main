// Test script to create a new user with unique ID
const testUser = {
  email: 'testuser@example.com',
  name: 'Test User',
  role: 'student',
  school: 'Test School',
  level: 'Test Level'
}

console.log('Creating test user with unique ID...')
console.log('POST to: http://localhost:3000/api/user-accounts')
console.log('Body:', JSON.stringify(testUser, null, 2))

// You can run this in browser console or use curl:
// curl -X POST http://localhost:3000/api/user-accounts \
//   -H "Content-Type: application/json" \
//   -d '{"email":"testuser@example.com","name":"Test User","role":"student","school":"Test School","level":"Test Level"}'
