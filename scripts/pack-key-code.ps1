# Pack Aurora Vine key source for AI review (preserves relative paths)
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$OutDir = Join-Path $Root 'dist\Aurora_Vine_key_code'
$ZipPath = Join-Path $Root 'Aurora_Vine_key_code.zip'

if (Test-Path $OutDir) { Remove-Item $OutDir -Recurse -Force }
if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

$SkipDirNames = @('node_modules', 'out', '.cursor', '.git', 'dist', 'scripts')
$MediaExt = @('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.pdf')
$DataExt = @('.db', '.xlsx', '.xls', '.csv')
$OmitRootDirs = @('image', 'major', 'personalCase', 'backup', 'node_modules', 'out', '.cursor', '.git', 'dist', 'scripts')

function Test-ShouldCopyFile([string]$rel) {
    $norm = $rel -replace '\\', '/'
    if ($norm -match '^school/No\.\d+/') {
        if ($norm -eq 'school/No.1/intro.json') { return $true }
        return $false
    }
    foreach ($d in $OmitRootDirs) {
        if ($norm -eq $d -or $norm.StartsWith("$d/")) { return $false }
    }
    $ext = [IO.Path]::GetExtension($norm).ToLowerInvariant()
    if ($MediaExt -contains $ext) { return $false }
    if ($DataExt -contains $ext) { return $false }
    if ($norm -eq 'package-lock.json') { return $false }
    return $true
}

$allFiles = Get-ChildItem -Path $Root -Recurse -File -Force |
    Where-Object {
        $rel = $_.FullName.Substring($Root.Length + 1)
        $parts = $rel -split '[\\/]'
        -not ($parts | Where-Object { $SkipDirNames -contains $_ })
    }

$copied = 0
foreach ($f in $allFiles) {
    $rel = $f.FullName.Substring($Root.Length + 1)
    if (-not (Test-ShouldCopyFile $rel)) { continue }
    $dest = Join-Path $OutDir $rel
    $destParent = Split-Path $dest -Parent
    if (-not (Test-Path $destParent)) { New-Item -ItemType Directory -Path $destParent -Force | Out-Null }
    Copy-Item -LiteralPath $f.FullName -Destination $dest -Force
    $copied++
}

# Copy bundled docs from repo templates
$templates = Join-Path $PSScriptRoot 'pack-templates'
foreach ($t in Get-ChildItem $templates -File) {
    $destRel = $t.Name
    if ($t.Name -eq 'school_README.md') { $destRel = 'school\README_OMITTED_ASSETS.md' }
    if ($t.Name -eq 'data_README.md') { $destRel = 'data\README_OMITTED_ASSETS.md' }
    $dest = Join-Path $OutDir $destRel
    $parent = Split-Path $dest -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item $t.FullName $dest -Force
}

function Get-DirSummary([string]$dirRel) {
    $full = Join-Path $Root $dirRel
    if (-not (Test-Path $full)) { return $null }
    $files = Get-ChildItem -Path $full -Recurse -File -Force -ErrorAction SilentlyContinue
    $byExt = $files | Group-Object Extension | Sort-Object Count -Descending
    $parts = @()
    foreach ($g in $byExt) {
        $ext = if ($g.Name) { $g.Name } else { '(no ext)' }
        $parts += "${ext}x$($g.Count)"
    }
    return ($parts -join ', ')
}

function Add-DirTreeLines {
    param(
        [System.Collections.Generic.List[string]]$out,
        [string]$dirRel,
        [string]$dirTag
    )
    $full = Join-Path $Root $dirRel
    if (-not (Test-Path $full)) { return }
    $baseDepth = ($dirRel -split '/').Count
    $out.Add("$dirRel/  $dirTag")
    $printed = New-Object 'System.Collections.Generic.HashSet[string]'
    $files = Get-ChildItem $full -Recurse -File -Force | ForEach-Object {
        $rel = ($_.FullName.Substring($Root.Length + 1)) -replace '\\', '/'
        $tag = if (Test-ShouldCopyFile $rel) { '[INCLUDED]' } else { '[OMITTED]' }
        [PSCustomObject]@{ Rel = $rel; Tag = $tag }
    } | Sort-Object Rel
    foreach ($f in $files) {
        $parts = $f.Rel -split '/'
        for ($i = $baseDepth; $i -lt ($parts.Count - 1); $i++) {
            $dirPath = ($parts[0..$i] -join '/') + '/'
            if ($printed.Add($dirPath)) {
                $indent = '  ' * ($i - $baseDepth + 1)
                $out.Add("$indent$($parts[$i])/")
            }
        }
        $indent = '  ' * ($parts.Count - $baseDepth)
        $out.Add("$indent$($parts[-1])  $($f.Tag)")
    }
    $out.Add('')
}

