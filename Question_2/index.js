const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;


const WINDOW_SIZE = 20;
const TIMEOUT = 500; 

let numbersQueue = [];

const fetchNumbersFromTestServer = async (numberId) => {
  let apiEndpoint = '';
  switch (numberId) {
    case 'p':
      apiEndpoint = 'primes';
      break;
    case 'f':
      apiEndpoint = 'fibo';
      break;
    case 'e':
      apiEndpoint = 'even';
      break;
    case 'r':
      apiEndpoint = 'rand';
      break;
    default:
      throw new Error('Invalid number ID');
  }

  try {
    const response = await axios.get(`http://localhost:3000/test/${apiEndpoint}`);
    console.log(`Received numbers from ${apiEndpoint}:`, response.data.numbers);
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers:', error);
    throw error;
  }
};

const filterUniqueNumbers = (numbers) => {
  return [...new Set(numbers)];
};

const calculateAverage = (numbers) => {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
};

const updateNumbersQueue = (newNumbers) => {
  if (numbersQueue.length === WINDOW_SIZE) {
    numbersQueue.shift(); 
  }
  numbersQueue = [...numbersQueue, ...newNumbers]; 
  numbersQueue = filterUniqueNumbers(numbersQueue); 
};

const fetchAndProcessNumbers = async (req, res, numberId) => {
  try {
    const startFetchTime = Date.now();

    const receivedNumbers = await fetchNumbersFromTestServer(numberId);

    const endFetchTime = Date.now();
    const fetchDuration = endFetchTime - startFetchTime;

    if (fetchDuration > TIMEOUT) {
      throw new Error('Timeout exceeded');
    }

    updateNumbersQueue(receivedNumbers);

    const avg = calculateAverage(numbersQueue);

    res.json({
      numbers: receivedNumbers,
      windowPrevState: numbersQueue.slice(-WINDOW_SIZE - receivedNumbers.length, -WINDOW_SIZE),
      windowCurrState: numbersQueue.slice(-WINDOW_SIZE),
      avg: avg.toFixed(2),
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.use(express.json());

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;

  try {
    await fetchAndProcessNumbers(req, res, numberid);
  } catch (error) {
    console.error('Error in request processing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
