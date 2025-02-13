const toggleBtn = document.getElementById('toggleTheme');
const logo = document.getElementById('logo');
const switcher = document.getElementById('switch');
const body = document.documentElement;
const textInput = document.getElementById('textInput');
const checkboxSpaces = document.getElementById('checkboxSpaces');
const checkboxLimit = document.getElementById('checkboxLimit');
const limitInput = document.getElementById('limitInput');
const warningMessage = document.getElementById('warningMessage');
const readingTime = document.getElementById('readingTime');
const totalCharacter = document.getElementById('totalCharacter');
const wordCount = document.getElementById('wordCount');
const sentenceCount = document.getElementById('sentenceCount');
const letterDensityContainer = document.getElementById('letterDensity');
const seeMoreButton = document.createElement('button');

// User Preference from Local Storage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  logo.src = './images/logo-dark-theme.svg';
  switcher.src = './images/icon-sun.svg';
}

toggleBtn.addEventListener('click', () => {
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    logo.src = './images/logo-light-theme.svg';
    switcher.src = './images/icon-moon.svg';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark');
    logo.src = './images/logo-dark-theme.svg';
    switcher.src = './images/icon-sun.svg';
    localStorage.setItem('theme', 'dark');
  }
});

// Initialize See More Button
seeMoreButton.textContent = 'See More ▼';
seeMoreButton.className = 'text-gray-700 dark:text-gray-50 cursor-pointer';
seeMoreButton.style.display = 'none';
letterDensityContainer.parentNode.appendChild(seeMoreButton);

let showAll = false; // Toggle state

// Event Listeners
textInput.addEventListener('input', updateAnalysis);
checkboxSpaces.addEventListener('change', updateAnalysis);
limitInput.addEventListener('input', updateAnalysis);
seeMoreButton.addEventListener('click', toggleLetterDensity);

function updateAnalysis() {
  const text = textInput.value;
  const excludeSpacesFlag = checkboxSpaces.checked;


  updateLetterDensity(text);

  const charLimit = parseInt(limitInput.value) || 0;

  // Character Count
  const characterCount = excludeSpacesFlag
    ? text.replace(/\s/g, '').length //Removes all Spaces
    : text.length;
  totalCharacter.textContent = characterCount > 0 ? characterCount : '00';

  // Word Count
  const words = text
    .trim() //removes leading and trailing spaces.
    .split(/\s+/) //splits the text into an array of words using spaces as the delimiter
    .filter((word) => word.length > 0).length; //removes any empty strings from the array (e.g., caused by multiple spaces).
  wordCount.textContent = words > 0 ? words : '00';

  // Sentence Count
  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.length > 0).length;
  sentenceCount.textContent = sentences > 0 ? sentences : '00';

  // Character Limit Warning
  if (charLimit > 0 && characterCount > charLimit) {
    warningMessage.classList.remove('hidden');
    const warningParagraph = document.querySelector('#warningMessage p');
    warningParagraph.textContent = ` Limit reached! Your text exceeds ${charLimit} characters`;

    textInput.classList.add(
      'border-[#FE8159]',
      'dark:border-[#FE8159]',
      'shadow-xl'
    );
    textInput.classList.remove('border-[#E4E4EF]');
  } else {
    warningMessage.classList.add('hidden');

    textInput.classList.remove(
      'border-[#FE8159]',
      'dark:border-[#FE8159]',
      'shadow-xl'
    );
    textInput.classList.add('border-[#E4E4EF]');
  }

  // reading time
  const readingTimeMinutes = (words / 200).toFixed(1);
  readingTime.textContent = ` Approx. reading time: ${readingTimeMinutes} minutes`;
}

function updateLetterDensity(text) {
  letterDensityContainer.innerHTML = '';
  // Remove non-alphabet characters
  const cleanedText = text.replace(/[^a-zA-Z]/g, '');

  if (cleanedText.length === 0) {
    const message = document.createElement('p');
    message.textContent =
      'No characters found. Start typing to see letter density';
    message.className = 'dark:text-gray-50';
    letterDensityContainer.appendChild(message);
    return; // ✅ Stop execution if no characters are found
  }

  const letterCounts = {};
  let totalLetters = 0;

  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      // Check if it's a letter
      const letter = char.toUpperCase(); // Convert to uppercase (so "a" and "A" count as the same)
      letterCounts[letter] = (letterCounts[letter] || 0) + 1; // Count occurrences
      totalLetters++;
    }
  }

  // Sorting Letters by Frequency
  const sortedLetters = Object.entries(letterCounts).sort(
    (a, b) => b[1] - a[1]
  ); // converts the object to an array with key value pairs then sort
  seeMoreButton.style.display = sortedLetters.length > 5 ? 'block' : 'none'; // Show button if more than 5 letters
  renderLetterDensity(sortedLetters, totalLetters);
}

// Function to Render Letter Density Bars

function renderLetterDensity(sortedLetters, totalLetters) {
  letterDensityContainer.innerHTML = ''; // Clear existing bars

  const lettersToShow = showAll ? sortedLetters : sortedLetters.slice(0, 5);

  lettersToShow.forEach(([letter, count]) => {
    const percentage = ((count / totalLetters) * 100).toFixed(2);

    // Create letter density row
    const densityRow = document.createElement('div');
    densityRow.className = 'pb-2 flex items-center  w-full';

    // Letter
    const letterEl = document.createElement('p');
    letterEl.className = 'dark:text-gray-50';
    letterEl.textContent = letter;

    // Progress Bar Container
    const barContainer = document.createElement('div');
    barContainer.className =
      'rounded-md dark:bg-gray-700 bg-gray-100 h-3 ml-4 flex-1 flex items-center';

    // Progress Bar Fill
    const barFill = document.createElement('div');
    barFill.className = 'rounded-md h-3 bg-[#c27cf8]';
    barFill.style.width = `${percentage}%`; // Adjust width based on density

    // Percentage Count
    const percentEl = document.createElement('p');
    percentEl.className = 'dark:text-gray-50 ml-4';
    percentEl.textContent = `${count} (${percentage}%)`;

    // Append elements
    barContainer.appendChild(barFill);
    densityRow.appendChild(letterEl);
    densityRow.appendChild(barContainer);
    densityRow.appendChild(percentEl);
    letterDensityContainer.appendChild(densityRow);
  });

  // Update button text
  seeMoreButton.textContent = showAll ? 'Show less ▲' : 'See more ▼';
}

document.addEventListener('DOMContentLoaded', function () {
  updateLetterDensity('');
});

// Toggle "See More" Function
function toggleLetterDensity() {
  showAll = !showAll;
  updateLetterDensity(textInput.value);
}
