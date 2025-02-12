"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useState } from "react";

// Lazy loading
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  exam: (type, data) => <ExamForm type={type} data={data} />,
};

const FormModal = ({
  type,
  data,
  id,
}: {

  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
}) => {
  const size = "w-8 h-8";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-purple-300"
      : "bg-red-400";

  const [open, setOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  console.log("wiiiiiiiiiiiiiiiiiiiw",data)
  const handleDelete=async (e: React.FormEvent)=>{
    e.preventDefault()
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete('/exams/deleteExam/'+id, {
          signal: controller.signal
      });
      console.log(response.data);
      if (response.status === 201) {
        console.log("examen supprimé")
      }
      
  } catch (err: any) {
    console.log(err);
    if (err.name !== "CanceledError") {
      console.error("Erreur lors de la supression de  l'examen:", err);
  }


  }
}

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form onSubmit={handleDelete} className="p-2 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this exam ?
          </span>
          <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
            Delete
          </button>
        </form>
      );
    } else if ((type === "create")) {
        return <ExamForm type="create"/>
    }
    else if ((type === "update")) {
      return <ExamForm type="update" data={data}/>
    }
     else {
      return <span className="text-red-500">Form not found!</span>;
    }
  };

  return (
    <>
      <div className="relative group">
        <button
          className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
          onClick={() => setOpen(true)}
        >
          <Image src={`/${type}.png`} alt={type} width={18} height={18} />
        </button>

        {/* Tooltip */}
        <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {type === "update" ? "Modifier" : type === "delete" ? "Supprimer" : ""}
        </span>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
