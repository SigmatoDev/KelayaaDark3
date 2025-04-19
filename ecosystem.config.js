module.exports = {
    apps: [
      {
        name: "kelayaa",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          NEXTAUTH_URL: "https://staging.kelayaa.com",
          NEXTAUTH_TRUST_HOST: "true",
        },
      },
    ],
  };
  