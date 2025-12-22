// components/dashboard/RecommendedQuizzes.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface RecommendedQuiz {
    id: string;
    title: string;
    subject: string;
    reason: string;
}

export function RecommendedQuizzes({ quizzes }: { quizzes: RecommendedQuiz[] }) {
    if (!quizzes || quizzes.length === 0) {
        return (
            <section className="space-y-4">
                 <h2 className="text-xl font-semibold text-foreground">Recommended For You</h2>
                <div className="text-center py-8 px-4 bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg">
                    <p className="text-muted-foreground">No recommendations right now. Keep learning to see more!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Recommended For You</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {quizzes.map((quiz) => (
                    <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                        <Card className="h-full bg-card/60 backdrop-blur-sm border-border/50 shadow-lg hover:bg-gray-800/60 transition-colors">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LightBulbIcon className="h-5 w-5 text-yellow-400" />
                                    <span>{quiz.title}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Subject: {quiz.subject}</p>
                                <p className="text-sm text-muted-foreground">Reason: {quiz.reason}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
