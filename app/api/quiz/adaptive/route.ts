import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// POST /api/quiz/adaptive - Get next adaptive question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, userId, answeredQuestions, currentDifficulty } = body;

    const db = await getDatabase();
    const quizzesCol = db.collection("quizzes");
    const progressCol = db.collection("user_progress");

    const quiz = await quizzesCol.findOne({ _id: new ObjectId(quizId) });
    
    if (!quiz || !quiz.isAdaptive) {
      return NextResponse.json({ error: "Not an adaptive quiz" }, { status: 400 });
    }

    // Get user's performance on answered questions (guard inputs)
    const answeredArr = Array.isArray(answeredQuestions) ? answeredQuestions : [];
    const correctCount = answeredArr.filter((q: any) => q.isCorrect).length;
    const totalAnswered = answeredArr.length;
    const accuracy = totalAnswered > 0 ? correctCount / totalAnswered : 0.5;

    // Calculate next difficulty level
    let nextDifficulty = currentDifficulty || quiz.adaptiveSettings?.startDifficulty || 3;
    
    if (totalAnswered >= 3) {
      if (accuracy >= 0.8) {
        nextDifficulty = Math.min(5, nextDifficulty + 1);
      } else if (accuracy < 0.5) {
        nextDifficulty = Math.max(1, nextDifficulty - 1);
      }
    }

    // Find unanswered questions at the target difficulty
      const answeredIds = Array.isArray(answeredQuestions) ? answeredQuestions.map((q: any) => q.questionId) : [];
      const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
      const availableQuestions = questions.filter((q: any) => 
        !answeredIds.includes(q.id) &&
        Math.abs(q.difficultyLevel - nextDifficulty) <= 1
      );

    if (availableQuestions.length === 0) {
      // No more questions at this difficulty, get any unanswered
        const fallbackQuestions = questions.filter((q: any) => 
          !answeredIds.includes(q.id)
        );
      
      if (fallbackQuestions.length === 0) {
        return NextResponse.json({ 
          completed: true,
          finalScore: accuracy * 100,
          message: "Quiz completed"
        });
      }

      return NextResponse.json({
        question: fallbackQuestions[0],
        currentDifficulty: fallbackQuestions[0].difficultyLevel,
        progress: {
          answered: totalAnswered,
            total: questions.length,
          accuracy: accuracy * 100
        }
      });
    }

    // Return random question from available ones
    const nextQuestion = availableQuestions[
      Math.floor(Math.random() * availableQuestions.length)
    ];

    return NextResponse.json({
      question: nextQuestion,
      currentDifficulty: nextDifficulty,
      progress: {
        answered: totalAnswered,
          total: questions.length,
        accuracy: accuracy * 100
      },
      hint: accuracy < 0.5 && nextQuestion.hints ? nextQuestion.hints[0] : null
    });
  } catch (error) {
    console.error("Adaptive quiz error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
