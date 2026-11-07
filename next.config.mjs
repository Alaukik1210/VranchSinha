import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This folder, not the lockfile that happens to sit in the home directory.
  turbopack: { root: path.resolve(import.meta.dirname) },
};

export default nextConfig;
