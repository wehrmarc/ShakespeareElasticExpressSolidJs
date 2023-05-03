import { Component, JSX, createEffect, createSignal } from "solid-js";

interface Props {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

const Pagination: Component<Props> = (props) => {
  const [currentPage, setCurrentPage] = createSignal(props.currentPage);

  createEffect(() => {
    setCurrentPage(props.currentPage);
  });

  const handleClick = (page: number) => {
    setCurrentPage(page);
    props.onChangePage(page);
  };

  function renderPageNumbers(): JSX.Element[] {
    const pageNumbers = Array.from(
      { length: props.totalPages },
      (_, index) => index + 1
    );
    return pageNumbers.map((pageNumber) => (
      <li
        class={`inline-block px-2 py-1 ${
          currentPage() === pageNumber
            ? "bg-gray-500 text-white"
            : "bg-gray-200 cursor-pointer"
        }`}
        onClick={() => handleClick(pageNumber)}
      >
        {pageNumber}
      </li>
    ));
  }

  return (
    <div class="flex justify-center mt-4 w-full">
      <ul class="inline-flex space-x-2">
        {renderPageNumbers()}
      </ul>
    </div>
  );
};

export default Pagination;
