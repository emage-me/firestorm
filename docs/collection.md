## How to use Collection
### Collection definition

```javascript
import { Collection, field, date } from '@emage-me/firestorm'

class User extends Collection {
  static collectionName: string = 'user'
  @field('') firstName: string
  @field('') lastName: string
  @field(false) isPremium: boolean
  @field([]) organizationIds: string[]
  @date(new Date()) creationDate: DateTime
}
```

### 1. Extends with Collection
```javascript
class User extends Collection
```

### 2. Defined the collection name
```javascript
static collectionName: string = 'user'
```

### 3. Use field decorator with a default value
```javascript
@field('') firstName: string
```

### Date decorator
```javascript
@date(new Date()) creationDate: DateTime
```

### Data structure : [Collection](./collection.md) | [SubCollection](./subCollection.md) | [SubObject](./subObject.md)

### Data manipulation : [CRUD](./CRUD.md) | [Fetch](./fetch.md) | [Queries](./query.md)