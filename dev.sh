#!/bin/bash

# This code is a shell script that toggles between development and production modes for a web application.
# It takes a single argument, either "dev" or "prod":
# modifies specific files by uncommenting or commenting out lines containing specific markers ("// DEVELOPMENT" and "// PRODUCTION")

# Array of file paths
files=("server/db.js" "server/index.js" "src/lib/api.js")

# Check the first parameter
if [ "$1" == "dev" ]; then
    for file in "${files[@]}"; do
        # Use sed to uncomment lines containing // DEVELOPMENT
        sed -i '' 's/^\/\/\(.*DEVELOPMENT\)/\1/' "$file"
    done

    for file in "${files[@]}"; do
        # Use sed to comment lines containing PRODUCTION if they are not already commented
        sed -i '' '/^\/\/.*PRODUCTION/!s/^\(.*PRODUCTION\)/\/\/\1/' "$file"
    done
elif [ "$1" == "prod" ]; then
    for file in "${files[@]}"; do
        # Use sed to comment lines containing DEVELOPMENT if they are not already commented
        sed -i '' '/^\/\/.*DEVELOPMENT/!s/^\(.*DEVELOPMENT\)/\/\/\1/' "$file"
    done

    for file in "${files[@]}"; do
        # Use sed to uncomment lines containing // PRODUCTION
        sed -i '' 's/^\/\/\(.*PRODUCTION\)/\1/' "$file"
    done
else
    echo "Invalid argument. Please use 'dev' or 'prod'."
fi