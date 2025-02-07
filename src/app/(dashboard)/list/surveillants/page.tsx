"use client"; // Mark this component as a Client Component

import { useState,useEffect } from "react";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
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

type TitleKey = "PROFESSEUR" | "PROFESSEUR_TRONC_COMMUN" | "MAITRE_ASSISTANT" | "MAITRE_DES_CONFERENCES"|"ASSISTANT"|"CONTRACTUEL";

const titleTable: Record<TitleKey, string> = {
  "PROFESSEUR": "professeur",
  "PROFESSEUR_TRONC_COMMUN": "professeur tronc commun",
  "MAITRE_ASSISTANT": "maitre assistant",
  "MAITRE_DES_CONFERENCES": "maitre des conferences",
  "ASSISTANT": "assistant",
  "CONTRACTUEL": "contractuel"
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
    header: "Titre",
    accessor: "titre",
    className: "hidden md:table-cell",
  },
  {
    header: "Id de département",
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
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const totalPages = Math.ceil(teachersData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const controller = new AbortController();

    const getSupervisors = async () => {
        try {
            const response = await axiosPrivate.get('/supervisors/getAllSupervisors', {
                signal: controller.signal
            });
            console.log(response.data);
            if (response.status === 200) {
              setSupervisors(response.data); 
            }
            
        } catch (err: any) {
          console.log(err);
          if (err.name !== "CanceledError") {
            console.error("Erreur lors de la récupération des surveillants:", err);
            router.push('/sign-in');
        }
          }
    }

    getSupervisors();

    return () => {
        controller.abort();
    }
}, [axiosPrivate, router])

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

  const renderRow = (item: any) => (
    <tr
      key={item.teacher_id}
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
          <h3 className="font-semibold">{item.FkUser.name}</h3>
          <p className="text-xs text-gray-500">{item.FkUser.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacher_id}</td>
      <td className="hidden md:table-cell">{titleTable[item.title as TitleKey]}</td>
      <td className="hidden md:table-cell">{item.department_id}</td>
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
            <h1 className="hidden md:block text-lg font-semibold">Enseignants </h1>
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
          <Table columns={columns} renderRow={renderRow} data={supervisors} />
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