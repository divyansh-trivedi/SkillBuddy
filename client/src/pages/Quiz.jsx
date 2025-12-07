import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2, XCircle, Trophy, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Quiz = () => {
  const { topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/quizzes/${encodeURIComponent(topic)}`);
        if (!response.ok) throw new Error('Failed to fetch quiz');
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [topic]);

  const handleChange = (idx, value) => {
    setAnswers({ ...answers, [idx]: value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (q.type === 'short-answer') {
        if (typeof answers[idx] === 'string' && answers[idx].trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) score++;
      } else {
        if (answers[idx] === q.correctAnswer) score++;
      }
    });
    return score;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <Link to="/quizzes" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft size={16} /> Back to Quizzes
        </Link>

        <div className="glass-card rounded-2xl overflow-hidden mb-8">
          <div className="bg-slate-900 border-b border-slate-800 p-8">
            <h1 className="text-3xl font-bold text-white mb-2">{topic} Quiz</h1>
            <p className="text-slate-400 text-sm">Answer all questions to test your mastery.</p>
          </div>

          <div className="p-8">
            {submitted && (
              <div className="mb-8 p-6 bg-indigo-600/10 border border-indigo-600/30 rounded-xl text-center">
                <Trophy className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">
                  You scored {getScore()} / {questions.length}
                </h3>
                <p className="text-slate-400 text-sm">Great effort! Review your answers below.</p>
              </div>
            )}

            <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-10">
              {questions.map((q, idx) => (
                <div key={idx} className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-2xl font-bold text-slate-700 select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-medium text-slate-200 mt-1">{q.question}</h3>
                  </div>

                  <div className="pl-10 space-y-3">
                    {q.type === 'multiple-choice' && q.options.map((opt, oidx) => (
                      <label 
                        key={oidx} 
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          answers[idx] === opt 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        } ${submitted && opt === q.correctAnswer ? '!bg-green-500/10 !border-green-500/50 !text-green-400' : ''}
                          ${submitted && answers[idx] === opt && opt !== q.correctAnswer ? '!bg-red-500/10 !border-red-500/50 !text-red-400' : ''}
                        `}
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          disabled={submitted}
                          checked={answers[idx] === opt}
                          onChange={() => handleChange(idx, opt)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          answers[idx] === opt ? 'border-indigo-500' : 'border-slate-600'
                        }`}>
                          {answers[idx] === opt && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                        </div>
                        <span>{opt}</span>
                      </label>
                    ))}
                    
                    {q.type === 'true-false' && ['true', 'false'].map((val) => (
                         <label 
                         key={val} 
                         className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                           String(answers[idx]) === val 
                             ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                             : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                         }`}
                       >
                         <input
                           type="radio"
                           name={`q${idx}`}
                           value={val === 'true'}
                           disabled={submitted}
                           checked={String(answers[idx]) === val}
                           onChange={() => handleChange(idx, val === 'true')}
                           className="hidden"
                         />
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                           String(answers[idx]) === val ? 'border-indigo-500' : 'border-slate-600'
                         }`}>
                           {String(answers[idx]) === val && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                         </div>
                         <span className="capitalize">{val}</span>
                       </label>
                    ))}
                  </div>
                  
                  {submitted && (
                    <div className="pl-10 mt-4">
                      <div className={`text-sm flex items-center gap-2 ${
                        (q.type !== 'short-answer' && answers[idx] === q.correctAnswer) || 
                        (q.type === 'short-answer' && answers[idx]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase())
                        ? 'text-green-400' : 'text-red-400'
                      }`}>
                         {(q.type !== 'short-answer' && answers[idx] === q.correctAnswer) ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                         <span className="font-bold">Explanation:</span> {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {!submitted ? (
                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg shadow-xl shadow-indigo-500/20"
                >
                  Submit Quiz
                </button>
              ) : (
                <div className="flex gap-4">
                    <Link to="/quizzes" className="btn-secondary flex-1 text-center py-3">Back to List</Link>
                    <button onClick={() => window.location.reload()} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"><RefreshCw size={18}/> Retry</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
