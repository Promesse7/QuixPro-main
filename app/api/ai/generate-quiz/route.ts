import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/ai/generate-quiz - Generate quiz from content blocks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, questionCount = 5, difficulty = 'medium', questionTypes = ['multiple_choice'] } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Extract text from content blocks
      // Treat math blocks like text for quiz generation (use latex if present)
      const textContent = Array.isArray(content)
        ? content
            .map((block: any) => {
              if (block.type === 'text' || block.type === 'math') return block.content?.text || block.content?.latex || '';
              if (block.type === 'heading') return block.content?.heading || '';
              return '';
            })
            .filter(Boolean)
            .join('\n\n')
        : typeof content === 'string'
        ? content
        : '';

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are an educational quiz generator. Generate ${questionCount} multiple-choice questions based on the provided content. Return a JSON array with questions, each having: question (string), options (array of 4 strings), correctAnswer (0-3 index), and explanation (string).`,
              },
              {
                role: 'user',
                content: `Generate ${questionCount} ${difficulty} difficulty questions from this content:\n\n${textContent.substring(0, 3000)}`,
              },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = JSON.parse(data.choices[0]?.message?.content || '{}');
          
          if (aiResponse.questions) {
            return NextResponse.json({
              success: true,
              data: {
                quiz: {
                  questions: aiResponse.questions.map((q: any, idx: number) => ({
                    id: `q${idx + 1}`,
                    question: q.question,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer ?? 0,
                    explanation: q.explanation || '',
                  })),
                  difficulty,
                  questionCount,
                },
              },
            });
          }
        }
      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
      }
    }

    // Mock quiz generation
    const mockQuestions = Array.from({ length: questionCount }, (_, i) => ({
      id: `q${i + 1}`,
      question: `What is a key concept from the content? (Question ${i + 1})`,
      options: [
        'Option A - First concept',
        'Option B - Second concept (Correct)',
        'Option C - Third concept',
        'Option D - Fourth concept',
      ],
      correctAnswer: 1,
      explanation: 'This question tests understanding of the main concepts presented in the content.',
    }));

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      data: {
        quiz: {
          questions: mockQuestions,
          difficulty,
          questionCount,
        },
      },
      metadata: {
        demo: !openaiApiKey,
        note: openaiApiKey
          ? 'AI generation failed, using mock questions'
          : 'Set OPENAI_API_KEY for real AI quiz generation',
      },
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}
