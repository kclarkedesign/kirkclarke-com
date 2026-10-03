import nextConfig from "eslint-config-next";

const config = [{ ignores: [".claude/**"] }, ...nextConfig];

export default config;
