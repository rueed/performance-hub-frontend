import { useEffect, useState } from 'react';
import {
  getMyObjectives,
  createObjective,
  updateObjective,
  submitDrafts,
  resubmitRejected,
} from '../../api/objectivesApi';
import ObjectiveSlot from './ObjectiveSlot';
import ObjectivesList from './ObjectivesList';
import {
  MIN_OBJECTIVES,
  emptySlot,
  isBlank,
  toDateInput,
  validateSlot,
  toPayload,
} from './objectiveRules';
import './objectives.css';

const STATUS_LABELS = {
  PendingApproval: 'Pending approval',
  Approved: 'Approved',
  Rejected: 'Rejected',
  InProgress: 'In progress',
  Completed: 'Completed',
};

// an objective from the API -> a card the user can edit
function toSlot(objective) {
  return {
    id: objective.id,
    title: objective.title,
    description: objective.description || '',
    startDate: toDateInput(objective.startDate),
    endDate: toDateInput(objective.endDate),
  };
}

// saved drafts first, then empty cards until there are at least 3
function buildSlots(objectives) {
  const slots = objectives.filter((o) => o.status === 'Draft').map(toSlot);
  while (slots.length < MIN_OBJECTIVES) slots.push({ ...emptySlot });
  return slots;
}

// One status for the whole set (the objectives are decided together)
function overallStatus(objectives) {
  const submitted = objectives.filter((o) => o.status !== 'Draft');
  if (submitted.length === 0) return null;
  for (const status of ['Rejected', 'PendingApproval', 'Approved']) {
    if (submitted.some((o) => o.status === status)) return status;
  }
  return submitted[0].status;
}

