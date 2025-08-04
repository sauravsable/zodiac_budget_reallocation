import { useBrandStore, usePlatformStore } from "@/utils/zusStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Store } from "lucide-react";

const PlatformSwitch = () => {
  const platform = usePlatformStore((state) => state.platform);
  const setPlatform = usePlatformStore((state) => state.setPlatform);
  const setSelectedBrand = useBrandStore((state) => state.setSelectedBrand);

  const handlePlatformChange = (label: string) => {
    setSelectedBrand("");
    setPlatform(label);
  };

  const platforms = [
    {
      label: "Blinkit",
      icon: <Store className="w-5 h-5 mr-2" />,
      gradient: "from-yellow-400 to-yellow-600",
      ring: "ring-yellow-400/60",
      glow: "shadow-yellow-400/40",
    },
    {
      label: "Zepto",
      icon: <Store className="w-5 h-5 mr-2" />,
      gradient: "from-purple-500 to-purple-700",
      ring: "ring-purple-500/60",
      glow: "shadow-purple-400/40",
    },
    {
      label: "Instamart",
      icon: <Store className="w-5 h-5 mr-2" />,
      gradient: "from-orange-400 to-orange-600",
      ring: "ring-orange-400/60",
      glow: "shadow-orange-400/40",
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-wrap items-center gap-6"
      >
        {platforms.map(({ label, icon, gradient, ring, glow }) => {
          const isSelected = platform === label;
          const buttonClass = isSelected
            ? `bg-gradient-to-r ${gradient} text-white border-transparent ring-2 ${ring} shadow-2xl ${glow}`
            : `bg-gray-200 text-gray-800 border border-gray-300 hover:brightness-105 hover:shadow-md`;

          return (
            <motion.button
              key={label}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => handlePlatformChange(label)}
              className={cn(
                "relative flex items-center justify-center px-7 py-3 min-w-[11rem] text-base font-semibold rounded-full border transition-all duration-300 overflow-hidden",
                "focus:outline-none group",
                buttonClass
              )}
            >
              <span className="relative z-10 flex items-center">
                {icon}
                {label}
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                className="absolute inset-0 bg-white/20 rounded-full"
              />
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.2, scale: 1.5 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-white/10"
                />
              )}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: isSelected ? `0 0 20px 4px rgba(255,255,255,0.15)` : "none" }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default PlatformSwitch;
