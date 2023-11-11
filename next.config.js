/** @type {import('next').NextConfig} */
const nextConfig = {};

const withTypedRouter = require("./plugin/lib")({});

module.exports = withTypedRouter(nextConfig);
