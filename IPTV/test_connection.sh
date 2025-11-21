#!/bin/bash
# Test script to verify server connectivity

echo "=== IPTV Server Connection Test ==="
echo ""

echo "1. Checking Mac IP address:"
MAC_IP=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -1)
echo "   Mac IP: $MAC_IP"
echo ""

echo "2. Checking if servers are running:"
if launchctl list | grep -q "iptv-frontend"; then
    echo "   ✓ Frontend server is running"
else
    echo "   ✗ Frontend server is NOT running"
fi

if launchctl list | grep -q "iptv-server"; then
    echo "   ✓ API server is running"
else
    echo "   ✗ API server is NOT running"
fi
echo ""

echo "3. Testing local connectivity:"
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "   ✓ Frontend accessible locally (port 8080)"
else
    echo "   ✗ Frontend NOT accessible locally"
fi

if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "   ✓ API accessible locally (port 5001)"
else
    echo "   ✗ API NOT accessible locally"
fi
echo ""

echo "4. Testing network connectivity:"
if curl -s --max-time 2 http://$MAC_IP:8080 > /dev/null 2>&1; then
    echo "   ✓ Frontend accessible via network IP ($MAC_IP:8080)"
else
    echo "   ✗ Frontend NOT accessible via network IP"
fi

if curl -s --max-time 2 http://$MAC_IP:5001/api/health > /dev/null 2>&1; then
    echo "   ✓ API accessible via network IP ($MAC_IP:5001)"
else
    echo "   ✗ API NOT accessible via network IP"
fi
echo ""

echo "5. Firewall status:"
FW_STATE=$(/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null | grep -o "enabled\|disabled")
echo "   Firewall: $FW_STATE"
echo ""

echo "6. Port status:"
echo "   Port 8080:"
lsof -i :8080 2>/dev/null | head -2 || echo "      No process found"
echo "   Port 5001:"
lsof -i :5001 2>/dev/null | head -2 || echo "      No process found"
echo ""

echo "=== Instructions for iPhone ==="
echo "On your iPhone, open Safari and try:"
echo "  http://$MAC_IP:8080"
echo ""
echo "If it doesn't work:"
echo "  1. Make sure iPhone and Mac are on the same WiFi network"
echo "  2. Try disabling Mac firewall temporarily:"
echo "     System Settings > Network > Firewall"
echo "  3. Check iPhone can ping Mac: (not possible from iPhone, but verify network)"
echo "  4. Try accessing from another device on same network first"



