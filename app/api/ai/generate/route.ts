import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/ai/generate - General AI content generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, type, context, options } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (openaiApiKey && type !== 'demo') {
      // Real AI integration with OpenAI
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: options?.model || 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are an educational content assistant. Generate ${type || 'content'} based on the user's request.`,
              },
              {
                role: 'user',
                content: context ? `${context}\n\n${prompt}` : prompt,
              },
            ],
            temperature: options?.temperature || 0.7,
            max_tokens: options?.maxTokens || 1000,
          }),
        });

        if (!response.ok) {
          throw new Error('OpenAI API error');
        }

        const data = await response.json();
        const generatedContent = data.choices[0]?.message?.content || '';

        return NextResponse.json({
          success: true,
          data: {
            content: generatedContent,
            type,
            metadata: {
              model: options?.model || 'gpt-3.5-turbo',
              tokens: data.usage?.total_tokens,
            },
          },
        });
      } catch (aiError) {
        console.error('OpenAI API error:', aiError);
        // Fall through to mock response
      }
    }

    // Mock response (fallback or demo mode)
    const mockResponses: Record<string, string> = {
      outline: `# Course Outline: ${prompt}

## Module 1: Introduction
- Overview of key concepts
- Learning objectives
- Prerequisites

## Module 2: Core Concepts
- Fundamental principles
- Key terminology
- Basic applications

## Module 3: Advanced Topics
- Complex scenarios
- Problem-solving strategies
- Real-world applications

## Module 4: Assessment
- Review and summary
- Practice exercises
- Final assessment`,
      summary: `## Summary

${prompt} covers essential concepts that form the foundation of understanding. Key points include:

1. **Main Concept**: The primary idea that drives understanding
2. **Applications**: How this knowledge is used in practice
3. **Examples**: Real-world scenarios that demonstrate relevance

This content provides a comprehensive overview suitable for educational purposes.`,
      quiz: `## Quiz Questions

1. What is the primary concept discussed?
   a) Option A
   b) Option B (Correct)
   c) Option C
   d) Option D

2. Which application is most relevant?
   a) Application A
   b) Application B
   c) Application C (Correct)
   d) Application D`,
      expand: `${prompt}

### Detailed Explanation

This concept involves multiple interconnected components that work together to achieve specific outcomes. Understanding these relationships is crucial for mastery.

### Key Components

- **Component 1**: Description and importance
- **Component 2**: Role and function
- **Component 3**: Integration with other elements

### Practical Applications

Real-world scenarios demonstrate how this knowledge applies in various contexts, making learning more engaging and relevant.`,
    };

    const mockContent = mockResponses[type || 'expand'] || mockResponses.expand;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: {
        content: mockContent,
        type: type || 'expand',
        metadata: {
          demo: true,
          note: openaiApiKey
            ? 'AI API call failed, using mock response'
            : 'OpenAI API key not configured. Set OPENAI_API_KEY in environment variables for real AI generation.',
        },
      },
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

