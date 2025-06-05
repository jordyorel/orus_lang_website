import json
import subprocess
import tempfile
import os
import time

ORUS_INTERPRETER_PATH = "./orus"  # Update this to your actual interpreter path


def handler(event, context):
    # Ensure we have a JSON body
    try:
        body = json.loads(event.get("body", ""))
    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Request must be JSON"})
        }

    code = body.get("code")
    if not code:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No code provided"})
        }

    with tempfile.NamedTemporaryFile(suffix='.orus', delete=False) as temp_file:
        temp_filename = temp_file.name
        temp_file.write(code.encode('utf-8'))

    try:
        start_time = time.time()
        max_execution_time = 5  # seconds

        process = subprocess.Popen(
            [ORUS_INTERPRETER_PATH, temp_filename],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        while process.poll() is None:
            if time.time() - start_time > max_execution_time:
                process.kill()
                return {
                    "statusCode": 200,
                    "body": json.dumps({
                        "output": "",
                        "error": "Execution timed out after 5 seconds"
                    })
                }
            time.sleep(0.1)

        stdout, stderr = process.communicate()
        if process.returncode != 0:
            result = {"output": stdout, "error": stderr}
        else:
            result = {"output": stdout, "error": None}

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(result)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"output": "", "error": str(e)})
        }

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
