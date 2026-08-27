module.exports = {
  apps: [
    {
      // La API ya lee PORT de api/.env (ver api/src/main.ts); si no
      // está seteado ahí, cae al 3000 por default.
      name: "api",
      cwd: "./api",
      script: "dist/src/main.js",
      env: { NODE_ENV: "production" },
    },
    {
      // Puerto fijo distinto al de la API — "next start" también usa
      // 3000 por default y pisaría a la API si corren en la misma IP.
      name: "front",
      cwd: "./front",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: { NODE_ENV: "production", PORT: 3001 },
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
