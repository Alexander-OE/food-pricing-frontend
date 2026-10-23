import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Do not let Next generate an AGENTS.md file in the project
  agentRules: false,
  // Use this folder as the project root (a stray lockfile in the home folder confuses Next otherwise)
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
