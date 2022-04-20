export interface CollectionReference {
  data: Item[]
  dataById: {[key: string]: Item }
}

export interface Item {
  id: string
}
