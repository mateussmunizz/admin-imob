import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVisitas, updateVisitaStatus } from "../services/apiCRM";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/Spinner";
import Table from "../ui/Table";

function Visitas() {
  const queryClient = useQueryClient();

  const { data: visitas, isLoading } = useQuery({
    queryKey: ["visitas"],
    queryFn: getVisitas,
  });

  const { mutate: changeStatus, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, status }) => updateVisitaStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitas"] });
    },
  });

  const handleAvisarWhatsApp = (visita) => {
    const telefoneLimpo = visita.whatsapp.replace(/\D/g, "");
    const dataFormatada = new Date(visita.data_visita).toLocaleDateString(
      "pt-BR",
    );
    const horaFormatada = new Date(visita.data_visita).toLocaleTimeString(
      "pt-BR",
      { hour: "2-digit", minute: "2-digit" },
    );
    const nomeImovel = visita.imoveis?.name || "o imóvel";

    let mensagem = "";

    if (visita.status === "confirmada") {
      mensagem = `Olá ${visita.nome_cliente}! Tudo bem? Passando para confirmar nossa visita em ${nomeImovel} no dia ${dataFormatada} às ${horaFormatada}. Nos vemos lá! 🏠`;
    } else if (visita.status === "cancelada") {
      mensagem = `Olá ${visita.nome_cliente}. Infelizmente precisamos cancelar a nossa visita em ${nomeImovel} que aconteceria dia ${dataFormatada} às ${horaFormatada}. Podemos remarcar para outro dia? 🗓️`;
    } else {
      mensagem = `Olá ${visita.nome_cliente}, vi que você tem interesse no imóvel ${nomeImovel}. Podemos conversar?`;
    }

    const textoCodificado = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/55${telefoneLimpo}?text=${textoCodificado}`;

    window.open(linkWhatsApp, "_blank");
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Visitas Agendadas</Heading>
      </Row>

      <Table columns="1.8fr 1.8fr 1.2fr 1.5fr">
        <Table.Header>
          <div>Cliente / Contato</div>
          <div>Imóvel / Endereço</div>
          <div>Data e Hora</div>
          <div>Ação (Status) & Aviso</div>
        </Table.Header>

        <Table.Body
          data={visitas || []}
          render={(visita) => (
            <Table.Row key={visita.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    color: "var(--color-grey-700)",
                  }}
                >
                  {visita.nome_cliente || "Nome não informado"}
                </span>
                <span
                  style={{
                    fontSize: "1.3rem",
                    color: "var(--color-brand-600)",
                    fontWeight: 500,
                  }}
                >
                  {visita.whatsapp || "Sem telefone"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                }}
              >
                <div
                  style={{ fontWeight: 500, color: "var(--color-grey-600)" }}
                >
                  {visita.imoveis?.name || "Imóvel Removido"}
                </div>
                <span
                  style={{ fontSize: "1.2rem", color: "var(--color-grey-400)" }}
                >
                  {visita.imoveis?.endereco?.split(",")[0]}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                }}
              >
                <span>
                  {new Date(visita.data_visita).toLocaleDateString("pt-BR")}
                </span>
                <span
                  style={{ color: "var(--color-grey-500)", fontSize: "1.2rem" }}
                >
                  às{" "}
                  {new Date(visita.data_visita).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div
                style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}
              >
                <select
                  value={visita.status}
                  onChange={(e) =>
                    changeStatus({ id: visita.id, status: e.target.value })
                  }
                  disabled={isUpdating}
                  style={{
                    backgroundColor:
                      visita.status === "pendente"
                        ? "var(--color-yellow-100)"
                        : visita.status === "confirmada"
                          ? "var(--color-brand-100)"
                          : visita.status === "cancelada"
                            ? "var(--color-red-100)"
                            : "var(--color-green-100)",
                    color:
                      visita.status === "pendente"
                        ? "var(--color-yellow-700)"
                        : visita.status === "confirmada"
                          ? "var(--color-brand-700)"
                          : visita.status === "cancelada"
                            ? "var(--color-red-700)"
                            : "var(--color-green-700)",
                    padding: "0.6rem 1rem",
                    borderRadius: "100px",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    flexGrow: 1,
                  }}
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>

                <button
                  onClick={() => handleAvisarWhatsApp(visita)}
                  title="Avisar cliente no WhatsApp"
                  style={{
                    backgroundColor: "#25D366",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "1.6rem",
                    transition: "all 0.2s",
                  }}
                >
                  💬
                </button>
              </div>
            </Table.Row>
          )}
        />
      </Table>
    </>
  );
}

export default Visitas;
