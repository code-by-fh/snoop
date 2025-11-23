import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  activationToken: { type: String },
  activationTokenExpires: { type: Date },
  isActive: { type: Boolean, default: false }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.activationToken;
      delete ret.activationTokenExpires;
      return ret;
    }
  }
});

const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

export function validatePassword(password) {
  const errors = [];

  if (password.length < PASSWORD_POLICY.minLength)
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long.`);
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password))
    errors.push('Password must contain at least one uppercase letter.');
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password))
    errors.push('Password must contain at least one lowercase letter.');
  if (PASSWORD_POLICY.requireNumber && !/[0-9]/.test(password))
    errors.push('Password must contain at least one number.');
  if (PASSWORD_POLICY.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password))
    errors.push('Password must contain at least one special character.');

  return errors;
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (this.password) {
    const validationErrors = validatePassword(this.password);
    if (validationErrors.length > 0) {
      const err = new Error(validationErrors.join('\n'));
      err.name = 'PasswordValidationError';
      return next(err);
    }
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
