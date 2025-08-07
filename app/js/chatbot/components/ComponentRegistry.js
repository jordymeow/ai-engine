// Previous: none
// Current: 2.9.9

/**
 * Component Registry
 * 
 * This file manages the modular components for the chatbot UI.
 * Containers are handled via CSS classes, while headers, messages, and input are React components.
 */

// Header Components
import StandardHeader from './headers/StandardHeader';
import OSXHeader from './headers/OSXHeader';

// Messages Components
import StandardMessages from './messages/StandardMessages';

// Input Components
import StandardInput from './input/StandardInput';

// Component Registry
export const ComponentRegistry = {
  headers: {
    standard: StandardHeader,
    osx: OSXHeader
  },
  messages: {
    standard: StandardMessages
  },
  input: {
    standard: StandardInput
  }
  // footers will be added here when implemented
};

// Component Presets for UI Builder
export const componentPresets = {
  'Standard': {
    container: 'standard',
    header: 'standard',
    messages: 'standard',
    input: 'standard',
    footer: 'standard'
  },
  'MacOS': {
    container: 'osx',
    header: 'osx',
    messages: 'standard',
    input: 'standard',
    footer: 'standard'
  }
};

/**
 * Get a component from the registry
 * @param {string} type - Component type (headers, content, footers)
 * @param {string} name - Component name (standard, osx, terminal)
 * @returns {React.Component|null} The component or null if not found
 */
export const getComponent = (type, name) => {
  if (!ComponentRegistry[type] || !ComponentRegistry[type][name]) {
    console.warn(`Component ${type}/${name} not found`);
    return null;
  }
  return ComponentRegistry[type][name];
};

export default ComponentRegistry;