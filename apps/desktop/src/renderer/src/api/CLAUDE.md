# API Client Module

## Purpose
Shared frontend API client for SPARK desktop frontend, providing typed functions for local SPARK backend APIs.

## Key Types
- `DictionaryProMode`: 'meaning' | 'conversion' | 'upgrade' | 'comparison'
- `DictionaryProTarget`: 'toefl-writing' | 'toefl-speaking' | 'general-academic' | 'daily-english'
- `ApiResponse<T>`: Always returns `{ ok: boolean; data?: T; error?: string }`

## Usage
```typescript
import { checkHealth, lookupDictionary } from './api/client'

// Check backend availability
const health = await checkHealth()

// Perform dictionary lookup
const result = await lookupDictionary({ text: 'a big deal' })
```

## Conventions
- Use single quotes for strings
- No trailing semicolons after statements
- Run `npm run format` before committing to fix prettier issues
- Configure base URL via `configureApiClient({ baseUrl: '...' })`
- Default base URL is `http://localhost:4173`