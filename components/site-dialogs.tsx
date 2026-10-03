"use client";

import { lazy, Suspense, useMemo, useRef, useState } from "react";
import type { ChatDrawerHandle } from "./chat-drawer";
import type { ContactDialogHandle } from "./contact-dialog";
import { SiteDialogsContext } from "./site-dialogs-context";

// Mounted once in the root layout so the chat and contact dialogs open from
// anywhere — home or a case study. Each is code-split and only fetched the
// first time it's opened: the chat pulls in react-markdown, and shipping both
// on every page cost the case-study pages ~20 Lighthouse points.
const ChatDrawer = lazy(() => import("./chat-drawer"));
const ContactDialog = lazy(() => import("./contact-dialog"));

export default function SiteDialogs({ children }: { children: React.ReactNode }) {
  const chatRef = useRef<ChatDrawerHandle | null>(null);
  const contactRef = useRef<ContactDialogHandle | null>(null);
  const chatWanted = useRef(false);
  const contactWanted = useRef(false);
  const [chatMounted, setChatMounted] = useState(false);
  const [contactMounted, setContactMounted] = useState(false);

  const value = useMemo(
    () => ({
      openChat: () => {
        if (chatRef.current) chatRef.current.open();
        else {
          chatWanted.current = true;
          setChatMounted(true);
        }
      },
      openContact: () => {
        if (contactRef.current) contactRef.current.open();
        else {
          contactWanted.current = true;
          setContactMounted(true);
        }
      },
    }),
    [],
  );

  return (
    <SiteDialogsContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        {chatMounted && (
          <ChatDrawer
            ref={(handle) => {
              chatRef.current = handle;
              if (handle && chatWanted.current) {
                chatWanted.current = false;
                handle.open();
              }
            }}
          />
        )}
        {contactMounted && (
          <ContactDialog
            ref={(handle) => {
              contactRef.current = handle;
              if (handle && contactWanted.current) {
                contactWanted.current = false;
                handle.open();
              }
            }}
          />
        )}
      </Suspense>
    </SiteDialogsContext.Provider>
  );
}
