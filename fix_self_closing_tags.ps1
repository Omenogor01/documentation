param(
    [string]$SearchPath = "C:\Users\PC\documentation"
)

# Function to fix self-closing tags
function Fix-SelfClosingTags {
    param([string]$FilePath)

    $content = Get-Content $FilePath -Raw
    $updatedContent = $content -replace '(\s+)/\u003e', ' />'
    $updatedContent | Set-Content $FilePath
}

# Find all markdown files
Get-ChildItem -Path $SearchPath -Recurse -Include *.md | ForEach-Object {
    Fix-SelfClosingTags -FilePath $_.FullName
}
