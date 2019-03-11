# kvs
Key value storage with secondary indexes


# Usage

```javascript
const Kvs = require('./index')

const db = new Kvs({
  primaryKey: "userId",
  indexes: ["firstName","lastName", "age"]
});

for (let i = 0; i < 10; i++) {
  db.put({
    userId: i,
    firstName: "firstName_"+1,
    lastName: "lastName_"+1,
    age: 23,
    countryId: i
  });
}

db.delete(1)
db.has(5)

const record = db.get(1);
const records = db.find({ age: 23 });


```