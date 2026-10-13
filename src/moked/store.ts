import { CollectionReference } from './types'

// Parent document id of each stored subcollection item, used to rebuild `parent` on collection group queries
export const parentIds = new WeakMap<object, string>()

export const upsertItem = (collectionRef: CollectionReference, item: any, previousItem?: any): void => {
  const index = previousItem === undefined ? -1 : collectionRef.data.indexOf(previousItem)
  if (index === -1) collectionRef.data.push(item)
  else collectionRef.data[index] = item
  collectionRef.dataById[item.id] = item
}

export const removeItem = (collectionRef: CollectionReference, item: any): void => {
  const index = collectionRef.data.indexOf(item)
  if (index !== -1) collectionRef.data.splice(index, 1)
  // eslint-disable-next-line
  if (collectionRef.dataById[item.id] === item) delete collectionRef.dataById[item.id]
}
