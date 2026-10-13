import { Instance } from './Instance'
import { Query, QuerySnapshot, DocumentSnapshot, FieldPath, CollectionReference } from './types'

interface DocumentCursor {
  id: string
  isInclusive: boolean
}

export class FirestormQuery<T extends typeof Instance> {
  InstanceConstructor: new(data: any, parent: any) => T
  query: Query
  parent: any
  private readonly collectionRef: CollectionReference
  private documentCursor?: DocumentCursor

  constructor (model, parent, collectionRef) {
    this.query = collectionRef
    this.collectionRef = collectionRef
    this.InstanceConstructor = model
    this.parent = parent
  }

  public async get (): Promise<Array<InstanceType<T>>> {
    const query = await (await this.resolveQuery()).get()
    return this.queryConvertor(query)
  }

  public async count (): Promise<number> {
    const snapShot = await (await this.resolveQuery()).count().get()
    return snapShot.data().count
  }

  public async first (): Promise<InstanceType<T>|undefined> {
    const query = await (await this.resolveQuery()).limit(1).get()
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

  // Starts at the document with this id (the snapshot is fetched when the query runs)
  public startAtId (id: string): FirestormQuery<T> {
    this.documentCursor = { id, isInclusive: true }
    return this
  }

  public startAfterId (id: string): FirestormQuery<T> {
    this.documentCursor = { id, isInclusive: false }
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

  private async resolveQuery (): Promise<Query> {
    if (this.documentCursor === undefined) return this.query
    if (typeof this.collectionRef.doc !== 'function') throw new Error('startAtId and startAfterId are not supported on collection group queries')

    const { id, isInclusive } = this.documentCursor
    const documentSnapShot = await this.collectionRef.doc(id).get()
    return isInclusive ? this.query.startAt(documentSnapShot) : this.query.startAfter(documentSnapShot)
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
