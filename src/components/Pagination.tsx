"use client";

import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  count: number;
}

const Pagination = ({ currentPage,count }: PaginationProps) => {
  // const getPageRange = () => {
  //   const range = [];
  //   const maxVisiblePages = 3; // Number of visible page buttons (e.g., 1 2 3 ... 10)
  //   const ellipsisThreshold = 2; // When to show ellipsis

  //   // Always show the first page
  //   range.push(1);

  //   // Show ellipsis if currentPage is far from the start
  //   if (currentPage > ellipsisThreshold + 1) {
  //     range.push("...");
  //   }

  //   // Show pages around the current page
  //   for (
  //     let i = Math.max(2, currentPage - ellipsisThreshold);
  //     i <= Math.min(totalPages - 1, currentPage + ellipsisThreshold);
  //     i++
  //   ) {
  //     range.push(i);
  //   }

  //   // Show ellipsis if currentPage is far from the end
  //   if (currentPage < totalPages - ellipsisThreshold) {
  //     range.push("...");
  //   }

  //   // Always show the last page
  //   if (totalPages > 1) {
  //     range.push(totalPages);
  //   }

  //   return range;
  // };
  const ITEM_PER_PAGE=10
  const hasPrev = ITEM_PER_PAGE * (currentPage - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (currentPage - 1) + ITEM_PER_PAGE < count;
  const router=useRouter()
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    // new URLSearchParams(window.location.search) : retourner tout url 
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };
  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
      disabled={!hasPrev}
      className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => {
        changePage(currentPage - 1);
 }}>
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {/* {getPageRange().map((item, index) =>
          item === "..." ? (
            <span key={index} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageClick(item as number)}
              className={`px-2 rounded-sm ${currentPage === item ? "bg-lamaSky" : ""}`}
            >
              {item}
            </button>
          )
        )} */}
        {Array.from(
          { length: Math.ceil(count / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={pageIndex}
                className={`px-2 rounded-sm ${
                  currentPage === pageIndex ? "bg-lamaSky" : ""
                }`}
                onClick={() => {
                  changePage(pageIndex);
                }}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => {
          changePage(currentPage + 1);
        }}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;