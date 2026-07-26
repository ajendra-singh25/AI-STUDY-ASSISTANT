import{motion} from "framer-motion";
function FeatureCard({ icon, title, description }) {
  return (
   <motion.div
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  whileHover={{
    y: -15,
    scale: 1.05,
  }}
  className="
    w-72
    rounded-3xl
    border
    border-cyan-500/20
    bg-white/5
    backdrop-blur-xl
    p-6
    transition-all
    duration-300
    shadow-lg
    hover:shadow-cyan-500/30
    hover:shadow-2xl
  "
>
      <div
  className="
  text-cyan-400
  text-5xl
  w-16
  h-16
  flex
  items-center
  justify-center
  rounded-2xl
  bg-cyan-500/10
"
>
        {icon}
      </div>

      <h2 className="text-2xl font-bold mt-6 text-white">
  {title}
</h2>
<p className="mt-3 text-slate-300">
  {description}
</p>
    </motion.div>
  );
}

export default FeatureCard;