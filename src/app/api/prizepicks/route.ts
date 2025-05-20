import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

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

// Function to run the scraping script
async function runScrapingScript() {
  try {
    const scriptPath = path.join(process.cwd(), 'src/propdata/webscrape.py')
    await execAsync(`python ${scriptPath}`)
    console.log('PrizePicks data updated successfully at:', new Date().toISOString())
  } catch (error) {
    console.error('Error updating PrizePicks data:', error)
  }
}

// Run the scraping script every hour
//setInterval(runScrapingScript, 60 * 60 * 1000)
runScrapingScript()

export async function GET() {
  const results: PropsData = {}
  const csvPath = path.join(process.cwd(), 'prizepicks_propsv2.csv')

  // Read and parse the CSV file asynchronously
  return new Promise<Response>((resolve) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data: PrizePickProp) => {
        const category = data.Category
        if (!results[category]) {
          results[category] = []
        }
        results[category].push(data)
      })
      .on('end', () => {
        resolve(NextResponse.json(results))
      })
      .on('error', (err) => {
        resolve(
          new Response(JSON.stringify({ error: 'Failed to read CSV', details: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        )
      })
  })
} 