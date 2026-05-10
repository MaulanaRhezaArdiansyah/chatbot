import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["langchain", "@langchain/core", "@langchain/openai"],
};

export default nextConfig;
