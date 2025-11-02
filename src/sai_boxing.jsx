// SAIBoxingDashboard.jsx
import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from 'recharts';
import {
  Award, TrendingUp, Activity, User, Calendar, Target,
  AlertCircle, Heart, Zap, Trophy
} from 'lucide-react';

import { athletesFullData } from './athletesFullData_23';

// Helper: format date (keeps original if unknown format)
const formatDate = (dStr) => {
  if (!dStr) return '';
  const cleaned = String(dStr).replace(/\//g, '.').trim();
  const parts = cleaned.split('.');
  if (parts.length !== 3) return dStr;
  const [dd, mm, yyyy] = parts.map(p => p.padStart(2, '0'));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mIdx = parseInt(mm, 10) - 1;
  if (mIdx >= 0 && mIdx <= 11) return `${dd} ${months[mIdx]} ${yyyy}`;
  return dStr;
};

// Badge for special string values
const ValueBadge = ({ value }) => {
  const v = String(value ?? '').trim();
  if (!v || v === 'AB' || v === 'NIL' || v === 'RJ' || v === 'NR') {
    const map = { AB: 'Absent', NIL: 'NIL', RJ: 'RJ', NR: 'NR' };
    const label = map[v] ?? v;
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">
        {label}
      </span>
    );
  }
  if (v.toUpperCase().includes('INJ') || v.toUpperCase().includes('INJURY')) {
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">INJ</span>;
  }
  // numeric-looking -> show plain
  return <span className="text-lg font-bold text-gray-800">{v}</span>;
};

const metricMeta = {
  // units / friendly labels
  clean: { label: 'Clean (1RM)', unit: 'kg' },
  squat: { label: 'Back Squat (1RM)', unit: 'kg' },
  bench: { label: 'Bench Press (1RM)', unit: 'kg' },
  pullups: { label: 'Chin ups / Pull Ups', unit: 'Count' },
  dips: { label: 'Dips', unit: 'Count' },
  sprint10: { label: 'Sprint 10m', unit: 'sec' },
  sprint20: { label: 'Sprint 20m', unit: 'sec' },
  sprint30: { label: 'Sprint 30m', unit: 'sec' },
  sprint150: { label: '150m', unit: 'sec' },

  // physio
  vo2max: { label: 'VO2 Max', unit: 'ml/kg/min' },
  maxPower: { label: 'Max Power', unit: 'W/kg' },
  avgPower: { label: 'Avg Power', unit: 'W/kg' },
  fatigue: { label: 'Fatigue', unit: '%' },
};

