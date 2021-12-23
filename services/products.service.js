const DbMixin = require('../mixins/db.mixin');

module.exports = {
  name: 'products',
  mixins: [DbMixin('products')],
  settings: {
    fields: [
      '_id',
      'sku',
      'name',
      'quantity',
      'price',
      'company',
    ],
    entityValidator: {
      sku: {
        type: 'string',
        min: 3,
        max: 50,
        uppercase: true,
        trim: true,
        covert: true,
      },
      name: 'string|min:3',
      price: 'number|positive',
    },
    populates: {
      company: {
        action: 'companies.get',
        params: {
          fields: ['_id', 'name'],
        },
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
  actions: {
    increaseQuantity: {
      rest: 'PUT /:id/quantity/increase',
      params: {
        id: 'string',
        value: 'number|integer|positive',
      },
      async handler(ctx) {
        const doc = await this.adapter.updateById(ctx.params.id, {
          $inc: { quantity: ctx.params.value },
        });
        const json = await this.transformDocuments(ctx, ctx.params, doc);
        await this.entityChanged('updated', json, ctx);

        return json;
      },
    },
    decreaseQuantity: {
      rest: 'PUT /:id/quantity/decrease',
      params: {
        id: 'string',
        value: 'number|integer|positive',
      },
      /** @param {Context} ctx  */
      async handler(ctx) {
        const doc = await this.adapter.updateById(ctx.params.id, {
          $inc: { quantity: -ctx.params.value },
        });
        const json = await this.transformDocuments(ctx, ctx.params, doc);
        await this.entityChanged('updated', json, ctx);

        return json;
      },
    },
  },
  methods: {
    async seedDB() {
      await this.adapter.insertMany([
        { name: 'Samsung Galaxy S10 Plus', quantity: 10, price: 704 },
        { name: 'iPhone 11 Pro', quantity: 25, price: 999 },
        { name: 'Huawei P30 Pro', quantity: 15, price: 679 },
      ]);
    },
  },
};
