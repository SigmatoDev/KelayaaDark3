module.exports = {
    apps: [
      {
        name: "kelayaa",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          NEXTAUTH_URL: "https://staging.kelayaa.com",
          NEXTAUTH_SECRET: "MIwt4h2XCQoRZ/VyVeO97nBnpRJJvnGzb3C01OMtZHA=",  // put your actual secret here
          NEXTAUTH_TRUST_HOST: "true",
        },
      },
    ],
  };
  