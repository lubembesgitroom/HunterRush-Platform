param(
    [Parameter(Mandatory = $true)]
    [string]$Name
)

$componentDir = "packages/ui/src"
$file = Join-Path $componentDir "$Name.tsx"

if (!(Test-Path $componentDir)) {
    New-Item -ItemType Directory -Path $componentDir -Force | Out-Null
}

if (Test-Path $file) {
    Write-Host ""
    Write-Host "❌ Component '$Name' already exists." -ForegroundColor Yellow
    exit
}

@"
export interface ${Name}Props {

}

export function $Name({}: ${Name}Props) {
    return (
        <div>
            $Name Component
        </div>
    );
}
"@ | Set-Content $file

Write-Host ""
Write-Host "✅ Created component:"
Write-Host $file -ForegroundColor Green