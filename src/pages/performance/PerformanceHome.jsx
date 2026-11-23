import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyObjectives } from '../../api/objectivesApi';

// The landing page of the Performance module: one card per thing the user can do.
export default function PerformanceHome() {
  const { user } = useAuth();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // The first card changes its name once the user submitted his objectives.
  useEffect(() => {
    async function check() {
      try {
        const mine = await getMyObjectives();
        setHasSubmitted(mine.some((o) => o.status !== 'Draft'));
      } catch {
        // if it fails, the card keeps its default name
      }
    }
    check();
  }, []);

  const cards = [
    {
      title: hasSubmitted ? 'My Objectives' : 'Submit objectives',
      text: hasSubmitted
        ? 'Follow the progress of your objectives.'
        : 'Create at least 3 objectives and send them for approval.',
      to: '/performance/objectives',
      show: true, // everyone
    },
    {
      title: 'My team',
      text: 'See the employees under your responsibility and their objectives.',
      to: '/performance/my-team',
      show: user.isManager, // managers only
    },
    {
      title: 'All employees',
      text: 'See every employee and the status of their objectives (read only).',
      to: '/performance/employees',
      show: user.role === 'Admin', // HR (Admin role) only
    },
  ].filter((card) => card.show);

  return (
    <section className="perf-cards">
      {cards.map((card) => (
        <Link key={card.title} to={card.to} className="perf-card">
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <span className="perf-card-go">Open →</span>
        </Link>
      ))}
    </section>
  );
}