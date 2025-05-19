export default function SpotCard({ spot }) {
  const {
    name,
    imageUrl,
    hours = {},
    tags = [],
    rating = 0,
    reviews = 0,
  } = spot;

  // Helper function to check if a location is currently open
  const isCurrentlyOpen = () => {
    if (!hours?.open || !hours?.close) return false;

    try {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const parseTime = (timeStr) => {
        // Handle formats like "9:30am", "9am", "12pm", etc.
        const timeRegex = /(\d+)(?::(\d+))?\s*(am|pm)/i;
        const match = timeStr.match(timeRegex);

        if (!match) return null;

        let [_, hours, minutes, period] = match;
        hours = parseInt(hours, 10);
        minutes = minutes ? parseInt(minutes, 10) : 0;

        // Convert to 24-hour format
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

      // Convert current time to minutes since midnight for easier comparison
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const openTimeInMinutes = openTime.hours * 60 + openTime.minutes;
      const closeTimeInMinutes = closeTime.hours * 60 + closeTime.minutes;

      // Handle standard case (open and close on same day)
      if (openTimeInMinutes <= closeTimeInMinutes) {
        return (
          currentTimeInMinutes >= openTimeInMinutes &&
          currentTimeInMinutes <= closeTimeInMinutes
        );
      }
      // Handle overnight case (e.g., 10pm - 2am)
      else {
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
    <div className="w-full font-[calibri]">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="h-40 w-full object-cover rounded-xl mb-3"
        />
      )}

      <h3 className="text-lg font-bold text-slate mb-1">{name}</h3>

      <p className="text-sm text-gray-700 mb-1">
        {hours?.open === "12:00am" && hours?.close === "11:59pm"
          ? "Open 24 Hours"
          : hours?.open && hours?.close
          ? `Open ${hours.open} – ${hours.close}`
          : "Hours not available"}
      </p>

      <div className="flex flex-wrap gap-2 mb-2">
        {hours?.open &&
          hours?.close &&
          (isCurrentlyOpen() ? (
            <span className="text-[12px] px-[9px] py-[4px] m-[4px] rounded-full bg-[#305252] text-[#FFFF]">
              Available
            </span>
          ) : (
            <span className="text-[12px] px-[9px] py-[4px] m-[4px] rounded-full bg-[#A9A9A9] text-[#FFFF]">
              NOT AVAILABLE
            </span>
          ))}

        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-[8px] py-[5px] m-[2px] rounded-[10px] bg-[#305252] text-[#DDDD]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-800">
        ★ {rating.toFixed(1)} ({reviews})
      </div>
    </div>
  );
}
