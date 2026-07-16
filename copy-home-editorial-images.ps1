$ErrorActionPreference = 'Stop'
$src = "C:\Users\CHI NGUYEN\.grok\sessions\D%3A%5CPersonal_Project%5CLumenora\019f6b23-639c-7e03-a9e4-5f90fcd2cc7e\images"
$dst = "D:\Personal_Project\Lumenora\Frontend\public\assets\generated"

if (-not (Test-Path $src)) { throw "Source not found: $src" }
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst -Force | Out-Null }

$map = [ordered]@{
  "1.jpg"  = "home-contents-skin.jpg"
  "3.jpg"  = "home-contents-body.jpg"
  "2.jpg"  = "home-contents-sun.jpg"
  "4.jpg"  = "home-brand-interlude.jpg"
  "5.jpg"  = "home-composition-sunscreen.jpg"
  "6.jpg"  = "home-composition-mask.jpg"
  "7.jpg"  = "home-daily-edit.jpg"
  "8.jpg"  = "home-ritual-treat.jpg"
  "10.jpg" = "home-ritual-protect.jpg"
  "9.jpg"  = "home-journal-primary.jpg"
  "11.jpg" = "home-ritual-cleanse.jpg"
  "12.jpg" = "home-composition-serum.jpg"
}

$results = @()
foreach ($pair in $map.GetEnumerator()) {
  $from = Join-Path $src $pair.Key
  $to = Join-Path $dst $pair.Value
  if (-not (Test-Path $from)) { throw "Missing source file: $from" }
  Copy-Item -LiteralPath $from -Destination $to -Force
  $item = Get-Item -LiteralPath $to
  $results += [pscustomobject]@{ Name = $item.Name; Bytes = $item.Length; FullName = $item.FullName }
  Write-Host ("Copied {0} -> {1} ({2:N0} bytes)" -f $pair.Key, $pair.Value, $item.Length)
}

Write-Host ""
Write-Host "=== Created files ==="
$results | Format-Table Name, Bytes, FullName -AutoSize
$results | ConvertTo-Json | Set-Content -Path (Join-Path $dst "_copy-home-images-result.json") -Encoding UTF8
Write-Host "Done. Verification JSON: $dst\_copy-home-images-result.json"
