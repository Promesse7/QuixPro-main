import { useState, useEffect } from 'react'

export function useGroups() {
  const [groups, setGroups] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/groups')
      .then((r) => r.json())
      .then((j) => setGroups(j.groups || []))
      .catch(() => setGroups([]))
  }, [])
  return { groups, refresh: () => {} }
}
