const DbMixin = require('../mixins/db.mixin');

module.exports = {
  name: 'companies',
  mixins: [DbMixin('companies')],
  settings: {
    fields: [
      '_id',
      'name',
      'address',
      'extra',
    ],
    entityValidator: {
      name: {
        type: 'string',
        min: 3,
      },
      address: {
        type: 'string',
        optional: true,
      },
    },
  },
  hooks: {
    before: {
      create(ctx) {
        ctx.params.quantity = 0;
      },
    },
  },
};
