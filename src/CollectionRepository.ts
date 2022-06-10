import { Instance } from './Instance'
import { FirestormQuery } from './Query'
import { CollectionReference, DocumentSnapshot } from './types'

export class CollectionRepository<T extends typeof Instance> {
  collection: string
  collectionRef: CollectionReference
  query: FirestormQuery<T>
  parent: any
  InstanceConstuctor: new(data: any, parent: any) => T

  constructor (model, parent) {
    this.collection = model.collectionName
    this.collectionRef = parent == null ? model.collectionRef() : parent.docRef().collection(model.collectionName)
    this.InstanceConstuctor = model
    this.parent = parent
    this.query = new FirestormQuery<T>(model, parent, this.collectionRef)
  }

  public create (data): InstanceType<T> {
    return new this.InstanceConstuctor(data, this.parent) as InstanceType<T>
  }

  public async first (): Promise<InstanceType<T>|undefined> {
    return await this.query.first()
  }

  public async firstOrFail (errorMessage?: string): Promise<InstanceType<T>> {
    return await this.query.firstOrFail(errorMessage)
  }

  public async find (id: string): Promise<InstanceType<T>|undefined> {
    const document = await this.collectionRef.doc(id).get()
    return this.documentConvertor(document)
  }

  public async findOrFail (id: string, errorMessage?: string): Promise<InstanceType<T>> {
    const instance = await this.find(id)
    if (instance === undefined) throw new Error(errorMessage ?? `Id ${id} Not found in ${this.collection}`)
    return instance
  }

  public async findBy (field: string, value: string | boolean | number): Promise<InstanceType<T>|undefined> {
    return await this.query.where(field, '==', value).first()
  }

  public async findByOrFail (field: string, value: string | boolean | number, errorMessage?: string): Promise<InstanceType<T>> {
    const instance = await this.findBy(field, value)
    if (instance === undefined) throw new Error(errorMessage ?? 'No instance found')
    return instance
  }

  public async findAll (): Promise<Array<InstanceType<T>>> {
    return await this.query.get()
  }

  public async findAllBy (field: string, value: string | boolean): Promise<Array<InstanceType<T>>> {
    return await this.query.where(field, '==', value).get()
  }

  public async findByIds (ids: string[]): Promise<Array<InstanceType<T>>> {
    const refs = ids.map(id => this.collectionRef.doc(id))
    const docs = await this.collectionRef.firestore.getAll(...refs)
    const intances: Array<InstanceType<T>> = []
    docs.forEach(documentSnapShot => {
      const intance = this.documentConvertor(documentSnapShot)
      if (intance !== undefined) intances.push(intance)
    })
    return intances
  }

  private documentConvertor (documentSnapShot: DocumentSnapshot): InstanceType<T>|undefined {
    if (documentSnapShot.exists) return this.query.fromSnapshot(documentSnapShot)
    return undefined
  }
}
