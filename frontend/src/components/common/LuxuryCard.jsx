import { motion } from 'framer-motion';

export default function LuxuryCard({ icon: Icon, iconBg = '#2a2219', title, description, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -8, backgroundColor: '#ffffff' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`p-12 rounded-luxury luxury-border cursor-default ${className}`}
      style={{
        background: 'rgba(255,255,255,0.4)',
        boxShadow: '0 0 0 rgba(42,34,25,0)',
      }}
      whileHover_boxShadow="0 25px 50px rgba(42,34,25,0.05)"
    >
      {Icon && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
          style={{ background: iconBg }}
        >
          <Icon size={22} color={iconBg === '#2a2219' ? '#d4a574' : '#faf8f3'} />
        </motion.div>
      )}
      <h3
        className="font-boska text-2xl text-espresso mb-3"
        style={{ fontFamily: 'Boska, Georgia, serif' }}
      >
        {title}
      </h3>
      <p className="text-sm text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}
