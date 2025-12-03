#!/bin/bash

# FoodGene Project Setup Script
# This script sets up both frontend and backend with all dependencies

set -e  # Exit on error

echo "🥗 FoodGene Setup Script"
echo "======================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -f "QUICK_START.md" ]; then
    echo "❌ Please run this script from the foodgene root directory"
    exit 1
fi

# Setup Frontend
echo -e "${BLUE}Setting up Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

cd ..
echo ""

# Setup Backend
echo -e "${BLUE}Setting up Backend...${NC}"
cd ml

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+"
    exit 1
fi

echo "🐍 Python version:"
python3 --version
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
fi

# Activate virtual environment
source venv/bin/activate || . venv/Scripts/activate

echo "📦 Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

cd ..
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cat > .env << 'EOF'
# Email Configuration
# Choose provider: smtp or sendgrid
EMAIL_PROVIDER=smtp

# SMTP Configuration (for Gmail, Outlook, etc.)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password

# SendGrid Configuration (alternative to SMTP)
# SENDGRID_API_KEY=your_sendgrid_api_key
# SENDGRID_FROM_EMAIL=noreply@foodgene.com

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
EOF
    echo -e "${YELLOW}⚠️  .env file created - UPDATE WITH YOUR EMAIL CREDENTIALS${NC}"
    echo ""
fi

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo "1. Update .env file with email configuration:"
echo "   - For Gmail: Get App Password from myaccount.google.com/apppasswords"
echo "   - For SendGrid: Sign up at sendgrid.com and get API key"
echo ""
echo "2. Start Backend:"
echo "   cd ml"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python app.py"
echo ""
echo "3. In another terminal, start Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Open browser to http://localhost:5173"
echo ""
echo -e "${YELLOW}📖 See QUICK_START.md for detailed instructions${NC}"
echo -e "${YELLOW}📖 See docs/FEATURES_GUIDE.md for feature documentation${NC}"
