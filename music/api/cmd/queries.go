package main

import (
	"database/sql"
	"log"
)

func createMusicTable(db *sql.DB) error {
    query := `
    CREATE TABLE IF NOT EXISTS music (
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
    );
    `

    _, err := db.Exec(query)
    return err
}

func insertMusicRecords(db *sql.DB, records []interface{}) error {
    query := `
        INSERT INTO music (
            track,
            album_name,
            artist,
            release_date,
            isrc,
            all_time_rank,
            track_score,
            spotify_streams,
            spotify_playlist_count,
            spotify_playlist_reach,
            spotify_popularity,
            youtube_views,
            youtube_likes,
            tiktok_posts,
            tiktok_likes,
            tiktok_views,
            youtube_playlist_reach,
            apple_music_playlist_count,
            airplay_spins,
            siriusxm_spins,
            deezer_playlist_count,
            deezer_playlist_reach,
            amazon_playlist_count,
            pandora_streams,
            pandora_track_stations,
            soundcloud_streams,
            shazam_counts,
            tidal_popularity,
            explicit_track
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
        `
        _, err := db.Exec(query, records...)

        if err != nil {
            log.Fatalf("Could not insert data %s", err)
        }
        return err

}