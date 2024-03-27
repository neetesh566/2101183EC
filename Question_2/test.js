const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const generatePrimes = (count) => {
  const primes = [];
  let num = 2;
  while (primes.length < count) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  return primes;
};

const isPrime = (num) => {
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return num !== 1;
};

const generateFibonacci = (count) => {
  const fibonacci = [1, 1];
  for (let i = 2; i < count; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
  }
  return fibonacci;
};

const generateEvenNumbers = (count) => {
  const evens = [];
  let num = 2;
  while (evens.length < count) {
    evens.push(num);
    num += 2;
  }
  return evens;
};

const generateRandomNumbers = (count) => {
  const randoms = [];
  for (let i = 0; i < count; i++) {
    randoms.push(Math.floor(Math.random() * 100) + 1);
  }
  return randoms;
};

app.get('/test/primes', (req, res) => {
  const numbers = generatePrimes(15);
  res.json({ numbers });
});

app.get('/test/fibo', (req, res) => {
  const numbers = generateFibonacci(15);
  res.json({ numbers });
});

app.get('/test/even', (req, res) => {
  const numbers = generateEvenNumbers(25);
  res.json({ numbers });
});

app.get('/test/rand', (req, res) => {
  const numbers = generateRandomNumbers(15);
  res.json({ numbers });
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
