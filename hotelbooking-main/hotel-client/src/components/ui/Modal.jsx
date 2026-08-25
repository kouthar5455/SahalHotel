// Generic centered dialog. `open` controls mount/unmount, `onClose` is called
// when the backdrop or close button is clicked, `children` is the body content.
export default function Modal({ open, onClose, title, children }) {
  // Render nothing while closed instead of hiding with CSS, so it stays out of the DOM/tab order.
  if (!open) return null

  return (
    // Full-screen backdrop; clicking it triggers onClose (click-outside-to-dismiss).
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6" onClick={onClose}>
      {/* stopPropagation keeps clicks inside the dialog from bubbling up to the backdrop and closing it */}
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink/50 hover:bg-ink/5"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
