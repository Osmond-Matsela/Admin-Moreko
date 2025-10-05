"use client";
import {
  Book,
  DoorOpen,
  HamburgerIcon,
  Home,
  ImageDown,
  Menu,
  MenuIcon,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import styles from "@/components/styles/HomepageStyles.module.css";
import Hamburger from "hamburger-react";
import { signOut } from "next-auth/react";

const DashNavBar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header
      className={`text-white shadow-lg px-5 bg-red-800 absolute max-w-screen top-0 left-0 right-0 ${styles.navbar}`}
    >
      <div className="flex justify-between items-center min-h-20">
        <div className="flex items-center space-x-3">
          <Image src={"/images/logo.png"} width={50} height={50} alt="LOGO" />
          <div className={`${styles.title}`}>
            <h1 className="text-xl font-bold">Moreko High School</h1>
            <p className="text-red-200 text-sm">Excellence in Education</p>
          </div>
        </div>


        <NavButtons />
        <NavLinks menu={showMenu} />
        <div className={`${styles.menu}`}>
          <Hamburger
            size={24}
            onToggle={(toggled) => {
              setShowMenu(!showMenu);
            }}
          />
        </div>
      </div>
    </header>
  );
};

const NavButtons = () => {
  return (
    <div className={`flex items-center space-x-2 ${styles.buttons}`}>
      <Button
        variant="outline"
        onClick={() => signOut()}
        className="text-red-800 border-none bg-gray-100 hover:bg-gray-100 cursor-pointer"
      >
        <User className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

const NavLinks = ({ menu }: any) => {
  React.useEffect(() => {
    const menuList = document.getElementById("menu");
    if (menu == true) {
      menuList?.classList.remove("hideMenu");
      menuList?.classList.add("showMenu");
    } else {
      menuList?.classList.add("hideMenu");
      menuList?.classList.remove("showMenu");
    }
  }, [menu]);

  return (
    <div
      className={`flex flex-col items-end space-y-2  fixed top-20 showLinks w-full  py-5 `}
      id="menu"
    >
      

      <Button
        onClick={() => signOut()}
        className="text-red-800 border-white hover:bg-gray-100 cursor-pointer flex flex-row items-center p-3 w-50 bg-white rounded"
      >
        <User className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default DashNavBar;
