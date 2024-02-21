## How to use sub object
### Collection definition

```javascript
import { Collection, Instance, field, object } from '@emage-me/firestorm'

class Address extends Instance {
  @field('') zipCode: string
  @field('') city: string

  get label (): string {
    return `${zipCode} ${city}`
  }
}

class User extends Collection {
  static collectionName: string = 'User'
  @object(Address) address: Address
}
```

### 1. Extends with Instance
```javascript
class Address extends Instance
```

### 2. Use field decorator with a default value
```javascript
@field('') zipCode: string
```

### 3. Use object decorator with the sub object class
```javascript
@object(Address) address: Address
```

### Sub object are build automatically
```javascript
const address = { zipCode: '60006', city: 'LYON' }
const user = new User({ address })

console.log(user.address.label) // 60006 LYON
```

## How to use array of sub object
### Collection definition

```javascript
import { Collection, Instance, field, array } from '@emage-me/firestorm'

class Address extends Instance {
  @field('') zipCode: string
  @field('') city: string

  get label (): string {
    return `${zipCode} ${city}`
  }
}

class User extends Collection {
  static collectionName: string = 'User'
  @array(Address) addressList: Address[]
}
```

### 1. Extends with Instance
```javascript
class Address extends Instance
```

### 2. Use array decorator with the sub object class
```javascript
@array(Address) addressList: Address[]
```

### Sub object are build automatically
```javascript
const address = { zipCode: '60006', city: 'LYON' }
const user = new User({ addressList: [address] })

console.log(user.address[0].label) // 60006 LYON
```

### Data structure : [Collection](./collection.md) | [SubCollection](./subCollection.md) | [SubObject](./subObject.md)

### Data manipulation : [CRUD](./CRUD.md) | [Fetch](./fetch.md) | [Queries](./query.md)