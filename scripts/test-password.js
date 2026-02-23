const bcrypt = require('bcryptjs');

const password = 'Sky47@GetStay';
const hash = '$2b$12$vPdUZXBIaZmcpiI7IxYMDusTR992KibVBP/AooyK01N8cfmdFb1JS';

console.log('Testing password verification...\n');
console.log('Password:', password);
console.log('Hash:', hash);

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('\n❌ Error:', err);
    return;
  }
  
  if (result) {
    console.log('\n✅ Password verification successful!');
    console.log('The password matches the hash.');
  } else {
    console.log('\n❌ Password verification failed!');
    console.log('The password does not match the hash.');
  }
});
