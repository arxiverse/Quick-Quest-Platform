$pdfPath = "C:\Neiraverse\Workspace\QuickQuest-Platform\React\src\assets\Figma\QQM_Flow_Document.pdf"
$bytes = [System.IO.File]::ReadAllBytes($pdfPath)
$enc = New-Object System.Text.UTF8Encoding($false)
$text = $enc.GetString($bytes)
$pattern = '[\x20-\x7E]{5,}'
$matchList = [regex]::Matches($text, $pattern)
$results = @()
foreach ($m in $matchList) {
    if ($m.Value -match '[a-zA-Z]') {
        $results += $m.Value
    }
}
$unique = $results | Select-Object -Unique
$unique | Out-File -FilePath "C:\Neiraverse\Workspace\QuickQuest-Platform\React\src\assets\Figma\pdf_text_output.txt" -Encoding UTF8
Write-Host "Done. Lines extracted: $($unique.Count)"
