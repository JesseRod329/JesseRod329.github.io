#!/bin/bash

# PRD Creator Setup Script
echo "🚀 Setting up PRD Creator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Gemini API Configuration
VITE_GEMINI_API_KEY=your_api_key_here

# Optional: Set default locale
# VITE_DEFAULT_LOCALE=en-US
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update VITE_GEMINI_API_KEY in .env with your actual API key"
else
    echo "✅ .env file already exists"
fi

# Create .env.example
echo "📝 Creating .env.example file..."
cat > .env.example << EOF
# Gemini API Configuration
VITE_GEMINI_API_KEY=your_api_key_here

# Optional: Set default locale
# VITE_DEFAULT_LOCALE=en-US
EOF

echo "✅ .env.example file created"

# Run type check
echo "🔍 Running type check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Type check failed, but setup continues..."
else
    echo "✅ Type check passed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get your Gemini API key from: https://makersuite.google.com/app/apikey"
echo "2. Update VITE_GEMINI_API_KEY in .env file"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 🚀"
