import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Подавление deprecation warnings
  ...(process.env.NODE_ENV === "development" && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),

  // Оптимизация CSS
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // Оптимизация загрузки ресурсов
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Настройки для production
  ...(process.env.NODE_ENV === "production" && {
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,
  }),

  // Webpack оптимизации
  webpack: (config, { dev, isServer }) => {
    // Подавить deprecation warnings
    if (dev) {
      config.infrastructureLogging = {
        level: "error",
      };

      // Подавить Node.js warnings
      config.resolve.fallback = {
        ...config.resolve.fallback,
        url: false,
      };
    }

    // Оптимизация для production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: -10,
              chunks: "all",
            },
          },
        },
      };
    }

    return config;
  },

  // Настройки headers для оптимизации
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
