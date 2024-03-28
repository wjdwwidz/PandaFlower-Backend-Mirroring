const bcrypt = require('bcrypt');

async function makeHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = makeHash;
