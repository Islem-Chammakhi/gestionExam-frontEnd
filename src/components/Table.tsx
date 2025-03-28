const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
     data && data.length !==0 ?
      <table className="w-full  mb-3 mt-6">
        <thead>
          <tr className="text-left text-gray-900 text-sm">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`pb-2 ${col.className || ""}`} // Adds spacing below the headers
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    : <div className="text-center text-sm text-gray-700 mt-10">
          <h1 className="text-base">* Pas de données à afficher ! *</h1>
      </div>
  );
};

export default Table;

// data.length !==0 ?
// <table className="w-full mt-8 mb-3">
//   <thead>
//     <tr className="text-left text-gray-900 text-sm">
//       {columns.map((col) => (
//         <th
//           key={col.accessor}
//           className={`pb-2 ${col.className || ""}`} // Adds spacing below the headers
//         >
//           {col.header}
//         </th>
//       ))}
//     </tr>
//   </thead>
//   <tbody>
//     {data.map((item) => renderRow(item))}
//   </tbody>
// </table>
// : <div className="text-center text-sm text-gray-700 mt-10">
//     <h1 className="text-base">* Pas de données à afficher ! *</h1>
// </div>