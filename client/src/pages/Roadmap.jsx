import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LayoutGrid, CheckCircle2, Circle, ArrowRight, PlayCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Roadmap = () => {
  const { name } = useParams();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [started, setStarted] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [startMsg, setStartMsg] = useState('');
  
  const completedCount = completed.filter(Boolean).length;
  const progressPercent = steps && steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/roadmaps/${encodeURIComponent(name)}`);
        if (!response.ok) {
           if (response.status === 404) {
               setSteps([]);
           } else {
               throw new Error('Failed to fetch roadmap');
           }
        } else {
            const data = await response.json();
            setSteps(data);
            setCompleted(Array(data.length).fill(false));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [name]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !name || steps.length === 0) return;

    fetch(`${API_BASE_URL}/api/progress/${encodeURIComponent(name)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && (data._id || data.completedLessons)) {
          setStarted(true);
          if (Array.isArray(data.completedLessons)) {
            const arr = Array(steps.length).fill(false);
            data.completedLessons.forEach(lessonTitle => {
              const idx = steps.findIndex(s => s.title === lessonTitle);
              if (idx !== -1) arr[idx] = true;
            });
            setCompleted(arr);
          }
        }
      })
      .catch((err) => console.error("Error fetching progress:", err));
  }, [name, steps.length]);

  const handleCheck = async idx => {
    const updated = [...completed];
    updated[idx] = !updated[idx];
    setCompleted(updated);
    
    const token = localStorage.getItem('token');
    if (!token) return; 

    const completedLessons = steps.filter((_, i) => updated[i]).map(s => s.title);
    try {
      await fetch(`${API_BASE_URL}/api/progress/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completedLessons })
      });
      window.dispatchEvent(new Event('progress-updated'));
    } catch (err) {
        console.error("Error updating progress:", err);
    }
  };

  const handleStartCourse = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setStartMsg('Please login to track progress.');
        return;
    }
    setStartLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/progress/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completedLessons: [] })
      });
      if (res.ok) {
        setStarted(true);
        setStartMsg('');
      }
    } catch {
      setStartMsg('Failed to start.');
    }
    setStartLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 text-indigo-400 text-sm font-medium mb-4 uppercase tracking-wider">
                <LayoutGrid size={16} /> Learning Path
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{name} Roadmap</h1>
            <p className="text-slate-400 max-w-xl mx-auto">Follow this structured path to master {name}. Complete each step to advance.</p>
        </div>

        {/* Progress Card */}
        <div className="glass-card p-8 rounded-2xl mb-10 border-l-4 border-l-indigo-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full md:w-2/3">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-medium">Overall Progress</span>
                        <span className="text-indigo-400 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
                
                {!started ? (
                    <button 
                        onClick={handleStartCourse}
                        disabled={startLoading}
                        className="btn-primary w-full md:w-auto"
                    >
                        {startLoading ? 'Starting...' : 'Start Learning Path'}
                    </button>
                ) : (
                    <Link to={`/quiz/${encodeURIComponent(name)}`} className="btn-secondary w-full md:w-auto flex items-center justify-center gap-2">
                        Take Final Quiz <ArrowRight size={16} />
                    </Link>
                )}
            </div>
            {startMsg && <p className="text-red-400 text-sm mt-2 text-center md:text-left">{startMsg}</p>}
        </div>

        {/* Steps Timeline */}
        <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800 md:left-1/2 md:-ml-px"></div>

            <div className="space-y-12">
                {steps.map((step, idx) => (
                    <div key={idx} className={`relative flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                        
                        {/* Number Bubble */}
                        <div className={`absolute left-8 -translate-x-1/2 md:left-1/2 w-8 h-8 rounded-full border-4 border-slate-950 z-10 flex items-center justify-center text-xs font-bold transition-colors ${
                            completed[idx] ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                            {completed[idx] ? <CheckCircle2 size={16} /> : idx + 1}
                        </div>

                        {/* Content Card */}
                        <div className={`w-full pl-16 md:w-1/2 ${idx % 2 === 0 ? 'md:pl-0 md:pr-12 md:text-right' : 'md:pl-12'}`}>
                            <div className={`glass-card p-6 rounded-xl border-l-4 transition-all duration-300 ${
                                completed[idx] ? 'border-l-green-500 opacity-70 hover:opacity-100' : 'border-l-indigo-500'
                            }`}>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{step.description}</p>
                                
                                <div className={`flex items-center gap-4 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
                                    {step.resource && (
                                        <a href={step.resource} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                            <PlayCircle size={14} /> Official Resource
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => handleCheck(idx)}
                                        disabled={!started}
                                        className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
                                            completed[idx] 
                                                ? 'border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20' 
                                                : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'
                                        }`}
                                    >
                                        {completed[idx] ? 'Completed' : 'Mark Complete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Roadmap;
