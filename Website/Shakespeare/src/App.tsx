import { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import PlayList from "./components/PlayList";
import PlayDisplay from "./components/PlayDisplay";
import SearchBar from "./components/SearchBar";
import Card from "./components/Card";
import { ShakespearePlay, ShakespeareEntry } from "./types";
import shakespeareController from "./core/shakespeare/shakespeareController";

const App: Component = () => {
  const [plays, setPlays] = createSignal<ShakespearePlay[]>([]);
  const [selectedPlay, setSelectedPlay] = createSignal<ShakespearePlay>();
  const [selectedAct, setSelectedAct] = createSignal<number>();
  const [selectedScene, setSlectedScene] = createSignal<number>();
  const [currentEntries, setCurrentEntries] = createSignal<ShakespeareEntry[]>(
    []
  );

  onMount(async () => {
    const fetchedPlays = await shakespeareController.getListOfPlays();
    setPlays(fetchedPlays);
  });

  const getSearchResult = (playName: string, lineId: number) => {
    shakespeareController
      .getSearchResults({ playName, lineId })
      .then((result) => {
        setCurrentEntries(result.entries);
        setSelectedPlay(plays().find((p) => p.playName === result.playName));
        setSelectedAct(result.actNumber);
        setSlectedScene(result.sceneNumber + 1);
      });
  };

  const handleSelectPlay = (play: ShakespearePlay) => {
    setSelectedPlay(play);
  };

  const handleSelectAct = (actNumber: number) => {
    setSelectedAct(actNumber);
    setSlectedScene(1);

    shakespeareController
      .getActOfPlay({
        playName: selectedPlay().playName,
        actNumber: selectedAct(),
      })
      .then((response) => {
        setCurrentEntries(response);
      });
  };

  const handleSceneChange = (sceneNumber: number) => {
    setSlectedScene(sceneNumber);
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
            <SearchBar onSelectSearchResult={getSearchResult}></SearchBar>
          </Card>
        </div>
      </div>
      <div class="flex-1 flex justify-center w-full h-4/5 px-10 pb-6">
        <Card class="flex-1 max-w-xs max-h-full shrink-0">
          <PlayList
            plays={plays()}
            selectedPlay={selectedPlay()}
            selectedAct={selectedAct()}
            onSelectPlay={handleSelectPlay}
            onSelectAct={handleSelectAct}
          />
        </Card>

        <div class="flex-1 pl-4 max-h-full ">
          <PlayDisplay
            selectedPlay={selectedPlay()}
            selectedAct={selectedAct()}
            selectedScene={selectedScene()}
            currentEntries={currentEntries()}
            onSceneChange={handleSceneChange}
          ></PlayDisplay>
        </div>
      </div>
    </div>
  );
};

export default App;
