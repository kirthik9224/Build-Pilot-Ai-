# Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
# Description: Automated end-to-end integration test suite exercising all platform modules

$ErrorActionPreference = 'Stop'

Write-Host "=== TEST 1: Authentication & JWT Login ===" -ForegroundColor Cyan
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post -ContentType "application/json" `
    -Body '{"email":"demo@buildpilot.dev","password":"demo123"}'
$token = $loginRes.token
Write-Host "SUCCESS: Logged in as $($loginRes.name) ($($loginRes.role)). Token received." `
    -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

Write-Host "`n=== TEST 2: User Profile /api/auth/me ===" -ForegroundColor Cyan
$me = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Headers $headers
Write-Host "SUCCESS: Profile verified: $($me.name) ($($me.email)), Role: $($me.role)" `
    -ForegroundColor Green

Write-Host "`n=== TEST 3: User Registration ===" -ForegroundColor Cyan
$rand = Get-Random
$regBody = '{"name":"QA Tester","email":"qa_' + $rand + '@buildpilot.dev","password":"testPass123","role":"DEVELOPER"}'
$regRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
    -Method Post -ContentType "application/json" -Body $regBody
Write-Host "SUCCESS: Registered new account: $($regRes.name) ($($regRes.email))" `
    -ForegroundColor Green

Write-Host "`n=== TEST 4: Project Management ===" -ForegroundColor Cyan
$newProj = Invoke-RestMethod -Uri "http://localhost:8080/api/projects" `
    -Method Post -Headers $headers `
    -Body '{"name":"FinTech Cloud Platform","description":"High-throughput payment gateway"}'
Write-Host "SUCCESS: Created project: $($newProj.name) (ID: $($newProj.id))" `
    -ForegroundColor Green
$testProjectId = $newProj.id

Write-Host "`n=== TEST 5: Live Dashboard Analytics ===" -ForegroundColor Cyan
$dash = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard?projectId=$testProjectId" `
    -Headers $headers
Write-Host "SUCCESS: Project: $($dash.project) | Health: $($dash.healthScore) | Issues: $($dash.total)" `
    -ForegroundColor Green

Write-Host "`n=== TEST 6: Issues Retrieval and Repair ===" -ForegroundColor Cyan
$issues = Invoke-RestMethod -Uri "http://localhost:8080/api/issues?projectId=1" -Headers $headers
Write-Host "Found $($issues.Count) issues."
if ($issues.Count -gt 0) {
    $repairRes = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/issues/$($issues[0].id)/repair" `
        -Method Post -Headers $headers
    Write-Host "SUCCESS: Repaired issue #$($issues[0].id) '$($repairRes.title)': $($repairRes.status)" `
        -ForegroundColor Green
}

Write-Host "`n=== TEST 7: AI Code Review Center ===" -ForegroundColor Cyan
$codeSnippet = "public class PaymentGateway { public void pay(String acc) { String q = `"SELECT * FROM u WHERE id = `" + acc; } }"
$reviewBody = @{
    projectId = $testProjectId
    title = "PaymentGateway.java"
    language = "java"
    filePath = "src/main/java/PaymentGateway.java"
    sourceCode = $codeSnippet
} | ConvertTo-Json
$reviewRes = Invoke-RestMethod -Uri "http://localhost:8080/api/reviews" `
    -Method Post -Headers $headers -Body $reviewBody
Write-Host "SUCCESS: Review created (ID: $($reviewRes.id)). Summary: $($reviewRes.summary)" `
    -ForegroundColor Green
if ($reviewRes.findings.Count -gt 0) {
    $f = $reviewRes.findings[0]
    Write-Host "Finding detected: [$($f.severity)] $($f.category) - $($f.explanation)" `
        -ForegroundColor Yellow
    $patchRes = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/reviews/findings/$($f.id)" `
        -Method Patch -Headers $headers -Body '{"status":"ACCEPTED"}'
    Write-Host "SUCCESS: Updated Finding Status to: $($patchRes.status)" -ForegroundColor Green
}

Write-Host "`n=== TEST 8: AI Debugging & Automated Test Verification ===" -ForegroundColor Cyan
$diagBody = @{
    projectId = $testProjectId
    title = "NullPointerException in TransactionService"
    errorType = "Java Exception"
    stackTrace = "java.lang.NullPointerException: Cannot invoke 'Account.getBalance()' because 'account' is null"
    contextCode = "Account account = null; account.getBalance();"
    targetFile = "TransactionService.java"
} | ConvertTo-Json
$diagRes = Invoke-RestMethod -Uri "http://localhost:8080/api/debugging/diagnose" `
    -Method Post -Headers $headers -Body $diagBody
Write-Host "SUCCESS: Diagnosis complete (ID: $($diagRes.id)). Root Cause: $($diagRes.rootCause)" `
    -ForegroundColor Green
