// Import necessary libraries
const readline = require('readline');

// Define the paragraphs object
const paragraphs = {
    1: {
        'a': ['banana', 'camera', 'apple', 'guitar', 'car', 'sun', 'ball', 'star', 'map', 'cake', 'fan', 'flag', 'bat', 'hat', 'cup'],
        'b': ['rabbit', 'computer', 'bear', 'robot', 'cabbage', 'tab', 'tube', 'cobweb', 'bib', 'abbot', 'bubbly', 'barb', 'barb', 'crab', 'dab'],
        'c': ['cowboy', 'cool', 'comic', 'ceiling', 'carrot', 'corn', 'comb', 'cupcake', 'coin', 'coconut', 'cat', 'picnic', 'comic', 'ocean', 'pencil']
    },
    2: {
        'd': ['saddle', 'bandit', 'cold', 'food', 'cloud', 'cuddle', 'doodle', 'duck', 'bed', 'red', 'door', 'bed', 'ad', 'dad', 'dog'],
        'e': ['bedside', 'bee', 'peel', 'bedtime', 'been', 'deli', 'pedal', 'peanut', 'beekeeper', 'see', 'bet', 'seed', 'belt', 'menu', 'beef'],
        'f': ['flame', 'elf', 'elf', 'flute', 'flame', 'half', 'roof', 'free', 'off', 'fun', 'fit', 'off', 'sofa', 'fog', 'gift']
    },
    3: {
        'g': ['ragged', 'dogged', 'egg', 'gaggle', 'piggy', 'giggle', 'haggard', 'maggot', 'giggle', 'gaggle', 'rug', 'log', 'egg', 'peg', 'leg'],
        'h': ['horse', 'hat', 'heart', 'house', 'helicopter', 'hammer', 'honey', 'harp', 'hare', 'hedgehog', 'hurricane', 'horseshoe', 'hydrant', 'hydrangea', 'harbor'],
        'i': ['snail', 'tail', 'milk', 'kite', 'slide', 'six', 'swim', 'mix', 'river', 'carrot', 'finish', 'box', 'thimble', 'shoe', 'radio']
    },
    4: {
        'j': ['jump', 'jam', 'juice', 'jacket', 'join', 'jelly', 'jail', 'juice', 'jeep', 'jet', 'joy', 'just', 'glove', 'jewel', 'jaguar'],
        'k': ['kick', 'skill', 'lake', 'snake', 'wake', 'bike', 'kite', 'ink', 'park', 'stalk', 'keel', 'seek', 'hack', 'sink', 'sick'],
        'l': ['tell', 'yell', 'hill', 'tell', 'tall', 'tell', 'toll', 'tell', 'toll', 'toll', 'tell', 'tell', 'tell', 'tall', 'roll']
    },
    5: {
        'm': ['climb', 'thumb', 'warm', 'lamp', 'comb', 'comb', 'firm', 'room', 'room', 'calm', 'storm', 'room', 'roam', 'firm', 'sum'],
        'n': ['fine', 'rain', 'bone', 'fine', 'pen', 'bone', 'rain', 'open', 'mean', 'tone', 'can', 'ban', 'pen', 'cane', 'run'],
        'o': ['cold', 'top', 'odd', 'old', 'odd', 'cold', 'mud', 'do', 'lod', 'lid', 'hold', 'dot', 'odd', 'cold', 'pod']
    },
    6: {
        'p': ['stop', 'slop', 'tap', 'top', 'sip', 'slop', 'wisp', 'tap', 'tap', 'top', 'pen', 'tap', 'lip', 'tip', 'pop'],
        'q': ['quit', 'quiet', 'quick', 'quest', 'quest', 'quilt', 'squint', 'quiet', 'quit', 'squash', 'squint', 'squint', 'squint', 'quest', 'quest'],
        'r': ['word', 'tour', 'bore', 'part', 'form', 'part', 'port', 'corn', 'part', 'bore', 'part', 'port', 'part', 'port', 'cart']
    },
    7: {
        's': ['fast', 'post', 'silt', 'last', 'sort', 'soft', 'fish', 'spin', 'scent', 'just', 'rest', 'less', 'miss', 'test', 'sort'],
        't': ['meet', 'part', 'post', 'test', 'west', 'heat', 'silt', 'text', 'left', 'soft', 'rest', 'best', 'lost', 'test', 'fast'],
        'u': ['fuel', 'rung', 'unit', 'plug', 'buzz', 'bulk', 'duck', 'rust', 'hurl', 'bump', 'wink', 'dump', 'rust', 'gulp', 'lung']
    },
    8: {
        'v': ['shove', 'love', 'have', 'have', 'live', 'give', 'have', 'have', 'have', 'have', 'have', 'have', 'have', 'have', 'have'],
        'w': ['swirl', 'worm', 'word', 'were', 'wear', 'were', 'were', 'were', 'were', 'were', 'were', 'were', 'were', 'were', 'were'],
        'x': ['ax', 'box', 'ex', 'box', 'ox', 'box', 'box', 'box', 'box', 'box', 'box', 'box', 'box', 'box', 'box']
    },
    9: {
        'y': ['by', 'way', 'way', 'way', 'way', 'way', 'way', 'way', 'way', 'way', 'way', 'way', 'way', 'way', 'way'],
        'z': ['buzz', 'fez', 'zig', 'zap', 'zip', 'zap', 'zap', 'zap', 'zap', 'zap', 'zap', 'zap', 'zap', 'zap', 'zap']
    }
};

