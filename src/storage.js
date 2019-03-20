
const { hash, loop } = require('./utils')
const { Map, MapOfArrays } = require('./map')

class Storage {
  constructor({ primaryKey, indexes = [] }) {
    this.primaryKey = primaryKey;
    this.indexWith = indexes;
    this.records = new Map();
    this.indexes = new MapOfArrays();
    this.indexStore = new MapOfArrays()
  }

  get(pkValue) {
    const pkHash = this.primaryHash(pkValue)
    return this.records.get(pkHash)
  }

  primaryHash(pkValue) {
    return hash(this.primaryKey + pkValue)
  }

  findOne(key, value) {
    const idxHash =  hash(key + value);
   // console.log(idxHash, key, value, this.indexes.get(idxHash))
    return (this.indexes.get(idxHash) || [])[0] || {};
  }

  find(record) {
    const records = []
    loop(record, (k, v, idxHash) => {
      records.push(...this.indexes.get(idxHash));
    })

    return records
  }

  put(record) {
    const pkValue = record[this.primaryKey]
    const pkHash = this.primaryHash(pkValue)
    this.records.set(pkHash, record)
    this.createIndexes(pkHash, record)
  }

  has(pkValue) {
    const pkHash = this.primaryHash(pkValue)
    return this.records.has(pkHash)
  }

  delete(pkValue) {

    const pkHash = this.primaryHash(pkValue)
    const record = this.records.get(pkHash)
    if(!record) return;
    
    const indexes = this.indexStore.get(pkHash)

    indexes.forEach(index => {
      const oldRecords = this.indexes.get(index)
      const newRecords = oldRecords.filter(r => r !== record)
      if(newRecords.length === 0 ) {
        return this.indexes.delete(index)
      } 
      this.indexes.set(index, newRecords)
    })

    this.records.delete(pkHash)
    this.indexStore.delete(pkHash)

  }

  createIndexes(pkHash, record) {
    loop(record, (key, value, idxHash) => {
      if (key !== this.primaryKey && this.indexWith.includes(key)) {
        this.addIndex(idxHash, record, pkHash)
      }
    })
  }

  addIndex(idxHash, record, pkHash) {
    if (this.indexes.has(idxHash)) {
      this.indexes.get(idxHash).push(record)
      this.indexStore.put(pkHash, idxHash)
      return
    }

    this.indexes.put(idxHash, record)
    this.indexStore.put(pkHash, idxHash)
  }
}


module.exports = Storage;