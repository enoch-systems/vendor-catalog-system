"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FloatingWhatsApp from "./floating-whatsapp";

export default function ConditionalFloatingWhatsApp() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(pathname?.startsWith('/admin') || false);
  }, [pathname]);

  // Check immediately on render
  const isCurrentlyAdmin = pathname?.startsWith('/admin') || false;
  
  if (isAdmin || isCurrentlyAdmin) {
    return null;
  }

  return <FloatingWhatsApp />;
}
