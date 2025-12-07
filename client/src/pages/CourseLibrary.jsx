import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { API_BASE_URL } from '../config';

const CourseLibrary = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const groupedCourses = courses.reduce((acc, course) => {
    acc[course.category] = acc[course.category] || [];
    acc[course.category].push(course);
    return acc;
  }, {});

  const categories = Object.keys(groupedCourses).sort();

  const filterCourses = (courseList) =>
    courseList.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.category.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Course Library</h1>
            <p className="text-slate-400">Browse our curated collection of technical courses.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex bg-slate-900 rounded-lg border border-slate-800 p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-16">
          {categories.map((category) => {
            const filtered = filterCourses(groupedCourses[category]);
            if (filtered.length === 0) return null;
            
            return (
              <section key={category}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-white">{category}</h2>
                  <div className="h-px flex-1 bg-slate-800"></div>
                </div>
                
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                  {filtered.map((course) => (
                    <motion.div 
                      key={course._id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`glass-card group cursor-pointer ${
                        viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-6 flex flex-col'
                      }`}
                      onClick={() => navigate(`/roadmap/${encodeURIComponent(course.title)}`)}
                    >
                      <div className={`shrink-0 w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-4 ${viewMode === 'list' ? 'mb-0' : ''}`}>
                        <BookOpen size={24} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                        <p className={`text-slate-400 text-sm leading-relaxed ${viewMode === 'grid' ? 'line-clamp-2 mb-4' : 'line-clamp-1'}`}>
                          {course.description}
                        </p>
                      </div>

                      <div className={viewMode === 'list' ? '' : 'mt-auto pt-4 border-t border-slate-800'}>
                         <span className="text-xs font-medium text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                           View Roadmap <ChevronRight size={14} />
                         </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseLibrary;
