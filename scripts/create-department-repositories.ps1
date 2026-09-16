$ErrorActionPreference = 'Stop'

# Requires GitHub CLI authenticated with permission to create repositories.
# Run from the ADTrans-RealIndo-IMCS repository:
#   gh auth status
#   .\scripts\create-department-repositories.ps1

$repos = @(
  'ADTrans-RealIndo-Board',
  'ADTrans-RealIndo-Executive',
  'ADTrans-RealIndo-Governance',
  'ADTrans-RealIndo-CorporateSecretary',
  'ADTrans-RealIndo-PMO',
  'ADTrans-RealIndo-Construction',
  'ADTrans-RealIndo-Engineering',
  'ADTrans-RealIndo-QS',
  'ADTrans-RealIndo-HSEQ',
  'ADTrans-RealIndo-Land',
  'ADTrans-RealIndo-Asset',
  'ADTrans-RealIndo-SalesCRM',
  'ADTrans-RealIndo-BusinessDevelopment',
  'ADTrans-RealIndo-Procurement',
  'ADTrans-RealIndo-Finance',
  'ADTrans-RealIndo-Tax',
  'ADTrans-RealIndo-Treasury',
  'ADTrans-RealIndo-Investment',
  'ADTrans-RealIndo-HR',
  'ADTrans-RealIndo-ITSecurity',
  'ADTrans-RealIndo-LegalCompliance',
  'ADTrans-RealIndo-Risk',
  'ADTrans-RealIndo-InternalAudit',
  'ADTrans-RealIndo-DocumentControl',
  'ADTrans-RealIndo-DataAI'
)

foreach ($repo in $repos) {
  $exists = $false
  gh repo view "Yudi8377/$repo" 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { $exists = $true }

  if ($exists) {
    Write-Host "EXISTS  $repo"
    continue
  }

  gh repo create "Yudi8377/$repo" --private --description "ADTrans RealIndo departmental application; shared Supabase backend; governed RLS/RBAC."
  Write-Host "CREATED $repo"
}

Write-Host "Done. Repository creation is complete only when every item reports CREATED or EXISTS."
