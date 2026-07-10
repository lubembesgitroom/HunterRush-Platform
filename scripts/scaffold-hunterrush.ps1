Write-Host ""
Write-Host "==========================================="
Write-Host "     HunterRush Platform Scaffolder"
Write-Host "==========================================="
Write-Host ""

$directories = @(
    "apps/gateway",
    "apps/gateway/src",

    "apps/sdk-demo",
    "apps/sdk-demo/src",

    "apps/operator",
    "apps/operator/src",

    "packages/game-engine",
    "packages/game-engine/src",

    "packages/provably-fair",
    "packages/provably-fair/src",

    "packages/sdk",
    "packages/sdk/src",

    "packages/shared",
    "packages/shared/src",

    "packages/config",
    "packages/config/src",

    "packages/types",
    "packages/types/src",

    "packages/ui/src/components",
    "packages/ui/src/hooks",
    "packages/ui/src/lib",
    "packages/ui/src/styles",
    "packages/ui/src/types",

    "prisma",
    "tooling"
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

Write-Host ""
Write-Host "==========================================="
Write-Host "Workspace Ready"
Write-Host "==========================================="