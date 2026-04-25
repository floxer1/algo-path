-- Restore public bucket (needed for getPublicUrl on avatars)
UPDATE storage.buckets SET public = true WHERE id = 'avatars';

-- Remove the broad SELECT policy that allowed enumerating files in the bucket
DROP POLICY IF EXISTS "Public avatar read" ON storage.objects;
-- Note: with public=true, individual objects are still readable via their public URL,
-- but the storage API list endpoint requires a SELECT policy to return file lists.
-- Without a SELECT policy, anonymous clients cannot enumerate avatar filenames.