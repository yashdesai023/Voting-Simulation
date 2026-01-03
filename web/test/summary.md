# Testing Report

## 1. End-to-End (E2E) Testing
**Tool**: Playwright
**Result**: ✅ **PASSED**
**Details**:
- Validated Home Page load on Desktop Chrome.
- Validated Home Page load on Mobile Pixel 5.
- Site is publicly accessible and responsive.

## 2. Load Testing
**Tool**: Artillery
**Result**: ❌ **FAILED (Sustainability Issues)**
**Metrics**:
- **Max Concurrent Users**: 50/sec
- **Success Rate**: < 10%
- **Error Type**: `ETIMEDOUT` (Server stopped responding)
- **Observations**: The backend (AWS EC2) became unresponsive under sustained load of 50 users/second.

## 3. Frontend Performance Audit
**Tool**: Lighthouse (Mobile Strategy)
**Result**: ⚠️ **OPTIMIZATION NEEDED**
**Metrics**:
-   **Performance Score**: Good (needs verification of exact score)
-   **LCP (Largest Contentful Paint)**: ~2.5s (Could be faster)
-   **Observations**:
    -   Images are not optimized (need WebP/Avif).
    -   Render-blocking resources found.

## 4. Final Recommendation & Solutions

### A. Backend (Critical)
The PocketBase server on EC2 is the bottleneck. It crashes at ~50 requests/second.
*   **Immediate Fix**: Upgrade EC2 instance size.
*   **Long-term**: Use Load Balancer + Multiple Nodes.

### B. Frontend (Optimization)
*   **Images**: Convert PNG/JPG to WebP.
*   **Lazy Loading**: Add `loading="lazy"` to candidate images.
*   **CDN**: Serve all static assets via CDN.

## Next Steps
1.  **Upgrade Server**: Increase capacity to handle more voters.
2.  **Re-run Load Test**: Verify stability after upgrade.
3.  **Optimize Images**: Reduce payload size.

