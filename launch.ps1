$backendPath = Join-Path $PSScriptRoot 'backend'
$mobilePath = Join-Path $PSScriptRoot 'mobile'

Write-Host 'Starting backend in a new PowerShell window...'
Start-Process pwsh -ArgumentList "-NoExit", "-Command Set-Location -LiteralPath '$backendPath'; npm run dev"
Start-Sleep -Seconds 2
Write-Host 'Starting mobile app in a new PowerShell window...'
Start-Process pwsh -ArgumentList "-NoExit", "-Command Set-Location -LiteralPath '$mobilePath'; npm start"
Write-Host 'Launch initiated. Check the new PowerShell windows for backend and Expo logs.'
