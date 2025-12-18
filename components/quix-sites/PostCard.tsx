import Link from 'next/link'

export default function PostCard({ post }: { post: any }) {
  const titleId = `post-${post._id}-title`
  return (
    <article className="p-4 border rounded" role="article" aria-labelledby={titleId}>
      <h2 id={titleId} className="text-lg font-semibold"><Link href={`/quix-sites/${post._id}`}>{post.title}</Link></h2>
      <p className="text-sm text-muted-foreground">{post.summary || post.body?.slice(0, 200)}</p>
      <div className="mt-2 text-xs">Votes: {post.votes || 0}</div>
    </article>
  )
}
