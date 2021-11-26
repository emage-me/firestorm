import 'reflect-metadata'
import { SubCollection } from '.'

const fields = Symbol('fields')
const dates = Symbol('dates')
const subCollections = Symbol('subCollections')

export function field (target: any, propertyKey: string): void {
  Reflect.defineMetadata(propertyKey, propertyKey, target, fields)
}

export function date (target: any, propertyKey: string): void {
  Reflect.defineMetadata(propertyKey, propertyKey, target, fields)
  Reflect.defineMetadata(propertyKey, propertyKey, target, dates)
}

export function subCollection (subCollection: any) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(propertyKey, subCollection, target, subCollections)
  }
}

export function getFields (target: any): string[] {
  return Reflect.getMetadataKeys(target, fields)
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
