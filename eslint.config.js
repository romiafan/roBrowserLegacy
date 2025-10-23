const js = require('@eslint/js');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
        Uint8Array: 'readonly',
        Float32Array: 'readonly',
        ArrayBuffer: 'readonly',
        DataView: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        URL: 'readonly',
        WebSocket: 'readonly',
        Worker: 'readonly',
        XMLHttpRequest: 'readonly',
        Audio: 'readonly',
        Image: 'readonly',
        HTMLCanvasElement: 'readonly',
        WebGLRenderingContext: 'readonly',
        
        // Node.js globals (for build scripts)
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'writable',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        
        // RequireJS/AMD
        define: 'readonly',
        requirejs: 'readonly'
      }
    },
    plugins: {
      prettier
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'warn',
      
      // Disable rules that conflict with existing codebase
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'off',
      'no-fallthrough': 'off',
      'no-empty': 'off',
      'no-constant-condition': 'off',
      'no-case-declarations': 'off',
      'no-cond-assign': 'off',
      'no-extra-semi': 'off',
      'no-func-assign': 'off',
      'no-inner-declarations': 'off',
      'no-irregular-whitespace': 'off',
      'no-misleading-character-class': 'off',
      'no-self-assign': 'off',
      'no-unreachable': 'off',
      'no-unsafe-finally': 'off',
      'no-unsafe-negation': 'off',
      'no-useless-catch': 'off',
      'no-useless-escape': 'off',
      'no-with': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'vendors/**',
      'src/Vendors/**',
      'client/**',
      'AI/**',
      'data/**',
      'save/**',
      '*.min.js',
      'Online.js',
      'ThreadEventHandler.js',
      'GrfViewer.js',
      'MapViewer.js',
      'ModelViewer.js',
      'StrViewer.js',
      'EffectViewer.js',
      'GrannyModelViewer.js'
    ]
  }
];
