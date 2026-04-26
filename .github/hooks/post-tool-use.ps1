$data = [Console]::In.ReadToEnd() | ConvertFrom-Json
if ($data.toolName -eq 'create' -or $data.toolName -eq 'edit') {
  npx prettier --write .
}
