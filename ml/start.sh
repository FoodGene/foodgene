#!/bin/bash
echo "Starting FoodGene ML Service..."
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
