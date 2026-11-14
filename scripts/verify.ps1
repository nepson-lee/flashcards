# Export a flashcard .docx to PDF with Microsoft Word, then rasterize each page to PNG for review.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify.ps1 flashcards_group_1.docx
param([Parameter(Mandatory = $true)][string]$Docx)

$root = Split-Path -Parent $PSScriptRoot
$docxPath = (Resolve-Path $Docx).Path
$name = [IO.Path]::GetFileNameWithoutExtension($docxPath)
$outDir = Join-Path $root ".preview"
New-Item -ItemType Directory -Force $outDir | Out-Null
[string]$pdf = Join-Path $outDir "$name.pdf"   # must be a plain string: COM mis-marshals PSObject-wrapped paths and Word hangs
# Word can hang on ExportAsFixedFormat when the target PDF already exists, so always start clean.
Remove-Item $pdf, (Join-Path $outDir "$name-p*.png") -Force -ErrorAction SilentlyContinue

$w = New-Object -ComObject Word.Application
$w.Visible = $false
$w.DisplayAlerts = 0   # a hidden modal dialog would hang the script forever
try {
    $d = $w.Documents.Open($docxPath, $false, $true)
    $d.ExportAsFixedFormat($pdf, 17)
    $d.Close($false)
} finally { $w.Quit() }

# PyMuPDF lives in a repo-local folder so nothing is installed system-wide.
$pylib = Join-Path $root ".tools\pylib"
if (-not (Test-Path (Join-Path $pylib "pymupdf"))) {
    python -m pip install --quiet --no-input --disable-pip-version-check --timeout 30 --target $pylib pymupdf
}
$env:PYTHONPATH = $pylib
python -c "import pymupdf,sys,os; d=pymupdf.open(sys.argv[1]); print('pages (PDF):', len(d)); [p.get_pixmap(dpi=110).save(os.path.join(sys.argv[2], f'{sys.argv[3]}-p{i+1}.png')) for i,p in enumerate(d)]" $pdf $outDir $name
Get-ChildItem $outDir -Filter "$name-p*.png" | ForEach-Object { $_.FullName }
