"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

type PrizePickProp = {
  Category: string
  Name: string
  Value: string
  Matchup: string
  Payout: string
  Timestamp: string
}

type PropsData = {
  [category: string]: PrizePickProp[]
}

export default function PrizePicksPage() {
  const [propsData, setPropsData] = useState<PropsData>({})
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const response = await fetch('/api/prizepicks')
        const data = await response.json()
        setPropsData(data)
        // Set the first category as selected by default
        const firstCategory = Object.keys(data)[0]
        setSelectedCategory(firstCategory)
      } catch (error) {
        console.error('Error fetching props:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProps()
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0B1E] text-white p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-4xl font-bold mb-8">PrizePicks Props</h1>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(propsData).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm ${
                    selectedCategory === category 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'border-purple-600 text-purple-400 hover:bg-purple-600/10 hover:text-purple-300'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Props Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Value</th>
                    <th className="text-left p-2">Matchup</th>
                    <th className="text-left p-2">Payout</th>
                    <th className="text-left p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCategory && propsData[selectedCategory]?.map((row: PrizePickProp, idx: number) => (
                    <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="p-2">{row.Name}</td>
                      <td className="p-2">{row.Value}</td>
                      <td className="p-2">{row.Matchup}</td>
                      <td className="p-2">{row.Payout}</td>
                      <td className="p-2">{row.Timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 