// components/dashboard/Leaderboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
    rank: number;
    name: string;
    totalPoints: number;
    averageScore: number;
    completedQuizzes: number;
    certificates: number;
    level: string;
    isCurrentUser: boolean;
}

export function Leaderboard({ data, currentUserId }: { data: LeaderboardEntry[], currentUserId?: string }) {
    if (!data || data.length === 0) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Leaderboard</h2>
                <div className="text-center py-8 px-4 bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No rankings yet. Complete some quizzes to get on the board!</p>
                </div>
            </section>
        );
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="h-5 w-5 text-yellow-400" />;
            case 2: return <Medal className="h-5 w-5 text-gray-300" />;
            case 3: return <Award className="h-5 w-5 text-amber-600" />;
            default: return <span className="font-bold w-5 text-center">{rank}</span>;
        }
    };

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Leaderboard</h2>
            <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-400" />
                        <span>Top Performers</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {data.map((user) => (
                            <li 
                                key={`${user.rank}-${user.name}`} 
                                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                    user.isCurrentUser 
                                        ? 'bg-primary/20 border border-primary shadow-md' 
                                        : 'bg-gray-800/50 hover:bg-gray-800/70'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8">
                                        {getRankIcon(user.rank)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`font-medium ${user.isCurrentUser ? 'text-primary' : ''}`}>
                                            {user.name}
                                            {user.isCurrentUser && <span className="ml-2 text-xs bg-primary/30 px-2 py-1 rounded">You</span>}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {user.level} • {user.completedQuizzes} quizzes
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-yellow-400">{user.totalPoints} pts</div>
                                    <div className="text-xs text-muted-foreground">{user.averageScore}% avg</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </section>
    );
}
