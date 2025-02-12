"use client"

import { useState,useEffect } from 'react';
import Pagination from "@/components/Pagination";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { chefData } from "@/lib/data";
import Image from "next/image";
import useAuth from '@/hooks/useAuth';
import { CoefficientKey,DurationKey,coefTable,durationTable } from '@/lib/data';


const columns = [
  { header: "Exam ID", accessor: "exam_id" },
  { header: "Matiere", accessor: "subject" },
  { header: "Date", accessor: "exam_date" },
  { header: "Start Time", accessor: "start_time" },
  { header: "End Time", accessor: "end_time" },
  { header: "Duration", accessor: "duration" },
  { header: "Coefficient", accessor: "coefficient" },
  { header: "Salle", accessor: "salle" },
  { header: "Surveillant", accessor: "surveillant" },
];

const ITEMS_PER_PAGE = 10;

const  NotValidatedExamByDep=()=> {
  {/* lel pagination */}
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(chefData.length / ITEMS_PER_PAGE);
  // Calculate the current page data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = chefData.slice(startIndex, endIndex);
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const {auth}=useAuth()

  useEffect(() => {
    const controller = new AbortController();

    const getExams = async () => {
        try {
            const response = await axiosPrivate.get('/exams/notValidatedExamsByDeaprtment/'+auth.user_id, {
                signal: controller.signal
            });
            console.log(response.data);
            if (response.status === 200) {
              setExams(response.data); 
            }
            
        } catch (err: any) {
          console.log(err);
          if (err.name !== "CanceledError") {
            console.error("Erreur lors de la récupération des examens:", err);
            router.push('/sign-in');
        }
          }
    }

    getExams();

    return () => {
        controller.abort();
    }
}, [axiosPrivate, router])

  const renderRow = (item: any) => (
    <tr key={item.exam_id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-5">{item.exam_id}</td>
      <td>{item.fKExam.FkSubject.name}</td>
      <td>{item.fKExam.exam_date.slice(0,10)}</td>
      <td>{item.start_time.slice(11,16)}</td>
      <td>{item.end_time.slice(11,16)}</td>
      <td>{durationTable[item.fKExam.duration as DurationKey]}h</td>
      <td>{coefTable[item.fKExam.FkSubject.coefficient as CoefficientKey ]}</td>
      <td>{item.FkRoom.room_name}</td>
      <td>{item.FkTeacher.FkUser.name}</td>
    </tr>
  );

  return (
    <div className="p-4 flex flex-col items-center w-full">
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
        <Table columns={columns} renderRow={renderRow} data={exams} />

        {/* PAGINATION */}
        {/* <Pagination
            currentPage={currentPage}
            count ={totalExams}
        /> */}
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
export default NotValidatedExamByDep