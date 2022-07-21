module.exports = {
  apps: [
    {
      script: "build/index.js",
      watch: true,
      ignore_watch: ["files","node_modules"],
      env_dev: {
        PORT: 3000,
        ENV: "dev",
        MONGODB_URL:
          "mongodb+srv://technaunceuser:txXukNKwdVs7oFSr@laundry-db.urxp5.mongodb.net/Laundry",
        WHITELIST_SERVER: "http://localhost:4200,http://138.68.153.71",
        JWT_SECRET_KEY:
          "uGlnT349lCDvidoNUxEIfE+08QeKdUynBN6EON5hV46L0ddJz50DGdM32sT3r3XDoINqhv7jR5sy6+CQ11er/pwqHtMRhj1zicMaQBciT5x6OWQTW50AqedmMnN4zkcvx0LY4X6eFRQnkEpWsU21RMXeQoGUZW9Z0FEbcknO5TFwXIS1R/2I6yQO+iY9ka6q1qEXS/ZLGO4iDmvdS5lG+ez9iShdKoF9Es3NjraKiyvBkFhjCNodCBkuwOtp9dqCwfd8Eg/vSlEUQJzZzlsV2t2TXSo1K6ERL6vXrOnbozgLxkm4J64yPyturmBXP7SaRdhQAx0srVZFws47JwuNwg==",
        SENDGRID_API_KEY:
          "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",
        SENDGRID_MAIL: "technaunce@gmail.com",
        BASE_URL: "http://138.68.153.71",
        API_URL: "http://165.22.122.218:3000",
        S3_ACCESS_KEY: "accesskeyprovided",
        S3_ACCESS_SECRET: "accesssecretprovided",
        S3_BUCKET_NAME: "bucketname",
        AWS_REGION: "region",
      },
    },
  ],
};
