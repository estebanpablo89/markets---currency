import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import validation from '../validation/validation';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createMarket(event, context) {
  const {
    country,
    currency,
    code_symbol,
    currency_before_price,
    show_cents,
    display,
  } = event.body;

  validation(
    country,
    currency,
    code_symbol,
    currency_before_price,
    show_cents,
    display
  );

  let existingMarkets;

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.MARKETS_TABLE_NAME,
      })
      .promise();

    existingMarkets = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  for (let i = 0; i < existingMarkets.length; i++) {
    if (
      existingMarkets[i].country === country &&
      existingMarkets[i].currency === currency
    ) {
      throw new createError.BadRequest(
        '{"error": "Market already exists, try a different country/currency combination or search id in all markets to update the data"}'
      );
    }
  }

  const now = new Date();

  const market = {
    id: uuid(),
    country,
    currency,
    currencyFormat: {
      code_symbol,
      currency_before_price,
      show_cents,
      display,
    },
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.MARKETS_TABLE_NAME,
        Item: market,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(market),
  };
}

export const handler = commonMiddleware(createMarket);
