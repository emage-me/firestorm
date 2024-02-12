import RealFirestorm from './Firestorm'
import MokedFirestorm from './moked/Firestorm'
import { Collection as RealCollection } from './Collection'
import { SubCollection as RealSubCollection } from './Subcollection'
import { Instance as RealInstance } from './Instance'
import { CollectionRepository } from './CollectionRepository'
import { field as realField, date as realDate, subCollection as realSubCollection, object as realObject } from './decorators'

import { Collection as MokedCollection } from './moked/Collection'
import { SubCollection as MokedSubCollection } from './moked/Subcollection'
import { Instance as MokedInstance } from './moked/Instance'
import { field as mokedField, date as mokedDate, subCollection as mokedSubCollection, object as mokedObject } from './moked/decorators'

const isMocked = Boolean(process.env.FIRESTORM_MOCKED)
const Firestorm = isMocked ? MokedFirestorm : RealFirestorm

export default Firestorm
const Instance = isMocked ? MokedInstance as unknown as typeof RealInstance : RealInstance
const Collection = isMocked ? MokedCollection as unknown as typeof RealCollection : RealCollection
const SubCollection = isMocked ? MokedSubCollection as unknown as typeof RealSubCollection : RealSubCollection

export type CollectionRepositoryType<T extends typeof Instance> = CollectionRepository<T>
const field = isMocked ? mokedField : realField
const date = isMocked ? mokedDate : realDate
const subCollection = isMocked ? mokedSubCollection : realSubCollection
const object = isMocked ? mokedObject : realObject

export { Collection, SubCollection, CollectionRepository, Instance, field, date, subCollection, object }
export { FieldPath } from '@google-cloud/firestore'
