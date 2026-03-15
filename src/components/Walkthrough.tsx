import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  CheckCircle2, 
  Play, 
  X,
  FilePlus,
  Activity,
  Gavel,
  FileText,
  ArrowUpRight,
  Shield,
  Inbox,
  Lock,
  LayoutDashboard,
  Search,
  Bell,
  User,
  LogOut,
  Scale,
  Briefcase,
  Building2,
  History,
  ShieldCheck,
  ChevronDown,
  MoreVertical,
  Filter,
  MessageSquare,
  BookOpen,
  Tag,
  PenTool,
  CheckCircle,
  FileSearch,
  FileSignature,
  FileCheck,
  ArrowLeft,
  Users
} from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { useNavigate } from 'react-router-dom';

type WalkthroughType = 'oalj-lifecycle' | 'oalj-new-case' | 'brb-appeal' | 'oalj-docketing' | 'chambers-collaboration';

interface Step {
  id: string;
  title: string;
  role: string;
  portal: string;
  description: string;
  action: string;
  icon: any;
  color: string;
  highlight: string;
}

const WALKTHROUGHS: Record<WalkthroughType, { title: string; description: string; steps: Step[] }> = {
  'oalj-lifecycle': {
    title: 'OALJ Case Lifecycle',
    description: 'A complete end-to-end journey from initial filing to post-decision tracking.',
    steps: [
      {
        id: 'intake-docketing',
        title: 'Step 1: Intake & Docketing',
        role: 'Docket Clerk',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Automated findings and verification queue. AI scans incoming filings for SSNs, signatures, and mandatory evidence, flagging deficiencies instantly.',
        action: 'Verifying automated findings for Case 2024-BLA-00042...',
        icon: Inbox,
        color: 'bg-blue-500',
        highlight: 'The Priority Intake Queue uses AI to pre-sort filings based on urgency and completeness, reducing manual review time by 80%.'
      },
      {
        id: 'assignment',
        title: 'Step 2: Assignment',
        role: 'Chief Judge / Legal Assistant',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Judicial workload management and case routing. The system analyzes judge availability and expertise to suggest optimal case assignments.',
        action: 'Routing case to Judge Sarah Jenkins based on workload...',
        icon: Users,
        color: 'bg-indigo-500',
        highlight: 'Smart routing ensures equitable workload distribution across the national pool of Administrative Law Judges.'
      },
      {
        id: 'pre-hearing',
        title: 'Step 3: Pre-Hearing',
        role: 'Judge / Law Clerk',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Management of motions, discovery, and conferences. Track deadlines and automate scheduling orders with intelligent templates.',
        action: 'Issuing Scheduling Order and tracking motion deadlines...',
        icon: Activity,
        color: 'bg-slate-700',
        highlight: 'Automated scheduling orders and motion tracking keep cases moving through the pre-hearing phase without manual intervention.'
      },
      {
        id: 'hearings',
        title: 'Step 4: Hearings',
        role: 'Judge / Court Reporter',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Integrated calendar with session join capabilities. Launch secure virtual hearing rooms directly from the case dashboard.',
        action: 'Joining secure virtual hearing session...',
        icon: Gavel,
        color: 'bg-indigo-600',
        highlight: 'One-click hearing access integrates video conferencing directly with the digital case record for seamless evidence review during testimony.'
      },
      {
        id: 'decisions',
        title: 'Step 5: Decisions',
        role: 'Judge / Law Clerk',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Drafting workspace for judges and clerks. Secure collaboration with AI-assisted evidence summaries and citation libraries.',
        action: 'Collaborating on Decision Draft in Chambers Workspace...',
        icon: FileText,
        color: 'bg-emerald-500',
        highlight: 'The Chambers Workspace provides a secure "Chinese Wall" for internal research, drafting, and redlining between the Judge and their staff.'
      },
      {
        id: 'post-decision',
        title: 'Step 6: Post-Decision',
        role: 'Docket Clerk / Board Member',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Tracking for appeals, remands, and fee petitions. Automated monitoring of appeal deadlines and seamless transfer to appellate boards.',
        action: 'Monitoring appeal deadline and fee petition status...',
        icon: ArrowUpRight,
        color: 'bg-amber-500',
        highlight: 'Automated post-decision tracking ensures that remands and fee petitions are never lost in the shuffle after the initial order is issued.'
      }
    ]
  },
  'chambers-collaboration': {
    title: 'Judge & Clerk Collaboration',
    description: 'Explore the secure "Chambers" workflow for internal research and decision drafting.',
    steps: [
      {
        id: 'chambers-assign',
        title: 'Step 1: Draft Assignment',
        role: 'Administrative Law Judge (ALJ)',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The Judge "pushes" a case to a Clerk\'s queue with specific disposition instructions and a preliminary bench memo.',
        action: 'Assigning Case to Clerk with Instructions...',
        icon: Play,
        color: 'bg-indigo-600',
        highlight: 'Direct assignment from the Judge ensures the Clerk has clear direction from the start of the drafting process.'
      },
      {
        id: 'chambers-summary',
        title: 'Step 2: AI Case Summary',
        role: 'Law Clerk (Attorney-Advisor)',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The AI generates a comprehensive summary of the case, including key medical evidence, procedural history, and contested issues.',
        action: 'Generating AI Case Summary...',
        icon: Activity,
        color: 'bg-indigo-400',
        highlight: 'AI-generated summaries save legal staff hours of manual review by instantly identifying the most relevant parts of the record.'
      },
      {
        id: 'chambers-findings',
        title: 'Step 3: Research & Findings',
        role: 'Law Clerk (Attorney-Advisor)',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The Clerk researches case law, flags key exhibits, and completes preliminary findings in the private workspace.',
        action: 'Flagging Exhibits & Adding Citations...',
        icon: Search,
        color: 'bg-blue-500',
        highlight: 'The Citation Library and Exhibit Flags keep all internal research organized and linked directly to the record.'
      },
      {
        id: 'chambers-drafting',
        title: 'Step 4: Collaborative Drafting',
        role: 'Law Clerk (Attorney-Advisor)',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The Clerk prepares the first draft of the decision. The system tracks versions and allows for internal comments.',
        action: 'Preparing Draft v1 and adding comments...',
        icon: FileText,
        color: 'bg-indigo-500',
        highlight: 'Version control prevents data loss and allows the Judge to see the evolution of the legal analysis.'
      },
      {
        id: 'chambers-redline',
        title: 'Step 5: Redline & Review',
        role: 'Administrative Law Judge (ALJ)',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The Judge reviews the draft using "Redline Mode" to make direct edits and provide feedback via the comments sidebar.',
        action: 'Applying Redlines and returning to Clerk...',
        icon: Gavel,
        color: 'bg-amber-500',
        highlight: 'Redline Mode provides a familiar, Word-like experience directly within the secure portal.'
      },
      {
        id: 'chambers-sign',
        title: 'Step 6: Final Approval',
        role: 'Administrative Law Judge (ALJ)',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Once satisfied, the Judge approves and electronically signs the decision, releasing it to the official docket.',
        action: 'Electronically Signing & Releasing Decision...',
        icon: CheckCircle2,
        color: 'bg-emerald-600',
        highlight: 'One-click signing and release automates the transition from internal draft to official agency record.'
      }
    ]
  },
  'oalj-new-case': {
    title: 'OALJ New Case Filing',
    description: 'Focused walkthrough of the Unified Filing Service and AI validation process.',
    steps: [
      {
        id: 'portal-select',
        title: 'Step 1: Portal Selection',
        role: 'Attorney',
        portal: 'Unified Filing Service (UFS)',
        description: 'Attorneys access the UFS portal via Login.gov to initiate a new filing for their clients.',
        action: 'Selecting "New Case Filing" from the UFS dashboard...',
        icon: Shield,
        color: 'bg-blue-600',
        highlight: 'Unified login via Login.gov ensures secure, single-sign-on access for all legal representatives.'
      },
      {
        id: 'form-upload',
        title: 'Step 2: Document Upload',
        role: 'Attorney',
        portal: 'Unified Filing Service (UFS)',
        description: 'The user uploads required DOL forms and supporting evidence directly to the case file.',
        action: 'Uploading Claim Form and Medical Evidence...',
        icon: FilePlus,
        color: 'bg-blue-500',
        highlight: 'Drag-and-drop functionality and bulk uploads streamline the submission of voluminous medical records.'
      },
      {
        id: 'ai-check',
        title: 'Step 3: AI Completeness',
        role: 'System (AI)',
        portal: 'Unified Filing Service (UFS)',
        description: 'AI scans the documents to ensure all mandatory fields are completed and the signature is valid.',
        action: 'AI verifying SSN, Date of Injury, and Signature...',
        icon: Activity,
        color: 'bg-indigo-500',
        highlight: 'Automated completeness checks prevent "incomplete filing" delays by catching errors before submission.'
      },
      {
        id: 'efs-submit',
        title: 'Step 4: Submission',
        role: 'Attorney',
        portal: 'Unified Filing Service (UFS)',
        description: 'Once validated, the attorney submits the filing, receiving an immediate confirmation and tracking ID.',
        action: 'Finalizing submission and receiving Intake ID...',
        icon: CheckCircle2,
        color: 'bg-emerald-500',
        highlight: 'Instant confirmation provides peace of mind and a verifiable audit trail for legal deadlines.'
      }
    ]
  },
  'oalj-docketing': {
    title: 'OALJ Internal Docketing',
    description: 'Explore automated docketing and the "Return to Filer" workflow for deficient cases.',
    steps: [
      {
        id: 'intake-queue',
        title: 'Step 1: Intake Queue',
        role: 'Docket Clerk / Legal Assistant',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Incoming filings from UFS appear in the Priority Intake Queue for clerk review.',
        action: 'Reviewing new BLA filing from Attorney John Smith...',
        icon: Inbox,
        color: 'bg-slate-700',
        highlight: 'The Priority Queue uses AI to pre-sort filings based on urgency and completeness.'
      },
      {
        id: 'auto-verify',
        title: 'Step 2: Automated Verification',
        role: 'System (AI)',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The system automatically cross-references UFS data with internal records to flag potential issues.',
        action: 'AI cross-referencing SSN and Employer records...',
        icon: Activity,
        color: 'bg-indigo-500',
        highlight: 'Automated verification reduces manual data entry errors by up to 90%.'
      },
      {
        id: 'parties-record',
        title: 'Step 3: Parties of Record',
        role: 'Docket Clerk / Legal Assistant',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The system automatically populates the Service List (Parties of Record) by extracting contact information from the filing documents.',
        action: 'Verifying Service List and Roles...',
        icon: Users,
        color: 'bg-indigo-400',
        highlight: 'The AI-driven Service List ensures all parties—Claimants, Employers, Carriers, and Counsel—are correctly identified and assigned their respective roles for automated notifications.'
      },
      {
        id: 'auto-docket',
        title: 'Step 4: Automated Docketing',
        role: 'Docket Clerk / Legal Assistant',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'For valid filings, the clerk can trigger automated docketing, which generates the formal case number and notifies parties.',
        action: 'Generating Docket Number: 2024-BLA-00042...',
        icon: CheckCircle2,
        color: 'bg-emerald-600',
        highlight: 'One-click docketing instantly creates the digital case file and triggers automated service to all parties.'
      },
      {
        id: 'deficiency-return',
        title: 'Step 5: Return for Correction',
        role: 'Docket Clerk / Legal Assistant',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'If a filing is deficient (e.g., missing signature), the clerk can "Return to Filer" with a specific deficiency notice.',
        action: 'Returning filing due to missing signature on Page 3...',
        icon: X,
        color: 'bg-dol-red',
        highlight: 'The "Return to Filer" workflow maintains the original priority date while allowing filers to fix errors quickly.'
      }
    ]
  },
  'brb-appeal': {
    title: 'BRB Appeal Filing',
    description: 'Walkthrough of the appellate process from notice of appeal to board decision.',
    steps: [
      {
        id: 'notice-appeal',
        title: 'Step 1: Notice of Appeal',
        role: 'Attorney',
        portal: 'Unified Filing Service (UFS)',
        description: 'A party dissatisfied with an ALJ decision files a Notice of Appeal to the Benefits Review Board.',
        action: 'Submitting Notice of Appeal for Case 2024-BLA-00042...',
        icon: ArrowUpRight,
        color: 'bg-amber-500',
        highlight: 'The UFS portal automatically links the appeal to the existing OALJ record, ensuring continuity.'
      },
      {
        id: 'board-intake',
        title: 'Step 2: Board Intake',
        role: 'Clerk of the Appellate Boards',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The Board Clerk verifies the appeal is timely and meets all jurisdictional requirements.',
        action: 'Verifying timeliness and docketing BRB appeal...',
        icon: Shield,
        color: 'bg-slate-700',
        highlight: 'Automated timeliness checks assist clerks in identifying potential jurisdictional issues early.'
      },
      {
        id: 'parties-record',
        title: 'Step 3: Parties of Record',
        role: 'Clerk of the Appellate Boards',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'The system automatically populates the Service List for the appeal, ensuring all parties from the OALJ record are included.',
        action: 'Verifying Service List and Roles...',
        icon: Users,
        color: 'bg-indigo-400',
        highlight: 'The AI-driven Service List ensures all parties—Claimants, Employers, Carriers, and Counsel—are correctly identified and assigned their respective roles for automated notifications.'
      },
      {
        id: 'record-review',
        title: 'Step 4: Record Review',
        role: 'Attorney-Advisor / Law Clerk',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Legal staff review the entire record from the OALJ hearing to prepare the case for the Board.',
        action: 'Reviewing ALJ transcript and medical evidence...',
        icon: FileText,
        color: 'bg-blue-600',
        highlight: 'Internal staff have instant access to the full digital record, eliminating the need for physical file transfers.'
      },
      {
        id: 'board-decision',
        title: 'Step 5: Board Decision',
        role: 'Board Member / Judge',
        portal: 'Intelligent Case Portal (IACP)',
        description: 'Board members deliberate and issue a final agency decision affirming, reversing, or remanding the ALJ order.',
        action: 'Issuing Final Agency Decision & Order...',
        icon: Gavel,
        color: 'bg-dol-red',
        highlight: 'The system facilitates collaborative review and electronic signing of final board decisions.'
      }
    ]
  }
};

