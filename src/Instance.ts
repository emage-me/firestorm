import { CollectionRepository } from './CollectionRepository'
import { getDates, getdefaultValue, getFields, getSubcollections } from './decorators'
import { CollectionReference, DocumentReference } from './types'
import { objectAssign } from './object.helper'

export class Instance {
  ['constructor']: typeof Instance
  id: string
  parent?: Instance
  static collectionName: string = ''

  constructor (data: any, parent?: Instance) {
    const datesKey = getDates(this)
    for (const [key, defaultValue] of getdefaultValue(this)) {
      this[key] = defaultValue
      if (datesKey.includes(key)) this[key] = new Date()
    }
    Object.assign(this, data)
    this.parent = parent
    for (const [key, subCollection] of getSubcollections(this)) {
      this[key] = function () {
        if (this.id == null) throw new Error('SubCollection require parent collection ID')
        return new CollectionRepository(subCollection, this)
      }
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
    const fields = getFields(this)
    const fieldData = Object.fromEntries(Object.entries(data).filter(([key]) => fields.includes(key.split('.')[0])))
    await this.collectionRef().doc(this.id).update(fieldData)
    objectAssign(this, fieldData)
  }

  public async delete (): Promise<void> {
    await this.collectionRef().doc(this.id).delete()
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
      if (this[key] != null && !(this[key] instanceof Date)) this[key] = this[key].toDate()
    })
    return this
  }

  public data (): any {
    return { id: this.id, ...this.toFirestore() }
  }
}
