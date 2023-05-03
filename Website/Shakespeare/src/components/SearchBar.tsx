import { Component, For, createEffect, createSignal } from "solid-js";
import shakespeareController from "../core/shakespeare/shakespeareController";
import { ShakespeareEntry, ShakespeareSearchResult } from "../types";

const SearchBar: Component = () => {
  const [searchTerm, setSearchTerm] = createSignal("");
  const [inFocus, setInFocus] = createSignal(false)
  const [searchResults, setSearchResults] = createSignal<ShakespeareSearchResult[]>(
    []
  );

  async function handleInput(event) {
    setSearchTerm(event.currentTarget.value);

    if (!searchTerm()) return;

    shakespeareController.search(searchTerm()).then((results) => {
      setSearchResults(results);
    });
  }

  return (
    <div class="inline-flex flex-col justify-center relative text-gray-500 w-full">
      <div class="relative grow-0">
        <input
          class="p-2 pl-8 rounded border border-gray-200 bg-grey-200 focus:bg:white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent w-full"
          placeholder="search..."
          value=""
          onInput={handleInput}
          onBlur={() => setInFocus(false)}
          onfocus={() => setInFocus(true)}
        >
          <svg
            class="w-4 h-4 absolute left-2.5 top-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </input>

        {searchResults().length > 0 && searchTerm().length > 0 && inFocus() && (
          <ul class="bg-white border border-gray-100 w-full absolute">
            <For each={searchResults()}>
              {(result) => (
                <li class="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-blue-50 hover:text-gray-900">
                  <div class="text-xs">{result.entry.playName} {`${result.entry.lineId ? `- ${result.entry.lineId}:`:''}`}</div>
                  <span class="text-sm">{`${result.entry.speaker ? result.entry.speaker+':' : ''}`}</span> <span class="italic" innerHTML={result.highlight.textEntry[0]?.replace(/<em>/g, '<b>').replace(/<\/em>/g, '</b>')}></span>
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
