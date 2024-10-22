# NY Times Connection Google Extension

An extension that provides unlimited guesses for the NY Times connections game.

## Installation

1. Download and extract the repo. 
2. Navigate to `chrome://extensions`, in your Chrome browser.
3. Click "Load unpacked" (top left) and find the locally downloaded directory. 

From here it should just work automatically. 

## What to expect

Everytime you submit and answer that is wrong, the plugin will not mark this as an
attempt. 

Only once a guess is correct will the guess be attempted. 

## Future improvements

* Provide a variable number of guesses defined by the user. 
* Still provide information for attempts
  * "Already guessed"
  * "One away"

## Tests

`npm test`