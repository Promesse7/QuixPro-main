export default function GroupCard({ group }: { group: any }) {
  return (
    <div className="p-3 border rounded" role="group" aria-labelledby={`group-${group._id}-title`}>
      <div id={`group-${group._id}-title`} className="font-medium">{group.name}</div>
      <div className="text-xs text-muted-foreground">{group.description}</div>
    </div>
  )
}
