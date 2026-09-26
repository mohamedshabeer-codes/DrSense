import React from 'react';
import { Info, Cpu, Wifi, Bell, Shield, HeartPulse } from 'lucide-react';
import { Translations } from '../localization/translations';

interface ProjectInfoProps {
  t: Translations;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ t }) => {
  const points = [
    { text: t.aboutPoint1, icon: <HeartPulse className="w-4 h-4 text-rose-500" /> },
    { text: t.aboutPoint2, icon: <Wifi className="w-4 h-4 text-cyan-600" /> },
    { text: t.aboutPoint3, icon: <Shield className="w-4 h-4 text-emerald-600" /> },
    { text: t.aboutPoint4, icon: <Bell className="w-4 h-4 text-amber-500" /> },
    { text: t.aboutPoint5, icon: <Cpu className="w-4 h-4 text-indigo-500" /> },
  ];

  return (
    <section aria-label="About DrSense" className="w-full">
      <div
        id="about-drsense-card"
        className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs"
      >
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-700">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {t.aboutTitle}
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {points.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200 shrink-0 mt-0.5">
                {point.icon}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {point.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
