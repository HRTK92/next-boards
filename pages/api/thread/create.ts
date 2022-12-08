import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { title, tags, type } = req.body as {
      title: string
      tags: string[]
      type: 'public' | 'private'
    }
    const thread = await prisma.thread.create({
      data: {
        title,
        tags,
        status: type,
      },
    })
    res.status(200).json(thread)
  } else {
    res.status(405)
  }
}
