# PowerShell UTF-8 Configuration for CRM System
# Run this before testing API in PowerShell

# Set console to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Set PowerShell default encoding to UTF-8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

Write-Host "✓ PowerShell configured for UTF-8" -ForegroundColor Green
Write-Host "You can now test API with proper Vietnamese encoding`n" -ForegroundColor Cyan

# Example usage:
Write-Host "Example:" -ForegroundColor Yellow
Write-Host '  $deals = (curl.exe http://localhost:3000/api/deals | ConvertFrom-Json).data' -ForegroundColor Gray
Write-Host '  $deals[0] | Select-Object id, title, stage | Format-Table' -ForegroundColor Gray
Write-Host ""
