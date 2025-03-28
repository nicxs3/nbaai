import { NextResponse } from 'next/server'

async function fetchBoxScore(gameId: string) {
  try {
    const response = await fetch(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Box score fetch failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('Raw box score data:', data)
    return data.game
  } catch (error) {
    console.error('Error fetching box score:', error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')

    if (!gameId) {
      return NextResponse.json(
        { error: 'Game ID is required' },
        { status: 400 }
      )
    }

    const boxScore = await fetchBoxScore(gameId)
    
    // Transform the real NBA API data into our expected format
    const transformedData = {
      homeTeam: {
        players: boxScore.homeTeam.players.map((player: any) => ({
          name: player.name,
          position: player.position || '-',
          minutes: player.statistics?.minutesPlayed || '0:00',
          points: player.statistics?.points || 0,
          rebounds: player.statistics?.reboundsTotal || 0,
          assists: player.statistics?.assists || 0,
          steals: player.statistics?.steals || 0,
          blocks: player.statistics?.blocks || 0,
          fg: `${player.statistics?.fieldGoalsMade || 0}/${player.statistics?.fieldGoalsAttempted || 0}`,
          threes: `${player.statistics?.threePointersMade || 0}/${player.statistics?.threePointersAttempted || 0}`,
          ft: `${player.statistics?.freeThrowsMade || 0}/${player.statistics?.freeThrowsAttempted || 0}`
        }))
      },
      awayTeam: {
        players: boxScore.awayTeam.players.map((player: any) => ({
          name: player.name,
          position: player.position || '-',
          minutes: player.statistics?.minutesPlayed || '0:00',
          points: player.statistics?.points || 0,
          rebounds: player.statistics?.reboundsTotal || 0,
          assists: player.statistics?.assists || 0,
          steals: player.statistics?.steals || 0,
          blocks: player.statistics?.blocks || 0,
          fg: `${player.statistics?.fieldGoalsMade || 0}/${player.statistics?.fieldGoalsAttempted || 0}`,
          threes: `${player.statistics?.threePointersMade || 0}/${player.statistics?.threePointersAttempted || 0}`,
          ft: `${player.statistics?.freeThrowsMade || 0}/${player.statistics?.freeThrowsAttempted || 0}`
        }))
      }
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error in box score API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch box score' },
      { status: 500 }
    )
  }
} 