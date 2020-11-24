const path = require("path");
const fs = require("fs");
const patchSharing = () => {
  const React = require("react");
  const umdReact =
    process.env.NODE_ENV === "production"
      ? require.resolve("react/umd/react.production.min.js")
      : require.resolve("react/umd/react.development.js");
  const stringReact = fs.readFileSync(umdReact, "utf-8");
  return React.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: stringReact,
    },
  });
};
module.exports = patchSharing;
