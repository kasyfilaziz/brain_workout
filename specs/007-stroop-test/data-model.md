# Stroop Test Data Model

## Stores

### StroopSession
- `id`: string (UUID)
- `mode`: 'W' | 'C' | 'CW'
- `type`: 'Timed' | 'Fixed'
- `results`: StroopTrial[]
- `timestamp`: number (milliseconds)

### StroopTrial
- `stimulusWord`: string | null
- `stimulusColor`: string
- `userResponse`: string
- `isCorrect`: boolean
- `reactionTime`: number (milliseconds)

### StroopProfile
- `userId`: 'default'
- `avgWordReadingRT`: number
- `avgColorNamingRT`: number
- `lastUpdate`: number

## Persistence
- Stores reside in `db.js` using `idb` library.
- Database version increment required.
