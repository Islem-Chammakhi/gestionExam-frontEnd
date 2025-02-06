"use client"; // Mark this component as a Client Component

import { useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import ReservationModal from "@/components/ReservationModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { classesData, role } from "@/lib/data";
import Image from "next/image";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from "@/utils/PersistLogin";

type Class = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  disponibility: string;
};

const columns = [
  {
    header: "Room ID",
    accessor: "id",
  },
  {
    header: "Room Name",
    accessor: "name",
  },
  {
    header: "Location",
    accessor: "location",
    className: "hidden md:table-cell",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Disponibility",
    accessor: "disponibility",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ITEMS_PER_PAGE = 10; // Number of items per page

const ClassListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(classesData.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const renderRow = (item: Class) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.id}</td>
      <td>{item.name}</td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.disponibility}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <ReservationModal table="class" type="reserve" />
              <ReservationModal table="class" type="view" />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Calculate the data to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = classesData.slice(startIndex, endIndex);

  return (
    <PersistLogin>
      <RequireAuth requiredRole="ADMIN">
        <div className="bg-white p-5 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">Room reservations</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <TableSearch />
              <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                  <Image src="/filter.png" alt="" width={14} height={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                  <Image src="/sort.png" alt="" width={14} height={14} />
                </button>
              </div>
            </div>
          </div>
          {/* LIST */}
          <Table columns={columns} renderRow={renderRow} data={currentData} />
          {/* PAGINATION */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            onPageClick={handlePageClick}
          />
        </div>
      </RequireAuth>
    </PersistLogin>

  );
};

export default ClassListPage;