module.exports = {
    configuration: {
        target: 'ES2017',
        rules: {
            // TYPESCRIPT CHECKS

            'member-access': true,
            'adjacent-overload-signatures': true,
            'no-empty-interface': true,
            'no-inferrable-types': true,
            //"no-magic-numbers": [true, -1, 0, 1, 2],
            'no-internal-module': true,
            'only-arrow-functions': false,
            typedef: true,
            'unified-signatures': true,

            // JAVASCRIPT CHECKS

            quotemark: [true, 'single'],
            curly: true,
            forin: true,
            'label-position': true,
            'no-arg': true,
            'no-bitwise': true,
            'no-conditional-assignment': true,
            'no-construct': true,
            //"no-debugger": true,
            //"no-console": true,
            'no-duplicate-super': true,
            'no-duplicate-variable': [true, 'check-parameters'],
            'no-empty': [true, 'allow-empty-catch'],
            'no-eval': true,
            'no-invalid-this': true,
            'no-misused-new': true,
            'no-shadowed-variable': true,
            'no-sparse-arrays': true,
            'no-string-throw': true,
            'no-switch-case-fall-through': true,
            'switch-default': true,
            'no-this-assignment': true,
            'no-unused-expression': [true, 'allow-fast-null-checks'],
            'triple-equals': true,
            // "typeof-compare": true,
            'use-isnan': true,

            // MAINTAINABILITY CHECKS

            'cyclomatic-complexity': false,
            eofline: true,
            'max-file-line-count': [true, 600],
            // "max-classes-per-file": [true, 5],
            'no-default-export': true,
            'no-duplicate-imports': true,
            'no-mergeable-namespace': true,

            // STYLE CHECKS

            align: [true, 'parameters', 'statements'],
            'array-type': [true, 'generic'],
            'arrow-return-shorthand': true,
            'binary-expression-operand-order': true,
            'callable-types': true,
            'class-name': true,
            // "comment-format": [true, "check-space"],
            'import-spacing': true,
            'interface-name': [true, 'always-prefix'],
            'interface-over-type-literal': true,
            // "newline-before-return": true,
            'new-parens': true,
            'no-angle-bracket-type-assertion': true,
            'no-consecutive-blank-lines': [true, 2],
            'no-irregular-whitespace': true,
            'no-trailing-whitespace': true,
            'no-unnecessary-callback-wrapper': true,
            'number-literal-format': true,
            'object-literal-key-quotes': [true, 'as-needed'],
            'object-literal-shorthand': true,
            'one-variable-per-declaration': true,
            'ordered-imports': [
                true,
                {
                    'import-sources-order': 'lowercase-last',
                    'named-imports-order': 'lowercase-first',
                },
            ],
            'prefer-method-signature': true,
            semicolon: [true, 'always', 'ignore-interfaces'],
            'space-before-function-paren': [true, 'never'],
        },
    },
    // automatically fix linting errors
    fix: true,
};
