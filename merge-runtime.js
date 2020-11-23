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
      const emittedAssets = Array.from(output.emittedAssets);
      const files = [
        "static/chunks/commons",
        "static/chunks/webpack",
        "static/runtime/remoteEntry",
      ]
        .filter((neededChunk) =>
          emittedAssets.some((emmitedAsset) =>
            emmitedAsset.includes(neededChunk)
          )
        )
        .map((neededChunk) =>
          emittedAssets.find((emittedAsset) =>
            emittedAsset.includes(neededChunk)
          )
        )
        .map((file) => path.join(compiler.options.output.path, file));
      if (files.length > 0) {
        shell
          .cat(files)
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
