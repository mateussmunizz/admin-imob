import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCaptacoes, updateCaptacaoStatus } from "../services/apiCRM";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
import Table from "../ui/Table";

function Captacoes() {
  const queryClient = useQueryClient();

  const { data: captacoes, isLoading } = useQuery({
    queryKey: ["captacoes"],
    queryFn: getCaptacoes,
  });

  const { mutate: changeStatus, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, status }) => updateCaptacaoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["captacoes"] });
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Captação de Leads (Proprietários)</Heading>
      </Row>

      <Table columns="1.5fr 1.5fr 2fr 1.5fr">
        <Table.Header>
          <div>Proprietário</div>
          <div>Tipo</div>
          <div>Endereço</div>
          <div style={{ textAlign: "center" }}>Ação (Gestão)</div>
        </Table.Header>

        <Table.Body
          data={captacoes || []}
          render={(lead) => (
            <Table.Row key={lead.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "1.5rem" }}>
                  {lead.nome_proprietario}
                </span>
                <span
                  style={{ fontSize: "1.3rem", color: "var(--color-grey-500)" }}
                >
                  {lead.whatsapp}
                </span>
              </div>

              <div style={{ textTransform: "capitalize", fontSize: "1.4rem" }}>
                {lead.tipo_imovel || "Não informado"}
              </div>

              <div
                style={{ fontSize: "1.4rem", color: "var(--color-grey-600)" }}
              >
                {lead.endereco_imovel || "-"}
              </div>

              {/* MENU INTERATIVO DE CAPTAÇÃO COM ALERTA VISUAL */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <select
                  value={lead.status}
                  onChange={(e) =>
                    changeStatus({ id: lead.id, status: e.target.value })
                  }
                  disabled={isUpdating}
                  style={{
                    backgroundColor:
                      lead.status === "novo"
                        ? "var(--color-brand-100)"
                        : lead.status === "em_contato"
                          ? "var(--color-yellow-100)"
                          : lead.status === "arquivado"
                            ? "var(--color-grey-200)"
                            : "var(--color-green-100)",
                    color:
                      lead.status === "novo"
                        ? "var(--color-brand-700)"
                        : lead.status === "em_contato"
                          ? "var(--color-yellow-700)"
                          : lead.status === "arquivado"
                            ? "var(--color-grey-600)"
                            : "var(--color-green-700)",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "100px",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    width: "100%",
                  }}
                >
                  <option value="novo">Novo Lead</option>
                  <option value="em_contato">Em Contato</option>
                  <option value="captado">Captado</option>
                  <option value="arquivado">Arquivado</option>
                </select>

                {lead.status === "captado" && (
                  <span
                    style={{
                      fontSize: "1.1rem",
                      color: "var(--color-brand-600)",
                      marginTop: "0.6rem",
                      textAlign: "center",
                      fontWeight: 600,
                    }}
                  >
                    👉 Publique na aba Imóveis
                  </span>
                )}
              </div>
            </Table.Row>
          )}
        />
      </Table>
    </>
  );
}

export default Captacoes;
