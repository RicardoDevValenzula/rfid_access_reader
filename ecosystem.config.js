module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./api",
      script: "dist/main.js",
      env: { NODE_ENV: "production" },
    },
    {
      name: "front",
      cwd: "./front",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: { NODE_ENV: "production" },
    },
    {
      name: "reader-agent",
      cwd: "./reader-agent",
      script: "index.js",
    },
    {
      // cwd apunta a reader-agent (no a writer/) para que dotenv
      // encuentre reader-agent/.env, igual que corriéndolo a mano.
      name: "writer-agent",
      cwd: "./reader-agent",
      script: "writer/index.js",
    },
  ],
};
