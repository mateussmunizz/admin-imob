import supabase, { supabaseUrl } from "./supabase";

export async function getImoveis() {
  const { data, error } = await supabase.from("imoveis").select("*");

  if (error) {
    console.error(error);
    throw new Error("Os imóveis não puderam ser carregados");
  }

  return data;
}

export async function createEditImovel(payload, fallbackId) {
  // 1. Correção vital: Identificar se o React Query enviou os dados encapsulados
  const isReactQueryObject = payload && payload.newImovelData;
  const newImovel = isReactQueryObject ? payload.newImovelData : payload;
  const id = isReactQueryObject ? payload.id : fallbackId;

  const isStringPath = typeof newImovel.image === "string";

  let imagePath = "EMPTY";
  let imageName = null;

  if (isStringPath) {
    imagePath = newImovel.image;
  } else if (
    newImovel.image &&
    (newImovel.image instanceof File || newImovel.image instanceof Blob)
  ) {
    imageName = `${Math.random()}-${newImovel.image.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/imoveis/${imageName}`;
  }

  let galeriaPaths = [];
  let arquivosGaleriaParaUpload = [];

  let galeriaArray = [];
  if (Array.isArray(newImovel.galeria_imagens)) {
    galeriaArray = newImovel.galeria_imagens;
  } else if (typeof newImovel.galeria_imagens === "string") {
    try {
      galeriaArray = JSON.parse(newImovel.galeria_imagens);
    } catch {
      galeriaArray = [newImovel.galeria_imagens];
    }
  } else if (newImovel.galeria_imagens) {
    galeriaArray = Array.from(newImovel.galeria_imagens);
  }

  for (let file of galeriaArray) {
    if (typeof file === "string") {
      galeriaPaths.push(file);
    } else if (file instanceof File || file instanceof Blob) {
      const gName = `${Math.random()}-${file.name}`.replaceAll("/", "");
      const gPath = `${supabaseUrl}/storage/v1/object/public/imoveis/${gName}`;
      galeriaPaths.push(gPath);
      arquivosGaleriaParaUpload.push({ file, name: gName });
    }
  }

  galeriaPaths = [...new Set(galeriaPaths)];

  // 3. MONTAR OS DADOS PARA O BANCO
  const imovelData = {
    ...newImovel,
    image: imagePath,
    galeria_imagens: galeriaPaths,
  };

  let query = supabase.from("imoveis");

  // Se tem ID, atualiza. Se não tem, cria.
  if (!id) query = query.insert([imovelData]);
  if (id) query = query.update(imovelData).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error(`Erro ao salvar dados: ${error.message}`);
  }

  // 4. UPLOAD DA CAPA
  if (imageName && newImovel.image) {
    const { error: storageError } = await supabase.storage
      .from("imoveis")
      .upload(imageName, newImovel.image);

    if (storageError) {
      if (!id) await supabase.from("imoveis").delete().eq("id", data.id);
      throw new Error(`Bloqueio na Foto de Capa: ${storageError.message}`);
    }
  }

  // 5. UPLOAD DA GALERIA
  for (let item of arquivosGaleriaParaUpload) {
    const { error: galeriaError } = await supabase.storage
      .from("imoveis")
      .upload(item.name, item.file);

    if (galeriaError) {
      console.error(`Erro ao subir a foto ${item.name}:`, galeriaError.message);
    }
  }

  return data;
}

export async function deleteImovel(id) {
  const { data, error } = await supabase.from("imoveis").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("O imóvel não pôde ser deletado");
  }

  return data;
}
