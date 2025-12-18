import { useState, useEffect } from 'react'

export function useQuixSites() {
  const [posts, setPosts] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/sites/posts')
      .then((r) => r.json())
      .then((j) => setPosts(j.posts || []))
      .catch(() => setPosts([]))
  }, [])
  return { posts, refresh: () => {} }
}
