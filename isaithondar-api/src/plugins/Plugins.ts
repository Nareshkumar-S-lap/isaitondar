/* eslint-disable @typescript-eslint/no-require-imports */
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as HapiSwagger from 'hapi-swagger';
import * as HapiAuthBearerToken from 'hapi-auth-bearer-token';

const swaggerOptions: HapiSwagger.RegisterOptions = {
  info: {
    title: 'API Documentation',
    version: '1.0',
  },
  tags: [
    {
      name: 'register',
      description: 'Users registration',
    },
  ],
};

const plugins: any[] = [
  Inert,
  Vision,
  {
    plugin: HapiAuthBearerToken,
  },
  require('blipp'),
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
];

export default plugins;
