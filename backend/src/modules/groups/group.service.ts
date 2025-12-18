import { getDb } from '../../config/mongo'
import { ObjectId } from 'mongodb'
import { Group } from './group.model'

export class GroupService {
  async createGroup(data: Partial<Group>) {
    const db = await getDb()
    const coll = db.collection('groups')
    const now = new Date()
    const res = await coll.insertOne({ ...data, createdAt: now, updatedAt: now })
    return { ...data, _id: res.insertedId.toString() }
  }

  async getGroup(id: string) {
    const db = await getDb()
    const group = await db.collection('groups').findOne({ _id: new ObjectId(id) })
    return group
  }

  async listGroups(filter = {}) {
    const db = await getDb()
    return db.collection('groups').find(filter).toArray()
  }
}

export const groupService = new GroupService()
