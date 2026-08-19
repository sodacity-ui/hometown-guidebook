export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://hometownguidebook.com/sitemap.xml',
    host: 'https://hometownguidebook.com',
  };
}
