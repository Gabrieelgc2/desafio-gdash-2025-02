import os, time, json
import requests
import pika
from datetime import datetime

RABBITMQ_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672/')
LAT = os.getenv('LAT', '-8.0539')
LON = os.getenv('LON', '-34.8811')
INTERVAL = int(os.getenv('INTERVAL_SEC', '3600'))
QUEUE = 'weather_logs'

def fetch_open_meteo(lat, lon):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    data = r.json()
    try:
        t = data['hourly']['temperature_2m'][0]
        h = data['hourly']['relativehumidity_2m'][0]
        w = data['hourly']['windspeed_10m'][0]
    except Exception:
        t,h,w = None,None,None
    return {
        'timestamp': datetime.utcnow().isoformat()+'Z',
        'temperature_c': t,
        'humidity': h,
        'wind_speed': w,
        'location': {'lat': lat, 'lon': lon}
    }

def publish(msg):
    params = pika.URLParameters(RABBITMQ_URL)
    conn = pika.BlockingConnection(params)
    ch = conn.channel()
    ch.queue_declare(queue=QUEUE, durable=True)
    ch.basic_publish(exchange='', routing_key=QUEUE, body=json.dumps(msg))
    conn.close()

if __name__ == '__main__':
    while True:
        try:
            payload = fetch_open_meteo(LAT, LON)
            publish(payload)
            print('published', payload)
        except Exception as e:
            print('error', e)
        time.sleep(INTERVAL)