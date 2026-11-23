import ObjectiveSlot from './ObjectiveSlot';
import { toDateInput } from './objectiveRules';

// One submitted objective: the same card as the "Submit objectives" page, but read only.
// The status is shown once, next to the page title.
function ObjectiveCard({ objective }) {
  const value = {
    id: objective.id,
    title: objective.title,
    description: objective.description || '',
    startDate: toDateInput(objective.startDate),
    endDate: toDateInput(objective.endDate),
  };

  return (
    <ObjectiveSlot heading="Objective" value={value} disabled onChange={() => {}} />
  );
}

function ObjectivesList({ objectives }) {
  const sorted = [...objectives].sort((a, b) => a.id - b.id);

  return (
    <div className="slots-grid">
      {sorted.map((objective) => (
        <ObjectiveCard key={objective.id} objective={objective} />
      ))}
    </div>
  );
}

export default ObjectivesList;