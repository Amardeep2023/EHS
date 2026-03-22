import bcrypt from 'bcryptjs';
import readline from 'readline';

// Create interface for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to hash password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(12); // Generate salt with 12 rounds
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('\n✓ Password hashed successfully!\n');
    console.log('Hashed Password:');
    console.log('═'.repeat(70));
    console.log(hashedPassword);
    console.log('═'.repeat(70));
    console.log('\nCopy the hashed password above and paste it in your MongoDB database.\n');
    
    rl.close();
  } catch (err) {
    console.error('Error hashing password:', err.message);
    rl.close();
    process.exit(1);
  }
}

// Get password from command line argument or prompt user
const passwordArg = process.argv[2];

if (passwordArg) {
  hashPassword(passwordArg);
} else {
  rl.question('Enter password to hash: ', (password) => {
    if (!password) {
      console.error('Password cannot be empty!');
      rl.close();
      process.exit(1);
    }
    hashPassword(password);
  });
}
