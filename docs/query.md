## Query data
### First
Get first item
```javascript
await User.query().first().get()
```
### FirstOrFail
Get first item or fail
```javascript
await User.query().firstOrFail().get()
```
### Where
```javascript
await User.query().where('firstName','==','jack').get()
```

### Orderby
```javascript
await User.query().orderby('age','asc').get()
```

### Limit
```javascript
await User.query().limit(3).get()
```

### Multiple operation
Query operation can be chained
```javascript
await User.query
  .where('firstName','==','jack')
  .orderby('order','asc')
  .limit(3)
  .get()
```

### count
count can be used instead of get
```javascript
await User.query
  .where('firstName','==','jack')
  .orderby('order','asc')
  .count()
```

### sub collection query
```javascript
await company.users().query
  .where('firstName','==','jack')
  .orderby('order','asc')
  .count()
```

### Data structure : [Collection](./collection.md) | [SubCollection](./subCollection.md) | [SubObject](./subObject.md)

### Data manipulation : [CRUD](./CRUD.md) | [Fetch](./fetch.md) | [Queries](./query.md)