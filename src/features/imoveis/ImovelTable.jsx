import Spinner from "../../ui/Spinner";
import ImovelRow from "./ImovelRow";
import { useImoveis } from "./useImoveis";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

function ImovelTable() {
  const { isLoading, imoveis } = useImoveis();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  const imoveisValidos = imoveis || [];

  if (!imoveisValidos.length) return <Empty resourceName="imóveis" />;

  // 1) NOVO FILTRO: Venda ou Locação
  const filterValue = searchParams.get("tipo_negocio") || "all";
  let filteredImoveis;
  if (filterValue === "all") filteredImoveis = imoveisValidos;
  if (filterValue === "locacao")
    filteredImoveis = imoveisValidos.filter(
      (imovel) => imovel.tipo_negocio === "locacao",
    );
  if (filterValue === "venda")
    filteredImoveis = imoveisValidos.filter(
      (imovel) => imovel.tipo_negocio === "venda",
    );

  // 2) ORDENAÇÃO
  const sortBy = searchParams.get("sortBy") || "created_at-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedImoveis = filteredImoveis.sort((a, b) => {
    // Para tratar strings (como datas e nomes) vs números
    if (typeof a[field] === "string") {
      return a[field].localeCompare(b[field]) * modifier;
    }
    return (a[field] - b[field]) * modifier;
  });

  return (
    <Menus>
      {/* GRID ATUALIZADO: 5 Colunas + Botão de Ações */}
      <Table columns="0.6fr 2.4fr 1.2fr 1.2fr 1.4fr 0.4fr">
        <Table.Header>
          <div></div>
          <div>Imóvel</div>
          <div>Negócio</div>
          <div>Estrutura</div>
          <div>Valor Base</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedImoveis}
          render={(imovel) => <ImovelRow imovel={imovel} key={imovel.id} />}
        />
      </Table>
    </Menus>
  );
}

export default ImovelTable;
