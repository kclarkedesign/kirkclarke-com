"use client";

import { useRef } from "react";
import type { Project } from "@/content/projects";
import Nav from "./nav";
import Hero from "./hero";
import WorkGrid from "./work-grid";
import HowIWork from "./how-i-work";
import About from "./about";
import Contact from "./contact";
import ChatDrawer, { type ChatDrawerHandle } from "./chat-drawer";

export default function Home({
  projects,
  initialTags,
}: {
  projects: Project[];
  initialTags: string[];
}) {
  const chatRef = useRef<ChatDrawerHandle>(null);
  const openChat = () => chatRef.current?.open();

  return (
    <>
      <Nav onOpenChat={openChat} />
      <Hero onOpenChat={openChat} />
      <WorkGrid projects={projects} initialTags={initialTags} />
      <HowIWork />
      <About />
      <Contact />
      <footer className="border-t border-(--hairline) px-5 py-8 text-center md:px-16">
        <span className="text-[13px] text-(--text-label)">© Kirk Clarke</span>
      </footer>
      <ChatDrawer ref={chatRef} />
    </>
  );
}
