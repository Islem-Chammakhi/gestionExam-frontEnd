"use client"

import { useState } from 'react';
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { chefData } from "@/lib/data";
import Image from "next/image";
import UserCard from "@/components/UserCard";

type Exam = {
  exam_id: number;
  subject: string;
  department_id: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  coefficient: number;
  duration: string;
  salle: string;
  surveillant: string;
};

const columns = [
  { header: "Exam ID", accessor: "exam_id" },
  { header: "Matiere", accessor: "subject" },
  { header: "Dep. ID", accessor: "department_id" },
  { header: "Date", accessor: "exam_date" },
  { header: "Start Time", accessor: "start_time" },
  { header: "End Time", accessor: "end_time" },
  { header: "Duration", accessor: "duration" },
  { header: "Coefficient", accessor: "coefficient" },
  { header: "Salle", accessor: "salle" },
  { header: "Surveillant", accessor: "surveillant" },
];

const ITEMS_PER_PAGE = 10;

const  ChefPage=()=> {
  {/* lel pagination */}
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(chefData.length / ITEMS_PER_PAGE);
  // Calculate the current page data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = chefData.slice(startIndex, endIndex);




  const renderRow = (item: Exam) => (
    <tr key={item.exam_id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-5">{item.exam_id}</td>
      <td>{item.subject}</td>
      <td>{item.department_id}</td>
      <td>{item.exam_date}</td>
      <td>{item.start_time}</td>
      <td>{item.end_time}</td>
      <td>{item.duration}</td>
      <td>{item.coefficient}</td>
      <td>{item.salle}</td>
      <td>{item.surveillant}</td>
    </tr>
  );

  return (
    <div className="p-4 flex flex-col items-center w-full">
      {/* USER CARDS */}
      <div className="flex gap-4 justify-center flex-wrap w-full">
        <UserCard type="Département" count="Informatique" />
        <UserCard type="Chef de département" count="Hamel Lazher" />
        <UserCard type="Enseignant" count={31} />
        <UserCard type="Examen" count={255} />
        <UserCard type="Etudiant" count={223} />
      </div>

      {/* TABLE */}
      <div className="mt-16 w-full">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Tous les examens du département:</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="Filter" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="Sort" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>

        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={currentData} />

        {/* PAGINATION */}
        {/* <Pagination totalPages={totalPages} onPageChange={setCurrentPage} /> */}
      </div>


      {/* BUTTON TEXT */}
      <div className="text-center text-sm text-gray-700 mt-6">
        <p>Après la vérification des plannings concernant votre département, vous devrez cliquer sur le bouton <strong>Valider</strong>.</p>
        <p>* Cette action est irréversible *</p>
      </div>

      {/* BUTTON */}
      <div className="w-full mt-8 mb-4">
        <button
          type="button"
          className="w-full bg-[#1c933b] text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-[#41c237] transition-colors duration-300"
        >
          Valider toutes les entrées
        </button>
      </div>
    </div>
  );
}
export default ChefPage