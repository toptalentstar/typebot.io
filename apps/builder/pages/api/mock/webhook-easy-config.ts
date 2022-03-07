import { withSentry } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { methodNotAllowed } from 'utils'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.method)
  if (req.method === 'POST') {
    return res.status(200).send(req.body)
  }
  return methodNotAllowed(res)
}

export default withSentry(handler)
