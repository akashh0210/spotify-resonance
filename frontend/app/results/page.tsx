'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import TrackCard from '@/components/TrackCard'

type NoveltyTag = 'comfort' | 'familiar_plus' | 'balanced' | 'exploratory' | 'adventurous'

interface Track {
  track_name: string
  artist: string
  album: string | null
  album_art: string | null
  spotify_url: string | null
  explanation: string
  novelty_tag: NoveltyTag
  spotify_found: boolean
}

const NOVELTY_LABELS: Record<string, string> = {
  '1': 'Comfort',
  '2': 'Familiar+',
  '3': 'Balanced',
  '4': 'Exploratory',
  '5': 'Adventurous',
}

const MOCK_TRACKS: Track[] = [
  {
    track_name: 'When We Feel Young',
    artist: 'When Chai Met Toast',
    album: 'Believe',
    album_art: null,
    spotify_url: null,
    explanation:
      'This track brings a bright, acoustic indie-folk energy that feels like a natural progression from Anuv Jain. It maintains the warm, melodic songwriting but introduces a faster tempo with lively strumming and a more pronounced rhythm section, making it distinctly more upbeat and perfect for a cheerful Sunday morning.',
    novelty_tag: 'familiar_plus',
    spotify_found: true,
  },
  {
    track_name: 'Enjoy It While It Lasts',
    artist: 'Easy Wanderlings',
    album: 'Easy Wanderlings',
    album_art: null,
    spotify_url: null,
    explanation:
      'From another excellent Indian indie band, this song offers a dreamy, flowing sound with a consistently positive vibe. It is more instrumentally rich than Anuv Jain, featuring lush strings and a gentle, driving percussion that elevates the mood without becoming overly energetic, ideal for a relaxed cooking session.',
    novelty_tag: 'balanced',
    spotify_found: true,
  },
  {
    track_name: 'Fred Astaire',
    artist: 'San Cisco',
    album: 'Gracetown',
    album_art: null,
    spotify_url: null,
    explanation:
      'This Australian indie-pop gem provides a vibrant, summery feel with a full band sound and an undeniably catchy, upbeat tempo. While Anuv Jain often focuses on introspective acoustic melodies, this track offers a brighter, more danceable groove and a carefree vocal delivery that is perfect for adding pep to your step.',
    novelty_tag: 'balanced',
    spotify_found: true,
  },
  {
    track_name: 'Everytime',
    artist: 'Boy Pablo',
    album: 'Wachito Rico',
    album_art: null,
    spotify_url: null,
    explanation:
      'Boy Pablo delivers a youthful, lo-fi indie-pop sound with a distinct surf-rock influence. It is significantly more upbeat with a driving drum beat and shimmering guitar riffs compared to Anuv Jain\'s often stripped-back approach, giving it a playful, energetic bounce while maintaining a melodic charm.',
    novelty_tag: 'balanced',
    spotify_found: true,
  },
  {
    track_name: 'August Twelve',
    artist: 'Khruangbin',
    album: 'Mordechai',
    album_art: null,
    spotify_url: null,
    explanation:
      'This instrumental track is a significant departure in genre, leaning into psychedelic funk and soul, but its smooth, laid-back groove is incredibly infectious and upbeat for a cooking soundtrack. Unlike Anuv Jain\'s vocal-led acoustic style, Khruangbin builds energy through intricate basslines and dreamy guitar melodies, offering a unique, feel-good sonic texture.',
    novelty_tag: 'exploratory',
    spotify_found: true,
  },
  {
    track_name: 'Goodie Bag',
    artist: 'Still Woozy',
    album: 'Goodie Bag',
    album_art: null,
    spotify_url: null,
    explanation:
      'Still Woozy crafts a unique lo-fi indie-pop sound that is quirky, catchy, and undeniably upbeat. It features distinct electronic textures and a relaxed, almost conversational vocal style that contrasts with Anuv Jain\'s cleaner acoustic arrangements, yet shares a similar DIY charm and a warm, inviting energy.',
    novelty_tag: 'exploratory',
    spotify_found: true,
  },
  {
    track_name: 'Tune Kaha',
    artist: 'Prateek Kuhad',
    album: 'cold/mess',
    album_art: null,
    spotify_url: null,
    explanation:
      'Prateek Kuhad shares a similar singer-songwriter sensibility and Hindi lyrical depth with Anuv Jain, but this track stands out with its more outwardly optimistic tone and gentle, building rhythm. It offers a slightly more layered acoustic arrangement and a brighter melodic progression, providing a familiar yet distinctly more uplifting experience.',
    novelty_tag: 'familiar_plus',
    spotify_found: true,
  },
  {
    track_name: 'The Ballet Girl',
    artist: 'Aden Foyer',
    album: 'Late Nights',
    album_art: null,
    spotify_url: null,
    explanation:
      'This track brings a melancholic yet driving indie-pop feel with a sophisticated, polished production. While it retains a thoughtful, introspective quality reminiscent of Anuv Jain, its consistent mid-tempo drum beat and rich synth textures provide a more dynamic and consistently upbeat backdrop, perfect for maintaining a good flow in the kitchen.',
    novelty_tag: 'balanced',
    spotify_found: true,
  },
]

function ResultsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent') || 'your mood'
  const noveltyLevel = searchParams.get('novelty_level') || '3'
  const noveltyLabel = NOVELTY_LABELS[noveltyLevel] || 'Balanced'

  const displayIntent =
    intent.length > 60 ? intent.slice(0, 60) + '…' : intent

  return (
    <div className="px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
            8 picks for: <span className="text-accent">"{displayIntent}"</span>
          </h1>
          <p className="text-text-secondary text-sm">
            Novelty: {noveltyLabel} · Powered by 5,708 review voices
          </p>
        </div>

        {/* Track grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {MOCK_TRACKS.map((track) => (
            <TrackCard key={`${track.track_name}-${track.artist}`} {...track} />
          ))}
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            disabled
            title="Spotify login required"
            className="px-6 py-3 rounded-full font-semibold text-sm bg-accent text-black opacity-40 cursor-not-allowed"
          >
            Save as Playlist
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-full font-semibold text-sm border border-border-spotify text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors"
          >
            Try Different Mood
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-full">
        <p className="text-text-secondary">Loading...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
