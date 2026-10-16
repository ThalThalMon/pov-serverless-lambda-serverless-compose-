'use strict';

const fs = require('node:fs');
const path = require('node:path');

const jsonResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(data),
});

async function fetchServiceJson(name, url) {
  if (!url) {
    throw new Error(`${name} service URL is not configured`);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${name} service returned HTTP ${response.status}`);
  }

  return response.json();
}

exports.storefront = async (event) => {
  // Added test log right here inside the function!
  console.log("TEST FLOW: Request received by Lambda for storefront HTML!");

  try {
    const htmlPath = path.join(__dirname, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: htmlContent,
    };
  } catch (error) {
    console.error('Could not load storefront index.html interface:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Could not load storefront index.html interface',
        details: error.message,
      }),
    };
  }
};

exports.storefrontData = async (event) => {
  // You can also add a log here to test the data-fetching route!
  console.log("TEST FLOW: Request received by Lambda for storefrontData!");

  const menuUrl = process.env.MENU_SERVICE_URL
    ? `${process.env.MENU_SERVICE_URL.replace(/\/$/, '')}/menu`
    : '';
  const requestedVersion = event.queryStringParameters?.version ?? '1';
  const version = requestedVersion.replace(/^v/, '');
  if (!['1', '2', '3'].includes(version)) {
    return jsonResponse(400, { message: 'version must be 1, 2, or 3' });
  }
  const reviewsUrl = process.env.REVIEWS_SERVICE_URL
    ? `${process.env.REVIEWS_SERVICE_URL.replace(/\/$/, '')}/review-v${version}`
    : '';

  try {
    const [menuData, reviewsData] = await Promise.all([
      fetchServiceJson('Menu', menuUrl),
      fetchServiceJson(`Reviews v${version}`, reviewsUrl),
    ]);

    if (!Array.isArray(menuData.items) || !Array.isArray(reviewsData.reviews)) {
      throw new Error('A dependency returned an invalid response');
    }

    return jsonResponse(200, {
      menu: menuData.items,
      version: `v${version}`,
      reviews: reviewsData,
    });
  } catch (error) {
    console.error(`Failed to load storefront menu and reviews v${version}:`, error);
    return jsonResponse(502, { message: 'A storefront dependency failed' });
  }
};