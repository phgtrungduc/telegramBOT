var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async(req, res, next) => {
  getData();
  setInterval(() => {
    getData();
  }, 1800000);
  res.json();
});

async function getData() {
  const endpoint = 'https://www.binance.com/api/v3/ticker/price';
  var listCrypto = ['LINKUSDT', 'BTCUSDT'];
  let time = new Date();
  let message = `<u>${formatDate(time)}</u> \n`;
  for (let i = 0; i < listCrypto.length; i++) {
    const coin = listCrypto[i];
    let url = `${endpoint}?symbol=${coin}`;
    let response = await axios.get(url);
    message += `- <b>${response.data.symbol}</b> - ${response.data.price} \n`; 
  }
  await sendMessage(message);
}

async function sendMessage(message) {
  const token = '7386976422:AAEOhq__vL0btxPYIYadk0jAj-A2kbEBecA'
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const chatId = 6332127410;
  await axios.post(url, {
    text: message,
    chat_id: chatId,
    parse_mode: 'HTML'
  })
}

function formatDate(date) {
  // Get the time components
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Get the date components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed
  const year = date.getFullYear();

  // Format the time
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Format the date
  const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;

  // Combine the formatted time and date
  const formattedDateTime = `${formattedTime} ${formattedDate}`;

  return formattedDateTime;
}


module.exports = router;
