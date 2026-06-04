import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * CONCEPT: MongoDB User Schema
 * 
 * Schema defines:
 * 1. What fields users have
 * 2. Field types and validation rules
 * 3. Default values
 * 4. Indexes (for fast queries)
 * 5. Middleware hooks (pre/post save)
 * 
 * Key Fields:
 * - name: String, required, trimmed
 * - email: Unique, lowercase, email format validation
 * - password: Hashed using bcrypt (never stored plain text)
 * - role: Admin, Agent, or User (determines permissions)
 * - status: Active or Inactive (for soft deletes)
 * - timestamps: Created/Updated dates (automatic)
 * 
 * Security Feature: Password Hashing
 * - bcrypt is one-way hashing (cannot reverse)
 * - Salt is added to prevent rainbow table attacks
 * - Rounds (10) = 2^10 = 1024 iterations (slow but secure)
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ['Admin', 'Agent', 'User'],
      default: 'User',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

/**
 * CONCEPT: Mongoose Pre-Save Hook
 * 
 * Runs BEFORE any user document is saved to database
 * Perfect place for password hashing
 * 
 * Why hash before saving:
 * - Passwords in database should NEVER be readable
 * - Even database admins shouldn't see passwords
 * - Users won't be harmed if database is breached
 */
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt with 10 rounds (security vs speed tradeoff)
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * CONCEPT: Instance Method for Password Verification
 * 
 * Used during login to check if provided password matches stored hash
 * 
 * Process:
 * 1. User submits plain text password
 * 2. We hash it with the stored salt
 * 3. Compare hashes (not readable passwords)
 * 4. Return true if they match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
