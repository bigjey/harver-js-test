const { getRandomWordSync, getRandomWord } = require('word-maker');

// YOUR CODE HERE

const fs = require('fs');
const path = require('path');

const RESULTS_FOLDER = path.join(__dirname, '..', 'results');

const WORD_ON_ERROR = 'Doh!';
const WORD_FIZZ = 'Fizz';
const WORD_BUZZ = 'Buzz';
const WORD_FIZZBUZZ = 'FizzBuzz';

function generateWords(count = 20) {
  let words = new Array(count);
  let w;

  for (let i = 1; i <= count; i++) {
    if (isFizzBuzz(i)) {
      w = getFizzBuzzWord(i);
    } else {
      try {
        w = getRandomWordSync({ withErrors: true });
      } catch (e) {
        w = WORD_ON_ERROR;
      }
    }

    words[i - 1] = w;
  }

  return words;
}

async function generateWordsAsync(count = 20) {
  let words = new Array(count);
  let w;

  for (let i = 1; i <= count; i++) {
    if (isFizzBuzz(i)) {
      w = getFizzBuzzWord(i);
    } else {
      w = getRandomWord({ withErrors: true }).catch((e) => WORD_ON_ERROR);
    }

    words[i - 1] = w;
  }

  return Promise.all(words);
}

function outputToConsole(words = []) {
  words.forEach((w) => console.log(w));
}

function outputToFile(data, filename = defaultFileName()) {
  if (!fs.existsSync(RESULTS_FOLDER)) {
    fs.mkdirSync(RESULTS_FOLDER);
  }

  fs.writeFileSync(path.join(RESULTS_FOLDER, filename), data);
}

function isFizzBuzz(i = 0) {
  return i % 3 === 0 || i % 5 === 0;
}

function getFizzBuzzWord(i) {
  if (i % 3 === 0 && i % 5 === 0) {
    return WORD_FIZZBUZZ;
  } else if (i % 3 === 0) {
    return WORD_FIZZ;
  } else if (i % 5 === 0) {
    return WORD_BUZZ;
  } else {
    return WORD_ON_ERROR;
  }
}

function formatWord(w = '', i = 0) {
  return `${i + 1}: ${w}`;
}

function defaultFileName() {
  return `words_${Date.now()}.txt`;
}

// sync
try {
  const words = generateWords(100);
  const output = words.map(formatWord);

  outputToConsole(output);
  outputToFile(output.join('\n'), 'words.txt');

  console.log(`\nsync: Done!\n`);
} catch (e) {
  console.log(`\nsync: Something went wrong\n`);
  console.log(e.message);
}

// async
(async function() {
  try {
    const words = await generateWordsAsync(100);
    const output = words.map(formatWord);

    outputToConsole(output);
    outputToFile(output.join('\n'), 'words_async.txt');

    console.log(`\nasync: Done!\n`);
  } catch (e) {
    console.log(`\nasync: Something went wrong\n`);
    console.log(e.message);
  }
})();
