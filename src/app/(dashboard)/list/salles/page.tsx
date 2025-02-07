"use client"; // Mark this component as a Client Component

import { useState,useEffect } from "react";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import ReservationModal from "@/components/ReservationModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { classesData, role } from "@/lib/data";
import Image from "next/image";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from "@/utils/PersistLogin";



const columns = [
  {
    header: "Room ID",
    accessor: "id",
  },
  {
    header: "Nom de la salle",
    accessor: "name",
  },
  {
    header: "Emplacement",
    accessor: "location",
    className: "hidden md:table-cell",
  },
  {
    header: "Capacité",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Disponibilité",
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
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const totalPages = Math.ceil(classesData.length / ITEMS_PER_PAGE);

    useEffect(() => {
      const controller = new AbortController();
  
      const getRooms = async () => {
          try {
              const response = await axiosPrivate.get('/rooms/getAllRooms', {
                  signal: controller.signal
              });
              console.log(response.data);
              if (response.status === 200) {
                setRooms(response.data); 
              }
              
          } catch (err: any) {
            console.log(err);
            if (err.name !== "CanceledError") {
              console.error("Erreur lors de la récupération des examens:", err);
              router.push('/sign-in');
          }
            }
      }
  
      getRooms();
  
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
      key={item.room_id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.room_id}</td>
      <td>{item.room_name}</td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td className="hidden md:table-cell">{item.capacity}</td>
      <td className="hidden md:table-cell">{item.is_available === true ? "Disponible" : "Indisponible"}</td>
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
            <h1 className="hidden md:block text-lg font-semibold">Salles</h1>
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
          <Table columns={columns} renderRow={renderRow} data={rooms} />
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