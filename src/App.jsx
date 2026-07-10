import { usePortal } from './hooks/usePortal';
import Navbar from './components/layout/Navbar';
import HomeView from './components/views/HomeView';
import AboutView from './components/views/AboutView';
import TeamView from './components/views/TeamView';
import OverviewView from './components/views/OverviewView';
import MethodologyView from './components/views/MethodologyView';
import AdminView from './components/views/AdminView';
import PortalView from './components/views/PortalView';

export default function App() {
  const { state } = usePortal();

  return (
    <>
      <Navbar />
      {state.view === 'home' && <HomeView />}
      {state.view === 'about' && <AboutView />}
      {state.view === 'team' && <TeamView />}
      {state.view === 'overview' && <OverviewView />}
      {state.view === 'methodology' && <MethodologyView />}
      {state.view === 'admin' && <AdminView />}
      {state.view === 'portal' && <PortalView />}
    </>
  );
}