$headerPath = Join-Path $templates 'PROJECT_TREE_HEADER.txt'
$tree = New-Object System.Collections.Generic.List[string]
if (Test-Path $headerPath) {
    Get-Content $headerPath -Encoding UTF8 | ForEach-Object { $tree.Add($_) }
}
$tree.Add('Generated: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
$tree.Add('')

$rootItems = Get-ChildItem -Path $Root -Force | Sort-Object { -not $_.PSIsContainer }, Name
foreach ($item in $rootItems) {
    $name = $item.Name
    if ($SkipDirNames -contains $name -or $name -eq 'Aurora_Vine_key_code.zip') { continue }

    if ($item.PSIsContainer) {
        if ($name -eq 'school') {
            $schoolDirs = @(Get-ChildItem (Join-Path $Root 'school') -Directory | Sort-Object { [int]($_.Name -replace 'No\.', '') })
            $count = $schoolDirs.Count
            $lastNo = $schoolDirs[-1].Name
            $tree.Add("school/  [PARTIAL] $count dirs No.* ; per school: intro.json + images")
            $tree.Add('  No.1/')
            $tree.Add('    intro.json  [INCLUDED] sample only')
            $tree.Add('    *.jpg, *.png, *.PNG  [OMITTED] media (~5-8 per school)')
            if ($count -gt 1) {
                $tree.Add("  No.2/ ... $lastNo/  [OMITTED] same layout, $($count - 1) dirs not packed")
            }
            $tree.Add('  README_OMITTED_ASSETS.md  [INCLUDED]')
            $tree.Add('')
            continue
        }
        if ($OmitRootDirs -contains $name) {
            $sum = Get-DirSummary $name
            $reason = switch ($name) {
                'image' { 'app illustrations' }
                'major' { 'programs xlsx for init_db' }
                'personalCase' { 'cases csv for init_db' }
                'backup' { 'legacy backup' }
                default { 'build or vendor' }
            }
            $tree.Add("$name/  [OMITTED] $reason$(if ($sum) { " ($sum)" })")
            if ($name -in @('image', 'major', 'personalCase')) {
                Get-ChildItem (Join-Path $Root $name) -File -ErrorAction SilentlyContinue | ForEach-Object {
                    $tree.Add("    $($_.Name)  [OMITTED]")
                }
            }
            $tree.Add('')
            continue
        }
        Add-DirTreeLines $tree $name '[INCLUDED]'
    } else {
        $tag = if (Test-ShouldCopyFile $name) { '[INCLUDED]' } else { '[OMITTED]' }
        $tree.Add("$name  $tag")
    }
}

$tree.Add('node_modules/  [OMITTED] npm dependencies (not listed)')
$tree.Add('out/  [OMITTED] electron-vite build output')
$tree.Add('dist/  [OMITTED] local pack output only')
$tree.Add('scripts/  [OMITTED] pack-key-code.ps1 tooling')
$tree.Add('')
$tree.Add("Pack stats: $copied files copied into this zip")

$treePath = Join-Path $OutDir 'PROJECT_TREE.txt'
[System.IO.File]::WriteAllText($treePath, ($tree -join [Environment]::NewLine), [System.Text.UTF8Encoding]::new($false))

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($OutDir, $ZipPath)

$zipKb = [math]::Round((Get-Item $ZipPath).Length / 1KB, 1)
Write-Host "Copied: $copied files"
Write-Host "Dir: $OutDir"
Write-Host "Zip: $ZipPath ($zipKb KB)"
