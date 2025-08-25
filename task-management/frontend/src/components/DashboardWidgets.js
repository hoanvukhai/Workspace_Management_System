import React from "react";

const DashboardWidgets = ({ onSelect, widgetData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
      {widgetData.map((w) => (
        <div
          key={w.key}
          onClick={() => onSelect(w.key)}
          className={`p-3 rounded shadow cursor-pointer ${w.bgColor} hover:scale-[1.02] transition bg-opacity-90`}
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">{w.title}</span>
          </div>
          <p className="text-xs mt-1 font-bold text-gray-800">{w.total}</p>
          <ul className="text-xs text-gray-700 list-disc list-inside space-y-0.5 mt-1">
            {w.recent.map((item, idx) => (
              <li key={idx} className="truncate">{item}</li>
            ))}
          </ul>
          <p className="text-xs text-gray-600 italic mt-1">{w.extraInfo}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardWidgets;