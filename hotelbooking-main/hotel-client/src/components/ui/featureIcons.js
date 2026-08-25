import { ChatIcon, SupportIcon, GuestsIcon } from './Icons'

// Lookup table mapping the string keys used in content data (see src/data/content.js
// `features`) to the actual icon components, so feature lists can be rendered generically.
export const featureIcons = {
  chat: ChatIcon,
  support: SupportIcon,
  guests: GuestsIcon,
}
