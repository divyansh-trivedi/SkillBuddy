import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, ChevronRight, Trophy, Clock, Star } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/quizzes`);
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
            <Trophy size={16} /> Skill Assessment
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Available Quizzes</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Validate your knowledge. Earn badges. Level up your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, idx) => (
            <motion.div 
              key={quiz._id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl flex flex-col group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <BrainCircuit size={24} />
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded uppercase tracking-wide">
                  Intermediate
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                {quiz.courseTitle}
              </h3>
              
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <div className="flex items-center gap-1"><Clock size={14} /> 15 mins</div>
                <div className="flex items-center gap-1"><Star size={14} /> 500 XP</div>
              </div>

              <Link
                to={`/quiz/${encodeURIComponent(quiz.courseTitle)}`}
                className="mt-auto btn-secondary w-full flex items-center justify-center gap-2 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-all"
              >
                Start Quiz <ChevronRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
        
        {quizzes.length === 0 && (
          <div className="text-center text-slate-500 mt-10">No quizzes available at the moment.</div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
