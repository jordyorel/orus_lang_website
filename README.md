# Orus Programming Language Website

This is a website for the Orus programming language, allowing users to learn about the language and test it in an interactive playground.

## Setup Instructions

### Prerequisites

- Python 3.6 or higher
- Flask (Python web framework)
- Your local Orus interpreter

### Installation

1. Clone this repository
2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
3. Configure the Orus interpreter path in `server.py`:
   ```python
   # Configure this path to point to your Orus interpreter
   ORUS_INTERPRETER_PATH = "./orus"  # Update this to your actual interpreter path
   ```

### Running the Website

1. Start the Flask server:
   ```
   python server.py
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Features

- Interactive playground to test Orus code
- Code examples
- Documentation
- Integration with your local Orus interpreter

## How It Works

The website sends Orus code to a backend server, which:
1. Creates a temporary file with the code
2. Executes the Orus interpreter on that file
3. Captures the output and returns it to the website

## Alternative Setup Options

### Option 1: Using a Static Website with WebAssembly (Future Enhancement)

If your Orus interpreter can be compiled to WebAssembly, you could integrate it directly into the website without needing a backend server.

### Option 2: Using a Simple HTTP Server (Current Implementation)

The current implementation uses a Flask server to handle both serving the website and executing Orus code.

## Customization

- Update the examples in `js/main.js` to showcase your language features
- Modify the documentation in `index.html` to accurately describe your language
- Adjust the styling in `css/styles.css` to match your preferred design

## License

This project is licensed under the [MIT License](LICENSE).
