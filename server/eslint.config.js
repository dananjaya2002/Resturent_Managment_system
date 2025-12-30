// ESLint 9+ Flat Configuration
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        // Node.js globals
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
        module: "writable",
        require: "readonly",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",

        // Jest globals
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: ["node_modules/**", "coverage/**", "*.config.js"],
  },
];
