import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = `${title} | B House`;
  }, [title]);

  const navItems = [
    { name: 'ภาพรวม', path: '/dashboard', icon: 'dashboard' },
    { name: 'รายรับ', path: '/income', icon: 'payments' },
    { name: 'รายจ่าย', path: '/expenses', icon: 'receipt_long' },
    { name: 'คำนวณภาษี', path: '/calculator', icon: 'calculate' },
  ];

  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-950 flex flex-col py-6 px-4 gap-2 border-r border-slate-200/50 dark:border-slate-800/50 z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between gap-3 px-2 mb-8">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-blue-900 dark:text-blue-500 leading-none">B House</h1>
                    <p className="text-[10px] tracking-widest text-slate-500 uppercase mt-1">ร้านค้าคุณแม่</p>
                  </div>
              </div>
              <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50 hover:text-blue-800 dark:hover:text-blue-300'
                    }`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-1 pt-8">
              <button className="w-full bg-primary-container text-white py-3 rounded-xl font-semibold mb-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                <span className="material-symbols-outlined text-sm">add</span>
                New Transaction
              </button>
              <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 rounded-lg transition-all" href="#">
                <span className="material-symbols-outlined">help_outline</span>
                <span>Help Center</span>
              </a>
              <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 rounded-lg transition-all" href="#">
                <span className="material-symbols-outlined">logout</span>
                <span>Sign Out</span>
              </a>
            </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <div className=" flex-1 flex flex-col min-h-screen w-full relative">
        {/* Top Navigation */}
        <header className="w-full sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 h-16 shadow-sm shadow-blue-900/5 border-none">
          <div className="flex items-center gap-2">
              <button className="md:hidden flex items-center justify-center p-2 -ml-2" onClick={() => setIsSidebarOpen(true)}>
                  <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="hidden md:flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full w-96">
                <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
                <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-slate-600" placeholder="Search transactions..." type="text" />
              </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-1 md:gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-blue-900">คุณหญิงวันเพ็ญ</p>
                <p className="text-[10px] text-slate-500">Premium Account</p>
              </div>
              <img alt="User profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_KajGbH9tRuf0tA09Ubir8-p_l2hmiz-6PSykDkTwHUstws-VojFrU-Eq63l6BbF4G4x_ll7SFCwrHsYrMhsVeDT_6CcD6Inp4wp6WNUxlumVkP_z4jn3THBbDLJ8tTl0dyff_W0KNJmsFYhgsQ9JhNeOeQVTUctRx-is3qTP1JpoAJ9yiG40Ul9wN5Z1uY2EnuqPkw6eibZC8r2o1eZR3BO-VdhyBFwLmnx0ZgLPrsYgplVaTBUsvu7qYGAE9hQoakNZkL7z1SO" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 max-w-[1400px] mx-auto w-full flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary-container text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 md:hidden">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}
