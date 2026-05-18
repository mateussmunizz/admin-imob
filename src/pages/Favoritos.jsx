import { useQuery } from "@tanstack/react-query";
import { getFavoritos } from "../services/apiCRM";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
import Table from "../ui/Table";
import { formatCurrency } from "../utils/helpers";

function Favoritos() {
  const { data: favoritos, isLoading } = useQuery({
    queryKey: ["favoritos"],
    queryFn: getFavoritos,
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Interesses (Favoritos da Vitrine)</Heading>
      </Row>

      <Table columns="0.8fr 2fr 2fr 1fr">
        <Table.Header>
          <div>Capa</div>
          <div>Imóvel Selecionado</div>
          <div>Contato do Cliente</div>
          <div>Valor Base</div>
        </Table.Header>

        <Table.Body
          data={favoritos || []}
          render={(fav) => (
            <Table.Row key={fav.id}>
              <img
                src={
                  fav.imoveis?.image ||
                  "https://placehold.co/150x100?text=Sem+Foto"
                }
                alt="Imóvel"
                style={{
                  width: "7.2rem",
                  aspectRatio: "3/2",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />

              <div
                style={{
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  color: "var(--color-grey-700)",
                }}
              >
                {fav.imoveis?.name || "Imóvel Removido"}
              </div>

              <div
                style={{
                  fontSize: "1.4rem",
                  color: "var(--color-brand-600)",
                  fontWeight: 500,
                }}
              >
                {fav.clientes?.email || "Email não encontrado"}
              </div>

              <div
                style={{
                  fontFamily: "Sono",
                  fontWeight: 600,
                  fontSize: "1.5rem",
                }}
              >
                {fav.imoveis?.regularPrice
                  ? formatCurrency(fav.imoveis.regularPrice)
                  : "-"}
              </div>
            </Table.Row>
          )}
        />
      </Table>
    </>
  );
}

export default Favoritos;
