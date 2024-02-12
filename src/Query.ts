import { Instance } from './Instance'
import { Query, QuerySnapshot, DocumentSnapshot, FieldPath } from './types'

export class FirestormQuery<T extends typeof Instance> {
  InstanceConstructor: new(data: any, parent: any) => T
  query: Query
  parent: any

  constructor (model, parent, collectionRef) {
    this.query = collectionRef
    this.InstanceConstructor = model
    this.parent = parent
  }

  public async get (): Promise<Array<InstanceType<T>>> {
    const query = await this.query.get()
    return this.queryConvertor(query)
  }

  public async count (): Promise<number> {
    const snapShot = await this.query.count().get()
    return snapShot.data().count
  }

  public async first (): Promise<InstanceType<T>|undefined> {
    const query = await this.query.limit(1).get()
    return this.queryConvertor(query)[0]
  }

  public async firstOrFail (errorMessage?: string): Promise<InstanceType<T>> {
    const instance = await this.first()
    if (instance === undefined) throw new Error(errorMessage ?? 'No instance found')
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

  public startAt (id: string | DocumentSnapshot): FirestormQuery<T> {
    this.query = this.query.startAt(id)
    return this
  }

  public startAfter (id: string | DocumentSnapshot): FirestormQuery<T> {
    this.query = this.query.startAfter(id)
    return this
  }

  public filters (filters: any[][]): FirestormQuery<T> {
    filters.forEach(([key, operator, value]) => {
      this.query = this.query.where(key, operator, value)
    })
    return this
  }

  public paginate (limit: number, id: string): FirestormQuery<T> {
    if (id != null) this.query = this.query.startAt(id)
    if (limit != null) this.query = this.query.limit(limit)
    return this
  }

  private queryConvertor (querySnapShot: QuerySnapshot): Array<InstanceType<T>> {
    if (querySnapShot.empty) return []
    return querySnapShot.docs.map(documentSnapShot => this.fromSnapshot(documentSnapShot))
  }

  public fromSnapshot (documentSnapShot: DocumentSnapshot): InstanceType<T> {
    const parentId = documentSnapShot.ref.parent.parent?.id
    const parent = this.parent ?? (parentId != null ? { id: parentId } : undefined)
    const instance = new this.InstanceConstructor(
      {
        id: documentSnapShot.id,
        ...documentSnapShot.data()
      }
      , parent) as InstanceType<T>
    return instance.fromFirestore()
  }
}
