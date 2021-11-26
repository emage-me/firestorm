import { CollectionRepository } from './CollectionRepository'
import { getDates, getFields, getSubcollections } from './decorators'
import { CollectionReference, DocumentReference } from './types'

export class Instance {
  ['constructor']: typeof Instance
  id: string
  parent?: Instance
  static collectionName: string = ''

  constructor (data: any, parent?: Instance) {
    Object.assign(this, data)
    this.parent = parent
    for (const [key, subCollection] of getSubcollections(this)) {
      if (this.id != null) this[key] = () => new CollectionRepository(subCollection, this)
      else this[key] = () => { throw new Error('SubCollection require parent collection ID') }
    }
  }

  public collectionRef (): CollectionReference {
    return null as unknown as CollectionReference
  }

  public docRef (): DocumentReference {
    return this.collectionRef().doc(this.id)
  }

  async save (): Promise<this> {
    if (this.id === '' || this.id === undefined) {
      const saved = await this.collectionRef().add(this.toFirestore())
      this.id = saved.id
      return this
    } else {
      await this.collectionRef().doc(this.id).set(this.toFirestore())
      return this
    }
  }

  public async set (data): Promise<void> {
    await this.collectionRef().doc(this.id).set(data)
  }

  public async update (data): Promise<void> {
    await this.collectionRef().doc(this.id).update(data)
  }

  public toFirestore (): any {
    const object = getFields(this).reduce((object, key) => {
      object[key] = this[key]
      return object
    }
    , {})
    return object
  }

  public fromFirestore (): this {
    getDates(this).forEach(key => {
      if (this[key] != null) this[key] = this[key].toDate()
    })
    return this
  }

  public data (): any {
    return { id: this.id, ...this.toFirestore() }
  }
}
