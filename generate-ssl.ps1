# 🔒 SSL Certificate Generation Script for Windows PowerShell
# This script helps generate SSL certificates for self-hosted deployments

Write-Host "🔒 SSL Certificate Generation Tool" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Blue

# Function to check if command exists
function Test-CommandExists {
    param($Command)
    $exists = $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
    return $exists
}

# Check if OpenSSL is installed
if (-not (Test-CommandExists "openssl")) {
    Write-Host "❌ OpenSSL is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install OpenSSL first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://slproweb.com/products/Win32OpenSSL.html"
    Write-Host "2. Or install via Chocolatey: choco install openssl"
    Write-Host "3. Or install via Scoop: scoop install openssl"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ OpenSSL found" -ForegroundColor Green

# Get domain name
$domain = Read-Host "Enter your domain name (e.g., yourdomain.com)"
if ([string]::IsNullOrWhiteSpace($domain)) {
    Write-Host "❌ Domain name is required" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Create SSL directory
$sslDir = "ssl-certificates"
if (-not (Test-Path $sslDir)) {
    New-Item -ItemType Directory -Path $sslDir | Out-Null
}
Set-Location $sslDir

Write-Host ""
Write-Host "📋 Choose certificate type:" -ForegroundColor Yellow
Write-Host "1. Self-signed certificate (for development/testing)"
Write-Host "2. Certificate Signing Request (CSR) for CA"
Write-Host "3. Let's Encrypt setup guide"
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🔧 Generating self-signed certificate..." -ForegroundColor Blue
        
        # Generate private key
        Write-Host "Generating private key..."
        & openssl genrsa -out "$domain.key" 2048
        
        # Generate certificate
        Write-Host "Generating self-signed certificate..."
        & openssl req -new -x509 -key "$domain.key" -out "$domain.crt" -days 365 -subj "/C=US/ST=State/L=City/O=Organization/OU=IT Department/CN=$domain"
        
        # Create bundle
        Get-Content "$domain.crt" | Out-File "$domain-bundle.crt" -Encoding ASCII
        
        Write-Host "✅ Self-signed certificate generated!" -ForegroundColor Green
        Write-Host "⚠️  Note: Self-signed certificates will show security warnings in browsers" -ForegroundColor Yellow
    }
    
    "2" {
        Write-Host "🔧 Generating Certificate Signing Request (CSR)..." -ForegroundColor Blue
        
        # Generate private key
        Write-Host "Generating private key..."
        & openssl genrsa -out "$domain.key" 2048
        
        # Generate CSR
        Write-Host "Generating Certificate Signing Request..."
        & openssl req -new -key "$domain.key" -out "$domain.csr" -subj "/C=US/ST=State/L=City/O=Organization/OU=IT Department/CN=$domain"
        
        Write-Host "✅ CSR generated!" -ForegroundColor Green
        Write-Host "📤 Send the CSR file ($domain.csr) to your Certificate Authority" -ForegroundColor Blue
    }
    
    "3" {
        Write-Host "🔧 Let's Encrypt Setup Guide" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Let's Encrypt provides free SSL certificates with automatic renewal."
        Write-Host ""
        Write-Host "For Windows with IIS:"
        Write-Host "1. Install win-acme (WACS):"
        Write-Host "   Download from: https://www.win-acme.com/"
        Write-Host ""
        Write-Host "2. Run win-acme and follow the wizard:"
        Write-Host "   wacs.exe"
        Write-Host ""
        Write-Host "For Windows with other web servers:"
        Write-Host "1. Install Certbot for Windows:"
        Write-Host "   Download from: https://certbot.eff.org/instructions?ws=other&os=windows"
        Write-Host ""
        Write-Host "2. Generate certificate:"
        Write-Host "   certbot certonly --standalone -d $domain -d www.$domain"
        Write-Host ""
        Write-Host "3. Set up auto-renewal with Task Scheduler"
        Write-Host ""
        Write-Host "For more information, visit: https://certbot.eff.org/"
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

if ($choice -eq "1" -or $choice -eq "2") {
    Write-Host ""
    Write-Host "📁 Files generated:" -ForegroundColor Green
    Get-ChildItem "$domain.*" | Format-Table Name, Length, LastWriteTime
    
    Write-Host ""
    Write-Host "🔧 Next Steps:" -ForegroundColor Blue
    
    if ($choice -eq "1") {
        Write-Host "1. Copy $domain.crt and $domain.key to your web server"
        Write-Host "2. Configure your web server to use these certificates"
        Write-Host "3. Test your SSL configuration"
        Write-Host ""
        Write-Host "Example IIS configuration:" -ForegroundColor Yellow
        Write-Host "1. Open IIS Manager"
        Write-Host "2. Select your site -> Bindings -> Add"
        Write-Host "3. Type: https, Port: 443"
        Write-Host "4. SSL Certificate: Import your .crt and .key files"
        Write-Host ""
        Write-Host "Example Nginx configuration:" -ForegroundColor Yellow
        Write-Host "server {"
        Write-Host "    listen 443 ssl;"
        Write-Host "    server_name $domain;"
        Write-Host "    ssl_certificate /path/to/$domain.crt;"
        Write-Host "    ssl_certificate_key /path/to/$domain.key;"
        Write-Host "    # ... rest of your configuration"
        Write-Host "}"
    }
    
    if ($choice -eq "2") {
        Write-Host "1. Send $domain.csr to your Certificate Authority"
        Write-Host "2. Receive the signed certificate from your CA"
        Write-Host "3. Install the certificate on your web server with $domain.key"
    }
    
    Write-Host ""
    Write-Host "🔍 Test your SSL after installation:" -ForegroundColor Blue
    Write-Host "- SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=$domain"
    Write-Host "- PowerShell: Test-NetConnection $domain -Port 443"
    Write-Host "- OpenSSL: openssl s_client -connect $domain`:443 -servername $domain"
}

Write-Host ""
Write-Host "🎉 SSL certificate generation completed!" -ForegroundColor Green

# Security reminder
Write-Host ""
Write-Host "🔒 Security Reminders:" -ForegroundColor Yellow
Write-Host "- Keep your private key (.key file) secure and never share it"
Write-Host "- Set appropriate file permissions for the private key"
Write-Host "- Regularly monitor certificate expiry dates"
Write-Host "- Use strong ciphers and protocols (TLS 1.2+)"
Write-Host "- Consider implementing HSTS headers"

Set-Location ..
Write-Host "📁 Certificates saved in: $(Get-Location)\$sslDir" -ForegroundColor Blue

Write-Host ""
Read-Host "Press Enter to exit"