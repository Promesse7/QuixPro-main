// components/dashboard/Leaderboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface LeaderboardEntry {
    rank: number;
    name: string;
    xp: number;
    isCurrentUser: boolean;
}

export function Leaderboard({ data }: { data: LeaderboardEntry[] }) {
    if (!data || data.length === 0) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Leaderboard</h2>
                <div className="text-center py-8 px-4 bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg">
                    <p className="text-muted-foreground">No rankings yet. Complete some quizzes to get on the board!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Leaderboard</h2>
            <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrophyIcon className="h-6 w-6 text-yellow-400" />
                        <span>Top Performers</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {data.map((user) => (
                            <li key={user.rank} className={`flex items-center justify-between p-2 rounded-lg ${user.isCurrentUser ? 'bg-primary/20 border border-primary' : 'bg-gray-800/50'}`}>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold w-6 text-center">{user.rank}</span>
                                    <span className={user.isCurrentUser ? 'font-bold' : ''}>{user.name}</span>
                                </div>
                                <span className="font-semibold text-yellow-400">{user.xp} XP</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </section>
    );
}
