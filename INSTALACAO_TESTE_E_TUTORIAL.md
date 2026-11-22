# Instalação
1. Faça backup do projeto e substitua os arquivos pelo ZIP, mantendo seu `.env` local.
2. Execute `supabase/migrations/20261024_auto_trial_3_days.sql` no SQL Editor, depois da migração de convites `20261016_trial_invites.sql`.
3. Execute `npm.cmd install` e `npm.cmd run build` antes de publicar.
4. Crie uma conta de teste nova APÓS a migração, confirme o e-mail e entre. O teste é concedido no primeiro login autenticado.
5. O tutorial aparece após o onboarding existente. A conclusão fica registrada por navegador.
6. O PRO termina automaticamente segundo `profiles.data_expiracao`, desde que as verificações existentes de plano sejam aplicadas.

ATENÇÃO: A migração exige que as tabelas `profiles` e `trial_grants` já existam. Não inclui alterações de cobrança PIX.
