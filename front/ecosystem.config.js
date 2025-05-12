module.exports = {
  apps : [{
    name: "next-app",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 3001",
    cwd: "C:/dev/rfid_access_reader/front",
    watch: true,
  }]
};