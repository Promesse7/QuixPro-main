import Link from 'next/link'

export default function GroupList({ groups }: { groups: any[] }) {
  return (
    <div className="space-y-2">
      {groups?.map((g) => (
        <Link key={g._id} href={`/groups/${g._id}`} className="block p-2 border rounded">
          <div className="font-medium">{g.name}</div>
          <div className="text-xs text-muted-foreground">{g.description}</div>
        </Link>
      ))}
    </div>
  )
}
