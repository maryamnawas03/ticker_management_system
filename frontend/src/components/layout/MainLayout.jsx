import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * MainLayout — Root layout for all authenticated pages
 *
 * Structure:
 *   <aside> Sidebar (fixed left)
 *   <div>   Navbar (top) + <main> page content (scrollable)
 */

const pageTitles = {
  '/dashboard':    'Dashboard',
  '/tickets':      'Tickets',
  '/tickets/new':  'Create Ticket',
  '/users':        'User Management',
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'TicketFlow';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="main-content">
        <Navbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="page-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
