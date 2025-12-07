import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  BrainCircuit, 
  BookOpen, 
  ArrowRight, 
  PlayCircle,
  Trophy,
  Flame,
  Clock,
  CheckCircle2,
  MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';

const PanelCard = ({ title, icon: Icon, description, onClick, color = "indigo" }) => (
  <motion.div
    className="glass-card p-6 rounded-xl cursor-pointer group relative overflow-hidden"
    whileHover={{ y: -4 }}
    onClick={onClick}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
      <Icon size={80} />
    </div>
    
    <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center mb-4 text-${color}-400 group-hover:text-${color}-300 transition-colors`}>
      <Icon size={24} />
    </div>
    
    <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
    <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New State for logic
  const [activeCourseRoadmap, setActiveCourseRoadmap] = useState(null);
  const [globalCourseData, setGlobalCourseData] = useState(null);
  const [globalUpcoming, setGlobalUpcoming] = useState('All courses complete!');

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const progressRes = await fetch(`${API_BASE_URL}/api/progress`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const progressData = await progressRes.json();
        const progresses = Array.isArray(progressData) ? progressData : [];
        setProgressList(progresses);

        let targetProgress = null;
        let targetRoadmap = null;
        let targetUpcomingTitle = 'All courses complete!';

        for (const prog of progresses) {
           try {
             const roadmapRes = await fetch(`${API_BASE_URL}/api/roadmaps/${encodeURIComponent(prog.courseTitle)}`);
             if (!roadmapRes.ok) continue;
             const steps = await roadmapRes.json();
             const completedSet = new Set(prog.completedLessons || []);
             const nextStep = steps.find(s => !completedSet.has(s.title));
             
             if (nextStep) {
                 targetProgress = prog;
                 targetRoadmap = steps;
                 targetUpcomingTitle = nextStep.title;
                 break; 
             }
           } catch (e) { console.error(e); }
        }

        if (targetProgress) {
            setGlobalCourseData({ title: targetProgress.courseTitle });
            setActiveCourseRoadmap(targetRoadmap);
            setGlobalUpcoming(targetUpcomingTitle);
        }

      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const handleProgressUpdated = () => fetchData();
    window.addEventListener('progress-updated', handleProgressUpdated);
    return () => window.removeEventListener('progress-updated', handleProgressUpdated);
  }, [navigate, token]);

  let nextSteps = [];
  if (globalCourseData && activeCourseRoadmap && progressList.length > 0) {
      const progress = progressList.find(p => p.courseTitle === globalCourseData.title);
      const completedSet = new Set(progress?.completedLessons || []);
      nextSteps = activeCourseRoadmap.filter(step => !completedSet.has(step.title)).slice(0, 3);
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.username || 'Learner'}
            </h1>
            <p className="text-slate-400">Here's what's happening with your learning today.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Current Streak</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
              <Flame size={16} />
              <span className="font-bold">3 Days</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <PanelCard 
            title="AI Mentor" 
            icon={Bot} 
            description="Get instant help with your code or concepts." 
            onClick={() => navigate('/ai-chat')}
            color="indigo" 
          />
          <PanelCard 
            title="Skill Quizzes" 
            icon={Trophy} 
            description="Test your knowledge with quick quizzes." 
            onClick={() => navigate('/quizzes')}
            color="violet"
          />
          <PanelCard 
            title="Course Library" 
            icon={BookOpen} 
            description="Explore 500+ courses and new technologies." 
            onClick={() => navigate('/library')}
            color="pink"
          />
          <PanelCard
            title="Resume Learning"
            icon={PlayCircle}
            description={globalCourseData ? `Continue: ${globalCourseData.title}` : "Start your first course!"}
            onClick={() => globalCourseData ? navigate(`/roadmap/${encodeURIComponent(globalCourseData.title)}`) : navigate('/library')}
            color="emerald"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Courses List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">Active Courses</h3>
              <button onClick={() => navigate('/library')} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
            </div>
            
            {loading ? (
              <div className="glass-card p-8 text-center text-slate-500">Loading progress...</div>
            ) : progressList.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-slate-600" size={32} />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">No active courses</h4>
                <p className="text-slate-400 mb-6">Start a course to track your progress here.</p>
                <button 
                  onClick={() => navigate('/library')}
                  className="btn-primary"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {progressList.map((progress, idx) => {
                  const completed = progress.completedLessons ? progress.completedLessons.length : 0;
                  const isGlobal = globalCourseData && globalCourseData.title === progress.courseTitle;
                  
                  return (
                    <div 
                      key={idx}
                      className="glass-card p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 group"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                          <BookOpen size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{progress.courseTitle}</h4>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                             <div className="flex items-center gap-1">
                               <CheckCircle2 size={14} />
                               <span>{completed} lessons</span>
                             </div>
                             {isGlobal && <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Active</span>}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        className="w-full sm:w-auto btn-secondary text-sm !py-2"
                        onClick={() => navigate(`/roadmap/${encodeURIComponent(progress.courseTitle)}`)}
                      >
                        Continue Learning
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Up Next Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-white mb-6">Up Next</h3>
             <div className="glass-card p-6 rounded-xl">
                {globalCourseData && nextSteps.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                      <div className="w-10 h-10 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <PlayCircle size={20} />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Current Focus</div>
                        <div className="font-semibold text-white line-clamp-1">{globalCourseData.title}</div>
                      </div>
                    </div>

                    <ul className="space-y-4">
                      {nextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`mt-0.5 min-w-[20px] h-5 rounded-full border-2 border-slate-700 flex items-center justify-center ${idx === 0 ? 'border-indigo-500 bg-indigo-500/10' : ''}`}>
                            {idx === 0 && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                          </div>
                          <span className={`text-sm ${idx === 0 ? 'text-white font-medium' : 'text-slate-400'}`}>{step.title}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={() => navigate(`/roadmap/${encodeURIComponent(globalCourseData.title)}`)}
                      className="mt-8 w-full btn-primary flex items-center justify-center gap-2"
                    >
                      Start Lesson <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                   <div className="text-center py-8">
                      <Trophy className="mx-auto text-slate-600 mb-3" size={32} />
                      <p className="text-slate-400 text-sm mb-4">You're all caught up!</p>
                      <button 
                        onClick={() => navigate('/library')}
                        className="text-indigo-400 text-sm hover:underline"
                      >
                        Start a new goal
                      </button>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
