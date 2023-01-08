module.exports = {
  apps : [
    {
      name: "broversion-dev",
      script: "npm",
      args: "run dev"
    },
    {
      name: "broversion-prod",
      script: "npm",
      args: "run start"
    }
  ]
}