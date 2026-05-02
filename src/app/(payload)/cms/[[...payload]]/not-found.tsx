import { NotFoundPage } from '@payloadcms/next/views'
import configPromise from '@/payload.config'

type Args = {
  params: {
    payload: string[]
  }
  searchParams: {
    [key: string]: string | string[]
  }
}

const Page = ({ params, searchParams }: Args) => NotFoundPage({ config: configPromise, params, searchParams })

export default Page
