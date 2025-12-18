import PostCard from './PostCard'

export default function PostList({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-4">
      {posts?.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  )
}
