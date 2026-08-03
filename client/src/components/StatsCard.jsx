import {
  FaDatabase,
  FaCalendarDay,
  FaStar,
  FaChartLine,
} from "react-icons/fa";

function StatsCard({ stats }) {
  const cards = [
    {
      title: "Total Saved Leads",
      value: stats?.totalLeads || 0,
      icon: <FaDatabase />,
      color: "bg-blue-500",
    },
    {
      title: "Today's Leads",
      value: stats?.todayLeads || 0,
      icon: <FaCalendarDay />,
      color: "bg-green-500",
    },
    {
      title: "Average Rating",
      value: `⭐ ${stats?.avgRating || 0}`,
      icon: <FaStar />,
      color: "bg-yellow-500",
    },
    {
      title: "CRM Status",
      value: "Active",
      icon: <FaChartLine />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">
                {item.title}
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {item.value}
              </h2>
            </div>

            <div
              className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl`}
            >
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCard;