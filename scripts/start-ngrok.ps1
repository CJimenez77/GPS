#!/usr/bin/env pwsh
# Ngrok startup script for ms-requirements
# Usage: .\scripts\start-ngrok.ps1

$ErrorActionPreference = "Stop"

$NGROK_CONFIG = @"
authtoken: {0}
tunnels:
  ms-requirements:
    addr: 3001
    proto: http
    host-header: localhost:3001
"@

$AuthToken = $env:NGROK_AUTH_TOKEN
if (-not $AuthToken) {
    Write-Host "NGROK_AUTH_TOKEN not set. Get it from https://dashboard.ngrok.com/auth"
    exit 1
}

$ConfigPath = "$env:USERPROFILE/.ngrok.yml"
$NGROK_CONFIG -f $AuthToken | Out-File -FilePath $ConfigPath -Encoding UTF8

Write-Host "Starting ngrok tunnel to port 3001..."
ngrok http 3001 --config=$ConfigPath