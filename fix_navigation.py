import os
import re

# Find all dashboard files
dashboard_files = [
    'src/components/iacp/BoardsAttorneyAdvisorDashboard.tsx',
    'src/components/iacp/BoardsDocketClerkDashboard.tsx',
    'src/components/iacp/BoardsLegalAssistantDashboard.tsx',
    'src/components/iacp/BoardsMemberDashboard.tsx',
    'src/components/iacp/OALJAttorneyAdvisorDashboard.tsx',
    'src/components/iacp/OALJJudgeDashboard.tsx',
    'src/components/iacp/OALJLegalAssistantDashboard.tsx',
]

for filepath in dashboard_files:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Remove conditional wrapper from View Navigation
    # Pattern: {activeView === 'dashboard' && (
    #          <div className="flex items-center gap-2">...navigation...
    #          </div>
    #          )}
    pattern1 = r'/\* View Navigation \*/\s*\{activeView === .dashboard. && \(\s*<div className="flex items-center gap-2">'
    replacement1 = '/* View Navigation - Always Visible */\n      <div className="flex items-center gap-2">'
    content = re.sub(pattern1, replacement1, content)
    
    # Fix 2: Remove closing )} after navigation
    pattern2 = r'</div>\s*\)}\s*\n\s*/\* Dashboard View \*/'
    replacement2 = '</div>\n\n      {/* Dashboard View */}'
    content = re.sub(pattern2, replacement2, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'Fixed: {filepath}')

print('Done!')
