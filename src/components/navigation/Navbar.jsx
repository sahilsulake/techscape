import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Code2, Home, Calendar, Users, Plus } from "lucide-react";

import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <nav className="border-b-2 border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-vibrant shadow-md group-hover:shadow-neon transition-all">
              <Code2 className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-extrabold gradient-text-vibrant">
              TechScape
            </span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-gray-800 font-semibold hover:text-electric-blue">
              <Home className="w-4 h-4" />
              Home
            </Link>

            <Link to="/events" className="flex items-center gap-2 text-gray-800 font-semibold hover:text-electric-blue">
              <Calendar className="w-4 h-4" />
              Events
            </Link>

            <Link to="/teams" className="flex items-center gap-2 text-gray-800 font-semibold hover:text-electric-blue">
              <Users className="w-4 h-4" />
              Teams
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">

            {/* If logged in */}
            <SignedIn>

              {/* ⭐ CHANGE: Post Event → goes to create-event */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/create-event")}
                className="hidden md:flex items-center gap-2 border-2 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Post Event
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="font-semibold"
              >
                Dashboard
              </Button>

              {/* ⭐ FIXED Clerk User Menu */}
              <UserButton afterSignOutUrl="/">
  <UserButton.MenuItems>

    {/* View Profile */}
    <UserButton.Link
  href={`/public-profile/${user?.username}`}
  label="View Profile"
  labelIcon={<span>👤</span>}
/>


    {/* Edit Profile */}
    <UserButton.Link
      href="/dashboard/profile"
      label="Edit Profile"
      labelIcon={<span>✏️</span>}
    />

    <UserButton.Action label="manageAccount" />
    <UserButton.Action label="signOut" />

  </UserButton.MenuItems>
</UserButton>

            </SignedIn>

            {/* If NOT logged in */}
            <SignedOut>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/sign-in")}
                className="font-semibold"
              >
                Sign In
              </Button>

              <Button
                variant="vibrant"
                size="sm"
                onClick={() => navigate("/sign-up")}
                className="font-semibold"
              >
                Get Started
              </Button>
            </SignedOut>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
