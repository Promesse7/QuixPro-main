// components/dashboard/Achievements.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

interface Achievement {
    id: string;
    title: string;
    description: string;
    type: 'certificate'; // Only certificates are achievements for now
}

export function Achievements({ achievements }: { achievements: Achievement[] }) {
    if (!achievements || achievements.length === 0) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
                <div className="text-center py-8 px-4 bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg">
                    <p className="text-muted-foreground">No achievements yet. Keep learning to earn your first one!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
            <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {achievements.map((achievement) => (
                            <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
                                <ShieldCheckIcon className="h-8 w-8 text-yellow-400" />
                                <div>
                                    <p className="font-semibold text-foreground">{achievement.title}</p>
                                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
