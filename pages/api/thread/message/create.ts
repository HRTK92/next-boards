import prisma from '../../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { useRouter } from 'next/router'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'

export default async function CreateMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) return res.status(401)
    if (!session.user) return res.status(401)
    const id = req.query.id as string
    const message = req.query.message as string
    await prisma.response.create({
      data: {
        message: message,
        userId: session.user.id,
        threadId: id,
      },
    })
    await prisma.thread.update({
      where: {
        id,
      },
      data: {
        responsesCount: {
          increment: 1,
        },
      },
    })
    res.redirect(`/thread/${id}`)
  } else {
    res.status(405)
  }
}
