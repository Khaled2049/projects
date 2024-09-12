import { Outlet, NavLink, useLocation } from "react-router-dom";

const Story = () => {
  const location = useLocation();
  const isRootPath = location.pathname === "/create-story";

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-amber-100 p-4">
        <ul className="flex space-x-4">
          {[
            "Dashboard",
            "Editor",
            "Plot",
            "Characters",
            "Places",
            "Drafts",
          ].map((tab) => (
            <li key={tab}>
              <NavLink
                to={tab.toLowerCase() === "dashboard" ? "" : tab.toLowerCase()}
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md ${
                    isActive || (isRootPath && tab === "Dashboard")
                      ? "bg-amber-800 text-white"
                      : "text-amber-800 hover:bg-amber-200"
                  }`
                }
              >
                {tab}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="flex-grow overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Story;
