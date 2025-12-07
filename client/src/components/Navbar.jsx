import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, BrainCircuit, Bot, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({});
    navigate("/");
  };

  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };
    window.addEventListener('storage', handleStorage);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <li>
        <Link 
          to={to} 
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive 
              ? "text-white bg-slate-800" 
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-slate-950/80 backdrop-blur-md border-slate-800 py-3" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
            S
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SkillBuddy</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/library" icon={BookOpen} label="Courses" />
          <NavItem to="/quizzes" icon={BrainCircuit} label="Quizzes" />
          <NavItem to="/ai-chat" icon={Bot} label="AI Buddy" />
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user.username ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Hi, <span className="text-slate-200 font-medium">{user.username}</span>
              </span>
              <button
                className="btn-secondary flex items-center gap-2 !px-3 !py-1.5 text-sm"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/signup" className="btn-primary text-sm">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 p-4 flex flex-col gap-4 animate-fade-in">
          <ul className="flex flex-col gap-2">
            <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/library" icon={BookOpen} label="Courses" />
            <NavItem to="/quizzes" icon={BrainCircuit} label="Quizzes" />
            <NavItem to="/ai-chat" icon={Bot} label="AI Buddy" />
          </ul>
          <div className="h-px bg-slate-800 w-full my-2"></div>
          {user.username ? (
            <button
              className="btn-secondary w-full justify-center flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className="btn-secondary text-center">Login</Link>
              <Link to="/signup" className="btn-primary text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
