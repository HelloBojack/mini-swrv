import { onMounted, reactive, toRefs } from "vue";

export default function useSWRV(key, fetcher) {
  const stateRef = reactive({
    data: undefined,
    error: undefined,
  });

  const revalidate = async () => {
    const newPromise = fetcher(key);

    try {
      stateRef.data = await newPromise;
    } catch (err) {
      stateRef.error = err;
    }
  };

  onMounted(() => {
    revalidate();
  });

  return toRefs(stateRef);
}
