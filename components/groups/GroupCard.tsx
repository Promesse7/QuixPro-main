export default function GroupCard({ group }: { group: any }) {
  return (
    <div className="p-3 border rounded">
      <div className="font-medium">{group.name}</div>
      <div className="text-xs text-muted-foreground">{group.description}</div>
    </div>
  )
}
