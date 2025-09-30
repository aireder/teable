import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Grid Table Demo</h1>
        <p className="text-gray-600 mb-8">
          This Next.js application demonstrates how to use the grid component from 
          <code className="bg-gray-100 px-2 py-1 rounded mx-1">@teable/grid-table-kanban</code>
          package, modeled after the share view implementation.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/share/demo-share-id/view" 
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
          >
            View Share Grid Demo
          </Link>
          
          <Link 
            href="/simple-grid" 
            className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
          >
            View Simple Grid Demo
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold mb-2 text-gray-900">Features:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Grid component from leven/packages/grid-table-kanban</li>
            <li>Share view pattern from nextjs-app</li>
            <li>Column resizing, freezing, and ordering</li>
            <li>Row selection and expansion</li>
            <li>Search and filtering capabilities</li>
            <li>Group and collapse functionality</li>
          </ul>
        </div>
      </div>
    </div>
  )
}