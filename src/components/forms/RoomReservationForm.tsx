"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Table from "../Table"; // Import the Table component

const schema = z.object({
  examen: z.string().min(1, { message: "Examen est requis!" }),
  date: z.string(),
  debut: z.string().min(1, { message: "Temps du début d'examen est requis!" }),
  fin: z.string(),
  duration: z.string(),
});

type Inputs = z.infer<typeof schema>;

const RoomReservationForm = ({ type, data, id }: {
  type: "reserve" | "view";
  data?: any; // Data is passed down as a prop
  id?: number;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  // Define columns for the table
  const columns = [
    { header: "Examen", accessor: "examen", className: "text-center" },
    { header: "Date", accessor: "date", className: "text-center" },
    { header: "Durée", accessor: "duration", className: "text-center" },
    { header: "Début", accessor: "debut", className: "text-center" },
    { header: "Fin", accessor: "fin", className: "text-center" },
  ];
  

  return (
    <>
      {/* RESERVE FORM */}
      {type === "reserve" && (
        <form className="flex flex-col gap-8 p-3" onSubmit={onSubmit}>
          {/* TITRE */}
          <h1 className="text-lg font-semibold text-center">Réserver une salle</h1>

          {/* CONTENU */}
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex gap-4 w-full">
              {/* Matière Field (Dropdown list) */}
              <div className="flex flex-col gap-2 w-3/4">
                <label className="text-xs text-gray-500">Examen</label>
                <select
                  {...register("examen")}
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                >
                  <option value="">Sélectionnez un examen</option>
                  {/* Backend engineer (Lbaby) will populate options here */}
                </select>
                {errors.examen && (
                  <span className="text-red-500 text-xs">{errors.examen.message}</span>
                )}
              </div>

              {/* Coefficient Field */}
              <div className="flex flex-col gap-2 w-1/4">
                <label className="text-xs text-gray-500">Coefficient</label>
                <input
                  type="number"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            {/* Date Field (Locked, type: date) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Date</label>
              <input
                {...register("date")}
                type="date"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Durée Field (Locked) */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs text-gray-500">Durée</label>
              <input
                {...register("duration")}
                type="text"
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </div>

            <div className="flex gap-4 w-full">
              {/* Début Field (Editable, type: time) */}
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-xs text-gray-500">Début</label>
                <input
                  {...register("debut")}
                  type="time"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                />
                {errors.debut && (
                  <span className="text-red-500 text-xs">{errors.debut.message}</span>
                )}
              </div>

              {/* Fin Field (Locked, type: time) */}
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-xs text-gray-500">Fin</label>
                <input
                  {...register("fin")}
                  type="time"
                  className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* BUTTON RESERVER */}
          <button className="bg-blue-500 text-white text-base p-2 rounded-md hover:bg-blue-400 transition-colors">
            Réserver
          </button>
        </form>
      )}

      {/* VIEW FORM */}
      {type === "view" && (
        <div className="flex flex-col gap-4 mt-3">
          {/* TITRE */}
          <h1 className="text-lg font-semibold text-center">Liste des réservations du salle</h1>

          {/* CONTENU */}
          <div className="overflow-y-auto max-h-[400px]">
            <Table
              columns={columns}
              data={data}
              renderRow={(item) => (
                <tr key={item.examen} className="border-b border-gray-200 odd:bg-slate-50 text-sm hover:bg-lamaPurpleLight text-center">
                  <td className="p-4">{item.examen}</td>
                  <td className="p-4">{item.date}</td>
                  <td className="p-4">{item.duration}</td>
                  <td className="p-4">{item.debut}</td>
                  <td className="p-4">{item.fin}</td>
                </tr>
              )}
            />
          </div>


        </div>
      )}
      
    </>
  );
};

export default RoomReservationForm;