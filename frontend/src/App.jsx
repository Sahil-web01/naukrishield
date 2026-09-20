import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PresetScenarios from './components/PresetScenarios';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import TextHighlighter from './components/TextHighlighter';
import EvidenceList from './components/EvidenceList';
import NextSteps from './components/NextSteps';
import LimitationsBox from './components/LimitationsBox';
import HistoryModal from './components/HistoryModal';
import ErrorState from './components/ErrorState';
import { analyzeText, fetchScanStats, checkBackendHealth } from './services/api';
import { PRESET_SCENARIOS } from './utils/presets';
import { Shield } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState(PRESET_SCENARIOS[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_SCENARIOS[0].id);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSpanIndex, setSelectedSpanIndex] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    const init = async () => {
      const online = await checkBackendHealth();
      setBackendOnline(online);
      const scanStats = await fetchScanStats();
      if (scanStats) setStats(scanStats);
      runAnalysis(PRESET_SCENARIOS[0].text);
    };
    init();
  }, []);

  const runAnalysis = async (text) => {
    const content = (text !== undefined ? text : inputText).trim();
    if (!content) return;

    setIsLoading(true);
    setError(null);
    setSelectedSpanIndex(null);

    try {
      const data = await analyzeText(content);
      setResult(data);
      setBackendOnline(true);
      const updatedStats = await fetchScanStats();
      if (updatedStats) setStats(updatedStats);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not connect to analysis service.');
      setBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setInputText(preset.text);
    setSelectedPresetId(preset.id);
    runAnalysis(preset.text);
  };

  const handleClear = () => {
    setInputText('');
    setSelectedPresetId(null);
    setResult(null);
    setError(null);
    setSelectedSpanIndex(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c16] text-slate-100 selection:bg-blue-600/30 selection:text-white">
      <div className="ambient-glow" />

      <Header
        isConnected={backendOnline}
        onOpenHistory={() => setIsHistoryOpen(true)}
        stats={stats}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        <section className="text-center max-w-2xl mx-auto space-y-3 pt-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-outfit">
            Check job and internship offers for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              scam risks
            </span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Paste any recruitment message or job posting to check for advance-fee requests, fake HR contacts, and pressure tactics.
          </p>
        </section>

        {error && (
          <div className="max-w-3xl mx-auto">
            <ErrorState
              error={error}
              onRetry={() => runAnalysis(inputText)}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <div className="lg:col-span-5 space-y-4">
            <PresetScenarios
              selectedPresetId={selectedPresetId}
              onSelectPreset={handleSelectPreset}
            />

            <InputPanel
              text={inputText}
              onChangeText={(val) => {
                setInputText(val);
                setSelectedPresetId(null);
              }}
              onAnalyze={() => runAnalysis(inputText)}
              onClear={handleClear}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-7 space-y-5">
            {result ? (
              <>
                <ResultPanel result={result} />
                <TextHighlighter
                  text={inputText}
                  evidenceSpans={result.evidence_spans}
                  selectedSpanIndex={selectedSpanIndex}
                  onSelectSpan={(idx) => setSelectedSpanIndex(idx)}
                />
                <EvidenceList
                  evidenceSpans={result.evidence_spans}
                  selectedSpanIndex={selectedSpanIndex}
                  onSelectSpan={(idx) => setSelectedSpanIndex(idx)}
                />
                <NextSteps steps={result.next_steps} />
                <LimitationsBox limitations={result.limitations} />
              </>
            ) : (
              <div className="glass-panel rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400 space-y-2.5">
                <Shield className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No message analyzed yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Paste a message on the left or select an example to run analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectHistoryItem={(snippet) => {
          setInputText(snippet);
          runAnalysis(snippet);
        }}
      />

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        NaukriShield • Scam Risk Detector for Job Seekers
      </footer>
    </div>
  );
}
