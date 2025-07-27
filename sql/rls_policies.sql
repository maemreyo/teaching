-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE multiplayer_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Units policies (read-only for students, full access for teachers)
CREATE POLICY "Everyone can view units" ON units FOR SELECT USING (true);
CREATE POLICY "Teachers can manage units" ON units FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
  )
);

-- Vocabulary policies
CREATE POLICY "Everyone can view vocabulary" ON vocabulary FOR SELECT USING (true);
CREATE POLICY "Teachers can manage vocabulary" ON vocabulary FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
  )
);

-- Grammar rules policies
CREATE POLICY "Everyone can view grammar rules" ON grammar_rules FOR SELECT USING (true);
CREATE POLICY "Teachers can manage grammar rules" ON grammar_rules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
  )
);

-- Game sessions policies
CREATE POLICY "Users can view own game sessions" ON game_sessions FOR SELECT USING (player_id = auth.uid());
CREATE POLICY "Users can create own game sessions" ON game_sessions FOR INSERT WITH CHECK (player_id = auth.uid());
CREATE POLICY "Users can update own game sessions" ON game_sessions FOR UPDATE USING (player_id = auth.uid());
CREATE POLICY "Teachers can view all game sessions" ON game_sessions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
  )
);

-- Player progress policies
CREATE POLICY "Users can view own progress" ON player_progress FOR SELECT USING (player_id = auth.uid());
CREATE POLICY "Users can update own progress" ON player_progress FOR ALL USING (player_id = auth.uid());
CREATE POLICY "Teachers can view all progress" ON player_progress FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
  )
);

-- Achievements policies
CREATE POLICY "Everyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Teachers can manage achievements" ON achievements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
  )
);

-- Player achievements policies
CREATE POLICY "Users can view own achievements" ON player_achievements FOR SELECT USING (player_id = auth.uid());
CREATE POLICY "System can create achievements" ON player_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can view all player achievements" ON player_achievements FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('teacher', 'admin')
  )
);

-- Multiplayer rooms policies
CREATE POLICY "Users can view active rooms" ON multiplayer_rooms FOR SELECT USING (
  status IN ('waiting', 'playing') OR host_id = auth.uid()
);
CREATE POLICY "Users can create rooms" ON multiplayer_rooms FOR INSERT WITH CHECK (host_id = auth.uid());
CREATE POLICY "Host can update room" ON multiplayer_rooms FOR UPDATE USING (host_id = auth.uid());
CREATE POLICY "Host can delete room" ON multiplayer_rooms FOR DELETE USING (host_id = auth.uid());

-- Room participants policies
CREATE POLICY "Users can view room participants" ON room_participants FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM multiplayer_rooms 
    WHERE multiplayer_rooms.id = room_participants.room_id 
    AND (multiplayer_rooms.host_id = auth.uid() OR room_participants.player_id = auth.uid())
  )
);
CREATE POLICY "Users can join rooms" ON room_participants FOR INSERT WITH CHECK (player_id = auth.uid());
CREATE POLICY "Users can update own participation" ON room_participants FOR UPDATE USING (player_id = auth.uid());
CREATE POLICY "Users can leave rooms" ON room_participants FOR DELETE USING (player_id = auth.uid());
CREATE POLICY "Host can manage participants" ON room_participants FOR ALL USING (
  EXISTS (
    SELECT 1 FROM multiplayer_rooms 
    WHERE multiplayer_rooms.id = room_participants.room_id 
    AND multiplayer_rooms.host_id = auth.uid()
  )
);