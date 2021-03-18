async function hello(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hey!' }),
  };
}

export const handler = hello;
