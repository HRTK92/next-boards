import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function thread(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) return res.status(401)
    const id = req.query.id as string
    const thread = await prisma.thread
      .findUnique({
        where: {
          id: id,
        },
        include: {
          responses: {
            include: {
              Author: {
                select: {
                  displayName: true,
                },
              },
            },
          },
        },
      })
      .catch((e) => {
        if (e instanceof Error) {
          console.error(e.message)
        }
      })
    res.json(thread)
  } else {
    res.status(405)
  }
}
