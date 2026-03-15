import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, CheckCircle, AlertCircle, Mail, Video, Users, FileText, Eye, Send, Bell, AlertTriangle } from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import { findOptimalHearingDates, generateNoticeOfHearing, dispatchCourtReporter, validateProSeService, type HearingSchedule } from '../../services/smartScheduler';
import CaseIntelligenceHub from '../oalj/CaseIntelligenceHub';
import AnalyticsDashboard from './AnalyticsDashboard';

interface OALJLegalAssistantDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

export default function OALJLegalAssistantDashboard({ onCaseSelect }: OALJLegalAssistantDashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'schedule' | 'notices' | 'analytics'>('dashboard');
  const [showCaseViewer, setShowCaseViewer] = useState(false);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [suggestedDates, setSuggestedDates] = useState<HearingSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<HearingSchedule | null>(null);
  const [showNoticePreview, setShowNoticePreview] = useState(false);
  const [selectedNoticeCase, setSelectedNoticeCase] = useState<any | null>(null);
  const [selectedCaseForScheduling, setSelectedCaseForScheduling] = useState<any | null>(null);

  const handleViewCase = (caseNumber: string) => {
    setSelectedCaseNumber(caseNumber);
    setShowCaseViewer(true);
  };

  const stats = {
    hearingsThisMonth: 12,
    noticesIssued: 8,
    pendingScheduling: 5,
    transcriptsPending: 3,
  };

  // All OALJ Judges with their availability
  const allJudges = [
    { id: 'J001', name: 'Hon. Sarah Jenkins', office: 'Pittsburgh, PA', availableDates: ['2026-03-20', '2026-03-22', '2026-03-25'] },
    { id: 'J002', name: 'Hon. Michael Ross', office: 'New York, NY', availableDates: ['2026-03-21', '2026-03-22', '2026-03-25', '2026-03-27'] },
    { id: 'J003', name: 'Hon. Patricia Chen', office: 'San Francisco, CA', availableDates: ['2026-03-20', '2026-03-25', '2026-03-28'] },
    { id: 'J004', name: 'Hon. James Wilson', office: 'Washington, DC', availableDates: ['2026-03-20', '2026-03-21', '2026-03-22', '2026-03-27'] },
  ];

  const pendingScheduling = [
    { 
      caseNumber: '2024-BLA-00042', 
      claimant: 'Estate of R. Kowalski', 
      judge: 'Hon. S. Jenkins', 
      type: 'Hearing', 
      proSe: true,
      pendingActions: ['Motion to Compel - Pending', 'Medical Evidence - Due Mar 15'],
      parties: [
        { name: 'Estate of R. Kowalski', role: 'Claimant', represented: false, servicePreference: 'mail', address: '123 Main St, Pittsburgh, PA 15201' },
        { name: 'Apex Coal Mining', role: 'Employer', represented: true, servicePreference: 'electronic', email: 'legal@apexcoal.com', attorney: 'Hansen & Associates' },
      ]
    },
    { 
      caseNumber: '2025-LHC-00089', 
      claimant: 'J. Peterson v. Acme', 
      judge: 'Hon. M. Ross', 
      type: 'Pre-Hearing Conference', 
      proSe: false,
      pendingActions: [],
      parties: [
        { name: 'J. Peterson', role: 'Claimant', represented: true, servicePreference: 'electronic', email: 'jpeterson@email.com', attorney: 'Legal Aid Society' },
        { name: 'Acme Corporation', role: 'Employer', represented: true, servicePreference: 'electronic', email: 'legal@acme.com', attorney: 'Acme Legal Dept' },
      ]
    },
    { 
      caseNumber: '2025-PER-00015', 
      claimant: 'TechCorp v. BALCA', 
      judge: 'Hon. P. Chen', 
      type: 'Hearing', 
      proSe: false,
      pendingActions: ['Brief Submission - Overdue'],
      parties: [
        { name: 'TechCorp Industries', role: 'Petitioner', represented: true, servicePreference: 'electronic', email: 'legal@techcorp.com', attorney: 'TechCorp Legal' },
        { name: 'BALCA', role: 'Respondent', represented: true, servicePreference: 'electronic', email: 'balca@dol.gov', attorney: 'DOL Counsel' },
      ]
    },
  ];

  const upcomingHearings = [
    { caseNumber: '2024-BLA-00038', date: 'Mar 15, 2026', time: '10:00 AM', location: 'Room 402', judge: 'Hon. S. Jenkins', reporter: 'J. Smith' },
    { caseNumber: '2025-LHC-00012', date: 'Mar 18, 2026', time: '2:00 PM', location: 'Room 301', judge: 'Hon. M. Ross', reporter: 'A. Brown' },
    { caseNumber: '2025-PER-00008', date: 'Mar 22, 2026', time: '11:00 AM', location: 'Video Conference', judge: 'Hon. P. Chen', reporter: 'TBD' },
  ];

  const handleScheduleHearing = (caseData: any) => {
    setSelectedCaseForScheduling(caseData);
    
    // Find optimal dates across ALL judges
    const schedules = findOptimalHearingDates({
      caseType: caseData.caseType,
      judgeId: 'J001', // Primary judge
      office: 'Pittsburgh, PA',
      hasProSeParty: caseData.proSe,
      hearingType: caseData.type as any,
      duration: 2,
    });
    
    setSuggestedDates(schedules);
    setShowScheduler(true);
  };

  const handleViewNotice = (caseData: any) => {
    setSelectedNoticeCase(caseData);
    setShowNoticePreview(true);
  };

  const handleConfirmScheduling = () => {
    if (!selectedDate || !selectedCaseForScheduling) return;
    
    // Validate Pro Se service requirements
    const serviceValidation = validateProSeService(
      selectedCaseForScheduling.parties,
      'electronic'
    );
    
    if (!serviceValidation.valid) {
      alert('⚠️ Service Validation Error:\n\n' + serviceValidation.errors.join('\n') + '\n\nPro Se parties must be served via certified mail.');
      return;
    }
    
    const notice = generateNoticeOfHearing(
      selectedCaseForScheduling.caseNumber,
      selectedCaseForScheduling.claimant,
      selectedCaseForScheduling.employer,
      selectedDate,
      selectedCaseForScheduling.parties
    );
    
    const reporterDispatch = dispatchCourtReporter('Pittsburgh, PA', selectedDate.date, selectedCaseForScheduling.caseNumber);
    
    // Check for pending actions
    if (selectedCaseForScheduling.pendingActions && selectedCaseForScheduling.pendingActions.length > 0) {
      const confirmProceed = window.confirm(
        `⚠️ Pending Actions Detected:\n\n${selectedCaseForScheduling.pendingActions.join('\n')}\n\nProceed with scheduling? This will notify all parties and chambers.`
      );
      if (!confirmProceed) return;
    }
    
    alert(`Hearing Scheduled Successfully!
    
Date: ${selectedDate.date}
Time: ${selectedDate.time}
Location: ${selectedDate.location}
Judge: ${selectedDate.judge}
Court Reporter: ${reporterDispatch.reporter || 'TBD'}

Notices will be sent to:
${selectedCaseForScheduling.parties.map((p: any) => `- ${p.name} (${p.servicePreference === 'electronic' ? 'Email' : 'Certified Mail'})`).join('\n')}

${selectedCaseForScheduling.proSe ? '⚠️ Pro Se party - Certified Mail required' : '✓ All parties authorized for electronic service'}`);
    
    setShowScheduler(false);
    setSelectedCaseForScheduling(null);
    setSelectedDate(null);
  };

  const handleSendInternalNotification = (caseData: any) => {
    alert(`Internal Notification Sent:\n\nTo: Chambers (${caseData.judge})\nCC: Court Reporting Unit\nRE: Hearing Scheduled - ${caseData.caseNumber}\n\n✓ Chambers notified\n✓ Court reporter requested\n✓ Interpreter services (if needed)`);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Bar - Always on Top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Hearings This Month</div>
          <div className="text-2xl font-bold text-slate-900">{stats.hearingsThisMonth}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Notices Issued</div>
          <div className="text-2xl font-bold text-slate-900">{stats.noticesIssued}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Scheduling</div>
          <div className="text-2xl font-bold text-slate-900">{stats.pendingScheduling}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Transcripts Pending</div>
          <div className="text-2xl font-bold text-slate-900">{stats.transcriptsPending}</div>
        </Card>
      </div>

      {/* View Navigation */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'dashboard' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('schedule')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'schedule' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Schedule Hearing
        </button>
        <button
          onClick={() => setActiveView('notices')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'notices' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          Notices
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'analytics' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Analytics
        </button>
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Pending Scheduling */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Hearings Pending Scheduling</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingScheduling.map((item, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${item.proSe ? 'bg-amber-50' : 'bg-blue-50'}`}>
                        <Calendar className={`w-5 h-5 ${item.proSe ? 'text-amber-600' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold font-mono">{item.caseNumber}</div>
                        <div className="text-xs text-slate-500">{item.claimant}</div>
                        <div className="text-xs text-slate-500">Judge: {item.judge} • {item.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.proSe && (
                        <Badge variant="warning" size="sm" title="Pro Se - 14 days notice required">⚠️ Pro Se</Badge>
                      )}
                      {item.pendingActions && item.pendingActions.length > 0 && (
                        <Badge variant="error" size="sm" title={`${item.pendingActions.length} pending action(s)`}>
                          <AlertTriangle className="w-3 h-3" />
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewCase(item.caseNumber)}
                        leftIcon={<Eye className="w-3 h-3" />}
                      >
                        View Case
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleScheduleHearing(item)}
                        leftIcon={<Calendar className="w-3 h-3" />}
                      >
                        Schedule
                      </Button>
                    </div>
                  </div>
                  
                  {/* Pending Actions */}
                  {item.pendingActions && item.pendingActions.length > 0 && (
                    <div className="ml-14 mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-amber-900">Pending Actions Before Scheduling:</div>
                          <ul className="text-xs text-amber-700 mt-1 list-disc list-inside">
                            {item.pendingActions.map((action: string, i: number) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleSendInternalNotification(item)}
                            leftIcon={<Bell className="w-3 h-3" />}
                          >
                            Notify Internally
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Parties & Service Preferences */}
                  <div className="ml-14 mt-3 p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs font-bold text-slate-700 mb-2">Parties & Service Preferences:</div>
                    <div className="space-y-2">
                      {item.parties.map((party: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-slate-900">{party.name}</span>
                            <span className="text-slate-500 ml-2">({party.role})</span>
                            {party.represented && <span className="text-slate-500 ml-2">• {party.attorney}</span>}
                          </div>
                          <Badge variant={party.servicePreference === 'electronic' ? 'success' : 'neutral'} size="sm">
                            {party.servicePreference === 'electronic' ? (
                              <>
                                <Mail className="w-3 h-3 mr-1" />
                                Electronic
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3 mr-1" />
                                Certified Mail
                              </>
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Hearings */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Upcoming Hearings</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingHearings.map((hearing, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-mono">{hearing.caseNumber}</div>
                    <div className="text-xs text-slate-500">{hearing.date}, {hearing.time}</div>
                    <div className="text-xs text-slate-500">{hearing.location} • {hearing.judge} • Reporter: {hearing.reporter}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewNotice(hearing)}
                      leftIcon={<Mail className="w-3 h-3" />}
                    >
                      Notice
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCaseSelect(hearing.caseNumber)}
                      leftIcon={<Eye className="w-3 h-3" />}
                    >
                      View Case
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Schedule View */}
      {activeView === 'schedule' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Schedule Hearing</h3>
          </div>
          <Card>
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-900 mb-2">Select a Case to Schedule</h4>
              <p className="text-slate-600 mb-6">Choose from pending scheduling queue</p>
              <Button onClick={() => setActiveView('dashboard')} leftIcon={<Calendar className="w-4 h-4" />}>
                Go to Pending Scheduling
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Notices View */}
      {activeView === 'notices' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Notices of Hearing</h3>
          </div>
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Recent Notices</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingHearings.map((hearing, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold font-mono">{hearing.caseNumber}</div>
                    <div className="text-xs text-slate-500">Issued: Mar 1, 2026</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Mail className="w-3 h-3" />}>
                      Resend
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3 h-3" />}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole="OALJ Legal Assistant" />
        </motion.div>
      )}

      {/* Case Intelligence Hub */}
      {showCaseViewer && selectedCaseNumber && (
        <CaseIntelligenceHub
          caseNumber={selectedCaseNumber}
          onClose={() => setShowCaseViewer(false)}
          userRole="OALJ Legal Assistant"
        />
      )}

      {/* Scheduling Modal */}
      {showScheduler && selectedCaseForScheduling && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Schedule Hearing</h3>
                  <p className="text-sm text-slate-600">{selectedCaseForScheduling.caseNumber} • {selectedCaseForScheduling.claimant}</p>
                </div>
                <button onClick={() => setShowScheduler(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Pro Se Warning */}
              {selectedCaseForScheduling.proSe && (
                <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-amber-900">Pro Se Party Detected</div>
                      <div className="text-sm text-amber-700 mt-1">
                        Minimum 14 days notice required. Notice must be sent via Certified Mail to Pro Se parties.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Actions Alert */}
              {selectedCaseForScheduling.pendingActions && selectedCaseForScheduling.pendingActions.length > 0 && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-red-900">Pending Actions Detected</div>
                      <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                        {selectedCaseForScheduling.pendingActions.map((action: string, i: number) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                      <div className="text-xs text-red-600 mt-2">Consider resolving these actions before scheduling.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Dates */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3">Available Hearing Dates (All Judges)</h4>
                <div className="space-y-3">
                  {suggestedDates.map((schedule, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedDate === schedule
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedDate(schedule)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedDate === schedule ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{schedule.date}</div>
                            <div className="text-xs text-slate-500">{schedule.time} • {schedule.location}</div>
                            <div className="text-xs text-slate-500">Judge: {schedule.judge}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Court Reporter</div>
                          <div className="text-sm font-bold text-slate-900">{schedule.courtReporter || 'TBD'}</div>
                          {idx === 0 && <Badge variant="success" size="sm" className="mt-1">Recommended</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Party Service Preferences */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-bold text-slate-900 mb-3">Notice Service by Party</h4>
                <div className="space-y-3">
                  {selectedCaseForScheduling.parties.map((party: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{party.name}</div>
                        <div className="text-xs text-slate-500">{party.role} • {party.represented ? party.attorney : 'Pro Se'}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={party.servicePreference === 'electronic' ? 'success' : 'neutral'} size="sm">
                          {party.servicePreference === 'electronic' ? (
                            <>
                              <Mail className="w-3 h-3 mr-1" />
                              Email to {party.email}
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3 mr-1" />
                              Certified Mail
                            </>
                          )}
                        </Badge>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Notices will be generated for all parties</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowScheduler(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmScheduling}
                  disabled={!selectedDate}
                  leftIcon={<Calendar className="w-4 h-4" />}
                >
                  Confirm & Issue Notices
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notice Preview Modal */}
      {showNoticePreview && selectedNoticeCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Notice of Hearing</h3>
                <p className="text-sm text-slate-600">{selectedNoticeCase.caseNumber}</p>
              </div>
              <button onClick={() => setShowNoticePreview(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <h4 className="text-center font-bold">NOTICE OF HEARING</h4>
                <p className="text-center text-sm">United States Department of Labor<br/>Office of Administrative Law Judges</p>
                <div className="mt-6 space-y-2 text-sm">
                  <p><strong>Case Number:</strong> {selectedNoticeCase.caseNumber}</p>
                  <p><strong>Date:</strong> {selectedNoticeCase.date}</p>
                  <p><strong>Time:</strong> {selectedNoticeCase.time}</p>
                  <p><strong>Location:</strong> {selectedNoticeCase.location}</p>
                  <p><strong>Judge:</strong> {selectedNoticeCase.judge}</p>
                  <p><strong>Court Reporter:</strong> {selectedNoticeCase.reporter}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="outline" leftIcon={<Mail className="w-4 h-4" />}>
                Resend
              </Button>
              <Button onClick={() => setShowNoticePreview(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
