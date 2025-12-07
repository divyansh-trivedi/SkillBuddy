import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Target, 
  Users, 
  ShieldCheck,
  Brain,
  Code2,
  Terminal
} from "lucide-react";

const features = [
  {
    icon: <Target className="w-6 h-6 text-indigo-400" />,
    title: "Personalised Roadmaps",
    desc: "Adaptive learning paths that evolve with your progress and goals.",
  },
  {
    icon: <Brain className="w-6 h-6 text-violet-400" />,
    title: "AI Mentor Chat",
    desc: "24/7 intelligent assistance to unblock you instantly.",
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Skill Progress Tracker",
    desc: "Real-time analytics to visualize your mastery of concepts.",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
    title: "Real-Time Quizzes",
    desc: "Interactive assessments to reinforce your knowledge immediately.",
  },
  {
    icon: <Code2 className="w-6 h-6 text-cyan-400" />,
    title: "Project Based Learning",
    desc: "Build real-world projects to validate your skills.",
  },
  {
    icon: <Users className="w-6 h-6 text-rose-400" />,
    title: "Community Driven",
    desc: "Connect with peers and mentors in a collaborative environment.",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-sm mb-8">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-300 tracking-wide uppercase">The Future of EdTech</span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Master Tech Skills with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                <Typewriter
                  options={{
                    strings: ["AI Mentorship.", "Adaptive Roadmaps.", "Smart Quizzes.", "SkillBuddy."],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                  }}
                />
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Your personalized AI learning companion. Get structured roadmaps, instant feedback, and master any technology faster.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-primary text-lg px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/library" className="btn-secondary text-lg px-8 py-3 w-full sm:w-auto">
                Explore Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      {/* <section className="border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto py-12 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[
                { label: "Active Learners", value: "10k+" },
                { label: "Courses", value: "500+" },
                { label: "Quizzes Taken", value: "1M+" },
                { label: "AI Interactions", value: "24/7" },
             ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                   <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
                   <span className="text-slate-500 text-sm font-medium tracking-wider uppercase">{stat.label}</span>
                </div>
             ))}
          </div>
        </div>
      </section> */}

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 relative z-10 bg-slate-950 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Everything you need to <span className="text-indigo-400">excel</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">We combine proven learning methodologies with cutting-edge AI to create the ultimate learning experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <motion.div
                key={idx}
                className="glass-card p-8 rounded-2xl group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-800">
                   {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/10 z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to start your adventure?</h2>
          <p className="text-lg text-slate-400 mb-10">
            Join thousands of developers who are learning faster and smarter with SkillBuddy.
          </p>
          <Link
            to="/signup"
            className="btn-primary text-lg px-10 py-4 inline-block shadow-2xl shadow-indigo-500/30"
          >
            Join SkillBuddy for Free
          </Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-slate-900 bg-slate-950 text-slate-500 text-center text-sm">
         <div className="flex justify-center items-center gap-2 mb-8 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">S</div>
             <span className="text-lg font-bold text-slate-200">SkillBuddy</span>
         </div>
         <div className="flex justify-center gap-8 mb-8 font-medium">
             <Link to="/library" className="hover:text-indigo-400 transition-colors">Courses</Link>
             <Link to="/quizzes" className="hover:text-indigo-400 transition-colors">Quizzes</Link>
             <Link to="/about" className="hover:text-indigo-400 transition-colors">About</Link>
             <Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link>
         </div>
         <p>&copy; {new Date().getFullYear()} SkillBuddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Features;