function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]);
  const [slots, setSlots] = useState([]);
  const [editSlots, setEditSlots] = useState(null); // not null = editing the rejected objectives
  const [slotErrors, setSlotErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const hasSubmitted = objectives.some((o) => o.status !== 'Draft');
  const rejected = objectives.filter((o) => o.status === 'Rejected');
  const status = overallStatus(objectives);

  async function load() {
    try {
      const list = await getMyObjectives();
      setObjectives(list);
      setSlots(buildSlots(list));
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load your objectives.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function changeSlot(index, value) {
    setSlots((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function changeEditSlot(index, value) {
    setEditSlots((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function addSlot() {
    setSlots((prev) => [...prev, { ...emptySlot }]);
  }

  function removeSlot(index) {
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setSlotErrors({});
  }

  // checks every card, shows the errors, returns true when all are fine
  function validateAll(list) {
    const errors = {};
    list.forEach((slot, index) => {
      const message = validateSlot(slot);
      if (message) errors[index] = message;
    });
    setSlotErrors(errors);
    return Object.keys(errors).length === 0;
  }

  // Save Draft: saves every card that has something written, nothing is sent
  async function handleSaveDraft() {
    setNotice('');
    setError('');

    if (slots.every(isBlank)) {
      setError('Write at least one objective first.');
      return;
    }

    const errors = {};
    slots.forEach((slot, index) => {
      if (isBlank(slot)) return;
      const message = validateSlot(slot);
      if (message) errors[index] = message;
    });
    setSlotErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setBusy(true);
    const next = [...slots];
    try {
      for (let i = 0; i < slots.length; i += 1) {
        const slot = slots[i];
        if (isBlank(slot)) continue;
        if (slot.id) {
          await updateObjective(slot.id, toPayload(slot));
        } else {
          const created = await createObjective(toPayload(slot));
          next[i] = { ...slot, id: created.id };
        }
      }
      setNotice('Draft saved. You can come back and finish it later.');
    } catch (err) {
      setError(err.message || 'Could not save the draft.');
    } finally {
      setSlots(next);
      setBusy(false);
    }
  }

  // Submit for approval: saves every card, then sends all of them together
  async function handleSubmitAll() {
    setNotice('');
    setError('');

    if (!validateAll(slots)) return;

    const ok = window.confirm(
      `Send ${slots.length} objectives to your manager? You will not be able to add new objectives after this.`
    );
    if (!ok) return;

    setBusy(true);
    const next = [...slots];
    try {
      const ids = [];
      for (let i = 0; i < slots.length; i += 1) {
        const slot = slots[i];
        if (slot.id) {
          await updateObjective(slot.id, toPayload(slot));
          ids.push(slot.id);
        } else {
          const created = await createObjective(toPayload(slot));
          next[i] = { ...slot, id: created.id };
          ids.push(created.id);
        }
      }
      await submitDrafts(ids);
      await load();
    } catch (err) {
      setSlots(next);
      setError(err.message || 'Could not submit your objectives.');
    } finally {
      setBusy(false);
    }
  }

  function startEdit() {
    setSlotErrors({});
    setNotice('');
    setEditSlots(rejected.map(toSlot));
  }

  function cancelEdit() {
    setEditSlots(null);
    setSlotErrors({});
  }

  // After a rejection: saves the changes of every card, then sends them all again
  async function handleResubmitAll() {
    setError('');
    if (!validateAll(editSlots)) return;

    const ok = window.confirm('Send all your objectives to your manager again?');
    if (!ok) return;

    setBusy(true);
    try {
      for (const slot of editSlots) {
        await updateObjective(slot.id, toPayload(slot));
      }
      await resubmitRejected();
      setEditSlots(null);
      await load();
    } catch (err) {
      setError(err.message || 'Could not resubmit your objectives.');
    } finally {
      setBusy(false);
    }
  }

  let title = 'Submit objectives';
  if (loading) title = 'Objectives';
  else if (hasSubmitted) title = 'My Objectives';

  return (
    <div className="objectives-page">
      <div className="title-row">
        <h1>{title}</h1>
        {!loading && editSlots === null && status && (
          <span className={`badge badge-${status}`}>
            {STATUS_LABELS[status] || status}
          </span>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {notice && <p className="notice">{notice}</p>}
      {loading && <p className="muted">Loading...</p>}

      {/* 1) submitted: the list (and a banner when the manager rejected them) */}
      {!loading && hasSubmitted && editSlots === null && (
        <>
          {rejected.length > 0 && (
            <div className="card reject-banner">
              <div>
                <strong>Your manager sent your objectives back.</strong>
                <p className="muted">
                  Reason: {rejected[0].rejectionReason || 'No reason was written.'}
                </p>
              </div>
              <button type="button" disabled={busy} onClick={startEdit}>
                Edit and resubmit
              </button>
            </div>
          )}
          <ObjectivesList objectives={objectives} />
        </>
      )}

      {/* 2) editing the rejected objectives, all together */}
      {!loading && hasSubmitted && editSlots !== null && (
        <>
          <p className="muted">
            Change what your manager asked for, then send all your objectives again together.
          </p>
          <div className="slots-grid">
            {editSlots.map((slot, index) => (
              <ObjectiveSlot
                key={slot.id}
                heading="Objective"
                value={slot}
                error={slotErrors[index]}
                disabled={busy}
                onChange={(value) => changeEditSlot(index, value)}
              />
            ))}
          </div>
          <div className="card submit-bar">
            <span className="muted">{editSlots.length} objectives</span>
            <div className="bar-buttons">
              <button
                type="button"
                className="btn-outline"
                disabled={busy}
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button type="button" disabled={busy} onClick={handleResubmitAll}>
                Resubmit for approval
              </button>
            </div>
          </div>
        </>
      )}

      {/* 3) not submitted yet: the cards + one bar with all the buttons */}
      {!loading && !hasSubmitted && (
        <>
          <p className="muted">
            Write at least {MIN_OBJECTIVES} objectives and send them all together for approval.
            You can save a draft and come back later.
          </p>
          <div className="slots-grid">
            {slots.map((slot, index) => (
              <ObjectiveSlot
                key={slot.id ?? `new-${index}`}
                heading="Objective"
                value={slot}
                error={slotErrors[index]}
                disabled={busy}
                onChange={(value) => changeSlot(index, value)}
                onRemove={
                  index >= MIN_OBJECTIVES && !slot.id
                    ? () => removeSlot(index)
                    : undefined
                }
              />
            ))}
          </div>
          <div className="card submit-bar">
            <span className="muted">
              {slots.length} objectives (at least {MIN_OBJECTIVES})
            </span>
            <div className="bar-buttons">
              <button
                type="button"
                className="btn-outline"
                disabled={busy}
                onClick={addSlot}
              >
                + New objective
              </button>
              <button
                type="button"
                className="btn-outline"
                disabled={busy}
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>
              <button type="button" disabled={busy} onClick={handleSubmitAll}>
                Submit for approval
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ObjectivesPage;