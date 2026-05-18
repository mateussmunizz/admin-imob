import styled from "styled-components";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import CreateImovelForm from "./CreateImovelForm";
import { useDeleteImovel } from "./useDeleteImovel";
import { formatCurrency } from "../../utils/helpers";
import { useCreateImovel } from "./useCreateImovel";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const Imovel = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const NegocioTag = styled.span`
  background-color: var(--color-brand-100);
  color: var(--color-brand-700);
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  width: max-content;
`;

const VendaTag = styled(NegocioTag)`
  background-color: var(--color-green-100);
  color: var(--color-green-700);
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
  font-size: 1.5rem;
`;

const Info = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-500);
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.3) translateX(-4px);
  border-radius: 4px;
`;

function ImovelRow({ imovel }) {
  const { isDeleting, deleteImovel } = useDeleteImovel();
  const { isCreating, createImovel } = useCreateImovel();

  // ATUALIZADO: Buscamos os campos novos que você criou no banco
  const {
    id: imovelId,
    name,
    regularPrice,
    image,
    description,
    tipo_negocio,
    area_m2,
    quartos,
    galeria_imagens,
    endereco,
    valor_condominio,
    valor_iptu,
    vagas,
    banheiros,
    aceita_pet,
    mobiliado,
  } = imovel;

  // ATUALIZADO: Duplicação copia todos os dados novos
  function handleDuplicate() {
    createImovel({
      name: `Cópia de ${name}`,
      regularPrice,
      image,
      description,
      tipo_negocio,
      area_m2,
      quartos,
      galeria_imagens,
      endereco,
      valor_condominio,
      valor_iptu,
      vagas,
      banheiros,
      aceita_pet,
      mobiliado,
    });
  }

  // Previne erro caso a imagem venha nula do banco
  const imagemSegura = image || "https://placehold.co/150x100?text=Sem+Foto";

  return (
    <Table.Row>
      <Img src={imagemSegura} />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <Imovel>{name}</Imovel>
        <Info>{endereco?.split(",")[0] || "Endereço não informado"}</Info>
      </div>

      <div>
        {tipo_negocio === "venda" ? (
          <VendaTag>Venda</VendaTag>
        ) : (
          <NegocioTag>Aluguel</NegocioTag>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <span style={{ fontWeight: 500 }}>{area_m2}m²</span>
        <Info>
          {quartos} qtos • {vagas} vagas
        </Info>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        <Price>{formatCurrency(regularPrice)}</Price>
      </div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={imovelId} />

            <Menus.List id={imovelId}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicar
              </Menus.Button>

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Editar</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Eliminar</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateImovelForm imovelToEdit={imovel} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="imóveis"
                disabled={isDeleting}
                onConfirm={() => deleteImovel(imovelId)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default ImovelRow;
