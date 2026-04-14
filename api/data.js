import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // CORS настройки, за да може сайтът да чете данните без проблеми
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. ПРИЕМАНЕ НА ДАННИ ОТ ESP8266 (POST)
    if (req.method === 'POST') {
        try {
            const { temp, ec, tds, dist } = req.body;
            
            // Валидация на данните
            if (temp === undefined) {
                return res.status(400).json({ error: 'Missing data' });
            }

            const payload = {
                temp: parseFloat(temp),
                ec: parseFloat(ec),
                tds: parseFloat(tds),
                dist: parseInt(dist),
                lastUpdate: new Date().toISOString()
            };

            // Записваме в Redis
            await kv.set('sensor_data', payload);
            
            console.log('Data saved to Redis:', payload);
            return res.status(200).json({ status: 'OK' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 2. ИЗПРАЩАНЕ НА ДАННИ КЪМ САЙТА (GET)
    if (req.method === 'GET') {
        try {
            const data = await kv.get('sensor_data');
            if (!data) {
                return res.status(200).json({ temp: 0, ec: 0, tds: 0, dist: 0, msg: "No data" });
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
