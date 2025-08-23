import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout.js";
const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 left-0 right-0 z-30 h-14 flex items-center w-full">
      <div className="px-2 sm:px-4 w-full h-full flex items-center">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link to="/" className="flex items-center gap-0.5 sm:gap-2.5">
            <ShipWheelIcon className="size-9 text-primary flex-grow-0 flex-shrink" />
            <span
              className="font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider
                         text-2xl sm:text-3xl
                         whitespace-nowrap overflow-hidden text-ellipsis min-w-[50px]
                         flex-grow-0 flex-shrink"
            >
              Streamify
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-0 sm:gap-5 ml-auto">
          {/* Notification Bell Icon */}
          <Link to="/notifications">
            {/* Adjusted button padding and size directly for mobile */}
            <button className="btn btn-ghost btn-xs sm:btn-circle flex-shrink-0">
              <BellIcon className="size-5 sm:size-6 text-base-content opacity-70" />
            </button>
          </Link>

          <ThemeSelector />

          {/* User Avatar */}
          <Link to="/update-profile" className="avatar flex-shrink-0">
            <div className="size-8 sm:size-10 rounded-full overflow-hidden cursor-pointer">
              <img
                src={authUser?.profilePic || "https://via.placeholder.com/150"}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </Link>

          {/* Logout Button */}
          {/* Adjusted button padding and size directly for mobile */}
          <button
            className="btn btn-ghost btn-xs sm:btn-circle flex-shrink-0 mb-1"
            onClick={logoutMutation}
          >
            <LogOutIcon className="size-5 sm:size-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
