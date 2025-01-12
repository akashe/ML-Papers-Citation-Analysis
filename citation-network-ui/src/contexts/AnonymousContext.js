import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AnonymousContext = createContext();

export function useAnonymous() {
  return useContext(AnonymousContext);
}

export function AnonymousProvider({ children }) {
  const [anonymousId, setAnonymousId] = useState(null);
  const [graphCount, setGraphCount] = useState(0);
  const [shouldPromptLogin, setShouldPromptLogin] = useState(false);

  useEffect(() => {
    // Check if localStorage is available
    const isLocalStorageAvailable = () => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    };

    // Initialize storage with fallback to memory if localStorage isn't available
    const storage = isLocalStorageAvailable() ? localStorage : new Map();
    const getItem = (key) => storage instanceof Map ? storage.get(key) : storage.getItem(key);
    const setItem = (key, value) => storage instanceof Map ? storage.set(key, value) : storage.setItem(key, value);

    // Get or create anonymous ID
    let storedId = getItem('anonymousId');
    let storedCount = parseInt(getItem('graphCount') || '0');

    if (!storedId) {
      storedId = uuidv4();
      setItem('anonymousId', storedId);
    }

    setAnonymousId(storedId);
    setGraphCount(storedCount);

    // Check if we should prompt for login based on count
    setShouldPromptLogin(storedCount >= 3);
  }, []);

  const incrementGraphCount = () => {
    try {
      const newCount = graphCount + 1;
      setGraphCount(newCount);
      localStorage.setItem('graphCount', newCount.toString());
      
      if (newCount >= 3) {
        setShouldPromptLogin(true);
      }
    } catch (e) {
      // Fallback if localStorage fails
      const newCount = graphCount + 1;
      setGraphCount(newCount);
      
      if (newCount >= 3) {
        setShouldPromptLogin(true);
      }
    }
  };

  const resetAnonymousSession = () => {
    try {
      localStorage.removeItem('anonymousId');
      localStorage.removeItem('graphCount');
    } catch (e) {
      console.warn('Could not clear localStorage');
    }
    setAnonymousId(null);
    setGraphCount(0);
    setShouldPromptLogin(false);
  };

  const value = {
    anonymousId,
    graphCount,
    incrementGraphCount,
    shouldPromptLogin,
    setShouldPromptLogin,
    resetAnonymousSession // Useful when user logs in
  };

  return (
    <AnonymousContext.Provider value={value}>
      {children}
    </AnonymousContext.Provider>
  );
}