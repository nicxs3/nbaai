import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export async function GET() {
  const results: any[] = [];
  const csvPath = path.join(process.cwd(), 'prizepicks_propsv2.csv');

  return new Promise((resolve) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(NextResponse.json(results));
      });
  });
}