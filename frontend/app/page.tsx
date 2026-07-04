import Link from 'next/link'
import { Play } from 'lucide-react'

function Waveform() {
  const delays = ['0s', '0.15s', '0.30s', '0.20s', '0.10s']
  return (
    <div className="flex items-end gap-1 h-14 flex-shrink-0" aria-hidden>
      {delays.map((delay, i) => (
        <div
          key={i}
          className="w-2 bg-[#1DB954] rounded-sm origin-bottom"
          style={{
            height: '56px',
            animation: `waveform 1.2s ease-in-out ${delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}

const FILTERS = ['All', 'Music', 'Podcasts']

const MADE_FOR_YOU = [
  { title: 'Daily Mix 1',      desc: 'Anuv Jain, Prateek Kuhad, and more',         from: '#8d1532', to: '#e8115b' },
  { title: 'Discover Weekly',  desc: 'Your weekly mixtape of fresh music',          from: '#1e3264', to: '#2d46b9' },
  { title: 'Chill Hits',       desc: 'Kick back to the best new chill hits',        from: '#4286f4', to: '#86c7f3' },
  { title: 'Release Radar',    desc: 'Catch all the latest from artists you follow',from: '#186037', to: '#1e3264' },
  { title: 'Daily Mix 2',      desc: 'Coldplay, The Chainsmokers, and more',        from: '#b35400', to: '#e8a951' },
  { title: 'Time Capsule',     desc: 'A personalized playlist from your past',      from: '#6d3a9e', to: '#c4a0e0' },
]

const POPULAR = [
  { title: 'Aashiqui 2',        artist: 'Mithoon',           from: '#7b0000', to: '#e53935' },
  { title: '45',                 artist: 'Anuv Jain',         from: '#6a5200', to: '#ffd740' },
  { title: 'Zeher',              artist: 'Prateek Kuhad',     from: '#00695c', to: '#4db6ac' },
  { title: 'Arijit Singh Hits',  artist: 'Arijit Singh',      from: '#4527a0', to: '#9575cd' },
  { title: 'Raabta',             artist: 'Various Artists',   from: '#01579b', to: '#4fc3f7' },
  { title: 'Bollywood Blast',    artist: 'Various Artists',   from: '#1b5e20', to: '#69f0ae' },
]

export default function HomePage() {
  return (
    <div className="fade-in">
      {/* Gradient header */}
      <div
        className="px-6 pt-8 pb-6"
        style={{ background: 'linear-gradient(to bottom, rgba(29,185,84,0.18) 0%, #121212 100%)' }}
      >
        {/* Filter pills */}
        <div className="flex gap-2 mb-8">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? 'bg-white text-black'
                  : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* NEW FEATURE: Resonance card */}
        <Link href="/discover">
          <div className="rounded-xl overflow-hidden cursor-pointer group mb-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 bg-gradient-to-r from-[#1a3d25] to-[#0d2218] hover:from-[#1e4a2b] hover:to-[#0f2a1e] transition-colors border border-[#1DB954]/20 hover:border-[#1DB954]/40 rounded-xl">
              <Waveform />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1DB954] text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    New Feature
                  </span>
                  <span className="text-[#1DB954] font-semibold text-sm">Resonance</span>
                </div>
                <h2 className="text-white font-bold text-xl sm:text-2xl mb-2 leading-tight">
                  Describe your mood. Get explained picks.
                </h2>
                <p className="text-[#B3B3B3] text-sm leading-relaxed max-w-md">
                  Tell Spotify what you want in plain words. An AI informed by 5,708 real reviews
                  picks 8 tracks and explains each one — with a novelty dial you control.
                </p>
              </div>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={18} fill="black" className="text-black ml-0.5" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Made For You */}
      <section className="px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Made For You</h3>
          <button className="text-[#B3B3B3] text-sm font-semibold hover:text-white transition-colors">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {MADE_FOR_YOU.map((item) => (
            <div key={item.title} className="cursor-pointer group">
              <div
                className="w-full aspect-square rounded-md mb-2 group-hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }}
              />
              <p className="text-white text-sm font-semibold truncate">{item.title}</p>
              <p className="text-[#B3B3B3] text-xs truncate mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular albums */}
      <section className="px-6 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Popular albums and singles</h3>
          <button className="text-[#B3B3B3] text-sm font-semibold hover:text-white transition-colors">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {POPULAR.map((item) => (
            <div key={item.title} className="cursor-pointer group">
              <div
                className="w-full aspect-square rounded-md mb-2 group-hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }}
              />
              <p className="text-white text-sm font-semibold truncate">{item.title}</p>
              <p className="text-[#B3B3B3] text-xs truncate mt-0.5">{item.artist}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 pb-8 text-center">
        <p className="text-[#6A6A6A] text-xs">Prototype · Not affiliated with Spotify</p>
      </div>
    </div>
  )
}
