package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	rabbit := os.Getenv("RABBITMQ_URL")
	if rabbit == "" {
		rabbit = "amqp://guest:guest@rabbitmq:5672/"
	}
	apiUrl := os.Getenv("API_URL")
	if apiUrl == "" {
		apiUrl = "http://backend:3000/api/weather/logs"
	}

	conn, err := amqp.Dial(rabbit)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open channel: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare("weather_logs", true, false, false, false, nil)
	if err != nil {
		log.Fatalf("Failed to declare queue: %v", err)
	}

	msgs, err := ch.Consume(q.Name, "", false, false, false, false, nil)
	if err != nil {
		log.Fatalf("Failed to register consumer: %v", err)
	}
	log.Println("Worker started - waiting for messages")
	for d := range msgs {
		var payload map[string]interface{}
		if err := json.Unmarshal(d.Body, &payload); err != nil {
			log.Println("Invalid JSON, nack:", err)
			d.Nack(false, false)
			continue
		}

		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", apiUrl, bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		client := &http.Client{Timeout: 10 * time.Second}
		resp, err := client.Do(req)
		if err != nil || resp.StatusCode >= 300 {
			log.Println("Post to API failed:", err)
			if resp != nil {
				b, _ := io.ReadAll(resp.Body)
				log.Println("API resp:", string(b))
				resp.Body.Close()
			}
			// Nack with requeue to try again
			d.Nack(false, true)
			// simple backoff
			time.Sleep(5 * time.Second)
			continue
		}
		// Ack success
		d.Ack(false)
		if resp.Body != nil {
			resp.Body.Close()
		}
	}
}
