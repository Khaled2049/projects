package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/khaled2049/golang-api/db"
)



func readCsv( path string) ([][]string, error) {
    file, err := os.Open(path)
    if err != nil { 
        log.Fatal("Error while reading the file", err) 
    } 
    
    defer file.Close() 
    reader := csv.NewReader(file) 
    records, err := reader.ReadAll() 

    if err != nil { 
        fmt.Println("Error reading records") 
    }
        
    return records, nil
}


func parseRecord(record []string) ([]interface{}, error) {
    parsedRecord := make([]interface{}, len(record))
    for i, value := range record {
        if value == "" {
            parsedRecord[i] = nil
            continue
        }
        if i == 5 || i == 7 || i == 8 || i == 9 || i == 10 || i == 11 || i == 12 || i == 13 || i == 14 || i == 15 || i == 16 || i == 17 || i == 18 || i == 19 || i == 20 || i == 21 || i == 22 || i == 23 || i == 24 || i == 25 || i == 26 || i == 27 {
            value = strings.ReplaceAll(value, ",", "")
        }
        if i == 5 || i == 10 || i == 11 || i == 12 || i == 13 || i == 14 || i == 15 || i == 16 || i == 17 || i == 18 || i == 19 || i == 20 || i == 21 || i == 22 || i == 23 || i == 24 || i == 25 || i == 26 || i == 27 {
            num, err := strconv.ParseInt(value, 10, 64)
            if err != nil {
                return nil, fmt.Errorf("error parsing int value: %w", err)
            }
            parsedRecord[i] = num
        } else if i == 6 {
            num, err := strconv.ParseFloat(value, 64)
            if err != nil {
                return nil, fmt.Errorf("error parsing float value: %w", err)
            }
            parsedRecord[i] = num
        } else if i == 28 {
            boolValue, err := strconv.ParseBool(value)
            if err != nil {
                return nil, fmt.Errorf("error parsing boolean value: %w", err)
            }
            parsedRecord[i] = boolValue
        } else {
            parsedRecord[i] = value
        }
    }
    return parsedRecord, nil
}

func main() {
	db, err := db.NewDB()
	if err != nil {
		log.Fatalf("Could not initialize db conn %s", err)
	}

    err = createMusicTable(db.GetDB())
    if err != nil {
        log.Fatalf("Could not create music table %s", err)
    }

    records, err := readCsv("./cmd/subset_music.csv")
    if err != nil {
        log.Fatalf("Could not read csv file %s", err)
    }

    for _, record := range records {
        if len(record) != 29 {
            log.Fatalf("Unexpected number of columns in record: %d", len(record))
        }

        parsedRecord, err := parseRecord(record)
        if err != nil {
            log.Fatalf("Could not parse record %s", err)
        }

        err = insertMusicRecords(db.GetDB(), parsedRecord)

        if err != nil {
            log.Fatalf("Could not insert data %s", err)
        }
    }
}