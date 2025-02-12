"use client";

import { useState,useEffect } from 'react';
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { directeurData } from "@/lib/data";
import Image from "next/image";
import UserCard from "@/components/UserCard";
import DepartmentCard from '@/components/DepartmentCard';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import axios from '@/api/axios';
import { useRouter } from 'next/navigation';
import { CoefficientKey,DurationKey,coefTable,durationTable } from '@/lib/data';

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
  { header: "Status", accessor: "status"}
];



export default function DirecteurPage({searchParams}:{searchParams?:{[key:string]:string}}) {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const { page, ...queryParams } = searchParams || {};
  const currentPage = page ? parseInt(page) : 1
  const [exams, setExams] = useState<any[]>([]);
  const [count, setCount] = useState<any>({})

  useEffect(() => {
    const controller = new AbortController();

    const getExams = async () => {
        try {
            const [response1, response2] = await Promise.all([
              axiosPrivate.get("/supervisors/getCountsSummaryDirector",{signal: controller.signal}), // Première API
              axiosPrivate.get("/exams/getExamsByDirector/",{signal: controller.signal}), // Deuxième API
            ]);
            if (response2.status === 200) {
              setExams(response2.data);
              setCount(response1.data) 
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
      <td>{item.fKExam.FkSubject.department_id}</td>
      <td>{item.fKExam.exam_date.slice(0,10)}</td>
      <td>{item.start_time.slice(11,16)}</td>
      <td>{item.end_time.slice(11,16)}</td>
      <td>{durationTable[item.fKExam.duration as DurationKey]}h</td>
      <td>{coefTable[item.fKExam.FkSubject.coefficient as CoefficientKey ]}</td>
      <td>{item.FkRoom.room_name}</td>
      <td>{item.FkTeacher.FkUser.name}</td>
      <td className="text-center">
        <Image
          src={item.validated_by_hod === true  ? "/validated.png" : "/notvalidated.png"}
          alt={item.validated_by_hod ? "Validated" : "Not Validated"}
          width={22}
          height={22}
          className="inline-block"
        />
      </td>
    </tr>
  );

  return (
    <div className="p-4 flex flex-col items-center w-full">
      {/* USER CARDS */}
      <div className="flex gap-4 justify-center flex-wrap w-full">
        <UserCard type="Directeur des étude" count={count.directorName?.[0]?.name || "N/A"} />
        <UserCard type="Enseignant" count={count.totalSupervisors} />
        <UserCard type="Etudiant" count={count.totalStudent} />
        <UserCard type="Département" count={count.totalDepartment} />
        <UserCard type="Examen" count={count.totalExams} />
      </div>

      {/* TABLE */}
      <div className="mt-16 w-full">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">
            Les examens de toutes les départements:
          </h1>
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
        <Pagination
            currentPage={currentPage}
            count ={count.totalExams}
        />
      </div>

      {/* DEP CARDS */}
      <div className="flex flex-wrap justify-center gap-4 w-full mt-10">
        {/* CARD0 */}
        <DepartmentCard imageSrc="/logo.png" title="Tous les départements" />

        {/* CARD1 */}
        <DepartmentCard
          imageSrc="/lap.png"
          title="Département Informatique"
          statusText="Status de validation:"
          statusIcon="/validated.png"
        />

        {/* CARD2 */}
        <DepartmentCard
          imageSrc="/math.png"
          title="Département Mathématiques"
          statusText="Status de validation:"
          statusIcon="/notvalidated.png"
        />

        {/* CARD3 */}
        <DepartmentCard
          imageSrc="/elec.png"
          title="Département Electrique"
          statusText="Status de validation:"
          statusIcon="/notvalidated.png"
          imageClassName="absolute w-40 h-40 mb-14 -right-16 -bottom-16" // Custom positioning for this card
        />
      </div>

      {/* BUTTON TEXT */}
      <div className="text-center text-sm text-gray-700 mt-10">
        <p>
          Après avoir vérifié les plannings de votre département, vous devrez
          cliquer sur le bouton <strong>Valider</strong>.
        </p>
        <p>
          Notez bien que la validation{" "}
          <em>
            ne peut pas avoir lieu sans la validation des autres "chefs de
            départements"
          </em>
          .
        </p>
        <p>* Cette action est irréversible *</p>
      </div>

      {/* VALIDER BUTTON */}
      <div className="w-full mt-8 mb-4">
        <button
          type="button"
          className="w-full bg-[#1c933b] text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-[#41c237] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled
        >
          Valider toutes les entrées
        </button>
      </div>
      
    </div>
  );
}