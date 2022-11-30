import * as core from '@actions/core'
import fetch from 'node-fetch'
import fs from 'fs'
import util from 'util'

async function run(): Promise<void> {
  try {
    const URL = core.getInput('url')
    const STACK = core.getInput('stack')
    const API_KEY = core.getInput('api-key')
    const COMPOSE_FILE = core.getInput('compose')

    const headers = {
      Authorization: `Bearer ${API_KEY}`
    }

    // If the stack exists this will 200, otherwise will 400
    const stackExistsResponse = await fetch(
      `${URL}/api/stacks/${STACK}/compose`,
      {
        headers
      }
    )

    // Create stack if it doesn't exist or update if it does
    let endpoint = `${URL}/api/stacks`

    if (stackExistsResponse.ok) {
      endpoint += `/${STACK}`
    }

    const readFile = util.promisify(fs.readFile)
    const composeContents = await readFile(COMPOSE_FILE, 'utf-8')

    const body = {
      name: STACK,
      spec: {
        compose: composeContents
      }
    }

    const deployResponse = await fetch(endpoint, {
      method: 'post',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!deployResponse.ok) {
      const deployJSON = await deployResponse.json()
      return core.setFailed(
        `Redeploy failed with status ${
          deployResponse.status
        } and message: ${JSON.stringify(deployJSON)}`
      )
    }

    core.info('Redeploy succeeded')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    core.setFailed(error?.message || 'Unknown error')
  }
}

run()
