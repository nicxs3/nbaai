from nba_api.stats.endpoints import playercareerstats, boxscoretraditionalv2
from nba_api.live.nba.endpoints import scoreboard
import pandas as pd
import json

def print_jokic_stats():
    # Nikola Jokić career stats
    career = playercareerstats.PlayerCareerStats(player_id='203999')
    df = career.get_data_frames()[0]
    
    # Select most important columns for clarity
    important_cols = ['SEASON_ID', 'TEAM_ABBREVIATION', 'GP', 'MIN', 'PTS', 'AST', 'REB', 'FG_PCT', 'FG3_PCT', 'FT_PCT']
    print("\n=== Nikola Jokić Career Stats ===")
    print(df[important_cols].to_string(index=False))

def print_todays_games():
    # Today's games
    games = scoreboard.ScoreBoard()
    games_dict = games.get_dict()
    
    print("\n=== Today's NBA Games ===")
    for game in games_dict['scoreboard']['games']:
        home_team = game['homeTeam']
        away_team = game['awayTeam']
        print(f"\n{away_team['teamName']} ({away_team['score']}) @ {home_team['teamName']} ({home_team['score']})")
        print(f"Status: {game['gameStatus']}")

if __name__ == "__main__":
    print_jokic_stats()
    print_todays_games()
