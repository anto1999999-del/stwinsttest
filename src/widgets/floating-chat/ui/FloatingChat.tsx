"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Icon } from "@chakra-ui/react";
import { MessageCircle } from "lucide-react";

declare global {
  interface Window {
    PodiumWebChat?: { open: () => void };
  }
}

const FloatingChat: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let tries = 0;
    const maxTries = 40;
    const iv = window.setInterval(() => {
      const hasWidget = !!document.querySelector(".podium-launcher");
      if (hasWidget || tries++ > maxTries) {
        setReady(hasWidget);
        window.clearInterval(iv);
      }
    }, 300);
    return () => window.clearInterval(iv);
  }, []);

  const openPodium = useCallback(() => {
    if (typeof window !== "undefined" && window.PodiumWebChat?.open) {
      window.PodiumWebChat.open();
      return;
    }
    document.querySelector<HTMLButtonElement>(".podium-launcher")?.click();
  }, []);

  if (!ready) return null;

  return (
    <Box className="stwins-chat-fab" position="fixed" bottom="20px" right="20px" zIndex={9999}>
      <Button
		  onClick={openPodium}
		  size="lg"
		  borderRadius="full"
		  px={5}
		  height="56px"
		  bg="red.600"
		  color="white"
		  _hover={{ bg: "red.500" }}
		  boxShadow="lg"
		>
		  <Icon as={MessageCircle} boxSize={5} mr={2} />
		  Chat
		</Button>
    </Box>
  );
};

export default FloatingChat;
