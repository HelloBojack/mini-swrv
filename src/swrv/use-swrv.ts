import { reactive, ref, toRefs, watch } from "vue";
import SWRVCache from "./cache";

const DATA_CACHE = new SWRVCache();
const PROMISES_CACHE = new SWRVCache();

async function mutate(key: string, promise: any, stateRef: any) {
  let data, error;
  try {
    data = await promise;
  } catch (err) {
    error = err;
  }
  const newData = { data, error };

  if (typeof data !== "undefined") {
    DATA_CACHE.set(key, newData);
  }

  stateRef.data = data;
  stateRef.error = error;
}

export default function useSWRV(key: string, fetcher: any) {
  const keyRef = ref(key);
  const stateRef = reactive({
    data: undefined,
    error: undefined,
  });

  const revalidate = async () => {
    const keyVal = keyRef.value;

    const cacheItem = DATA_CACHE.get(keyVal);
    const cacheData = cacheItem && cacheItem.data;

    if (cacheData) {
      stateRef.data = cacheData.data;
      stateRef.error = cacheData.error;
    }

    const trigger = async () => {
      const promiseFromCache = PROMISES_CACHE.get(keyVal);
      if (!promiseFromCache) {
        const newPromise = fetcher(keyVal);
        PROMISES_CACHE.set(keyVal, newPromise);
        await mutate(keyVal, newPromise, stateRef);
      } else {
        await mutate(keyVal, promiseFromCache.data, stateRef);
      }
    };

    await trigger();
  };

  watch(
    keyRef,
    (val) => {
      keyRef.value = val;
      revalidate();
    },
    {
      immediate: true,
    }
  );

  return toRefs(stateRef);
}
