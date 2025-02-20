export class LRUCache<Key, Value> {
  private cache: Map<Key, Value>;
  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity < 1) throw new Error("Capacity must be at least 1");
    this.capacity = capacity;
    this.cache = new Map();
  }

  /**
   * Get a value from the cache and mark it as recently used
   */
  get(key: Key): Value | undefined {
    if (!this.cache.has(key)) return undefined;

    // Remove and re-insert to mark as most recently used
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  /**
   * Add/update a value in the cache
   */
  put(key: Key, value: Value): void {
    // Remove existing entry to update insertion order
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add new entry (now most recently used)
    this.cache.set(key, value);

    // Evict least recently used if over capacity
    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  clear() {
    this.cache.clear();
  }

  /**
   * Get current size of the cache
   */
  size(): number {
    return this.cache.size;
  }
}
