type DeviceActionItem = {
    label: string;
    callback: (item: Record<string, unknown>) => void;
  };
  
  const pluginActions: DeviceActionItem[] = [];
  
  export const registerDeviceAction = (action: DeviceActionItem) => {
    pluginActions.push(action);
  };
  
  export const getDeviceActions = () => pluginActions;
  