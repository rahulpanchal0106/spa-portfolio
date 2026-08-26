import os from "node:os";
import path from "node:path";
import type { NextConfig } from "next";

function lanHosts() {
  const hosts = new Set<string>(["localhost", "127.0.0.1"]);
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs ?? []) {
      const family = String(addr.family);
      if (!addr.internal && (family === "IPv4" || family === "4")) hosts.add(addr.address);
    }
  }
  return [...hosts];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: lanHosts(),
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
