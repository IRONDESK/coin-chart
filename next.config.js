// module.exports = nextConfig

const withTM = require("next-transpile-modules")([
  "d3-array",
  "d3-format",
  "d3-time",
  "d3-time-format",
  "react-financial-charts",
  "@react-financial-charts/annotations",
  "@react-financial-charts/axes",
  "@react-financial-charts/coordinates",
  "@react-financial-charts/core",
  "@react-financial-charts/indicators",
  "@react-financial-charts/interactive",
  "@react-financial-charts/scales",
  "@react-financial-charts/series",
  "@react-financial-charts/tooltip",
  "@react-financial-charts/utils",
])
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}
module.exports = withTM(nextConfig)
