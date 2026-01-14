export default function AnswerCard({ answer }: { answer: any }) {
  return (
    <div className="p-3 border rounded">
      <div className="text-sm">{answer.body}</div>
      <div className="text-xs text-muted-foreground">By {answer.author}</div>
    </div>
  )
}
