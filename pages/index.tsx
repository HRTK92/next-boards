import { Loading } from '@nextui-org/react'
import { Prisma } from '@prisma/client'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Moment from 'react-moment'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [pageTitle, setPageTitle] = useState('掲示板')
  const [show, setShow] = useState<'home' | 'popular' | 'latest'>('home')
  const [title, setTitle] = useState<string>('')
  const [tag, setTag] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [type, setType] = useState<'public' | 'private'>('public')
  const [create, setCreate] = useState<boolean>(false)
  const [createStatus, setCreateStatus] = useState<null | 'showing' | 'sending' | 'sent'>(null)

  const { data: threads } = useSWR('/api/thread', fetcher) as {
    data: Prisma.ThreadGetPayload<{}>[]
  }

  useEffect(() => {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME as string
    if (show === 'home') {
      setPageTitle(siteName)
    } else if (show === 'popular') {
      setPageTitle(`人気のスレッド | ${siteName}`)
    } else if (show === 'latest') {
      setPageTitle(`最新のスレッド | ${siteName}`)
    }
  }, [show])

  const list = (data: Prisma.ThreadGetPayload<{}>[]) => {
    return (
      <>
        {data ? (
          data.map((item, index) => (
            <div className='py-2' key={index}>
              <div
                className='translate rounded-md border shadow-lg delay-100 duration-200 hover:border-2 hover:border-blue-500 hover:shadow-2xl'
                onClick={() => router.push(`/thread/${item.id}`)}
              >
                <div className='px-4 py-3'>
                  <div className='flex items-center text-lg font-bold'>
                    {item.title}
                    {item.tags &&
                      item.tags.map((tag, index) => (
                        <span
                          className='ml-2 rounded-md border border-blue-500 px-1 py-0.5 text-sm text-gray-400'
                          key={index}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                  <div className='flex justify-between'>
                    <div>
                      <div className='inline px-1 text-sm text-gray-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='inline'
                          width='18'
                          height='18'
                          viewBox='0 0 24 24'
                          strokeWidth='2'
                          stroke='currentColor'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                          <circle cx='12' cy='12' r='9'></circle>
                          <polyline points='12 7 12 12 15 15'></polyline>
                        </svg>
                        <Moment locale='ja' interval={1000} fromNow>
                          {item.atCreated}
                        </Moment>
                      </div>
                      <div className='inline px-1 text-sm text-gray-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='inline'
                          width='18'
                          height='18'
                          viewBox='0 0 24 24'
                          strokeWidth='2'
                          stroke='currentColor'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                          <path d='M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1'></path>
                        </svg>
                        {item.responsesCount}
                      </div>
                    </div>
                    <div className='translate delay-150 duration-200 hover:text-blue-400'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        strokeWidth='2'
                        stroke='currentColor'
                        fill='none'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                        <polyline points='9 6 15 12 9 18'></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Loading />
        )}
      </>
    )
  }
  return (
    <div className='select-none'>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={process.env.NEXT_PUBLIC_SITE_NAME} />
      </Head>

      <div className='flex justify-between p-4'>
        <div>
          <div className='text-2xl font-bold'>掲示板</div>
          <div className='text-slate-500'>
            {process.env.NEXT_PUBLIC_SITE_NAME}
          </div>
        </div>
        <div className='flex w-32 justify-end'>
          {status === 'authenticated' ? (
            <div
              className='translate content-center rounded-full bg-indigo-600 px-4 py-4 text-white delay-100 duration-200 hover:bg-indigo-700 hover:shadow-2xl'
              onClick={() => router.push('/settings')}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='28'
                height='28'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                <path d='M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z'></path>
                <circle cx='12' cy='12' r='3'></circle>
              </svg>
            </div>
          ) : (
            <button
              className='rounded bg-cyan-500 px-4 py-2 text-white'
              onClick={() => signIn('line')}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                <path d='M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2'></path>
                <path d='M20 12h-13l3 -3m0 6l-3 -3'></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className='container flex content-center justify-between px-4'>
        <div className='flex rounded-lg bg-slate-100 p-4'>
          <div
            className={`${
              show == 'home'
                ? ' bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                : 'bg-white text-black shadow-lg'
            } translate mx-1 cursor-pointer rounded-lg px-4 py-2 text-center transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg`}
            onClick={() => setShow('home')}
          >
            ホーム
          </div>
          <div
            className={`${
              show == 'popular'
                ? ' bg-gradient-to-r from-red-500 to-pink-400 text-white shadow-lg'
                : 'bg-white text-black shadow-lg'
            } translate mx-1 cursor-pointer rounded-lg px-4 py-2 text-center transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg`}
            onClick={() => setShow('popular')}
          >
            トレンド
          </div>
          <div
            className={`${
              show == 'latest'
                ? ' bg-gradient-to-r from-green-500 to-sky-500 text-white shadow-lg'
                : 'bg-white text-black shadow-lg'
            } translate mx-1 cursor-pointer rounded-lg px-4 py-2 text-center transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg`}
            onClick={() => setShow('latest')}
          >
            最新
          </div>
        </div>
        <div className='flex p-3'>
          <button
            className='translate cursor-pointer rounded-lg bg-blue-500 p-3 text-white transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg'
            onClick={() => {
              if (status === 'authenticated') {
                setCreateStatus('showing')
              } else {
                signIn('line')
              }
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              strokeWidth='2'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
              <line x1='12' y1='5' x2='12' y2='19'></line>
              <line x1='5' y1='12' x2='19' y2='12'></line>
            </svg>
          </button>
        </div>
      </div>

      <div className='container px-5 py-3'>
        {threads ? (
          <>
            {show == 'home' &&
              list([...threads].sort(() => Math.random() - Math.random()).splice(0, 5))}
            {show == 'popular' &&
              list(
                [...threads].sort(
                  (a, b) =>
                    a.responsesCount /
                      ((new Date(a.atCreated).getTime() - new Date().getTime()) /
                        1000 /
                        60 /
                        60 /
                        24) -
                    b.responsesCount /
                      ((new Date(b.atCreated).getTime() - new Date().getTime()) /
                        1000 /
                        60 /
                        60 /
                        24)
                )
              )}
            {show == 'latest' &&
              list([...threads].sort((a, b) => (a.atCreated < b.atCreated ? 1 : -1)))}
          </>
        ) : (
          <div className='mx-auto w-full max-w-sm rounded-md border border-blue-300 p-4 shadow'>
            <div className='flex animate-pulse space-x-4'>
              <div className='flex-1 space-y-6 py-1'>
                <div className='h-2 rounded bg-slate-700'></div>
                <div className='space-y-3'>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='col-span-2 h-2 rounded bg-slate-700'></div>
                    <div className='col-span-1 h-2 rounded bg-slate-700'></div>
                  </div>
                  <div className='h-2 rounded bg-slate-700'></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        tabIndex={-1}
        className={`${
          createStatus === null && 'hidden'
        } h-modal fixed top-0 right-0 left-0 z-50 h-full w-full overflow-y-auto overflow-x-hidden p-4 backdrop-blur-sm md:inset-0 md:h-full`}
      >
        <div className='relative h-full w-full max-w-2xl md:h-auto'>
          <div className='relative rounded-lg bg-white shadow'>
            <div className='flex items-start justify-between rounded-t border-b p-4'>
              <h3 className='text-xl font-semibold text-gray-900'>スレッドを作成</h3>
              <button
                type='button'
                className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900'
                onClick={() => setCreateStatus(null)}
              >
                <svg
                  aria-hidden='true'
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  ></path>
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='space-y-6 p-6'>
              <div>
                <label htmlFor='title' className='text-sm font-medium'>
                  タイトル
                </label>
                <div className='relative mt-1'>
                  <input
                    type='title'
                    id='title'
                    className='hover: w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-2xl'
                    placeholder='タイトルを入力'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor='title' className='flex text-sm font-medium'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      viewBox='0 0 24 24'
                      strokeWidth='2'
                      stroke='currentColor'
                      fill='none'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                      <circle cx='8.5' cy='8.5' r='1' fill='currentColor'></circle>
                      <path d='M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z'></path>
                    </svg>
                    <span className='ml-1'>タグ</span>
                  </label>
                  <div className='relative mt-1'>
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className='mr-2 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium leading-4 text-gray-800'
                      >
                        {tag}
                      </div>
                    ))}
                    <div className='flex'>
                      <input
                        id='tag'
                        className='hover: w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-2xl'
                        placeholder='タグを入力'
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (tag) {
                              if (tag.length > 8) {
                                alert('タグは8文字以内にしてください')
                                return
                              }
                              if (tags.includes(tag)) {
                                alert('同じタグは追加できません')
                                return
                              }
                              if (tags.length >= 5) {
                                alert('タグは5つまでです')
                                return
                              }
                              setTags([...tags, tag])
                              setTag('')
                            }
                          }
                        }}
                      />
                      <button
                        className='ml-2 inline-flex items-center justify-center rounded-lg bg-gray-100 p-2 text-sm text-gray-800'
                        onClick={() => {
                          if (tag) {
                            if (tag.length > 8) {
                              alert('タグは8文字以内にしてください')
                              return
                            }
                            if (tags.includes(tag)) {
                              alert('同じタグは追加できません')
                              return
                            }
                            if (tags.length >= 5) {
                              alert('タグは5つまでです')
                              return
                            }

                            setTags([...tags, tag])
                            setTag('')
                          }
                        }}
                      >
                        追加
                      </button>
                    </div>
                  </div>
                </div>
                <div className='mt-2 pt-2'>
                  <div className='text-sm font-medium'>スレッドの種類</div>
                  <div className='mt-2'>
                    <label className='inline-flex items-center'>
                      <input
                        type='radio'
                        className='form-radio'
                        name='type'
                        value='public'
                        checked={type === 'public'}
                        onChange={(e) => setType('public')}
                      />
                      <span className='ml-2'>公開</span>
                    </label>
                    <label className='ml-6 inline-flex items-center'>
                      <input
                        type='radio'
                        className='form-radio'
                        name='type'
                        value='private'
                        checked={type === 'private'}
                        onChange={(e) => setType('private')}
                      />
                      <span className='ml-2'>非公開</span>
                    </label>
                  </div>
                  <div className='rounded-sm text-sm text-gray-400'>
                    公開の場合は誰でも閲覧できます。非公開の場合はURLを知っている人のみ閲覧できます。
                  </div>
                </div>
              </div>
            </div>
            <div className='flex items-center space-x-2 rounded-b border-t border-gray-200 p-6'>
              <button
                type='button'
                className='flex rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
                disabled={title === ''}
                onClick={() => {
                  setCreateStatus('sending')
                  fetch('/api/thread/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      title,
                      tags,
                      type,
                    }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setTimeout(() => {
                      setCreateStatus('sent')
                      router.push(`/thread/${data.id}`)
                    }, 1500)
                  })
                }}
              >
                {createStatus === 'sending' && (
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                )}
                作成
              </button>
              <button
                type='button'
                className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300'
                onClick={() => setCreateStatus(null)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
