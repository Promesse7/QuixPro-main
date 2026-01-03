import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

interface Params {
    id: string;
}

interface RelatedQuiz {
    _id: string;
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    questions: number;
    duration: number;
}

// GET /api/groups/{id}/related-quizzes - Get quizzes related to group's subject
export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const { id: groupId } = params;
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '5');

        if (!ObjectId.isValid(groupId)) {
            return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
        }

        const db = await getDatabase();
        const groupsCollection = db.collection("groups");
        const quizzesCollection = db.collection("quizzes");

        // Get group to find its subject
        const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) });
        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        const groupSubject = group.subject || 'General';

        // Build query for related quizzes
        const query: any = {
            isPublic: true,
            $or: [
                // Exact subject match
                { subject: { $regex: new RegExp(groupSubject, 'i') } },
                // Or general quizzes if no specific subject
                ...(groupSubject === 'General' ? [{}] : [])
            ]
        };

        // Fetch related quizzes
        const quizzes = await quizzesCollection.find(query)
            .sort({ rating: -1, createdAt: -1 })
            .limit(limit)
            .toArray();

        // If not enough quizzes found, fetch any public quizzes
        if (quizzes.length < limit && groupSubject !== 'General') {
            const additionalQuizzes = await quizzesCollection.find({
                isPublic: true,
                _id: { $nin: quizzes.map(q => q._id) }
            })
                .sort({ rating: -1, createdAt: -1 })
                .limit(limit - quizzes.length)
                .toArray();

            quizzes.push(...additionalQuizzes);
        }

        // Format response
        const relatedQuizzes: RelatedQuiz[] = quizzes.map(quiz => ({
            _id: quiz._id.toString(),
            id: quiz.id || quiz._id.toString(),
            title: quiz.title,
            subject: quiz.subject || 'General',
            difficulty: quiz.difficulty || 'Medium',
            questions: quiz.questions || quiz.questionIds?.length || 0,
            duration: quiz.duration || 10
        }));

        return NextResponse.json({
            quizzes: relatedQuizzes,
            groupSubject
        });
    } catch (error) {
        console.error("Failed to fetch related quizzes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
