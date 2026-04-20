import { NavLink } from "react-router";

function Navbar() {
  const baseStyle =
    "px-4 py-2 rounded-md text-sm font-medium transition";

  const activeStyle = "bg-blue-600 text-white";
  const inactiveStyle =
    "text-gray-700 hover:bg-gray-200";

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto flex gap-4 p-3">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Doctors
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Patients
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Appointments
        </NavLink>

        <NavLink
          to="/tests"
          className={({ isActive }) =>
            `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
          }
        >
          Tests
        </NavLink>

      </div>
    </nav>
  );
}

export default Navbar;