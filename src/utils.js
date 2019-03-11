
const MetroHash64 = require('metrohash').MetroHash64;

function hash(input) {
  return new MetroHash64(123).update(input).digest();
}

function loop(obj, fn) {
  const keys = Object.keys(obj)
  const kl = keys.length;

  let i = 0;
  for (; i < kl; i++) {
    const key = keys[i]
    const value = obj[key]
    const h = hash(key + value)
    fn(key, value, h)
  }
}

exports.hash = hash;
exports.loop = loop;