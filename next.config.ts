import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: false, // Bật React Compiler, tự động tối ưu useCallback, useMemo, useEffect, ...
  },
};

export default nextConfig;
