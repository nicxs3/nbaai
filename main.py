from nba_api.stats.endpoints import playercareerstats, boxscoretraditionalv2
from nba_api.live.nba.endpoints import scoreboard
import pandas as pd
import json
from datetime import datetime
import pytz

def print_jokic_stats():
    # Nikola Jokić career stats
    career = playercareerstats.PlayerCareerStats(player_id='203999')
    df = career.get_data_frames()[0]
    
    # Select most important columns for clarity
    important_cols = ['SEASON_ID', 'TEAM_ABBREVIATION', 'GP', 'MIN', 'PTS', 'AST', 'REB', 'FG_PCT', 'FG3_PCT', 'FT_PCT']
    print("\n=== Nikola Jokić Career Stats ===")
    print(df[important_cols].to_string(index=False))

def get_todays_games():
    # Get today's games
    board = scoreboard.ScoreBoard()
    games_dict = board.get_dict()
    games = games_dict['scoreboard']['games']
    
    # Transform the games data
    transformed_games = []
    
    for game in games:
        # Get game ID
        game_id = game['gameId']
        
        # Get box score for the game
        try:
            box_score = boxscoretraditionalv2.BoxScoreTraditionalV2(game_id=game_id)
            box_score_dict = box_score.get_dict()
            
            # Get player stats from both teams
            player_stats = box_score_dict['resultSets'][0]['rowSet']
            headers = box_score_dict['resultSets'][0]['headers']
            
            # Create a mapping of column names to indices
            col_idx = {col: idx for idx, col in enumerate(headers)}
            
            # Get team IDs
            home_team_id = game['homeTeam']['teamId']
            away_team_id = game['awayTeam']['teamId']
            
            # Filter players by team
            away_team_players = [player for player in player_stats if str(player[col_idx['TEAM_ID']]) == str(away_team_id)]
            home_team_players = [player for player in player_stats if str(player[col_idx['TEAM_ID']]) == str(home_team_id)]
            
            # Transform player stats
            def transform_player_stats(players):
                return [{
                    'name': player[col_idx['PLAYER_NAME']],
                    'position': player[col_idx.get('START_POSITION', '')],
                    'minutes': player[col_idx['MIN']],
                    'points': player[col_idx['PTS']],
                    'rebounds': player[col_idx['REB']],
                    'assists': player[col_idx['AST']],
                    'steals': player[col_idx['STL']],
                    'blocks': player[col_idx['BLK']],
                    'fg': f"{player[col_idx['FGM']]}/{player[col_idx['FGA']]}",
                    'threes': f"{player[col_idx['FG3M']]}/{player[col_idx['FG3A']]}",
                    'ft': f"{player[col_idx['FTM']]}/{player[col_idx['FTA']]}"
                } for player in players if player[col_idx['MIN']] is not None]  # only include players who played
            
            # Get game time/status
            game_status = game['gameStatus']
            game_period = game.get('period', 0)
            game_clock = game.get('gameClock', '')
            
            # Format the status/time string
            if game_status == 1:  # Not started
                status = game.get('gameStatusText', 'Starting Soon')
                time = status
            elif game_status == 2:  # In progress
                period_text = f"Q{game_period}" if game_period <= 4 else f"OT{game_period-4}"
                time = f"In Progress - {period_text} {game_clock}"
                status = time
            else:  # Finished
                status = "Final"
                time = status
            
            transformed_game = {
                'id': game_id,
                'homeTeam': {
                    'name': game['homeTeam']['teamName'],
                    'logo': f"/teams/{game['homeTeam']['teamName'].lower().replace(' ', '')}.svg",
                    'color': get_team_color(game['homeTeam']['teamName']),
                    'secondaryColor': get_team_secondary_color(game['homeTeam']['teamName']),
                    'score': game['homeTeam']['score'],
                    'players': transform_player_stats(home_team_players)
                },
                'awayTeam': {
                    'name': game['awayTeam']['teamName'],
                    'logo': f"/teams/{game['awayTeam']['teamName'].lower().replace(' ', '')}.svg",
                    'color': get_team_color(game['awayTeam']['teamName']),
                    'secondaryColor': get_team_secondary_color(game['awayTeam']['teamName']),
                    'score': game['awayTeam']['score'],
                    'players': transform_player_stats(away_team_players)
                },
                'time': time,
                'status': status
            }
            
            transformed_games.append(transformed_game)
            
        except Exception as e:
            print(f"Error getting box score for game {game_id}: {str(e)}")
            # If we can't get the box score, still include the game but without player stats
            transformed_game = {
                'id': game_id,
                'homeTeam': {
                    'name': game['homeTeam']['teamName'],
                    'logo': f"/teams/{game['homeTeam']['teamName'].lower().replace(' ', '')}.svg",
                    'color': get_team_color(game['homeTeam']['teamName']),
                    'secondaryColor': get_team_secondary_color(game['homeTeam']['teamName']),
                    'score': game['homeTeam']['score'],
                    'players': []
                },
                'awayTeam': {
                    'name': game['awayTeam']['teamName'],
                    'logo': f"/teams/{game['awayTeam']['teamName'].lower().replace(' ', '')}.svg",
                    'color': get_team_color(game['awayTeam']['teamName']),
                    'secondaryColor': get_team_secondary_color(game['awayTeam']['teamName']),
                    'score': game['awayTeam']['score'],
                    'players': []
                },
                'time': game.get('gameStatusText', 'Starting Soon'),
                'status': game.get('gameStatusText', 'Starting Soon')
            }
            transformed_games.append(transformed_game)
    
    return {'games': transformed_games}

def get_team_color(team_name: str) -> str:
    colors = {
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
        'Timberwolves': '#0C2340',
        'Pelicans': '#0C2340',
        'Kings': '#5A2D81',
        'Clippers': '#C8102E',
        'Mavericks': '#00538C',
        'Rockets': '#CE1141',
        'Spurs': '#C4CED4',
        'Grizzlies': '#5D76A9',
        'Thunder': '#007AC1',
        'Trail Blazers': '#E03A3E',
        'Jazz': '#002B5C',
        'Cavaliers': '#860038',
        'Pistons': '#C8102E',
        'Pacers': '#002D62',
        'Hawks': '#E03A3E',
        'Magic': '#0077C0',
        'Hornets': '#1D1160',
        'Wizards': '#002B5C',
        'Raptors': '#CE1141'
    }
    return colors.get(team_name, '#000000')

def get_team_secondary_color(team_name: str) -> str:
    colors = {
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
        'Timberwolves': '#236192',
        'Pelicans': '#C8102E',
        'Kings': '#63727A',
        'Clippers': '#1D428A',
        'Mavericks': '#002B5E',
        'Rockets': '#000000',
        'Spurs': '#000000',
        'Grizzlies': '#12173F',
        'Thunder': '#EF3B24',
        'Trail Blazers': '#000000',
        'Jazz': '#00471B',
        'Cavaliers': '#041E42',
        'Pistons': '#1D42BA',
        'Pacers': '#FDBB30',
        'Hawks': '#C1D32F',
        'Magic': '#C4CED4',
        'Hornets': '#00788C',
        'Wizards': '#E31837',
        'Raptors': '#000000'
    }
    return colors.get(team_name, '#CCCCCC')

if __name__ == "__main__":
    games_data = get_todays_games()
    print(json.dumps(games_data, indent=2))
