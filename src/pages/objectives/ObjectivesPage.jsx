import { useEffect, useState } from 'react';
import {
  getMyObjectives,
  createObjective,
  updateObjective,
  submitDrafts,
  submitObjective,
  updateProgress,
} from '../../api/objectivesApi';
import ObjectiveSlot from './ObjectiveSlot';
import ObjectivesList from './ObjectivesList';
import {
  MIN_OBJECTIVES,
  emptySlot,
  toDateInput,
  validateSlot,
  toPayload,
} from './objectiveRules';
import './objectives.css';

// Saved drafts fill the first cards, and there are always at least 3 cards.
function buildSlots(objectives) {
  const slots = objectives
    .filter((o) => o.status === 'Draft')
    .sort((a, b) => a.id - b.id)
    .map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description ?? '',
      startDate: toDateInput(o.startDate),
      endDate: toDateInput(o.endDate),
      added: false,
    }));

  while (slots.length < MIN_OBJECTIVES) {
    slots.push({ ...emptySlot });
  }
  return slots;
}

function ObjectivesPage() {
  const [objectives, setObjectives] = useState([]);
  const [slots, setSlots] = useState(buildSlots([]));
  const [slotErrors, setSlotErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Once something was submitted, the page becomes "My Objectives" (no forms).
  const hasSubmitted = objectives.some((o) => o.status !== 'Draft');
  const addedCount = slots.filter((s) => s.added).length;

  async function loadObjectives() {
    try {
      const data = await getMyObjectives();
      setObjectives(data);
      setSlots(buildSlots(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // loading the data once when the page opens is a normal use of an effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadObjectives();
  }, []);

  function updateSlot(index, next) {
    setSlots((current) => current.map((s, i) => (i === index ? next : s)));
  }

  function setSlotError(index, message) {
    setSlotErrors((current) => {
      const next = { ...current };
      if (message) next[index] = message;
      else delete next[index];
      return next;
    });
  }

  // "+ New card": one more empty card (there is no maximum)
  function addSlot() {
    setSlots((current) => [...current, { ...emptySlot }]);
  }

  // Only extra cards that were never saved can be removed
  function removeSlot(index) {
    setSlots((current) => current.filter((_, i) => i !== index));
    setSlotErrors({});
  }

  // Add (on a card): check it, then mark it as part of the submission
  function handleAdd(index) {
    setError('');
    setNotice('');
    const message = validateSlot(slots[index]);
    setSlotError(index, message);
    if (message) return;
    updateSlot(index, { ...slots[index], added: true });
  }

  // Save Draft (on a card): save only this card as a draft.
  // It is NOT part of the submission.
  async function handleSaveDraft(index) {
    setError('');
    setNotice('');
    const slot = slots[index];
    const message = validateSlot(slot);
    setSlotError(index, message);
    if (message) return;

    setBusy(true);
    try {
      const saved = slot.id
        ? await updateObjective(slot.id, toPayload(slot))
        : await createObjective(toPayload(slot));
      updateSlot(index, { ...slot, id: saved.id, added: false });
      setNotice('Draft saved.');
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  // Submit for approval: send every card that has "Added" (at least 3).
  async function handleSubmitAll() {
    setError('');
    setNotice('');

    const added = slots.filter((s) => s.added);
    if (added.length < MIN_OBJECTIVES) {
      setError(
        `Add at least ${MIN_OBJECTIVES} objectives first (press Add on each card). Added so far: ${added.length}`
      );
      return;
    }

    if (
      !window.confirm(
        `Submit ${added.length} objectives? After you submit, you cannot add new objectives.`
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      // 1) save every added card as a draft, 2) then send them together
      const ids = [];
      for (const slot of added) {
        const saved = slot.id
          ? await updateObjective(slot.id, toPayload(slot))
          : await createObjective(toPayload(slot));
        ids.push(saved.id);
      }
      await submitDrafts(ids);
      setNotice('Your objectives were sent for approval.');
    } catch (err) {
      setError(err.message);
    }
    await loadObjectives();
    setBusy(false);
  }

  async function handleProgress(id, progress) {
    setError('');
    setNotice('');
    try {
      await updateProgress(id, progress);
      await loadObjectives();
    } catch (err) {
      setError(err.message);
    }
  }

  // A rejected objective: save the changes, then send it again.
  // Returns true when it worked, so the card can close its edit form.
  async function handleResubmit(id, data) {
    setError('');
    setNotice('');
    try {
      await updateObjective(id, data);
      await submitObjective(id);
      await loadObjectives();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  return (
    <div className="objectives-page">
      <h1>
        {loading ? 'Objectives' : hasSubmitted ? 'My Objectives' : 'Submit objectives'}
      </h1>

      {error && <p className="error">{error}</p>}
      {notice && <p className="notice">{notice}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : hasSubmitted ? (
        <ObjectivesList
          objectives={objectives}
          onProgress={handleProgress}
          onResubmit={handleResubmit}
        />
      ) : (
        <>
          <p className="muted">
            Fill in at least {MIN_OBJECTIVES} objectives and press Add on each one.
            You can add as many as you need. You cannot add more after submitting.
          </p>

          <div className="slots-grid">
            {slots.map((slot, index) => (
              <ObjectiveSlot
                key={index}
                heading={`Objective ${index + 1}`}
                hint="Add it to your submission, or save it as a draft for later."
                badge={slot.id ? 'Draft' : ''}
                value={slot}
                error={slotErrors[index]}
                disabled={busy}
                onChange={(next) => updateSlot(index, next)}
                onAdd={() => handleAdd(index)}
                onSaveDraft={() => handleSaveDraft(index)}
                onRemove={
                  index >= MIN_OBJECTIVES && !slot.id
                    ? () => removeSlot(index)
                    : undefined
                }
              />
            ))}
          </div>

          <div className="submit-bar">
            <p className="muted">
              {addedCount} added (at least {MIN_OBJECTIVES} needed)
            </p>
            <div className="form-actions">
              <button className="btn-secondary" disabled={busy} onClick={addSlot}>
                + New Objective
              </button>
              <button className="btn-primary" disabled={busy} onClick={handleSubmitAll}>
                {busy ? 'Working...' : 'Submit for approval'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ObjectivesPage;