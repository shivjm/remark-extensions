module.exports = {
  root: true,
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./packages/**/tsconfig.json"],
  },
  extends: [
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
};
