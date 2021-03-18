import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import { getMarketById } from './getMarket';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateMarket(event, context) {
  const { id } = event.pathParameters;
  const { code_symbol, display, show_cents } = event.body;

  await getMarketById(id);

  const params = {
    TableName: process.env.MARKETS_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      'set currencyFormat.code_symbol = :code_symbol, currencyFormat.show_cents = :show_cents, currencyFormat.display = :display',
    ExpressionAttributeValues: {
      ':code_symbol': code_symbol,
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
