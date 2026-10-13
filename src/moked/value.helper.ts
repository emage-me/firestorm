import { get } from '../object.helper'

type ItemFilter = (item: any) => boolean

const isDateLike = (value: any): boolean => value instanceof Date || typeof value?.toMillis === 'function'

const toMillis = (value: any): number => value instanceof Date ? value.getTime() : value.toMillis()

const isPlainObject = (value: any): boolean =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && !isDateLike(value)

export const isEqual = (value: any, other: any): boolean => {
  if (isDateLike(value) && isDateLike(other)) return toMillis(value) === toMillis(other)
  if (Array.isArray(value) && Array.isArray(other)) {
    return value.length === other.length && value.every((element, index) => isEqual(element, other[index]))
  }
  if (isPlainObject(value) && isPlainObject(other)) {
    const keys = Object.keys(value)
    return keys.length === Object.keys(other).length && keys.every(key => isEqual(value[key], other[key]))
  }
  return value === other
}

// Firestore value type ordering: null < boolean < number < timestamp < string < array < map
const typeRank = (value: any): number => {
  if (value === null) return 0
  if (typeof value === 'boolean') return 1
  if (typeof value === 'number') return 2
  if (isDateLike(value)) return 3
  if (typeof value === 'string') return 4
  if (Array.isArray(value)) return 5
  return 6
}

export const compareValues = (value: any, other: any): number => {
  const rankDifference = typeRank(value) - typeRank(other)
  if (rankDifference !== 0) return rankDifference
  if (isDateLike(value)) return toMillis(value) - toMillis(other)
  if (Array.isArray(value)) {
    for (let index = 0; index < Math.min(value.length, other.length); index++) {
      const comparison = compareValues(value[index], other[index])
      if (comparison !== 0) return comparison
    }
    return value.length - other.length
  }
  if (isPlainObject(value)) return compareValues(JSON.stringify(value), JSON.stringify(other))
  if (value < other) return -1
  if (value > other) return 1
  return 0
}

const isComparable = (value: any, other: any): boolean => value !== undefined && typeRank(value) === typeRank(other)

const exists = (value: any): boolean => value !== undefined

const asArray = (value: any): any[] => Array.isArray(value) ? value : []

// Accepts a string path or a Firestore FieldPath (FieldPath.documentId() targets the document id)
export const normalizeFieldPath = (fieldPath: any): string => {
  const path: string = typeof fieldPath === 'string'
    ? fieldPath
    : fieldPath?.segments?.join('.') ?? String(fieldPath)
  return path === '__name__' ? 'id' : path
}

export const buildFilter = (fieldPath: string, operator: string, value: any): ItemFilter => {
  const valueOf = (item: any): any => get(item, fieldPath)
  switch (operator) {
    case '==':
      return item => isEqual(valueOf(item), value)
    case '!=':
      return item => exists(valueOf(item)) && !isEqual(valueOf(item), value)
    case '<':
      return item => isComparable(valueOf(item), value) && compareValues(valueOf(item), value) < 0
    case '<=':
      return item => isComparable(valueOf(item), value) && compareValues(valueOf(item), value) <= 0
    case '>':
      return item => isComparable(valueOf(item), value) && compareValues(valueOf(item), value) > 0
    case '>=':
      return item => isComparable(valueOf(item), value) && compareValues(valueOf(item), value) >= 0
    case 'array-contains':
      return item => asArray(valueOf(item)).some(element => isEqual(element, value))
    case 'array-contains-any':
      return item => asArray(valueOf(item)).some(element => asArray(value).some(expected => isEqual(element, expected)))
    case 'in':
      return item => exists(valueOf(item)) && asArray(value).some(expected => isEqual(valueOf(item), expected))
    case 'not-in':
      return item => exists(valueOf(item)) && !asArray(value).some(expected => isEqual(valueOf(item), expected))
    default:
      throw new Error(`WhereFIlterOp ${operator} not implemented in firestrom mock`)
  }
}

// Applies a FieldValue sentinel (increment, arrayUnion, arrayRemove, delete, serverTimestamp) to the current value
export const resolveFieldValue = (currentValue: any, value: any): any => {
  switch (value?.methodName) {
    case 'FieldValue.increment':
      return (typeof currentValue === 'number' ? currentValue : 0) + Number(value.operand)
    case 'FieldValue.arrayUnion':
      return asArray(currentValue).concat(
        asArray(value.elements).filter(element => !asArray(currentValue).some(existing => isEqual(existing, element))))
    case 'FieldValue.arrayRemove':
      return asArray(currentValue).filter(existing => !asArray(value.elements).some(element => isEqual(existing, element)))
    case 'FieldValue.delete':
      return undefined
    case 'FieldValue.serverTimestamp':
      return new Date()
    default:
      return value
  }
}
