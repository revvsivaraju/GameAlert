#!/bin/bash

# Kill any process running on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Server stopped"
else
    echo "ℹ️  No server running on port 8000"
fi

