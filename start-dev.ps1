$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeDir = "C:\Users\Valeriy\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$node = Join-Path $nodeDir "node.exe"
$vite = Join-Path $projectRoot "node_modules\vite\bin\vite.js"

if (-not (Test-Path $node)) {
  Write-Host "Node.js не найден. Установите Node.js или запустите проект через npm/pnpm." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $vite)) {
  Write-Host "Зависимости не установлены. Запустите pnpm install или npm install." -ForegroundColor Yellow
  exit 1
}

$env:PATH = "$nodeDir;$env:PATH"
Set-Location $projectRoot

Write-Host "Сайт запускается..." -ForegroundColor Cyan
Write-Host "Откройте http://127.0.0.1:5173/" -ForegroundColor Green
& $node $vite --host 127.0.0.1 --port 5173
