# Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-12
# Description: Automated daily MySQL backup script for BuildPilot AI Pro

$BackupDir = "c:\Users\kirth\OneDrive\Desktop\build pilot ai pro\backups"
$MysqlDumpPath = "C:\Program Files\MySQL\MySQL Workbench 8.0\mysqldump.exe"
$DateStr = Get-Date -Format "yyyy-MM-dd_HH-mm"
$OutputFile = "$BackupDir\buildpilot_backup_$DateStr.sql"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

Write-Host "Starting MySQL backup to $OutputFile..."
& $MysqlDumpPath -u root -p"NewPassword@123" --host=127.0.0.1 --port=3306 buildpilot > $OutputFile

if (Test-Path $OutputFile) {
    $Size = (Get-Item $OutputFile).Length
    Write-Host "[SUCCESS] Backup created successfully. Size: $Size bytes"
} else {
    Write-Error "[FAILED] Backup file was not generated."
}
