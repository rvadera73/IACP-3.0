import React from 'react';

interface PipelineStep {
  phase: string;
  label: string;
  count: number;
  status: 'done' | 'active' | 'pending';
  onClick?: () => void;
}

interface PipelineProps {
  steps: PipelineStep[];
}

const Pipeline: React.FC<PipelineProps> = ({ steps }) => {
  return (
    <div className="pipeline">
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`pipe-step ${step.status}`}
          onClick={step.onClick}
        >
          <span className="pipe-num">{step.phase}</span>
          {step.label}
          <span className="pipe-count">{step.count}</span>
        </div>
      ))}
    </div>
  );
};

export default Pipeline;
