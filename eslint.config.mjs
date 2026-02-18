import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/build/**', '**/.wrangler/**'],
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/array-element-newline': ['error', 'consistent'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/arrow-spacing': ['error', {
        after: true,
        before: true,
      }],
      '@stylistic/brace-style': ['error', '1tbs', {
        allowSingleLine: true,
      }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error', {
        after: true,
        before: false,
      }],
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/computed-property-spacing': ['error', 'never'],
      '@stylistic/dot-location': ['error', 'property'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/function-paren-newline': ['error', 'multiline'],
      '@stylistic/generator-star-spacing': ['error', {
        after: false,
        before: true,
      }],
      '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/jsx-closing-bracket-location': ['error', 'line-aligned'],
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/jsx-curly-brace-presence': ['error', {
        children: 'never',
        propElementValues: 'always',
        props: 'never',
      }],
      '@stylistic/jsx-curly-newline': ['error', {
        multiline: 'consistent',
        singleline: 'consistent',
      }],
      '@stylistic/jsx-curly-spacing': ['error', {
        when: 'never',
      }],
      '@stylistic/jsx-equals-spacing': ['error', 'never'],
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      '@stylistic/jsx-function-call-newline': ['error', 'multiline'],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-max-props-per-line': ['error', {
        maximum: 1,
        when: 'multiline',
      }],
      '@stylistic/jsx-newline': 'off',
      '@stylistic/jsx-one-expression-per-line': ['error', {
        allow: 'single-child',
      }],
      '@stylistic/jsx-pascal-case': ['error', {
        allowAllCaps: true,
        allowLeadingUnderscore: true,
      }],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/jsx-self-closing-comp': 'error',
      '@stylistic/jsx-tag-spacing': ['error', {
        afterOpening: 'never',
        beforeSelfClosing: 'never',
        closingSlash: 'never',
      }],
      '@stylistic/jsx-wrap-multilines': ['error', {
        arrow: 'parens',
        assignment: 'parens',
        condition: 'ignore',
        declaration: 'parens',
        logical: 'ignore',
        prop: 'ignore',
        propertyValue: 'ignore',
        return: 'parens',
      }],
      '@stylistic/key-spacing': ['error', {
        afterColon: true,
        beforeColon: false,
        mode: 'strict',
      }],
      '@stylistic/keyword-spacing': ['error', {
        after: true,
        before: true,
      }],
      '@stylistic/line-comment-position': 'off',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/lines-around-comment': 'off',
      '@stylistic/max-len': 'off',
      '@stylistic/max-statements-per-line': ['warn', {
        max: 1,
      }],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'none',
        },
        multilineDetection: 'brackets',
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
      '@stylistic/multiline-comment-style': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/new-parens': ['error', 'always'],
      '@stylistic/newline-per-chained-call': 'off',
      '@stylistic/no-confusing-arrow': 'off',
      '@stylistic/no-extra-parens': ['error', 'functions'],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/no-floating-decimal': 'error',
      '@stylistic/no-mixed-operators': 'off',
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', {
        max: 1,
        maxBOF: 0,
        maxEOF: 1,
      }],
      '@stylistic/no-tabs': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      '@stylistic/object-curly-newline': ['error', {
        consistent: true,
        multiline: true,
      }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: true,
      }],
      '@stylistic/one-var-declaration-per-line': ['error', 'initializations'],
      '@stylistic/operator-linebreak': ['error', 'after', {
        overrides: {
          ':': 'before',
          '?': 'before',
          '|': 'before',
        },
      }],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/padding-line-between-statements': 'off',
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
      }],
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/semi-spacing': ['error', {
        after: true,
        before: false,
      }],
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never',
      }],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': ['error', {
        nonwords: false,
        words: true,
      }],
      '@stylistic/spaced-comment': ['error', 'always'],
      '@stylistic/switch-colon-spacing': ['error', {
        after: true,
        before: false,
      }],
      '@stylistic/template-curly-spacing': ['error', 'never'],
      '@stylistic/template-tag-spacing': ['error', 'never'],
      '@stylistic/type-annotation-spacing': ['error', {
        after: true,
        before: true,
        overrides: {
          colon: { after: true, before: false },
        },
      }],
      '@stylistic/type-generic-spacing': 'error',
      '@stylistic/type-named-tuple-spacing': 'error',
      '@stylistic/wrap-iife': ['error', 'inside'],
      '@stylistic/wrap-regex': 'off',
      '@stylistic/yield-star-spacing': ['error', {
        after: false,
        before: true,
      }],
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-array-includes': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-classes': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-decorators': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-enums': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-export-attributes': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-exports': ['error', {
        ignoreCase: true,
        partitionByNewLine: true,
      }],
      'perfectionist/sort-heritage-clauses': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-import-attributes': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-imports': ['error', {
        ignoreCase: false,
        newlinesBetween: 1,
      }],
      'perfectionist/sort-interfaces': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-intersection-types': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-jsx-props': ['error', {
        customGroups: [
          {
            elementNamePattern: '^(id|key|ref|className|style)$',
            groupName: 'native',
          },
          {
            elementNamePattern: '^aria-',
            groupName: 'aria',
          },
          {
            elementNamePattern: '^data-',
            groupName: 'data',
          },
          {
            elementNamePattern: '^(is|has|should|can)[A-Z].+',
            groupName: 'flag',
          },
          {
            elementNamePattern: '^on.+',
            groupName: 'callback',
          },
        ],
        groups: [
          'native',
          'aria',
          'data',
          'unknown',
          'flag',
          'callback',
        ],
        ignoreCase: false,
      }],
      'perfectionist/sort-maps': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-named-exports': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-named-imports': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-object-types': ['error', {
        customGroups: [
          {
            elementNamePattern: '^(id|key|ref|className|style)$',
            groupName: 'native',
          },
          {
            elementNamePattern: '^aria-',
            groupName: 'aria',
          },
          {
            elementNamePattern: '^data-',
            groupName: 'data',
          },
          {
            elementNamePattern: '^(is|has|should|can)[A-Z].+',
            groupName: 'flag',
          },
          {
            elementNamePattern: '^on.+',
            groupName: 'callback',
          },
        ],
        groups: [
          'native',
          'aria',
          'data',
          'unknown',
          'flag',
          'callback',
        ],
        ignoreCase: false,
        partitionByNewLine: true,
      }],
      'perfectionist/sort-objects': ['error', {
        customGroups: [
          {
            elementNamePattern: '^(id|key|ref|className|style)$',
            groupName: 'native',
          },
          {
            elementNamePattern: '^aria-',
            groupName: 'aria',
          },
          {
            elementNamePattern: '^data-',
            groupName: 'data',
          },
          {
            elementNamePattern: '^(is|has|should|can)[A-Z].+',
            groupName: 'flag',
          },
          {
            elementNamePattern: '^on.+',
            groupName: 'callback',
          },
        ],
        groups: [
          'native',
          'aria',
          'data',
          'unknown',
          'flag',
          'callback',
        ],
        ignoreCase: false,
        partitionByNewLine: true,
      }],
      'perfectionist/sort-switch-case': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-union-types': ['error', {
        ignoreCase: false,
      }],
      'perfectionist/sort-variable-declarations': ['error', {
        ignoreCase: false,
      }],
    },
  },
  {
    rules: {
      '@typescript-eslint/array-type': ['error', {
        default: 'array',
      }],
      '@typescript-eslint/class-literal-property-style': ['error', 'getters'],
      '@typescript-eslint/consistent-generic-constructors': 'error',
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', {
        fixStyle: 'inline-type-imports',
      }],
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['error', {
        accessibility: 'no-public',
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: [
            'UPPER_CASE',
          ],
          selector: [
            'enumMember',
          ],
        },
        {
          format: [
            'camelCase',
            'snake_case',
            'PascalCase',
            'UPPER_CASE',
          ],
          leadingUnderscore: 'allowSingleOrDouble',
          selector: [
            'variableLike',
            'property',
          ],
          trailingUnderscore: 'allowSingleOrDouble',
        },
        {
          format: [
            'camelCase',
          ],
          selector: [
            'memberLike',
            'method',
          ],
        },
        {
          format: [
            'PascalCase',
          ],
          selector: 'typeLike',
        },
        {
          format: null,
          modifiers: [
            'requiresQuotes',
          ],
          selector: [
            'objectLiteralProperty',
            'objectLiteralMethod',
          ],
        },
        {
          format: null,
          leadingUnderscore: 'allow',
          modifiers: ['unused'],
          selector: 'parameter',
        },
      ],
      '@typescript-eslint/no-confusing-non-null-assertion': 'error',
      '@typescript-eslint/no-dupe-class-members': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-invalid-this': 'error',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-restricted-imports': 'error',
      '@typescript-eslint/no-shadow': [
        'error',
        {
          allow: [
            '_',
          ],
        },
      ],
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/sort-type-union-intersection-members': 'off',
      '@typescript-eslint/triple-slash-reference': [
        'error',
        {
          lib: 'always',
          path: 'always',
          types: 'prefer-import',
        },
      ],
      '@typescript-eslint/unified-signatures': 'error',
      'default-param-last': 'off',
      'init-declarations': 'off',
      'no-dupe-class-members': 'off',
      'no-empty-function': 'off',
      'no-invalid-this': 'off',
      'no-restricted-imports': 'off',
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      'no-useless-constructor': 'off',
    },
  },
  {
    rules: {
      'array-callback-return': 'error',
      'arrow-body-style': 'off',
      'capitalized-comments': 'off',
      'complexity': 'off',
      'curly': ['error', 'multi-line'],
      'default-case': 'off',
      'default-case-last': 'error',
      'eqeqeq': ['error', 'smart'],
      'func-names': ['error', 'never'],
      'func-style': ['error', 'declaration', {
        allowArrowFunctions: true,
      }],
      'guard-for-in': 'error',
      'id-denylist': [
        'error',
        'any',
        'Number',
        'String',
        'Boolean',
        'Undefined',
        'undefined',
      ],
      'id-match': 'error',
      'max-classes-per-file': ['error', 1],
      'max-depth': ['warn', 6],
      'new-cap': 'off',
      'no-alert': 'warn',
      'no-bitwise': 'off',
      'no-caller': 'error',
      'no-console': ['warn', {
        allow: ['warn', 'error'],
      }],
      'no-constant-binary-expression': 'error',
      'no-constructor-return': 'error',
      'no-empty': ['error', {
        allowEmptyCatch: true,
      }],
      'no-eval': 'error',
      'no-extra-bind': 'error',
      'no-fallthrough': 'off',
      'no-implied-eval': 'error',
      'no-label-var': 'error',
      'no-lonely-if': 'error',
      'no-magic-numbers': 'off',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'off',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': 'error',
      'no-promise-executor-return': 'error',
      'no-redeclare': 'off',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'off',
      'no-undef-init': 'error',
      'no-underscore-dangle': 'off',
      'no-unmodified-loop-condition': 'warn',
      'no-unneeded-ternary': 'off',
      'no-unreachable-loop': 'warn',
      'no-unused-private-class-members': 'warn',
      'no-use-before-define': 'off',
      'no-var': 'error',
      'no-void': 'error',
      'no-warning-comments': ['warn', {
        location: 'start',
        terms: ['todo', 'fixme', 'hack'],
      }],
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-rest-params': 'error',
      'prefer-template': 'error',
      'radix': 'error',
      'require-atomic-updates': 'error',
      'one-var': ['error', 'never'],
    },
  },
)
