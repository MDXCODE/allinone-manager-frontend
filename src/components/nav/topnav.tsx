import Image, { StaticImageData } from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import profilePlaceholderIcon from "../../images/profile-images/placeholder.jpg";

const Topnav = () => {
  return (
    <div className="topnav-main-container">
      <div className="topnav-content">
        <div className="topnav-content-searchbar"></div>
        <div className="topnav-content-profileicon"></div>
      </div>
    </div>
  );
};

export default Topnav;
