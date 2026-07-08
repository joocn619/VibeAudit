-- Allow authenticated users to insert findings for scans they own.
-- Without this, RLS blocks finding inserts from the app (anon-key) session,
-- so real scan results could not be persisted.

create policy "Users can insert findings for own scans"
  on public.findings for insert
  with check (
    exists (
      select 1 from public.scans
      where scans.id = findings.scan_id
        and scans.user_id = auth.uid()
    )
  );
