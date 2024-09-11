import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "../../css/components-css/sidebar.css";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { useAuth } from "../../context/auth-context/authProvider"; 

import dashboardIcon from "../../images/sidebar-images/Dashboard Icon.svg";
import dashboardIconHover from "../../images/sidebar-images/Dashboard Icon Hover.svg";
import logoutIcon from "../../images/sidebar-images/Logout Icon.svg";
import logoutIconHover from "../../images/sidebar-images/Logout Icon Hover.svg";
import notesIcon from "../../images/sidebar-images/Notes Icon.svg";
import notesIconHover from "../../images/sidebar-images/Notes Icon Hover.svg";
import remindersIcon from "../../images/sidebar-images/Reminders Icon.svg";
import remindersIconHover from "../../images/sidebar-images/Reminders Icon Hover.svg";
import tasksIcon from "../../images/sidebar-images/Tasks Icon.svg";
import tasksIconHover from "../../images/sidebar-images/Tasks Icon Hover.svg";
import userIcon from "../../images/sidebar-images/User Icon.svg";
import userIconHover from "../../images/sidebar-images/User Icon Hover.svg"; 

const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const router = useRouter(); 
  const { logout } = useAuth(); 


  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getIcon = (
    item: string,
    defaultIcon: StaticImageData,
    hoverIcon: StaticImageData
  ) => {
    return hoveredItem === item || pathname.includes(item)
      ? hoverIcon
      : defaultIcon;
  };

  const getTextColor = (item: string) => {
    return hoveredItem === item || pathname.includes(item)
      ? "#FFF733"
      : "#FFFFFF";
  };

  return (
    <div className="sidebar-main-container">
      <div className="sidebar-title">
        <h1 className="sidebar-title-text">AllInOne</h1>
      </div>

      <div className="sidebar-item-list">
        <Link
          href="/dashboard"
          className="sidebar-item"
          onMouseEnter={() => setHoveredItem("dashboard")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <h3
            className="sidebar-dashboard-title"
            style={{ color: getTextColor("dashboard") }}
          >
            <div className="sidebar-icon">
              <Image
                src={getIcon("dashboard", dashboardIcon, dashboardIconHover)}
                alt="Dashboard Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="sidebar-text">Dashboard</div>
          </h3>
        </Link>

        <Link
          href="/profile"
          className="sidebar-item"
          onMouseEnter={() => setHoveredItem("profile")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <h3
            className="sidebar-profile-title"
            style={{ color: getTextColor("profile") }}
          >
            <div className="sidebar-icon">
              <Image
                src={getIcon("profile", userIcon, userIconHover)}
                alt="Profile Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="sidebar-text">Profile</div>
          </h3>
        </Link>

        <Link
          href="/tasks"
          className="sidebar-item"
          onMouseEnter={() => setHoveredItem("tasks")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <h3
            className="sidebar-tasks-title"
            style={{ color: getTextColor("tasks") }}
          >
            <div className="sidebar-icon">
              <Image
                src={getIcon("tasks", tasksIcon, tasksIconHover)}
                alt="Tasks Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="sidebar-text">Tasks</div>
          </h3>
        </Link>

        <Link
          href="/notes"
          className="sidebar-item"
          onMouseEnter={() => setHoveredItem("notes")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <h3
            className="sidebar-notes-title"
            style={{ color: getTextColor("notes") }}
          >
            <div className="sidebar-icon">
              <Image
                src={getIcon("notes", notesIcon, notesIconHover)}
                alt="Notes Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="sidebar-text">Notes</div>
          </h3>
        </Link>

        <Link
          href="/reminders"
          className="sidebar-item"
          onMouseEnter={() => setHoveredItem("reminders")}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <h3
            className="sidebar-reminders-title"
            style={{ color: getTextColor("reminders") }}
          >
            <div className="sidebar-icon">
              <Image
                src={getIcon("reminders", remindersIcon, remindersIconHover)}
                alt="Reminders Icon"
                width={24}
                height={24}
              />
            </div>
            <div className="sidebar-text">Reminders</div>
          </h3>
        </Link>

        <div className="sidebar-logout-container">
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              background: "none",
              border: "none"
            }}
          >
            <h3
              className="sidebar-logout-title"
              style={{
                color: getTextColor("logout")
              }}
            >
              <div className="sidebar-icon">
                <Image
                  src={getIcon("logout", logoutIcon, logoutIconHover)}
                  alt="Logout Icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="sidebar-text">Logout</div>
            </h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
