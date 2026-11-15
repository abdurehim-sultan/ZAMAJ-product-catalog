import { ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <p className="text-sm font-medium text-gray-600">
          Created by <span className="font-semibold text-indigo-600">Abdurehim Sultan</span>
        </p>
        
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 rounded-lg border bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <ArrowUp className="h-4 w-4" />
          Back to top
        </button>
      </div>
    </footer>
  )
}
