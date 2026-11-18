import { useEffect, useRef } from 'react';
export default function Modal({ title, onClose, busy, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus(); };
  }, []);
  return <dialog className="hub-modal" ref={ref} aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="hub-modal-heading"><h2 id="modal-title">{title}</h2><button className="btn btn-secondary" type="button" onClick={onClose} disabled={busy} aria-label="Close dialog">×</button></div>
    {children}
  </dialog>;
}
