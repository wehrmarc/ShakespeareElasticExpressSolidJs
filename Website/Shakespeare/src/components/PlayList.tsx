import { Component, For, createSignal } from "solid-js";
import { ShakespearePlay } from "../types"; // replace this with your own type definition for Play

interface Props {
  plays: ShakespearePlay[];
  onSelect: (play: ShakespearePlay, actNumber: number) => void;
}

const PlayList: Component<Props> = (props: Props) => {
  const [selectedPlay, setSelectedPlay] = createSignal<ShakespearePlay>();
  const [selectedAct, setSelectedAct] = createSignal<number>();

  const handleSelectPlay = (play: ShakespearePlay) => {
    if (play !== selectedPlay()) {
      setSelectedAct(0);
    }

    setSelectedPlay(play);
  };

  const handleSelectAct = (actNumber: number) => {
    setSelectedAct(actNumber);
    props.onSelect(selectedPlay(), actNumber);
  };

  return (
    <div class="flex flex-col items-center h-full">
      <h1 class="text-2xl font-bold mb-4">Select a Play</h1>
      <ul class="list-disc overflow-y-auto w-full">
        <For each={props.plays}>
          {(play) => (
            <li onClick={() => handleSelectPlay(play)}>
              <span
                class={`cursor-pointer hover:text-blue-500 ${
                  selectedPlay() === play ? "text-blue-500" : ""
                }`}
              >
                <p class="font-semibold">{play.playName}</p>
                <p>Acts: {play.actCount}</p>
                <p>Lines: {play.lineCount}</p>
              </span>

              {selectedPlay() === play && (
                <For each={Array.from({ length: play.actCount })}>
                  {(act, index) => (
                    <li
                      class={`ml-6 cursor-pointer hover:text-blue-500 ${
                        selectedPlay() === play && selectedAct() === index() + 1
                          ? "text-blue-500"
                          : ""
                      }`}
                      onClick={() => handleSelectAct(index() + 1)}
                    >
                      Act {index() + 1}
                    </li>
                  )}
                </For>
              )}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default PlayList;
