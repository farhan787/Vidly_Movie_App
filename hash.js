// Trivial module, just to show the usecase of bcrypt to hash passwords
const bcrypt = require('bcrypt');

function run() {
  async function hash() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('1234', salt);
    console.log(`Salt: ${salt}`);
    console.log(`Hashed Password: ${hashedPassword}\n`);
  }

  async function countSaltCharacters() {
    const salt = await bcrypt.genSalt(10000000000000000000000);
    console.log(`Salt: ${salt}`);
    console.log(`Salt Length: ${salt.length}`);
  }

  async function validate(password) {
    const salt = await bcrypt.genSalt(10);
    const mypassword = '2342';
    const hash = await bcrypt.hash(mypassword, salt);

    const isValid = await bcrypt.compare(password, hash);
    console.log(isValid);
  }

  // countSaltCharacters()
  validate('2341');
}

run();
