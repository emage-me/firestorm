import 'reflect-metadata'
import { SubCollection } from '.'

const fields = Symbol('fields')
const defaultValues = Symbol('defaultValues')
const dates = Symbol('dates')
const subCollections = Symbol('subCollections')

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
    const defaultValue = Reflect.getMetadata(key, target, defaultValues)
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
