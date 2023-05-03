import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import PlayList from "./components/PlayList";
import PlayDisplay from "./components/PlayDisplay";
import SearchBar from "./components/SearchBar";
import Card from "./components/Card";
import { ShakespearePlay } from "./types";
import shakespeareController from "./core/shakespeare/shakespeareController";

const App: Component = () => {
  const [plays, setPlays] = createSignal<ShakespearePlay[]>([]);
  const [play, setPlay] = createSignal<ShakespearePlay>();
  const [act, setAct] = createSignal<number>();
  const [sceneNumber, setSceneNumber] = createSignal<number>();

  // Call the `fetchPlays` function from `shakespeareController` on mount
  onMount(async () => {
    const fetchedPlays = await shakespeareController.getListOfPlays();
    setPlays(fetchedPlays);
  });

  const handleSelect = (play: ShakespearePlay, actNumber: number) => {
    setPlay(play);
    setAct(actNumber);
    setSceneNumber(1);
  };

  const handleSceneChange = (sceneNumber: number) => {
    setSceneNumber(sceneNumber);
  };

  return (
    <div class="flex flex-col h-screen">
      <div class="h-1/5">
        <div class="text-center py-10">
          <p class="text-4xl text-blue-400 text-center py-2">
            Shakespeare Index
          </p>
          <p class="text-sm">Elasticsearch - Node & Express - Solid.js</p>
        </div>
        <div class="w-full flex-wrap px-10 pb-5">
          <Card>
            <SearchBar></SearchBar>
          </Card>
        </div>
      </div>
      <div class="flex-1 flex justify-center w-full h-4/5 px-10 pb-6">
        <Card class="flex-1 max-w-xs max-h-full shrink-0">
          <PlayList plays={plays()} onSelect={handleSelect} />
        </Card>

        <div class="flex-1 pl-4 max-h-full ">
          <PlayDisplay
            play={play()}
            actNumber={act()}
            sceneNumber={sceneNumber()}
            onSceneChange={handleSceneChange}
          ></PlayDisplay>
        </div>
      </div>
    </div>
  );
};

export default App;
