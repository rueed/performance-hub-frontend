// Rules shared by the objectives pages.
export const MIN_OBJECTIVES = 3;

export const emptySlot = {
  id: null,
  title: '',
  description: '',
  startDate: '',
  endDate: '',
};

// the backend sends dates like 2026-11-25T00:00:00Z, the date input needs 2026-11-25
export function toDateInput(value) {
  return value ? String(value).slice(0, 10) : '';
}

// a card the user did not write anything in
export function isBlank(slot) {
  return (
    !slot.title.trim() &&
    !slot.description.trim() &&
    !slot.startDate &&
    !slot.endDate
  );
}

// returns an error message, or '' when the card is fine
export function validateSlot(slot) {
  if (!slot.title.trim()) return 'Please write a title.';
  if (!slot.startDate || !slot.endDate) return 'Please choose the start and end dates.';
  if (slot.endDate <= slot.startDate) return 'The end date must be after the start date.';
  return '';
}

// the shape the API expects
export function toPayload(slot) {
  return {
    title: slot.title.trim(),
    description: slot.description.trim(),
    startDate: `${slot.startDate}T00:00:00Z`,
    endDate: `${slot.endDate}T00:00:00Z`,
  };
}