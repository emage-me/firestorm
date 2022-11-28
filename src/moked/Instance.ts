import { objectAssign } from '../object.helper'
import { CollectionRepository } from './CollectionRepository'
import { getdefaultValue, getSubcollections, getFields } from './decorators'
import { CollectionReference } from './types'

export class Instance {
  ['constructor']: typeof Instance
  id: string
  parent?: Instance
  static collectionName: string = ''

  constructor (data: any, parent?: Instance) {
    for (const [key, defaultValue] of getdefaultValue(this)) {
      this[key] = defaultValue
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
    return { data: [], dataById: {}, id: this.constructor.collectionName }
  }

  public collectionGroupRef (): CollectionReference {
    return { data: [], dataById: {}, id: this.constructor.collectionName }
  }

  public docRef (): any {
    return this.collectionRef().dataById[this.id]
  }

  async save (): Promise<this> {
    if (this.id === '' || this.id === undefined) this.id = Math.random().toString(36).slice(-16)

    await this.set(this)
    return this
  }

  public async set (data): Promise<void> {
    const fieldData: any = {}
    objectAssign(fieldData, data)
    if (this.collectionRef().dataById[this.id] === undefined) {
      this.collectionRef().data.push(fieldData)
      if (this.parent !== null) this.collectionGroupRef().data.push(fieldData)
    }
    this.collectionRef().dataById[this.id] = fieldData
    if (this.parent !== null) this.collectionGroupRef().dataById[this.id] = fieldData
  }

  public async update (data): Promise<void> {
    const fields = getFields(this)
    const fieldData = Object.fromEntries(Object.entries(data).filter(([key]) => fields.includes(key.split('.')[0])))
    objectAssign(this, fieldData)
    this.collectionRef().dataById[this.id] = this
  }

  public async delete (): Promise<void> {
    const index = this.collectionRef().data.findIndex(item => item.id === this.id)
    // eslint-disable-next-line
    delete this.collectionRef().dataById[this.id]
    // eslint-disable-next-line
    if(this.parent !== null) delete this.collectionGroupRef().dataById[this.id]
    // eslint-disable-next-line
    this.collectionRef().data.splice(index, 1)
    // eslint-disable-next-line
    if(this.parent !== null) this.collectionGroupRef().data.splice(index, 1)
  }
}
