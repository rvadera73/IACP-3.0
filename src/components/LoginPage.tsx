import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User as UserIcon, Gavel, Briefcase, Users, Building2, Activity } from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { useAuth } from '../context/AuthContext';
import { ROLES, OFFICES } from '../constants';
import { Division } from '../types';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Portal selection state
  const [portal, setPortal] = useState<'external' | 'internal' | null>(null);

  // Login form state
  const [email, setEmail] = useState('');

  // Role and profile setup state
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDivision, setSelectedDivision] = useState<Division>('OALJ');
  const [selectedOffice, setSelectedOffice] = useState<string>(OFFICES[0]);

  const hasProcessedState = React.useRef(false);

  // Handle auto-login from location state (for walkthroughs)
  React.useEffect(() => {
    if (hasProcessedState.current) return;

    const state = location.state as { portal?: 'external' | 'internal'; autoRole?: string; division?: Division };
    if (state?.autoRole) {
      hasProcessedState.current = true;
      login({
        id: 'demo-user',
        name: `Demo ${state.autoRole}`,
        role: state.autoRole,
        division: state.division || (state.portal === 'internal' ? 'OALJ' : undefined),
        office: state.portal === 'internal' ? OFFICES[0] : undefined,
      });
      navigate(state.portal === 'external' ? '/efs' : '/internal', { replace: true });
    } else if (state?.portal) {
      setPortal(state.portal);
    }
  }, [location.state, login, navigate]);

  const handleLoginSuccess = () => {
    if (!selectedRole || !portal) return;

    login({
      id: Math.random().toString(36).substr(2, 9),
      name: email ? email.split('@')[0] : `Demo ${selectedRole}`,
      role: selectedRole,
      division: selectedDivision || (portal === 'internal' ? 'OALJ' : undefined),
      office: selectedOffice || (portal === 'internal' ? OFFICES[0] : undefined),
    });
    navigate(portal === 'external' ? '/efs' : '/internal');
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setSelectedRole(role);

    // Auto-set division based on role
    if (ROLES.BOARDS.includes(role)) {
      setSelectedDivision('BRB');
    } else if (ROLES.IT_ADMIN.includes(role) || ROLES.OALJ.includes(role)) {
      setSelectedDivision('OALJ');
    }
  };

  const getAllRoles = () => {
    if (portal === 'external') {
      return ROLES.EXTERNAL;
    } else {
      return [...ROLES.OALJ, ...ROLES.BOARDS, ...ROLES.IT_ADMIN];
    }
  };

  const isInternal = portal === 'internal';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-dol-blue p-3 rounded-xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Intelligent Adjudicatory Case Portal</h1>
          <p className="text-slate-500 mt-2">Unified Access for OALJ and Appeals Boards</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {!portal ? (
            // Portal Selection
            <div className="grid md:grid-cols-2 gap-6">
              <Card
                className="p-8 hover:border-blue-500 cursor-pointer transition-all group"
                onClick={() => setPortal('external')}
                aria-label="Select Unified Filing Service portal"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Briefcase className="w-8 h-8 text-dol-blue" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Unified Filing Service (UFS)</h2>
                  <p className="text-sm text-slate-500 mb-6">For Claimants, Attorneys, and Representatives</p>
                  <Button variant="outline" className="w-full" aria-label="Access Unified Filing Service">Access UFS Portal</Button>
                </div>
              </Card>

              <Card
                className="p-8 hover:border-blue-500 cursor-pointer transition-all group"
                onClick={() => setPortal('internal')}
                aria-label="Select Intelligent Adjudicatory Case Portal"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <Gavel className="w-8 h-8 text-dol-blue" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Intelligent Adjudicatory Case Portal (IACP)</h2>
                  <p className="text-sm text-slate-500 mb-6">For OALJ and Appeals Board Staff</p>
                  <Button variant="outline" className="w-full" aria-label="Access Intelligent Adjudicatory Case Portal">Access IACP Hub</Button>
                </div>
              </Card>
            </div>
          ) : (
            // Consolidated Login Screen
            <Card className="p-8 border-t-4 border-t-blue-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {isInternal ? (
                    <>
                      <Shield className="w-6 h-6 text-dol-blue" />
                      <div className="text-dol-blue font-bold text-lg tracking-tight">DOL SSO - Internal Access</div>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-800 text-white font-bold px-2 py-1 rounded text-sm tracking-tighter">LOGIN.GOV</div>
                      <span className="text-slate-600 font-medium">External Access</span>
                    </>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setPortal(null)}>Change Portal</Button>
              </div>

              <div className="space-y-6">
                {/* SSO Login Section */}
                <div className="space-y-4">
                  {isInternal ? (
                    <>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-800 text-center font-medium">
                          Authorized Personnel Only. Access is monitored and logged.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">PIV Card / Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                          placeholder="user@dol.gov"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input type="password" disabled className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50" placeholder="••••••••" />
                      </div>
                    </>
                  )}
                </div>

                {/* Role Selection Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    {isInternal ? 'Select Your Role' : 'Select Your Role'}
                  </label>
                  <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="">-- Select a role --</option>
                    {getAllRoles().map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {selectedRole && (
                    <p className="text-xs text-slate-500 mt-1">{getRoleDescription(selectedRole)}</p>
                  )}
                </div>

                {/* Internal Portal: Division & Office */}
                {isInternal && selectedRole && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-slate-400">Division</label>
                      <select
                        value={selectedDivision}
                        onChange={(e) => setSelectedDivision(e.target.value as Division)}
                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-dol-blue bg-white"
                      >
                        <option value="OALJ">OALJ (Judges)</option>
                        <option value="BRB">BRB (Appeals)</option>
                        <option value="ARB">ARB (Appeals)</option>
                        <option value="ECAB">ECAB (Appeals)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase text-slate-400">Office Location</label>
                      <select
                        value={selectedOffice}
                        onChange={(e) => setSelectedOffice(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-dol-blue bg-white"
                      >
                        {OFFICES.map(office => (
                          <option key={office} value={office}>{office}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 flex gap-4">
                  <Button
                    className="flex-1 bg-dol-blue text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleLoginSuccess}
                    disabled={!selectedRole || !email}
                  >
                    {isInternal ? 'Sign In & Initialize Workstation' : 'Sign In'}
                  </Button>
                </div>

                {/* External: Terms */}
                {!isInternal && (
                  <div className="text-center text-xs text-slate-500">
                    By signing in, you agree to the <span className="underline cursor-pointer">Rules of Behavior</span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function getRoleDescription(role: string): string {
  switch (role) {
    // External Roles
    case 'Attorney': return 'Legal professional representing a party. Mandatory use of UFS for ARB, BRB, and ECAB cases.';
    case 'Lay Representative': return 'Non-attorney individual (union rep, family) authorized to represent a claimant. Mandatory use of UFS is often required.';
    case 'Pro Se / Self-Represented Party': return 'Claimant representing themselves. Encouraged to use UFS for faster service and status tracking.';
    case 'Attorney Staff / Legal Assistant': return 'Assists a lead attorney. Can view servings and submit filings on the attorney\'s behalf.';
    case 'Non-Party Participant': return 'Third parties (advocacy groups) providing amicus curiae briefs. Represented counsel must use UFS.';
    case 'Court Reporter': return 'Specialized user responsible for uploading official hearing transcripts to the case file.';

    // Internal Roles - OALJ
    case 'Administrative Law Judge (ALJ)': return 'Primary users for OALJ. Manage court dockets, review evidence, and issue official orders and final decisions.';
    case 'OALJ Attorney-Advisor': return 'Legal staff assisting ALJs. Draft orders, research case law, and prepare cases for judicial review.';
    case 'OALJ Docket Clerk': return 'Responsible for day-to-day logging in OALJ Tracking Hub (motions, briefs, hearing requests).';
    case 'District Office Staff': return 'Located in OALJ district offices. Manage local case files and coordinate hearing schedules.';
    case 'OALJ Legal Assistant': return 'Assists OALJ staff with administrative tasks and case management.';

    // Internal Roles - BOARDS
    case 'Board Member / Judge': return 'Internal users for ARB, BRB, and ECAB. Review appeals, briefs, and trial records to issue final agency decisions.';
    case 'Board Attorney-Advisor': return 'Legal staff assisting Board Members. Draft appellate orders and research complex legal issues.';
    case 'Clerk of the Appellate Boards': return 'Central administrative role overseeing intake of new appeals for ARB, BRB, and ECAB. Verifies requirements.';
    case 'Board Docket Clerk': return 'Manages the appellate docket, tracking briefing schedules and motions for the Boards.';
    case 'Board Legal Assistant': return 'Assists Board staff with administrative tasks and appellate case management.';

    // Internal Roles - IT_ADMIN
    case 'OCIO Administrator': return 'Technical staff maintaining UFS. Manage user accounts, security, and system integrations.';
    case 'System Moderator': return 'Review external access requests to ensure authorization for non-public case files.';
    case 'IT Support Specialist': return 'Provides technical support for portal users and maintains system uptime.';

    default: return 'Access specific features for your role.';
  }
}

function getRoleIcon(role: string) {
  // Internal Icons
  if (role.includes('ALJ')) return <Gavel size={20}/>;
  if (role.includes('Board Member')) return <Shield size={20}/>;
  if (role.includes('Clerk')) return <Users size={20}/>;
  if (role.includes('OCIO')) return <Activity size={20}/>;
  if (role.includes('Moderator')) return <Shield size={20}/>;

  // External Icons
  if (role.includes('Attorney')) return <Briefcase size={20}/>;
  if (role.includes('Staff')) return <Users size={20}/>;
  if (role.includes('Pro Se')) return <UserIcon size={20}/>;
  if (role.includes('Participant')) return <Building2 size={20}/>;
  return <UserIcon size={20}/>;
}
