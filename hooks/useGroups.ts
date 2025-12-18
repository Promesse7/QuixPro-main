import { useState, useEffect } from 'react'

export function useGroups() {
  const [groups, setGroups] = useState<any[]>([])
  const fetchGroups = () => {
    fetch('/api/groups')
      .then((r) => r.json())
      .then((j) => setGroups(j.groups || []))
      .catch(() => setGroups([]))
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return { groups, refresh: fetchGroups }
}
