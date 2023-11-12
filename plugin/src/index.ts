import { NextConfig } from "next";
import config from "./config";
import { main } from "./main";

const defaultPluginOptions = config;

type PluginOptions = typeof defaultPluginOptions;

module.exports =
  (pluginOptions: PluginOptions) =>
  (nextConfig: NextConfig = {}): NextConfig => {
    const options = Object.assign({}, defaultPluginOptions, pluginOptions);

    main(options);

    return {
      ...nextConfig,
      webpack(config, webpackOptions) {
        if (webpackOptions.dev) {
          if (webpackOptions.isServer) {
            // サーバーサイドで実行
          }
        } else {
          // プロダクションビルド時に実行
          main(options);
        }
        return config;
      },
    };
  };
