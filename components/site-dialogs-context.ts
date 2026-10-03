"use client";

import { createContext, useContext } from "react";

export interface SiteDialogs {
  openChat: () => void;
  openContact: () => void;
}

// Kept apart from the provider so chat-drawer.tsx can read it without a
// circular import (the provider renders the drawer).
export const SiteDialogsContext = createContext<SiteDialogs>({
  openChat: () => {},
  openContact: () => {},
});

export const useSiteDialogs = () => useContext(SiteDialogsContext);
