import React from 'react';

interface Case {
  caseId: string;
  claimant: string;
  subtitle: string;
  program: string;
  programVariant: 'blue' | 'gray' | 'amber' | 'purple';
  phase: string;
  phaseVariant: 'amber' | 'blue' | 'purple' | 'red' | 'green';
  judge: string;
  filed: string;
  slaStatus: 'OK' | 'Warning' | 'Overdue' | 'NEW';
  status: string;
  statusVariant: 'green' | 'blue' | 'red' | 'amber';
  onClick?: () => void;
}

interface CasesTableProps {
  cases: Case[];
}

const CasesTable: React.FC<CasesTableProps> = ({ cases }) => {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Claimant / Respondent</th>
            <th>Program</th>
            <th>Phase</th>
            <th>ALJ Assigned</th>
            <th>Filed</th>
            <th>SLA</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem, idx) => (
            <tr key={idx} onClick={caseItem.onClick}>
              <td>
                <span className="case-id">{caseItem.caseId}</span>
              </td>
              <td>
                <div className="case-name">{caseItem.claimant}</div>
                <div className="case-sub">{caseItem.subtitle}</div>
              </td>
              <td>
                <span className={`badge badge-${caseItem.programVariant}`}>{caseItem.program}</span>
              </td>
              <td>
                <span className={`badge badge-${caseItem.phaseVariant}`}>{caseItem.phase}</span>
              </td>
              <td>{caseItem.judge}</td>
              <td>{caseItem.filed}</td>
              <td>
                <div
                  className={`sla-ring sla-${caseItem.slaStatus.toLowerCase()}`}
                  style={{ width: '36px', height: '36px', fontSize: '9px' }}
                >
                  {caseItem.slaStatus}
                </div>
              </td>
              <td>
                <span className={`badge badge-${caseItem.statusVariant}`}>● {caseItem.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CasesTable;
