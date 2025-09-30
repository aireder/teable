import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AirtableDemo } from './components/AirtableDemo'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full p-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Teable SDK - Airtable样式表格演示</h1>
          <AirtableDemo />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
