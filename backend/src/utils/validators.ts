export const isObjectId = (s: string) => /^[a-fA-F0-9]{24}$/.test(s)

export function requireFields(obj: any, fields: string[]) {
  const missing = fields.filter((f) => obj[f] === undefined || obj[f] === null)
  if (missing.length) throw new Error(`Missing fields: ${missing.join(',')}`)
}
