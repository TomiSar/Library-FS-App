export const oktaConfig = {
  clientId: '0oahcv5bn9BzUyKOi5d7',
  issuer: 'https://dev-13275671.okta.com/oauth2/default',
  redirectUri: 'https://localhost:3000/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: true,
};
