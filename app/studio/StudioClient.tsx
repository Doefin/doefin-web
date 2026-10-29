'use client'

import { NextStudio } from 'next-sanity/studio'
import studioConfig from '@/studio/sanity.config'

export default function StudioClient() {
  return <NextStudio config={{ ...studioConfig, basePath: '/studio' }} />
}
