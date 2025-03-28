"use client"
//hello
import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, X, ArrowUp, ArrowDown, TrendingUp, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

// Type definitions
interface Team {
  name: string
  logo: string
  color: string
  secondaryColor: string
  score: number
}

interface Game {
  id: number
  homeTeam: Team
  awayTeam: Team
  time: string
  status: string
}

interface Player {
  name: string
  position: string
  minutes: number
  points: number
  rebounds: number
  assists: number
  steals: number
  blocks: number
  fg: string
  threes: string
  ft: string
}

interface TeamBoxScore {
  name: string
  quarters: number[]
  total: number
  players: Player[]
}

interface BoxScore {
  awayTeam: TeamBoxScore
  homeTeam: TeamBoxScore
}

interface PlayerProp {
  player: string
  team: string
  stat: string
  line: number
  recommendation: "over" | "under"
  confidence: number
  trend: "up" | "down"
}

interface GameProps {
  prizePicks: PlayerProp[]
  underdogs: PlayerProp[]
}

// Mock data for NBA games
const todaysGames: Game[] = [
  {
    id: 1,
    homeTeam: {
      name: "Lakers",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#552583",
      secondaryColor: "#FDB927",
      score: 105,
    },
    awayTeam: {
      name: "Warriors",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#1D428A",
      secondaryColor: "#FFC72C",
      score: 110,
    },
    time: "7:30 PM ET",
    status: "In Progress - Q4 2:45",
  },
  {
    id: 2,
    homeTeam: {
      name: "Celtics",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#007A33",
      secondaryColor: "#BA9653",
      score: 98,
    },
    awayTeam: {
      name: "Knicks",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#006BB6",
      secondaryColor: "#F58426",
      score: 92,
    },
    time: "8:00 PM ET",
    status: "In Progress - Q3 5:22",
  },
  {
    id: 3,
    homeTeam: {
      name: "Bucks",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#00471B",
      secondaryColor: "#EEE1C6",
      score: 88,
    },
    awayTeam: {
      name: "Bulls",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#CE1141",
      secondaryColor: "#000000",
      score: 85,
    },
    time: "6:30 PM ET",
    status: "In Progress - Q3 1:15",
  },
  {
    id: 4,
    homeTeam: {
      name: "Heat",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#98002E",
      secondaryColor: "#F9A01B",
      score: 67,
    },
    awayTeam: {
      name: "76ers",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#006BB6",
      secondaryColor: "#ED174C",
      score: 72,
    },
    time: "7:00 PM ET",
    status: "In Progress - Q2 4:30",
  },
  {
    id: 5,
    homeTeam: {
      name: "Suns",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#1D1160",
      secondaryColor: "#E56020",
      score: 0,
    },
    awayTeam: {
      name: "Nuggets",
      logo: "/placeholder.svg?height=80&width=80",
      color: "#0E2240",
      secondaryColor: "#FEC524",
      score: 0,
    },
    time: "10:30 PM ET",
    status: "Starting Soon",
  },
]

