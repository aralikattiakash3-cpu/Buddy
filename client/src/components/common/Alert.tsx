import React from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

type AlertType = 'info' | 'warning' | 'success' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<AlertType, { wrapper: string; icon: React.FC<{ className?: string }> }> = {
  info: {
    wrapper: 'bg-blue-50 border border-blue-200 text-blue-800',
    icon: ({ className }) => <Info className={className} />,
  },
  warning: {
    wrapper: 'bg-amber-50 border border-amber-200 text-amber-800',
    icon: ({ className }) => <AlertTriangle className={className} />,
  },
  success: {
    wrapper: 'bg-green-50 border border-green-200 text-green-800',
    icon: ({ className }) => <CheckCircle className={className} />,
  },
  error: {
    wrapper: 'bg-red-50 border border-red-200 text-red-800',
    icon: ({ className }) => <XCircle className={className} />,
  },
};

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, children, className }) => {
  const { wrapper, icon: Icon } = styles[type];
  return (
    <div className={clsx('rounded-xl p-4 text-sm', wrapper, className)}>
      <div className="flex gap-3">
        <Icon className="w-4 h-4 mt-0.5 shrink-0" />
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export const DisclaimerBanner: React.FC<{ text?: string }> = ({ text }) => (
  <Alert type="warning" className="mt-6">
    <span className="font-semibold">Agricultural Advisory Notice: </span>
    {text || 'AI recommendations are decision-support tools based on general agricultural principles. They do not replace professional laboratory soil tests or certified agricultural officer diagnostics. Always consult your local Krishi Vigyan Kendra (KVK) for field-specific guidance.'}
  </Alert>
);

export const ServiceUnavailableAlert: React.FC<{ service: string; setupPath?: string }> = ({
  service,
  setupPath = 'docs/SETUP.md',
}) => (
  <Alert type="warning" title={`${service} Not Configured`}>
    <p>
      {service} credentials are not set up. Please configure your environment variables following the{' '}
      <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">{setupPath}</code> instructions.
    </p>
  </Alert>
);
