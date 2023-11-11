import { NextConfig } from "next";
import chokidar from "chokidar";
import config from "./config";
import { main } from "./main";

const defaultPluginOptions = config;

type PluginOptions = typeof defaultPluginOptions;

module.exports =
  (pluginOptions: PluginOptions) =>
  (nextConfig: NextConfig = {}): NextConfig => {
    const options = Object.assign({}, defaultPluginOptions, pluginOptions);

    return {
      ...nextConfig,
      webpack(config, webpackOptions) {
        if (webpackOptions.isServer) {
          // クライアントサイドのビルド時に実行
          const watcher = chokidar.watch(options.appDir, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
          });
          watcher.on("change", async (path: string) => {
            console.log(`File ${path} has been changed`);
            watcher.unwatch(options.appDir);
            await main(options);
            watcher.add(options.appDir);
          });
        }

        return config;
      },
    };
  };
