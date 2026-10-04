import { useEffect, useState } from "react";

export type RemoteData<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

// Loads data once per change of `dependencyKey`; the page decides how to render each state.
export function useRemoteData<T>(load: () => Promise<T>, dependencyKey: string): RemoteData<T> {
  const [state, setState] = useState<RemoteData<T>>({ status: "loading" });
  useEffect(() => {
    let isCancelled = false;
    setState({ status: "loading" });
    load()
      .then((data) => !isCancelled && setState({ status: "ready", data }))
      .catch((error: Error) => !isCancelled && setState({ status: "error", message: error.message }));
    return () => { isCancelled = true; };
  }, [dependencyKey]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}
