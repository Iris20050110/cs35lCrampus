export default function SpotCard({ spot }) {
  const {
    name,
    imageUrl,
    hours = {},
    tags = [],
    rating = 0,
    reviews = 0,
    location = "",
  } = spot;

  const isCurrentlyOpen = () => {
    if (!hours?.open || !hours?.close) return false;

    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const parseTime = (timeStr) => {
        const timeRegex = /(\d+)(?::(\d+))?\s*(am|pm)/i;
        const match = timeStr.match(timeRegex);
        if (!match) return null;

        let [_, hours, minutes, period] = match;
        hours = parseInt(hours, 10);
        minutes = minutes ? parseInt(minutes, 10) : 0;

        if (period.toLowerCase() === "pm" && hours < 12) {
          hours += 12;
        } else if (period.toLowerCase() === "am" && hours === 12) {
          hours = 0;
        }

        return { hours, minutes };
      };

      const openTime = parseTime(hours.open);
      const closeTime = parseTime(hours.close);
      if (!openTime || !closeTime) return false;

      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const openTimeInMinutes = openTime.hours * 60 + openTime.minutes;
      const closeTimeInMinutes = closeTime.hours * 60 + closeTime.minutes;

      if (openTimeInMinutes <= closeTimeInMinutes) {
        return (
          currentTimeInMinutes >= openTimeInMinutes &&
          currentTimeInMinutes <= closeTimeInMinutes
        );
      } else {
        return (
          currentTimeInMinutes >= openTimeInMinutes ||
          currentTimeInMinutes <= closeTimeInMinutes
        );
      }
    } catch (err) {
      console.warn("Error checking open status:", err);
      return false;
    }
  };

  return (
    <div className="w-[full] font-[lexend]">
      <img
        src={
          imageUrl?.startsWith("http")
            ? imageUrl
            : `${
                import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
              }${imageUrl}`
        }
        alt={name}
        className="h-[275px] rounded-[13px]"
      />

      <h3 className="ml-[6px] text-[24px] font-extrabold text-[#1a3d3c] drop-shadow-sm tracking-wide mb-[4px] mt-[4px]">
        {name}
      </h3>

      {/* Address */}
      <p className="ml-[6px] text-[14px] text-[#4d4d4d] italic my-[2px]">
        {typeof location === "string"
          ? location
          : location?.address || "No address provided"}
      </p>

      <p className="ml-[6px] text-[17px] my-[5px] text-[#305252]">
        {hours?.open === "12:00am" && hours?.close === "11:59pm"
          ? "Open 24 Hours"
          : hours?.open && hours?.close
          ? `Open ${hours.open} – ${hours.close}`
          : "Hours not available"}
      </p>

      <div className="flex flex-wrap my-[5px] justify-center font-[lexend]">
        {hours?.open &&
          hours?.close &&
          (isCurrentlyOpen() ? (
            <span className="text-[15px] px-[9px] py-[4px] m-[4px] rounded-full bg-[#305252] text-[#FFFF]">
              Available
            </span>
          ) : (
            <span className="text-[13px] px-[9px] py-[4px] m-[4px] rounded-full bg-[#A9A9A9] text-[#FFFF]">
              NOT AVAILABLE
            </span>
          ))}

        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-[8px] py-[9px] m-[2px] rounded-[14px] bg-[#b6244f] text-[#DDDD]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div>
      <span className="flex flex-wrap mt-[5px] pt-[5px] ml-[5px] justify-center font-[lexend] text-[14px]">
        ⭐ {rating.toFixed(1)} ({reviews})
        </span>
      </div>
    </div>
  );
}
