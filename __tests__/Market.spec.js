const url =
  'https://zwc0k6q37a.execute-api.us-east-2.amazonaws.com/dev';

const request = require('supertest')(url);

const validMarket = {
  country: 'Ecuador',
  currency: 'USD',
  code_symbol: 'symbol',
  currency_before_price: true,
  show_cents: true,
  display: '#.###',
};

const postMarket = (market = validMarket) => {
  return request.post('/market').send(market);
};

describe('Market', () => {
  it('returns 201 OK when a market is created', async () => {
    const response = await postMarket();
    expect(response.status).toBe(201);
  });

  it('returns 201 OK with data when a market is created', async () => {
    const response = await postMarket();
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.country).toBeDefined();
    expect(response.body.currency).toBeDefined();
  });
});
