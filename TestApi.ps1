# GyanTrack API Testing Script

$baseUrl = "http://localhost:5034"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GyanTrack API Testing Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Login as Admin
Write-Host "Test 1: Login as Admin" -ForegroundColor Yellow
$loginBody = @{
    email = "admin@gyantrack.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $adminToken = $adminResponse.token
    Write-Host "Admin Login: SUCCESS" -ForegroundColor Green
    Write-Host "  Token: $($adminToken.Substring(0, [Math]::Min(50, $adminToken.Length)))..." -ForegroundColor Gray
    Write-Host "  Role: $($adminResponse.role)" -ForegroundColor Gray
    Write-Host "  UserId: $($adminResponse.userId)" -ForegroundColor Gray
} catch {
    Write-Host "Admin Login: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Login as Evaluator
Write-Host "Test 2: Login as Evaluator" -ForegroundColor Yellow
$evaluatorBody = @{
    email = "evaluator@gyantrack.com"
    password = "evaluator123"
} | ConvertTo-Json

try {
    $evaluatorResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $evaluatorBody
    $evaluatorToken = $evaluatorResponse.token
    $evaluatorUserId = $evaluatorResponse.userId
    Write-Host "Evaluator Login: SUCCESS" -ForegroundColor Green
    Write-Host "  Token: $($evaluatorToken.Substring(0, [Math]::Min(50, $evaluatorToken.Length)))..." -ForegroundColor Gray
    Write-Host "  Role: $($evaluatorResponse.role)" -ForegroundColor Gray
    Write-Host "  UserId: $evaluatorUserId" -ForegroundColor Gray
} catch {
    Write-Host "Evaluator Login: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Login as Intern
Write-Host "Test 3: Login as Intern" -ForegroundColor Yellow
$internBody = @{
    email = "intern@gyantrack.com"
    password = "intern123"
} | ConvertTo-Json

try {
    $internResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $internBody
    $internToken = $internResponse.token
    $internUserId = $internResponse.userId
    Write-Host "Intern Login: SUCCESS" -ForegroundColor Green
    Write-Host "  Token: $($internToken.Substring(0, [Math]::Min(50, $internToken.Length)))..." -ForegroundColor Gray
    Write-Host "  Role: $($internResponse.role)" -ForegroundColor Gray
    Write-Host "  UserId: $internUserId" -ForegroundColor Gray
} catch {
    Write-Host "Intern Login: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Login with invalid credentials
Write-Host "Test 4: Login with invalid credentials" -ForegroundColor Yellow
$invalidBody = @{
    email = "wrong@email.com"
    password = "wrongpass"
} | ConvertTo-Json

try {
    $errorResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $invalidBody -ErrorAction Stop
    Write-Host "Invalid Login: UNEXPECTED SUCCESS" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "Invalid Login: SUCCESS (Got 401 as expected)" -ForegroundColor Green
    } else {
        Write-Host "Invalid Login: FAILED - Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 5: Get Admin Profile
Write-Host "Test 5: Get Admin Profile" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        $profile = Invoke-RestMethod -Uri "$baseUrl/api/auth/profile" -Method GET -Headers $headers
        Write-Host "Get Profile: SUCCESS" -ForegroundColor Green
        Write-Host "  Email: $($profile.email)" -ForegroundColor Gray
        Write-Host "  Role: $($profile.role)" -ForegroundColor Gray
        Write-Host "  FullName: $($profile.fullName)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Profile: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Profile: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 6: Get Subjects (Admin)
Write-Host "Test 6: Get Subjects (Admin)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        $subjects = Invoke-RestMethod -Uri "$baseUrl/api/admin/subjects" -Method GET -Headers $headers
        Write-Host "Get Subjects: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($subjects.Count)" -ForegroundColor Gray
        foreach ($subject in $subjects) {
            Write-Host "    - $($subject.subjectName)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Get Subjects: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Subjects: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 7: Create Subject (Admin)
Write-Host "Test 7: Create Subject (Admin)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        $newSubject = @{
            subjectName = "Testing Subject"
        } | ConvertTo-Json
        $created = Invoke-RestMethod -Uri "$baseUrl/api/admin/subjects" -Method POST -ContentType "application/json" -Headers $headers -Body $newSubject
        Write-Host "Create Subject: SUCCESS" -ForegroundColor Green
        Write-Host "  ID: $($created.id)" -ForegroundColor Gray
        Write-Host "  Name: $($created.subjectName)" -ForegroundColor Gray
    } catch {
        Write-Host "Create Subject: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Create Subject: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 8: Get Templates (Admin)
Write-Host "Test 8: Get Templates (Admin)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        $templates = Invoke-RestMethod -Uri "$baseUrl/api/admin/templates" -Method GET -Headers $headers
        Write-Host "Get Templates: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($templates.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Templates: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Templates: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 9: Get Mappings (Admin)
Write-Host "Test 9: Get Evaluator-Intern Mappings (Admin)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        $mappings = Invoke-RestMethod -Uri "$baseUrl/api/admin/mappings" -Method GET -Headers $headers
        Write-Host "Get Mappings: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($mappings.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Mappings: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Mappings: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 10: Get Performance Scores (Admin)
Write-Host "Test 10: Get Performance Scores (Admin)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        $scores = Invoke-RestMethod -Uri "$baseUrl/api/admin/scores" -Method GET -Headers $headers
        Write-Host "Get Scores: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($scores.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Scores: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Scores: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 11: Get Department Performance (Admin)
Write-Host "Test 11: Get Department Performance (Admin)" -ForegroundColor Yellow
if ($adminToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $adminToken" }
        $performance = Invoke-RestMethod -Uri "$baseUrl/api/admin/performance/department" -Method GET -Headers $headers
        Write-Host "Get Department Performance: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($performance.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Department Performance: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Department Performance: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 12: Get Evaluator Templates (Evaluator)
Write-Host "Test 12: Get Evaluator Templates (Evaluator)" -ForegroundColor Yellow
if ($evaluatorToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $evaluatorToken" }
        $evalTemplates = Invoke-RestMethod -Uri "$baseUrl/api/evaluator/templates" -Method GET -Headers $headers
        Write-Host "Get Evaluator Templates: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($evalTemplates.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Evaluator Templates: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Evaluator Templates: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 13: Get Evaluator Tests (Evaluator)
Write-Host "Test 13: Get Evaluator Tests (Evaluator)" -ForegroundColor Yellow
if ($evaluatorToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $evaluatorToken" }
        $tests = Invoke-RestMethod -Uri "$baseUrl/api/evaluator/tests" -Method GET -Headers $headers
        Write-Host "Get Evaluator Tests: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($tests.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Evaluator Tests: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Evaluator Tests: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 14: Get Intern Tests
Write-Host "Test 14: Get Intern Tests" -ForegroundColor Yellow
if ($internToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $internToken" }
        $internTests = Invoke-RestMethod -Uri "$baseUrl/api/intern/tests" -Method GET -Headers $headers
        Write-Host "Get Intern Tests: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($internTests.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Intern Tests: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Intern Tests: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 15: Get Intern Evaluations
Write-Host "Test 15: Get Intern Evaluations" -ForegroundColor Yellow
if ($internToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $internToken" }
        $evaluations = Invoke-RestMethod -Uri "$baseUrl/api/intern/evaluations" -Method GET -Headers $headers
        Write-Host "Get Intern Evaluations: SUCCESS" -ForegroundColor Green
        Write-Host "  Count: $($evaluations.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Intern Evaluations: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Intern Evaluations: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 16: Get Intern Profile
Write-Host "Test 16: Get Intern Profile" -ForegroundColor Yellow
if ($internToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $internToken" }
        $internProfile = Invoke-RestMethod -Uri "$baseUrl/api/intern/profile" -Method GET -Headers $headers
        Write-Host "Get Intern Profile: SUCCESS" -ForegroundColor Green
        Write-Host "  FullName: $($internProfile.fullName)" -ForegroundColor Gray
        Write-Host "  Department: $($internProfile.department)" -ForegroundColor Gray
        Write-Host "  Batch: $($internProfile.batch)" -ForegroundColor Gray
    } catch {
        Write-Host "Get Intern Profile: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Get Intern Profile: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 17: Unauthorized Access (No Token)
Write-Host "Test 17: Unauthorized Access (No Token)" -ForegroundColor Yellow
try {
    $subjects = Invoke-RestMethod -Uri "$baseUrl/api/admin/subjects" -Method GET -ErrorAction Stop
    Write-Host "Unauthorized Access: FAILED (Should have returned 401/403)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 403) {
        Write-Host "Unauthorized Access: SUCCESS (Got $($_.Exception.Response.StatusCode) as expected)" -ForegroundColor Green
    } else {
        Write-Host "Unauthorized Access: FAILED - Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 18: Wrong Role Access (Intern trying Admin endpoint)
Write-Host "Test 18: Wrong Role Access (Intern trying Admin)" -ForegroundColor Yellow
if ($internToken) {
    try {
        $headers = @{ "Authorization" = "Bearer $internToken" }
        $subjects = Invoke-RestMethod -Uri "$baseUrl/api/admin/subjects" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "Wrong Role Access: FAILED (Should have returned 403)" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 403) {
            Write-Host "Wrong Role Access: SUCCESS (Got 403 as expected)" -ForegroundColor Green
        } else {
            Write-Host "Wrong Role Access: FAILED - Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Wrong Role Access: SKIPPED (no token)" -ForegroundColor Gray
}
Write-Host ""

# Test 19: Register New User
Write-Host "Test 19: Register New User" -ForegroundColor Yellow
$registerBody = @{
    email = "testuser$(Get-Random)@test.com"
    password = "Test1234"
    role = "Intern"
    fullName = "Test User"
    department = "Testing"
    batch = "2024"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "Register New User: SUCCESS" -ForegroundColor Green
    Write-Host "  Email: $($registerResponse.email)" -ForegroundColor Gray
    Write-Host "  Role: $($registerResponse.role)" -ForegroundColor Gray
} catch {
    Write-Host "Register New User: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
