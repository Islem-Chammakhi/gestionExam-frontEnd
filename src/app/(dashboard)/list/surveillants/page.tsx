"use client"; // Mark this component as a Client Component

import { useState } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import SurveillantModal from "@/components/SurveillantModal";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from "@/utils/PersistLogin";

type Teacher = {
  id: number;
  teacherId: string; // Surveillant ID
  name: string;
  email?: string;
  photo: string;
  phone: string; // Number
  departmentId: string; // Department ID
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Surveillant ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Number",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Department ID",
    accessor: "departmentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ITEMS_PER_PAGE = 10; // Number of items per page

const TeacherListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teachersData.length / ITEMS_PER_PAGE);

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

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src="/pfp.jpg"
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.departmentId}</td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <SurveillantModal table="teacher" type="assign" />
              <SurveillantModal table="teacher" type="view" />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Calculate the data to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = teachersData.slice(startIndex, endIndex);

  return (
    <PersistLogin>
      <RequireAuth requiredRole="ADMIN">
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
          {/* TOP */}
          <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold"></h1>
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

export default TeacherListPage;