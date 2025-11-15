import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, grade_level, duration, learning_objectives } = await request.json();

    const mockOutline = {
      outline: {
        modules: [
          {
            id: 'module-1',
            title: `Introduction to ${topic}`,
            duration: '2 days',
            topics: ['Definition', 'Importance', 'Historical context'],
            learning_objectives: ['Understand basic concepts', 'Identify key components']
          },
          {
            id: 'module-2',
            title: `Core Concepts of ${topic}`,
            duration: '3 days',
            topics: ['Key principles', 'Applications', 'Examples'],
            learning_objectives: ['Apply theoretical knowledge', 'Analyze real-world examples']
          },
          {
            id: 'module-3',
            title: `Advanced ${topic} Topics`,
            duration: '2 days',
            topics: ['Complex scenarios', 'Problem solving', 'Critical thinking'],
            learning_objectives: ['Evaluate complex situations', 'Develop solutions']
          },
          {
            id: 'module-4',
            title: `Assessment & Review`,
            duration: '1 day',
            topics: ['Summary', 'Quiz', 'Discussion'],
            learning_objectives: ['Demonstrate understanding', 'Reflect on learning']
          }
        ]
      },
      suggestions: [
        'Add interactive diagrams to visualize concepts',
        'Include hands-on activities for better engagement',
        'Create real-world connection examples',
        'Add multimedia content for different learning styles'
      ],
      estimated_time: '2 weeks',
      difficulty: 'medium'
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      data: mockOutline,
      message: 'AI outline generated successfully',
      demo: true,
      note: 'This is a demo response. Connect OpenAI API for real AI generation.'
    });

  } catch (error) {
    console.error('Error generating outline:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate outline',
        demo: true 
      },
      { status: 500 }
    );
  }
}
