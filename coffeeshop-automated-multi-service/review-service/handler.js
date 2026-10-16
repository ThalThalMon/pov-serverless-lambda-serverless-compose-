'use strict';

const reviews = [
  {
    id: 'elena',
    reviewer: 'Elena Sorokina',
    text: 'The Ultrasonic Nitro extract changed how I think about cold coffee. There is literally zero bitterness, just exploding jasmine notes.',
    detail: 'Gastronomy Critic · Tokyo',
  },
  {
    id: 'marcus',
    reviewer: 'Marcus Takahashi',
    text: 'AURA is the ultimate sanctuary for deep focus. The acoustic soundproofing in the Ginza flagship makes remote work feel like a meditation.',
    detail: 'Architectural Designer',
  },
  {
    id: 'clara',
    reviewer: 'Clara Laurent',
    text: 'The Panama Geisha paired with the Matcha Yuzu Croissant is pure culinary art. Worth every penny for a weekend ritual.',
    detail: 'Food & Wine Writer',
  },
];

const jsonResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(data),
});

exports.reviewV1 = async () => jsonResponse(200, {
  version: 'v1',
  reviews: reviews.map(({ id, reviewer, text, detail }) => ({
    id,
    reviewer,
    text,
    detail,
  })),
});

async function reviewsWithRatings(version) {
  if (!process.env.RATINGS_URL) {
    console.error('RATINGS_URL is not configured');
    return jsonResponse(500, { message: 'The ratings dependency is not configured' });
  }

  try {
    const response = await fetch(process.env.RATINGS_URL);
    if (!response.ok) {
      throw new Error(`Ratings service returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.ratings || typeof data.ratings !== 'object' || Array.isArray(data.ratings)) {
      throw new Error('Ratings service returned an invalid response');
    }

    return jsonResponse(200, {
      version,
      reviews: reviews.map(({ id, reviewer, text, detail }) => ({
        id,
        reviewer,
        text,
        detail,
        rating: data.ratings[id] ?? null,
      })),
    });
  } catch (error) {
    console.error(`Review ${version} failed to load ratings:`, error);
    return jsonResponse(502, { message: 'The ratings dependency failed' });
  }
}

exports.reviewV2 = async () => reviewsWithRatings('v2');
exports.reviewV3 = async () => reviewsWithRatings('v3');
