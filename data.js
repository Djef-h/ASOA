// api/data.js
let lastData = {}; // Тук ще се пазят последните данни в паметта на сървъра

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Когато ESP8266 изпраща данни
    lastData = req.body;
    console.log("Получени данни от ESP:", lastData);
    return res.status(200).json({ message: "Данните са получени!", data: lastData });
  } else {
    // Когато сайтът иска да прочете данните (GET)
    return res.status(200).json(lastData);
  }
}
