const bcrypt = require('bcryptjs');

const password = 'Sky47@GetStay';
const saltRounds = 12;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('\nGenerated Password Hash:');
  console.log(hash);
  console.log('\nAdd this to your .env file:');
  console.log(`APP_PASSWORD_HASH=${hash}`);
});
