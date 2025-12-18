import Link from 'next/link'

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="p-4 border rounded">
      <Link href={`/quix-sites/${post._id}`} className="text-lg font-semibold">{post.title}</Link>
      <p className="text-sm text-muted-foreground">{post.summary || post.body?.slice(0, 200)}</p>
      <div className="mt-2 text-xs">Votes: {post.votes || 0}</div>
    </div>
  )
}
