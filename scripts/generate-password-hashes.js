const bcrypt = require('bcryptjs');

// Demo passwords from Demo_Test_UC.md
const passwords = {
  1: 'admin123',
  2: 'sales123',
  3: 'sales123',
  4: 'marketing123'
};

console.log('-- SQL UPDATE Script to fix BUG_001');
console.log('-- Generated:', new Date().toISOString());
console.log('-- Purpose: Replace plain text passwords with bcrypt hashes');
console.log('');

Object.entries(passwords).forEach(([userId, password]) => {
  const hash = bcrypt.hashSync(password, 10);
  console.log(`UPDATE [dbo].[users] SET password_hash = '${hash}' WHERE id = ${userId}; -- ${password}`);
});

console.log('');
console.log('-- After running this script, you can login with:');
console.log('-- nva@example.com / admin123');
console.log('-- ttb@example.com / sales123');
console.log('-- lvc@example.com / sales123');
console.log('-- ptd@example.com / marketing123');
