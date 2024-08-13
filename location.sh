#!/bin/bash

# Set environment variables
export SSH_KEY_PATH="/home/ubuntu/KelvinsFirstKey.pem"
export WINDOWS_USER="your_windows_username"
export WINDOWS_PASS="your_windows_password"
export WINDOWS_IP="your_windows_ip"
export LINUX_USER="ubuntu"
export LINUX_IP="3.144.143.231"

# Add these variables to the /etc/environment file to persist after reboot
echo "SSH_KEY_PATH=\"$SSH_KEY_PATH\"" | sudo tee -a /etc/environment
echo "WINDOWS_USER=\"$WINDOWS_USER\"" | sudo tee -a /etc/environment
echo "WINDOWS_PASS=\"$WINDOWS_PASS\"" | sudo tee -a /etc/environment
echo "WINDOWS_IP=\"$WINDOWS_IP\"" | sudo tee -a /etc/environment
echo "LINUX_USER=\"$LINUX_USER\"" | sudo tee -a /etc/environment
echo "LINUX_IP=\"$LINUX_IP\"" | sudo tee -a /etc/environment

echo "Environment variables have been set."

# Display the set environment variables
echo "Current environment variables:"
echo "SSH_KEY_PATH: $SSH_KEY_PATH"
echo "WINDOWS_USER: $WINDOWS_USER"
echo "WINDOWS_IP: $WINDOWS_IP"
echo "LINUX_USER: $LINUX_USER"
echo "LINUX_IP: $LINUX_IP"

echo "WINDOWS_PASS: ********"  # Not showing the actual password for security reasons

# Remind the user to re-login or reload environment variables
echo "Note: Some changes may require re-login to take effect."
echo "You can run 'source /etc/environment' to load these variables immediately."