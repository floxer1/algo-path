-- Empêcher l'énumération des avatars tout en gardant la lecture publique des fichiers via les URLs publiques.
-- Quand un bucket est public, /storage/v1/object/public/... sert les fichiers sans consulter RLS.
-- La policy SELECT ci-dessous régit l'API authentifiée et SURTOUT le listing (.list()).
-- On la restreint au propriétaire pour bloquer l'énumération des user_id par des tiers.

DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;

CREATE POLICY "Users can read their own avatar metadata"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);