// Mock data for player props
const playerProps: Record<number, GameProps> = {
  1: {
    // Lakers vs Warriors
    prizePicks: [
      {
        player: "Stephen Curry",
        team: "Warriors",
        stat: "Points",
        line: 28.5,
        recommendation: "over" as const,
        confidence: 85,
        trend: "up" as const,
      },
      {
        player: "LeBron James",
        team: "Lakers",
        stat: "Points + Rebounds + Assists",
        line: 42.5,
        recommendation: "over" as const,
        confidence: 80,
        trend: "up" as const,
      },
      {
        player: "Anthony Davis",
        team: "Lakers",
        stat: "Rebounds",
        line: 12.5,
        recommendation: "under" as const,
        confidence: 75,
        trend: "down" as const,
      },
      {
        player: "Klay Thompson",
        team: "Warriors",
        stat: "3-Pointers Made",
        line: 3.5,
        recommendation: "over" as const,
        confidence: 70,
        trend: "up" as const,
      },
      {
        player: "D'Angelo Russell",
        team: "Lakers",
        stat: "Assists",
        line: 6.5,
        recommendation: "under" as const,
        confidence: 65,
        trend: "down" as const,
      },
    ],
    underdogs: [
      {
        player: "Draymond Green",
        team: "Warriors",
        stat: "Assists",
        line: 7.5,
        recommendation: "over" as const,
        confidence: 78,
        trend: "up" as const,
      },
      {
        player: "Austin Reaves",
        team: "Lakers",
        stat: "Points",
        line: 14.5,
        recommendation: "over" as const,
        confidence: 72,
        trend: "up" as const,
      },
      {
        player: "Jonathan Kuminga",
        team: "Warriors",
        stat: "Points + Rebounds",
        line: 19.5,
        recommendation: "under" as const,
        confidence: 68,
        trend: "down" as const,
      },
      {
        player: "Rui Hachimura",
        team: "Lakers",
        stat: "Points",
        line: 11.5,
        recommendation: "under" as const,
        confidence: 63,
        trend: "down" as const,
      },
      {
        player: "Brandin Podziemski",
        team: "Warriors",
        stat: "Rebounds",
        line: 5.5,
        recommendation: "over" as const,
        confidence: 60,
        trend: "up" as const,
      },
    ],
  },
  2: {
    // Celtics vs Knicks
    prizePicks: [
      {
        player: "Jayson Tatum",
        team: "Celtics",
        stat: "Points",
        line: 29.5,
        recommendation: "over" as const,
        confidence: 82,
        trend: "up" as const,
      },
      {
        player: "Jalen Brunson",
        team: "Knicks",
        stat: "Points + Assists",
        line: 35.5,
        recommendation: "over" as const,
        confidence: 79,
        trend: "up" as const,
      },
      {
        player: "Kristaps Porzingis",
        team: "Celtics",
        stat: "Rebounds",
        line: 8.5,
        recommendation: "under" as const,
        confidence: 74,
        trend: "down" as const,
      },
      {
        player: "Derrick White",
        team: "Celtics",
        stat: "3-Pointers Made",
        line: 2.5,
        recommendation: "over" as const,
        confidence: 71,
        trend: "up" as const,
      },
      {
        player: "OG Anunoby",
        team: "Knicks",
        stat: "Points",
        line: 15.5,
        recommendation: "under" as const,
        confidence: 67,
        trend: "down" as const,
      },
    ],
    underdogs: [
      {
        player: "Jaylen Brown",
        team: "Celtics",
        stat: "Points",
        line: 24.5,
        recommendation: "over" as const,
        confidence: 76,
        trend: "up" as const,
      },
      {
        player: "Donte DiVincenzo",
        team: "Knicks",
        stat: "3-Pointers Made",
        line: 3.5,
        recommendation: "over" as const,
        confidence: 73,
        trend: "up" as const,
      },
      {
        player: "Al Horford",
        team: "Celtics",
        stat: "Points + Rebounds",
        line: 15.5,
        recommendation: "under" as const,
        confidence: 69,
        trend: "down" as const,
      },
      {
        player: "Josh Hart",
        team: "Knicks",
        stat: "Rebounds",
        line: 8.5,
        recommendation: "over" as const,
        confidence: 66,
        trend: "up" as const,
      },
      {
        player: "Payton Pritchard",
        team: "Celtics",
        stat: "Points",
        line: 9.5,
        recommendation: "under" as const,
        confidence: 62,
        trend: "down" as const,
      },
    ],
  },
  3: {
    // Bucks vs Bulls
    prizePicks: [
      {
        player: "Giannis Antetokounmpo",
        team: "Bucks",
        stat: "Points",
        line: 32.5,
        recommendation: "over" as const,
        confidence: 88,
        trend: "up" as const,
      },
      {
        player: "Coby White",
        team: "Bulls",
        stat: "Points + Assists",
        line: 25.5,
        recommendation: "over" as const,
        confidence: 77,
        trend: "up" as const,
      },
      {
        player: "Damian Lillard",
        team: "Bucks",
        stat: "3-Pointers Made",
        line: 3.5,
        recommendation: "over" as const,
        confidence: 75,
        trend: "up" as const,
      },
      {
        player: "Nikola Vucevic",
        team: "Bulls",
        stat: "Rebounds",
        line: 11.5,
        recommendation: "under" as const,
        confidence: 70,
        trend: "down" as const,
      },
      {
        player: "Khris Middleton",
        team: "Bucks",
        stat: "Points",
        line: 18.5,
        recommendation: "under" as const,
        confidence: 65,
        trend: "down" as const,
      },
    ],
    underdogs: [
      {
        player: "Patrick Williams",
        team: "Bulls",
        stat: "Points",
        line: 12.5,
        recommendation: "over" as const,
        confidence: 72,
        trend: "up" as const,
      },
      {
        player: "Bobby Portis",
        team: "Bucks",
        stat: "Rebounds",
        line: 7.5,
        recommendation: "over" as const,
        confidence: 69,
        trend: "up" as const,
      },
      {
        player: "Ayo Dosunmu",
        team: "Bulls",
        stat: "Points + Assists",
        line: 17.5,
        recommendation: "under" as const,
        confidence: 67,
        trend: "down" as const,
      },
      {
        player: "Brook Lopez",
        team: "Bucks",
        stat: "Blocks",
        line: 1.5,
        recommendation: "over" as const,
        confidence: 64,
        trend: "up" as const,
      },
      {
        player: "Malik Beasley",
        team: "Bucks",
        stat: "Points",
        line: 10.5,
        recommendation: "under" as const,
        confidence: 61,
        trend: "down" as const,
      },
    ],
  },
  4: {
    // Heat vs 76ers
    prizePicks: [
      {
        player: "Jimmy Butler",
        team: "Heat",
        stat: "Points",
        line: 24.5,
        recommendation: "over" as const,
        confidence: 81,
        trend: "up" as const,
      },
      {
        player: "Tyrese Maxey",
        team: "76ers",
        stat: "Points + Assists",
        line: 32.5,
        recommendation: "over" as const,
        confidence: 78,
        trend: "up" as const,
      },
      {
        player: "Bam Adebayo",
        team: "Heat",
        stat: "Rebounds",
        line: 10.5,
        recommendation: "under" as const,
        confidence: 73,
        trend: "down" as const,
      },
      {
        player: "Tobias Harris",
        team: "76ers",
        stat: "Points",
        line: 17.5,
        recommendation: "under" as const,
        confidence: 69,
        trend: "down" as const,
      },
      {
        player: "Tyler Herro",
        team: "Heat",
        stat: "3-Pointers Made",
        line: 2.5,
        recommendation: "over" as const,
        confidence: 66,
        trend: "up" as const,
      },
    ],
    underdogs: [
      {
        player: "Kelly Oubre Jr.",
        team: "76ers",
        stat: "Points",
        line: 14.5,
        recommendation: "over" as const,
        confidence: 74,
        trend: "up" as const,
      },
      {
        player: "Caleb Martin",
        team: "Heat",
        stat: "Points + Rebounds",
        line: 15.5,
        recommendation: "over" as const,
        confidence: 71,
        trend: "up" as const,
      },
      {
        player: "Paul Reed",
        team: "76ers",
        stat: "Rebounds",
        line: 6.5,
        recommendation: "under" as const,
        confidence: 68,
        trend: "down" as const,
      },
      {
        player: "Duncan Robinson",
        team: "Heat",
        stat: "3-Pointers Made",
        line: 2.5,
        recommendation: "over" as const,
        confidence: 65,
        trend: "up" as const,
      },
      {
        player: "Kyle Lowry",
        team: "76ers",
        stat: "Assists",
        line: 5.5,
        recommendation: "under" as const,
        confidence: 62,
        trend: "down" as const,
      },
    ],
  },
  5: {
    // Suns vs Nuggets
    prizePicks: [
      {
        player: "Kevin Durant",
        team: "Suns",
        stat: "Points",
        line: 28.5,
        recommendation: "over" as const,
        confidence: 84,
        trend: "up" as const,
      },
      {
        player: "Nikola Jokic",
        team: "Nuggets",
        stat: "Points + Rebounds + Assists",
        line: 50.5,
        recommendation: "over" as const,
        confidence: 83,
        trend: "up" as const,
      },
      {
        player: "Devin Booker",
        team: "Suns",
        stat: "Points + Assists",
        line: 35.5,
        recommendation: "under" as const,
        confidence: 72,
        trend: "down" as const,
      },
      {
        player: "Jamal Murray",
        team: "Nuggets",
        stat: "Points",
        line: 22.5,
        recommendation: "over" as const,
        confidence: 70,
        trend: "up" as const,
      },
      {
        player: "Bradley Beal",
        team: "Suns",
        stat: "Points",
        line: 18.5,
        recommendation: "under" as const,
        confidence: 67,
        trend: "down" as const,
      },
    ],
    underdogs: [
      {
        player: "Michael Porter Jr.",
        team: "Nuggets",
        stat: "Points",
        line: 16.5,
        recommendation: "over" as const,
        confidence: 75,
        trend: "up" as const,
      },
      {
        player: "Jusuf Nurkic",
        team: "Suns",
        stat: "Rebounds",
        line: 9.5,
        recommendation: "over" as const,
        confidence: 72,
        trend: "up" as const,
      },
      {
        player: "Aaron Gordon",
        team: "Nuggets",
        stat: "Points + Rebounds",
        line: 20.5,
        recommendation: "under" as const,
        confidence: 69,
        trend: "down" as const,
      },
      {
        player: "Grayson Allen",
        team: "Suns",
        stat: "3-Pointers Made",
        line: 2.5,
        recommendation: "over" as const,
        confidence: 66,
        trend: "up" as const,
      },
      {
        player: "Kentavious Caldwell-Pope",
        team: "Nuggets",
        stat: "Points",
        line: 9.5,
        recommendation: "under" as const,
        confidence: 63,
        trend: "down" as const,
      },
    ],
  },
}

