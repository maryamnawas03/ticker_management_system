/**
 * Database Seeder
 *
 * Creates the three test users required for the assessment submission:
 *   - admin@test.com  / Admin@123  (role: Admin)
 *   - agent@test.com  / Agent@123  (role: Agent)
 *   - user@test.com   / User@123   (role: User)
 *
 * Run once:  node seed.js
 * It skips users that already exist, so re-running is safe.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// ── Inline User schema (avoid circular imports) ───────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['Admin', 'Agent', 'User'], default: 'User' },
    status:   { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// ── Test users ────────────────────────────────────────────────────────────────
const testUsers = [
  { name: 'Admin User',  email: 'admin@test.com', password: 'Admin@123', role: 'Admin' },
  { name: 'Agent User',  email: 'agent@test.com', password: 'Agent@123', role: 'Agent' },
  { name: 'Normal User', email: 'user@test.com',  password: 'User@123',  role: 'User'  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const userData of testUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`  ⏭  Skipped  ${userData.email} (already exists, role: ${existing.role})`);
        continue;
      }

      const hashed = await bcrypt.hash(userData.password, 10);
      await User.create({ ...userData, password: hashed });
      console.log(`  ✓  Created  ${userData.email}  [${userData.role}]`);
    }

    console.log('\n🎉 Seeding complete. Test credentials:');
    console.log('   Admin: admin@test.com  / Admin@123');
    console.log('   Agent: agent@test.com  / Agent@123');
    console.log('   User:  user@test.com   / User@123');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
};

seed();
