'use strict';

const ratings = {
  elena: 5,
  marcus: 5,
  clara: 4.8,
};

exports.getRatings = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify({ ratings }),
});
