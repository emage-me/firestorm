import { Instance } from './Instance'

export class FirestormQuery<T extends typeof Instance> {
  InstanceConstuctor: new(data: any, parent: any) => T
  query: any[]
  parent: any

  constructor (model, parent, data) {
    this.query = data
    this.InstanceConstuctor = model
    this.parent = parent
  }

  public async get (): Promise<Array<InstanceType<T>>> {
    return this.query
  }

  public async first (): Promise<InstanceType<T>|undefined> {
    return this.query[0]
  }

  public async firstOrFail (errorMessage?: string): Promise<InstanceType<T>> {
    const instance = this.query[0]
    if (instance === undefined) throw new Error(errorMessage ?? 'No instance found')
    return instance
  }

  public where (fieldPath: string, WhereFIlterOp, value: any): FirestormQuery<T> {
    // add WhereFIlterOp case
    this.query = this.query.filter(item => item[fieldPath] === value)
    return this
  }

  public orderBy (fieldPath: string, orderByDirection): FirestormQuery<T> {
    // add orderByDirection case

    const orderMethod = orderByDirection === 'asc'
      ? (a, b) => a[fieldPath] - b[fieldPath]
      : (a, b) => b[fieldPath] - a[fieldPath]
    this.query = this.query.sort(orderMethod)
    return this
  }

  public limit (limit: number): FirestormQuery<T> {
    this.query = this.query.slice(0, limit)
    return this
  }

  public startAt (id: string): FirestormQuery<T> {
    let isfound = false
    this.query = this.query.filter(item => {
      if (item.id === id) isfound = true

      return isfound
    })
    return this
  }

  public startAfter (id: string): FirestormQuery<T> {
    this.startAt(id)
    this.query = this.query.slice(1)
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
}
