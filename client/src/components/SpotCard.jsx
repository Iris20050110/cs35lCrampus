import "../index.css";

export default function SpotCard({ spot }) {
  const { name, imageUrl, hours = {}, tags, rating, reviews } = spot;
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img
        src={imageUrl}
        alt={name}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="mt-2 font-bold">{name}</h3>
      <p className="text-sm">
        {hours.open && hours.close
          ? `Open ${hours.open} – ${hours.close}`
          : "Hours not available"}
        +{" "}
      </p>
      <div className="mt-1 flex flex-wrap gap-1">
        {tags.map((t) => (
          <span key={t} className="text-xs bg-gray-100 px-2 rounded">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-2 text-sm">
        ★ {rating.toFixed(1)} ({reviews})
      </div>
    </div>
  );
}
