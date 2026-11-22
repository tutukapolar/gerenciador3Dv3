import { supabase } from '../supabase';
export async function enviarImagem(file, userId, folder) {
  if (!file?.type?.startsWith('image/') || file.size > 4 * 1024 * 1024) throw new Error('Use uma imagem de até 4 MB.');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  if (!['jpg','jpeg','png','webp','gif'].includes(ext)) throw new Error('Formato de imagem inválido.');
  const path = `${userId}/${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('loja-imagens').upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return supabase.storage.from('loja-imagens').getPublicUrl(path).data.publicUrl;
}
