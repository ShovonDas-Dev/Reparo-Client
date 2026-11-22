import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";

// One small card that shows a single number on the overview page.
type StatCardProps = {
  label: string;
  value: string | number;
  hint: string;
};

// Follows the parent page reveal without starting its own.
const card: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <motion.div variants={card} className="rounded-xl border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </motion.div>
  );
}
