import prisma from '../../lib/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
export default async function getDisplayName(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) res.status(401)
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    })
    if (!user) res.status(404)
    res.json({ displayName: user?.displayName })
  } else {
    res.status(405)
  }
}
