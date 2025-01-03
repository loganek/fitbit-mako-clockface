#!/bin/bash

set -euo pipefail

if [ $# -ne 1 ]; then
    echo "Usage: $0 <simulator|device>"
    exit 1
fi

DESTINATION=$1

# Set values based on the template type
if [ "$DESTINATION" = "device" ]; then
    SDK_VER="7.2.0-pre.0"
    SDK_CLI_VER="1.8.0-pre.11"
    BUILD_TARGETS='rhea'
elif [ "$DESTINATION" = "simulator" ]; then
    SDK_VER="~6.1.0"
    SDK_CLI_VER="^1.7.3"
    BUILD_TARGETS='atlas","vulcan'
else
    echo "Error: Invalid destination. Use 'simulator' or 'device'."
    exit 1
fi

sed -e "s/@SDK_VER@/$SDK_VER/g" \
    -e "s/@SDK_CLI_VER@/$SDK_CLI_VER/g" \
    -e "s/@BUILD_TARGETS@/$BUILD_TARGETS/g" \
    "package-template.json" > "package.json"

CURRENT_DESTINATION_FILE=".current_destination"

if [ -f "$CURRENT_DESTINATION_FILE" ]; then
    STORED_DESTINATION=$(cat "$CURRENT_DESTINATION_FILE")
    if [ "$STORED_DESTINATION" != "$DESTINATION" ]; then
        echo "Destination has changed (was: $STORED_DESTINATION, now: $DESTINATION). Running npm install..."
        npm install
    fi
else
    echo "Running npm install..."
    npm install
fi

echo "$DESTINATION" > "$CURRENT_DESTINATION_FILE"

