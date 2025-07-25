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
      {/*
        Main navbar content container:
        - container mx-auto px-4: Centers the content and provides padding.
        - w-full h-full: Ensures it fills its parent (<nav>).
        - flex items-center: Keeps children vertically aligned.
        We'll manage horizontal spacing with 'ml-auto' on the right group.
      */}
      <div className="px-2 sm:px-4 w-full h-full flex items-center">

        {/* Left Section: Streamify Logo and Text */}
        {/*
          - flex items-center: Aligns logo and text.
          - gap-2.5: Space between logo and text.
          - min-w-0: Allows this section to shrink if space is constrained.
        */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link to="/" className="flex items-center gap-0.5 sm:gap-2.5"> {/* Replicated gap-2.5 here for clarity */}
            <ShipWheelIcon className="size-9 text-primary flex-grow-0 flex-shrink" />
            <span
              className="font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider
                         text-2xl sm:text-3xl
                         whitespace-nowrap overflow-hidden text-ellipsis min-w-[50px]
                         flex-grow-0 flex-shrink" >
              Streamify
            </span>
          </Link>
        </div>

        {/*
          Right Section: Group of Icons (Bell, Theme, Avatar, Logout)
          - flex items-center: Aligns icons vertically within this group.
          - gap-2 sm:gap-3: Spacing between icons.
          - ml-auto: THIS IS THE KEY! It pushes this entire flex item (the group of icons)
                     to the far right, taking up all available space to its left.
          - flex-shrink-0: Ensures this entire group does not shrink unless absolutely necessary,
                           prioritizing the logo's text shrinking first.
        */}
       <div className="flex items-center justify-end gap-0 sm:gap-5 ml-auto">
          {/* Notification Bell Icon */}
          <Link to="/notifications">
            {/* Adjusted button padding and size directly for mobile */}
            <button className="btn btn-ghost btn-xs sm:btn-circle flex-shrink-0">
              <BellIcon className="size-5 sm:size-6 text-base-content opacity-70" />
            </button>
          </Link>

          {/* Theme Selector */}
          {/*
            IMPORTANT: If ThemeSelector still introduces gaps, you'll need to
            inspect its output and apply similar tight-spacing classes internally,
            or create a mobile-specific compact version.
            For now, ensure it doesn't add external margins/paddings.
            A common fix is to ensure the ThemeSelector's root element uses `p-0` or `m-0`.
          */}
          <ThemeSelector />

          {/* User Avatar */}
          <div className="avatar flex-shrink-0">
            {/* Adjusted avatar div size to be smaller on mobile */}
            <div className="size-8 sm:size-10 rounded-full overflow-hidden">
              <img src={authUser?.profilePic || "https://via.placeholder.com/150"} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout Button */}
          {/* Adjusted button padding and size directly for mobile */}
          <button className="btn btn-ghost btn-xs sm:btn-circle flex-shrink-0 mb-1" onClick={logoutMutation}>
            <LogOutIcon className="size-5 sm:size-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;