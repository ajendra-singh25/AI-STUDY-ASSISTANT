import { motion, AnimatePresence } from "framer-motion";

function DeleteModal({ open, onClose, onConfirm, title }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 50,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 50,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="w-[500px] bg-slate-900 border border-red-500 rounded-3xl p-8 shadow-2xl">

              <h2 className="text-3xl font-bold text-red-400">
                Delete PDF
              </h2>

              <p className="text-slate-300 mt-6">
                Are you sure you want to delete
              </p>

              <p className="text-white font-bold mt-2">
                {title}
              </p>

              <p className="text-red-300 mt-5">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4 mt-10">

                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold"
                >
                  Delete
                </button>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default DeleteModal;