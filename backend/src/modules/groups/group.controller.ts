import type { NextApiRequest, NextApiResponse } from 'next'
import { groupService } from './group.service'

export async function createGroupHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body
    const g = await groupService.createGroup({ ...body })
    res.status(201).json({ success: true, group: g })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}

export async function listGroupsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const groups = await groupService.listGroups()
    res.json({ success: true, groups })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
}
