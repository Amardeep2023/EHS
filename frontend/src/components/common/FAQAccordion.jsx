import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-luxury luxury-border bg-white overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-8 py-6">
        <h4
          className="font-boska text-2xl text-espresso pr-4"
          style={{ fontFamily: 'Boska, Georgia, serif' }}
        >
          {question}
        </h4>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
        >
          <Plus size={20} className="text-gold" />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              className="px-8 pb-6 ml-8 text-sm leading-relaxed text-secondary"
              style={{ borderLeft: '2px solid #d4a574', marginLeft: '2rem', paddingLeft: '1.5rem' }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQAccordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <FAQItem key={i} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
