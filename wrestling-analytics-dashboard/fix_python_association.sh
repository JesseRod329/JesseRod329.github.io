#!/bin/bash
# Fix .py file associations to use Python instead of Xcode

echo "🔧 Fixing Python file associations..."

# Method 1: Use duti to set default application (if installed)
if command -v duti &> /dev/null; then
    echo "📦 Using duti to set Python as default for .py files..."
    duti -s org.python.python python-script all
    duti -s org.python.python3 python-script all
    echo "✅ duti method completed"
else
    echo "⚠️  duti not installed. Install with: brew install duti"
fi

# Method 2: Alternative using defaults
echo "📝 Setting Python Launcher as default..."
defaults write com.apple.LaunchServices LSHandlers -array-add '{LSHandlerContentType=public.python-script;LSHandlerRoleAll=com.apple.python3;}'

echo "🔄 Killing launch services to apply changes..."
/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain system -domain user

echo "✅ Done! Try opening a .py file now - it should use Python instead of Xcode."
echo ""
echo "💡 Alternative: Right-click any .py file → Get Info → Open with → Python Launcher → Change All"
