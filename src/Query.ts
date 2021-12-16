import { Instance } from './Instance'
import { Query, QuerySnapshot, DocumentSnapshot, FieldPath } from './types'

export class FirestormQuery<T extends typeof Instance> {
  InstanceConstuctor: new(data: any, parent: any) => T
  query: Query
  parent: any

  constructor (model, parent, collectionRef) {
    this.query = collectionRef
    this.InstanceConstuctor = model
    this.parent = parent
  }

  public async get (): Promise<Array<InstanceType<T>>> {
    const query = await this.query.get()
    return this.queryConvertor(query)
  }

  public async first (): Promise<InstanceType<T>|undefined> {
    const query = await this.query.limit(1).get()
    return this.queryConvertor(query)[0]
  }

  public async firstOrFail (): Promise<InstanceType<T>> {
    const instance = await this.first()
    if (instance === undefined) throw new Error('No instance found')
    return instance
  }

  public where (fieldPath: string, WhereFIlterOp, value: any): FirestormQuery<T> {
    this.query = this.query.where(fieldPath, WhereFIlterOp, value)
    return this
  }

  public orderBy (fieldPath: string | FieldPath, orderByDirection): FirestormQuery<T> {
    this.query = this.query.orderBy(fieldPath, orderByDirection)
    return this
  }

  public limit (limit: number): FirestormQuery<T> {
    this.query = this.query.limit(limit)
    return this
  }

  public filters (filters: any[][]): FirestormQuery<T> {
    filters.forEach(([key, operator, value]) => {
      this.query = this.query.where(key, operator, value)
    })
    return this
  }

  public paginate (limit: number, id: string): FirestormQuery<T> {
    if (id != null) this.query = this.query.startAfter(id)
    if (limit != null) this.query = this.query.limit(limit)
    return this
  }

  private queryConvertor (querySnapShot: QuerySnapshot): Array<InstanceType<T>> {
    if (querySnapShot.empty) return []
    return querySnapShot.docs.map(documentSnapShot => this.fromSnapshot(documentSnapShot))
  }

  public fromSnapshot (documentSnapShot: DocumentSnapshot): InstanceType<T> {
    const instance = new this.InstanceConstuctor(
      {
        id: documentSnapShot.id,
        ...documentSnapShot.data()
      }
      , this.parent) as InstanceType<T>
    return instance.fromFirestore()
  }
}
