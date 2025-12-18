export interface Group {
  _id?: string
  name: string
  description?: string
  createdBy: string
  members: Array<{ userId: string; role?: string; joinedAt?: Date }>
  createdAt?: Date
  updatedAt?: Date
}
