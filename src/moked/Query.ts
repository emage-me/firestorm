import { get } from '../object.helper'
import cloneDeep from 'lodash.clonedeep'
import { Instance } from './Instance'
import { parentIds } from './store'
import { buildFilter, compareValues, normalizeFieldPath } from './value.helper'

interface Order {
  fieldPath: string
  direction: string
}

interface Cursor {
  id: string
  isInclusive: boolean
  isDocumentRequired: boolean
}

// Filters, orders, cursor and limit are evaluated lazily on get(), like a Firestore query
export class FirestormQuery<T extends typeof Instance> {
  InstanceConstructor: new(data: any, parent: any) => T
  query: any[]
  parent: any
  private readonly itemFilters: Array<(item: any) => boolean> = []
  private readonly orders: Order[] = []
  private cursor?: Cursor
  private limitValue?: number

  constructor (model, parent, data) {
    this.query = data
    this.InstanceConstructor = model
    this.parent = parent
  }

  public async get (): Promise<Array<InstanceType<T>>> {
    return this.queryConvertor(this.evaluate())
  }

  public async count (): Promise<number> {
    return this.evaluate().length
  }

  public async first (): Promise<InstanceType<T>|undefined> {
    return this.queryConvertor(this.evaluate().slice(0, 1))[0]
  }

  public async firstOrFail (errorMessage?: string): Promise<InstanceType<T>> {
    const instance = await this.first()
    if (instance === undefined) throw new Error(errorMessage ?? 'No instance found')
    return instance
  }

  public where (fieldPath: any, WhereFilterOp: string, value: any): FirestormQuery<T> {
    this.itemFilters.push(buildFilter(normalizeFieldPath(fieldPath), WhereFilterOp, value))
    return this
  }

  public orderBy (fieldPath: any, orderByDirection?: string): FirestormQuery<T> {
    this.orders.push({ fieldPath: normalizeFieldPath(fieldPath), direction: orderByDirection ?? 'asc' })
    return this
  }

  public limit (limit: number): FirestormQuery<T> {
    this.limitValue = limit
    return this
  }

  // Accepts a document id or a document snapshot (anything with an id)
  public startAt (id: any): FirestormQuery<T> {
    this.cursor = { id: typeof id === 'string' ? id : id?.id, isInclusive: true, isDocumentRequired: false }
    return this
  }

  public startAfter (id: any): FirestormQuery<T> {
    this.cursor = { id: typeof id === 'string' ? id : id?.id, isInclusive: false, isDocumentRequired: false }
    return this
  }

  public startAtId (id: string): FirestormQuery<T> {
    this.cursor = { id, isInclusive: true, isDocumentRequired: true }
    return this
  }

  public startAfterId (id: string): FirestormQuery<T> {
    this.cursor = { id, isInclusive: false, isDocumentRequired: true }
    return this
  }

  public filters (filters: any[][]): FirestormQuery<T> {
    filters.forEach(([key, operator, value]) => {
      this.where(key, operator, value)
    })
    return this
  }

  public paginate (limit: number, id: string): FirestormQuery<T> {
    if (id != null) this.startAt(id)
    if (limit != null) this.limit(limit)
    return this
  }

  private evaluate (): any[] {
    // Firestore excludes documents missing an ordered field
    let items = this.query.filter(item =>
      this.itemFilters.every(itemFilter => itemFilter(item)) &&
      this.orders.every(({ fieldPath }) => get(item, fieldPath) !== undefined))

    if (this.orders.length > 0) items = items.slice().sort((item, other) => this.compareItems(item, other))
    if (this.cursor !== undefined) items = this.applyCursor(items, this.cursor)
    if (this.limitValue !== undefined) items = items.slice(0, this.limitValue)
    return items
  }

  private compareItems (item: any, other: any): number {
    for (const { fieldPath, direction } of this.orders) {
      const comparison = compareValues(get(item, fieldPath), get(other, fieldPath))
      if (comparison !== 0) return direction === 'desc' ? -comparison : comparison
    }
    return 0
  }

  private applyCursor (items: any[], { id, isInclusive, isDocumentRequired }: Cursor): any[] {
    const index = items.findIndex(item => item.id === id)
    if (index !== -1) return items.slice(isInclusive ? index : index + 1)

    // The cursor document is filtered out of the results: position the query on its values, like Firestore
    const cursorItem = this.query.find(item => item.id === id)
    if (cursorItem === undefined) {
      if (isDocumentRequired) throw new Error(`Invalid query. Cursor document ${id} doesn't exist.`)
      return []
    }
    const isAfterCursor = (comparison: number): boolean => isInclusive ? comparison >= 0 : comparison > 0
    if (this.orders.length > 0) return items.filter(item => isAfterCursor(this.compareItems(item, cursorItem)))
    const cursorIndex = this.query.indexOf(cursorItem)
    return items.filter(item => isAfterCursor(this.query.indexOf(item) - cursorIndex))
  }

  private queryConvertor (items: any[]): Array<InstanceType<T>> {
    return items.map(item => this.fromSnapshot(item))
  }

  public fromSnapshot (item: any): InstanceType<T> {
    const parentId = parentIds.get(item)
    const parent = this.parent ?? (parentId != null ? { id: parentId } : undefined)
    const instance = new this.InstanceConstructor(cloneDeep(item), parent) as unknown as Instance
    return instance.fromFirestore() as InstanceType<T>
  }
}
