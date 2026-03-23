import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FilePlus2 } from 'lucide-react';
import { Button, Card } from './UI';
import NewCaseForm from './oalj/NewCaseForm';
import { useCreateFiling } from '../hooks/useFilings';
import { ErrorToast } from './UI/ErrorToast';
import { ErrorBoundary } from './UI/ErrorBoundary';

export default function PublicFilingWizard() {
  const navigate = useNavigate();
  const createFiling = useCreateFiling();
  const [submittedFilingId, setSubmittedFilingId] = useState<string | null>(null);

  const handleSubmit = async (caseData: any) => {
    const created = await createFiling.mutateAsync({
      intake_id: caseData.intakeId ?? `INT-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      filing_type: `${caseData.category} ${caseData.caseType} Initial Filing`,
      submitted_by: caseData.claimant || 'Public filer',
      description: [
        `Claimant: ${caseData.claimant}`,
        `Employer: ${caseData.employer}`,
        `Title: ${caseData.title}`,
        `Program: ${caseData.caseType}`,
      ].join('. '),
      ai_score: 92,
    });

    setSubmittedFilingId(created.intakeId ?? created.id ?? 'Submitted');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-10">
        <div className="mx-auto mb-8 max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                <FilePlus2 className="h-4 w-4" />
                Public E-Filing Wizard
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Start a new filing</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Complete steps 1-3 to choose your case type, provide core filing information, and send the case into intake.
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>Exit</Button>
          </div>
        </div>

        {createFiling.error && (
          <div className="mx-auto mb-6 max-w-5xl">
            <ErrorToast error={createFiling.error} />
          </div>
        )}

        {submittedFilingId ? (
          <div className="mx-auto max-w-3xl">
            <Card className="p-10 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
              <h2 className="mt-4 text-3xl font-bold text-slate-900">Filing submitted</h2>
              <p className="mt-3 text-slate-600">Your filing was sent to the intake queue successfully.</p>
              <div className="mt-4 font-mono text-lg font-bold text-slate-900">{submittedFilingId}</div>
              <div className="mt-8 flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate('/')}>Back to home</Button>
                <Button onClick={() => navigate('/login', { state: { portal: 'external' } })}>
                  Sign in to track status
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <NewCaseForm onCancel={() => navigate('/')} onSubmit={handleSubmit} />
        )}
      </div>
    </ErrorBoundary>
  );
}
