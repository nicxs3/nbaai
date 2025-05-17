import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

export async function GET() {
  const results: Record<string, string>[] = []
  const csvPath = path.join(process.cwd(), 'prizepicks_propsv2.csv')

  // Read and parse the CSV file asynchronously
  return new Promise<Response>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
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