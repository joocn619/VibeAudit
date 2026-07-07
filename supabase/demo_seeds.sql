-- ============================================================================
-- VibeAudit AI - Demo Data Seeds for Buyers & Local Testing
-- ============================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard -> SQL Editor -> New Query.
-- 2. Copy and paste this entire script and click "Run".
-- 3. This script will automatically find your existing user profile (or create a fallback demo profile)
--    and populate your database with realistic AI repositories, security scans, findings, and fix PRs!
-- ============================================================================

DO $$
DECLARE
  v_user_id uuid;
  v_repo_1 uuid := gen_random_uuid();
  v_repo_2 uuid := gen_random_uuid();
  v_repo_3 uuid := gen_random_uuid();
  v_repo_4 uuid := gen_random_uuid();
  v_scan_1 uuid := gen_random_uuid();
  v_scan_2 uuid := gen_random_uuid();
  v_scan_3 uuid := gen_random_uuid();
  v_scan_4 uuid := gen_random_uuid();
  v_finding_1 uuid := gen_random_uuid();
  v_finding_2 uuid := gen_random_uuid();
  v_finding_3 uuid := gen_random_uuid();
  v_finding_4 uuid := gen_random_uuid();
  v_finding_5 uuid := gen_random_uuid();
BEGIN
  -- 1. Find the first available user in profiles table
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;

  -- If no profile exists, try to get from auth.users
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    IF v_user_id IS NOT NULL THEN
      INSERT INTO public.profiles (id, email, plan, onboarding_completed)
      VALUES (v_user_id, 'demo.founder@vibeauditai.com', 'pro', true)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- If still null (empty database without signup), we create a standalone dummy profile for testing
  IF v_user_id IS NULL THEN
    v_user_id := '00000000-0000-0000-0000-000000000001'::uuid;
    -- Temporarily disable FK checks or insert into profiles if no auth constraint blocks it
    BEGIN
      INSERT INTO public.profiles (id, email, plan, onboarding_completed)
      VALUES (v_user_id, 'demo.founder@vibeauditai.com', 'pro', true)
      ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not insert standalone profile without auth user. Please sign up once in the app first!';
      RETURN;
    END;
  END IF;

  RAISE NOTICE 'Seeding demo data for User ID: %', v_user_id;

  -- 2. Upgrade User Plan to PRO / AGENCY so they can see all features
  UPDATE public.profiles
  SET plan = 'pro', onboarding_completed = true
  WHERE id = v_user_id;

  -- 3. Clear existing demo seeds if re-running (Optional cleanup)
  DELETE FROM public.repos WHERE full_name IN (
    'cursor-ai/ecommerce-ai-store',
    'lovable-dev/llm-agent-portal',
    'v0-vercel/fintech-saas-dashboard',
    'windsurf/crypto-wallet-bot'
  ) AND user_id = v_user_id;

  -- 4. Insert 4 Realistic AI-Built Repositories
  INSERT INTO public.repos (id, user_id, github_repo_id, full_name, default_branch, installation_id, connected_at)
  VALUES
    (v_repo_1, v_user_id, 100001, 'cursor-ai/ecommerce-ai-store', 'main', 50001, now() - interval '5 days'),
    (v_repo_2, v_user_id, 100002, 'lovable-dev/llm-agent-portal', 'main', 50002, now() - interval '3 days'),
    (v_repo_3, v_user_id, 100003, 'v0-vercel/fintech-saas-dashboard', 'main', 50003, now() - interval '1 day'),
    (v_repo_4, v_user_id, 100004, 'windsurf/crypto-wallet-bot', 'main', 50004, now() - interval '2 hours');

  -- 5. Insert Completed & Running Scans with Scores
  INSERT INTO public.scans (id, repo_id, user_id, status, score, commit_sha, started_at, finished_at)
  VALUES
    (v_scan_1, v_repo_1, v_user_id, 'done', 98, 'a7f93b2c4e1d', now() - interval '4 days', now() - interval '4 days' + interval '45 seconds'),
    (v_scan_2, v_repo_2, v_user_id, 'done', 85, 'c3d82a1f9e0b', now() - interval '2 days', now() - interval '2 days' + interval '52 seconds'),
    (v_scan_3, v_repo_3, v_user_id, 'done', 72, 'e5b14c8d2a9f', now() - interval '12 hours', now() - interval '12 hours' + interval '58 seconds'),
    (v_scan_4, v_repo_4, v_user_id, 'running', 94, 'f8a21b3c6e4d', now() - interval '30 seconds', null);

  -- 6. Insert High-Impact AI Architectural Findings
  INSERT INTO public.findings (id, scan_id, check_type, severity, file_path, line, title, plain_english, fix_suggestion, cwe)
  VALUES
    (
      v_finding_1, v_scan_2, 'AI_ARCH_FLAW', 'high',
      'app/api/stripe/checkout/route.ts', 18,
      'Payment Bypass: Client-Side Price Trust',
      'The API endpoint accepts the billing plan price directly from the frontend request body without validating against Stripe server-side prices. An attacker can tamper with the payload to subscribe for $0.00.',
      'const { priceId } = await req.json(); // DO NOT trust price amount from client. Fetch price amount from Stripe server using priceId.',
      'CWE-602: Client-Side Enforcement of Server-Side Security'
    ),
    (
      v_finding_2, v_scan_2, 'AI_ARCH_FLAW', 'medium',
      'app/api/ai/generate/route.ts', 12,
      'Missing Rate Limiting & Token Exhaustion on LLM Route',
      'The OpenAI / Anthropic generation route lacks token rate-limiting or user quota verification. A malicious bot could spam this route and cause massive API bill exhaustion.',
      'import { rateLimit } from "@/lib/rate-limit"; await rateLimit(req.headers.get("x-forwarded-for"));',
      'CWE-400: Uncontrolled Resource Consumption'
    ),
    (
      v_finding_3, v_scan_3, 'SQL_INJECTION', 'critical',
      'app/api/checkout/route.ts', 42,
      'Raw SQL String Concatenation in Database Query',
      'User input from searchParams is directly concatenated into a PostgreSQL raw query string without parameter binding, allowing full database SQL injection.',
      'const query = "SELECT * FROM billing_profiles WHERE user_id = $1"; await db.query(query, [userId]);',
      'CWE-89: SQL Injection'
    ),
    (
      v_finding_4, v_scan_3, 'AUTH_BYPASS', 'high',
      'middleware.ts', 34,
      'Missing JWT Signature Verification on Admin Route',
      'The middleware checks for the presence of an admin cookie but fails to cryptographically verify the Supabase JWT secret, allowing session forgery.',
      'const { data: { user }, error } = await supabase.auth.getUser(jwtToken); if (error || !user) return NextResponse.redirect("/login");',
      'CWE-347: Improper Verification of Cryptographic Signature'
    ),
    (
      v_finding_5, v_scan_1, 'SECRET_LEAK', 'low',
      'components/footer.tsx', 88,
      'Hardcoded Public Telemetry API Key',
      'A minor analytics public tracking key is hardcoded in frontend component props instead of using environment variables.',
      'const trackingKey = process.env.NEXT_PUBLIC_ANALYTICS_ID;',
      'CWE-798: Use of Hard-coded Credentials'
    );

  -- 7. Insert Autonomous AI Pull Request Fixes
  INSERT INTO public.fix_prs (finding_id, scan_id, pr_url, status, created_at)
  VALUES
    (v_finding_1, v_scan_2, 'https://github.com/lovable-dev/llm-agent-portal/pull/14', 'merged', now() - interval '1 day'),
    (v_finding_3, v_scan_3, 'https://github.com/v0-vercel/fintech-saas-dashboard/pull/28', 'open', now() - interval '10 hours');

  -- 8. Insert Monitoring Configurations
  INSERT INTO public.monitoring_config (repo_id, enabled, alert_email, alert_discord_webhook)
  VALUES
    (v_repo_1, true, 'security@vibeauditai.com', 'https://discord.com/api/webhooks/demo/1'),
    (v_repo_2, true, 'security@vibeauditai.com', 'https://discord.com/api/webhooks/demo/2'),
    (v_repo_3, true, 'security@vibeauditai.com', null),
    (v_repo_4, false, null, null)
  ON CONFLICT (repo_id) DO UPDATE SET enabled = EXCLUDED.enabled;

  RAISE NOTICE '✅ Demo seeds successfully populated! 4 Repos, 4 Scans, 5 Findings, and 2 Fix PRs added.';
END $$;
