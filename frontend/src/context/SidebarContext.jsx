import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isExpanded = isHovered || isPinned;

  const togglePinned = () => {
    setIsPinned((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isHovered,
        setIsHovered,
        isPinned,
        setIsPinned,
        togglePinned,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext;
