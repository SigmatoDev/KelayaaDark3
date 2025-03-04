import { NextResponse } from 'next/server'
import axios from 'axios'
import cron from 'node-cron'
import dbConnect from '@/lib/dbConnect'
import GoldPriceSchema from '@/lib/models/GoldPriceSchema'

interface GoldPriceResponse {
  price_gram_18k: number
  price_gram_22k: number
  price_gram_24k: number
}

const fetchGoldPrice = async () => {
  console.log('🔹 Scheduled Gold Price Fetch Started...')

  await dbConnect()
  console.log('✅ Connected to MongoDB')

  try {
    const API_KEY = process.env.GOLD_API_KEY
    const API_URL = 'https://www.goldapi.io/api/XAU/INR'

    console.log(`🌍 Fetching gold prices from API: ${API_URL}`)

    const response = await axios.get<GoldPriceResponse>(API_URL, {
      headers: {
        'x-access-token': API_KEY as string,
        'Content-Type': 'application/json',
      },
    })

    console.log('📥 API Response Data:', response.data)

    const { price_gram_18k, price_gram_22k, price_gram_24k } = response.data

    const prices = [
      { karat: '18K', price: price_gram_18k },
      { karat: '22K', price: price_gram_22k },
      { karat: '24K', price: price_gram_24k },
    ]

    console.log('🔄 Updating Database with Latest Gold Prices...')

    await Promise.all(
      prices.map(async ({ karat, price }) => {
        // Fetch the existing price
        const existingRecord = await GoldPriceSchema.findOne({ karat })

        let previousPrice = existingRecord?.price || null
        let percentageChange = null

        if (previousPrice !== null) {
          percentageChange = ((price - previousPrice) / previousPrice) * 100
        }

        const updatedRecord = await GoldPriceSchema.findOneAndUpdate(
          { karat },
          {
            $set: {
              price,
              previousPrice,
              percentageChange,
              updatedAt: new Date(),
            },
          },
          { upsert: true, new: true }
        )

        console.log(
          `📌 Updated ${karat} Price in DB: ₹${price} (Previous: ₹${previousPrice}, Change: ${percentageChange?.toFixed(2)}%)`,
          updatedRecord
        )
      })
    )

    console.log(
      `✅ Gold Prices Successfully Updated at ${new Date().toLocaleString()}`
    )
  } catch (error) {
    console.error('❌ Error Fetching Gold Prices:', error)
  }
}

// **Schedule to run at 9 AM, 3 PM, and 9 PM IST**
cron.schedule('0 3,9,15 * * *', () => {
  console.log('🔄 Fetching gold prices (Scheduled Run)')
  fetchGoldPrice()
})

// For GET requests
export async function GET() {
  try {
    const response = await axios.get('your-api-endpoint')
    return NextResponse.json({ data: response.data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// For POST requests
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const response = await axios.post('your-api-endpoint', body)
    return NextResponse.json({ data: response.data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
