// HubSpot Chat Widget types
interface Window {
  HubSpotConversations?: {
    widget: {
      open: () => void;
      close: () => void;
      remove: () => void;
      load: () => void;
      status: () => { loaded: boolean };
    };
  };
}
