module.exports = {
  PORT: process.env.PORT || 8001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://stocktwits-viewer.now.sh/'
      : 'http://localhost:3000',
};
