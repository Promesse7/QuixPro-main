export const groupSamples = [
  { _id: 'g1', name: 'Algebra Club', description: 'Weekly problem solving and peer review' },
  { _id: 'g2', name: 'Physics Study Group', description: 'Exam prep and experiment discussions' },
]

export const postSamples = [
  { _id: 'p1', title: 'Factoring quadratics', summary: 'Step-by-step solutions for factoring quadratics', votes: 14 },
  { _id: 'p2', title: 'Integration tricks', summary: 'Common substitution patterns for integrals', votes: 8 },
]

export const chatMessages = [
  { _id: 'm1', senderId: 'u1', sender: { name: 'Alice' }, content: 'Hey everyone — ready to practice?', createdAt: new Date().toISOString(), type: 'text' },
  { _id: 'm2', senderId: 'u2', sender: { name: 'Bob' }, content: 'Yes — let\'s start with question 3', createdAt: new Date().toISOString(), type: 'text' },
]
