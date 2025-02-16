type MenuItem = {
    label: string;
    route: string;
    requiresAdmin?: boolean;
  };
  
  const pluginMenuItems: MenuItem[] = [];
  
  export const registerMenuItem = (menuItem: MenuItem) => {
    pluginMenuItems.push(menuItem);
  };
  
  export const getMenuItems = () => pluginMenuItems;
  