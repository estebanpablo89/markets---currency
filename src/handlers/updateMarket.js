import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import { getMarketById } from './getMarket';
import validation from '../validation/validation';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateMarket(event, context) {
  const { id } = event.pathParameters;
  const {
    country,
    currency,
    code_symbol,
    currency_before_price,
    display,
    show_cents,
  } = event.body;

  await getMarketById(id);

  validation(
    country,
    currency,
    code_symbol,
    currency_before_price,
    show_cents,
    display
  );

  const params = {
    TableName: process.env.MARKETS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      'set country =:country, currency =:currency, currencyFormat.code_symbol = :code_symbol, currencyFormat.currency_before_price = :currency_before_price, currencyFormat.show_cents = :show_cents, currencyFormat.display = :display',
    ExpressionAttributeValues: {
      ':country': country,
      ':currency': currency,
      ':code_symbol': code_symbol,
      ':currency_before_price': currency_before_price,
      ':show_cents': show_cents,
      ':display': display,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedMarket;

  try {
    const result = await dynamodb.update(params).promise();
    updatedMarket = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedMarket),
  };
}

export const handler = commonMiddleware(updateMarket);
