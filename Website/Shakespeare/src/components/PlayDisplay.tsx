import { Component, For, createEffect, createSignal } from "solid-js";
import { ShakespeareEntry, ShakespearePlay } from "../types";
import Card from "./Card";
import Pagination from "./Pagination";

interface Props {
  selectedPlay: ShakespearePlay;
  selectedAct: number;
  selectedScene: number;
  currentEntries: ShakespeareEntry[];
  onSceneChange: (sceneNumber: number) => void;
}

const PlayDisplay: Component<Props> = (props: Props) => {
  const [entriesPerScene, setEntriesPerScene] = createSignal<
    ShakespeareEntry[][]
  >([]);

  createEffect(() => {
    if (!props.selectedPlay || !props.selectedAct) return;

    setEntriesPerScene(createPagination(props.currentEntries));
  });

  const createPagination = (entries: ShakespeareEntry[]) =>
    entries.reduce((acc, entry) => {
      const lastIndex = acc.length - 1;

      if (entry.type === "scene") {
        acc.push([entry]);
      } else if (lastIndex >= 0 && acc[lastIndex][0].type === "scene") {
        acc[lastIndex].push(entry);
      } else {
        acc.push([entry]);
      }

      return acc;
    }, []);

  const onChangePage = (sceneNumber: number) => {
    props.onSceneChange(sceneNumber);
  };

  return (
    <div class="flex flex-col h-full">
      <Card
        class={`overflow-y-auto w-full ${
          props.selectedScene == 1 ? "text-center" : ""
        }`}
      >
        {(!props.selectedPlay || entriesPerScene().length == 0) && (
          <div class="full text-center font-semibold">Please select a play</div>
        )}

        <For each={entriesPerScene()[props.selectedScene - 1]}>
          {(entry) => {
            return (
              <div
                class={`${
                  entry.type === "act" || entry.type === "scene"
                    ? "mb-4"
                    : "mb-2"
                }
              ${entry.type === "act" ? "py-96" : ""}`}
              >
                <div class="text-xs">
                  <span class="italic">
                    {entry.type !== "act" && (
                      <span>
                        {entry.lineNumber} {`${entry.lineNumber ? "-" : ""}`}{" "}
                      </span>
                    )}
                    {entry.type !== "act" && entry.type !== "scene" && (
                      <span>{entry.speaker}:</span>
                    )}
                  </span>
                </div>
                <span
                  class={`${
                    entry.type === "act" || entry.type === "scene"
                      ? "font-semibold text-xl"
                      : ""
                  }`}
                >
                  {entry.textEntry}
                </span>
              </div>
            );
          }}
        </For>
      </Card>

      <Pagination
        currentPage={props.selectedScene}
        totalPages={entriesPerScene().length}
        onChangePage={onChangePage}
      ></Pagination>
    </div>
  );
};

export default PlayDisplay;
