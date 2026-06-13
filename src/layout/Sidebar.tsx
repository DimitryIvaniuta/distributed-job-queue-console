import { NavLink } from 'react-router';
import { NAVIGATION } from './navigation';

/** Professional banking sidebar with URL-aware navigation. */
export function Sidebar(): React.JSX.Element {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand-card">
        <div className="brand-mark" aria-hidden="true">
          JQ
        </div>
        <div>
          <strong>QueueOps</strong>
          <span>Control Center</span>
        </div>
      </div>
      <nav className="nav-stack">
        {NAVIGATION.map((item) => (
          <NavLink className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} end={item.path === '/'} key={item.id} to={item.path}>
            <span>{item.label}</span>
            <small>{item.description}</small>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
