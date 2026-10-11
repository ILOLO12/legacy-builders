-- The publish edge function calls the Data API with the public key and the
-- log table has no anon read policy, so the retry pass cannot select rows
-- itself. This security-definer function hands it the failed rows and bumps
-- their attempt count in one step, without opening the log table to anon reads.
CREATE OR REPLACE FUNCTION public.claim_failed_publishes(_max_attempts integer DEFAULT 3)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH picked AS (
    SELECT l.id
    FROM public.social_publish_log l
    WHERE l.status = 'failed' AND l.attempt_count < _max_attempts
    ORDER BY l.created_at
    LIMIT 20
  ),
  claimed AS (
    UPDATE public.social_publish_log l
    SET attempt_count = l.attempt_count + 1, updated_at = now()
    FROM picked p
    WHERE l.id = p.id
    RETURNING l.id, l.article_id, l.platform, l.attempt_count
  )
  SELECT coalesce(
    json_agg(
      json_build_object(
        'id', c.id,
        'platform', c.platform,
        'attempt_count', c.attempt_count,
        'articles', json_build_object(
          'title', a.title,
          'title_fr', a.title_fr,
          'excerpt', a.excerpt,
          'excerpt_fr', a.excerpt_fr,
          'slug', a.slug,
          'image_url', a.image_url
        )
      ) ORDER BY c.id
    ),
    '[]'::json
  )
  FROM claimed c
  JOIN public.articles a ON a.id = c.article_id;
$$;
GRANT EXECUTE ON FUNCTION public.claim_failed_publishes(integer) TO anon, authenticated, service_role;