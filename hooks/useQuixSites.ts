import { useState, useEffect } from 'react'

export function useQuixSites() {
  const [posts, setPosts] = useState<any[]>([])
  const fetchPosts = () => {
    fetch('/api/sites/posts')
      .then((r) => r.json())
      .then((j) => setPosts(j.posts || []))
      .catch((error) => {
        console.error('Failed to fetch posts:', error)
        setPosts([])
      })
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return { posts, refresh: fetchPosts }
}
