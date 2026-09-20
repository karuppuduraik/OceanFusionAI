const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
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
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 4,
    },
    role: {
      type: String,
      enum: ['admin', 'researcher', 'coast_guard', 'user'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Return sanitized user object without password
UserSchema.methods.toAuthJSON = function (token) {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    authProvider: this.authProvider,
    token: token,
    createdAt: this.createdAt,
  };
};

// Static helper to seed default accounts if not present
UserSchema.statics.seedDefaultUsers = async function () {
  try {
    if (mongoose.connection.readyState !== 1) return;

    const adminExists = await this.findOne({ email: 'karuppuduraikece@gmail.com' });
    if (!adminExists) {
      await this.create({
        name: 'Super Admin',
        email: 'karuppuduraikece@gmail.com',
        password: 'admin',
        role: 'admin',
        authProvider: 'local',
      });
      console.log('✅ Seeded default Super Admin: karuppuduraikece@gmail.com');
    }

    const researcherExists = await this.findOne({ email: 'researcher@oceanfusion.ai' });
    if (!researcherExists) {
      await this.create({
        name: 'Lead Marine Researcher',
        email: 'researcher@oceanfusion.ai',
        password: 'password',
        role: 'researcher',
        authProvider: 'local',
      });
      console.log('✅ Seeded default Researcher: researcher@oceanfusion.ai');
    }
  } catch (err) {
    console.warn('[User Seed Warning]:', err.message);
  }
};

module.exports = mongoose.model('User', UserSchema);
