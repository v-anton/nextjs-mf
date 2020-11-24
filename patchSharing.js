const patchSharing = () => {
  const React = require("react");
  const umdReact =
    process.env.NODE_ENV === "production"
      ? "https://unpkg.com/react@17/umd/react.production.min.js"
      : "https://unpkg.com/react@17/umd/react.development.js";
  return React.createElement("script", {
    src: umdReact,
    crossOrigin: true,
  });
};
module.exports = patchSharing;
