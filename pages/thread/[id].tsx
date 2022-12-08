import { Prisma } from '@prisma/client'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useReducer, useRef, useState } from 'react'
import Moment from 'react-moment'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Thread() {
  const router = useRouter()
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const { data: session, status } = useSession()

  const [sendMessage, setSendMessage] = useState<string>('')
  const [buttonClicked, setButtonClicked] = useReducer(
    () => (sendMessage ? true : false),
    false
  )
  const [copyClicked, setCopyClicked] = useState<boolean>(false)
  const id = router.query.id as string
  const { data: thread } = useSWR(
    !(id === 'undefined') ? '/api/thread/get?id=' + id : null,
    fetcher
  ) as {
    data: Prisma.ThreadGetPayload<{
      include: {
        responses: {
          include: {
            Author: {
              select: {
                displayName: true
              }
            }
          }
        }
      }
    }>
  }

  if (status === 'unauthenticated') signIn('line')
  return (
    <div className="select-none">
      <Head>
        <title>
          {thread?.title} - 掲示板
        </title>
      </Head>

      <header>
        <nav className="rounded-full bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-4 shadow-md lg:px-6">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" hover:text-blue-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => router.push('/')}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1"></path>
              </svg>
              <div className="px-2 text-lg font-bold">
                {thread ? <>{thread.title}</> : <></>}
              </div>
              <div className="px-2 text-sm">
                {thread && (
                  <>
                    最終更新日:
                    <Moment locale="ja" interval={1000} fromNow>
                      {thread.atUpdated}
                    </Moment>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/** copy Notification */}
      <div
        className={`fixed top-0 right-0 z-50 ${
          copyClicked ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500`}
      >
        <div className="m-4 rounded-lg bg-gray-100 p-4 text-gray-600 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">クリップボードにコピーしました</div>
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col">
        <div className="h-4/6 overflow-auto px-2 py-4">
          {thread && (
            <>
              {!(thread.responses.length === 0) ? (
                <>
                  {thread.responses.map((message, index) => (
                    <div className="py-2" id={`res-${index}`} key={index}>
                      <div className="text-sm text-gray-400">
                        <span className="font-bold text-black">
                          {index + 1}:
                        </span>
                        <Moment className="px-1" locale="ja" format="LLLL">
                          {message.atCreated}
                        </Moment>
                        <div className="px-1 font-medium">
                          <span className="pr-1">
                            名前: {message.Author.displayName}
                          </span>
                          <span className="px-1">ID: {message.userId}</span>
                        </div>
                      </div>
                      <div className="break-words px-3 text-lg">
                        {message.message.split('\n').map((str, index) => (
                          <div key={index}>
                            {str.match(/^>>> \d{1,}(\n|\r)?$/g) ? (
                              <span
                                className="text-blue-600"
                                onClick={() => {
                                  router.replace(
                                    {
                                      hash: `res-${
                                        Number(str.split('>>> ')[1]) - 1
                                      }`,
                                    },
                                    undefined,
                                    { shallow: true }
                                  )
                                }}
                              >
                                {str}
                              </span>
                            ) : (
                              str
                            )}
                            <br />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end text-sm font-bold text-gray-500">
                        <div
                          className="px-1 hover:text-blue-400"
                          onClick={() => {
                            setCopyClicked(false)
                            navigator.clipboard.writeText(
                              `${index + 1}: ${message.atCreated}\n名前: ${
                                message.Author.displayName
                              } ID: ${message.userId} \n${message.message}`
                            )
                            setCopyClicked(true)
                            setTimeout(() => {
                              setCopyClicked(false)
                            }, 2000)
                          }}
                        >
                          コピー
                        </div>
                        <div
                          className="px-1 hover:text-blue-400"
                          onClick={() => {
                            setSendMessage(`${sendMessage}>>> ${index + 1}\n`)
                            messageRef.current?.focus()
                          }}
                        >
                          返信
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex w-full justify-center text-lg font-medium">
                  まだ、メッセージは送信されてません。
                </div>
              )}
            </>
          )}
        </div>

        <div className="absolut bottom-0 w-full">
          <form action={`/api/thread/message/create`}>
            <div className="flex justify-around p-3 align-baseline">
              <div className="w-1/2">
                <input hidden name="id" id="id" value={thread?.id}></input>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="メッセージを入れてください"
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  ref={messageRef}
                  required
                ></textarea>
              </div>
              <div>
                <button
                  className="rounded-full bg-blue-500 p-5 text-white focus:bg-cyan-600"
                  type="submit"
                  onClick={setButtonClicked}
                >
                  {!buttonClicked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      //className="icon icon-tabler icon-tabler-send"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                      <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5"></path>
                    </svg>
                  ) : (
                    <>
                      <svg
                        role="status"
                        className="mr-3 inline h-4 w-4 animate-spin text-white"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      送信中...
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
