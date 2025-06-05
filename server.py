from flask import Flask, request, jsonify
import subprocess
import tempfile
import os
import time

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
        # Set a timeout for execution (5 seconds)
        start_time = time.time()
        max_execution_time = 5  # seconds
        
        # Execute the Orus interpreter with the temporary file
        process = subprocess.Popen(
            [ORUS_INTERPRETER_PATH, temp_filename],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait for the process to complete with timeout
        while process.poll() is None:
            if time.time() - start_time > max_execution_time:
                process.kill()
                return jsonify({
                    "output": "",
                    "error": "Execution timed out after 5 seconds"
                })
            time.sleep(0.1)
        
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            return jsonify({
                "output": stdout,
                "error": stderr
            })
        
        return jsonify({
            "output": stdout,
            "error": None
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
