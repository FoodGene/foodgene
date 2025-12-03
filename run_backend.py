#!/usr/bin/env python
"""Simple startup script for FoodGene backend."""
import sys
import os

# Add the foodgene directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    from backend.app import app
    
    print("Starting FoodGene Backend API...")
    print(f"API Title: {app.title}")
    print(f"API Version: {app.version}")
    print("Listening on http://0.0.0.0:8000")
    print("API Docs available at http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload to avoid import issues
        log_level="info"
    )
