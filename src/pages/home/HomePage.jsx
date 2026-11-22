import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon';
import './home.css';

// destination: where "Open ..." goes. null = not integrated yet.
const services = [
  {
    name: 'Performance',
    icon: 'performance',
    description:
      'Manage objectives, track progress, and access performance evaluations.',
    destination: '/performance',
  },
  {
    name: 'Timesheet',
    icon: 'time',
    description:
      'Track and manage working hours and timesheet activities.',
    destination: '/timesheet',
  },
];

export default function HomePage() {
  const { user } = useAuth();

  // Display Manager for employees with active direct reports.
  const displayRole =
    user.role === 'Admin'
      ? 'Admin'
      : user.isManager
        ? 'Manager'
        : 'Employee';

  return (
    <>
      {/* Welcome Section */}
      <section className="home-welcome">
        <div>
          <p className="home-eyebrow">
            YOUR WORKSPACE
          </p>

          <h1>
            Welcome back, {user.fullName}
          </h1>

          <p className="muted-text">
            A fresh perspective. A step forward.
            Everything you need to make progress.
          </p>

          <span className="home-role">
            {displayRole}
          </span>
        </div>

        <div
          className="home-art"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      {/* Services Section */}
      <section aria-labelledby="services-title">
        <div className="home-section-heading">
          <div>
            <h2 id="services-title">
              Available Services
            </h2>

            <p className="muted-text">
              Your tools for a more productive day.
            </p>
          </div>

          <span className="home-section-meta">
            ONE WORKSPACE. MORE POSSIBILITY.
          </span>
        </div>

        <div className="home-services">
          {services.map((service) => (
            <article
              className={`card home-service home-service-${service.icon}`}
              key={service.name}
            >
              <div className="home-service-top">
                <span className="home-service-icon">
                  <Icon
                    name={service.icon}
                    size={30}
                  />
                </span>

                {!service.destination && (
                  <span className="home-coming">
                    Coming soon
                  </span>
                )}
              </div>

              <h3>
                {service.name}
              </h3>

              <p className="muted-text">
                {service.description}
              </p>

              {service.destination ? (
                <Link
                  className="btn btn-secondary home-service-action"
                  to={service.destination}
                >
                  Open {service.name}

                  <Icon
                    name="arrow"
                    size={18}
                  />
                </Link>
              ) : (
                <>
                  <button
                    className="btn btn-secondary home-service-action"
                    disabled
                    aria-describedby={`service-${service.icon}-status`}
                  >
                    Open {service.name}

                    <Icon
                      name="arrow"
                      size={18}
                    />
                  </button>

                  <small
                    id={`service-${service.icon}-status`}
                    className="muted-text"
                  >
                    This service will be available once integrated.
                  </small>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Note */}
      <aside className="home-note">
        <span
          className="home-note-dot"
          aria-hidden="true"
        />

        <p>
          Your workspace, connected.

          <span className="muted-text">
            {' '}
            A shared starting point for every team member.
          </span>
        </p>
      </aside>
    </>
  );
}
