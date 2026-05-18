import supabase from "./supabase";

export async function getVisitas() {
  const { data, error } = await supabase
    .from("visitas")
    .select("*, imoveis(name, endereco)")
    .order("data_visita", { ascending: true });

  if (error) {
    console.error("Erro Supabase:", error.message);
    throw new Error("Erro ao carregar visitas");
  }
  return data;
}

export async function getCaptacoes() {
  const { data, error } = await supabase.from("captacoes").select("*");
  if (error) throw new Error("Erro ao carregar captações");
  return data;
}

export async function getFavoritos() {
  const { data, error } = await supabase
    .from("favoritos")
    .select("*, imoveis(name, regularPrice, image), clientes(email)");

  if (error) throw new Error("Erro ao carregar favoritos");
  return data;
}

export async function updateVisitaStatus(id, newStatus) {
  const { data, error } = await supabase
    .from("visitas")
    .update({ status: newStatus })
    .eq("id", id)
    .select();

  if (error) throw new Error("Erro ao atualizar o status da visita");
  return data;
}

export async function updateCaptacaoStatus(id, newStatus) {
  const { data, error } = await supabase
    .from("captacoes")
    .update({ status: newStatus })
    .eq("id", id)
    .select();

  if (error) throw new Error("Erro ao atualizar o status da captação");
  return data;
}
