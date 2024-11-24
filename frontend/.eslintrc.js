module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        // Explicitly point to the tsconfig.json in the frontend/ directory
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended', // Ensure Vue 3 compatibility
    ],
    rules: {
      'vue/valid-v-slot': 'off', // Disable this rule if errors persist
    },
  };
  