"use client";

import { useState, useEffect } from 'react';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, subjectsData } from "@/lib/data";
import Image from "next/image";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from '@/utils/PersistLogin';
import { CoefficientKey,DurationKey,coefTable,durationTable } from '@/lib/data';



const columns = [
  {
    header: "Exam ID",
    accessor: "exam_id",
  },
  {
    header: "Matière",
    accessor: "subject",
  },
  {
    header: "Dep. ID",
    accessor: "department_id",
  },
  {
    header: "Date",
    accessor: "exam_date",
  },
  {
    header: "heure de début",
    accessor: "start_time",
  },
  {
    header: "heure de fin",
    accessor: "end_time",
  },
  {
    header: "Durée",
    accessor: "duration",
  },
  {
    header: "Coeff",
    accessor: "coefficient",
  },
  {
    header: "Salle",
    accessor: "salle",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];




const ExamListPage = ({searchParams}:{searchParams?:{[key:string]:string}}) => {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const { page, ...queryParams } = searchParams || {};
  const currentPage = page ? parseInt(page) : 1
  const totalExams = JSON.parse(sessionStorage.getItem('totalExams') || '0')

  useEffect(() => {
    const controller = new AbortController();

    const getExams = async () => {
        try {
            const response = await axiosPrivate.get('/exams/getAllExams/'+currentPage, {
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
    <tr
      key={item.exam_id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-5">{item.exam_id}</td>
      <td>{item.FkSubject.name}</td>
      <td>{item.FkSubject.department_id}</td>
      <td>{item.exam_date.slice(0,10)}</td>
      <td>{item?.rooms[0]?.start_time.slice(11,16) || "-"}</td>
      <td>{item?.rooms[0]?.end_time.slice(11,16) || "-"}</td>
      <td>{durationTable[item.duration as DurationKey]}h</td>
      <td>{coefTable[item.FkSubject.coefficient as CoefficientKey]}</td>
      <td>{item?.rooms[0]?.FkRoom?.room_name || "-"}</td>
      <td>
        <div className="flex items-center gap-2">
              <FormModal  type="update" data={item} />
              <FormModal  type="delete" id={item.exam_id} />
        </div>
      </td>
    </tr>
  );

  return (
    <PersistLogin>
      <RequireAuth requiredRole="ADMIN">
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Examens</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              <FormModal  type="create" />
            </div>
          </div>
        </div>
        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={exams} />
        {/* PAGINATION */}
        <Pagination
            currentPage={currentPage}
            count ={totalExams}
        />
      </div>
      </RequireAuth>
    </PersistLogin>
  );
};
export default ExamListPage
