import { usePlatformStore } from "@/utils/zusStore";

const PlatformSwitch = () => {
  const platform = usePlatformStore((state) => state.platform);
  const setPlatform = usePlatformStore((state) => state.setPlatform);
  const platforms = [
    {
      label: "Blinkit",
      bgClass: "bg-yellow-600",
      disabled: false,
    },
    {
      label: "Zepto",
      bgClass: "bg-purple-600",
      disabled: false,
    },
    {
      label: "Instamart",
      bgClass: "bg-orange-600",
      disabled: true,
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {platforms.map(({ label, bgClass, disabled }) => {
            const isSelected = platform === label;

            return (
              <div
                key={label}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!disabled) {
                    setPlatform(label);
                  }
                }}
                onKeyPress={(e) => e.key === "Enter" && !disabled && setPlatform(label)}
                className={`px-4 py-1.5 text-sm font-medium border transition-all duration-200 rounded-md
                    ${isSelected
                      ? `${bgClass} text-white border-transparent`
                      : "bg-slate-800 text-white border border-white/20 hover:border-white/40 hover:bg-slate-700"
                    } ${!disabled ? "cursor-pointer" : "cursor-not-allowed"}
                    `}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlatformSwitch;
