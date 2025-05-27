const express = require('express');
const fetch = require('cross-fetch'); // или node-fetch
const app = express();

// Получаем порт и токен из окружения
const PORT = process.env.PORT || 3000;
const MOYSKLAD_TOKEN = process.env.MOYSKLAD_TOKEN;

// API-маршрут
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
      console.error(`❌ Ошибка от МойСклад: ${response.status} ${response.statusText}`);
      return res.status(500).json({ error: 'Ошибка API МойСклад' });
    }

    const data = await response.json();
    const results = (data.rows || []).map(product => ({
      name: product.name,
      buyPrice: product.buyPrice?.value ? product.buyPrice.value / 100 : 0
    }));

    res.json(results);
  } catch (e) {
    console.error(`💥 Ошибка сервера: ${e.message}`);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
