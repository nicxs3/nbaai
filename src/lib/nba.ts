import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
//w
const execAsync = promisify(exec)

interface Game {
  id: string
  homeTeam: {
    name: string
    score: number
    players?: Array<{
      name: string
      position: string
      minutes: string
      points: number
      rebounds: number
      assists: number
      steals: number
      blocks: number
      fg: string
      threes: string
      ft: string
    }>
  }
  awayTeam: {
    name: string
    score: number
    players?: Array<{
      name: string
      position: string
      minutes: string
      points: number
      rebounds: number
      assists: number
      steals: number
      blocks: number
      fg: string
      threes: string
      ft: string
    }>
  }
  time: string
  status: string
}

interface ApiResponse {
  games: Game[]
}

// Helper functions for team colors
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

export async function getGames(): Promise<Game[]> {
  try {
    // Get the absolute path to the Python script
    const scriptPath = join(process.cwd(), 'main.py')
    
    // Execute the Python script
    const { stdout } = await execAsync(`python ${scriptPath}`)
    
    // Parse the JSON output
    const data = JSON.parse(stdout) as ApiResponse
    
    // Add team colors and logos to the response
    if (data.games) {
      return data.games.map((game: Game) => ({
        ...game,
        homeTeam: {
          ...game.homeTeam,
          color: getTeamColor(game.homeTeam.name),
          secondaryColor: getTeamSecondaryColor(game.homeTeam.name),
          logo: getTeamLogo(game.homeTeam.name)
        },
        awayTeam: {
          ...game.awayTeam,
          color: getTeamColor(game.awayTeam.name),
          secondaryColor: getTeamSecondaryColor(game.awayTeam.name),
          logo: getTeamLogo(game.awayTeam.name)
        }
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error fetching NBA data:', error)
    throw error
  }
} 