CREATE TABLE IF NOT EXISTS "music" (
    track TEXT,
    album_name TEXT,
    artist TEXT,
    release_date DATE,
    isrc TEXT,
    all_time_rank INT,
    track_score FLOAT,
    spotify_streams BIGINT,
    spotify_playlist_count INT,
    spotify_playlist_reach BIGINT,
    spotify_popularity INT,
    youtube_views BIGINT,
    youtube_likes BIGINT,
    tiktok_posts BIGINT,
    tiktok_likes BIGINT,
    tiktok_views BIGINT,
    youtube_playlist_reach BIGINT,
    apple_music_playlist_count INT,
    airplay_spins INT,
    siriusxm_spins INT,
    deezer_playlist_count INT,
    deezer_playlist_reach BIGINT,
    amazon_playlist_count INT,
    pandora_streams BIGINT,
    pandora_track_stations INT,
    soundcloud_streams BIGINT,
    shazam_counts BIGINT,
    tidal_popularity INT,
    explicit_track BOOLEAN
)