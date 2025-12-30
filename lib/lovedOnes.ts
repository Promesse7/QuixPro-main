export interface LovedOne {
  id: string
  name: string
  email: string
  avatar?: string
  specialColor?: string
  addedAt: Date
}

export class LovedOnesManager {
  private static STORAGE_KEY = 'quixpro_loved_ones'
  
  static getLovedOnes(): LovedOne[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
  
  static addLovedOne(user: Omit<LovedOne, 'addedAt'>): void {
    if (typeof window === 'undefined') return
    const lovedOnes = this.getLovedOnes()
    const exists = lovedOnes.some(love => love.email === user.email)
    if (!exists) {
      lovedOnes.push({ ...user, addedAt: new Date() })
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lovedOnes))
    }
  }
  
  static removeLovedOne(email: string): void {
    if (typeof window === 'undefined') return
    const lovedOnes = this.getLovedOnes().filter(love => love.email !== email)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lovedOnes))
  }
  
  static isLovedOne(email: string): boolean {
    return this.getLovedOnes().some(love => love.email === email)
  }
  
  static getLovedOne(email: string): LovedOne | undefined {
    return this.getLovedOnes().find(love => love.email === email)
  }
}
