$data = [Console]::In.ReadToEnd() | ConvertFrom-Json
New-Item -ItemType Directory -Force -Path logs | Out-Null
$name = if ($data.toolName) { $data.toolName } else { 'unknown' }
$entry = "`n[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')]`nInput: $($data.toolArgs)`nOutput: $($data.toolResult.textResultForLlm)`n---"
Add-Content -Path "logs/$name.log" -Value $entry
