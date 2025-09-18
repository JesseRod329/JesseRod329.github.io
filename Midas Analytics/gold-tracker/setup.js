#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Midas Analytics - Gold Tracker\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    const envContent = `# API Keys for Gold Tracker
# Get your free API keys from the following sources:

# FRED API (Federal Reserve Economic Data) - FREE
# Sign up at: https://fred.stlouisfed.org/docs/api/api_key.html
REACT_APP_FRED_API_KEY=demo

# Metals-API - FREE tier: 1,000 requests/month
# Sign up at: https://metals-api.com
REACT_APP_METALS_API_KEY=demo

# Alpha Vantage - FREE tier: 500 requests/day
# Sign up at: https://www.alphavantage.co/support/#api-key
REACT_APP_ALPHA_VANTAGE_KEY=demo

# Instructions:
# 1. Replace 'demo' with your actual API keys
# 2. Never commit the .env file to version control
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with demo keys');
  }
} else {
  console.log('ℹ️  .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Get your free API keys:');
console.log('   - FRED API: https://fred.stlouisfed.org/docs/api/api_key.html');
console.log('   - Metals-API: https://metals-api.com');
console.log('   - Alpha Vantage: https://www.alphavantage.co/support/#api-key');
console.log('2. Update your .env file with real API keys');
console.log('3. Run: npm start');
console.log('\n🎉 Setup complete! The app will work with demo data until you add real API keys.');
