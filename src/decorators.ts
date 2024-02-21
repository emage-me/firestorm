import 'reflect-metadata'
import { SubCollection } from '.'
import cloneDeep from 'lodash.clonedeep'

const fields = Symbol('fields')
const defaultValues = Symbol('defaultValues')
const dates = Symbol('dates')
const subCollections = Symbol('subCollections')
const objects = Symbol('objects')
const arrays = Symbol('array')

export function field (defaultValue?: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, propertyKey, target, fields)
    if (defaultValue !== undefined) Reflect.defineMetadata(propertyKey, defaultValue, target, defaultValues)
  }
}

export function date (defaultValue?: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, propertyKey, target, fields)
    Reflect.defineMetadata(propertyKey, propertyKey, target, dates)
    if (defaultValue !== undefined) Reflect.defineMetadata(propertyKey, defaultValue, target, defaultValues)
  }
}

export function object (ObjectClass: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, ObjectClass, target, objects)
  }
}

export function array (ObjectClass: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, ObjectClass, target, arrays)
  }
}

export function subCollection (subCollection: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, subCollection, target, subCollections)
  }
}

export function getFields (target: any): string[] {
  return Reflect.getMetadataKeys(target, fields)
}

export function getdefaultValue (target: any): Array<[string, any]> {
  const defaultValueKeys = Reflect.getMetadataKeys(target, defaultValues)

  return defaultValueKeys.map((key) => {
    const defaultValue = cloneDeep(Reflect.getMetadata(key, target, defaultValues))
    return [key, defaultValue]
  })
}

export function getDates (target: any): string[] {
  return Reflect.getMetadataKeys(target, dates)
}

export function getSubcollections (target: any): Array<[string, typeof SubCollection]> {
  const collectionKeys = Reflect.getMetadataKeys(target, subCollections)

  return collectionKeys.map((key) => {
    const subcollection = Reflect.getMetadata(key, target, subCollections)
    return [key, subcollection]
  })
}

export function getObjects (target: any): Array<[string, any]> {
  const collectionKeys = Reflect.getMetadataKeys(target, objects)

  return collectionKeys.map((key) => {
    const ObjectClass = Reflect.getMetadata(key, target, objects)
    return [key, ObjectClass]
  })
}

export function getArrays (target: any): Array<[string, any]> {
  const collectionKeys = Reflect.getMetadataKeys(target, arrays)

  return collectionKeys.map((key) => {
    const ObjectClass = Reflect.getMetadata(key, target, arrays)
    return [key, ObjectClass]
  })
}
