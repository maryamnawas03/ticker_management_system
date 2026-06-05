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

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} />
        <main className="page-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
