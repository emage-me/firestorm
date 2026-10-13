import cloneDeep from 'lodash.clonedeep'
import { get, objectAssign, removeEmpty } from '../object.helper'
import { CollectionRepository } from './CollectionRepository'
import { getDates, getdefaultValue, getSubcollections, getFields, getObjects, getArrays } from './decorators'
import { parentIds, removeItem, upsertItem } from './store'
import { CollectionReference } from './types'
import { resolveFieldValue } from './value.helper'

const ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const generateId = (): string =>
  Array.from({ length: 20 }, () => ID_CHARACTERS.charAt(Math.floor(Math.random() * ID_CHARACTERS.length))).join('')

const resolveFieldValues = (target: any, data: any): any =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, resolveFieldValue(get(target, key), value)]))

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
    const fields = getFields(this)
    const objects = getObjects(this)
    const arrays = getArrays(this)
    const objectFields = objects.map(([key]) => key)
    const arraysFields = arrays.map(([key]) => key)
    const allFields = fields.concat(objectFields).concat(arraysFields).concat(['id'])

    Object.keys(data).forEach(key => {
      if (!allFields.includes(key)) delete data[key]
    })

    Object.assign(this, removeEmpty(data))
    this.parent = parent
    for (const [key, subCollection] of getSubcollections(this)) {
      this[key] = function () {
        if (this.id == null) throw new Error('SubCollection require parent collection ID')
        return new CollectionRepository(subCollection, this)
      }
    }
    for (const [key, ObjectClass] of getObjects(this)) {
      this[key] = new ObjectClass(this[key] ?? {})
    }
    for (const [key, ObjectClass] of getArrays(this)) {
      this[key] = (this[key] ?? []).map(object => new ObjectClass(object))
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
    if (this.id === '' || this.id === undefined) this.id = generateId()

    this.writeItem(this.toFirestore())
    return this
  }

  public async set (data): Promise<void> {
    const fieldData: any = {}
    objectAssign(fieldData, data)
    this.writeItem(resolveFieldValues({}, fieldData))
  }

  public async update (data): Promise<void> {
    const ref = this.collectionRef().dataById[this.id]
    if (ref === undefined) throw new Error(`5 NOT_FOUND: No document to update: ${this.constructor.collectionName}/${this.id}`)

    const fields = getFields(this)
    const objects = getObjects(this)
    const arrays = getArrays(this)
    const objectFields = objects.map(([key]) => key)
    const arraysFields = arrays.map(([key]) => key)
    const objectFieldClass = objects.reduce((acc, field) => ({ ...acc, [field[0]]: field[1] }), {})
    const arraysFieldClass = arrays.reduce((acc, field) => ({ ...acc, [field[0]]: field[1] }), {})

    const allFields = fields.concat(objectFields).concat(arraysFields)
    const fieldData = Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => allFields.includes(key.split('.')[0]))
        .map(([key, value]: [string, any]) => {
          if (objectFields.includes(key)) return [key, value.toFirestore != null ? value.toFirestore() : value]
          if (arraysFields.includes(key)) return [key, value.map(object => object.toFirestore != null ? object.toFirestore() : object)]
          return [key, resolveFieldValue(get(ref, key), value)]
        }))
    objectAssign(ref, cloneDeep(fieldData))

    const fieldObjectData = Object.fromEntries(
      Object.entries(fieldData).map(([key, value]: [string, any]) => {
        if (objectFields.includes(key)) return [key, new objectFieldClass[key](value)]
        if (arraysFields.includes(key)) return [key, value.map(object => new arraysFieldClass[key](object))]
        return [key, value]
      }))

    objectAssign(this, fieldObjectData)
  }

  public async delete (): Promise<void> {
    const item = this.collectionRef().dataById[this.id]
    if (item === undefined) return

    removeItem(this.collectionRef(), item)
    if (this.parent != null) removeItem(this.collectionGroupRef(), item)
  }

  public toFirestore (): any {
    const object = getFields(this).reduce((object, key) => {
      object[key] = this[key]
      return object
    }
    , {})

    getObjects(this).map(([key]) => {
      object[key] = this[key].toFirestore()
    })
    getArrays(this).map(([key]) => {
      object[key] = (this[key] ?? []).map(object => object.toFirestore())
    })
    return object
  }

  public fromFirestore (): this {
    getDates(this).forEach(key => {
      if (this[key] != null && !(this[key] instanceof Date)) this[key] = this[key].toDate()
    })
    getObjects(this).map(([key]) => {
      this[key] = this[key].fromFirestore()
    })
    getArrays(this).map(([key]) => {
      this[key] = (this[key] ?? []).map(object => object.fromFirestore())
    })
    return this
  }

  public data (): any {
    return { id: this.id, ...this.toFirestore() }
  }

  // Stores a deep copy so that instances never share references with the in-memory database
  private writeItem (data: any): void {
    const item = { ...cloneDeep(data), id: this.id }
    const collectionRef = this.collectionRef()
    const previousItem = collectionRef.dataById[this.id]
    upsertItem(collectionRef, item, previousItem)
    if (this.parent != null) {
      if (this.parent.id != null) parentIds.set(item, this.parent.id)
      upsertItem(this.collectionGroupRef(), item, previousItem)
    }
  }
}
