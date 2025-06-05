from flask import Flask, request, jsonify, send_from_directory
import subprocess
import tempfile
import os

app = Flask(__name__, static_url_path='')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024  # Limit request size to 16KB

# Configure this path to point to your Orus interpreter
ORUS_INTERPRETER_PATH = "/usr/local/bin/orus"  # Path to your Orus interpreter

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

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
    app.run(debug=True, port=8002)
