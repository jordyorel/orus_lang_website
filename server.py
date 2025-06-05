from flask import Flask, request, jsonify
import subprocess
import tempfile
import os

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024  # Limit request size to 16KB

# Configure this path to point to your Orus interpreter
ORUS_INTERPRETER_PATH = "./orus"  # Update this to your actual interpreter path

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/execute', methods=['POST'])
def execute_code():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    
    if 'code' not in data:
        return jsonify({"error": "No code provided"}), 400
    
    code = data['code']
    
    # Create a temporary file for the code
    with tempfile.NamedTemporaryFile(suffix='.orus', delete=False) as temp_file:
        temp_filename = temp_file.name
        temp_file.write(code.encode('utf-8'))
    
    try:
        # Execute the Orus interpreter with the temporary file
        result = subprocess.run(
            [ORUS_INTERPRETER_PATH, temp_filename],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode != 0:
            return jsonify({
                "output": result.stdout,
                "error": result.stderr
            })

        return jsonify({
            "output": result.stdout,
            "error": None
        })

    except subprocess.TimeoutExpired:
        return jsonify({
            "output": "",
            "error": "Execution timed out after 5 seconds"
        })

    except Exception as e:
        return jsonify({
            "output": "",
            "error": str(e)
        })
    
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == '__main__':
    # Use static_folder to serve the website files
    app.static_folder = '.'
    app.run(debug=True, port=8000)
