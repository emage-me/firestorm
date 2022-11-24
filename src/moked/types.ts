export interface CollectionReference {
  data: Item[]
  dataById: {[key: string]: Item }
  id: string
}

export interface Item {
  id: string
}
