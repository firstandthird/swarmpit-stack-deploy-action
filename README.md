# Swarmpit stack deploy

This action allows you to deploy a new stack or update an existing by passing a docker compose file.

## Usage:

```yaml
uses: firstandthird/swarmpit-stack-deploy-action
with:
  url: https://swarmpit.yourdomain.com
  api-key: super-secure-api-key
  stack: stack-name
  compose: docker-compose-production.yml # can be any docker compose file
```
