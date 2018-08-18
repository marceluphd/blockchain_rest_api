const config = {
  env: '',
  dev: 'development',
  test: 'test',
  staging: 'staging',
  prod: 'production',
  port: process.env.PORT || 8000
};

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

export default config;
