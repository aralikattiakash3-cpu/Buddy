-- ====================================================================
-- KRISHIMITRA AI — SAMPLE SEED SCRIPT (Optional test data)
-- ====================================================================

-- This script can be executed after you have at least one user registered in auth.users.
-- Replace 'YOUR_USER_UUID_HERE' with your real auth.users id from the Supabase Auth tab.

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Grab the most recently registered user id
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Insert Initial Farming Tasks
    INSERT INTO public.farming_tasks (user_id, title, description, due_date, status)
    VALUES
      (v_user_id, 'Check drip irrigation lines in Plot B', 'Inspect emitters for blockages and ensure equal water pressure across cotton beds.', NOW() + INTERVAL '1 day', 'pending'),
      (v_user_id, 'Apply organic Neem cake to tomato plants', 'Mix 250g per plant base before soil earthing up to prevent root nematode attack.', NOW() + INTERVAL '2 days', 'in_progress'),
      (v_user_id, 'Soil testing sample submission', 'Collect composite soil sample from 5 spots at 15cm depth for KVK laboratory analysis.', NOW() + INTERVAL '5 days', 'pending')
    ON CONFLICT DO NOTHING;

    -- Insert Sample Advisory Report
    INSERT INTO public.advisory_reports (user_id, report_type, crop_name, input_data, result)
    VALUES
      (v_user_id, 'plant_doctor', 'Tomato', 
       '{"symptoms": "Yellowing lower leaves with concentric dark spots", "location": "Dharwad"}'::jsonb,
       '{"condition": "Early Blight (Alternaria solani)", "confidence": "Moderate (85%)", "recommendation": "Spray Trichoderma harzianum or copper oxychloride in cool morning hours."}'::jsonb)
    ON CONFLICT DO NOTHING;

    -- Insert Sample Notification
    INSERT INTO public.notifications (user_id, title, message, is_read)
    VALUES
      (v_user_id, 'Weather Alert: Dharwad', 'Rain showers predicted within the next 36 hours. Postpone foliar urea spraying until clear weather.', FALSE)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Sample data successfully seeded for user %', v_user_id;
  ELSE
    RAISE NOTICE 'No user found in auth.users. Please sign up a user in KrishiMitra AI first before running seed.';
  END IF;
END $$;
