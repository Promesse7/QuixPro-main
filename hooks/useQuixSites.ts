import { useState, useEffect } from 'react'

export function useQuixSites() {
  const [posts, setPosts] = useState<any[]>([])
  const fetchPosts = () => {
    fetch('/api/sites/posts')
      .then((r) => r.json())
      .then((j) => setPosts(j.posts || []))
      .catch(() => setPosts([]))
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return { posts, refresh: fetchPosts }
}
