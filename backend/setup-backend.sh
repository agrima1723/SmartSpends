#!/bin/bash

# Create directory structure
mkdir -p models
mkdir -p routes
mkdir -p controllers
mkdir -p middleware
mkdir -p utils
mkdir -p config

# Models
cat > models/User.js << 'EOF'
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },
  displayName: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  baseCurrency: {
    type: String,
    enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'],
    default: 'USD',
  },
  privacyMode: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
EOF

cat > models/Account.js << 'EOF'
import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['Cash', 'Bank', 'CreditCard', 'Savings', 'Investment', 'Other'],
    default: 'Bank',
  },
  icon: {
    type: String,
    default: 'Wallet',
  },
  color: {
    type: String,
    default: '#3B82F6',
  },
  initialBalance: {
    type: mongoose.Decimal128,
    default: 0,
  },
  currency: {
    type: String,
    enum: ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD'],
    default: 'USD',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);
EOF

echo "✓ Backend boilerplate structure created successfully!"
