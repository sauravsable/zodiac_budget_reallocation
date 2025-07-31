import { usePlatformStore } from "@/utils/zusStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Store } from "lucide-react"; // You can use other icons if needed

const PlatformSwitch = () => {
  const platform = usePlatformStore((state) => state.platform);
  const setPlatform = usePlatformStore((state) => state.setPlatform);

  const platforms = [
    {
      label: "Blinkit",
      icon: <Store className="w-5 h-5 mr-2" />,
      gradient: "from-yellow-400 to-yellow-600",
      ring: "ring-yellow-300/60",
      disabled: false,
    },
    {
      label: "Zepto",
      icon: <Store className="w-5 h-5 mr-2" />,
      gradient: "from-purple-500 to-purple-700",
      ring: "ring-purple-400/60",
      disabled: false,
    },
    {
      label: "Instamart",
      icon: <Store className="w-5 h-5 mr-2" />,
      gradient: "from-orange-400 to-orange-600",
      ring: "ring-orange-400/60",
      disabled: false,
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl backdrop-blur-md">
        {platforms.map(({ label, icon, gradient, ring, disabled }) => {
          const isSelected = platform === label;

          return (
            <motion.button
              key={label}
              disabled={disabled}
              whileTap={{ scale: 0.95 }}
              whileHover={!disabled ? { scale: 1.05 } : {}}
              onClick={() => !disabled && setPlatform(label)}
              className={cn(
                "flex items-center justify-center px-5 py-3 min-w-[9rem] text-sm font-semibold rounded-xl border transition-all duration-300",
                "focus:outline-none",
                disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                isSelected
                  ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg ring-2 ${ring}`
                  : "bg-slate-800/70 text-white border border-white/10 hover:border-white/20 hover:bg-slate-700/80"
              )}
            >
              {icon}
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSwitch;
