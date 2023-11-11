/** @type {import('next').NextConfig} */
const nextConfig = {};

const withTypedRouter = require("./plugins/lib")({});

module.exports = withTypedRouter(nextConfig);
