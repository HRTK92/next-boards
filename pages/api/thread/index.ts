import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const threads = await prisma.thread.findMany({
      where: {
        status: 'public',
      },
    })
    res.json(threads)
  } else {
    res.status(405)
  }
}
