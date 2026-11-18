import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import Modal from './Modal';
import './app-layout.css';

export default function AppLayout() {
  const { user, logout } = useAuth();

  const [account, setAccount] = useState(false);

  const details = useRef(null);
  const trigger = useRef(null);

  // Display role based on backend user information
  const displayRole =
    user.role === 'Admin'
      ? 'Admin'
      : user.isManager
        ? 'Manager'
        : 'Employee';

  useEffect(() => {
    function outside(event) {
      if (!details.current?.contains(event.target)) {
        details.current?.removeAttribute('open');
      }
    }

    document.addEventListener('pointerdown', outside);

    return () => {
      document.removeEventListener('pointerdown', outside);
    };
  }, []);

  function close() {
    details.current?.removeAttribute('open');
  }

  return (
    <div className="hub-app">
      <header className="hub-header">
        <div className="hub-header-inner">

          {/* Logo */}
          <Link className="hub-brand" to="/">
            <span className="hub-brand-mark">
              P
            </span>

            <span>
              Performance
              <span className="hub-brand-light">
                {' '}Hub
              </span>
            </span>
          </Link>

          {/* Header Actions */}
          <div className="hub-header-actions">

            {/* Current User */}
            <div className="hub-user">
              <span
                className="hub-avatar"
                aria-hidden="true"
              >
                {user.fullName
                  .split(/\s+/)
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join('')}
              </span>

              <span>
                <strong>
                  {user.fullName}
                </strong>

                <small>
                  {displayRole}
                </small>
              </span>
            </div>

            {/* Settings */}
            <details
              className="hub-settings"
              ref={details}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  close();
                  trigger.current?.focus();
                }
              }}
            >
              <summary
                ref={trigger}
                aria-label="Settings"
              >
                <Icon name="settings" />

                <span className="hub-settings-label">
                  Settings
                </span>
              </summary>

              <nav
                className="hub-dropdown"
                aria-label="Settings"
              >
                <p className="hub-menu-label">
                  YOUR WORKSPACE
                </p>

                <button
                  onClick={() => {
                    close();
                    setAccount(true);
                  }}
                >
                  My Account
                </button>

                {/* Admin-only navigation */}
                {user.role === 'Admin' && (
                  <>
                    <p className="hub-menu-label">
                      ADMINISTRATION
                    </p>

                    <NavLink
                      to="/admin/users"
                      onClick={close}
                    >
                      User Management
                    </NavLink>

                    <NavLink
                      to="/admin/departments"
                      onClick={close}
                    >
                      Department Management
                    </NavLink>
                  </>
                )}

                <div className="hub-menu-divider" />

                <button onClick={logout}>
                  Logout
                </button>
              </nav>
            </details>

            {/* Logout Button */}
            <button
              className="btn btn-secondary hub-logout"
              onClick={logout}
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="hub-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="hub-footer">
        Performance Hub

        <span>
          People. Progress. Possibility.
        </span>
      </footer>

      {/* My Account Modal */}
      {account && (
        <Modal
          title="My Account"
          onClose={() => setAccount(false)}
        >
          <dl className="hub-account">
            <dt>
              Full name
            </dt>

            <dd>
              {user.fullName}
            </dd>

            <dt>
              Email
            </dt>

            <dd>
              {user.email}
            </dd>

            <dt>
              Role
            </dt>

            <dd>
              {displayRole}
            </dd>
          </dl>

          <p className="muted-text">
            Contact your administrator to update
            your account details.
          </p>
        </Modal>
      )}
    </div>
  );
}