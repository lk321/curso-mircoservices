const ApiGateway = require('moleculer-web');

module.exports = {
  name: 'api',
  mixins: [ApiGateway],

  // More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
  settings: {
    // Exposed port
    port: process.env.PORT || 3000,

    // Exposed IP
    ip: '0.0.0.0',

    // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
    use: [],

    routes: [
      {
        path: '/api',

        whitelist: [
          '**',
        ],

        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],

        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,

        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: false,

        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: false,

        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,

        aliases: {

        },

        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callingOptions: {},

        bodyParsers: {
          json: {
            strict: false,
            limit: '1MB',
          },
          urlencoded: {
            extended: true,
            limit: '1MB',
          },
        },

        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        mappingPolicy: 'all', // Available values: "all", "restrict"

        // Enable/disable logging
        logging: true,
      },
    ],
    log4XXResponses: false,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,

    // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
    assets: {
      folder: 'public',

      // Options to `server-static` module
      options: {},
    },
  },

  methods: {
    async authenticate(ctx, route, req) {
      // Read the token from header
      const auth = req.headers.authorization;

      if (auth && auth.startsWith('Bearer')) {
        const token = auth.slice(7);

        // Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
        if (token === '123456') {
          // Returns the resolved user. It will be set to the `ctx.meta.user`
          return { id: 1, name: 'John Doe' };
        }
        // Invalid token
        throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN);
      } else {
        // No token. Throw an error or do nothing if anonymous access is allowed.
        // throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
        return null;
      }
    },
    async authorize(ctx, route, req) {
      // Get the authenticated user.
      const { user } = ctx.meta;

      // It check the `auth` property in action schema.
      if (req.$action.auth === 'required' && !user) {
        throw new ApiGateway.Errors.UnAuthorizedError('NO_RIGHTS');
      }
    },

  },
};
