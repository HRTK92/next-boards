import prisma from '../../lib/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
export default async function nameChange(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) res.status(401)
    const name = req.body.name as string
    await prisma.user.update({
      where: {
        id: session?.user?.id,
      },
      data: {
        displayName: name,
      },
    })
    res.redirect(`/settings`)
  } else {
    res.status(405)
  }
}
