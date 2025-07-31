#!/bin/bash

# 🔒 SSL Certificate Generation Script
# This script helps generate SSL certificates for self-hosted deployments

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 SSL Certificate Generation Tool${NC}"
echo "=================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if OpenSSL is installed
if ! command_exists openssl; then
    echo -e "${RED}❌ OpenSSL is not installed. Please install it first.${NC}"
    echo "Ubuntu/Debian: sudo apt install openssl"
    echo "CentOS/RHEL: sudo yum install openssl"
    echo "macOS: brew install openssl"
    exit 1
fi

echo -e "${GREEN}✅ OpenSSL found${NC}"

# Get domain name
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domain name is required${NC}"
    exit 1
fi

# Create SSL directory
SSL_DIR="ssl-certificates"
mkdir -p "$SSL_DIR"
cd "$SSL_DIR"

echo -e "${YELLOW}📋 Choose certificate type:${NC}"
echo "1. Self-signed certificate (for development/testing)"
echo "2. Certificate Signing Request (CSR) for CA"
echo "3. Let's Encrypt setup guide"
read -p "Enter choice (1-3): " CHOICE

case $CHOICE in
    1)
        echo -e "${BLUE}🔧 Generating self-signed certificate...${NC}"
        
        # Generate private key
        echo "Generating private key..."
        openssl genrsa -out "${DOMAIN}.key" 2048
        
        # Generate certificate
        echo "Generating self-signed certificate..."
        openssl req -new -x509 -key "${DOMAIN}.key" -out "${DOMAIN}.crt" -days 365 -subj "/C=US/ST=State/L=City/O=Organization/OU=IT Department/CN=${DOMAIN}"
        
        # Create bundle
        cat "${DOMAIN}.crt" > "${DOMAIN}-bundle.crt"
        
        echo -e "${GREEN}✅ Self-signed certificate generated!${NC}"
        echo -e "${YELLOW}⚠️  Note: Self-signed certificates will show security warnings in browsers${NC}"
        ;;
        
    2)
        echo -e "${BLUE}🔧 Generating Certificate Signing Request (CSR)...${NC}"
        
        # Generate private key
        echo "Generating private key..."
        openssl genrsa -out "${DOMAIN}.key" 2048
        
        # Generate CSR
        echo "Generating Certificate Signing Request..."
        openssl req -new -key "${DOMAIN}.key" -out "${DOMAIN}.csr" \
            -subj "/C=US/ST=State/L=City/O=Organization/OU=IT Department/CN=${DOMAIN}"
        
        echo -e "${GREEN}✅ CSR generated!${NC}"
        echo -e "${BLUE}📤 Send the CSR file (${DOMAIN}.csr) to your Certificate Authority${NC}"
        ;;
        
    3)
        echo -e "${BLUE}🔧 Let's Encrypt Setup Guide${NC}"
        echo ""
        echo "Let's Encrypt provides free SSL certificates with automatic renewal."
        echo ""
        echo "For Ubuntu/Debian:"
        echo "1. Install Certbot:"
        echo "   sudo apt update"
        echo "   sudo apt install snapd"
        echo "   sudo snap install --classic certbot"
        echo ""
        echo "2. Generate certificate:"
        echo "   sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
        echo "   # or for Apache:"
        echo "   sudo certbot --apache -d ${DOMAIN} -d www.${DOMAIN}"
        echo ""
        echo "3. Set up auto-renewal:"
        echo "   sudo crontab -e"
        echo "   # Add: 0 12 * * * /usr/bin/certbot renew --quiet"
        echo ""
        echo "For other systems, visit: https://certbot.eff.org/"
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

if [ $CHOICE -eq 1 ] || [ $CHOICE -eq 2 ]; then
    echo ""
    echo -e "${GREEN}📁 Files generated:${NC}"
    ls -la "${DOMAIN}".*
    
    echo ""
    echo -e "${BLUE}🔧 Next Steps:${NC}"
    
    if [ $CHOICE -eq 1 ]; then
        echo "1. Copy ${DOMAIN}.crt and ${DOMAIN}.key to your web server"
        echo "2. Configure your web server to use these certificates"
        echo "3. Test your SSL configuration"
        echo ""
        echo -e "${YELLOW}Example Nginx configuration:${NC}"
        echo "server {"
        echo "    listen 443 ssl;"
        echo "    server_name ${DOMAIN};"
        echo "    ssl_certificate /path/to/${DOMAIN}.crt;"
        echo "    ssl_certificate_key /path/to/${DOMAIN}.key;"
        echo "    # ... rest of your configuration"
        echo "}"
        echo ""
        echo -e "${YELLOW}Example Apache configuration:${NC}"
        echo "SSLEngine on"
        echo "SSLCertificateFile /path/to/${DOMAIN}.crt"
        echo "SSLCertificateKeyFile /path/to/${DOMAIN}.key"
    fi
    
    if [ $CHOICE -eq 2 ]; then
        echo "1. Send ${DOMAIN}.csr to your Certificate Authority"
        echo "2. Receive the signed certificate from your CA"
        echo "3. Install the certificate on your web server with ${DOMAIN}.key"
    fi
    
    echo ""
    echo -e "${BLUE}🔍 Test your SSL after installation:${NC}"
    echo "- SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
    echo "- Command line: openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN}"
fi

echo ""
echo -e "${GREEN}🎉 SSL certificate generation completed!${NC}"

# Security reminder
echo ""
echo -e "${YELLOW}🔒 Security Reminders:${NC}"
echo "- Keep your private key (.key file) secure and never share it"
echo "- Set appropriate file permissions (600 for private key)"
echo "- Regularly monitor certificate expiry dates"
echo "- Use strong ciphers and protocols (TLS 1.2+)"
echo "- Consider implementing HSTS headers"

cd ..
echo -e "${BLUE}📁 Certificates saved in: ${PWD}/${SSL_DIR}${NC}"