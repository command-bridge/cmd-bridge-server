module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Use TypeScript parser
    project: './tsconfig.json',          // Path to tsconfig.json
    tsconfigRootDir: __dirname,         // Ensure correct resolution of tsconfig.json
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.vue'], // Add support for .vue files
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // Enforce Vue 3 best practices
    'plugin:@typescript-eslint/recommended', // TypeScript rules
  ],
  rules: {
    'vue/valid-v-slot': 'off', // Disable specific rule if needed
    '@typescript-eslint/no-unused-vars': 'warn', // Example: Warn on unused variables
    // Add additional custom rules here
  },
};
