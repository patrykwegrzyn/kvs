class Mappy {
  constructor() {
    this.data = {}
    this.size = 0;
  }

  set(key, value) {
    this.data[key] = value;
    this.size++
  }

  has(key) {
    return this.data[key] !== undefined
  }

  get(key) {
    return this.data[key]
  }

  delete(key) {
    delete this.data[key]
    this.size--
  }

  forEach(cb) {
    const keys = Object.keys(this.data)
    const kl = keys.length;
    let i = 0;
    for (; i < kl; i++) {
      const key = keys[i];
      const value = this.data[key]
      cb(key, value, this.data)
    }
  }
}

class MapOfArrays extends Mappy {

  constructor() {
    super()
  }

  put(key, value) {
    if (this.has(key))
      return this.get(key).push(value)

    this.set(key, [value])
  }
}


exports.Map = Mappy;
exports.MapOfArrays = MapOfArrays;