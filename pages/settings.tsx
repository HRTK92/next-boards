import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useReducer, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Settings() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [name, setName] = useState<string | undefined>(
    session?.user?.displayName
  )
  const [nameStatus, setNameStatus] = useState<
    null | 'sending' | 'sent' | 'error'
  >(null)

  const { data: user } = useSWR('/api/getDisplayName', fetcher, {
    refreshInterval: 1000,
  }) as { data: { displayName: string | undefined } }

  if (status === 'loading') {
    return <div className="animate-pulse">Loading...</div>
  }

  if (status === 'unauthenticated') router.push('/api/auth/signin')
  return (
    <div>
      <Head>
        <title>設定 | 掲示板</title>
      </Head>

      <header>
        <nav className="border-gray-200 bg-gray-100 px-4 py-4 lg:px-6">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="focus:text-slate-600"
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
              <div className="px-2 text-lg font-bold">設定</div>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-screen-xl">
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
          <div className="flex w-full max-w-md flex-col items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-8 shadow-md">
            <h1 className="text-2xl font-bold text-gray-700">設定</h1>
            <p className="text-sm text-gray-500">設定を変更できます</p>
            <p className="text-sm text-gray-500">
              現在の名前: {user?.displayName}
            </p>
            <div className="mt-4 flex w-full flex-col items-center justify-center">
              <div className="flex w-full flex-col items-center justify-center">
                <label className="text-sm text-gray-500">ユーザー名</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-md border border-gray-200 px-4 py-2 focus:border-slate-600 focus:outline-none"
                  placeholder="ユーザー名"
                  value={session?.user?.displayName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <button
              className="mt-4 w-full rounded-md bg-slate-600 px-4 py-2 text-white hover:bg-slate-700 focus:bg-slate-700 focus:outline-none"
              onClick={() => {
                setNameStatus('sending')
                fetch('/api/nameChange', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ name }),
                })
                  .then(() => {
                    setNameStatus('sent')
                  })
                  .catch(() => {
                    setNameStatus('error')
                  })
                setTimeout(() => {
                  setNameStatus(null)
                }, 2000)
              }}
            >
              保存
            </button>
            <div className='mt-6 ml-5'>
              {nameStatus === 'sending' && (
                <div className="flex justify-center">
                  <div className="h-4 w-4 animate-ping rounded-full bg-blue-600"></div>
                </div>
              )}
              {nameStatus === 'sent' && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-500"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5 12l5 5l10 -10"></path>
                  </svg>
                </>
              )}
              {nameStatus === 'error' && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-red-500"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <circle cx="12" cy="12" r="9"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
