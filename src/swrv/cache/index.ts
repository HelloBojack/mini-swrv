export default class SWRVCache {
  constructor(private items: Map<string, any> = new Map()) {}

  get(key: string) {
    return this.items.get(key);
  }

  set(key: string, value: any) {
    const now = Date.now();
    const item = {
      data: value,
      createdAt: now,
    };

    this.items.set(key, item);
  }

  delete(key: string) {
    this.items.delete(key);
  }
}
