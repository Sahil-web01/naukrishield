import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

export default function ResultPanel({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const {
    risk_category,
    risk_score,
    model_assessment,
    evidence_spans
  } = result;

  const riskPercent = Math.round((risk_score || 0) * 100);

  let statusConfig = {
    title: 'Likely Safe',
    badge: 'LOW RISK',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    barColor: 'from-emerald-500 to-teal-400',
    iconColor: 'text-emerald-400',
    Icon: CheckCircle2,
    description: 'No known scam phrases, payment requests, or fake interview tactics were found.'
  };

  if (risk_category === 'HIGH') {
    statusConfig = {
      title: 'High Scam Risk',
      badge: 'HIGH RISK',
      badgeStyle: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      barColor: 'from-orange-500 to-red-600',
      iconColor: 'text-rose-400',
      Icon: ShieldAlert,
      description: 'Contains high-risk scam indicators. Do not send any money, OTPs, or sensitive documents.'
    };
  } else if (risk_category === 'MODERATE') {
    statusConfig = {
      title: 'Proceed with Caution',
      badge: 'MODERATE RISK',
      badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      barColor: 'from-yellow-500 to-amber-500',
      iconColor: 'text-amber-400',
      Icon: AlertTriangle,
      description: 'Suspicious elements detected (like unverified channels or document requests). Check independently.'
    };
  } else if (risk_category === 'INSUFFICIENT_INFO') {
    statusConfig = {
      title: 'Not Enough Information',
      badge: 'INSUFFICIENT DATA',
      badgeStyle: 'bg-slate-700/40 text-slate-300 border-slate-600',
      barColor: 'from-slate-600 to-slate-500',
      iconColor: 'text-slate-400',
      Icon: HelpCircle,
      description: 'Please provide more details from the job offer to evaluate properly.'
    };
  }

  const { Icon } = statusConfig;

  const handleCopy = () => {
    const summary = `NaukriShield Analysis Result:
Risk Level: ${statusConfig.badge} (${riskPercent}%)
Verdict: ${statusConfig.title}
Flagged Phrases: ${evidence_spans?.length || 0}
Explanation: ${statusConfig.description}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-750 flex-shrink-0">
            <Icon className={`w-6 h-6 ${statusConfig.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${statusConfig.badgeStyle}`}>
                {statusConfig.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-1">
              {statusConfig.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-lg leading-relaxed">
              {statusConfig.description}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 text-xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Report</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Calculated Risk Score</span>
          <span className="font-mono font-bold text-white text-base">{riskPercent}%</span>
        </div>

        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-850">
          <div
            className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${statusConfig.barColor}`}
            style={{ width: `${Math.max(4, riskPercent)}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
          <span>0% Low</span>
          <span>50% Moderate</span>
          <span>100% High Risk</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-1.5 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Text Model Assessment</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Prediction: <strong className="text-slate-200">{model_assessment?.label || 'Inconclusive'}</strong>
          </p>
          {model_assessment?.top_indicators?.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 block mb-1">Key terms found:</span>
              <div className="flex flex-wrap gap-1">
                {model_assessment.top_indicators.map((term, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px] font-mono">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-1.5 text-xs">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Rule-Based Checks</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Flags triggered: <strong className="text-slate-200">{evidence_spans?.length || 0} phrase(s)</strong>
          </p>
          <p className="text-[11px] text-slate-500">
            Checks for upfront payments, fake HR WhatsApp/Telegram contacts, and pressure tactics.
          </p>
        </div>
      </div>
    </div>
  );
}
