import { ThemeToggle } from '@/common/providers/theme/toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <main className="p-10">
      <ThemeToggle />
    </main>
  )
}
