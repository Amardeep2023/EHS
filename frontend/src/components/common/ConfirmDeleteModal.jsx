import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, itemName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white rounded-luxury p-8 shadow-xl max-w-sm w-full"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
          >
            <h2 className="font-boska text-xl text-espresso mb-4">Delete {itemName}?</h2>
            <p className="text-secondary mb-6">Are you sure you want to delete this? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-full bg-cream text-espresso hover:bg-gold transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
