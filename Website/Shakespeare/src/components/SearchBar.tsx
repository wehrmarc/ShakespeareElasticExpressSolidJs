import { Component, For, createSignal } from "solid-js";
import shakespeareController from "../core/shakespeare/shakespeareController";
import { ShakespeareSearchResult } from "../types";

interface Props {
  onSelectSearchResult: (playName: string, lineId: number) => void;
}

const SearchBar: Component<Props> = (props: Props) => {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [inFocus, setInFocus] = createSignal(false);
  const [searchResults, setSearchResults] = createSignal<
    ShakespeareSearchResult[]
  >([]);

  async function handleInput(event) {
    setSearchTerm(event.currentTarget.value);

    if (!searchTerm()) return;

    shakespeareController.search(searchTerm()).then((results) => {
      setSearchResults(results);
    });
  }

  const handleResultClick = (playName: string, lineId: number) => {
    props.onSelectSearchResult(playName, lineId);
    setSearchTerm("");
    setInFocus(false);
  }

  return (
    <div class="inline-flex flex-col justify-center relative text-gray-500 w-full">
      <div
        class="relative grow-0"
        tabIndex={0}
        onBlur={() => setInFocus(false)}
        >
        <input
          class="p-2 pl-8 rounded border border-gray-200 bg-grey-200 focus:bg:white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent w-full"
          placeholder="search..."
          value={searchTerm()}
          onInput={handleInput}
          onFocus={() => setInFocus(true)}
        ></input>

        {searchResults().length > 0 && searchTerm().length > 0 && inFocus() && (
          <ul class="bg-white border border-gray-100 w-full absolute">
            <For each={searchResults()}>
              {(result) => (
                <li
                  onClick={() => {handleResultClick(result.entry.playName, result.entry.lineId)}}
                  class="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-blue-50 hover:text-gray-900"
                >
                  <div class="text-xs">
                    {result.entry.playName}{" "}{`${result.entry.lineId ? `- ${result.entry.lineId}:` : ""}`}
                  </div>
                  <span class="text-sm">{`${result.entry.speaker ? result.entry.speaker + ":" : ""}`}</span>{" "}
                  <span class="italic" innerHTML={result.highlight.textEntry[0]?.replace(/<em>/g, "<b>").replace(/<\/em>/g, "</b>")}
                  ></span>
                </li>
              )}
            </For>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
