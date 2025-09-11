const bcrypt = require('bcryptjs');

// Generate a bcrypt hash for the admin password
const password = 'admin123'; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Password:', password);
    console.log('Bcrypt Hash:', hash);
    console.log('\nAdd this to your Vercel environment variables:');
    console.log('ADMIN_PASSWORD=' + hash);
  }
});
