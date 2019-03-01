const assert = require('assert');
const app = require('../../src/app');

describe('\'player\' service', () => {
  it('registered the service', () => {
    const service = app.service('players');

    assert.ok(service, 'Registered the service');
  });
});
