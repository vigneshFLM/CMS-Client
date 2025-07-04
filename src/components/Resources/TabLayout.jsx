// ✅ Tab Layout
import React from "react";
import "../../styles/Resources.css";

const TabLayout = ({ tabs, activeTab, setActiveTab, children }) => {
  return (
    <div>
      <div className="resource-tabs table-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={tab.key === activeTab ? "active" : ""}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default TabLayout;
