#!/bin/bash
# Script to generate self-signed SSL certificates for development

# Create directory for certificates if it doesn't exist
mkdir -p $(dirname "$0")

# Generate private key
openssl genrsa -out $(dirname "$0")/server.key 2048

# Generate CSR (Certificate Signing Request)
openssl req -new -key $(dirname "$0")/server.key -out $(dirname "$0")/server.csr -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

# Generate self-signed certificate (valid for 365 days)
openssl x509 -req -days 365 -in $(dirname "$0")/server.csr -signkey $(dirname "$0")/server.key -out $(dirname "$0")/server.crt

# Set appropriate permissions
chmod 600 $(dirname "$0")/server.key
chmod 600 $(dirname "$0")/server.crt

# Remove CSR as it's no longer needed
rm $(dirname "$0")/server.csr

echo "Self-signed SSL certificate generated successfully!"
echo "  - Private key: $(dirname "$0")/server.key"
echo "  - Certificate: $(dirname "$0")/server.crt"
echo ""
echo "Note: This is a self-signed certificate for development only."
echo "For production, use a certificate from a trusted Certificate Authority." 