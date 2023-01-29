import { onMounted, reactive, toRefs } from "vue";

export default function useSWRV(key, fetcher) {
  const stateRef = reactive({
    data: undefined,
    error: undefined,
  });

  const revalidate = () => {
    const trigger = async () => {
      const fetcherArgs = [key];
      const newPromise = fetcher(...fetcherArgs);
      let data, error;

      try {
        data = await newPromise;
      } catch (err) {
        error = err;
      }

      stateRef.data = data;
      stateRef.error = error;
    };

    trigger();
  };

  onMounted(() => {
    revalidate();
  });

  return toRefs(stateRef);
}
