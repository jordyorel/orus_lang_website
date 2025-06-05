document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror editor
    const codeEditor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true
    });

    // Resize editor to fit container
    codeEditor.setSize('100%', '100%');

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get the target section id
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show the target section
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Documentation navigation
    const docLinks = document.querySelectorAll('.doc-link');
    const docSections = document.querySelectorAll('.doc-section');

    docLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            docLinks.forEach(link => link.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get the target section id
            const targetId = this.getAttribute('href').substring(1);

            // Hide all sections
            docSections.forEach(section => section.classList.remove('active'));

            // Show the target section
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Run button functionality
    const runButton = document.getElementById('run-button');
    const output = document.getElementById('output');

    runButton.addEventListener('click', function() {
        const code = codeEditor.getValue();
        executeOrusCode(code);
    });

    // Clear button functionality
    const clearButton = document.getElementById('clear-button');

    clearButton.addEventListener('click', function() {
        codeEditor.setValue('// Write your Orus code here\nprint("Hello, World!");');
        output.textContent = '';
    });

    // Example selector functionality
    const exampleSelect = document.getElementById('example-select');
    const examples = {
        'hello-world': '// The classic Hello World program\nprint("Hello, World!");',
        'fibonacci': '// Calculate Fibonacci numbers\nfunction fibonacci(n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}\n\nfor (let i = 0; i < 10; i++) {\n    print(fibonacci(i));\n}',
        'sorting': '// Bubble sort implementation\nfunction bubbleSort(arr) {\n    let n = arr.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                // Swap elements\n                let temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n    return arr;\n}\n\nlet numbers = [64, 34, 25, 12, 22, 11, 90];\nprint("Original array: " + numbers);\nprint("Sorted array: " + bubbleSort(numbers));'
    };

    exampleSelect.addEventListener('change', function() {
        const selectedExample = this.value;
        if (selectedExample && examples[selectedExample]) {
            codeEditor.setValue(examples[selectedExample]);
        }
    });

    // Try example buttons
    const tryExampleButtons = document.querySelectorAll('.try-example');

    tryExampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const exampleId = this.getAttribute('data-example');

            // Switch to playground section
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('a[href="#playground"]').classList.add('active');

            sections.forEach(section => section.classList.remove('active'));
            document.getElementById('playground').classList.add('active');

            // Load the example code
            if (exampleId && examples[exampleId]) {
                codeEditor.setValue(examples[exampleId]);
                exampleSelect.value = exampleId;
            }
        });
    });

    // Real Orus interpreter via backend API
    function executeOrusCode(code) {
        output.textContent = 'Running...';

        // Disable the run button while code is executing
        runButton.disabled = true;
        runButton.textContent = 'Running...';

        fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
        })
        .then(response => response.json())
        .then(data => {
            output.textContent = '';

            if (data.output) {
                output.textContent += data.output;
            }

            if (data.error) {
                output.textContent += '\nError: ' + data.error;
            }

            // If there's no output or error, show a message
            if (!data.output && !data.error) {
                output.textContent = 'Program executed successfully with no output.';
            }
        })
        .catch(error => {
            output.textContent = 'Error connecting to the server: ' + error.message;
        })
        .finally(() => {
            // Re-enable the run button
            runButton.disabled = false;
            runButton.textContent = 'Run Code';
        });
    }
});
