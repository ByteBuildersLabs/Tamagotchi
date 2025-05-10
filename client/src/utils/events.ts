export enum EventGroup {
    SESSION = 'session',
    CORE = 'core_interactions',
    MINI_GAMES = 'mini_games',
    SOCIAL = 'social',
  }
  
  export const EVENTS = {
    // Session Events
    SESSION_STARTED: 'session_started',
    SESSION_ENDED: 'session_ended',
  
    // Core Interactions
    FEED: 'feed_beast',
    PLAY: 'play_with_beast',
    CLEAN: 'clean_beast',
    SLEEP: 'beast_sleep',
  
    // Mini Games
    MINI_GAME_STARTED: 'mini_game_started',
    MINI_GAME_COMPLETED: 'mini_game_completed',
  
    // Social
    SHARE_SCORE: 'share_score',
    REFER_FRIEND: 'refer_friend',
  } as const;
  
  export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
  