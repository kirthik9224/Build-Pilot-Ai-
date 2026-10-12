// Descriptions shown on modules that do not have interactive tools yet.
export const MODULE_INFO = {
  monitor: {
    tagline: 'Watch your site and code side by side and catch problems as you type.',
    does: ['Shows a live preview of ShopEase next to index.html, style.css and script.js', 'Highlights spacing, contrast and layout problems on the page', 'Suggests a fix and applies it to the code with one click'],
    steps: ['Pick the file you are editing', 'Hover a highlighted element to read the suggestion', 'Press Fix to update the code and preview'],
    tip: 'Start with contrast problems. They are quick to fix and affect the most users.',
  },
  design: {
    tagline: 'Upload a layout and get design feedback in plain language.',
    does: ['Checks colour palette, type sizes, alignment and visual hierarchy', 'Suggests a cleaner alternative with copyable code', 'Works from presets such as landing page, portfolio and dashboard'],
    steps: ['Choose a preset or upload a screenshot', 'Read the score for each design area', 'Copy the suggested HTML and CSS'],
    tip: 'Keep to two typefaces and one accent colour. Most layout problems come from too many choices.',
  },
  inspector: {
    tagline: 'Adjust a component with sliders and copy clean code.',
    does: ['Previews buttons, cards, navbars, tables and checkout forms', 'Controls size, spacing, radius, shadow, colour and animation', 'Exports HTML, CSS and React snippets'],
    steps: ['Choose a component', 'Move the sliders until it looks right', 'Copy the generated code'],
    tip: 'Use spacing in steps of 4px or 8px so every component lines up.',
  },
  review: {
    tagline: 'Paste code and get a review before you commit.',
    does: ['Finds security flaws such as SQL injection and hard-coded secrets', 'Flags async bugs and layout mistakes', 'Shows a before and after diff of the refactored code'],
    steps: ['Choose a sample or paste your code', 'Run the review', 'Apply the refactor and compare the diff'],
    tip: 'Fix security findings first, then readability. Order matters when time is short.',
  },
  mentor: {
    tagline: 'Ask a question and get a short, practical answer.',
    does: ['Explains design principles, WCAG, Flexbox and Grid', 'Explains code line by line', 'Offers quick guides on security and performance'],
    steps: ['Type a question or pick a suggested one', 'Read the answer and the example', 'Ask a follow-up to go deeper'],
    tip: 'Paste the exact error message when you ask about a bug. It gives a much better answer.',
  },
  analytics: {
    tagline: 'See how fast and how healthy your app is over time.',
    does: ['Tracks Core Web Vitals: LCP, FID and CLS', 'Charts error counts and how quickly they are fixed', 'Shows your team productivity trend'],
    steps: ['Choose a date range', 'Compare before and after a release', 'Export the numbers for your team'],
    tip: 'Aim for LCP under 2.5 seconds and CLS under 0.1.',
  },
  team: {
    tagline: 'Keep tasks, comments and reviews in one place.',
    does: ['Lists shared tasks and who owns them', 'Shows review comments on code and designs', 'Shows who is online and what they are working on'],
    steps: ['Assign a task to a teammate', 'Comment on a change', 'Track progress on the board'],
    tip: 'Give every task one owner. Shared ownership usually means nobody does it.',
  },
  production: {
    tagline: 'Keep an eye on the live app and get told when something breaks.',
    does: ['Charts API response time, uptime and database load', 'Streams live error alerts with a likely cause', 'Suggests a fix for each alert'],
    steps: ['Open the live log', 'Click an alert to see the diagnosis', 'Apply the suggested fix or assign it'],
    tip: 'Set an alert on error rate, not just on downtime. Slow failures are easy to miss.',
  },
};