export default function Walkthrough() {
  const [selectedWalkthrough, setSelectedWalkthrough] = useState<WalkthroughType | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const walkthrough = selectedWalkthrough ? WALKTHROUGHS[selectedWalkthrough] : null;
  const steps = walkthrough?.steps || [];
  const step = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startWalkthrough = (type: WalkthroughType) => {
    setSelectedWalkthrough(type);
    setCurrentStep(0);
  };

  // Mock users for different steps
  const getMockUser = () => {
    if (!step) return null;
    
    if (step.portal.includes('External')) {
      return { id: 'w-1', name: 'Walkthrough User', role: 'Attorney' };
    }

    switch (step.id) {
      case 'intake-docketing':
      case 'parties-record':
      case 'board-intake':
      case 'intake-queue':
      case 'auto-docket':
      case 'deficiency-return':
      case 'post-decision':
        return { id: 'w-2', name: 'Walkthrough User', role: 'Docket Clerk', division: 'OALJ' as const };
      case 'assignment':
        return { id: 'w-chief', name: 'Walkthrough User', role: 'Chief Judge', division: 'OALJ' as const };
      case 'pre-hearing':
      case 'hearings':
      case 'decisions':
      case 'chambers-assign':
      case 'chambers-summary':
      case 'chambers-redline':
      case 'chambers-sign':
        return { id: 'w-3', name: 'Walkthrough User', role: 'Administrative Law Judge (ALJ)', division: 'OALJ' as const };
      case 'appeal':
      case 'board-decision':
        return { id: 'w-4', name: 'Walkthrough User', role: 'Board Member / Judge', division: 'BRB' as const };
      case 'record-review':
      case 'chambers-findings':
      case 'chambers-drafting':
        return { id: 'w-5', name: 'Walkthrough User', role: 'Law Clerk (Attorney-Advisor)', division: 'OALJ' as const };
      default:
        return { id: 'w-default', name: 'Walkthrough User', role: step.role, division: 'OALJ' as const };
    }
  };

  if (!selectedWalkthrough) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <div className="inline-block bg-dol-blue p-3 rounded-xl mb-4">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Interactive Feature Demos</h1>
            <p className="text-slate-400 mt-2">Select a walkthrough to explore the system's capabilities.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(WALKTHROUGHS) as WalkthroughType[]).map((wtKey) => (
              <div key={wtKey}>
                <Card 
                  className="p-6 bg-slate-800 border-slate-700 hover:border-blue-500 cursor-pointer transition-all group h-full flex flex-col"
                  onClick={() => startWalkthrough(wtKey)}
                >
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-900/30 group-hover:text-blue-400 transition-colors">
                    {wtKey === 'oalj-lifecycle' ? <Activity size={24} /> : 
                     wtKey === 'oalj-new-case' ? <FilePlus size={24} /> : 
                     wtKey === 'oalj-docketing' ? <Inbox size={24} /> :
                     wtKey === 'chambers-collaboration' ? <Gavel size={24} /> :
                     <ArrowUpRight size={24} />}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{WALKTHROUGHS[wtKey].title}</h3>
                  <p className="text-sm text-slate-400 mb-6 flex-1">{WALKTHROUGHS[wtKey].description}</p>
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                    Start Demo
                  </Button>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="ghost" className="text-slate-500 hover:text-white" onClick={() => navigate('/')}>
              <X size={20} className="mr-2" /> Cancel and Exit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-dol-blue p-1.5 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-tight text-sm leading-none">{walkthrough.title}</span>
            <span className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Interactive Guide</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setSelectedWalkthrough(null)} aria-label="Change Demo">
            Change Demo
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => navigate('/')} aria-label="Exit Walkthrough">
            <X size={18} className="mr-2" /> Exit
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Guide */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-6 flex flex-col shrink-0">
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 ${step.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                  <step.icon size={18} />
                </div>
                <h2 className="text-lg font-bold text-white leading-tight">{step.title}</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Context</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="neutral" className="bg-slate-700 text-slate-300 border-none">{step.portal}</Badge>
                    <Badge variant="info" className="bg-blue-900/30 text-blue-400 border-none">{step.role}</Badge>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-800/50">
                  <div className="flex items-start gap-3">
                    <Play size={16} className="text-blue-400 mt-1 shrink-0" />
                    <div className="text-xs text-blue-300 font-medium italic">
                      {step.action}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-4">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progress</div>
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full transition-all ${i <= currentStep ? step.color : 'bg-slate-700'}`} 
                  />
                ))}
              </div>
              <div className="text-xs text-slate-500 text-center">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-6 border-t border-slate-700 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={prevStep}
              disabled={currentStep === 0}
              aria-label="Previous Step"
            >
              <ChevronLeft size={18} className="mr-1" /> Back
            </Button>
            <Button 
              className={`flex-1 ${currentStep === steps.length - 1 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-dol-blue hover:bg-blue-700'}`}
              onClick={currentStep === steps.length - 1 ? () => setSelectedWalkthrough(null) : nextStep}
              aria-label={currentStep === steps.length - 1 ? 'Finish Walkthrough' : 'Next Step'}
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={18} className="ml-1" />
            </Button>
          </div>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 overflow-auto p-8">
            <div className="max-w-6xl mx-auto pointer-events-none opacity-90 scale-[0.98] origin-top transition-all duration-500">
              <SimulatedScreen stepId={step.id} mockUser={getMockUser()} />
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none border-[16px] border-slate-900/10 rounded-3xl m-4"></div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedWalkthrough}-${currentStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-12 right-12 max-w-sm bg-white p-6 rounded-2xl shadow-2xl border border-slate-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-amber-100 p-1.5 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600" />
                </div>
                <span className="font-bold text-slate-900">Key Feature Highlight</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {step.highlight}
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 size={14} /> Automated & Verified
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SimulatedScreen({ stepId, mockUser }: { stepId: string; mockUser: any }) {
  const isInternal = stepId.includes('chambers') || 
    stepId === 'intake-docketing' || 
    stepId === 'assignment' || 
    stepId === 'pre-hearing' || 
    stepId === 'hearings' || 
    stepId === 'decisions' || 
    stepId === 'post-decision' ||
    stepId === 'parties-record' || 
    stepId === 'board-intake' || 
    stepId === 'intake-queue' || 
    stepId === 'auto-verify' || 
    stepId === 'auto-docket' || 
    stepId === 'deficiency-return' || 
    stepId === 'record-review' || 
    stepId === 'appeal' || 
    stepId === 'board-decision';
  
  const isEFS = stepId.includes('portal-select') || 
    stepId.includes('form-upload') || 
    stepId.includes('ai-check') || 
    stepId.includes('efs-submit') || 
    stepId === 'intake' || 
    stepId === 'notice-appeal' || 
    stepId === 'ai-analysis';

  const division = (stepId === 'appeal' || stepId === 'board-decision' || stepId === 'board-intake' || stepId === 'record-review') ? 'BRB' : mockUser?.division || 'OALJ';
  const caseNumber = division === 'BRB' ? '2024-BRB-00123' : '2024-BLA-00042';

  if (isInternal) {
    return (
      <div className="bg-slate-100 rounded-2xl shadow-2xl min-h-[700px] flex overflow-hidden border border-slate-300">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-1.5 rounded-lg ${division === 'BRB' ? 'bg-amber-500' : 'bg-dol-blue'}`}>
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-xs leading-tight">Intelligent Case Portal</div>
                <div className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">Adjudicatory Hub</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-800 rounded-lg">
              <div className={`py-1 text-[8px] font-bold rounded text-center ${division === 'OALJ' ? 'bg-dol-blue text-white' : 'text-slate-500'}`}>OALJ</div>
              <div className={`py-1 text-[8px] font-bold rounded text-center ${division === 'BRB' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>BRB</div>
            </div>
          </div>
          <nav className="flex-grow p-3 space-y-1">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${stepId === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
              <LayoutDashboard size={14} /> <span>Dashboard</span>
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${stepId.includes('intake') || stepId.includes('docketing') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
              <Inbox size={14} /> <span>Intake Queue</span>
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${stepId.includes('case') || stepId.includes('hearing') || stepId.includes('decision') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>
              <Gavel size={14} /> <span>Cases</span>
            </div>
            {stepId.includes('chambers') && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs bg-slate-800 text-white">
                <Lock size={14} /> <span>Chambers Workspace</span>
              </div>
            )}
          </nav>
          <div className="p-3 border-t border-slate-800">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-[8px]">
                {mockUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'WU'}
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-[10px] font-bold text-white truncate">{mockUser?.name || 'Walkthrough User'}</div>
                <div className="text-[8px] text-slate-500 uppercase truncate">{mockUser?.role || 'User'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">
                {stepId.includes('chambers') ? 'Chambers Workspace' : division + ' Portal'}
              </h2>
              <Badge variant="info" className="text-[8px] px-1.5 py-0">{division}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group/search">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <div className="pl-7 pr-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] w-48 text-slate-400 flex items-center justify-between">
                  <span>Search docket...</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover/search:opacity-100 transition-opacity">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[7px] text-emerald-600 font-bold uppercase">Search Grounding Active</span>
                  </div>
                </div>
              </div>
              <Bell size={16} className="text-slate-400" />
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            {stepId === 'intake-docketing' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Inbox size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Priority Intake & Verification Queue</span>
                  </div>
                  <Badge variant="info" className="text-[8px] px-1.5 py-0">6 New Filings</Badge>
                </div>
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest">AI Verification Active</span>
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-relaxed">
                      Scanning Case 2024-BLA-00042. SSN verified. Signature detected. Medical evidence (3 files) attached.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                        <tr>
                          <th className="px-4 py-2">Filer</th>
                          <th className="px-4 py-2">Case Type</th>
                          <th className="px-4 py-2">AI Findings</th>
                          <th className="px-4 py-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-blue-50/30">
                          <td className="px-4 py-3 font-medium">John Smith, Esq.</td>
                          <td className="px-4 py-3">Black Lung (BLA)</td>
                          <td className="px-4 py-3">
                            <Badge variant="success" className="text-[7px] py-0">Complete</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" className="h-6 text-[8px] px-2 bg-blue-600">Docket Case</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Jane Doe, Esq.</td>
                          <td className="px-4 py-3">Longshore (LHWCA)</td>
                          <td className="px-4 py-3">
                            <Badge variant="warning" className="text-[7px] py-0">Missing Signature</Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="outline" className="h-6 text-[8px] px-2">Return to Filer</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : stepId === 'assignment' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">Judicial Workload Management</span>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-4">
                    <div className="p-4 border border-slate-200 rounded-xl">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Case Routing: 2024-BLA-00042</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Judge Sarah Jenkins', workload: 12, match: '98%', status: 'Available' },
                          { name: 'Judge Michael Ross', workload: 18, match: '85%', status: 'Busy' },
                          { name: 'Judge Elena Vance', workload: 14, match: '92%', status: 'Available' }
                        ].map((judge, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[8px] font-bold">SJ</div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-800">{judge.name}</div>
                                <div className="text-[8px] text-slate-500">Workload: {judge.workload} cases</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-[8px] font-bold text-emerald-600">{judge.match} Match</div>
                                <div className="text-[7px] text-slate-400">{judge.status}</div>
                              </div>
                              <Button size="sm" className="h-6 text-[8px] px-2 bg-indigo-600">Assign</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-900 text-white rounded-xl shadow-lg">
                      <h4 className="text-[9px] font-bold uppercase tracking-widest mb-2 opacity-70">Smart Suggestion</h4>
                      <p className="text-[10px] leading-relaxed">
                        Judge Jenkins is recommended based on her expertise in Black Lung litigation and current availability in the Eastern District.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : stepId === 'pre-hearing' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-slate-700" />
                    <span className="text-xs font-bold text-slate-800">Pre-Hearing Management</span>
                  </div>
                  <Badge variant="neutral" className="text-[8px] px-1.5 py-0">Case: 2024-BLA-00042</Badge>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Motions</div>
                    <div className="space-y-2">
                      <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileSearch size={14} className="text-blue-500" />
                          <span className="text-[10px] font-medium">Motion to Compel Discovery</span>
                        </div>
                        <Badge variant="warning" className="text-[7px]">Pending</Badge>
                      </div>
                      <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-medium">Motion for Extension of Time</span>
                        </div>
                        <Badge variant="success" className="text-[7px]">Granted</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upcoming Deadlines</div>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold">Discovery Cut-off</span>
                          <span className="text-[8px] text-dol-red font-bold">In 3 Days</span>
                        </div>
                        <div className="h-1 w-full bg-slate-200 rounded">
                          <div className="h-1 w-4/5 bg-dol-red rounded"></div>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold">Pre-Hearing Statement</span>
                          <span className="text-[8px] text-slate-500">In 14 Days</span>
                        </div>
                        <div className="h-1 w-full bg-slate-200 rounded">
                          <div className="h-1 w-1/4 bg-blue-500 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : stepId === 'hearings' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gavel size={16} className="text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">Integrated Hearing Calendar</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <div className="mb-6">
                      <div className="inline-block p-3 bg-blue-500/20 rounded-full mb-4">
                        <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Hearing Session: 2024-BLA-00042</h3>
                      <p className="text-slate-400 text-sm">Scheduled for Today at 2:00 PM EST</p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button className="bg-blue-600 hover:bg-blue-700 px-8">Join Session</Button>
                      <Button variant="outline" className="border-slate-700 text-slate-300">View Record</Button>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-800 pt-8">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Judge</div>
                        <div className="text-xs">Hon. Sarah Jenkins</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Parties</div>
                        <div className="text-xs">Miller v. Black Rock</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                        <div className="text-xs text-emerald-400">Ready to Start</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : stepId === 'post-decision' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight size={16} className="text-amber-600" />
                    <span className="text-xs font-bold text-slate-800">Post-Decision Tracking</span>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Appeal Status</div>
                      <div className="text-xs font-bold text-amber-600">Notice Filed (BRB)</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Fee Petitions</div>
                      <div className="text-xs font-bold text-blue-600">1 Pending Review</div>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Remand Status</div>
                      <div className="text-xs font-bold text-slate-400">N/A</div>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600">Timeline & Deadlines</div>
                    <div className="p-4 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-px bg-slate-200 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-500"></div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold">Decision Issued</div>
                          <div className="text-[8px] text-slate-500">Feb 15, 2024</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-px bg-slate-200 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500"></div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold">Notice of Appeal Filed</div>
                          <div className="text-[8px] text-slate-500">Mar 01, 2024</div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-px bg-slate-200 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300"></div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400">Record Transfer to BRB</div>
                          <div className="text-[8px] text-slate-500">Pending...</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : stepId === 'record-review' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSearch size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Digital Administrative Record (e-Record)</span>
                  </div>
                  <Badge variant="neutral" className="text-[8px] px-1.5 py-0">Case: 2024-BRB-00123</Badge>
                </div>
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-48 border-r border-slate-200 bg-slate-50 p-3 space-y-2">
                    <div className="text-[9px] font-bold text-slate-400 uppercase mb-2">Record Sections</div>
                    <div className="p-2 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">ALJ Decision & Order</div>
                    <div className="p-2 hover:bg-slate-100 rounded text-[10px]">Hearing Transcript</div>
                    <div className="p-2 hover:bg-slate-100 rounded text-[10px]">Medical Evidence (CX)</div>
                    <div className="p-2 hover:bg-slate-100 rounded text-[10px]">Employer Evidence (EX)</div>
                    <div className="p-2 hover:bg-slate-100 rounded text-[10px]">Procedural Documents</div>
                  </div>
                  <div className="flex-1 p-6 overflow-auto">
                    <div className="max-w-xl mx-auto space-y-4">
                      <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold">ALJ Decision (Feb 15, 2024)</span>
                          <Badge variant="info" className="text-[7px]">Primary Document</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-100 rounded"></div>
                          <div className="h-2 w-full bg-slate-100 rounded"></div>
                          <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                      <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm opacity-60">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold">Hearing Transcript (May 20, 2023)</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-slate-100 rounded"></div>
                          <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : stepId === 'parties-record' ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800">Parties of Record Management</span>
                  </div>
                  <Badge variant="success" className="text-[8px] px-1.5 py-0">AI Populated</Badge>
                </div>
                <div className="p-6 space-y-6">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={14} className="text-indigo-600" />
                      <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Extraction Logic</span>
                    </div>
                    <p className="text-[10px] text-indigo-800 leading-relaxed">
                      AI has successfully extracted 3 parties from the initial filing documents. Please verify roles and contact information.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Robert Miller', role: 'Claimant', address: '123 Mountain Rd, Pikeville, KY' },
                      { name: 'Black Rock Coal Co.', role: 'Employer', address: '456 Industrial Way, Charleston, WV' },
                      { name: 'James Smith, Esq.', role: 'Claimant Counsel', address: '789 Legal Plaza, Lexington, KY' }
                    ].map((party, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{party.name}</div>
                            <div className="text-[9px] text-slate-500">{party.address}</div>
                          </div>
                        </div>
                        <Badge variant="neutral" className="bg-slate-100 text-slate-600 border-none text-[8px]">{party.role}</Badge>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <div className="px-3 py-1 border border-slate-200 text-slate-500 text-[10px] rounded-lg">Add Party</div>
                    <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg">Confirm Service List</div>
                  </div>
                </div>
              </div>
            ) : (stepId.includes('chambers') || stepId === 'hearings' || stepId === 'decisions' || stepId === 'board-decision') ? (
              <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-indigo-950 p-3 border-b border-indigo-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                      <Lock size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs">
                        {division === 'BRB' ? 'Board Chambers: Appellate Review' : 'Judicial Chambers: Private Workspace'}
                      </div>
                      <div className="text-[8px] text-indigo-400 uppercase tracking-widest font-bold">Internal Only • Case No. {caseNumber}</div>
                    </div>
                  </div>
                  <Badge variant="info" className="bg-indigo-800 text-indigo-100 border-none text-[8px]">Secure Session</Badge>
                </div>
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Panel: Research */}
                  <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 space-y-6">
                    <div className="space-y-2">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Bench Memo</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="h-1.5 w-full bg-slate-100 rounded mb-1.5"></div>
                        <div className="h-1.5 w-2/3 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Exhibit Flags</div>
                      <div className="space-y-2">
                        <div className="p-2 bg-indigo-50 rounded border border-indigo-100">
                          <div className="text-[8px] font-bold text-indigo-600">CX-12, Page 45</div>
                          <div className="text-[9px] text-slate-500 mt-1 italic">"Key medical report"</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Citations</div>
                      <div className="space-y-1">
                        <div className="text-[9px] text-slate-500">20 C.F.R. § 725.414</div>
                        <div className="text-[9px] text-slate-500">30 U.S.C. § 901</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Panel: Editor */}
                  <div className="flex-1 bg-white flex flex-col">
                    <div className="h-10 border-b flex items-center justify-between px-4 bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-bold text-slate-800">
                          {stepId === 'chambers-assign' ? 'New Assignment' : 
                           stepId === 'chambers-summary' ? 'AI Case Summary' :
                           stepId === 'chambers-findings' ? 'Research Phase' :
                           stepId === 'chambers-drafting' || stepId === 'decisions' || stepId === 'board-decision' ? 'Draft Decision v1.0' :
                           stepId === 'chambers-sign' ? 'Final Decision for Signature' :
                           'Draft Decision v1.2'}
                        </div>
                        <Badge 
                          variant={stepId === 'chambers-sign' ? 'success' : stepId === 'chambers-assign' ? 'info' : 'warning'} 
                          className="text-[8px] px-1"
                        >
                          {stepId === 'chambers-assign' ? 'Pending' :
                           stepId === 'chambers-summary' ? 'AI Generated' :
                           stepId === 'chambers-findings' ? 'Researching' :
                           stepId === 'chambers-sign' ? 'Final' :
                           'Drafting'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-16 h-5 bg-slate-200 rounded"></div>
                        {stepId === 'chambers-sign' ? (
                          <div className="px-2 py-0.5 bg-emerald-600 text-white text-[8px] font-bold rounded">Sign & Release</div>
                        ) : (
                          <div className="w-16 h-5 bg-indigo-600 rounded"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto font-serif text-slate-800">
                      {stepId === 'chambers-summary' ? (
                        <div className="max-w-2xl mx-auto space-y-6 font-sans">
                          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <h3 className="text-xs font-bold text-indigo-900 mb-2">AI-Generated Case Executive Summary</h3>
                            <p className="text-[10px] text-indigo-800 leading-relaxed">
                              This summary was generated by analyzing the 452-page administrative record.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="text-[9px] font-bold text-slate-400 uppercase">Procedural History</div>
                              <p className="text-[10px] leading-relaxed">Claim filed 01/15/2024. Employer contested 02/10/2024. Hearing held 05/20/2024.</p>
                            </div>
                            <div className="space-y-3">
                              <div className="text-[9px] font-bold text-slate-400 uppercase">Contested Issues</div>
                              <ul className="text-[10px] list-disc pl-4 space-y-1">
                                <li>Existence of pneumoconiosis</li>
                                <li>Total disability causation</li>
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-[9px] font-bold text-slate-400 uppercase">Key Medical Evidence</div>
                            <div className="space-y-2">
                              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="font-bold text-[9px]">Dr. Miller (CX-12)</span>
                                  <Badge variant="success" className="text-[7px] px-1 py-0">Supportive</Badge>
                                </div>
                                <p className="text-[9px] text-slate-600 italic">"Patient exhibits severe restrictive lung impairment consistent with BLA..."</p>
                              </div>
                              <div className="p-2 bg-white border border-slate-200 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="font-bold text-[9px]">Dr. Smith (EX-4)</span>
                                  <Badge variant="error" className="text-[7px] px-1 py-0">Contradictory</Badge>
                                </div>
                                <p className="text-[9px] text-slate-600 italic">"Impairment likely due to secondary factors, not coal dust exposure..."</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : stepId === 'hearings' ? (
                        <div className="max-w-2xl mx-auto space-y-6 font-sans">
                           <div className="bg-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                            <div className="mb-6">
                              <div className="inline-block p-3 bg-blue-500/20 rounded-full mb-4">
                                <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
                              </div>
                              <h3 className="text-xl font-bold mb-2">Hearing Session: 2024-BLA-00042</h3>
                              <p className="text-slate-400 text-sm">Scheduled for Today at 2:00 PM EST</p>
                            </div>
                            <div className="flex justify-center gap-4">
                              <Button className="bg-blue-600 hover:bg-blue-700 px-8">Join Session</Button>
                              <Button variant="outline" className="border-slate-700 text-slate-300">View Record</Button>
                            </div>
                            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-800 pt-8">
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Judge</div>
                                <div className="text-xs">Hon. Sarah Jenkins</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Parties</div>
                                <div className="text-xs">Miller v. Black Rock</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                                <div className="text-xs text-emerald-400">Ready to Start</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-md mx-auto space-y-4">
                          <div className="text-center font-bold text-[10px] uppercase mb-6">U.S. DEPARTMENT OF LABOR</div>
                          <p className="text-[11px] leading-relaxed">
                            This matter arises under the Black Lung Benefits Act...
                          </p>
                          <div className="bg-yellow-50 p-2 border-l-2 border-yellow-400 text-[11px]">
                            The Administrative Record contains medical evidence from Dr. Miller...
                            {stepId === 'chambers-redline' && (
                              <span className="text-red-600 line-through ml-1">who performed a study</span>
                            )}
                            {stepId === 'chambers-redline' && (
                              <span className="text-blue-600 font-bold ml-1"> [REVISED: Dr. Miller's 2023 study]</span>
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed">
                            Based on a review of the substantial evidence, I find that...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Panel: Comments */}
                  <div className="w-56 bg-slate-50 border-l border-slate-200 p-4">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Comments</div>
                    <div className="space-y-3">
                      {(stepId === 'chambers-assign' || stepId === 'decisions') && (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-2 bg-blue-50 rounded border border-blue-100 shadow-sm"
                        >
                          <div className="text-[8px] font-bold text-blue-600 uppercase mb-0.5">System</div>
                          <p className="text-[9px] text-blue-800 font-medium">New Case Assigned by Judge Jenkins</p>
                        </motion.div>
                      )}
                      <div className="p-2 bg-white rounded border border-slate-200 shadow-sm">
                        <div className="text-[8px] font-bold text-indigo-600 uppercase mb-0.5">Clerk Wong</div>
                        <p className="text-[9px] text-slate-600">Judge, I've highlighted the key medical report.</p>
                      </div>
                      {(stepId === 'chambers-redline' || stepId === 'chambers-sign') && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-2 bg-indigo-50 rounded border border-indigo-100 shadow-sm"
                        >
                          <div className="text-[8px] font-bold text-indigo-900 uppercase mb-0.5">Judge Jenkins</div>
                          <p className="text-[9px] text-indigo-900 italic">
                            {stepId === 'chambers-sign' ? '"Excellent work. This is ready for signature."' : '"Good catch. Please refine the rebuttal section."'}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="h-2 w-12 bg-slate-100 rounded mb-2"></div>
                      <div className="h-4 w-8 bg-slate-200 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Main Action Area */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="text-xs font-bold text-slate-800">
                      {stepId.includes('intake') || stepId.includes('docketing') ? 'Intake Queue' : 'Case Docket'}
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-6 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="text-amber-600 w-5 h-5" />
                        <div>
                          <div className="text-sm font-bold text-amber-900">
                            {stepId === 'board-intake' ? 'New Appeal Filing' : 
                             stepId === 'deficiency-return' ? 'Deficient Filing' :
                             'New Priority Filing'}
                          </div>
                          <div className="text-xs text-amber-700">Miller, Robert - {division} {stepId === 'board-intake' ? 'Appeal' : 'Claim'}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {stepId === 'deficiency-return' ? (
                          <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">Return to Filer</div>
                        ) : (
                          <div className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded">
                            {stepId === 'board-intake' ? 'Docket Appeal' : 
                             stepId === 'auto-docket' ? 'Auto-Docket' :
                             'Assign Docket #'}
                          </div>
                        )}
                      </div>
                    </div>

                    {(stepId === 'auto-verify' || stepId === 'auto-docket' || stepId === 'deficiency-return') && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-6"
                      >
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <div className="text-[9px] font-bold text-slate-400 uppercase">AI Verification Results</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-600">SSN Match</span>
                              <Badge variant="success" className="text-[8px] px-1 py-0">Verified</Badge>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-600">Employer Record</span>
                              <Badge variant="success" className="text-[8px] px-1 py-0">Match Found</Badge>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-600">Signature Check</span>
                              {stepId === 'deficiency-return' ? (
                                <Badge variant="error" className="text-[8px] px-1 py-0">Missing</Badge>
                              ) : (
                                <Badge variant="success" className="text-[8px] px-1 py-0">Verified</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex flex-col justify-center">
                          <div className="text-[9px] font-bold text-blue-800 uppercase mb-1.5">System Recommendation</div>
                          <p className="text-[10px] text-blue-700 leading-relaxed">
                            {stepId === 'deficiency-return' 
                              ? "Filing is deficient. Signature missing on Page 3 of Claim Form. Recommend returning to filer for correction."
                              : "Filing is 100% complete and verified. Ready for automated docketing."}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-3">
                          <div className="h-1.5 w-12 bg-slate-200 rounded mb-2"></div>
                          <div className="h-1 w-full bg-slate-100 rounded mb-1"></div>
                          <div className="h-1 w-3/4 bg-slate-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEFS) {
    return (
      <div className="bg-slate-50 rounded-2xl shadow-2xl min-h-[700px] flex overflow-hidden border border-slate-300">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-xs leading-tight">Unified Filing Service</div>
                <div className="text-[8px] text-slate-500 uppercase tracking-widest mt-0.5">UFS Portal</div>
              </div>
            </div>
          </div>
          <nav className="flex-grow p-3 space-y-1">
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${stepId === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
              <History size={14} /> <span>My Filings</span>
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${stepId.includes('filing') || stepId.includes('upload') ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
              <FilePlus size={14} /> <span>New Filing</span>
            </div>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${stepId.includes('access') ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
              <ShieldCheck size={14} /> <span>Access Request</span>
            </div>
            <div className="pt-4 pb-1 px-3 text-[8px] font-bold uppercase tracking-widest text-slate-600">Professional</div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400">
              <Briefcase size={14} /> <span>My Cases</span>
            </div>
          </nav>
          <div className="p-3 border-t border-slate-800">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-[8px]">JD</div>
              <div className="flex-grow min-w-0">
                <div className="text-[10px] font-bold text-white truncate">John Doe</div>
                <div className="text-[8px] text-slate-500 uppercase truncate">Attorney</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">
                {stepId === 'efs-submit' ? 'Submission Confirmation' : 'New Case Filing'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100"></div>
              <LogOut size={16} className="text-slate-400" />
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <FilePlus size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">New Case Filing Submission</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Unified Filing Service (UFS)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i === (stepId === 'efs-submit' ? 4 : stepId === 'ai-check' || stepId === 'ai-analysis' ? 3 : 2) ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Claimant Information</label>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium">Robert Miller</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Case Type</label>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium">Black Lung (BLA)</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Evidence & Documentation</label>
                    <div className="p-10 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/30 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <FilePlus className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-sm font-bold text-blue-700">
                        {stepId.includes('appeal') ? 'Notice_of_Appeal.pdf' : 'Claim_Form_Miller.pdf'}
                      </div>
                      <div className="text-[11px] text-blue-400 mt-1">Uploaded & Securely Encrypted (2.4 MB)</div>
                      <div className="mt-4 flex gap-2">
                        <Badge variant="neutral" className="bg-white text-blue-600 border-blue-100">Medical Records</Badge>
                        <Badge variant="neutral" className="bg-white text-blue-600 border-blue-100">Employment History</Badge>
                      </div>
                    </div>
                  </div>

                  {(stepId === 'ai-analysis' || stepId === 'ai-check' || stepId === 'efs-submit') && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-emerald-600" />
                          <span className="font-bold text-emerald-900 text-sm">AI Intake Analysis & Validation</span>
                        </div>
                        <Badge variant="success" className="bg-emerald-600 text-white border-none">Verified</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          'SSN (Last 4) detected',
                          'Signature verified',
                          'Date of Injury matches',
                          'Form version current',
                          'Medical evidence linked',
                          'Attorney bar ID active'
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-emerald-700">
                            <CheckCircle2 size={14} className="text-emerald-500" /> {item}
                          </div>
                        ))}
                      </div>
                      {stepId === 'efs-submit' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-4 bg-emerald-600 text-white rounded-xl text-center shadow-lg"
                        >
                          <div className="font-bold text-sm">Submission Successful</div>
                          <div className="text-[10px] opacity-80 mt-1 uppercase tracking-widest">Intake ID: INT-2024-0042</div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <Button variant="ghost" className="text-slate-400">Save Draft</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                      {stepId === 'efs-submit' ? 'Go to Dashboard' : 'Submit Filing'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg min-h-[600px] flex items-center justify-center text-slate-400 italic">
      Simulated screen for {stepId} coming soon...
    </div>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}
