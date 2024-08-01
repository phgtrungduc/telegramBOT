
Deno.serve(async (_request: Request) => {
    const interval = setInterval(() => {
        getData();
    }, 1800000);
    await getData();
    return new Response("Khởi tạo app xong");
});

async function getData() {
    console.log('get data');

    const endpoint = 'https://www.binance.com/api/v3/ticker/price';
    const listCrypto = ['LINKUSDT', 'BTCUSDT'];
    let message = `<u>${formatDate()}</u> \n`;

    for (const coin of listCrypto) {
        const url = `${endpoint}?symbol=${coin}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data for ${coin}: ${response.statusText}`);
        }
        const data = await response.json();
        message += `- <b>${data.symbol}</b> - ${data.price} \n`;
    }

    await sendMessage(message);
}

async function sendMessage(message: string) {
    const token = '7386976422:AAEOhq__vL0btxPYIYadk0jAj-A2kbEBecA';
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const chatId = 6332127410;

    const data = {
        text: message,
        chat_id: chatId,
        parse_mode: 'HTML',
    };

    const body = JSON.stringify(data);
    const response = await fetch(url, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
    }
}

function formatDate() {
    const utcDate = new Date();
    // Get the UTC milliseconds
    const utcMillisecs = utcDate.getTime();

    // Calculate the offset in milliseconds for GMT+7 (7 hours)
    const gmt7Offset = 7 * 60 * 60 * 1000;

    // Add the offset to get the GMT+7 milliseconds
    const gmt7Millisecs = utcMillisecs + gmt7Offset;

    // Create a new Date object in GMT+7
    const date = new Date(gmt7Millisecs);

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