const MetricsGrid = ({ dataObj }) => {
  // Flatten sc + physio into an array of { key, label, value, unit }
  const combined = [];

  if (dataObj.sc) {
    Object.entries(dataObj.sc).forEach(([k, v]) => {
      const meta = metricMeta[k] || { label: k.replace(/([A-Z])/g, ' $1'), unit: '' };
      combined.push({ key: k, label: meta.label, value: v ?? 'AB', unit: meta.unit });
    });
  }
  if (dataObj.physio) {
    Object.entries(dataObj.physio).forEach(([k, v]) => {
      const meta = metricMeta[k] || { label: k, unit: '' };
      combined.push({ key: k, label: meta.label, value: v ?? 'AB', unit: meta.unit });
    });
  }
  // Optionally include some main fields
  const mainFields = ['category', 'weight', 'dob', 'doj', 'attendance', 'kid', 'points'];
  mainFields.forEach(k => {
    if (dataObj.main?.[k] !== undefined) {
      const label = k.toUpperCase();
      combined.unshift({ key: k, label, value: dataObj.main[k], unit: '' });
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {combined.map(({ key, label, value, unit }) => (
        <div key={key} className="bg-white rounded-xl shadow p-4 border-l-4 border-gray-100">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-1">{label}</div>
              <div className="flex items-center gap-2">
                <ValueBadge value={value} />
                {typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) && unit && (
                  <span className="text-sm text-gray-500 ml-1">{unit}</span>
                )}
                {/* if numeric but stored as string, show unit */}
                {typeof value === 'number' && unit && <span className="text-sm text-gray-500">{unit}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


const safeNum = (val) => {
  if (val === null || val === undefined) return null;
  const n = parseFloat(String(val).replace(/[^\d\.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

const SAIBoxingDashboard = () => {
  const athleteNames = Object.keys(athletesFullData || {});
  const [selectedAthlete, setSelectedAthlete] = useState(athleteNames[0] || '');

  const athleteData = useMemo(() => {
    if (!selectedAthlete) return {};
    return athletesFullData[selectedAthlete] || {};
  }, [selectedAthlete]);

  const strengthData = [
    { exercise: 'Clean', value: safeNum(athleteData.sc?.clean) },
    { exercise: 'Squat', value: safeNum(athleteData.sc?.squat) },
    { exercise: 'Bench', value: safeNum(athleteData.sc?.bench) }
  ].filter(d => d.value !== null && d.value > 0);

  const radarData = [
    { metric: 'VO2 Max', value: safeNum(athleteData.physio?.vo2max) || 0 },
    { metric: 'Max Power', value: safeNum(athleteData.physio?.maxPower) || 0 },
    { metric: 'Avg Power', value: safeNum(athleteData.physio?.avgPower) || 0 },
    { metric: 'Pull Ups', value: safeNum(athleteData.sc?.pullups) || 0 }
  ].filter(d => d.value > 0);

  if (!athleteNames.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No athlete data available</h2>
          <p className="mt-2 text-gray-600">Add athletes to athletesFullData_23.js</p>
        </div>
      </div>
    );
  }

  const main = athleteData.main || {};

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold mb-1">Sports Authority of India</h1>
            <p className="text-base lg:text-xl text-yellow-300">Boxing Athletes Performance Dashboard - NCOE</p>
          </div>
          <div className="hidden lg:flex gap-4 items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-blue-900 font-bold text-2xl">SAI</span>
            </div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Trophy className='text-blue-900 w-10 h-10' />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Athlete select */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-l-8 border-orange-500">
          <label className="block text-lg font-bold text-gray-800 mb-3">Select Athlete</label>
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="text-red-800 w-full p-2 border-3 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500 text-md lg:text-xl font-semibold bg-gray-50"
          >
            {athleteNames.map(name => (
              <option key={name} value={name} >
                {name} - {athletesFullData[name].main.category}
              </option>
            ))}
          </select>
        </div>

        {/* Main summary + charts area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT column */}
          <div className="lg:col-span-1 space-y-6">
            {/* ... Athlete info card, physio cards as before ... */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-8 border-orange-500">
              <div className="flex items-center justify-center mb-6">
                <div className="w-36 h-36 rounded-full overflow-hidden bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-center shadow-xl mb-4">
                  {main?.img ? <img src={main.img} alt={selectedAthlete} className="w-full h-full object-cover" /> : <User className="w-20 h-20 text-white" />}
                </div>
              </div>

              <h2 className="text-xl md:text-3xl font-bold text-center text-blue-900 mb-6 border-b-2 border-gray-200 pb-4">{selectedAthlete}</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-orange-500" />
                  <span className="font-bold text-lg">Category:</span>
                  <span className="ml-auto text-lg font-semibold">{main?.category || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-lg">Weight:</span>
                  <span className="ml-auto text-lg font-semibold">{main?.weight || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-500" />
                  <span className="font-bold text-lg">DOB:</span>
                  <span className="ml-auto text-lg font-semibold">{formatDate(main?.dob) || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-lg">Scheme:</span>
                  <span className="ml-auto text-lg font-semibold">{main?.scheme || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-500" />
                  <span className="font-bold text-lg">DOJ:</span>
                  <span className="ml-auto text-lg font-semibold">{formatDate(main?.doj) || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <span className="font-bold text-lg">KID:</span>
                  <span className="ml-auto text-sm font-semibold">{main?.kid || 'N/A'}</span>
                </div>
              </div>

              {main?.points && main.points !== 'NIL' && (
                <div className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl text-center shadow-lg">
                  <div className="text-4xl font-bold">{main.points}</div>
                  <div className="text-md font-semibold mt-2">Performance Points</div>
                </div>
              )}

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-900">
                <h4 className="font-bold text-gray-800 mb-2">Short Term Target:</h4>
                <p className="text-gray-700 text-sm">{main?.shortTarget || 'N/A'}</p>
                <h4 className="font-bold text-gray-800 mb-2 mt-3">Long Term Target:</h4>
                <p className="text-gray-700 text-sm">{main?.longTarget || 'N/A'}</p>
              </div>
            </div>

            {/* physio quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-blue-900">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">VO2 Max</div>
                <div className="text-3xl font-bold text-blue-900">{athleteData.physio?.vo2max || 'N/A'}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">ml/kg/min</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-orange-500">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">Max Power</div>
                <div className="text-3xl font-bold text-orange-500">{athleteData.physio?.maxPower || 'N/A'}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">W/kg</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-green-600">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">Avg Power</div>
                <div className="text-3xl font-bold text-green-600">{athleteData.physio?.avgPower || 'N/A'}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">W/kg</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-red-600">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">Fatigue</div>
                <div className="text-3xl font-bold text-red-600">{athleteData.physio?.fatigue || 'N/A'}</div>
                <div className="text-xs text-gray-600 font-semibold mt-1">%</div>
              </div>
            </div>
          </div>

          {/* RIGHT column: charts + achievements (UNCHANGED from prior version) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strength chart */}
            {strengthData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-blue-900">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-orange-500" />
                  Strength Performance (kg)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="exercise" tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }} />
                    <YAxis tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', color: '#1f2937', fontWeight: 'bold', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#1e3a8a" radius={[12, 12, 0, 0]}>
                      <LabelList dataKey="value" position="top" fill="#1f2937" fontSize={14} fontWeight="bold" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Radar */}
            {radarData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-green-600">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  Physiological Profile
                </h3>
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#cbd5e0" strokeWidth={2} />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 'bold' }} />
                    <Radar name="Performance" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.7} strokeWidth={3} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', fontWeight: 'bold', borderRadius: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Achievements + other sections (unchanged) */}
            {(athleteData.achievements || athleteData.beforeJoiningAchie) && (
              <div className="grid grid-cols-1 gap-6">
                {athleteData.beforeJoiningAchie && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-blue-900">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                      <Award className="w-8 h-8 text-blue-900" />
                      Before Joining Achievements
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg border-l-4 border-blue-900">
                      {Array.isArray(athleteData.beforeJoiningAchie) ? (
                        <ul className="list-disc pl-5 space-y-2 text-gray-900 text-md leading-relaxed font-medium">
                          {athleteData.beforeJoiningAchie.map((item, index) => (<li key={index}>{item}</li>))}
                        </ul>
                      ) : <p className="text-gray-900 text-lg leading-relaxed font-medium">{athleteData.beforeJoiningAchie || 'No achievements recorded'}</p>}
                    </div>
                  </div>
                )}

                {athleteData.achievements && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-orange-500">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-orange-500" />
                      After Joining Achievements
                    </h3>
                    <div className="p-6 rounded-lg border-l-4 border-orange-500">
                      {Array.isArray(athleteData.achievements) ? (
                        <ul className="list-disc pl-5 space-y-2 text-gray-900 text-md leading-relaxed font-medium">
                          {athleteData.achievements.map((item, index) => (<li key={index}>{item}</li>))}
                        </ul>
                      ) : <p className="text-gray-900 text-lg leading-relaxed font-medium">{athleteData.achievements || 'No achievements recorded'}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Coach, Psychology, Physio, Nutrition, Doctor (unchanged) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-blue-900">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2"><User className="w-6 h-6" />Coach Assessment</h3>
                <div className="bg-blue-50 p-4 rounded-lg"><p className="text-gray-900 text-sm italic">{athleteData.coachRemarks || 'N/A'}</p></div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-purple-600">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2"><Heart className="w-6 h-6 text-purple-600" />Psychology</h3>
                <div className="bg-purple-50 p-4 rounded-lg"><p className="text-gray-900 text-sm">{athleteData.psychology || 'N/A'}</p></div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-green-600">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2"><Activity className="w-6 h-6 text-green-600" />Physiotherapy</h3>
                <div className="bg-green-50 p-4 rounded-lg"><p className="text-gray-900 text-sm">{athleteData.physiotherapy || 'N/A'}</p></div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-orange-500">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2"><AlertCircle className="w-6 h-6 text-orange-500" />Nutrition</h3>
                <div className="bg-orange-50 p-4 rounded-lg"><p className="text-gray-900 text-sm">{athleteData.nutrition || 'N/A'}</p></div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-red-600">
              <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2"><Heart className="w-6 h-6 text-red-600" />Medical Status</h3>
              <div className="bg-red-50 p-4 rounded-lg"><p className="text-gray-900 text-lg font-semibold">{athleteData.doctor || 'N/A'}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          FULLWIDTH: All Measured Metrics
          This section is full-bleed across the viewport (w-full).
          It still uses MetricsGrid to render cards but is not constrained by max-w-7xl.
          ========================= */}
      <section className="w-full bg-white border-t border-gray-200 py-6">
        {/* inner padding ensures content doesn't touch edges; remove px-6 if you want truly edge-to-edge content */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4 max-w-[none]">
            <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
              <Zap className="w-8 h-8 text-indigo-500" />
              Sprints & Clean
            </h3>
          </div>

          {/* Important: use a horizontal scroll wrapper for very wide grids on small screens */}
          <div className="overflow-x-auto">
            {/* ensure the metrics grid can expand — set min-w so cards fill across viewport */}
            <div className="min-w-[1100px]">
              <MetricsGrid dataObj={athleteData} />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-blue-900 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© 2025 Sports Authority of India - All Rights Reserved</p>
          <p className="text-xs text-blue-200 mt-1">National Centre of Excellence - Boxing Performance Tracking</p>
        </div>
      </div>
    </div>
  );
};

export default SAIBoxingDashboard;