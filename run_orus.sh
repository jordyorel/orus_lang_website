#!/bin/bash

# Path to your Orus interpreter
ORUS_PATH="./orus"  # Update this to your actual interpreter path

# Create a temporary file
TEMP_FILE=$(mktemp --suffix=.orus)

# Write the code to the temporary file
echo "$1" > "$TEMP_FILE"

# Run the Orus interpreter
$ORUS_PATH "$TEMP_FILE"

# Capture the exit code
EXIT_CODE=$?

# Clean up
rm "$TEMP_FILE"

# Return the exit code
exit $EXIT_CODE
