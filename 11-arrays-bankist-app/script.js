'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const sortedMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  sortedMovements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const createUserNames = accounts =>
  accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );
const calculateBalance = account => {
  account.balance = account.movements.reduce(
    (account, movement) => account + movement,
    0
  );
  labelBalance.textContent = `${account.balance} EUR`;
};
const calculateSummary = account => {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest}€`;
};
const updateUI = account => {
  displayMovements(account.movements);
  calculateBalance(account);
  calculateSummary(account);
};

createUserNames(accounts);

// Event handlers
let currentAccount;
let isSorted = false;

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    amount <= currentAccount.balance &&
    receiverAccount !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});
btnClose.addEventListener('click', e => {
  e.preventDefault();

  const closeAccountUsername = inputCloseUsername.value;
  const closeAccountPin = Number(inputClosePin.value);

  if (
    closeAccountUsername === currentAccount.username &&
    closeAccountPin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === closeAccountUsername
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);
// const calcDisplayBalance = movements => {
//   const balance = movements.reduce((acc, cur) => acc + cur, 0);
//   labelBalance.textContent = `${balance}€`;
// };
// const calcDisplaySummary = movements => {
//   const incomes = movements
//     .filter(mov => mov > 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumIn.textContent = `${incomes}€`;

//   const outcome = movements
//     .filter(mov => mov < 0)
//     .reduce((acc, cur) => acc + cur, 0);
//   labelSumOut.textContent = `${Math.abs(outcome)}€`;

//   const interest = movements
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * 1.2) / 100)
//     .filter((int, i, arr) => int >= 1)
//     .reduce((acc, cur) => acc + cur, 0);

//   labelSumInterest.textContent = `${interest}€`;
// };
// calcDisplaySummary(account1.movements);
// const user = 'Steven Thomas Williams';
// const createUserNames = accounts =>
//   accounts.forEach(
//     account =>
//       (account.userName = account.owner
//         .toLowerCase()
//         .split(' ')
//         .map(name => name[0])
//         .join(''))
//   );
// createUserNames(accounts);
// const groupedAccounts = Object.groupBy(accounts, account => account.type);
// console.log(groupedAccounts);
// const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUI);
// labelBalance.addEventListener('click', () => {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);
// });
const { deposits, withdrawals } = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sums, cur) => {
      sums['deposits'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

const convertTitleCase = title => {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a new title for practise'));
console.log(convertTitleCase('second title and the third is comming'));
console.log(convertTitleCase('development town hall meeting'));
///////////////////////////////////////
// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// ---------- Helpers ----------
const rec = dog => dog.weight ** 0.75 * 28;
// "Okay" means within 10% above/below the recommended portion
const isOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
const isTooMuch = dog => dog.curFood > dog.recFood * 1.1;
const isTooLittle = dog => dog.curFood < dog.recFood * 0.9;

// 1. Add recommended food portion to each dog (mutating the existing objects; no new array)
dogs.forEach(dog => {
  dog.recFood = rec(dog); // not rounding to keep precision; round if you prefer: Math.round(...)
});
// 2. Find Sarah's dog and log whether it eats too much or too little (or okay)
const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
if (sarahsDog) {
  const msg = isTooMuch(sarahsDog)
    ? 'too much'
    : isTooLittle(sarahsDog)
    ? 'too little'
    : 'an okay amount';
  console.log(`Sarah's dog is eating ${msg}.`);
}

// 3. Arrays of owners whose dogs eat too much / too little
const ownersTooMuch = dogs.filter(isTooMuch).flatMap(dog => dog.owners);

const ownersTooLittle = dogs.filter(isTooLittle).flatMap(dog => dog.owners);

// 4. Log strings for those owner arrays
if (ownersTooMuch.length)
  console.log(`${ownersTooMuch.join(' and ')}'s dogs eat too much!`);
else
  console.log(
    'No owners have dogs that eat too much based on the 10% threshold.'
  );

if (ownersTooLittle.length)
  console.log(`${ownersTooLittle.join(' and ')}'s dogs eat too little!`);
else
  console.log(
    'No owners have dogs that eat too little based on the 10% threshold.'
  );

// 5. Is there ANY dog eating EXACTLY the recommended amount?
console.log(dogs.some(dog => dog.curFood === dog.recFood)); // true/false

// 6. Are ALL dogs eating an OKAY amount?
console.log(dogs.every(isOkay)); // true/false

// 7. Array of dogs that are eating an OKAY amount
const dogsOkay = dogs.filter(isOkay);
console.log(dogsOkay);

// 8. Group dogs into 'exact', 'too-much', 'too-little'
const groupedByEating = dogs.reduce(
  (acc, dog) => {
    if (dog.curFood === dog.recFood) acc['exact'].push(dog);
    else if (isTooMuch(dog)) acc['too-much'].push(dog);
    else if (isTooLittle(dog)) acc['too-little'].push(dog);
    // Dogs that are "okay" but not exact are intentionally not placed in any of these 3 buckets
    return acc;
  },
  { exact: [], 'too-much': [], 'too-little': [] }
);
console.log(groupedByEating);

// 9. Group dogs by number of owners they have
const groupedByOwnersCount = dogs.reduce((acc, dog) => {
  const n = dog.owners.length;
  (acc[n] ??= []).push(dog);
  return acc;
}, {});
console.log(groupedByOwnersCount);

// 10. Sort dogs by recommended food portion ASC without mutating original
const dogsByRecAsc = [...dogs].sort((a, b) => a.recFood - b.recFood);
console.log(dogsByRecAsc);

///////////////////////////////////////
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];

// // 1.
// const huskyWeight = breeds.find(b => b.breed === 'Husky').averageWeight;
// console.log(huskyWeight);

// // 2.
// const dogsRunningFetchActivities = breeds.filter(
//   b => b.activities.includes('running') && b.activities.includes('fetch')
// );
// console.log(dogsRunningFetchActivities);

// // 3.
// const allActivities = breeds.map(b => b.activities).flat();
// console.log(allActivities);

// // 4.
// const uniqueActivities = new Set(breeds.map(b => b.activities).flat());
// console.log(uniqueActivities);

// // 5.
// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter(b => b.activities.includes('swimming'))
//       .flatMap(b => b.activities)
//   ),
// ];
// console.log(swimmingAdjacent);

// // 6.
// const avgMore10kg = breeds.every(b => b.averageWeight >= 10);
// console.log(avgMore10kg);

// // 7.
// const someActiveDogs = breeds.some(b => b.activities.length > 2);
// console.log(someActiveDogs);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]
*/

// const calculateAverageHumanAge = dogs =>
//   dogs
//     .map(age => (age > 2 ? 16 + age * 4 : 2 * age))
//     .filter(d => d > 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// calculateAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
*/

// const checkDogs = (dogsJulia, dogsKate) => {
//   console.log(dogsJulia);
//   const correctedDogsArr = dogsJulia.slice(1, -1);
//   const combined = [...correctedDogsArr, ...dogsKate];
//   combined.forEach((dog, index, _) => {
//     const str =
//       dog < 3
//         ? `Dog number ${index + 1} is still a puppy 🐶`
//         : `Dog number ${index + 1} is an adult, and is ${dog} years old`;
//     console.log(str);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
