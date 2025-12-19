import { getDb } from "../../config/mongo"
import { ObjectId } from "mongodb"
import type { Group } from "./group.model"

class GroupService {
  async createGroup(data: Partial<Group>): Promise<Group> {
    const db = await getDb()
    const coll = db.collection<Group>("groups")
    const now = new Date()
    const groupData = {
      ...data,
      createdAt: now,
      updatedAt: now,
      members: data.members || [],
    }
    const res = await coll.insertOne(groupData as any)
    return {
      ...groupData,
      _id: res.insertedId.toString(),
    } as Group
  }

  async getGroup(id: string): Promise<Group | null> {
    const db = await getDb()
    const group = await db.collection<Group>("groups").findOne({ _id: new ObjectId(id) } as any)
    if (!group) return null
    return {
      ...group,
      _id: group._id?.toString(),
    } as Group
  }

  async listGroups(filter: any = {}): Promise<Group[]> {
    const db = await getDb()
    const groups = await db.collection<Group>("groups").find(filter).toArray()
    return groups.map((g) => ({
      ...g,
      _id: g._id?.toString(),
    })) as Group[]
  }
}

// Create and export the singleton instance
const groupService = new GroupService()

export { groupService }
export { GroupService }
export default groupService
