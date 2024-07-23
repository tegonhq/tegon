#!/usr/bin/env bash

# The first part wrapped in a function
makeSedCommands() {
  printenv | \
      grep  '^NEXT_PUBLIC' | \
      sed -r "s/=/ /g" | \
      xargs -n 2 bash -c 'echo "sed -i \"s#PROD_$0#$1#g\""'
}

# Set the delimiter to newlines (needed for looping over the function output)
IFS=$'\n'
# For each sed command
for c in $(makeSedCommands); do
  # For each file in the .next directory
  for f in $(find apps/frontend/.next -type f); do
    # Execute the command against the file
    COMMAND="$c $f"
    eval $COMMAND
  done
done

echo "Starting Nextjs"
# Run any arguments passed to this script
exec "$@"

exec dumb-init node --max-old-space-size=8192 apps/frontend/server.js