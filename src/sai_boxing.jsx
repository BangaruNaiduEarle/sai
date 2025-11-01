import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import {
  Award,
  TrendingUp,
  Activity,
  User,
  Calendar,
  Target,
  AlertCircle,
  Heart,
  Zap,
  Trophy 
} from 'lucide-react';

import { athletesFullData } from './athletesFullData_23';

const SAIBoxingDashboard = () => {

  const athleteNames = Object.keys(athletesFullData);
  const [selectedAthlete, setSelectedAthlete] = useState(athleteNames[0]);

  const athleteData = useMemo(() => {
    return athletesFullData[selectedAthlete] || {};
  }, [selectedAthlete]);

  const strengthData = [
    { exercise: 'Clean', value: parseFloat(athleteData.sc?.clean) || 0 },
    { exercise: 'Squat', value: parseFloat(athleteData.sc?.squat) || 0 },
    { exercise: 'Bench', value: parseFloat(athleteData.sc?.bench) || 0 }
  ].filter(d => d.value > 0);

  const sprintData = [
    { distance: '10m', time: parseFloat(athleteData.sc?.sprint10) || 0 },
    { distance: '20m', time: parseFloat(athleteData.sc?.sprint20) || 0 },
    { distance: '30m', time: parseFloat(athleteData.sc?.sprint30) || 0 }
  ].filter(d => d.time > 0);

  const radarData = [
    { metric: 'VO2 Max', value: parseFloat(athleteData.physio?.vo2max) || 0, max: 60 },
    { metric: 'Max Power', value: parseFloat(athleteData.physio?.maxPower) || 0, max: 14 },
    { metric: 'Avg Power', value: parseFloat(athleteData.physio?.avgPower) || 0, max: 10 },
    { metric: 'Pull Ups', value: parseFloat(athleteData.sc?.pullups) || 0, max: 40 }
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-900 text-white p-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold mb-2">Sports Authority of India</h1>
            <p className="text-base lg:text-xl text-yellow-300">Boxing Athletes Performance Dashboard - NCOE</p>
          </div>
          <div className="hidden lg:flex gap-4 items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-blue-900 font-bold text-2xl">SAI</span>
            </div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              {/* <span className="text-orange-600 font-bold text-xs text-center"> */}
                <Trophy className='text-blue-900 w-10 h-10'  />
                {/* </span> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-l-8 border-orange-500">
          <label className="block text-lg font-bold text-gray-800 mb-3">
            Select Athlete
          </label>
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="text-red-800 w-full p-2 border-3 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-500 text-xl font-semibold bg-gray-50"
          >
            {athleteNames.map(name => (
              <option key={name} value={name} >
                {name} - {athletesFullData[name].main.category}
              </option>
            ))}
          </select>
        </div>

        {/* Athlete Info + Charts */}
        {/* (same content as before, truncated for brevity — all charts, cards, sections remain identical) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-8 border-orange-500">
              <div className="flex items-center justify-center mb-6">
                <div className="w-36 h-36  from-blue-900 to-blue-600 rounded-full flex items-center justify-center shadow-xl mb-4">
                  {/* <User className="w-20 h-20 text-white" /> */}
                  {athleteData.main?.img ? <img src={athleteData.main?.img} alt={athleteData.main?.img} className="object-cover" /> : <User className="w-20 h-20 text-white" />}
                </div>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-center text-blue-900 mb-6 border-b-2 border-gray-200 pb-4">
                {selectedAthlete}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-orange-500" />
                  <span className="font-bold text-lg">Category:</span>
                  <span className="ml-auto text-lg font-semibold">{athleteData.main?.category}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-lg">Weight:</span>
                  <span className="ml-auto text-lg font-semibold">{athleteData.main?.weight}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-500" />
                  <span className="font-bold text-lg">DOB:</span>
                  <span className="ml-auto text-lg font-semibold">{athleteData.main?.dob}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-lg">Scheme:</span>
                  <span className="ml-auto text-lg font-semibold">{athleteData.main?.scheme}</span>
                </div>
                {athleteData.main?.attendance && (
                  <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    <span className="font-bold text-lg">Attendance:</span>
                    <span className="ml-auto text-lg font-semibold">{athleteData.main?.attendance} Days</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-800 bg-gray-50 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <span className="font-bold text-lg">KID:</span>
                  <span className="ml-auto text-sm font-semibold">{athleteData.main?.kid}</span>
                </div>
              </div>

              {athleteData.main?.points && (
                <div className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl text-center shadow-lg">
                  <div className="text-5xl font-bold">{athleteData.main?.points}</div>
                  <div className="text-lg font-semibold mt-2">Performance Points</div>
                </div>
              )}

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-900">
                <h4 className="font-bold text-gray-800 mb-2">Short Term Target:</h4>
                <p className="text-gray-700 text-sm">{athleteData.main?.shortTarget}</p>
                <h4 className="font-bold text-gray-800 mb-2 mt-3">Long Term Target:</h4>
                <p className="text-gray-700 text-sm">{athleteData.main?.longTarget}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-blue-900">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">VO2 Max</div>
                <div className="text-3xl font-bold text-blue-900">
                  {athleteData.physio?.vo2max || 'N/A'}
                </div>
                <div className="text-xs text-gray-600 font-semibold mt-1">ml/kg/min</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-orange-500">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">Max Power</div>
                <div className="text-3xl font-bold text-orange-500">
                  {athleteData.physio?.maxPower || 'N/A'}
                </div>
                <div className="text-xs text-gray-600 font-semibold mt-1">W/kg</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-green-600">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">Avg Power</div>
                <div className="text-3xl font-bold text-green-600">
                  {athleteData.physio?.avgPower || 'N/A'}
                </div>
                <div className="text-xs text-gray-600 font-semibold mt-1">W/kg</div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5 border-l-8 border-red-600">
                <div className="text-sm font-bold text-gray-600 uppercase mb-1">Fatigue</div>
                <div className="text-3xl font-bold text-red-600">
                  {athleteData.physio?.fatigue || 'N/A'}
                </div>
                <div className="text-xs text-gray-600 font-semibold mt-1">%</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {strengthData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-blue-900">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-orange-500" />
                  Strength Performance (kg)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="exercise"
                      tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }}
                    />
                    <YAxis
                      tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', color: '#1f2937', fontWeight: 'bold', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" fill="#1e3a8a" radius={[12, 12, 0, 0]}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        fill="#1f2937"
                        fontSize={14}
                        fontWeight="bold"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

              </div>
            )}

            {sprintData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-purple-600">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <Zap className="w-8 h-8 text-purple-600" />
                  Sprint Performance (seconds)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sprintData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="distance"
                      tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }}
                    />
                    <YAxis
                      tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', color: '#fff', fontWeight: 'bold', borderRadius: '8px' }}
                    />
                    <Line type="monotone" dataKey="time" stroke="#9333ea" strokeWidth={3} dot={{ fill: '#9333ea', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {radarData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-green-600">
                <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  Physiological Profile
                </h3>
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#cbd5e0" strokeWidth={2} />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 'auto']}
                      tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 'bold' }}
                    />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.7}
                      strokeWidth={3}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', color: '#fff', fontWeight: 'bold', borderRadius: '8px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-orange-500">
              <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
                <Award className="w-8 h-8 text-orange-500" />
                Achievements
              </h3>
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-lg border-l-4 border-orange-500">
                <p className="text-gray-900 text-lg leading-relaxed font-medium">
                  {athleteData.achievements || 'No achievements recorded'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-blue-900">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Coach Assessment
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-900 text-sm leading-relaxed italic">
                    {athleteData.coachRemarks || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-purple-600">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple-600" />
                  Psychology
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {athleteData.psychology || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-green-600">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-600" />
                  Physiotherapy
                </h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {athleteData.physiotherapy || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-orange-500">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                  Nutrition
                </h3>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {athleteData.nutrition || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-red-600">
              <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                Medical Status
              </h3>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-900 text-lg leading-relaxed font-semibold">
                  {athleteData.doctor || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900 text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© 2025 Sports Authority of India - All Rights Reserved</p>
          <p className="text-xs text-blue-200 mt-1">
            National Centre of Excellence - Boxing Performance Tracking
          </p>
        </div>
      </div>
    </div>
  );
};

export default SAIBoxingDashboard;