// Mock box score data
const boxScores: Record<number, BoxScore> = {
  1: {
    // Lakers vs Warriors
    awayTeam: {
      name: "Warriors",
      quarters: [28, 32, 25, 25],
      total: 110,
      players: [
        {
          name: "Stephen Curry",
          position: "PG",
          minutes: 36,
          points: 32,
          rebounds: 5,
          assists: 8,
          steals: 2,
          blocks: 0,
          fg: "11-22",
          threes: "6-12",
          ft: "4-4",
        },
        {
          name: "Klay Thompson",
          position: "SG",
          minutes: 34,
          points: 18,
          rebounds: 4,
          assists: 2,
          steals: 1,
          blocks: 0,
          fg: "7-16",
          threes: "4-10",
          ft: "0-0",
        },
        {
          name: "Andrew Wiggins",
          position: "SF",
          minutes: 32,
          points: 14,
          rebounds: 6,
          assists: 3,
          steals: 0,
          blocks: 1,
          fg: "6-13",
          threes: "2-5",
          ft: "0-0",
        },
        {
          name: "Draymond Green",
          position: "PF",
          minutes: 30,
          points: 8,
          rebounds: 7,
          assists: 9,
          steals: 1,
          blocks: 2,
          fg: "3-5",
          threes: "0-1",
          ft: "2-2",
        },
        {
          name: "Kevon Looney",
          position: "C",
          minutes: 22,
          points: 6,
          rebounds: 9,
          assists: 1,
          steals: 0,
          blocks: 1,
          fg: "3-4",
          threes: "0-0",
          ft: "0-2",
        },
        {
          name: "Jonathan Kuminga",
          position: "F",
          minutes: 24,
          points: 12,
          rebounds: 5,
          assists: 1,
          steals: 0,
          blocks: 0,
          fg: "5-9",
          threes: "1-2",
          ft: "1-2",
        },
        {
          name: "Brandin Podziemski",
          position: "G",
          minutes: 18,
          points: 8,
          rebounds: 6,
          assists: 2,
          steals: 1,
          blocks: 0,
          fg: "3-6",
          threes: "2-4",
          ft: "0-0",
        },
        {
          name: "Gary Payton II",
          position: "G",
          minutes: 16,
          points: 6,
          rebounds: 2,
          assists: 1,
          steals: 2,
          blocks: 0,
          fg: "3-5",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Moses Moody",
          position: "G",
          minutes: 14,
          points: 6,
          rebounds: 1,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "2-5",
          threes: "2-4",
          ft: "0-0",
        },
      ],
    },
    homeTeam: {
      name: "Lakers",
      quarters: [26, 24, 30, 25],
      total: 105,
      players: [
        {
          name: "D'Angelo Russell",
          position: "PG",
          minutes: 32,
          points: 14,
          rebounds: 3,
          assists: 6,
          steals: 1,
          blocks: 0,
          fg: "5-14",
          threes: "2-8",
          ft: "2-2",
        },
        {
          name: "Austin Reaves",
          position: "SG",
          minutes: 34,
          points: 16,
          rebounds: 4,
          assists: 5,
          steals: 0,
          blocks: 0,
          fg: "6-12",
          threes: "2-5",
          ft: "2-2",
        },
        {
          name: "LeBron James",
          position: "SF",
          minutes: 38,
          points: 28,
          rebounds: 10,
          assists: 9,
          steals: 1,
          blocks: 1,
          fg: "11-20",
          threes: "3-7",
          ft: "3-4",
        },
        {
          name: "Rui Hachimura",
          position: "PF",
          minutes: 28,
          points: 10,
          rebounds: 5,
          assists: 1,
          steals: 0,
          blocks: 0,
          fg: "4-9",
          threes: "1-3",
          ft: "1-2",
        },
        {
          name: "Anthony Davis",
          position: "C",
          minutes: 36,
          points: 24,
          rebounds: 12,
          assists: 3,
          steals: 1,
          blocks: 3,
          fg: "10-18",
          threes: "0-1",
          ft: "4-6",
        },
        {
          name: "Jarred Vanderbilt",
          position: "F",
          minutes: 18,
          points: 4,
          rebounds: 6,
          assists: 1,
          steals: 2,
          blocks: 0,
          fg: "2-3",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Gabe Vincent",
          position: "G",
          minutes: 16,
          points: 5,
          rebounds: 1,
          assists: 3,
          steals: 0,
          blocks: 0,
          fg: "2-6",
          threes: "1-4",
          ft: "0-0",
        },
        {
          name: "Taurean Prince",
          position: "F",
          minutes: 14,
          points: 4,
          rebounds: 2,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "1-4",
          threes: "0-2",
          ft: "2-2",
        },
        {
          name: "Christian Wood",
          position: "C",
          minutes: 10,
          points: 0,
          rebounds: 3,
          assists: 0,
          steals: 0,
          blocks: 1,
          fg: "0-2",
          threes: "0-1",
          ft: "0-0",
        },
      ],
    },
  },
  2: {
    // Celtics vs Knicks
    awayTeam: {
      name: "Knicks",
      quarters: [24, 26, 22, 20],
      total: 92,
      players: [
        {
          name: "Jalen Brunson",
          position: "PG",
          minutes: 36,
          points: 28,
          rebounds: 3,
          assists: 7,
          steals: 1,
          blocks: 0,
          fg: "10-22",
          threes: "3-8",
          ft: "5-6",
        },
        {
          name: "Donte DiVincenzo",
          position: "SG",
          minutes: 32,
          points: 14,
          rebounds: 4,
          assists: 3,
          steals: 2,
          blocks: 0,
          fg: "5-13",
          threes: "4-10",
          ft: "0-0",
        },
        {
          name: "OG Anunoby",
          position: "SF",
          minutes: 34,
          points: 12,
          rebounds: 5,
          assists: 2,
          steals: 1,
          blocks: 1,
          fg: "5-12",
          threes: "2-6",
          ft: "0-0",
        },
        {
          name: "Julius Randle",
          position: "PF",
          minutes: 36,
          points: 18,
          rebounds: 8,
          assists: 4,
          steals: 0,
          blocks: 0,
          fg: "7-18",
          threes: "1-4",
          ft: "3-4",
        },
        {
          name: "Isaiah Hartenstein",
          position: "C",
          minutes: 28,
          points: 8,
          rebounds: 10,
          assists: 2,
          steals: 1,
          blocks: 2,
          fg: "4-6",
          threes: "0-0",
          ft: "0-2",
        },
        {
          name: "Josh Hart",
          position: "G/F",
          minutes: 30,
          points: 6,
          rebounds: 9,
          assists: 3,
          steals: 1,
          blocks: 0,
          fg: "3-8",
          threes: "0-2",
          ft: "0-0",
        },
        {
          name: "Miles McBride",
          position: "G",
          minutes: 16,
          points: 4,
          rebounds: 1,
          assists: 2,
          steals: 0,
          blocks: 0,
          fg: "2-5",
          threes: "0-2",
          ft: "0-0",
        },
        {
          name: "Precious Achiuwa",
          position: "F/C",
          minutes: 14,
          points: 2,
          rebounds: 4,
          assists: 0,
          steals: 0,
          blocks: 1,
          fg: "1-3",
          threes: "0-0",
          ft: "0-0",
        },
      ],
    },
    homeTeam: {
      name: "Celtics",
      quarters: [22, 28, 26, 22],
      total: 98,
      players: [
        {
          name: "Jrue Holiday",
          position: "PG",
          minutes: 32,
          points: 12,
          rebounds: 5,
          assists: 6,
          steals: 2,
          blocks: 1,
          fg: "5-11",
          threes: "2-5",
          ft: "0-0",
        },
        {
          name: "Derrick White",
          position: "SG",
          minutes: 30,
          points: 14,
          rebounds: 3,
          assists: 4,
          steals: 1,
          blocks: 2,
          fg: "5-12",
          threes: "3-7",
          ft: "1-2",
        },
        {
          name: "Jaylen Brown",
          position: "SF",
          minutes: 36,
          points: 22,
          rebounds: 6,
          assists: 3,
          steals: 1,
          blocks: 0,
          fg: "9-18",
          threes: "2-6",
          ft: "2-3",
        },
        {
          name: "Jayson Tatum",
          position: "PF",
          minutes: 38,
          points: 26,
          rebounds: 8,
          assists: 5,
          steals: 1,
          blocks: 1,
          fg: "9-20",
          threes: "3-9",
          ft: "5-6",
        },
        {
          name: "Kristaps Porzingis",
          position: "C",
          minutes: 30,
          points: 16,
          rebounds: 7,
          assists: 2,
          steals: 0,
          blocks: 3,
          fg: "6-13",
          threes: "2-5",
          ft: "2-2",
        },
        {
          name: "Al Horford",
          position: "F/C",
          minutes: 22,
          points: 4,
          rebounds: 6,
          assists: 3,
          steals: 0,
          blocks: 1,
          fg: "2-5",
          threes: "0-2",
          ft: "0-0",
        },
        {
          name: "Payton Pritchard",
          position: "G",
          minutes: 18,
          points: 4,
          rebounds: 2,
          assists: 3,
          steals: 0,
          blocks: 0,
          fg: "2-7",
          threes: "0-4",
          ft: "0-0",
        },
        {
          name: "Sam Hauser",
          position: "F",
          minutes: 14,
          points: 0,
          rebounds: 2,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-3",
          threes: "0-3",
          ft: "0-0",
        },
      ],
    },
  },
  3: {
    // Bucks vs Bulls
    awayTeam: {
      name: "Bulls",
      quarters: [22, 24, 25, 14],
      total: 85,
      players: [
        {
          name: "Coby White",
          position: "PG",
          minutes: 34,
          points: 22,
          rebounds: 4,
          assists: 6,
          steals: 1,
          blocks: 0,
          fg: "8-18",
          threes: "4-10",
          ft: "2-2",
        },
        {
          name: "Zach LaVine",
          position: "SG",
          minutes: 32,
          points: 18,
          rebounds: 5,
          assists: 3,
          steals: 1,
          blocks: 0,
          fg: "7-17",
          threes: "2-7",
          ft: "2-3",
        },
        {
          name: "Patrick Williams",
          position: "SF",
          minutes: 30,
          points: 10,
          rebounds: 6,
          assists: 2,
          steals: 0,
          blocks: 1,
          fg: "4-10",
          threes: "1-3",
          ft: "1-2",
        },
        {
          name: "Torrey Craig",
          position: "PF",
          minutes: 24,
          points: 6,
          rebounds: 5,
          assists: 1,
          steals: 1,
          blocks: 0,
          fg: "3-6",
          threes: "0-2",
          ft: "0-0",
        },
        {
          name: "Nikola Vucevic",
          position: "C",
          minutes: 32,
          points: 16,
          rebounds: 10,
          assists: 3,
          steals: 0,
          blocks: 1,
          fg: "7-15",
          threes: "1-4",
          ft: "1-2",
        },
        {
          name: "Ayo Dosunmu",
          position: "G",
          minutes: 26,
          points: 8,
          rebounds: 3,
          assists: 4,
          steals: 1,
          blocks: 0,
          fg: "4-9",
          threes: "0-2",
          ft: "0-0",
        },
        {
          name: "Andre Drummond",
          position: "C",
          minutes: 16,
          points: 4,
          rebounds: 8,
          assists: 0,
          steals: 1,
          blocks: 1,
          fg: "2-4",
          threes: "0-0",
          ft: "0-2",
        },
        {
          name: "Jevon Carter",
          position: "G",
          minutes: 14,
          points: 1,
          rebounds: 1,
          assists: 2,
          steals: 0,
          blocks: 0,
          fg: "0-3",
          threes: "0-2",
          ft: "1-2",
        },
      ],
    },
    homeTeam: {
      name: "Bucks",
      quarters: [20, 26, 24, 18],
      total: 88,
      players: [
        {
          name: "Damian Lillard",
          position: "PG",
          minutes: 36,
          points: 24,
          rebounds: 4,
          assists: 8,
          steals: 1,
          blocks: 0,
          fg: "8-20",
          threes: "4-12",
          ft: "4-4",
        },
        {
          name: "Malik Beasley",
          position: "SG",
          minutes: 28,
          points: 8,
          rebounds: 3,
          assists: 1,
          steals: 0,
          blocks: 0,
          fg: "3-10",
          threes: "2-8",
          ft: "0-0",
        },
        {
          name: "Khris Middleton",
          position: "SF",
          minutes: 32,
          points: 16,
          rebounds: 5,
          assists: 4,
          steals: 1,
          blocks: 0,
          fg: "6-14",
          threes: "2-5",
          ft: "2-2",
        },
        {
          name: "Giannis Antetokounmpo",
          position: "PF",
          minutes: 36,
          points: 28,
          rebounds: 12,
          assists: 6,
          steals: 1,
          blocks: 2,
          fg: "11-18",
          threes: "0-1",
          ft: "6-10",
        },
        {
          name: "Brook Lopez",
          position: "C",
          minutes: 30,
          points: 6,
          rebounds: 5,
          assists: 1,
          steals: 0,
          blocks: 3,
          fg: "3-8",
          threes: "0-4",
          ft: "0-0",
        },
        {
          name: "Bobby Portis",
          position: "F/C",
          minutes: 22,
          points: 6,
          rebounds: 8,
          assists: 1,
          steals: 0,
          blocks: 0,
          fg: "3-9",
          threes: "0-2",
          ft: "0-0",
        },
        {
          name: "Pat Connaughton",
          position: "G/F",
          minutes: 18,
          points: 0,
          rebounds: 3,
          assists: 1,
          steals: 0,
          blocks: 0,
          fg: "0-4",
          threes: "0-3",
          ft: "0-0",
        },
        {
          name: "AJ Green",
          position: "G",
          minutes: 12,
          points: 0,
          rebounds: 1,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-3",
          threes: "0-3",
          ft: "0-0",
        },
      ],
    },
  },
  4: {
    // Heat vs 76ers
    awayTeam: {
      name: "76ers",
      quarters: [18, 24, 18, 12],
      total: 72,
      players: [
        {
          name: "Tyrese Maxey",
          position: "PG",
          minutes: 34,
          points: 24,
          rebounds: 3,
          assists: 6,
          steals: 1,
          blocks: 0,
          fg: "9-20",
          threes: "3-8",
          ft: "3-4",
        },
        {
          name: "Kelly Oubre Jr.",
          position: "SG",
          minutes: 30,
          points: 12,
          rebounds: 5,
          assists: 2,
          steals: 1,
          blocks: 0,
          fg: "5-14",
          threes: "1-5",
          ft: "1-2",
        },
        {
          name: "Tobias Harris",
          position: "SF",
          minutes: 32,
          points: 14,
          rebounds: 6,
          assists: 2,
          steals: 0,
          blocks: 1,
          fg: "6-15",
          threes: "1-4",
          ft: "1-2",
        },
        {
          name: "Nicolas Batum",
          position: "PF",
          minutes: 26,
          points: 6,
          rebounds: 4,
          assists: 3,
          steals: 1,
          blocks: 1,
          fg: "2-5",
          threes: "2-5",
          ft: "0-0",
        },
        {
          name: "Paul Reed",
          position: "C",
          minutes: 28,
          points: 8,
          rebounds: 7,
          assists: 1,
          steals: 1,
          blocks: 2,
          fg: "4-7",
          threes: "0-0",
          ft: "0-2",
        },
        {
          name: "Kyle Lowry",
          position: "G",
          minutes: 24,
          points: 4,
          rebounds: 2,
          assists: 5,
          steals: 2,
          blocks: 0,
          fg: "2-6",
          threes: "0-3",
          ft: "0-0",
        },
        {
          name: "Buddy Hield",
          position: "G",
          minutes: 18,
          points: 4,
          rebounds: 1,
          assists: 1,
          steals: 0,
          blocks: 0,
          fg: "1-6",
          threes: "1-5",
          ft: "1-1",
        },
        {
          name: "Cam Payne",
          position: "G",
          minutes: 14,
          points: 0,
          rebounds: 2,
          assists: 2,
          steals: 0,
          blocks: 0,
          fg: "0-4",
          threes: "0-2",
          ft: "0-0",
        },
      ],
    },
    homeTeam: {
      name: "Heat",
      quarters: [16, 20, 16, 15],
      total: 67,
      players: [
        {
          name: "Tyler Herro",
          position: "PG",
          minutes: 32,
          points: 16,
          rebounds: 4,
          assists: 5,
          steals: 1,
          blocks: 0,
          fg: "6-16",
          threes: "2-8",
          ft: "2-2",
        },
        {
          name: "Duncan Robinson",
          position: "SG",
          minutes: 28,
          points: 12,
          rebounds: 3,
          assists: 2,
          steals: 0,
          blocks: 0,
          fg: "4-10",
          threes: "4-9",
          ft: "0-0",
        },
        {
          name: "Jimmy Butler",
          position: "SF",
          minutes: 34,
          points: 18,
          rebounds: 6,
          assists: 4,
          steals: 2,
          blocks: 0,
          fg: "6-14",
          threes: "0-1",
          ft: "6-8",
        },
        {
          name: "Caleb Martin",
          position: "PF",
          minutes: 30,
          points: 8,
          rebounds: 5,
          assists: 2,
          steals: 1,
          blocks: 0,
          fg: "3-9",
          threes: "1-4",
          ft: "1-2",
        },
        {
          name: "Bam Adebayo",
          position: "C",
          minutes: 34,
          points: 10,
          rebounds: 12,
          assists: 3,
          steals: 1,
          blocks: 2,
          fg: "5-12",
          threes: "0-0",
          ft: "0-2",
        },
        {
          name: "Josh Richardson",
          position: "G/F",
          minutes: 22,
          points: 3,
          rebounds: 2,
          assists: 2,
          steals: 0,
          blocks: 1,
          fg: "1-5",
          threes: "1-4",
          ft: "0-0",
        },
        {
          name: "Thomas Bryant",
          position: "C",
          minutes: 14,
          points: 0,
          rebounds: 4,
          assists: 0,
          steals: 0,
          blocks: 1,
          fg: "0-3",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Jaime Jaquez Jr.",
          position: "F",
          minutes: 12,
          points: 0,
          rebounds: 1,
          assists: 1,
          steals: 0,
          blocks: 0,
          fg: "0-4",
          threes: "0-2",
          ft: "0-0",
        },
      ],
    },
  },
  5: {
    // Suns vs Nuggets
    awayTeam: {
      name: "Nuggets",
      quarters: [0, 0, 0, 0],
      total: 0,
      players: [
        {
          name: "Jamal Murray",
          position: "PG",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Kentavious Caldwell-Pope",
          position: "SG",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Michael Porter Jr.",
          position: "SF",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Aaron Gordon",
          position: "PF",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Nikola Jokic",
          position: "C",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Reggie Jackson",
          position: "G",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Christian Braun",
          position: "G/F",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Peyton Watson",
          position: "F",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
      ],
    },
    homeTeam: {
      name: "Suns",
      quarters: [0, 0, 0, 0],
      total: 0,
      players: [
        {
          name: "Devin Booker",
          position: "PG",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Bradley Beal",
          position: "SG",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Grayson Allen",
          position: "SF",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Kevin Durant",
          position: "PF",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Jusuf Nurkic",
          position: "C",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Eric Gordon",
          position: "G",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Royce O'Neale",
          position: "F",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
        {
          name: "Drew Eubanks",
          position: "C",
          minutes: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          fg: "0-0",
          threes: "0-0",
          ft: "0-0",
        },
      ],
    },
  },
}

export default function NBAGames() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showBoxScore, setShowBoxScore] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? todaysGames.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === todaysGames.length - 1 ? 0 : prev + 1))
  }

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleGameClick = (game: Game) => {
    setSelectedGame(game)
    setShowBoxScore(true)
  }

  const activeGame = todaysGames[activeIndex]
  const activeProps = playerProps[activeGame.id as keyof typeof playerProps]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar for player props */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 transform transition-transform duration-300 ease-in-out border-r border-gray-700 md:relative ${
            sidebarOpen ? "md:translate-x-0" : "md:-translate-x-full"
          } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Player Props</h2>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-shrink-0 w-8 h-8 relative">
                <Image
                  src={activeGame.awayTeam.logo || "/placeholder.svg"}
                  alt={activeGame.awayTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-medium">{activeGame.awayTeam.name}</span>
              <span className="mx-2">vs</span>
              <div className="flex-shrink-0 w-8 h-8 relative">
                <Image
                  src={activeGame.homeTeam.logo || "/placeholder.svg"}
                  alt={activeGame.homeTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-medium">{activeGame.homeTeam.name}</span>
            </div>

            <Tabs defaultValue="prizepicks">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="prizepicks" className="flex-1">
                  PrizePicks
                </TabsTrigger>
                <TabsTrigger value="underdogs" className="flex-1">
                  Underdogs
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-180px)]">
                <TabsContent value="prizepicks" className="mt-0">
                  <div className="space-y-4">
                    {activeProps.prizePicks.map((prop, index) => (
                      <PropCard key={index} prop={prop} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="underdogs" className="mt-0">
                  <div className="space-y-4">
                    {activeProps.underdogs.map((prop, index) => (
                      <PropCard key={index} prop={prop} />
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="p-4 md:p-8 flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="mr-4 rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span className="sr-only">{sidebarOpen ? "Hide sidebar" : "Show sidebar"}</span>
            </Button>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">NBA Games Today</h1>
              <p className="text-gray-400 text-center">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4">
            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 z-20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous game</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleExpanded}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 z-20"
                >
                  {expanded ? "Collapse View" : "Expand All Games"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700 z-20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next game</span>
                </Button>
              </div>

              <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                {todaysGames.map((game, index) => {
                  // Calculate position based on active index
                  let position = index - activeIndex
                  if (expanded) {
                    // When expanded, show all cards in a row
                    position = index
                  }

                  // Calculate z-index (higher for active card)
                  const zIndex = expanded ? 10 : todaysGames.length - Math.abs(position)

                  // Calculate opacity (full for active, less for others)
                  const opacity = expanded ? 1 : Math.abs(position) > 2 ? 0 : 1 - Math.abs(position) * 0.2

                  // Calculate scale (smaller for cards further from active)
                  const scale = expanded ? 1 : 1 - Math.abs(position) * 0.1

                  // Calculate horizontal position
                  let translateX
                  if (expanded) {
                    translateX = `${index * 300}px`
                  } else {
                    translateX = position === 0 ? "0%" : `${position * 40}%`
                  }

                  return (
                    <Card
                      key={game.id}
                      className="absolute top-0 left-1/2 w-full max-w-3xl rounded-xl overflow-hidden transition-all duration-500 ease-in-out shadow-2xl cursor-pointer"
                      style={{
                        transform: `translateX(-50%) translateX(${translateX}) scale(${scale})`,
                        opacity,
                        zIndex,
                        visibility: Math.abs(position) > 2 && !expanded ? "hidden" : "visible",
                      }}
                      onClick={() => handleGameClick(game)}
                    >
                      <div className="relative h-full">
                        {/* Game status bar */}
                        <div className="bg-black bg-opacity-80 text-white p-2 flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium">{game.status}</span>
                        </div>

                        {/* Teams container */}
                        <div className="flex flex-col md:flex-row h-full">
                          {/* Away Team */}
                          <div
                            className="flex-1 flex flex-col items-center justify-center p-6 text-white"
                            style={{ backgroundColor: game.awayTeam.color }}
                          >
                            <div className="mb-4 relative w-24 h-24 md:w-32 md:h-32">
                              <Image
                                src={game.awayTeam.logo || "/placeholder.svg"}
                                alt={`${game.awayTeam.name} logo`}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">{game.awayTeam.name}</h2>
                            <div
                              className="text-4xl md:text-6xl font-bold"
                              style={{ color: game.awayTeam.secondaryColor }}
                            >
                              {game.awayTeam.score}
                            </div>
                          </div>

                          {/* VS divider */}
                          <div className="flex items-center justify-center bg-gray-900 px-4 py-2 md:py-0">
                            <span className="text-xl font-bold text-white">VS</span>
                          </div>

                          {/* Home Team */}
                          <div
                            className="flex-1 flex flex-col items-center justify-center p-6 text-white"
                            style={{ backgroundColor: game.homeTeam.color }}
                          >
                            <div className="mb-4 relative w-24 h-24 md:w-32 md:h-32">
                              <Image
                                src={game.homeTeam.logo || "/placeholder.svg"}
                                alt={`${game.homeTeam.name} logo`}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">{game.homeTeam.name}</h2>
                            <div
                              className="text-4xl md:text-6xl font-bold"
                              style={{ color: game.homeTeam.secondaryColor }}
                            >
                              {game.homeTeam.score}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Game indicators */}
              <div className="flex justify-center mt-6 gap-2">
                {todaysGames.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === activeIndex ? "bg-white scale-125" : "bg-gray-600"
                    }`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to game ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Game details section */}
            <div className="mt-12 bg-gray-800 rounded-xl p-6 max-w-3xl mx-auto mb-8">
              <h2 className="text-xl font-bold mb-4">Game Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span>Crypto.com Arena, Los Angeles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Broadcast:</span>
                  <span>ESPN, NBA TV</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Series:</span>
                  <span>Lakers lead 2-1</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Box Score Dialog */}
      <Dialog open={showBoxScore} onOpenChange={setShowBoxScore}>
        <DialogContent className="max-w-5xl bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-4">
              {selectedGame && (
                <>
                  <div className="flex items-center">
                    <div className="w-8 h-8 relative mr-2">
                      <Image
                        src={selectedGame.awayTeam.logo || "/placeholder.svg"}
                        alt={selectedGame.awayTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{selectedGame.awayTeam.name}</span>
                    <span className="mx-2 text-xl">{selectedGame.awayTeam.score}</span>
                  </div>
                  <span>@</span>
                  <div className="flex items-center">
                    <div className="w-8 h-8 relative mr-2">
                      <Image
                        src={selectedGame.homeTeam.logo || "/placeholder.svg"}
                        alt={selectedGame.homeTeam.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{selectedGame.homeTeam.name}</span>
                    <span className="mx-2 text-xl">{selectedGame.homeTeam.score}</span>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedGame && (
            <div className="mt-4">
              {/* Quarter Scores */}
              <div className="mb-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-white">Team</TableHead>
                      <TableHead className="text-white text-center">1Q</TableHead>
                      <TableHead className="text-white text-center">2Q</TableHead>
                      <TableHead className="text-white text-center">3Q</TableHead>
                      <TableHead className="text-white text-center">4Q</TableHead>
                      <TableHead className="text-white text-center">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium">{boxScores[selectedGame.id].awayTeam.name}</TableCell>
                      {boxScores[selectedGame.id].awayTeam.quarters.map((q: number, i: number) => (
                        <TableCell key={i} className="text-center">
                          {q}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-bold">
                        {boxScores[selectedGame.id].awayTeam.total}
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-gray-700">
                      <TableCell className="font-medium">{boxScores[selectedGame.id].homeTeam.name}</TableCell>
                      {boxScores[selectedGame.id].homeTeam.quarters.map((q: number, i: number) => (
                        <TableCell key={i} className="text-center">
                          {q}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-bold">
                        {boxScores[selectedGame.id].homeTeam.total}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Team Box Scores */}
              <Tabs defaultValue="away" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="away" className="flex-1">
                    {boxScores[selectedGame.id].awayTeam.name}
                  </TabsTrigger>
                  <TabsTrigger value="home" className="flex-1">
                    {boxScores[selectedGame.id].homeTeam.name}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="away" className="mt-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gray-900">
                        <TableRow className="border-gray-700">
                          <TableHead className="text-white">Player</TableHead>
                          <TableHead className="text-white text-center">MIN</TableHead>
                          <TableHead className="text-white text-center">PTS</TableHead>
                          <TableHead className="text-white text-center">REB</TableHead>
                          <TableHead className="text-white text-center">AST</TableHead>
                          <TableHead className="text-white text-center">STL</TableHead>
                          <TableHead className="text-white text-center">BLK</TableHead>
                          <TableHead className="text-white text-center">FG</TableHead>
                          <TableHead className="text-white text-center">3PT</TableHead>
                          <TableHead className="text-white text-center">FT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {boxScores[selectedGame.id].awayTeam.players.map((player) => (
                          <TableRow key={player.name} className="border-gray-700">
                            <TableCell className="font-medium">
                              <div>
                                {player.name}
                                <div className="text-xs text-gray-400">{player.position}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{player.minutes}</TableCell>
                            <TableCell className="text-center">{player.points}</TableCell>
                            <TableCell className="text-center">{player.rebounds}</TableCell>
                            <TableCell className="text-center">{player.assists}</TableCell>
                            <TableCell className="text-center">{player.steals}</TableCell>
                            <TableCell className="text-center">{player.blocks}</TableCell>
                            <TableCell className="text-center">{player.fg}</TableCell>
                            <TableCell className="text-center">{player.threes}</TableCell>
                            <TableCell className="text-center">{player.ft}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="home" className="mt-0">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-gray-900">
                        <TableRow className="border-gray-700">
                          <TableHead className="text-white">Player</TableHead>
                          <TableHead className="text-white text-center">MIN</TableHead>
                          <TableHead className="text-white text-center">PTS</TableHead>
                          <TableHead className="text-white text-center">REB</TableHead>
                          <TableHead className="text-white text-center">AST</TableHead>
                          <TableHead className="text-white text-center">STL</TableHead>
                          <TableHead className="text-white text-center">BLK</TableHead>
                          <TableHead className="text-white text-center">FG</TableHead>
                          <TableHead className="text-white text-center">3PT</TableHead>
                          <TableHead className="text-white text-center">FT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {boxScores[selectedGame.id].homeTeam.players.map((player) => (
                          <TableRow key={player.name} className="border-gray-700">
                            <TableCell className="font-medium">
                              <div>
                                {player.name}
                                <div className="text-xs text-gray-400">{player.position}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{player.minutes}</TableCell>
                            <TableCell className="text-center">{player.points}</TableCell>
                            <TableCell className="text-center">{player.rebounds}</TableCell>
                            <TableCell className="text-center">{player.assists}</TableCell>
                            <TableCell className="text-center">{player.steals}</TableCell>
                            <TableCell className="text-center">{player.blocks}</TableCell>
                            <TableCell className="text-center">{player.fg}</TableCell>
                            <TableCell className="text-center">{player.threes}</TableCell>
                            <TableCell className="text-center">{player.ft}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Component for displaying player prop cards
function PropCard({ prop }: { prop: PlayerProp }) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500"
    if (confidence >= 70) return "bg-green-400"
    if (confidence >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="bg-gray-800 border-gray-700 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg">{prop.player}</h3>
          <p className="text-sm text-gray-400">{prop.team}</p>
        </div>
        <Badge
          variant="outline"
          className={`${prop.recommendation === "over" ? "bg-green-900/30 text-green-400 border-green-500" : "bg-red-900/30 text-red-400 border-red-500"}`}
        >
          {prop.recommendation === "over" ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          {prop.recommendation.toUpperCase()}
        </Badge>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm">{prop.stat}</span>
        <span className="font-bold">{prop.line}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${getConfidenceColor(prop.confidence)}`}
            style={{ width: `${prop.confidence}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium">{prop.confidence}%</span>
        {prop.trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500" />
        )}
      </div>
    </Card>
  )
}