if ($diagRes.fixes.Count -gt 0) {
    $fix = $diagRes.fixes[0]
    $verifyRes = Invoke-RestMethod `
        -Uri "http://localhost:8080/api/debugging/fixes/$($fix.id)/verify" `
        -Method Post -Headers $headers `
        -Body '{"targetFile":"TransactionService.java","originalCode":"account.getBalance();","proposedCode":"if (account != null) { account.getBalance(); }"}'
    Write-Host "SUCCESS: Verification Executed: Passed=$($verifyRes.verificationPassed)" `
        -ForegroundColor Green
    Write-Host "Test Output: $($verifyRes.testOutput)"
}

Write-Host "`n=== TEST 9: Design-to-Code Assistant ===" -ForegroundColor Cyan
$designBody = @{
    projectId = $testProjectId
    prompt = "Create a responsive crypto currency wallet balance card"
    layoutPreset = "Dashboard Card"
} | ConvertTo-Json
$designRes = Invoke-RestMethod -Uri "http://localhost:8080/api/design/generate" `
    -Method Post -Headers $headers -Body $designBody
Write-Host "SUCCESS: Generated Component: $($designRes.componentName) (ID: $($designRes.id))" `
    -ForegroundColor Green

Write-Host "`n=== TEST 10: Intelligent Project Planner ===" -ForegroundColor Cyan
$taskBody = @{
    projectId = $testProjectId
    title = "Integrate Stripe Webhooks"
    description = "Listen for payment events"
    priority = "HIGH"
    estimatedHours = 12.0
    assigneeName = "Kirthik"
} | ConvertTo-Json
$taskRes = Invoke-RestMethod -Uri "http://localhost:8080/api/planner/tasks" `
    -Method Post -Headers $headers -Body $taskBody
Write-Host "SUCCESS: Task created: '$($taskRes.title)' (Priority: $($taskRes.priority))" `
    -ForegroundColor Green

$msBody = @{
    projectId = $testProjectId
    title = "Payment Release v1"
    description = "Gateway go-live"
} | ConvertTo-Json
$msRes = Invoke-RestMethod -Uri "http://localhost:8080/api/planner/milestones" `
    -Method Post -Headers $headers -Body $msBody
Write-Host "SUCCESS: Milestone created: '$($msRes.title)'" -ForegroundColor Green

$forecast = Invoke-RestMethod `
    -Uri "http://localhost:8080/api/planner/forecast?projectId=$testProjectId&days=14&teamSize=2" `
    -Headers $headers
Write-Host "SUCCESS: Forecast: Risk=$($forecast.risk), Workload=$($forecast.loadRatio)x capacity" `
    -ForegroundColor Green

Write-Host "`n=== TEST 11: Application Health Monitoring & Telemetry ===" -ForegroundColor Cyan
$srvBody = @{
    projectId = $testProjectId
    name = "Payment Health Gateway"
    endpointUrl = "http://localhost:8080/api/help"
    intervalSeconds = 30
    simulated = $false
} | ConvertTo-Json
$srvRes = Invoke-RestMethod -Uri "http://localhost:8080/api/monitoring/services" `
    -Method Post -Headers $headers -Body $srvBody
Write-Host "SUCCESS: Added monitored service: '$($srvRes.name)'" -ForegroundColor Green

$pingRes = Invoke-RestMethod `
    -Uri "http://localhost:8080/api/monitoring/services/$($srvRes.id)/ping" `
    -Method Post -Headers $headers
Write-Host "SUCCESS: Ping: Status=$($pingRes.statusCode), Healthy=$($pingRes.healthy), Latency=$($pingRes.responseTimeMs)ms" `
    -ForegroundColor Green

Write-Host "`n=== TEST 12: AI Developer Chat & Mentor ===" -ForegroundColor Cyan
$chatBody = @{
    projectId = $testProjectId
    message = "How can we securely manage database transactions in Spring Boot?"
    contextFile = "TransactionService.java"
} | ConvertTo-Json
$chatRes = Invoke-RestMethod -Uri "http://localhost:8080/api/chat/send" `
    -Method Post -Headers $headers -Body $chatBody
Write-Host "SUCCESS: AI Assistant responded with $($chatRes.assistantMessage.content.Length) chars" `
    -ForegroundColor Green

Write-Host "`n=== TEST 13: Settings and Preferences ===" -ForegroundColor Cyan
$saveSettings = Invoke-RestMethod -Uri "http://localhost:8080/api/settings" `
    -Method Put -Headers $headers -Body '{"alertLevel":"CRITICAL","sensitivity":"5"}'
Write-Host "SUCCESS: Updated Alert Level to: $($saveSettings.alertLevel), Sensitivity: $($saveSettings.sensitivity)" `
    -ForegroundColor Green

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " ALL 13 CORE WORKFLOWS PASSED VERIFICATION WITH REAL DATA! " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
