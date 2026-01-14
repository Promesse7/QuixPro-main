// components/dashboard/AnalyticsSection.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export function AnalyticsSection({ analytics }: { analytics: any }) {
    if (!analytics) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Your Analytics</h2>
                <div className="text-center text-muted-foreground p-8">
                    Loading analytics data...
                </div>
            </section>
        );
    }

    const { weeklyActivity = [], subjectDistribution = [], difficultyBreakdown = [], chatActivity = [] } = analytics;

    const renderChart = (data: any[], dataKey: string, name: string) => (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey={dataKey} name={name} fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );

    const renderPieChart = (data: any[], dataKey: string, nameKey: string) => (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );

    const renderAnalyticsCard = (title: string, description: string, data: any[], chart: React.ReactNode) => (
        <Card className="border-border/50 shadow-lg hover-lift">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardHeader>
            <CardContent>
                {data && data.length > 0 ? chart : <p className="text-center text-muted-foreground">No data available.</p>}
            </CardContent>
        </Card>
    );

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Your Analytics</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {renderAnalyticsCard('Weekly Quiz Activity', 'Quizzes attempted per day', weeklyActivity, renderChart(weeklyActivity, 'attempts', 'Attempts'))}
                {renderAnalyticsCard('Subject Distribution', 'Breakdown by subject', subjectDistribution, renderPieChart(subjectDistribution, 'count', 'subject'))}
                {renderAnalyticsCard('Difficulty Breakdown', 'From Easy to Expert', difficultyBreakdown, renderPieChart(difficultyBreakdown, 'count', 'difficulty'))}
                {renderAnalyticsCard('Chat Activity', 'Messages sent per day', chatActivity, renderChart(chatActivity, 'messages', 'Messages'))}
            </div>
        </section>
    );
}
