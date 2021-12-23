module.exports = {
  name: 'greeter',
  actions: {
    hello: {
      rest: {
        method: 'GET',
        path: '/hello',
      },
      async handler() {
        return 'Hello Moleculer';
      },
    },
    welcome: {
      rest: '/welcome',
      params: {
        name: {
          type: 'string',
          min: 3,
          uppercase: true,
          default: 'stranger',
        },
      },
      /** @param {Context} ctx  */
      async handler(ctx) {
        const { name } = ctx.params;

        return `Welcome, ${name}`;
      },
    },
  },
};
