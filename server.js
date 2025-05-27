const express = require('express');
const { default: fetch } = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// ❗ Вставь СВОЙ токен от МойСклад:
const MOYSKLAD_TOKEN = 'e8320dad39a7d569c5dd72955373dada79747a77';

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    const url = `https://api.moysklad.ru/api/remap/1.2/entity/product?search= ${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${MOYSKLAD_TOKEN}`,
        'Accept': 'application/json;charset=utf-8'
      }
    });

    if (!response.ok) {
      console.error(`Ошибка от МойСклад: ${response.statusText}`);
      return res.status(500).json({ error: 'Ошибка API МойСклад' });
    }

    const data = await response.json();
    res.json(data.rows || []);
  } catch (e) {
    console.error(`💥 Ошибка: ${e.message}`);
    res.status(500).json({ error: 'Внутренняя ошибка', details: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
