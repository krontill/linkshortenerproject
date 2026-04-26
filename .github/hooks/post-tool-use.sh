#!/bin/bash
toolName=$(node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).toolName || ''")
if [ "$toolName" = "create" ] || [ "$toolName" = "edit" ]; then
  npx prettier --write .
fi
