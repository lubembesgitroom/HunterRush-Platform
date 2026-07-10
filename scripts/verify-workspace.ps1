Write-Host ""
Write-Host "========================================="
Write-Host "      HunterRush Workspace Verification"
Write-Host "========================================="
Write-Host ""

Write-Host "Current Directory:"
Get-Location

Write-Host ""
Write-Host "Node Version:"
node -v

Write-Host ""
Write-Host "pnpm Version:"
pnpm -v

Write-Host ""
Write-Host "Git Version:"
git --version

Write-Host ""
Write-Host "Turbo Version:"
pnpm exec turbo --version

Write-Host ""
Write-Host "Workspace Status:"
git status

Write-Host ""
Write-Host "========================================="
Write-Host "Verification Complete"
Write-Host "========================================="