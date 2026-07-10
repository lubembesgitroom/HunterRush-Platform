Write-Host ""
Write-Host "==========================================="
Write-Host " HunterRush Gateway Bootstrap"
Write-Host "==========================================="
Write-Host ""

$directories = @(
    "apps/gateway/src",
    "apps/gateway/src/config",
    "apps/gateway/src/controllers",
    "apps/gateway/src/middleware",
    "apps/gateway/src/plugins",
    "apps/gateway/src/routes",
    "apps/gateway/src/services",
    "apps/gateway/src/sockets",
    "apps/gateway/src/types",
    "apps/gateway/src/utils"
)

foreach ($dir in $directories) {

    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created: $dir" -ForegroundColor Green
    }
    else {
        Write-Host "Exists : $dir" -ForegroundColor Yellow
    }

}

$files = @(
    "apps/gateway/src/app.ts",
    "apps/gateway/src/server.ts",
    "apps/gateway/package.json",
    "apps/gateway/tsconfig.json",
    "apps/gateway/README.md"
)

foreach ($file in $files) {

    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "Created: $file" -ForegroundColor Green
    }
    else {
        Write-Host "Exists : $file" -ForegroundColor Yellow
    }

}

Write-Host ""
Write-Host "Gateway scaffold complete."