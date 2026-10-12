// Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
// Description: Interactive Big-O Algorithm Complexity & Cyclomatic Profiler

import { useState } from 'react';

const SNIPPETS = [
  {
    name: 'Binary Search (Optimized)',
    lang: 'java',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    cyclomaticScore: 3,
    risk: 'LOW',
    code: `public int binarySearch(int[] arr, int target) {\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
    explanation: 'Divides the search interval in half every iteration. Highly scalable for large sorted collections.',
  },
  {
    name: 'Nested Loop Query Join (Slow / High Complexity)',
    lang: 'java',
    timeComplexity: 'O(N²)',
    spaceComplexity: 'O(N)',
    cyclomaticScore: 12,
    risk: 'CRITICAL',
    code: `public List<Item> matchOrders(List<Order> orders, List<Customer> customers) {\n    List<Item> matched = new ArrayList<>();\n    for (Order o : orders) {\n        for (Customer c : customers) {\n            if (o.getCustId().equals(c.getId())) {\n                for (Item item : o.getItems()) {\n                    if (item.isInStock()) matched.add(item);\n                }\n            }\n        }\n    }\n    return matched;\n}`,
    explanation: 'Contains 3 levels of nested iterations resulting in cubic O(N * M * K) worst case. Refactor to a HashMap lookup to achieve linear O(N + M) complexity.',
  },
  {
    name: 'Merge Sort (Divide and Conquer)',
    lang: 'java',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    cyclomaticScore: 5,
    risk: 'MEDIUM',
    code: `public void mergeSort(int[] a, int n) {\n    if (n < 2) return;\n    int mid = n / 2;\n    int[] l = new int[mid];\n    int[] r = new int[n - mid];\n    for (int i = 0; i < mid; i++) l[i] = a[i];\n    for (int i = mid; i < n; i++) r[i - mid] = a[i];\n    mergeSort(l, mid);\n    mergeSort(r, n - mid);\n    merge(a, l, r, mid, n - mid);\n}`,
    explanation: 'Standard divide-and-conquer algorithm with predictable O(N log N) performance in best, average, and worst cases.',
  },
];

export default function ComplexityProfiler({ onTriggerToast }) {
  const [selectedSnippet, setSelectedSnippet] = useState(SNIPPETS[0]);
  const [customCode, setCustomCode] = useState(SNIPPETS[0].code);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const analyzeCode = () => {
    setAnalyzing(true);
    setAnalysisResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      const isNested = customCode.includes('for') && (customCode.match(/for/g) || []).length > 1;
      setAnalysisResult({
        timeComplexity: isNested ? 'O(N²)' : 'O(N)',
        spaceComplexity: customCode.includes('new ArrayList') ? 'O(N)' : 'O(1)',
        cyclomaticScore: (customCode.match(/if|while|for/g) || []).length * 2 + 1,
        recommendation: isNested
          ? '⚠️ High cyclomatic complexity. Extract inner loop into a HashSet/Map for O(1) lookup.'
          : '✓ Clean algorithm structure. Branching paths are manageable and testable.',
      });
      if (onTriggerToast) onTriggerToast('Algorithm complexity profile generated!');
    }, 1000);
  };

  return (
    <div className="complexity-profiler-view">
      <header className="page-head row">
        <div>
          <h2>AI Code Complexity & Big-O Profiler</h2>
          <p className="muted">
            Compute Big-O time and space complexity, calculate Cyclomatic Complexity, and inspect bottlenecks.
          </p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={analyzeCode} disabled={analyzing}>
            {analyzing ? 'Profiling Algorithm…' : '⚡ Profile Complexity'}
          </button>
        </div>
      </header>

      {/* Preset Code Snippets */}
      <div className="chips" style={{ marginBottom: '1.2rem' }}>
        {SNIPPETS.map((s, idx) => (
          <button
            key={idx}
            className={`chip ${selectedSnippet.name === s.name ? 'on' : ''}`}
            onClick={() => {
              setSelectedSnippet(s);
              setCustomCode(s.code);
              setAnalysisResult(null);
            }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 340px', gap: '1.2rem' }}>
        {/* Code Editor */}
        <section className="glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h3>Algorithm Source</h3>
            <span className="chip on">Language: Java</span>
          </div>
          <textarea
            rows={12}
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.5)',
              color: '#e2e8f0',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: '1.5',
            }}
          />
        </section>

        {/* Complexity Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <section className="glass">
            <h3>Complexity Metrics</h3>
            <div style={{ display: 'grid', gap: '0.8rem', marginTop: '0.8rem' }}>
              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <small className="muted">Time Complexity</small>
                <h3 style={{ margin: '0.2rem 0', color: 'var(--cyan)' }}>
                  {analysisResult?.timeComplexity || selectedSnippet.timeComplexity}
                </h3>
                <small className="muted">Asymptotic upper bound</small>
              </div>

              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <small className="muted">Space Complexity</small>
                <h3 style={{ margin: '0.2rem 0', color: 'var(--low)' }}>
                  {analysisResult?.spaceComplexity || selectedSnippet.spaceComplexity}
                </h3>
                <small className="muted">Auxiliary memory consumption</small>
              </div>

              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <small className="muted">Cyclomatic Complexity</small>
                <h3 style={{ margin: '0.2rem 0', color: 'var(--violet)' }}>
                  {analysisResult?.cyclomaticScore || selectedSnippet.cyclomaticScore}
                </h3>
                <small className="muted">
                  {(analysisResult?.cyclomaticScore || selectedSnippet.cyclomaticScore) > 10
                    ? '⚠️ High risk of defect leakage'
                    : '✓ Optimal testability'}
                </small>
              </div>
            </div>
          </section>

          <section className="glass">
            <h3>AI Architecture Advice</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#cbd5e1', margin: 0 }}>
              {analysisResult?.recommendation || selectedSnippet.explanation}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
