#!/bin/bash

# 🚀 Deployment Script for Static Website
# This script helps you deploy your website to GitHub Pages

echo "🌟 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git repository not found. Initializing...${NC}"
    git init
    echo -e "${GREEN}✅ Git repository initialized${NC}"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️ You have uncommitted changes. Committing them now...${NC}"
    
    # Add all files
    git add .
    
    # Commit with timestamp
    commit_message="Update website - $(date +'%Y-%m-%d %H:%M:%S')"
    git commit -m "$commit_message"
    echo -e "${GREEN}✅ Changes committed: $commit_message${NC}"
else
    echo -e "${GREEN}✅ No uncommitted changes found${NC}"
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️ No remote origin found.${NC}"
    echo -e "${BLUE}Please add your GitHub repository as remote:${NC}"
    echo "git remote add origin https://github.com/yourusername/ngstatic.git"
    echo -e "${BLUE}Then run this script again.${NC}"
    exit 1
fi

# Push to main branch
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo -e "${GREEN}🚀 GitHub Actions will automatically deploy your website.${NC}"
    echo -e "${BLUE}📱 Check deployment status at: https://github.com/yourusername/ngstatic/actions${NC}"
    echo -e "${BLUE}🌐 Your website will be live at: https://yourusername.github.io/ngstatic${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub. Please check your repository settings.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment process completed!${NC}"