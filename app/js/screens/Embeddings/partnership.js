// Previous: 3.9.5
// Current: 3.9.6

// One switch for everything agreed with Qdrant (2026-11): Qdrant first and "Recommended cloud"
// in the chooser with the other databases one click away, and the Chroma Cloud closing notices
// that lead to "Move this environment". Live since 2026-11-23, when Qdrant sent its billing details.
// Set it to false and rebuild if the partnership ends: the plugin then shows every database the
// same way and says nothing about Chroma Cloud closing.
export const QDRANT_PARTNERSHIP_LIVE = true;
