import { homeMetadata, V3Home } from '@/components/v3/V3Home'

export const generateMetadata = () => homeMetadata('por')

export default function HomePage() {
  return <V3Home language="por" />
}
