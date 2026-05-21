import { put } from '@vercel/blob';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Метод не поддерживается' });
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Нет изображения' });
    const base64Data = image.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = await put(`trees/${Date.now()}.jpg`, buffer, { access: 'public', contentType: 'image/jpeg' });
    res.status(200).json({ url: blob.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
