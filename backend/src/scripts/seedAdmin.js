import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.model.js';

dotenv.config();

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@embracinghigherself.com' });
    if (existingAdmin) {
      console.log('✓ Admin already exists with email: admin@embracinghigherself.com');
      console.log('  ID:', existingAdmin._id);
      await mongoose.connection.close();
      return;
    }

    // Create new admin
    const newAdmin = await Admin.create({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123', // Change this to a secure password
    });

    console.log('✓ Admin user created successfully!\n');
    console.log('📧 Email:', newAdmin.email);
    console.log('🔐 Password: admin123');
    console.log('⚠️  Please change this password immediately!\n');

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
