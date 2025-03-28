import { NextResponse } from 'next/server'

interface PlayerStatistics {
  points: number
  rebounds: number
  assists: number
  steals: number
  blocks: number
  fieldGoalsMade: number
  fieldGoalsAttempted: number
  threePointersMade: number
  threePointersAttempted: number
  freeThrowsMade: number
  freeThrowsAttempted: number
}

interface Player {
  name: string
  position: string
  minutes: string
  statistics: PlayerStatistics
}

interface Team {
  teamName: string
  score: number
  players: Player[]
}

interface Game {
  gameId: string
  homeTeam: Team
  awayTeam: Team
  gameStatusText: string
  gameStatus: string
}

interface ScoreboardData {
  scoreboard: {
    games: Game[]
  }
}

async function fetchFromPrimaryEndpoint() {
  const response = await fetch('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Primary endpoint failed: ${response.status}`)
  }
  
  const data = await response.json()
  console.log('Primary API Response:', JSON.stringify(data, null, 2))
  return data
}

async function fetchFromBackupEndpoint() {
  const response = await fetch('https://www.balldontlie.io/api/v1/games', {
    headers: {
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Backup endpoint failed: ${response.status}`)
  }
  
  const data = await response.json()
  console.log('Backup API Response:', JSON.stringify(data, null, 2))
  return data
}

export async function GET() {
  try {
    let data: ScoreboardData
    try {
      data = await fetchFromPrimaryEndpoint()
    } catch (error) {
      console.error('Primary endpoint failed, trying backup:', error)
      data = await fetchFromBackupEndpoint()
    }
    
    if (!data.scoreboard || !data.scoreboard.games) {
      throw new Error('Invalid API response format')
    }

    const games = data.scoreboard.games.map((game: Game) => {
      // Log the raw game data
      console.log('Processing game:', game.gameId)
      console.log('Home team players:', game.homeTeam.players)
      console.log('Away team players:', game.awayTeam.players)

      return {
        id: game.gameId,
        homeTeam: {
          name: game.homeTeam.teamName,
          score: game.homeTeam.score,
          color: getTeamColor(game.homeTeam.teamName),
          secondaryColor: getTeamSecondaryColor(game.homeTeam.teamName),
          logo: getTeamLogo(game.homeTeam.teamName),
          players: game.homeTeam.players?.map((player: Player) => ({
            name: player.name || 'Unknown Player',
            position: player.position || '-',
            minutes: player.minutes || '0:00',
            points: player.statistics?.points || 0,
            rebounds: player.statistics?.rebounds || 0,
            assists: player.statistics?.assists || 0,
            steals: player.statistics?.steals || 0,
            blocks: player.statistics?.blocks || 0,
            fg: `${player.statistics?.fieldGoalsMade || 0}/${player.statistics?.fieldGoalsAttempted || 0}`,
            threes: `${player.statistics?.threePointersMade || 0}/${player.statistics?.threePointersAttempted || 0}`,
            ft: `${player.statistics?.freeThrowsMade || 0}/${player.statistics?.freeThrowsAttempted || 0}`
          })) || []
        },
        awayTeam: {
          name: game.awayTeam.teamName,
          score: game.awayTeam.score,
          color: getTeamColor(game.awayTeam.teamName),
          secondaryColor: getTeamSecondaryColor(game.awayTeam.teamName),
          logo: getTeamLogo(game.awayTeam.teamName),
          players: game.awayTeam.players?.map((player: Player) => ({
            name: player.name || 'Unknown Player',
            position: player.position || '-',
            minutes: player.minutes || '0:00',
            points: player.statistics?.points || 0,
            rebounds: player.statistics?.rebounds || 0,
            assists: player.statistics?.assists || 0,
            steals: player.statistics?.steals || 0,
            blocks: player.statistics?.blocks || 0,
            fg: `${player.statistics?.fieldGoalsMade || 0}/${player.statistics?.fieldGoalsAttempted || 0}`,
            threes: `${player.statistics?.threePointersMade || 0}/${player.statistics?.threePointersAttempted || 0}`,
            ft: `${player.statistics?.freeThrowsMade || 0}/${player.statistics?.freeThrowsAttempted || 0}`
          })) || []
        },
        time: game.gameStatusText,
        status: game.gameStatus
      }
    })

    // Log the processed games
    console.log('Processed games:', JSON.stringify(games, null, 2))

    return NextResponse.json({ games })
  } catch (error) {
    console.error('Error fetching NBA data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch NBA data' },
      { status: 500 }
    )
  }
}

function getTeamColor(teamName: string): string {
  const colors: { [key: string]: string } = {
    'Lakers': '#552583',
    'Warriors': '#1D428A',
    'Celtics': '#007A33',
    'Knicks': '#006BB6',
    'Bucks': '#00471B',
    'Bulls': '#CE1141',
    'Heat': '#98002E',
    '76ers': '#006BB6',
    'Suns': '#1D1160',
    'Nuggets': '#0E2240',
    'Jazz': '#002B5C',
    'Cavaliers': '#041E42',
    'Pistons': '#1D42BA',
    'Pacers': '#002D62',
    'Hawks': '#E03A3E',
    'Magic': '#0077C0',
    'Raptors': '#CE1141',
    'Hornets': '#1D1160',
    'Wizards': '#002B5C',
    'Grizzlies': '#5D76A9',
    'Pelicans': '#0C2340',
    'Spurs': '#C4CED4',
    'Rockets': '#CE1141',
    'Mavericks': '#00538C',
    'Thunder': '#007AC1',
    'Timberwolves': '#0C2340',
    'Trail Blazers': '#E03A3E',
    'Kings': '#5A2D81',
    'Clippers': '#C8102E',
    'Nets': '#000000'
  }
  return colors[teamName] || '#000000'
}

function getTeamSecondaryColor(teamName: string): string {
  const colors: { [key: string]: string } = {
    'Lakers': '#FDB927',
    'Warriors': '#FFC72C',
    'Celtics': '#BA9653',
    'Knicks': '#F58426',
    'Bucks': '#EEE1C6',
    'Bulls': '#000000',
    'Heat': '#F9A01B',
    '76ers': '#ED174C',
    'Suns': '#E56020',
    'Nuggets': '#FEC524',
    'Jazz': '#F9A01B',
    'Cavaliers': '#FFB81C',
    'Pistons': '#C8102E',
    'Pacers': '#FDBB30',
    'Hawks': '#C1D32F',
    'Magic': '#C4CED4',
    'Raptors': '#000000',
    'Hornets': '#00788C',
    'Wizards': '#E31837',
    'Grizzlies': '#12173F',
    'Pelicans': '#C8102E',
    'Spurs': '#000000',
    'Rockets': '#000000',
    'Mavericks': '#B8C4CA',
    'Thunder': '#EF3B24',
    'Timberwolves': '#78BE20',
    'Trail Blazers': '#000000',
    'Kings': '#63727A',
    'Clippers': '#1D428A',
    'Nets': '#FFFFFF'
  }
  return colors[teamName] || '#CCCCCC'
}

function getTeamLogo(teamName: string): string {
  const logos: { [key: string]: string } = {
    'Lakers': 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'Warriors': 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
    'Celtics': 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
    'Knicks': 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
    'Bucks': 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
    'Bulls': 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
    'Heat': 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
    '76ers': 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
    'Suns': 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
    'Nuggets': 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
    'Jazz': 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
    'Cavaliers': 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
    'Pistons': 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
    'Pacers': 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
    'Hawks': 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
    'Magic': 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
    'Raptors': 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
    'Hornets': 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
    'Wizards': 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg',
    'Grizzlies': 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
    'Pelicans': 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
    'Spurs': 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg',
    'Rockets': 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
    'Mavericks': 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
    'Thunder': 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
    'Timberwolves': 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
    'Trail Blazers': 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
    'Kings': 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
    'Clippers': 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
    'Nets': 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg'
  }
  return logos[teamName] || 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg'
} 