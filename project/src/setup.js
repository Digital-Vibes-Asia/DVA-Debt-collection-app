import React from 'react';
import ReactDOM from 'react-dom/client';

// Expose React and hooks as globals so existing component files can reference
// them without importing (they were written for CDN/global React).
window.React = React;
window.ReactDOM = ReactDOM;

const {
  useState, useEffect, useRef, useMemo, useCallback,
  useReducer, useContext, useId, createContext, memo,
  forwardRef, Fragment, Children, cloneElement,
} = React;

Object.assign(window, {
  useState, useEffect, useRef, useMemo, useCallback,
  useReducer, useContext, useId, createContext, memo,
  forwardRef, Fragment, Children, cloneElement,
});
