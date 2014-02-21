#!/bin/sh
(( ${#} > 0 )) || {
  echo 'DISCLAIMER: USE THIS SCRIPT AT YOUR OWN RISK!'
  echo 'THE AUTHOR TAKES NO RESPONSIBILITY FOR THE RESULTS OF THIS SCRIPT.'
  echo "Disclaimer aside, this worked for the author, for what that's worth."
  echo 'Press Control-C to quit now.'
  read
  echo 'Re-running the script with sudo.'
  echo 'You may be prompted for a password.'
  sudo ${0} sudo
  exit $?
}
# This will need to be executed as an Admin (maybe just use sudo).

# Verify the bom exists, otherwise don't do anything
[ -e /var/db/receipts/org.nodejs.pkg.bom ] || {
  echo 'Nothing to do.'
  exit 0
}

# Loop through all the files in the bom.
lsbom -f -l -s -pf /var/db/receipts/org.nodejs.pkg.bom \
| while read i; do
  # Remove each file listed in the bom.
  rm /usr/local/${i}
done

# Remove directories related to node.js.
rm -rf /usr/local/lib/node \
  /usr/local/lib/node_modules \
  /var/db/receipts/org.nodejs.*

exit 0
