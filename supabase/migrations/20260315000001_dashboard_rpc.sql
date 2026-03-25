CREATE OR REPLACE FUNCTION get_dashboard_data(p_user_id UUID)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result JSON;
BEGIN
  IF auth.uid() != p_user_id THEN RAISE EXCEPTION 'Access denied'; END IF;
  SELECT json_build_object(
    'profile',         (SELECT row_to_json(p) FROM profiles p WHERE p.id = p_user_id),
    'health_metrics',  (SELECT row_to_json(h) FROM health_metrics h WHERE h.user_id = p_user_id ORDER BY h.created_at DESC LIMIT 1),
    'active_goals',    (SELECT json_agg(g) FROM user_goals g WHERE g.user_id = p_user_id AND g.status = 'active'),
    'recent_workouts', (SELECT json_agg(w) FROM workout_logs w WHERE w.profile_id = p_user_id ORDER BY w.date DESC LIMIT 5)
  ) INTO result;
  RETURN result;
END; $$;
