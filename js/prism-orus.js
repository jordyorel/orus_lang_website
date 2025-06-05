// Custom Prism.js language definition for Orus
(function (Prism) {
    Prism.languages.orus = {
        'comment': {
            pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
            greedy: true
        },
        'string': {
            pattern: /"(?:\\.|[^\\"])*"/,
            greedy: true
        },
        'keyword': /\b(?:let|fn|return|if|else|elif|while|for|in|break|continue|struct|impl|and|or|nil|self|print)\b/,
        'boolean': /\b(?:true|false)\b/,
        'function': {
            pattern: /\b[a-z_]\w*(?=\s*\()/i,
            greedy: true
        },
        'number': /\b(?:0x[a-f\d]+|\d+(?:\.\d*)?(?:e[+-]?\d+)?)\b/i,
        'operator': /[-+*\/%=!<>]=?|[&|^~]|\.{2}\.?/,
        'punctuation': /[{}[\];(),.:]/,
        'type': {
            pattern: /\b(?:i32|u32|f64|bool|string)\b/,
            alias: 'class-name'
        },
        'builtin': {
            pattern: /\b(?:print)\b/,
            alias: 'function'
        },
        'important': {
            pattern: /->/,
            alias: 'operator'
        },
        'range': {
            pattern: /\.\./,
            alias: 'operator'
        },
        'property': {
            pattern: /\.\w+/,
            inside: {
                'punctuation': /\./
            }
        }
    };
}(Prism));
