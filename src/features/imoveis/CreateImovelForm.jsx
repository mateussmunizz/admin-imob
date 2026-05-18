import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useCreateImovel } from "./useCreateImovel";
import { useEditImovel } from "./useEditImovel";

const SectionTitle = ({ children, style }) => (
  <h3
    style={{
      fontSize: "1.6rem",
      fontWeight: 600,
      color: "var(--color-brand-600)",
      borderBottom: "2px solid var(--color-grey-100)",
      paddingBottom: "0.8rem",
      marginTop: "3.2rem",
      marginBottom: "1.6rem",
      ...style,
    }}
  >
    {children}
  </h3>
);

function CreateImovelForm({ imovelToEdit = {}, onCloseModal }) {
  const { isCreating, createImovel } = useCreateImovel();
  const { isEditing, editImovel } = useEditImovel();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = imovelToEdit;
  const isEditSession = Boolean(editId);

  const [currentCover, setCurrentCover] = useState(imovelToEdit.image || null);

  let galeriaSegura = [];
  if (Array.isArray(imovelToEdit.galeria_imagens)) {
    galeriaSegura = imovelToEdit.galeria_imagens;
  } else if (typeof imovelToEdit.galeria_imagens === "string") {
    try {
      galeriaSegura = JSON.parse(imovelToEdit.galeria_imagens);
    } catch {
      galeriaSegura = [imovelToEdit.galeria_imagens];
    }
  }
  const [currentGallery, setCurrentGallery] = useState(galeriaSegura);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);

  const { register, handleSubmit, reset, formState, setValue, control } =
    useForm({
      defaultValues: isEditSession
        ? editValues
        : { aceita_pet: false, mobiliado: false, tipo_negocio: "locacao" },
    });
  const { errors } = formState;

  async function handleCepBlur(e) {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setValue(
            "endereco",
            `${data.logradouro}, Número:  - ${data.bairro}, ${data.localidade}/${data.uf}`,
          );
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP", error);
      }
    }
  }

  const handleRemoveCover = () => setCurrentCover(null);

  const handleRemoveGalleryImage = (indexToRemove) => {
    setCurrentGallery((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleRemoveNewGalleryFile = (indexToRemove) => {
    setNewGalleryFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  function onSubmit(data) {
    const imageToSubmit = data.image?.length > 0 ? data.image[0] : currentCover;
    const galeriaToSubmit = [...currentGallery, ...newGalleryFiles];

    const imovelFormatado = {
      ...data,
      image: imageToSubmit,
      galeria_imagens: galeriaToSubmit,
      regularPrice: Number(data.regularPrice) || 0,
      area_m2: Number(data.area_m2) || 0,
      quartos: Number(data.quartos) || 0,
      banheiros: Number(data.banheiros) || 0,
      vagas: Number(data.vagas) || 0,
      valor_condominio: Number(data.valor_condominio) || 0,
      valor_iptu: Number(data.valor_iptu) || 0,
      taxa_servico: Number(data.taxa_servico) || 0,
    };

    if (isEditSession) {
      editImovel(
        { newImovelData: imovelFormatado, id: editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      createImovel(imovelFormatado, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, () => {})}
      type={onCloseModal ? "modal" : "regular"}
    >
      <div
        style={{
          maxHeight: "65vh",
          overflowY: "auto",
          paddingRight: "1.6rem",
          overflowX: "hidden",
        }}
      >
        <SectionTitle style={{ marginTop: "0" }}>
          1. Identificação e Localização
        </SectionTitle>
        <FormRow label="Título do Anúncio" error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            disabled={isWorking}
            {...register("name", { required: "Este campo é obrigatório" })}
          />
        </FormRow>
        <FormRow label="CEP do Imóvel" error={errors?.cep?.message}>
          <Input
            type="text"
            id="cep"
            placeholder="Ex: 01001000"
            disabled={isWorking}
            onBlur={handleCepBlur}
          />
        </FormRow>
        <FormRow label="Endereço Completo" error={errors?.endereco?.message}>
          <Input
            type="text"
            id="endereco"
            disabled={isWorking}
            {...register("endereco", { required: "Endereço necessário" })}
          />
        </FormRow>

        <SectionTitle>2. Dados Comerciais</SectionTitle>
        <FormRow label="Tipo de Negócio" error={errors?.tipo_negocio?.message}>
          <select
            id="tipo_negocio"
            disabled={isWorking}
            {...register("tipo_negocio")}
            style={{
              padding: "0.8rem 1.2rem",
              borderRadius: "5px",
              border: "1px solid var(--color-grey-300)",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            }}
          >
            <option value="locacao">Para Aluguel</option>
            <option value="venda">Para Venda</option>
          </select>
        </FormRow>

        <FormRow
          label="Valor (Venda/Aluguel)"
          error={errors?.regularPrice?.message}
        >
          <Controller
            name="regularPrice"
            control={control}
            rules={{
              required: "Valor obrigatório",
              min: { value: 1, message: "Deve ser maior que zero" },
            }}
            render={({ field: { onChange, value, ref } }) => (
              <NumericFormat
                getInputRef={ref}
                value={value}
                onValueChange={(v) => onChange(v.floatValue || 0)}
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                disabled={isWorking}
                id="regularPrice"
              />
            )}
          />
        </FormRow>

        <FormRow
          label="Valor do Condomínio"
          error={errors?.valor_condominio?.message}
        >
          <Controller
            name="valor_condominio"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <NumericFormat
                getInputRef={ref}
                value={value}
                onValueChange={(v) => onChange(v.floatValue || 0)}
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                disabled={isWorking}
                id="valor_condominio"
              />
            )}
          />
        </FormRow>

        <FormRow label="Valor do IPTU" error={errors?.valor_iptu?.message}>
          <Controller
            name="valor_iptu"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <NumericFormat
                getInputRef={ref}
                value={value}
                onValueChange={(v) => onChange(v.floatValue || 0)}
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                disabled={isWorking}
                id="valor_iptu"
              />
            )}
          />
        </FormRow>

        <SectionTitle>3. Estrutura do Imóvel</SectionTitle>
        <FormRow label="Área Útil (m²)" error={errors?.area_m2?.message}>
          <Input
            type="number"
            id="area_m2"
            disabled={isWorking}
            {...register("area_m2", {
              required: "Necessário informar a metragem",
              min: 1,
            })}
          />
        </FormRow>
        <FormRow label="Quartos" error={errors?.quartos?.message}>
          <Input
            type="number"
            id="quartos"
            disabled={isWorking}
            {...register("quartos")}
          />
        </FormRow>
        <FormRow label="Banheiros" error={errors?.banheiros?.message}>
          <Input
            type="number"
            id="banheiros"
            disabled={isWorking}
            {...register("banheiros")}
          />
        </FormRow>
        <FormRow label="Vagas de Garagem" error={errors?.vagas?.message}>
          <Input
            type="number"
            id="vagas"
            disabled={isWorking}
            {...register("vagas")}
          />
        </FormRow>
        <FormRow label="Comodidades Extras">
          <div id="comodidades">
            <div style={{ display: "flex", gap: "2rem" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
              >
                <input
                  type="checkbox"
                  id="aceita_pet"
                  disabled={isWorking}
                  {...register("aceita_pet")}
                  style={{ width: "20px", height: "20px" }}
                />
                <label htmlFor="aceita_pet">Aceita Pet?</label>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
              >
                <input
                  type="checkbox"
                  id="mobiliado"
                  disabled={isWorking}
                  {...register("mobiliado")}
                  style={{ width: "20px", height: "20px" }}
                />
                <label htmlFor="mobiliado">Mobiliado?</label>
              </div>
            </div>
          </div>
        </FormRow>
        <FormRow
          label="Descrição Detalhada"
          error={errors?.description?.message}
        >
          <Textarea
            id="description"
            disabled={isWorking}
            {...register("description", {
              required: "Descrição é obrigatória",
            })}
            style={{ height: "100px" }}
          />
        </FormRow>

        <SectionTitle>4. Mídia (Fotos)</SectionTitle>

        {isEditSession && currentCover && currentCover !== "EMPTY" && (
          <FormRow label="Capa Atual Salva">
            <div id="capa_atual_wrapper">
              <div
                style={{
                  position: "relative",
                  width: "180px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--color-grey-200)",
                }}
              >
                <img
                  src={currentCover}
                  alt="Capa"
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "var(--color-red-700)",
                    color: "white",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    width: "28px",
                    height: "28px",
                    fontSize: "1.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </FormRow>
        )}
        <FormRow
          label={
            currentCover && currentCover !== "EMPTY"
              ? "Substituir Capa"
              : "Upload Nova Capa"
          }
        >
          <FileInput
            id="image"
            accept="image/*"
            disabled={isWorking}
            {...register("image", {
              required:
                !isEditSession || !currentCover || currentCover === "EMPTY"
                  ? "A foto de capa é obrigatória"
                  : false,
            })}
          />
        </FormRow>

        {isEditSession && currentGallery?.length > 0 && (
          <FormRow label="Fotos Salvas no Banco">
            <div id="galeria_atual_wrapper">
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {currentGallery.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid var(--color-grey-200)",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Galeria ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "var(--color-red-700)",
                        color: "white",
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        width: "22px",
                        height: "22px",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FormRow>
        )}

        <FormRow label="Adicionar Novas Fotos (Várias pastas)">
          <FileInput
            id="galeria_imagens_input"
            accept="image/*"
            multiple
            disabled={isWorking}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 0) {
                setNewGalleryFiles((prev) => [...prev, ...files]);
              }
              e.target.value = null;
            }}
          />
        </FormRow>

        {newGalleryFiles.length > 0 && (
          <FormRow label="Fila de Envio (Aguardando Salvar)">
            <div id="novas_fotos_wrapper">
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {newGalleryFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "3px solid var(--color-brand-500)",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Nova"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewGalleryFile(index)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "var(--color-red-700)",
                        color: "white",
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        width: "22px",
                        height: "22px",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <span
                style={{
                  fontSize: "1.2rem",
                  color: "var(--color-brand-600)",
                  marginTop: "0.5rem",
                  display: "block",
                  fontWeight: 600,
                }}
              >
                Total na fila: {newGalleryFiles.length} fotos prontas para
                subir.
              </span>
            </div>
          </FormRow>
        )}
      </div>

      <div
        style={{
          paddingTop: "2.4rem",
          marginTop: "1.2rem",
          borderTop: "1px solid var(--color-grey-100)",
        }}
      >
        <FormRow>
          <Button
            variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
          >
            Cancelar
          </Button>
          <Button disabled={isWorking}>
            {isEditSession ? "Salvar alterações" : "Cadastrar Imóvel"}
          </Button>
        </FormRow>
      </div>
    </Form>
  );
}

export default CreateImovelForm;