// Define the game logic

let currentLetter = 'a';
let wordsTyped = 0;
let accuracy = 0;
let cpm = 0;
let duration_seconds = 0;
let weakCharacters = [];

function startGame() {
    console.log(`Level ${currentLevel} - Letter ${currentLetter.toUpperCase()}`);
    displayWords(currentLetter);
    (readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })).question('Type the words: ', (input) => {
        const words = input.split(' ');
        const expectedWords = paragraphs[currentLevel][currentLetter];
        let correctWords = 0;
        let totalChars = 0;
        let totalTime = 0;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (expectedWords.includes(word)) {
                correctWords++;
                totalChars += word.length;
                totalTime += word.length;
            } else {
                weakCharacters.push(word);
            }
        }

        wordsTyped += correctWords;
        accuracy = (correctWords / words.length) * 100;
        cpm = (totalChars / totalTime) * 60;
        duration_seconds = totalTime;

        console.log(`Words Typed: ${wordsTyped}`);
        console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
        console.log(`CPM: ${cpm.toFixed(2)}`);
        console.log(`Duration: ${duration_seconds.toFixed(2)} seconds`);
        console.log(`Weak Characters: ${weakCharacters.join(', ')}`);

        if (correctWords / words.length >= 0.75) {
            currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
            if (currentLetter > 'z') {
                currentLevel++;
                currentLetter = 'a';
            }
            (readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })).question('Press Enter to continue to the next level...', () => {
                startGame();
            });
        } else {
            (readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })).question('Press Enter to try again...', () => {
                startGame();
            });
        }
    });
}

function displayWords(letter) {
    const words = paragraphs[currentLevel][letter];
    console.log(words.join(', '));
}

startGame();
// Function to calculate WPM, accuracy, and duration
function calculateMetrics(input, target) {
  const startTime = performance.now();
  const inputChars = input.replace(/\s/g, '').length;
  const targetChars = target.replace(/\s/g, '').length;
  const accuracy = (inputChars === targetChars) ? 1 : inputChars / targetChars;
  const duration = (performance.now() - startTime) / 1000;
  const wpm = (inputChars / 5) / (duration / 60);
  return { wpm, accuracy, duration_seconds: duration };
}

// Function to find weak characters (typos)
function findWeakCharacters(input, target) {
  const weakChars = [];
  for (let i = 0; i < target.length; i++) {
    if (input[i] !== target[i]) {
      weakChars.push(target[i]);
    }
  }
  return weakChars;
}

// Interactive command-line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let currentLevel = 'a';
let currentIndex = 0;
let completionRate = 0;

function nextLevel() {
  const levels = Object.keys(dataset);
  const currentLevelIndex = levels.indexOf(currentLevel);
  if (currentLevelIndex < levels.length - 1 && completionRate >= 0.75) {
    currentLevel = levels[currentLevelIndex + 1];
    currentIndex = 0;
    completionRate = 0;
    console.log(`Moving to level ${currentLevel}`);
  } else {
    console.log('You must complete at least 75% of the current level to move on.');
  }
}

function processInput(input) {
  const target = dataset[currentLevel][currentIndex];
  const { wpm, accuracy, duration_seconds } = calculateMetrics(input, target);
  const weakChars = findWeakCharacters(input, target);

  console.log(`Target word: ${target}`);
  console.log(`Your input: ${input}`);
  console.log(`WPM: ${wpm.toFixed(2)}`);
  console.log(`Accuracy: ${(accuracy * 100).toFixed(2)}%`);
  console.log(`Duration: ${duration_seconds.toFixed(2)} seconds`);
  console.log(`Weak characters: ${weakChars.join(', ')}`);

  completionRate = (currentIndex + 1) / dataset[currentLevel].length;
  console.log(`Completion rate: ${(completionRate * 100).toFixed(2)}%`);

  currentIndex++;
  if (currentIndex === dataset[currentLevel].length) {
    nextLevel();
  } else {
    (readline.createInterface({
          input: process.stdin,
          output: process.stdout
      })).question('Press Enter to continue to the next word: ', (input) => {
      processInput(input);
    });
  }
}

(readline.createInterface({
    input: process.stdin,
    output: process.stdout
})).question('Press Enter to start typing the first word: ', (input) => {
  processInput(input);
});
