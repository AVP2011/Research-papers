import { useState } from 'react';
import {
  Activity,
  Truck,
  TrendingUp,
  Cpu,
  Building2,
  ShieldCheck,
  Brain,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  BarChart3,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Globe,
  Grid,
  Check,
  X,
  Minus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Data Mocking
const demandForecastData = [
  { time: '06:00', Tc99m: 120, F18: 85, Lu177: 30, Predicted: 240 },
  { time: '09:00', Tc99m: 280, F18: 190, Lu177: 45, Predicted: 525 },
  { time: '12:00', Tc99m: 350, F18: 240, Lu177: 60, Predicted: 660 },
  { time: '15:00', Tc99m: 210, F18: 160, Lu177: 50, Predicted: 430 },
  { time: '18:00', Tc99m: 140, F18: 90, Lu177: 35, Predicted: 270 },
  { time: '21:00', Tc99m: 80, F18: 40, Lu177: 20, Predicted: 140 },
];

const decayLossData = [
  { distance: '50 km', staticLoss: 14, dynamicLoss: 4 },
  { distance: '120 km', staticLoss: 28, dynamicLoss: 9 },
  { distance: '250 km', staticLoss: 45, dynamicLoss: 16 },
  { distance: '400 km', staticLoss: 62, dynamicLoss: 24 },
];

const shapFeatures = [
  { feature: 'Hospital Scan Queue Size', impact: 0.38, color: '#06b6d4' },
  { feature: 'Historical No-Show Rate', impact: -0.24, color: '#f43f5e' },
  { feature: 'Regional Traffic Delay (ETA)', impact: -0.19, color: '#f43f5e' },
  { feature: 'Weather Severity Index', impact: -0.12, color: '#f59e0b' },
  { feature: 'Cyclotron Beam Energy Window', impact: 0.29, color: '#10b981' },
];

const hospitalList = [
  { id: 'H1', name: 'City General Hospital', status: 'Optimal', demand: '240 mCi Tc-99m', eta: '18 mins', alert: false },
  { id: 'H2', name: 'Oncology Institute North', status: 'Urgent Dispatch', demand: '180 mCi F-18', eta: '34 mins', alert: true },
  { id: 'H3', name: 'St. Jude Cardiac Center', status: 'Scheduled', demand: '310 mCi Tc-99m', eta: '52 mins', alert: false },
  { id: 'H4', name: 'Metropolitan Med Hub', status: 'QC Released', demand: '90 mCi Lu-177', eta: '1 hr 10m', alert: false },
];

// Feature Comparison Matrix Data (Systematic Review)
const matrixPapers = [
  { name: 'OECD NEA (2019/2025)', production: 'partial', supply: 'partial', apis: 'no', ml: 'no', dss: 'no', isOurSystem: false },
  { name: 'IAEA TRS 465 / 471', production: 'yes', supply: 'no', apis: 'no', ml: 'no', dss: 'no', isOurSystem: false },
  { name: 'WHO GMP TRS 1025', production: 'yes', supply: 'no', apis: 'no', ml: 'no', dss: 'no', isOurSystem: false },
  { name: 'IAEA Hospital Manual', production: 'no', supply: 'partial', apis: 'no', ml: 'no', dss: 'no', isOurSystem: false },
  { name: 'Wang et al. (2022)', production: 'yes', supply: 'no', apis: 'no', ml: 'no', dss: 'no', isOurSystem: false },
  { name: 'Tc-99m Logistics (2021)', production: 'no', supply: 'yes', apis: 'no', ml: 'no', dss: 'no', isOurSystem: false },
  { name: 'Data Mining Review', production: 'no', supply: 'no', apis: 'no', ml: 'partial', dss: 'no', isOurSystem: false },
  { name: 'AI Supply Chain (2023)', production: 'no', supply: 'yes', apis: 'partial', ml: 'yes', dss: 'partial', isOurSystem: false },
  { name: 'Outpatient Demand (2022)', production: 'no', supply: 'no', apis: 'no', ml: 'yes', dss: 'no', isOurSystem: false },
  { name: 'Explainability AI (2023)', production: 'no', supply: 'no', apis: 'no', ml: 'partial', dss: 'yes', isOurSystem: false },
  { name: 'IsotopeFlow (Our System)', production: 'yes', supply: 'yes', apis: 'yes', ml: 'yes', dss: 'yes', isOurSystem: true }
];

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'forecasting' | 'scheduling' | 'logistics' | 'xai' | 'matrix' | 'gaps'>('overview');
  const [selectedIsotope, setSelectedIsotope] = useState<'Tc99m' | 'F18' | 'Lu177'>('Tc99m');
  const [simulationRunning, setSimulationRunning] = useState(false);

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setTimeout(() => setSimulationRunning(false), 1500);
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'yes') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Check className="w-3.5 h-3.5" /> Full
        </span>
      );
    }
    if (status === 'partial') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <Minus className="w-3.5 h-3.5" /> Partial
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-normal bg-slate-900 text-slate-500 border border-slate-800">
        <X className="w-3.5 h-3.5 text-slate-600" /> None
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-wide">IsotopeFlow</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  B.E. Major Project
                </span>
              </div>
              <p className="text-xs text-slate-400">Intelligent API & AI Medical Isotope Ecosystem</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'overview' ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> System Control
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'matrix' ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4 text-emerald-400" /> Research Gap Matrix
            </button>
            <button
              onClick={() => setActiveTab('forecasting')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'forecasting' ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4" /> ML Demand AI
            </button>
            <button
              onClick={() => setActiveTab('scheduling')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'scheduling' ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" /> Physics Production
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'logistics' ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" /> Decay Logistics
            </button>
            <button
              onClick={() => setActiveTab('xai')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'xai' ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> XAI Decision
            </button>
            <button
              onClick={() => setActiveTab('gaps')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition ${
                activeTab === 'gaps' ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Literature Gaps
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={simulationRunning}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulationRunning ? 'animate-spin text-cyan-400' : ''}`} />
              {simulationRunning ? 'Simulating API...' : 'Live Re-sync'}
            </button>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Banner / Problem Statement Alignment */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-4 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Verified Academic Problem Statement
            </div>
            <p className="text-xs text-slate-300 max-w-4xl leading-relaxed italic">
              "Modern technologies such as APIs, data mining, and machine learning can significantly improve medical isotope production and distribution. APIs enable real-time collection of data... data mining identifies demand patterns... machine learning predicts future isotope requirements and optimizes production schedules."
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-slate-300 shrink-0">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Target Decay Window: <strong>6.01h (Tc-99m)</strong></span>
          </div>
        </div>

        {/* TAB: RESEARCH GAP MATRIX (USER REQUESTED FEATURE MATRIX) */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    <Grid className="w-4 h-4 text-cyan-400" /> Systematic Literature Review Synthesis
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">Research Gap Matrix</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Comparative feature evaluation across 10 literature sources vs. <strong>IsotopeFlow (Our System)</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Full Capability
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Minus className="w-3.5 h-3.5" /> Partial / Static
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <X className="w-3.5 h-3.5" /> Out of Scope
                  </div>
                </div>
              </div>

              {/* Table Component */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90 shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 font-semibold uppercase tracking-wider">
                      <th className="py-4 px-4 min-w-[200px]">Feature / Literature Paper</th>
                      <th className="py-4 px-3 text-center">Production</th>
                      <th className="py-4 px-3 text-center">Supply Chain</th>
                      <th className="py-4 px-3 text-center">APIs</th>
                      <th className="py-4 px-3 text-center">ML Analytics</th>
                      <th className="py-4 px-3 text-center">Decision Support (DSS)</th>
                      <th className="py-4 px-4 text-right">System Alignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {matrixPapers.map((paper, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-slate-900/50 ${
                          paper.isOurSystem
                            ? 'bg-cyan-950/40 border-l-4 border-l-cyan-400 font-bold text-white shadow-lg'
                            : 'text-slate-300'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-sans font-medium flex items-center gap-2">
                          {paper.isOurSystem && <Radio className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />}
                          <span className={paper.isOurSystem ? 'text-cyan-300 font-bold text-sm' : ''}>
                            {paper.name}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">{renderStatusBadge(paper.production)}</td>
                        <td className="py-3.5 px-3 text-center">{renderStatusBadge(paper.supply)}</td>
                        <td className="py-3.5 px-3 text-center">{renderStatusBadge(paper.apis)}</td>
                        <td className="py-3.5 px-3 text-center">{renderStatusBadge(paper.ml)}</td>
                        <td className="py-3.5 px-3 text-center">{renderStatusBadge(paper.dss)}</td>
                        <td className="py-3.5 px-4 text-right font-sans">
                          {paper.isOurSystem ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20">
                              <Sparkles className="w-3.5 h-3.5" /> Proposed Ecosystem
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Literature Reference</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Research Gap Justification Box */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-xs font-semibold text-cyan-400 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Academic Justification & Gap Validation
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  As shown in the Research Gap Matrix above, existing literature addresses isolated domain fragments—such as cyclotron physics (IAEA TRS 465), static vehicle routing (Logistics 2021), or clinic outpatient prediction (Demand 2022). <strong>No single prior research work unifies Production, Supply Chain Logistics, Real-Time APIs, Machine Learning, and Explainable Decision Support (XAI)</strong> into a single cohesive architecture. <strong>IsotopeFlow</strong> solves this gap by bridging all five operational dimensions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW CONTROL CENTER */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Total System Activity</p>
                  <h3 className="text-2xl font-bold text-white mt-1">1,450 <span className="text-xs text-slate-400 font-normal">mCi</span></h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +12.4% vs Yesterday
                  </span>
                </div>
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Transit Decay Savings</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">42.8%</h3>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    Via API-Driven Dynamic Routing
                  </span>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Truck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">ML Forecast Accuracy</p>
                  <h3 className="text-2xl font-bold text-cyan-400 mt-1">96.4%</h3>
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" /> MAE &lt; 3.8%
                  </span>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Brain className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Connected APIs</p>
                  <h3 className="text-2xl font-bold text-white mt-1">18 / 18</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                    Hospitals & Cyclotrons Synced
                  </span>
                </div>
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                  <Globe className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Middle Section: Chart & Live Hospital Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Regional Demand Forecast Chart */}
              <div className="lg:col-span-2 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" /> Real-Time Regional Isotope Demand Curve
                    </h3>
                    <p className="text-xs text-slate-400">Hourly decay-adjusted activity required across regional hospitals</p>
                  </div>
                  <div className="flex gap-2">
                    {(['Tc99m', 'F18', 'Lu177'] as const).map(iso => (
                      <button
                        key={iso}
                        onClick={() => setSelectedIsotope(iso)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          selectedIsotope === iso
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {iso}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={demandForecastData}>
                      <defs>
                        <linearGradient id="colorIso" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Area type="monotone" dataKey={selectedIsotope} stroke="#06b6d4" fillOpacity={1} fill="url(#colorIso)" name={`Actual ${selectedIsotope}`} />
                      <Area type="monotone" dataKey="Predicted" stroke="#8b5cf6" strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPred)" name="ML Forecasted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hospital Live API Queue */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400" /> Hospital API Queue
                    </h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                      Live FHIR Feed
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Real-time nuclear scan orders from EHRs</p>
                </div>

                <div className="space-y-3 my-2">
                  {hospitalList.map(h => (
                    <div key={h.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-slate-200">{h.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{h.demand}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          h.alert ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        }`}>
                          {h.status}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> ETA: {h.eta}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('matrix')}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
                >
                  View Research Gap Matrix <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ML DEMAND FORECASTING */}
        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" /> Machine Learning Isotope Demand Predictor
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Solves Research Gap 2: Converts EHR outpatient scan queues into decay-corrected bulk radioisotope activity requirements (A_0) 48–72h in advance.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Cpu className="w-4 h-4 text-purple-400" /> Model: <strong>XGBoost + LSTM Hybrid</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Target Half-Life (decay)</div>
                  <div className="text-xl font-bold text-cyan-400">6.01 Hours</div>
                  <p className="text-[11px] text-slate-400">A(t) = A_0 * e^(-lambda * t) decay correction active</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Forecast Horizon</div>
                  <div className="text-xl font-bold text-purple-400">72 Hours Ahead</div>
                  <p className="text-[11px] text-slate-400">Updated every 15 minutes via FHIR API</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Predicted No-Show Rate</div>
                  <div className="text-xl font-bold text-emerald-400">8.4% Adjusted</div>
                  <p className="text-[11px] text-slate-400">Prevents over-compounding of un-injected doses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PHYSICS PRODUCTION SCHEDULING */}
        {activeTab === 'scheduling' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" /> Physics-Informed Accelerator Scheduling Engine
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Solves Research Gap 3: Integrates cyclotron nuclear cross-section formulas (Mo-100 to Tc-99m) with WHO TRS 1025 GMP release checkpoints.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Cyclotron Beam Constraints</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Proton Beam Energy Window</span>
                      <span className="font-mono text-cyan-400">16 - 18 MeV</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Target Cooling Current Limit</span>
                      <span className="font-mono text-cyan-400">130 uA</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Hot Cell Extraction Prep Time</span>
                      <span className="font-mono text-cyan-400">45 Minutes</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">GMP Quality Control Checkpoints (WHO TRS 1025)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Radionuclidic Purity (HPGe Spectrometry)</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Radiochemical Purity (ITLC &gt; 95%)</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Endotoxin Assay (LAL &lt; 175 EU/Vial)</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DECAY LOGISTICS */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-cyan-400" /> Real-Time Decay-Aware Routing Engine
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Solves Research Gap 4: Replaces static VRP logistics with live GPS telemetry recalculating decay loss in real time.
                  </p>
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={decayLossData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="distance" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Legend />
                    <Bar dataKey="staticLoss" fill="#f43f5e" name="Static Routing Decay Loss (%)" />
                    <Bar dataKey="dynamicLoss" fill="#10b981" name="IsotopeFlow API-Dynamic Loss (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: XAI DECISION SUPPORT */}
        {activeTab === 'xai' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> Explainable AI (SHAP) Decision Support
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Solves Research Gap 5: Makes operational supply chain decisions transparent for hospital radiopharmacists and plant managers.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">SHAP Feature Attribution (Why IsotopeFlow Scheduled Run #402)</h4>
                {shapFeatures.map(item => (
                  <div key={item.feature} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{item.feature}</span>
                      <span className="font-mono" style={{ color: item.color }}>
                        {item.impact > 0 ? `+${item.impact}` : item.impact} SHAP
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex">
                      <div
                        style={{
                          width: `${Math.abs(item.impact) * 100}%`,
                          backgroundColor: item.color
                        }}
                        className="h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RESEARCH GAPS ALIGNMENT */}
        {activeTab === 'gaps' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" /> Literature Gap Solved Summary
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Direct mapping between IEEE literature gaps and platform design</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-semibold">Gap 1: Inter-Organizational Data Silos</div>
                  <p className="text-slate-400">Literature (OECD 2019) lacks digital APIs. Solved via IsotopeFlow Open REST/gRPC API Gateway.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-purple-400 font-semibold">Gap 2: Decoupled Hospital Demand Forecasts</div>
                  <p className="text-slate-400">Outpatient models ignore decay. Solved via decay-corrected XGBoost-LSTM forecasting module.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-emerald-400 font-semibold">Gap 3: Physics & Production Manual Scheduling</div>
                  <p className="text-slate-400">Accelerator literature omits demand sync. Solved via Physics-Informed Yield Optimization.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-rose-400 font-semibold">Gap 4: Offline Routing Decay Loss</div>
                  <p className="text-slate-400">VRP models rely on static datasets. Solved via live GPS decay recalculation engine.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-4 text-center text-xs text-slate-500">
        IsotopeFlow Dashboard • Bachelor of Engineering Major Project • Aligned with IEEE Systematic Review & Faculty Problem Statement
      </footer>
    </div>
  );
}

export default App;
