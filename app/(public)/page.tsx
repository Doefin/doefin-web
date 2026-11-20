import { homeMetadata, V3Home } from '@/components/v3/V3Home'

export const generateMetadata = () => homeMetadata('en')

export default function HomePage() {
  return <V3Home language="en" />
}
