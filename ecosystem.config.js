module.exports = {
    apps: [
      {
        name: "kelayaa",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          NEXTAUTH_URL: "https://staging.kelayaa.com",
          NEXTAUTH_SECRET: "dXNjX2F1dGhfc2VjcmV0X2tleV9nZW5lcmF0ZWQ=",  // put your actual secret here
          NEXTAUTH_TRUST_HOST: "true",
        },
      },
    ],
  };
  