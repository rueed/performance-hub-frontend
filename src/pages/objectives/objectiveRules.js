// Shared rules for the objective forms (used by the page and by the list).
export const MIN_OBJECTIVES = 3;

export const emptySlot = {
  id: null,
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  added: false, // true after the Add button: it will be part of the submission
};

// "2026-11-15T00:00:00" -> "2026-11-15" (what <input type="date"> expects)
export function toDateInput(value) {
  return value ? value.slice(0, 10) : '';
}

// Returns an error message, or '' when the objective is valid.
export function validateSlot(slot) {
  if (!slot.title.trim()) return 'Title is required';
  if (!slot.startDate || !slot.endDate) {
    return 'Start date and end date are required';
  }
  // "YYYY-MM-DD" strings compare correctly as plain text
  if (slot.endDate <= slot.startDate) {
    return 'End date must be after the start date';
  }
  return '';
}

// The shape the backend expects (a full UTC date-time).
export function toPayload(slot) {
  return {
    title: slot.title.trim(),
    description: slot.description.trim(),
    startDate: `${slot.startDate}T00:00:00Z`,
    endDate: `${slot.endDate}T00:00:00Z`,
  };
}