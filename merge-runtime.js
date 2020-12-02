const shell = require("shelljs");
const path = require("path");

module.exports = class MergeRemoteChunksPlugin {
  constructor(options) {
    this._options = Object.assign(
      {},
      {
        filename: "remoteEntry",
      },
      options
    );
  }
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    if (!this._options) return null;
    const options = this._options;

    // Specify the event hook to attach to
    compiler.hooks.afterEmit.tap("MergeRemoteChunksPlugin", (output) => {
      const affectedAssets = Array.from(output.emittedAssets);
      const assetsWeNeed = [
        "static/chunks/webpack",
        "static/chunks/commons",
        "static/runtime/remoteEntry",
      ];
      if (
        assetsWeNeed.some((neededAsset) =>
          affectedAssets.some((affectedAsset) =>
            affectedAsset.includes(neededAsset)
          )
        )
      ) {
        const allAssets = Object.keys(output.assets);
        const filesToMerge = assetsWeNeed
          .map((assetWeNeed) =>
            allAssets.find((asset) => asset.includes(assetWeNeed))
          )
          .filter(Boolean)
          .map((file) => path.join(compiler.options.output.path, file));
        shell
          .cat(filesToMerge)
          .to(
            path.join(
              compiler.options.output.path,
              "static/runtime/remoteEntryMerged.js"
            )
          );
      }
    });
  }
};
