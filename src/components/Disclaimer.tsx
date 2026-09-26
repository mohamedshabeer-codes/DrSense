import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Translations } from '../localization/translations';

interface DisclaimerProps {
  t: Translations;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ t }) => {
  return (
    <footer
      id="drsense-disclaimer"
      className="bg-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-5 my-8 text-xs text-slate-600 space-y-1.5"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-700">
            {t.disclaimerLine1}
          </p>
          <p className="text-slate-600">
            {t.disclaimerLine2}
          </p>
        </div>
      </div>
    </footer>
  );
};
