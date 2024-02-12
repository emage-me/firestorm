## How to use subcollection
### Subcollection definition

```javascript
import { Collection, Subcollection, CollectionRepositoryType, field, subCollection } from '@emage-me/firestorm'

class User extends SubCollection {
  static collectionName: string = 'user'
  @field('') firstName: string
  @field('') LastName: string
}

class Company extends Collection {
  static collectionName: string = 'company'
  @field('') name: string
  @subCollection(User) users: () => CollectionRepositoryType<typeof User>
}
```

### 1. Extends with SubCollection
```javascript
class User extends SubCollection
```

### 2. Defined the collection Name
```javascript
static collectionName: string = 'user'
```

### 3. Use field decorator with a default value
```javascript
@field('') firstName: string
```

### 4. Use subCollection decorator
```javascript
@subCollection(User) users: () => CollectionRepositoryType<typeof User>
```
The `@subCollection` decorator add sub collection to the collection, you need to pass the sub collection class `User` to the decorator.

The type of the collection repository is `CollectionRepositoryType<typeof User>`

### Data structure : [Collection](./collection.md) | [SubCollection](./subCollection.md) | [SubObject](./subObject.md)

### Data manipulation : [CRUD](./CRUD.md) | [Fetch](./fetch.md) | [Queries](./query.md)