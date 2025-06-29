import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, any>({
  max: 100,
});

export default cache;
