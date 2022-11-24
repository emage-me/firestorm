import RealFirestorm from './Firestorm'
import MokedFirestorm from './moked/Firestorm'
import { Collection as RealCollection } from './Collection'
import { SubCollection as RealSubCollection } from './Subcollection'
import { CollectionRepository as RealCollectionRepository } from './CollectionRepository'
import { field as realField, date as realDate, subCollection as realSubCollection } from './decorators'

import { Collection as MokedCollection } from './moked/Collection'
import { SubCollection as MokedSubCollection } from './moked/Subcollection'
import { CollectionRepository as MokedCollectionRepository } from './moked/CollectionRepository'
import { field as mokedField, date as mokedDate, subCollection as mokedSubCollection } from './moked/decorators'

const isMocked = Boolean(process.env.FIRESTORM_MOCKED)
const Firestorm = isMocked ? MokedFirestorm : RealFirestorm

export default Firestorm

const Collection = isMocked ? MokedCollection as unknown as typeof RealCollection : RealCollection
const SubCollection = isMocked ? MokedSubCollection as unknown as typeof RealSubCollection : RealSubCollection
const CollectionRepository = isMocked ? MokedCollectionRepository as unknown as typeof RealCollectionRepository : RealCollectionRepository
const field = isMocked ? mokedField : realField
const date = isMocked ? mokedDate : realDate
const subCollection = isMocked ? mokedSubCollection : realSubCollection

export { Collection, SubCollection, CollectionRepository, field, date, subCollection }
export { FieldPath } from '@google-cloud/firestore'
