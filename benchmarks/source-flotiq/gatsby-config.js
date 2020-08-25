require('dotenv').config();

module.exports = {
  siteMetadata: {
    siteTitle: `Gatsby Flotiq Benchmark`,
  },
  plugins: [
    `gatsby-plugin-benchmark-reporting`,
    `gatsby-plugin-sharp`,
    {
      resolve: 'gatsby-source-flotiq',
      options: {
        baseUrl: "https://api.flotiq.com",
        authToken: process.env.BENCHMARK_FLOTIQ_API_TOKEN,
        forceReload: false,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
  ],
}
