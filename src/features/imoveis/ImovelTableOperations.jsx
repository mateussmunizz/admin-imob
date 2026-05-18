import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function ImovelTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="tipo_negocio"
        options={[
          { value: "all", label: "Todos" },
          { value: "locacao", label: "Locação" },
          { value: "venda", label: "Venda" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Ordenar por nome (A-Z)" },
          { value: "name-desc", label: "Ordenar por nome (Z-A)" },
          {
            value: "regularPrice-asc",
            label: "Ordenar por preço (Menor primeiro)",
          },
          {
            value: "regularPrice-desc",
            label: "Ordenar por preço (Maior primeiro)",
          },
          { value: "area_m2-desc", label: "Ordenar por área (Maior primeiro)" },
          { value: "created_at-desc", label: "Mais recentes primeiro" },
        ]}
      />
    </TableOperations>
  );
}

export default ImovelTableOperations;
