#!/bin/bash

# Create certs directory if it doesn't exist
mkdir -p ./certs

# Generate SSL certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./certs/localhost.key \
  -out ./certs/localhost.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"
