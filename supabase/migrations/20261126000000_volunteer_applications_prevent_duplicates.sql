-- Stops the same person piling up unresolved applications for the same
-- position (or several spontaneous applications at once): at most one
-- "pending" application per (email, position) pair — NULL position_id
-- (spontaneous applications) is normalized via coalesce so repeated
-- spontaneous submissions are caught too, since a unique index otherwise
-- treats every NULL as distinct from every other NULL. Once an admin moves
-- an application to reviewed/contacted/rejected, the same person is free
-- to apply again.
CREATE UNIQUE INDEX volunteer_applications_one_pending_per_email_position
  ON public.volunteer_applications (lower(applicant_email), coalesce(position_id::text, 'spontaneous'))
  WHERE (status = 'pending');

-- Closes the same gap already fixed on donations: nothing stopped a direct
-- API call from inserting an application pre-marked as anything other than
-- "pending". Public submissions must now always start pending.
DROP POLICY "Public can submit volunteer applications" ON public.volunteer_applications;
CREATE POLICY "Public can submit volunteer applications" ON public.volunteer_applications
  FOR INSERT WITH CHECK (status = 'pending');
